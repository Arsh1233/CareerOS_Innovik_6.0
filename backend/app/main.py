from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os
from app.middleware.auth import JWTAuthMiddleware

# Load environment variables
load_dotenv()

from app.api.v1.auth.routes import router as auth_router
from app.api.v1.users import router as users_router
from app.api.v1.students import router as students_router
from app.api.v1.recruiters import router as recruiters_router
from app.api.v1.colleges import router as colleges_router
from app.api.v1.resumes import router as resumes_router
from app.api.v1.career_twin import router as career_twin_router
from app.api.v1.roadmaps.routes import router as roadmaps_router
from app.api.v1.jobs.routes import router as jobs_router
from app.api.v1.webhooks.n8n import router as n8n_webhooks_router

app = FastAPI(
    title="CareerOS API Gateway",
    description="The monolithic backend API that acts as a secure gateway to Supabase and n8n",
    version="1.0.0"
)

# CORS Middleware for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173", "http://localhost:8443", "https://your-frontend-domain.com", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# JWT Auth Middleware
app.add_middleware(JWTAuthMiddleware)

# Root check
@app.get("/")
def read_root():
    return {"status": "CareerOS Backend Online"}

# Mount V1 Routers
app.include_router(auth_router, prefix="/api/v1/auth", tags=["Auth"])
app.include_router(users_router, prefix="/api/v1/users", tags=["Users"])
app.include_router(students_router, prefix="/api/v1/students", tags=["Students"])
app.include_router(recruiters_router, prefix="/api/v1/recruiters", tags=["Recruiters"])
app.include_router(colleges_router, prefix="/api/v1/colleges", tags=["Colleges"])
app.include_router(resumes_router, prefix="/api/v1/resumes", tags=["Resumes"])
app.include_router(career_twin_router, prefix="/api/v1/career_twin", tags=["Career Twin"])
app.include_router(roadmaps_router, prefix="/api/v1/roadmaps", tags=["Roadmaps"])
app.include_router(jobs_router, prefix="/api/v1/jobs", tags=["Jobs & Applications"])
app.include_router(n8n_webhooks_router, prefix="/api/v1/webhooks/n8n", tags=["Webhooks"])
