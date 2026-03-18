import pandas as pd
import re

df = pd.read_csv("career_data_final.csv")
df["Career"] = df["Career"].str.strip().str.lower()

def get_career_info(career):
    career = career.lower()
    data = df[df["Career"] == career]

    if data.empty:
        return {
            "career": career,
            "salary": "N/A",
            "skills": [],
            "learning_path": []
        }

    row = data.iloc[0]


    skills = [s.strip() for s in row["Required_Skills"].split(",") if s.strip()]

    path = [p.strip() for p in row["Learning_Path"].split("|") if p.strip()]

    return {
        "career": row["Career"].title(),
        "salary": row["Salary_Range"],
        "skills": skills,
        "learning_path": [
            {"step": i + 1, "content": p}
            for i, p in enumerate(path)
        ]
    }