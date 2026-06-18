from fastapi import APIRouter
from sqlalchemy import text
from app.database.db import SessionLocal

router = APIRouter()

@router.get("/policies")
def get_policies():

    db = SessionLocal()

    result = db.execute(
        text("""
            SELECT *
            FROM policies
            ORDER BY policy_id
            LIMIT 50
        """)
    )

    policies = []

    for row in result:
        policies.append({
            "policy_id": row.policy_id,
            "policy_name": row.policy_name,
            "department": row.department,
            "owner": row.owner,
            "audit_status": row.audit_status,
            "compliance_score": row.compliance_score
        })

    db.close()

    return policies
