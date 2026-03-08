from transformers import RobertaTokenizer
import os

print("Downloading base RoBERTa tokenizer files...")
tok = RobertaTokenizer.from_pretrained("roberta-base")
tok.save_pretrained("./model")
print("Done. Files in model/:")
print(os.listdir("./model"))