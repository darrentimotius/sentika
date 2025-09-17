<div align="center">
	<h1>Sentika</h1>
	<p><strong>Real‑time Indonesian Sentiment Analysis powered by IndoBERT, FastAPI, and Next.js</strong></p>
	<p>
		<a href="#features">Features</a> •
		<a href="#architecture">Architecture</a> •
		<a href="#quick-start">Quick Start</a> •
		<a href="#api-reference">API</a> •
		<a href="#model">Model</a> •
		<a href="#training">Training</a> •
		<a href="#license">License</a>
	</p>
</div>

---

## Overview
Sentika is a production‑ready Indonesian sentiment analysis application. It provides:
1. Single text inference (positive / neutral / negative) with model confidence.
2. Batch processing via CSV/TXT upload (auto returns enriched CSV).
3. Clean dark UI (Next.js 15 + React 19) with responsive design and keyboard shortcuts.
4. FastAPI backend serving a fine‑tuned IndoBERT sequence classification model.

The project is structured for clarity between: frontend (UI), backend (API), model (inference), and training utilities. All code is MIT licensed.

## Features
- 🔍 Real‑time sentiment prediction (REST endpoints)
- 📁 Batch file upload (.csv with `text` column or plain .txt lines)
- 📊 Confidence score (softmax probability)
- 🧹 Text preprocessing: case folding, URL removal, collapsing whitespace, repeated char & emoji filtering
- 💾 Deterministic CPU inference (model loaded once and reused)
- ⌨️ UX niceties: Cmd/Ctrl + Enter submit, copy result, character limit bar
- 🛡️ CORS enabled (open by default — adjust for production)
- 🌓 Unified dark theme (forced)

## Architecture
```
frontend/ (Next.js 15, React 19, Tailwind CSS 4)
	└── src/app/ (App Router pages & layout)
backend/
	├── api/
	│   ├── main.py        (FastAPI app + CORS)
	│   ├── routes.py      (Predict endpoints)
	│   ├── schemas.py     (Pydantic models)
	│   └── utils.py       (Preprocessing helpers)
	└── model/
			├── predict.py     (Load IndoBERT + inference)
			└── final_model.pt (Fine‑tuned weights)
model_training/          (Notebooks & training utilities)
data/                    (Datasets & processed splits)
```

## Technology Stack
| Layer      | Tech | Version* |
|------------|------|----------|
| Frontend   | Next.js | 15.4.1 |
|            | React | 19.1.0 |
| Styling    | Tailwind CSS | 4.x |
| Backend API| FastAPI | ^0.0.11 |
| Model      | transformers (Hugging Face) | ~4.x |
| Runtime    | Python | 3.10+ recommended |
| Inference  | PyTorch | 2.x |

## Quick Start
### 1. Backend (FastAPI)
Create & activate a virtual environment, then install dependencies (example):
```bash
python -m venv .venv
source .venv/bin/activate
pip install fastapi uvicorn transformers torch pandas
```

Run API:
```bash
uvicorn backend.api.main:app --host 0.0.0.0 --port 8000 --reload
```

Test health (example predict):
```bash
curl -X POST http://localhost:8000/predict \
	-H 'Content-Type: application/json' \
	-d '{"text":"Produk ini kualitasnya bagus sekali"}'
```

Expected JSON:
```json
{ "sentiment": "positive", "confidence": 0.93 }
```

### 2. Frontend (Next.js)
```bash
cd frontend
npm install
npm run dev
```
Visit: http://localhost:3000

### 3. Batch Prediction (CLI Example)
```bash
curl -X POST http://localhost:8000/predict_file \
	-F "file=@examples/sample.csv"
```
Returns: streamed CSV with added `sentiment,confidence` columns.

### Example Batch Input / Output
Input CSV (`reviews.csv`):
```csv
text
Produk ini kualitasnya bagus sekali
Pengiriman lambat dan packing jelek
Biasa saja tidak terlalu istimewa
```

Returned CSV:
```csv
text,sentiment,confidence
Produk ini kualitasnya bagus sekali,positive,0.9342
Pengiriman lambat dan packing jelek,negative,0.8711
Biasa saja tidak terlalu istimewa,neutral,0.6527
```

### CSV Requirements
- Must contain a header row with a `text` column
- Empty lines or missing text are dropped
- TXT files: each non-empty line is treated as one record

## API Reference

### POST /predict
Request:
```json
{ "text": "saya suka kualitas produk ini" }
```
Response:
```json
{ "sentiment": "positive", "confidence": 0.94 }
```

### POST /predict_file
Multipart Form-Data:
`file`: .csv or .txt

Responses:
- 200: CSV download (columns: original + sentiment + confidence)
- 400: Unsupported extension / missing `text` column
- 500: Internal processing error

## Model
- Base: `indobenchmark/indobert-base-p1`
- Task: 3‑class sentiment (positive / neutral / negative)
- Output: Softmax over 3 logits, confidence = max probability
- Preprocessing: see `backend/api/utils.py`
- Device: CPU (model loaded once at import time)

### Inference Flow
1. Clean text
2. Tokenize (max_length=512, truncation, padding)
3. Forward pass (BertForSequenceClassification)
4. Softmax + argmax
5. Return label + probability

## Training
Notebooks and scripts under `model_training/` illustrate data preparation and fine‑tuning (e.g., SMSA / combined datasets). Typical workflow:
1. Load and clean raw datasets
2. Balance / upsample if needed
3. Tokenize with IndoBERT tokenizer
4. Fine‑tune with cross entropy loss
5. Export weights to `backend/model/final_model.pt`

You can adapt these notebooks to retrain on new domains (e.g., e‑commerce reviews).

## Deployment Notes
- Set proper CORS restrictions before public release.
- Consider adding a `/health` endpoint for uptime checks.
- Add `requirements.txt` / `poetry.lock` for reproducible backend installs.
- For higher throughput: enable GPU (swap `model = model.cpu()` to `.to(device)`), add async batching, or use TorchScript / ONNX.
- Cache identical requests if traffic contains repetitions.

## Security & Hardening (Recommendations)
- Restrict allowed file size for `/predict_file`.
- Validate text length server-side (prevent extremely large inputs).
- Pin exact library versions to mitigate supply chain risks.
- Add rate limiting (e.g., behind a reverse proxy) if exposed publicly.

## Roadmap (Optional Ideas)
- Highlight token-level sentiment explanation
- WebSocket streaming for partial token scoring
- Auth + usage quotas
- Multi-language ensemble (add mBERT / XLM-R switch)
- Docker images (frontend + backend)

## Contributing
Contributions, issues, and feature requests are welcome. For large changes, open a discussion first to align on direction.

## License
Distributed under the MIT License. See [`LICENSE`](./LICENSE) for full text.

## Acknowledgements
- IndoBERT by IndoBenchmark
- Hugging Face Transformers
- FastAPI & Pydantic
- Tailwind CSS

---
<div align="center">
	<sub>© 2025 Darren Timotius Raphael. Released under MIT.</sub>
</div>
