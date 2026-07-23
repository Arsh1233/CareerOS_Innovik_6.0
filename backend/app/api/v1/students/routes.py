from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form, BackgroundTasks
from typing import Dict, Any, List
from uuid import UUID
from app.api.dependencies import get_current_user, RequireRole
from app.schemas.students import (
    DashboardResponse, CareerTwinResponse, ResumeResponse,
    SkillCreate, SkillResponse, RoadmapResponse, GenerateRequest,
    InterviewStartRequest, InterviewStartResponse
)
from app.services.n8n_client import dispatch_agent_task
from supabase import create_client, Client
import os

router = APIRouter()

SUPABASE_URL = os.getenv("SUPABASE_URL", "https://your-project.supabase.co")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY", "your-service-role-key")
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# Webhook triggering is handled by app.services.n8n_client

@router.get("/me/dashboard", response_model=DashboardResponse)
async def get_dashboard(current_user: Dict[str, Any] = Depends(RequireRole(["student"]))):
    # Simulated fetch for dashboard aggregates
    return DashboardResponse(
        readiness_score=85.5,
        active_applications=3,
        roadmap_progress=45.0,
        recent_tasks=["Complete AWS Module", "Update Resume"]
    )

@router.get("/career_twin/me", response_model=CareerTwinResponse)
async def get_career_twin(current_user: Dict[str, Any] = Depends(RequireRole(["student"]))):
    try:
        student = supabase.table("students").select("id").eq("user_id", current_user["id"]).single().execute()
        twin = supabase.table("career_twins").select("*").eq("student_id", student.data["id"]).single().execute()
        if not twin.data:
            raise HTTPException(status_code=404, detail="Career Twin not found")
        return twin.data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/career_twin/generate", status_code=status.HTTP_202_ACCEPTED)
async def generate_career_twin(background_tasks: BackgroundTasks, current_user: Dict[str, Any] = Depends(RequireRole(["student"]))):
    try:
        student = supabase.table("students").select("id").eq("user_id", current_user["id"]).single().execute()
        # Trigger n8n webhook asynchronously via agent_tasks tracker
        background_tasks.add_task(dispatch_agent_task, current_user["id"], "career_twin", {"student_id": student.data["id"]})
        return {"status": "accepted"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/resumes/upload", status_code=status.HTTP_202_ACCEPTED)
async def upload_resume(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...),
    current_user: Dict[str, Any] = Depends(RequireRole(["student"]))
):
    try:
        student = supabase.table("students").select("id").eq("user_id", current_user["id"]).single().execute()
        # Trigger n8n webhook asynchronously via agent_tasks tracker
        background_tasks.add_task(dispatch_agent_task, current_user["id"], "resume_parser", {"student_id": student.data["id"], "filename": file.filename})
        return {"status": "accepted"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/resumes/me", response_model=ResumeResponse)
async def get_resume(current_user: Dict[str, Any] = Depends(RequireRole(["student"]))):
    try:
        student = supabase.table("students").select("id").eq("user_id", current_user["id"]).single().execute()
        resume = supabase.table("resumes").select("*").eq("student_id", student.data["id"]).order("created_at", desc=True).limit(1).execute()
        if not resume.data:
            raise HTTPException(status_code=404, detail="Resume not found")
        return resume.data[0]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/skills/me", response_model=List[SkillResponse])
async def get_skills(current_user: Dict[str, Any] = Depends(RequireRole(["student"]))):
    try:
        student = supabase.table("students").select("id").eq("user_id", current_user["id"]).single().execute()
        skills = supabase.table("skills").select("*").eq("student_id", student.data["id"]).execute()
        return skills.data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/skills/me", response_model=SkillResponse, status_code=status.HTTP_201_CREATED)
async def create_skill(skill: SkillCreate, current_user: Dict[str, Any] = Depends(RequireRole(["student"]))):
    try:
        student = supabase.table("students").select("id").eq("user_id", current_user["id"]).single().execute()
        result = supabase.table("skills").insert({
            "student_id": student.data["id"],
            "skill_name": skill.skill_name,
            "proficiency": skill.proficiency
        }).execute()
        return result.data[0]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/roadmaps/me", response_model=RoadmapResponse)
async def get_roadmap(current_user: Dict[str, Any] = Depends(RequireRole(["student"]))):
    try:
        student = supabase.table("students").select("id").eq("user_id", current_user["id"]).single().execute()
        roadmap = supabase.table("roadmaps").select("*").eq("student_id", student.data["id"]).single().execute()
        if not roadmap.data:
            raise HTTPException(status_code=404, detail="Roadmap not found")
        return roadmap.data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/roadmaps/generate", status_code=status.HTTP_202_ACCEPTED)
async def generate_roadmap(
    req: GenerateRequest,
    background_tasks: BackgroundTasks, 
    current_user: Dict[str, Any] = Depends(RequireRole(["student"]))
):
    try:
        student = supabase.table("students").select("id").eq("user_id", current_user["id"]).single().execute()
        background_tasks.add_task(dispatch_agent_task, current_user["id"], "roadmap_agent", {"student_id": student.data["id"], "goal_role": req.goal_role})
        return {"status": "accepted"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/interviews/start", response_model=InterviewStartResponse)
async def start_interview(req: InterviewStartRequest, current_user: Dict[str, Any] = Depends(RequireRole(["student"]))):
    try:
        student = supabase.table("students").select("id").eq("user_id", current_user["id"]).single().execute()
        result = supabase.table("interview_sessions").insert({
            "student_id": student.data["id"],
            "job_id": req.job_id
        }).execute()
        return {"session_id": result.data[0]["id"]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/interviews/audio", status_code=status.HTTP_202_ACCEPTED)
async def process_interview_audio(
    background_tasks: BackgroundTasks,
    session_id: UUID = Form(...),
    file: UploadFile = File(...),
    current_user: Dict[str, Any] = Depends(RequireRole(["student"]))
):
    try:
        background_tasks.add_task(dispatch_agent_task, current_user["id"], "interview_agent", {"session_id": str(session_id), "filename": file.filename})
        return {"status": "accepted"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
