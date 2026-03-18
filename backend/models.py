from sqlalchemy import Column, Integer, String
from database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    email = Column(String, unique=True)
    password = Column(String)
    xp = Column(Integer, default=0)
    streak = Column(Integer, default=0)
    age = Column(Integer)
    gender = Column(String)
    college = Column(String)
    course = Column(String)