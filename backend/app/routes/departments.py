from fastapi import APIRouter
from sqlalchemy import text
from app.database.db import SessionLocal

router = APIRouter()

@router.get("/departments")
def get_department_summary():

    db = SessionLocal()

    result = db.execute(text("""
        SELECT
            department,
            COUNT(*) as total_policies,
            AVG(compliance_score) as avg_score
        FROM policies
        GROUP BY department
        ORDER BY avg_score DESC
    """))

    departments = []

    for row in result:
        departments.append({
            "department": row.department,
            "total_policies": row.total_policies,
            "average_compliance_score": round(float(row.avg_score), 2)
        })

    db.close()

    return departments
