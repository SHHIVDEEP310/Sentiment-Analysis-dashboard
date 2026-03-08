Sentiment Analysis API
FastAPI backend serving a locally fine-tuned Hugging Face model for sentiment classification.
Quick Setup
bashcd sentiment_api
python -m venv .venv
source .venv/bin/activate       # Windows: .venv\Scripts\activate
pip install -r requirements.txt
Model Placement
Place your fine-tuned HuggingFace model folder contents at ./model/:
sentiment_api/
└── model/
    ├── config.json
    ├── pytorch_model.bin        # or model.safetensors
    ├── tokenizer.json
    ├── tokenizer_config.json
    ├── vocab.txt                # or merges.txt for BPE models
    └── special_tokens_map.json
The model must be a AutoModelForSequenceClassification with 4 labels:

0 → negative
1 → neutral
2 → positive
3 → irrelevant

Run
bash# From sentiment_api/ directory
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
Swagger UI: http://localhost:8000/docs
ReDoc:       http://localhost:8000/redoc
Environment Variables
VariableDefaultDescriptionSECRET_KEYchange-me-in-production-...JWT signing secretDATABASE_URLsqlite:///./sentiment.dbSQLAlchemy DB URL
For PostgreSQL: DATABASE_URL=postgresql://user:pass@host:5432/dbname
cURL Examples
Register
bashcurl -X POST http://localhost:8000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email": "ml@example.com", "password": "secret123"}'
Login
bashcurl -X POST http://localhost:8000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "ml@example.com", "password": "secret123"}'
# → {"access_token": "<JWT>", "token_type": "bearer"}
Predict (single)
bashTOKEN=<your_jwt_here>
curl -X POST http://localhost:8000/predict \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"text": "I absolutely love this product! 😀"}'
Predict (batch)
bashcurl -X POST http://localhost:8000/predict \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"text": ["Great product!", "Terrible experience.", "Just a normal day."]}'
History
bashcurl http://localhost:8000/history?page=1&page_size=10 \
  -H "Authorization: Bearer $TOKEN"
Sentiment Stats (pie chart data)
bashcurl http://localhost:8000/stats \
  -H "Authorization: Bearer $TOKEN"
Deployment
Docker:
dockerfileFROM python:3.11-slim
WORKDIR /app
COPY . .
RUN pip install -r requirements.txt
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
Render / Railway: Set DATABASE_URL and SECRET_KEY as env vars, deploy from repo root.