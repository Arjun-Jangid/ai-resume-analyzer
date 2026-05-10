import json
from fastapi import APIRouter, File, Form, UploadFile
from model import AIModelClient
from pdf_parser import extract_text_from_pdf
from prompts import build_chat_prompt, build_match_job_prompt
from rag import rag

router = APIRouter()
model_client = AIModelClient()

resume_memory = ""


@router.get("/")
def home():
    return {"message": "Welcome to the Resume Parser API!"}


@router.post("/match-job")
async def match_job(file: UploadFile = File(...), job_description: str = Form(...)):
    if (
        not file.filename
        or not file.filename.lower().endswith(".pdf")
        or file.content_type != "application/pdf"
    ):
        return {"error": "Invalid file type. Please upload a PDF file."}

    resume_text = extract_text_from_pdf(file)
    retrieved_skills = rag.retrieve_skills(query=job_description)

    global resume_memory
    resume_memory = resume_text

    prompt = build_match_job_prompt(resume_text, job_description, retrieved_skills)

    result = model_client.generate(
        model="gemma:2b",
        prompt=prompt,
        stream=False,
    )

    if not result or not isinstance(result, dict) or "response" not in result:
        return {"error": "AI model did not return a valid response."}

    response_text = result["response"]

    try:
        parsed = json.loads(response_text)
    except json.JSONDecodeError:
        return {"error": "AI model returned invalid JSON."}

    return {
        "resume_result": parsed,
        "message": "Job matched successfully!",
    }


@router.post("/chat")
def chat(query: str = Form(...)):
    prompt = build_chat_prompt(resume_memory, query)

    result = model_client.generate(
        model="gemma:2b",
        prompt=prompt,
        stream=False,
    )

    if not result or not isinstance(result, dict) or "response" not in result:
        return {"answer": "", "status": "AI model did not return a valid response."}

    response = result["response"]

    return {
        "answer": response,
        "status": "chat return successfully",
    }
