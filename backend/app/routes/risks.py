from fastapi import APIRouter
from sqlalchemy import text
from app.database.db import SessionLocal
from app.services.ai_service import compare_policies_ai

router = APIRouter()

@router.get("/risks")
def get_high_risk_policies():

    db = SessionLocal()

    result = db.execute(
        text("""
            SELECT *
            FROM policies
            WHERE audit_status = 'Non-Compliant'
            ORDER BY compliance_score ASC
        """)
    )

    risks = []

    for row in result:
        risks.append({
            "policy_id": row.policy_id,
            "policy_name": row.policy_name,
            "department": row.department,
            "compliance_score": row.compliance_score,
            "critical_findings": row.critical_findings
        })

    db.close()

    return risks

@router.post("/compare-policy")
def compare_policy(data: dict):

    comparison = compare_policies_ai(
        data["policy1_name"],
        data["policy1_department"],
        data["policy1_report"],
        data["policy2_name"],
        data["policy2_department"],
        data["policy2_report"],
    )

    return {
        "comparison": comparison
    }