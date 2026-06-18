from fastapi import FastAPI


from app.routes.policies import router as policies_router
from app.routes.risks import router as risks_router
from app.routes.departments import router as departments_router
from fastapi.middleware.cors import CORSMiddleware

from app.routes.dashboard import router as dashboard_router


app = FastAPI(
    title="Audit Intelligence Platform",
    version="1.0.0"
)

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