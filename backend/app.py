from fastapi import FastAPI, UploadFile, File
from ml.learning_style.schema import LearningInput
from ml.learning_style.predictor import predict_learning_style
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from groq import Groq
import os
from dotenv import load_dotenv
import PyPDF2
from jose import jwt
from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from auth import create_token   # 👈 tumhara auth.py
import hashlib
from sqlalchemy.orm import Session
from database import SessionLocal, engine
import PyPDF2
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

models.Base.metadata.create_all(bind=engine)

# Load environment variables
load_dotenv()
SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM")

app = FastAPI()
# ✅ Study Room storage
rooms = []

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

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload.get("user_id")
        user = db.query(models.User).filter(models.User.id == user_id).first()
        if user is None:
            raise HTTPException(status_code=404, detail="User not found")
        return user   # ✅ full user object return
    except:
        raise HTTPException(status_code=401, detail="Invalid token")

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

# ✅ TEXT SUMMARIZER API
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


# ✅ PDF SUMMARIZER API (NEW 🔥)
@app.post("/summarize-pdf")
async def summarize_pdf(file: UploadFile = File(...)):
    try:
        # Read PDF
        pdf_reader = PyPDF2.PdfReader(file.file)
        text = ""

        for page in pdf_reader.pages:
            text += page.extract_text() or ""

        if not text.strip():
            return {"error": "No readable text found in PDF"}

        # Limit text to avoid token overflow
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

        summary = response.choices[0].message.content

        return {"summary": summary}

    except Exception as e:
        return {"error": str(e)}


# ✅ Learning Style Prediction API
@app.post("/predict-learning-style")
def predict_style(data: LearningInput):
    try:
        result = predict_learning_style(data.answers)
        return result   # 👈 important change
    except Exception as e:
        return {"error": str(e)}
    
##✅ AUTH MODELS
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

##✅ SIGNUP API
@app.post("/signup")
def signup(data: SignupInput, db: Session = Depends(get_db)):
    existing_user = db.query(models.User).filter(models.User.email == data.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already exists")
    hashed_password = hashlib.sha256(data.password.encode()).hexdigest()
    new_user = models.User(
    name=data.name,
    email=data.email,
    password=hashed_password,
    age=data.age,
    gender=data.gender,
    college=data.college,
    course=data.course
)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return {"message": "User created successfully"}

## ✅ LOGIN API
@app.post("/login")
def login(data: LoginInput, db: Session = Depends(get_db)):
    hashed_password = hashlib.sha256(data.password.encode()).hexdigest()
    user = db.query(models.User).filter(models.User.email == data.email).first()
    if not user or user.password != hashed_password:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    token = create_token({"user_id": user.id})
    return {"access_token": token}

##✅ PROFILE API
@app.get("/profile")
def profile(user_id: int = Depends(get_current_user), db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    return {
    "name": user.name,
    "email": user.email,
    "xp": user.xp,
    "streak": user.streak,
  
    "age": user.age,
    "gender": user.gender,
    "college": user.college,
    "course": user.course
}

##✅ GET CURRENT USER DATA
@app.get("/me")
def get_current_user_data(current_user: models.User = Depends(get_current_user)):
    return current_user


# ===============================
# 🔥 STUDY ROOM APIs
# ===============================

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