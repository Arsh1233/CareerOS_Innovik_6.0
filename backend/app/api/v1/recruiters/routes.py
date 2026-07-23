from fastapi import APIRouter, Depends, HTTPException, status, BackgroundTasks
from typing import Dict, Any, List
from uuid import UUID
from app.api.dependencies import get_current_user, RequireRole
from app.schemas.recruiters import RecruiterDashboardResponse, SearchRequest, JobCreate, JobResponse
from app.services.n8n_client import dispatch_agent_task
from supabase import create_client, Client
import os

router = APIRouter()

SUPABASE_URL = os.getenv("SUPABASE_URL", "https://your-project.supabase.co")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY", "your-service-role-key")
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
# Webhook logic handled by n8n_client

@router.get("/analytics", response_model=RecruiterDashboardResponse)
async def get_analytics(current_user: Dict[str, Any] = Depends(RequireRole(["recruiter"]))):
    try:
        recruiter = supabase.table("recruiters").select("id").eq("user_id", current_user["id"]).single().execute()
        # Fetch insight from analytics table
        analytics = supabase.table("analytics").select("*").eq("entity_id", recruiter.data["id"]).eq("metric_type", "recruiter_specific_insight").execute()
        if not analytics.data:
            return RecruiterDashboardResponse(total_pipeline=0, conversion_rate=0.0, insight="No data yet.")
        
        data = analytics.data[0]["data"]
        return RecruiterDashboardResponse(
            total_pipeline=data["metrics"]["total_pipeline"],
            conversion_rate=data["metrics"]["conversion_rate"],
            insight=data["insight"]
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/search", status_code=status.HTTP_202_ACCEPTED)
async def search_candidates(req: SearchRequest, background_tasks: BackgroundTasks, current_user: Dict[str, Any] = Depends(RequireRole(["recruiter"]))):
    try:
        recruiter = supabase.table("recruiters").select("id").eq("user_id", current_user["id"]).single().execute()
        background_tasks.add_task(dispatch_agent_task, current_user["id"], "talent_search", {"recruiter_id": recruiter.data["id"], "semantic_query": req.semantic_query})
        return {"status": "accepted"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/jobs", response_model=JobResponse, status_code=status.HTTP_201_CREATED)
async def create_job(job: JobCreate, current_user: Dict[str, Any] = Depends(RequireRole(["recruiter"]))):
    try:
        recruiter = supabase.table("recruiters").select("id").eq("user_id", current_user["id"]).single().execute()
        result = supabase.table("jobs").insert({
            "recruiter_id": recruiter.data["id"],
            "title": job.title,
            "description": job.description,
            "requirements": job.requirements
        }).execute()
        return result.data[0]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
