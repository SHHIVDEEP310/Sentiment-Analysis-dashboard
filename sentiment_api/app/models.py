from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from datetime import datetime

Base = declarative_base()


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    predictions = relationship("Prediction", back_populates="owner", cascade="all, delete")


class Prediction(Base):
    __tablename__ = "predictions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    original_text = Column(Text, nullable=False)
    processed_text = Column(Text, nullable=False)
    sentiment = Column(String(20), nullable=False)      # positive/negative/neutral/irrelevant
    class_id = Column(Integer, nullable=False)          # 0,1,2,3
    confidence = Column(Float, nullable=False)
    timestamp = Column(DateTime, default=datetime.utcnow)

    owner = relationship("User", back_populates="predictions")