"""
main.py – FastAPI entry point.
Registers all routes: /auth/*, /predict, /history, /stats
"""

import logging
from contextlib import asynccontextmanager
from typing import List

from fastapi import FastAPI, Depends, HTTPException, status, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from .database import engine, get_db
from .models import Base
from . import schemas, crud, auth, ml_pipeline

from fastapi.middleware.cors import CORSMiddleware

# ── Logging ────────────────────────────────────────────────────────────────────
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)s | %(name)s | %(message)s",
)
logger = logging.getLogger(__name__)


# ── Lifespan: DB init + model load ────────────────────────────────────────────
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Create tables
    Base.metadata.create_all(bind=engine)
    logger.info("Database tables created / verified.")

    # Load HuggingFace model once
    try:
        ml_pipeline.load_model("./model")
    except Exception as e:
        logger.error(f"Failed to load ML model: {e}")
        logger.warning("Server will start but /predict will return 503 until model is available.")

    yield
    # shutdown: nothing to clean up for now


# ── App ────────────────────────────────────────────────────────────────────────
app = FastAPI(
    title="Sentiment Analysis API",
    description="Fine-tuned HuggingFace model for tweet/paragraph sentiment classification.",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
    expose_headers=["*"],
    max_age=3600,
)


# ══════════════════════════════════════════════════════════════════════════════
#  AUTH ROUTES
# ══════════════════════════════════════════════════════════════════════════════

@app.post("/auth/register", response_model=schemas.UserOut, status_code=201)
def register(user_in: schemas.UserCreate, db: Session = Depends(get_db)):
    """Register a new user. Returns user record (no password)."""
    if crud.get_user_by_email(db, user_in.email):
        raise HTTPException(status_code=400, detail="Email already registered.")
    user = crud.create_user(db, user_in)
    logger.info(f"New user registered: {user.email} (id={user.id})")
    return user


@app.post("/auth/login", response_model=schemas.TokenResponse)
def login(login_in: schemas.LoginInput, db: Session = Depends(get_db)):
    """Authenticate user and return a 24-hour JWT bearer token."""
    user = crud.get_user_by_email(db, login_in.email)
    if not user or not auth.verify_password(login_in.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid email or password.")

    token = auth.create_access_token({"sub": str(user.id)})
    logger.info(f"User logged in: {user.email}")
    return schemas.TokenResponse(access_token=token)


# ══════════════════════════════════════════════════════════════════════════════
#  PREDICT ROUTE (protected)
# ══════════════════════════════════════════════════════════════════════════════

@app.post("/predict", response_model=schemas.BatchPredictionOutput)
def predict(
    payload: schemas.PredictionInput,
    current_user=Depends(auth.get_current_user),
    db: Session = Depends(get_db),
):
    """
    Run sentiment analysis on one or more texts.
    - Single string   → wrapped in a list, returns BatchPredictionOutput with 1 result.
    - List of strings → processed in batch.
    """
    if not ml_pipeline.is_model_loaded():
        raise HTTPException(status_code=503, detail="ML model not loaded yet. Try again shortly.")

    texts = payload.as_list

    # Input guard
    for t in texts:
        if len(t) > 5000:
            raise HTTPException(status_code=422, detail="Each text must be ≤ 5000 characters.")

    raw_results = ml_pipeline.predict(texts)

    output_items: List[schemas.PredictionOutput] = []
    formatted_lines: List[str] = []

    for r in raw_results:
        item = schemas.PredictionOutput(**r)
        output_items.append(item)
        formatted_lines.append(f"[{item.sentiment.upper()}] {item.original_text}")

        # Persist every prediction
        crud.create_prediction(db, current_user.id, item)

    logger.info(
        f"User {current_user.email} predicted {len(output_items)} text(s). "
        f"Sentiments: {[i.sentiment for i in output_items]}"
    )

    return schemas.BatchPredictionOutput(results=output_items, formatted_lines=formatted_lines)


# ══════════════════════════════════════════════════════════════════════════════
#  HISTORY ROUTE (protected)
# ══════════════════════════════════════════════════════════════════════════════

@app.get("/history", response_model=schemas.HistoryResponse)
def get_history(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    current_user=Depends(auth.get_current_user),
    db: Session = Depends(get_db),
):
    """Paginated history of this user's predictions, newest first."""
    total, items = crud.get_user_history(db, current_user.id, page, page_size)
    return schemas.HistoryResponse(
        total=total,
        page=page,
        page_size=page_size,
        items=[schemas.PredictionRecord.model_validate(i) for i in items],
    )


# ══════════════════════════════════════════════════════════════════════════════
#  STATS ROUTE (protected)
# ══════════════════════════════════════════════════════════════════════════════

@app.get("/stats", response_model=schemas.SentimentStats)
def get_stats(
    current_user=Depends(auth.get_current_user),
    db: Session = Depends(get_db),
):
    """Aggregate sentiment distribution for the current user (for pie chart)."""
    return crud.get_sentiment_stats(db, current_user.id)


# ── Health check ───────────────────────────────────────────────────────────────
@app.get("/health")
def health():
    return {
        "status": "ok",
        "model_loaded": ml_pipeline.is_model_loaded(),
    }