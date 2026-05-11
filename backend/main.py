from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.routes import router

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://ai-resume-analyzer-seven-peach.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)
