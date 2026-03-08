"""
ml_pipeline.py
Full preprocessing + inference pipeline for fine-tuned RoBERTa model.

Pipeline order:
  1. Emoji → text tokens (emoji.demojize)
  2. Text cleaning (lowercase, URL/mention/hashtag removal, whitespace normalization)
  3. Tokenisation via RobertaTokenizer (loaded from roberta-base directly)
  4. Model inference via RobertaForSequenceClassification (your fine-tuned weights)
  5. Softmax → class_id + confidence
"""

import re
import os
import logging
from typing import List, Tuple

import emoji
import torch
from transformers import RobertaTokenizer, RobertaForSequenceClassification

logger = logging.getLogger(__name__)

# ── Label mapping ──────────────────────────────────────────────────────────────
ID2LABEL = {
    0: "negative",
    1: "neutral",
    2: "positive",
    3: "irrelevant",
}

# ── Globals (loaded once at startup) ──────────────────────────────────────────
_tokenizer = None
_model     = None
_device    = None

# ── Absolute model path ────────────────────────────────────────────────────────
# Resolves to sentiment_api/model/ regardless of where uvicorn is launched from
BASE_DIR   = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODEL_PATH = os.path.join(BASE_DIR, "model")
MAX_LENGTH = 512


# ══════════════════════════════════════════════════════════════════════════════
#  MODEL LOADING
# ══════════════════════════════════════════════════════════════════════════════

def load_model(model_path: str = MODEL_PATH) -> None:
    """
    Load RoBERTa tokenizer + fine-tuned model.
    - Tokenizer  : loaded from 'roberta-base' directly (bypasses broken tokenizer_config.json)
    - Model      : loaded from local model/ folder (your fine-tuned weights)
    Called once at FastAPI startup via lifespan event.
    """
    global _tokenizer, _model, _device

    # ── Path validation ────────────────────────────────────────────────────────
    logger.info("=" * 55)
    logger.info(f"Model path     : {model_path}")
    logger.info(f"Path exists    : {os.path.exists(model_path)}")

    if not os.path.exists(model_path):
        raise FileNotFoundError(
            f"Model folder not found: {model_path}\n"
            f"Place your HuggingFace model files inside sentiment_api/model/"
        )

    files = os.listdir(model_path)
    logger.info(f"Files in model/: {files}")

    # ── Required file check ────────────────────────────────────────────────────
    required = ["config.json", "model.safetensors"]
    missing  = [f for f in required if f not in files]
    if missing:
        raise FileNotFoundError(f"Missing required model files: {missing}")

    # ── Device setup ───────────────────────────────────────────────────────────
    _device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    logger.info(f"Device         : {_device}")

    if _device.type == "cpu":
        threads = os.cpu_count() or 4
        torch.set_num_threads(threads)
        logger.info(f"CPU threads    : {torch.get_num_threads()}")

    # ── Load tokenizer from roberta-base ──────────────────────────────────────
    # Bypasses broken tokenizer_config.json in model/ folder completely
    logger.info("Loading tokenizer from roberta-base (HuggingFace)...")
    try:
        _tokenizer = RobertaTokenizer.from_pretrained(
            "roberta-base",
            use_fast=False,
        )
        logger.info(f"Tokenizer OK   : {type(_tokenizer).__name__}")
    except Exception as e:
        raise RuntimeError(f"Tokenizer load failed: {e}")

    # ── Load YOUR fine-tuned model weights from local model/ ──────────────────
    logger.info("Loading fine-tuned model weights from local model/...")
    try:
        _model = RobertaForSequenceClassification.from_pretrained(model_path)
        _model.to(_device)
        _model.eval()
        logger.info(f"Model OK       : {type(_model).__name__}")
        logger.info(f"Num labels     : {_model.config.num_labels}")
    except Exception as e:
        raise RuntimeError(f"Model load failed: {e}")

    logger.info("=" * 55)
    logger.info("Fine-tuned RoBERTa loaded and ready for inference.")
    logger.info("=" * 55)


def is_model_loaded() -> bool:
    """Returns True if both tokenizer and model are loaded."""
    return _model is not None and _tokenizer is not None


# ══════════════════════════════════════════════════════════════════════════════
#  PREPROCESSING PIPELINE
# ══════════════════════════════════════════════════════════════════════════════

def convert_emojis(text: str) -> str:
    """
    Convert emojis to descriptive text tokens so model understands sentiment.
    e.g. 😀 → :grinning_face:
    """
    return emoji.demojize(text, delimiters=(" :", ": "))


# Compiled regex patterns for speed
_URL_RE     = re.compile(r"https?://\S+|www\.\S+")
_MENTION_RE = re.compile(r"@\w+")
_HASHTAG_RE = re.compile(r"#\w+")
_PUNCT_RE   = re.compile(r"[^\w\s.,!?'\-]")
_SPACE_RE   = re.compile(r"\s+")


def clean_text(text: str) -> str:
    """
    Clean raw text:
    - Remove URLs
    - Remove @mentions
    - Remove #hashtags
    - Lowercase
    - Remove special punctuation (keep . , ! ? ' -)
    - Normalize whitespace
    """
    text = _URL_RE.sub("", text)
    text = _MENTION_RE.sub("", text)
    text = _HASHTAG_RE.sub("", text)
    text = text.lower()
    text = _PUNCT_RE.sub("", text)
    text = _SPACE_RE.sub(" ", text).strip()
    return text


def preprocess(text: str) -> str:
    """
    Full preprocessing:
    Step 1 → convert emojis to text
    Step 2 → clean text
    """
    text = convert_emojis(text)
    text = clean_text(text)
    return text


# ══════════════════════════════════════════════════════════════════════════════
#  INFERENCE
# ══════════════════════════════════════════════════════════════════════════════

@torch.no_grad()
def _infer_batch(texts: List[str]) -> List[Tuple[int, float]]:
    """
    Tokenise batch of preprocessed strings and run model inference.
    Returns list of (class_id, confidence) tuples.
    """
    encoding = _tokenizer(
        texts,
        padding=True,
        truncation=True,
        max_length=MAX_LENGTH,
        return_tensors="pt",
    )

    # Move all tensors to correct device (cpu or cuda)
    encoding = {k: v.to(_device) for k, v in encoding.items()}

    outputs     = _model(**encoding)
    probs       = torch.softmax(outputs.logits, dim=-1)  # shape: (batch, num_labels)
    class_ids   = probs.argmax(dim=-1).tolist()
    confidences = probs.max(dim=-1).values.tolist()

    return list(zip(class_ids, confidences))


# ══════════════════════════════════════════════════════════════════════════════
#  PUBLIC API
# ══════════════════════════════════════════════════════════════════════════════

def predict(texts: List[str]) -> List[dict]:
    """
    Full pipeline for a list of raw input strings.

    Args:
        texts: List of raw tweet/paragraph strings.

    Returns:
        List of dicts:
            original_text  : raw input as received
            processed_text : after emoji conversion + cleaning
            sentiment      : positive / negative / neutral / irrelevant
            class_id       : 0=negative / 1=neutral / 2=positive / 3=irrelevant
            confidence     : float between 0.0 and 1.0
    """
    if not is_model_loaded():
        raise RuntimeError(
            "Model is not loaded. "
            "Ensure load_model() completed successfully at startup."
        )

    # Step 1: Preprocess all texts
    processed = [preprocess(t) for t in texts]

    # Step 2: Fallback for empty strings after cleaning
    safe_processed = [p if p.strip() else "<empty>" for p in processed]

    # Step 3: Run batch inference
    infer_results = _infer_batch(safe_processed)

    # Step 4: Build output list
    results = []
    for raw, proc, (class_id, confidence) in zip(texts, processed, infer_results):
        results.append({
            "original_text" : raw,
            "processed_text": proc,
            "sentiment"     : ID2LABEL.get(class_id, "neutral"),
            "class_id"      : class_id,
            "confidence"    : round(confidence, 4),
        })

    return results