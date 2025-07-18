from fastapi import APIRouter
from fastapi import File, UploadFile
from fastapi import HTTPException
from starlette.responses import StreamingResponse
import pandas as pd
import io
from api.schemas import TextInput, SentimentResponse
from model.predict import predict_sentiment

router = APIRouter()

@router.post("/predict", response_model=SentimentResponse)
def predict(input_data: TextInput):
    sentiment, confidence = predict_sentiment(input_data.text)
    return {"sentiment": sentiment, "confidence": confidence}

@router.post("/predict_file")
async def predict_from_file(file: UploadFile = File(...)):
    contents = await file.read()
    extension = file.filename.split(".")[-1].lower()
    
    try:
        # Load file pakai pandas
        if extension == "csv":
            df = pd.read_csv(io.BytesIO(contents))
            if 'text' not in df.columns:
                raise HTTPException(status_code=400, detail="CSV file must have a 'text' column.")
            df = df.dropna(subset=["text"]).copy()  # <== FIX ini penting
            texts = df['text'].tolist()
        
        elif extension == "txt":
            lines = contents.decode("utf-8").strip().splitlines()
            texts = [line.strip() for line in lines if line.strip()]
            df = pd.DataFrame({"text": texts})  # Buat DataFrame dari txt
        
        else:
            raise HTTPException(status_code=400, detail="Only .csv or .txt files are supported.")
        
        # Prediksi semua baris
        sentiments = []
        confidences = []
        for text in texts:
            sentiment, confidence = predict_sentiment(text)
            sentiments.append(sentiment)
            confidences.append(confidence)

        df["sentiment"] = sentiments
        df["confidence"] = confidences
        
        # Simpan ke buffer CSV
        output = io.StringIO()
        df.to_csv(output, index=False)
        output.seek(0)

        # Return CSV sebagai StreamingResponse
        return StreamingResponse(
            output,
            media_type="text/csv",
            headers={"Content-Disposition": "attachment; filename=sentiment_results.csv"}
        )
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))