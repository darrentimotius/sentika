FROM python:3.13

# Set workdir ke /app
WORKDIR /app

# Copy hanya folder app dan file requirements.txt
COPY ./app /app
COPY requirements.txt .

# Install dependencies
RUN pip install --no-cache-dir --upgrade -r requirements.txt

EXPOSE 80

# Jalankan app dari /app
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "80"]
