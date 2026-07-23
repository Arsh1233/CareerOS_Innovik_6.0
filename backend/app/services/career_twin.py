import os
from supabase import create_client, Client
from typing import Optional, Dict, Any
from app.schemas.career_twin import CareerTwinResponse

SUPABASE_URL = os.getenv("SUPABASE_URL", "https://your-project.supabase.co")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY", "your-service-role-key")

class CareerTwinService:
    def __init__(self):
        self.supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

    async def get_student_id(self, user_id: str) -> str:
        """Resolves the student_id from the users user_id."""
        res = self.supabase.table("students").select("id").eq("user_id", user_id).execute()
        if not res.data:
            raise ValueError("Student profile not found for this user.")
        return res.data[0]["id"]

    async def get_my_twin(self, student_id: str) -> Optional[CareerTwinResponse]:
        """Fetches the existing Career Twin for the student."""
        try:
            res = self.supabase.table("career_twins") \
                .select("*") \
                .eq("student_id", student_id) \
                .order("created_at", desc=True) \
                .limit(1) \
                .execute()
                
            if not res.data:
                return None
            return CareerTwinResponse(**res.data[0])
        except Exception as e:
            raise ValueError(f"Failed to fetch Career Twin: {str(e)}")

    async def check_resume_exists(self, student_id: str) -> bool:
        """Verifies the student has uploaded a resume (required for Career Twin generation)."""
        res = self.supabase.table("resumes").select("id").eq("student_id", student_id).limit(1).execute()
        return len(res.data) > 0
