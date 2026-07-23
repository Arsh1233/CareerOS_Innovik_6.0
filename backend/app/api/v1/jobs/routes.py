from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from typing import List
import logging
from app.schemas.jobs import GenerateRecommendationsRequest, RecommendationsResponse
from app.services.jobs import JobsService
from app.api.dependencies import RequireRole
from app.services.n8n_client import dispatch_agent_task
from app.schemas.n8n import TargetAgent

router = APIRouter()
logger = logging.getLogger(__name__)

@router.post("/recommend", status_code=202)
async def trigger_job_recommendations(
    request: GenerateRecommendationsRequest,
    background_tasks: BackgroundTasks,
    user: dict = Depends(RequireRole(["student"])),
    jobs_service: JobsService = Depends()
):
    """
    Triggers the n8n JOB_AGENT to generate personalized job recommendations.
    Runs asynchronously in the background.
    """
    user_id = user["sub"]
    
    # Verify student exists
    student_res = jobs_service.supabase.table("students").select("id").eq("user_id", user_id).execute()
    if not student_res.data:
        raise HTTPException(status_code=404, detail="Student profile not found")
    student_id = student_res.data[0]["id"]
    
    # Verify career twin exists
    twin_res = jobs_service.supabase.table("career_twins").select("id").eq("student_id", student_id).execute()
    if not twin_res.data:
        raise HTTPException(status_code=400, detail="Career Twin not found. Generate it first.")
        
    background_tasks.add_task(
        dispatch_agent_task,
        user_id=user_id,
        target_agent=TargetAgent.JOB_AGENT.value,
        payload={"target_role": request.target_role}
    )
    
    return {"message": "Job recommendations generation started", "status": "accepted"}

@router.get("/recommendations", response_model=RecommendationsResponse)
async def get_my_recommendations(
    user: dict = Depends(RequireRole(["student"])),
    jobs_service: JobsService = Depends()
):
    """
    Returns the latest generated job recommendations for the student.
    """
    return jobs_service.get_my_recommendations(user["sub"])
