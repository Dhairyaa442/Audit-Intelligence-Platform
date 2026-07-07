
from urllib import response

from dotenv import load_dotenv

load_dotenv()
from fastapi import FastAPI

from app.routes.policies import router as policies_router
from app.routes.risks import router as risks_router
from app.routes.departments import router as departments_router
from fastapi.middleware.cors import CORSMiddleware

from app.routes.dashboard import router as dashboard_router

from pydantic import BaseModel
from fastapi.responses import StreamingResponse
from app.services.report_service import generate_report_pdf

from app.services.ai_service import (
    analyze_policy as ai_analyze_policy,
    chat_with_policy,
    generate_roadmap,
    simulate_compliance,
    generate_actions,
    generate_executive_summary,
)


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

class ReportRequest(BaseModel):
    policy_name: str
    department: str
    analysis: str
    roadmap: str

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

class RoadmapRequest(BaseModel):
    policy_name: str
    department: str
    report: str

class ActionsRequest(BaseModel):
    policy_name: str
    department: str
    report: str

class SimulationRequest(BaseModel):
    policy_name: str
    current_score: float
    department: str  
    training: int
    documentation: int
    audit_frequency: int
    automation: int

class ExecutiveSummaryRequest(BaseModel):
    policy_name: str
    department: str
    report: str

class ComparePoliciesRequest(BaseModel):
    policy1_name: str
    policy1_department: str
    policy1_report: str

    policy2_name: str
    policy2_department: str
    policy2_report: str

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

@app.post("/generate-roadmap")
async def roadmap(request: RoadmapRequest):

    roadmap = generate_roadmap(
        request.policy_name,
        request.department,
        request.report,
    )

    return {
        "roadmap": roadmap
    }

@app.post("/generate-report")
async def generate_report(request: ReportRequest):

    pdf = generate_report_pdf(
        request.policy_name,
        request.department,
        request.analysis,
        request.roadmap,
    )

    return StreamingResponse(
        pdf,
        media_type="application/pdf",
        headers={
            "Content-Disposition":
            "attachment; filename=Executive_Audit_Report.pdf"
        },
    )

@app.post("/generate-actions")
async def actions(request: ActionsRequest):

    result = generate_actions(
        request.policy_name,
        request.department,
        request.report,
    )

    return result

@app.post("/simulate-compliance")
async def simulate(request: SimulationRequest):

    result = simulate_compliance(
        request.policy_name,
        request.department,
        request.current_score,
        request.training,
        request.documentation,
        request.audit_frequency,
        request.automation,
    )

    return result

@app.post("/executive-summary")
async def executive_summary(request: ExecutiveSummaryRequest):

    summary = generate_executive_summary(
        request.policy_name,
        request.department,
        request.report,
    )

    return {
        "summary": summary
    }

@app.post("/compare-policies")
async def compare_policies(request: ComparePoliciesRequest):

    result = compare_policies_ai(
        request.policy1_name,
        request.policy1_department,
        request.policy1_report,
        request.policy2_name,
        request.policy2_department,
        request.policy2_report,
    )

    return {
        "comparison": result
    }