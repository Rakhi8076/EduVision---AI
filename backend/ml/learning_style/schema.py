from pydantic import BaseModel
from typing import List

class LearningInput(BaseModel):   # 👈 change name
    answers: List[str]