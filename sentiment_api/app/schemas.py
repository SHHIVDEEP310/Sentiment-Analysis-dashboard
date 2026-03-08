from pydantic import BaseModel, EmailStr, Field
from typing import Optional, Union, List
from datetime import datetime


# ── Auth Schemas ──────────────────────────────────────────────────────────────

class UserCreate(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=6, max_length=128)


class UserOut(BaseModel):
    id: int
    email: EmailStr
    created_at: datetime

    model_config = {"from_attributes": True}


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


class LoginInput(BaseModel):
    email: EmailStr
    password: str


# ── Prediction Schemas ─────────────────────────────────────────────────────────

class PredictionInput(BaseModel):
    text: Union[str, List[str]] = Field(
        ...,
        description="Single tweet/paragraph string or list of strings",
    )

    @property
    def as_list(self) -> List[str]:
        if isinstance(self.text, str):
            return [self.text]
        return self.text


class PredictionOutput(BaseModel):
    original_text: str
    processed_text: str
    sentiment: str
    class_id: int
    confidence: float


class BatchPredictionOutput(BaseModel):
    results: List[PredictionOutput]
    formatted_lines: List[str]   # e.g. "[POSITIVE] Great day!"


# ── History Schemas ────────────────────────────────────────────────────────────

class PredictionRecord(BaseModel):
    id: int
    original_text: str
    processed_text: str
    sentiment: str
    class_id: int
    confidence: float
    timestamp: datetime

    model_config = {"from_attributes": True}


class HistoryResponse(BaseModel):
    total: int
    page: int
    page_size: int
    items: List[PredictionRecord]


class SentimentStats(BaseModel):
    positive: int
    negative: int
    neutral: int
    irrelevant: int
    total: int