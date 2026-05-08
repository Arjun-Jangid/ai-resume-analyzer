from turtle import mode
from pydantic import BaseModel
from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
# from backend import skills
# from skills import SKILLS
import re
import json
from model import AIModelClient
from rag import RAG

rag = RAG()

class JobRequest(BaseModel):
    resume_text: str
    job_description: str

app = FastAPI()
model_client = AIModelClient()

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

@app.post("/match-job")
def match_job(data: JobRequest):

    retrived_skills = rag.retrieve_skills(query=data.job_description)
    print("Retrieved Skills:", retrived_skills)

    result = model_client.generate(
        model="gemma:2b",
       prompt = f"""
        You are an AI hiring assistant.

        Compare the resume and job description.

        Return ONLY valid JSON:
        - Use double quotes for all keys and strings
        - No trailing commas
        - No explanation or extra text

        Format:

        {{
        "match_score": 0-100,
        "matched_skills": ["..."],
        "missing_skills": ["..."],
        "suggestions": ["..."]
        }}

        IMPORTANT MATCHING RULES:
        - If a skill exists in BOTH resume and job description, it MUST be added to matched_skills.
        - Do NOT include matched skills inside missing_skills.
        - Match exact technologies carefully.
        - Use retrieved skills while identifying missing skills.
        - Prefer specific technical skills over generic terms.
        - Do not use broad phrases like "cloud platforms".

        Resume:
        {data.resume_text}

        Job Description:
        {data.job_description}

        Relevant Market Skills:
        {retrived_skills}
        """,
        stream=False)
    
    result = result["response"]
    result = json.loads(result)

    print("AI Model Job Match Result:", result)

    return {
        "resume_result": result,
        "message": "Job matched successfully!"
    }


# @app.post("/submit-application")
# async def submit_application(file: UploadFile = File(...)):
#     content = await file.read()
#     content_str = content.decode('utf-8', errors='ignore')
#     content_str = content_str + "\n\nExtract the relevant skills from the above resume and categorize them into frontend, backend, ui_designer, ai_ml_engineer, devops, and data_analyst. Return the results in a JSON format with categories as keys and lists of skills as values."

#     result = model_client.generate(model="gemma:2b", prompt=content_str, stream=False)
#     answer = result["response"]

#     # results = {}

#     # for category, skills in SKILLS.items():
#     #     matched = [skill for skill in skills if skill.lower() in content_str.lower()]
#     #     if matched:
#     #         results[category] = 
    
#     print("AI Model Response:", answer)
#     print("AI Model Response Type:", type(answer))
#     skills = json.loads(answer)


#     return {
#         "filename": file.filename,
#         "skills": skills,
#         "message": f"Application submitted successfully!"
#     }