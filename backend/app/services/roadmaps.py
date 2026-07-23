import logging
import os
from supabase import create_client, Client
# pyrefly: ignore [missing-import]
from fastapi import HTTPException, BackgroundTasks
from typing import Optional
from app.schemas.roadmaps import GenerateRoadmapRequest, RoadmapResponse
from app.services.n8n_client import dispatch_agent_task
from app.schemas.n8n import TargetAgent

logger = logging.getLogger(__name__)

SUPABASE_URL = os.getenv("SUPABASE_URL", "https://your-project.supabase.co")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY", "your-service-role-key")

class RoadmapService:
    def __init__(self):
        self.supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

    def trigger_roadmap_generation(self, user_id: str, request: GenerateRoadmapRequest, background_tasks: BackgroundTasks):
        """
        Validates prerequisites (e.g. user must have a career twin) 
        and dispatches generation task to n8n via BackgroundTasks.
        """
        # Fetch student_id
        student_res = self.supabase.table("students").select("id").eq("user_id", user_id).execute()
        if not student_res.data:
            raise HTTPException(status_code=404, detail="Student profile not found")
        student_id = student_res.data[0]["id"]
        
        # Verify career twin exists (required for highly personalized roadmaps)
        twin_res = self.supabase.table("career_twins").select("id").eq("student_id", student_id).execute()
        if not twin_res.data:
            raise HTTPException(
                status_code=400, 
                detail="Career Twin must be generated before requesting a Roadmap"
            )
        
        # Dispatch to n8n
        payload = {
            "user_id": user_id,
            "student_id": student_id,
            "goal_role": request.goal_role,
            "timeframe_months": request.timeframe_months
        }
        
        background_tasks.add_task(
            dispatch_agent_task,
            user_id=user_id,
            target_agent=TargetAgent.ROADMAP_AGENT.value,
            payload=payload
        )
        
        return {"status": "accepted", "message": "Roadmap generation started"}

    def get_my_roadmap(self, user_id: str) -> Optional[RoadmapResponse]:
        """
        Fetches the student's roadmap.
        """
        student_res = self.supabase.table("students").select("id").eq("user_id", user_id).execute()
        if not student_res.data:
            raise HTTPException(status_code=404, detail="Student profile not found")
        student_id = student_res.data[0]["id"]

        res = self.supabase.table("roadmaps").select("*").eq("student_id", student_id).order("created_at", desc=True).limit(1).execute()
        
        if not res.data:
            raise HTTPException(status_code=404, detail="Roadmap not found. Generate one first.")
            
        data = res.data[0]
        return RoadmapResponse(
            student_id=data["student_id"],
            goal_role=data["goal_role"],
            progress_percentage=data.get("progress_percentage", 0),
            tasks=data.get("tasks", [])
        )
