from fastapi import FastAPI, UploadFile, File, Depends, HTTPException
from ml.learning_style.schema import LearningInput
from ml.learning_style.predictor import predict_learning_style
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from groq import Groq
import os
from dotenv import load_dotenv
import PyPDF2
from jose import jwt
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
import hashlib

# your modules

from ml.model_career import model
from ml.predictor_career import predict_top_careers, validate_scores
from services.career_service import get_career_info
from auth import create_token
from database import SessionLocal, engine
import models
import random
import string

def generate_code():
    return ''.join(random.choices(string.ascii_uppercase + string.digits, k=6))


# ✅ Study Room Models
class RoomCreate(BaseModel):
    name: str

class JoinRoom(BaseModel):
    code: str

# ================= INIT =================
app = FastAPI()

models.Base.metadata.create_all(bind=engine)

# ================= ENV =================
load_dotenv()
SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM")

# ================= CORS =================
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:8080",
        "http://127.0.0.1:8080",
        "http://192.168.29.193:8080",
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ================= AUTH =================
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload.get("user_id")
        user = db.query(models.User).filter(models.User.id == user_id).first()

        if not user:
            raise HTTPException(status_code=404, detail="User not found")

        return user
    except:
        raise HTTPException(status_code=401, detail="Invalid token")

# ================= GROQ =================
api_key = os.getenv("GROQ_API_KEY")

if not api_key:
    raise ValueError("❌ GROQ_API_KEY not found")

client = Groq(api_key=api_key)

# ================= REQUEST MODELS =================
class TextInput(BaseModel):
    text: str

class CareerInput(BaseModel):
    scores: list

# ================= ROOT =================
@app.get("/")
def home():
    return {"message": "EduVision AI Backend Running 🚀"}

# ================= TEXT SUMMARY =================
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

        return {"summary": response.choices[0].message.content}

    except Exception as e:
        print("ERROR:", e)
        return {"error": "Something went wrong"}

# ================= PDF SUMMARY =================
@app.post("/summarize-pdf")
async def summarize_pdf(file: UploadFile = File(...)):
    try:
        pdf_reader = PyPDF2.PdfReader(file.file)
        text = ""

        for page in pdf_reader.pages:
            text += page.extract_text() or ""

        if not text.strip():
            return {"error": "No readable text found"}

        text = text[:4000]

        prompt = f"""
        Summarize the following PDF content into:
        - Clear bullet points
        - Key concepts

        Text:
        {text}
        """

        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {"role": "system", "content": "You are a helpful AI tutor."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.5
        )

        return {"summary": response.choices[0].message.content}

    except Exception as e:
        print("ERROR:", e)
        return {"error": "Something went wrong"}

# ================= LEARNING STYLE =================
@app.post("/predict-learning-style")
def predict_style(data: LearningInput):
    try:
        result = predict_learning_style(data.answers)
        return result   # 👈 important change
    except Exception as e:
        return {"error": str(e)}

# ================= CAREER AI =================


@app.post("/predict-career")
def predict_career(data: CareerInput):
    try:
        scores = data.scores

        if not validate_scores(scores):
            raise HTTPException(status_code=400, detail="Invalid scores")

        results = predict_top_careers(model,scores)

        return {
            "main_career": {
                **get_career_info(results[0]["career"]),
                "confidence": results[0]["confidence"]
            },
            "other_careers": [
                {
                    **get_career_info(r["career"]),
                    "confidence": r["confidence"]
                }
                for r in results[1:]
            ]
        }

    except Exception as e:
        print("ERROR:", e)
        return {"error": str(e)}

# ================= QUIZ GENERATION =================
class QuizRequest(BaseModel):
    career: str

@app.post("/generate-quiz")
def generate_quiz(data: QuizRequest):
    try:
        prompt = f"""
Generate exactly 10 multiple choice questions to test knowledge about the career: {data.career}

Rules:
- Each question must have exactly 4 options
- Only one option is correct
- Questions should test real knowledge about this career field
- Vary difficulty: 3 easy, 4 medium, 3 hard
- Return ONLY valid JSON, no extra text, no markdown

Format:
{{
  "questions": [
    {{
      "q": "Question text here?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "answer": 0
    }}
  ]
}}

answer is the index (0-3) of the correct option.
"""
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {
                    "role": "system",
                    "content": "You are an expert educator. Always respond with valid JSON only. No markdown, no extra text, no backticks."
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            temperature=0.7
        )

        raw = response.choices[0].message.content.strip()

        # Clean markdown if Groq adds it anyway
        if "```" in raw:
            raw = raw.split("```")[1]
            if raw.startswith("json"):
                raw = raw[4:]

        import json
        questions = json.loads(raw.strip())
        return questions

    except Exception as e:
        print("ERROR generating quiz:", e)
        return {"error": str(e)}
    
# ================= AUTH APIs =================
class LoginInput(BaseModel):
    email: str
    password: str

class SignupInput(BaseModel):
    name: str
    email: str
    password: str
    age: int
    gender: str
    college: str
    course: str

@app.post("/signup")
def signup(data: SignupInput, db: Session = Depends(get_db)):
    if db.query(models.User).filter(models.User.email == data.email).first():
        raise HTTPException(status_code=400, detail="Email already exists")

    hashed_password = hashlib.sha256(data.password.encode()).hexdigest()

    user = models.User(
        name=data.name,
        email=data.email,
        password=hashed_password,
        age=data.age,
        gender=data.gender,
        college=data.college,
        course=data.course
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    return {"message": "User created successfully"}

@app.post("/login")
def login(data: LoginInput, db: Session = Depends(get_db)):
    hashed_password = hashlib.sha256(data.password.encode()).hexdigest()

    user = db.query(models.User).filter(models.User.email == data.email).first()

    if not user or user.password != hashed_password:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_token({"user_id": user.id})
    return {"access_token": token}

@app.get("/profile")
def profile(current_user: models.User = Depends(get_current_user)):
    return {
        "name": current_user.name,
        "email": current_user.email,
        "xp": current_user.xp,
        "streak": current_user.streak,
        "age": current_user.age,
        "gender": current_user.gender,
        "college": current_user.college,
        "course": current_user.course
    }

@app.get("/me")
def get_current_user_data(current_user: models.User = Depends(get_current_user)):
    return current_user


# ===============================
# 🔥 STUDY ROOM APIs
# ===============================
rooms = []  # In-memory storage for rooms (for demo purposes only)
@app.post("/rooms")
def create_room(data: RoomCreate):
    new_room = {
        "name": data.name,
        "members": 1,
        "code": generate_code()
    }
    rooms.append(new_room)
    return new_room


@app.get("/rooms")
def get_rooms():
    return rooms


@app.post("/rooms/join")
def join_room(data: JoinRoom):
    for room in rooms:
        if room["code"] == data.code:
            room["members"] += 1
            return room
    return {"error": "Room not found"}


@app.delete("/rooms/{code}")
def delete_room(code: str):
    global rooms
    rooms = [r for r in rooms if r["code"] != code]
    return {"message": "Room deleted"}
