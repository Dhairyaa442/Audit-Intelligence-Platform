from fastapi import FastAPI

from app.routes.dashboard import router as dashboard_router
from app.routes.policies import router as policies_router
from app.routes.risks import router as risks_router
from app.routes.departments import router as departments_router

app = FastAPI(
    title="Audit Intelligence Platform",
    version="1.0.0"
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