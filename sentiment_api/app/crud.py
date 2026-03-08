from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import Optional, List

from . import models, schemas
from .auth import hash_password


# ── User CRUD ──────────────────────────────────────────────────────────────────

def get_user_by_email(db: Session, email: str) -> Optional[models.User]:
    return db.query(models.User).filter(models.User.email == email).first()


def get_user_by_id(db: Session, user_id: int) -> Optional[models.User]:
    return db.query(models.User).filter(models.User.id == user_id).first()


def create_user(db: Session, user_in: schemas.UserCreate) -> models.User:
    db_user = models.User(
        email=user_in.email,
        hashed_password=hash_password(user_in.password),
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


# ── Prediction CRUD ────────────────────────────────────────────────────────────

def create_prediction(
    db: Session,
    user_id: int,
    result: schemas.PredictionOutput,
) -> models.Prediction:
    db_pred = models.Prediction(
        user_id=user_id,
        original_text=result.original_text,
        processed_text=result.processed_text,
        sentiment=result.sentiment,
        class_id=result.class_id,
        confidence=result.confidence,
    )
    db.add(db_pred)
    db.commit()
    db.refresh(db_pred)
    return db_pred


def get_user_history(
    db: Session,
    user_id: int,
    page: int = 1,
    page_size: int = 20,
) -> tuple[int, List[models.Prediction]]:
    q = db.query(models.Prediction).filter(models.Prediction.user_id == user_id)
    total = q.count()
    items = (
        q.order_by(models.Prediction.timestamp.desc())
        .offset((page - 1) * page_size)
        .limit(page_size)
        .all()
    )
    return total, items


def get_sentiment_stats(db: Session, user_id: int) -> schemas.SentimentStats:
    rows = (
        db.query(models.Prediction.sentiment, func.count(models.Prediction.id))
        .filter(models.Prediction.user_id == user_id)
        .group_by(models.Prediction.sentiment)
        .all()
    )
    counts = {r[0]: r[1] for r in rows}
    total = sum(counts.values())
    return schemas.SentimentStats(
        positive=counts.get("positive", 0),
        negative=counts.get("negative", 0),
        neutral=counts.get("neutral", 0),
        irrelevant=counts.get("irrelevant", 0),
        total=total,
    )