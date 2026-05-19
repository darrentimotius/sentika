from transformers import BertForSequenceClassification, BertConfig, BertTokenizer
import torch
from torch.utils.data import DataLoader
from torch import optim
import torch.nn.functional as F
from utils import preprocess_text

# Load Tokenizer and Config
NUM_LABELS = 3  # Assuming three sentiment classes: positive, neutral, negative
tokenizer = BertTokenizer.from_pretrained('indobenchmark/indobert-base-p1')
config = BertConfig.from_pretrained('indobenchmark/indobert-base-p1')
config.num_labels = NUM_LABELS

# Instantiate model
model = BertForSequenceClassification.from_pretrained('indobenchmark/indobert-base-p1', config=config)

optimizer = optim.Adam(model.parameters(), lr=5e-6)
model = model.cpu()

model.load_state_dict(torch.load("final_model.pt", map_location='cpu'))
model.eval()
torch.set_grad_enabled(False)

w2i = {'positive': 0, 'neutral': 1, 'negative': 2}
i2w = {0: 'positive', 1: 'neutral', 2: 'negative'}

def predict_sentiment(text: str) -> str:
    cleaned_text = preprocess_text(text)
    inputs = tokenizer(cleaned_text, return_tensors="pt", truncation=True, padding=True, max_length=512)
    inputs = {key: value.cpu() for key, value in inputs.items()}  # Move to CPU
    outputs = model(**inputs)
    logits = outputs.logits
    probabilities = F.softmax(logits, dim=1)
    predicted_class = torch.argmax(probabilities, dim=1).item()
    confidence = probabilities[0][predicted_class].item()
    return i2w[predicted_class], confidence