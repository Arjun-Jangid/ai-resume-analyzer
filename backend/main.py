from turtle import mode
import fitz
from pydantic import BaseModel
from fastapi import FastAPI, File, Form, UploadFile
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

def extract_text_from_pdf(file):
    pdf = fitz.open(stream=file.file.read(), filetype="pdf")
    text = ""
    for page in pdf:
        text += page.get_text()
    return text

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
async def match_job(file: UploadFile = File(...), job_description: str = Form(...)):

    if (not file.filename or not file.filename.lower().endswith('.pdf') or file.content_type != 'application/pdf'):
        return {"error": "Invalid file type. Please upload a PDF file."}

    resume_text = extract_text_from_pdf(file)
    retrived_skills = rag.retrieve_skills(query=job_description)

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
        {resume_text}

        Job Description:
        {job_description}

        Relevant Market Skills:
        {retrived_skills}
        """,
        stream=False)
    
    if not result or not isinstance(result, dict) or "response" not in result:
        return {"error": "AI model did not return a valid response."}

    response_text = result["response"]

    try:
        result = json.loads(response_text)
    except json.JSONDecodeError:
        return {"error": "AI model returned invalid JSON."}

    print("AI Model Response:", response_text)
    print("AI Model Result:", result)

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