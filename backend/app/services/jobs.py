import logging
import os
from supabase import create_client, Client
from fastapi import HTTPException
from typing import Optional, List
from app.schemas.jobs import GenerateRecommendationsRequest, RecommendationsResponse, JobMatch

logger = logging.getLogger(__name__)

SUPABASE_URL = os.getenv("SUPABASE_URL", "https://your-project.supabase.co")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY", "your-service-role-key")

class JobsService:
    def __init__(self):
        self.supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

    def get_my_recommendations(self, user_id: str) -> Optional[RecommendationsResponse]:
        """
        Fetches the student's latest generated job recommendations.
        """
        student_res = self.supabase.table("students").select("id").eq("user_id", user_id).execute()
        if not student_res.data:
            raise HTTPException(status_code=404, detail="Student profile not found")
        student_id = student_res.data[0]["id"]

        res = self.supabase.table("job_recommendations").select("*").eq("student_id", student_id).order("created_at", desc=True).limit(1).execute()
        
        if not res.data:
            raise HTTPException(status_code=404, detail="No job recommendations found. Generate them first.")
            
        data = res.data[0]
        return RecommendationsResponse(
            student_id=data["student_id"],
            target_role=data.get("target_role", "Unknown"),
            jobs=data.get("jobs", [])
        )
