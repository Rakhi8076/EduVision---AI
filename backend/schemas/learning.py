from pydantic import BaseModel

class Answers(BaseModel):
    answers: list[str]