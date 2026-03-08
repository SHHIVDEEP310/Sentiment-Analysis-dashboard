import os
import sys

# Check paths
print("=" * 50)
print(f"CWD: {os.getcwd()}")
print(f"Script location: {os.path.abspath(__file__)}")

model_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "model")
print(f"Model path: {model_path}")
print(f"Model exists: {os.path.exists(model_path)}")

if os.path.exists(model_path):
    files = os.listdir(model_path)
    print(f"Files in model/: {files}")
else:
    print("ERROR: model/ folder NOT FOUND")
    sys.exit(1)

# Try loading
print("=" * 50)
print("Trying to load tokenizer...")
try:
    from transformers import AutoTokenizer
    tok = AutoTokenizer.from_pretrained(model_path, use_fast=False)
    print(f"Tokenizer OK: {type(tok)}")
except Exception as e:
    print(f"Tokenizer FAILED: {e}")

print("Trying to load model...")
try:
    from transformers import AutoModelForSequenceClassification
    model = AutoModelForSequenceClassification.from_pretrained(model_path)
    print(f"Model OK: {type(model)}")
except Exception as e:
    print(f"Model FAILED: {e}")