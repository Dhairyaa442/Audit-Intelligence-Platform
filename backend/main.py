from dotenv import load_dotenv

load_dotenv()
from fastapi import FastAPI

from app.services.ai_service import analyze_policy

from app.routes.policies import router as policies_router
from app.routes.risks import router as risks_router
from app.routes.departments import router as departments_router
from fastapi.middleware.cors import CORSMiddleware
from app.services.ai_service import analyze_policy

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

@app.get("/")
def home():
    return {
        "message": "Audit Intelligence Platform API"
    }

@app.post("/analyze-policy")
async def analyze_policy(policy: Policy):

    analysis = f"""
Risk Assessment

Policy: {policy.policy_name}

Department: {policy.department}

Compliance Score: {policy.compliance_score}

Critical Findings: {policy.critical_findings}

Recommended Actions:
• Conduct immediate policy review
• Address identified compliance gaps
• Schedule follow-up audit
• Implement corrective controls

Overall Risk Level: HIGH
"""

    return {"analysis": analysis}

@app.post("/analyze-policy")
def analyze(policy: dict):
    return {
        "analysis": f"""
        Risk Level: High

        Policy {policy['policy_name']} requires immediate review.

        Recommendations:
        - Address compliance gaps
        - Review approval workflow
        - Schedule follow-up audit
        """
    }