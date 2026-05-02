from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from skills import SKILLS
import re

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def home():
    return {"message": "Welcome to the Resume Parser API!"}

@app.get("/upload-resume")
def upload_resume(text: str):
    results = {}

    for category, skills in SKILLS.items():
        matched = [skill for skill in skills if skill.lower() in text.lower()]
        if matched:
            results[category] = matched
        print("Category:", category)
        print("Skills:", skills)

    return {
        "skills": results,
        "message": "Resume uploaded successfully!"
        }


@app.post("/submit-application")
async def submit_application(file: UploadFile = File(...)):
    content = await file.read()
    content_str = content.decode('utf-8', errors='ignore')
    results = {}

    for category, skills in SKILLS.items():
        matched = [skill for skill in skills if skill.lower() in content_str.lower()]
        if matched:
            results[category] = matched


    return {
        "filename": file.filename,
        "skills": results,
        "message": f"Application submitted successfully!"
    }