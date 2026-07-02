
from dotenv import load_dotenv

load_dotenv()
from fastapi import FastAPI

from app.routes.policies import router as policies_router
from app.routes.risks import router as risks_router
from app.routes.departments import router as departments_router
from fastapi.middleware.cors import CORSMiddleware
from app.services.ai_service import (
    analyze_policy as ai_analyze_policy,
    chat_with_policy,
)

from app.routes.dashboard import router as dashboard_router

from pydantic import BaseModel


app = FastAPI(
    title="Audit Intelligence Platform",
    version="1.0.0"
)


class Policy(BaseModel):
    policy_id: str
    policy_name: str
    department: str
    compliance_score: float
    critical_findings: int

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(dashboard_router)
app.include_router(policies_router)
app.include_router(risks_router)

app.include_router(departments_router)

class ChatRequest(BaseModel):
    policy_name: str
    department: str
    report: str
    question: str

@app.get("/")
def home():
    return {
        "message": "Audit Intelligence Platform API"
    }

@app.post("/analyze-policy")
async def analyze_policy_endpoint(policy: Policy):
    try:
        analysis = ai_analyze_policy(policy.model_dump())
        return {"analysis": analysis}
    except Exception as e:
        print("ERROR:", repr(e))
        return {"analysis": f"ERROR: {str(e)}"}
    
@app.post("/policy-chat")
async def policy_chat(request: ChatRequest):

    answer = chat_with_policy(
        request.policy_name,
        request.department,
        request.report,
        request.question,
    )

    return {
        "answer": answer
    }