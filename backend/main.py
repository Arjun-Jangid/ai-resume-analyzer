from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def read_root():
    return {"message": "Welcome to the Resume Analyzer API!"}

@app.get("/upload-resume")
def upload_resume(text: str):
    text = text.upper()
    return {
        "text": text,
        "message": "Resume uploaded successfully!"
        }