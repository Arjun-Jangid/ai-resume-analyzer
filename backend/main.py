import fitz
from pydantic import BaseModel
from fastapi import FastAPI, File, Form, UploadFile
from fastapi.middleware.cors import CORSMiddleware
import json
from model import AIModelClient
from rag import RAG

rag = RAG()

class JobRequest(BaseModel):
    resume_text: str
    job_description: str

class ChatResponse(BaseModel):
    query: str

def extract_text_from_pdf(file):
    pdf = fitz.open(stream=file.file.read(), filetype="pdf")
    text = ""
    for page in pdf:
        text += page.get_text()
    return text

app = FastAPI()
model_client = AIModelClient()

resume_memory = ""

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

    global resume_memory
    resume_memory = resume_text

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

    return {
        "resume_result": result,
        "message": "Job matched successfully!"
    }


@app.post("/chat")
def chat(query: str = Form(...)):

    prompt = f"""
    You are an AI career assistant.

    Analyze the user's resume carefully.

    Resume:
    {resume_memory}

    Question:
    {query}
    """

    result = model_client.generate(
        model="gemma:2b",
        prompt=prompt,
        stream=False
    ),

    response = result[0]["response"]

    return {
        "answer": response,
        "status": "chat return successfully"
    }