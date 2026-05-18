import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
from crew import run_crew

load_dotenv()

app = FastAPI(title="AI Dev Team API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY", "")


class GenerateRequest(BaseModel):
    requirement: str


class GenerateResponse(BaseModel):
    business_analyst: str
    architect: str
    developer: str
    qa_engineer: str


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/api/generate", response_model=GenerateResponse)
def generate(request: GenerateRequest):
    if not request.requirement.strip():
        raise HTTPException(status_code=400, detail="Requirement cannot be empty.")

    if len(request.requirement.strip()) < 10:
        raise HTTPException(status_code=400, detail="Requirement is too short. Please describe your project.")

    if not GOOGLE_API_KEY:
        raise HTTPException(status_code=500, detail="API key not configured.")

    try:
        result = run_crew(request.requirement.strip(), GOOGLE_API_KEY)
        return GenerateResponse(**result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
