from fastapi import FastAPI
from schemas.learning import Answers
from ml.predictor import predict_learning_style
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from groq import Groq
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = FastAPI()

# ✅ CORS CONFIG
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:8080",
        "http://127.0.0.1:8080",
        "http://192.168.29.193:8080"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ GET API KEY
api_key = os.getenv("GROQ_API_KEY")

if not api_key:
    raise ValueError("❌ GROQ_API_KEY not found in .env file")

# ✅ INIT CLIENT
client = Groq(api_key=api_key)

# ✅ Request Model
class TextInput(BaseModel):
    text: str

# ✅ Root Route
@app.get("/")
def home():
    return {"message": "EduVision AI Backend Running 🚀"}

# ✅ Summarizer API
@app.post("/summarize")
def summarize(data: TextInput):
    try:
        prompt = f"""
        Summarize the following text into:
        - Clear bullet points
        - Key concepts

        Text:
        {data.text}
        """

        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {"role": "system", "content": "You are a helpful AI tutor."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.5
        )

        summary = response.choices[0].message.content

        return {"summary": summary}

    except Exception as e:
        return {"error": str(e)}
    
# ✅ Learning Style Prediction API
@app.post("/predict-learning-style")
def predict_style(data: Answers):
    try:
        result = predict_learning_style(data.answers)
        return {
    "style": result["style"],
    "description": result["description"],
    "recommendations": result["recommendations"]
}
    except Exception as e:
        return {"error": str(e)}