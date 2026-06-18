from fastapi import APIRouter
from sqlalchemy import text
from app.database.db import SessionLocal

router = APIRouter()

@router.get("/dashboard")
def get_dashboard():

    db = SessionLocal()

    total_policies = db.execute(
        text("SELECT COUNT(*) FROM policies")
    ).scalar()

    compliant_policies = db.execute(
        text("SELECT COUNT(*) FROM policies WHERE audit_status = 'Compliant'")
    ).scalar()

    at_risk_policies = db.execute(
        text("SELECT COUNT(*) FROM policies WHERE audit_status = 'At Risk'")
    ).scalar()

    non_compliant_policies = db.execute(
        text("SELECT COUNT(*) FROM policies WHERE audit_status = 'Non-Compliant'")
    ).scalar()

    audit_readiness = round(
        (compliant_policies / total_policies) * 100,
        2
    )

    db.close()

    return {
        "total_policies": total_policies,
        "compliant_policies": compliant_policies,
        "at_risk_policies": at_risk_policies,
        "non_compliant_policies": non_compliant_policies,
        "audit_readiness": audit_readiness
    }