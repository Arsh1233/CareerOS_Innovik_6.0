import os
from supabase import create_client, Client
from typing import Dict, Any, Optional
from app.schemas.users import (
    ProfileUpdate, ProfileResponse, StudentDetails, 
    RecruiterDetails, CollegeDetails, UserDetailsUpdate, UserDetailsResponse
)

SUPABASE_URL = os.getenv("SUPABASE_URL", "https://your-project.supabase.co")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY", "your-service-role-key")

class ProfileService:
    def __init__(self):
        # We use the Service Role key to bypass RLS when performing backend updates,
        # or we could use the anon key if we pass the user's JWT. 
        # For this service, since we already verified the JWT in middleware,
        # we can safely query the DB directly.
        self.supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

    async def get_profile(self, user_id: str) -> ProfileResponse:
        """Fetch the base profile for a user."""
        try:
            res = self.supabase.table("profiles").select("*").eq("user_id", user_id).execute()
            if not res.data:
                return ProfileResponse()
            return ProfileResponse(**res.data[0])
        except Exception as e:
            raise ValueError(f"Failed to fetch profile: {str(e)}")

    async def update_profile(self, user_id: str, data: ProfileUpdate) -> ProfileResponse:
        """Upsert the base profile for a user."""
        try:
            update_dict = {k: v for k, v in data.model_dump().items() if v is not None}
            if not update_dict:
                return await self.get_profile(user_id)
            
            res = self.supabase.table("profiles").upsert(
                {"user_id": user_id, **update_dict},
                on_conflict="user_id"
            ).execute()
            
            if not res.data:
                raise ValueError("No data returned from upsert")
            return ProfileResponse(**res.data[0])
        except Exception as e:
            raise ValueError(f"Failed to update profile: {str(e)}")

    async def get_role_details(self, user_id: str, role: str) -> UserDetailsResponse:
        """Fetch role-specific details from the corresponding table."""
        table_map = {
            "student": "students",
            "recruiter": "recruiters",
            "college_admin": "colleges"
        }
        
        table = table_map.get(role)
        if not table:
            # If super_admin or unknown role, just return empty
            return UserDetailsResponse(role=role, details=None)
            
        try:
            res = self.supabase.table(table).select("*").eq("user_id", user_id).execute()
            if not res.data:
                return UserDetailsResponse(role=role, details=None)
                
            data = res.data[0]
            if role == "student":
                details = StudentDetails(**data)
            elif role == "recruiter":
                details = RecruiterDetails(**data)
            elif role == "college_admin":
                details = CollegeDetails(**data)
            else:
                details = None
                
            return UserDetailsResponse(role=role, details=details)
        except Exception as e:
            raise ValueError(f"Failed to fetch role details: {str(e)}")

    async def update_role_details(self, user_id: str, role: str, data: UserDetailsUpdate) -> UserDetailsResponse:
        """Upsert role-specific details."""
        try:
            update_dict = {}
            table = ""
            if role == "student" and data.student:
                update_dict = {k: v for k, v in data.student.model_dump().items() if v is not None}
                table = "students"
            elif role == "recruiter" and data.recruiter:
                update_dict = {k: v for k, v in data.recruiter.model_dump().items() if v is not None}
                table = "recruiters"
            elif role == "college_admin" and data.college:
                update_dict = {k: v for k, v in data.college.model_dump().items() if v is not None}
                table = "colleges"
            else:
                return await self.get_role_details(user_id, role)

            if not update_dict:
                return await self.get_role_details(user_id, role)

            res = self.supabase.table(table).upsert(
                {"user_id": user_id, **update_dict},
                on_conflict="user_id"
            ).execute()
            
            if not res.data:
                raise ValueError(f"No data returned from upsert on {table}")
                
            updated_data = res.data[0]
            if role == "student":
                details = StudentDetails(**updated_data)
            elif role == "recruiter":
                details = RecruiterDetails(**updated_data)
            elif role == "college_admin":
                details = CollegeDetails(**updated_data)
            else:
                details = None
                
            return UserDetailsResponse(role=role, details=details)
        except Exception as e:
            raise ValueError(f"Failed to update role details: {str(e)}")
