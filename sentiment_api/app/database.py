import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

# Switch DATABASE_URL env var for PostgreSQL/MySQL in production:
# e.g. postgresql://user:pass@host/dbname
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./sentiment.db")

# SQLite needs check_same_thread=False for multi-threaded FastAPI
connect_args = {"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {}

engine = create_engine(DATABASE_URL, connect_args=connect_args)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()