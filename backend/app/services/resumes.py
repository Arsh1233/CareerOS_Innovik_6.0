import os
import uuid
from supabase import create_client, Client
from typing import Dict, Any, Optional
from fastapi import UploadFile

SUPABASE_URL = os.getenv("SUPABASE_URL", "https://your-project.supabase.co")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY", "your-service-role-key")

class ResumeService:
    def __init__(self):
        self.supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
        self.bucket_name = "resumes"

    async def get_student_id(self, user_id: str) -> str:
        """Resolves the student_id from the users user_id."""
        res = self.supabase.table("students").select("id").eq("user_id", user_id).execute()
        if not res.data:
            raise ValueError("Student profile not found for this user.")
        return res.data[0]["id"]

    async def upload_resume(self, user_id: str, file: UploadFile) -> str:
        """Uploads the PDF to Supabase storage and returns the public URL."""
        if not file.filename.endswith(".pdf"):
            raise ValueError("Only PDF files are allowed.")

        # Read the file bytes
        file_bytes = await file.read()
        
        # Generate a unique path: user_id/uuid.pdf
        unique_filename = f"{user_id}/{uuid.uuid4()}.pdf"
        
        try:
            # Upload to Supabase Storage
            self.supabase.storage.from_(self.bucket_name).upload(
                path=unique_filename,
                file=file_bytes,
                file_options={"content-type": "application/pdf"}
            )
            
            # Get public URL
            public_url = self.supabase.storage.from_(self.bucket_name).get_public_url(unique_filename)
            return public_url
        except Exception as e:
            raise ValueError(f"Storage upload failed: {str(e)}")

    async def store_metadata(self, student_id: str, storage_url: str) -> str:
        """Stores the resume record in the database and returns the resume ID."""
        try:
            res = self.supabase.table("resumes").insert({
                "student_id": student_id,
                "storage_url": storage_url
            }).execute()
            
            if not res.data:
                raise ValueError("Failed to insert resume record.")
                
            return res.data[0]["id"]
        except Exception as e:
            raise ValueError(f"Database insert failed: {str(e)}")

    async def get_my_resume(self, student_id: str) -> Optional[Dict[str, Any]]:
        """Fetches the most recent resume for the student."""
        try:
            res = self.supabase.table("resumes") \
                .select("*") \
                .eq("student_id", student_id) \
                .order("created_at", desc=True) \
                .limit(1) \
                .execute()
                
            if not res.data:
                return None
            return res.data[0]
        except Exception as e:
            raise ValueError(f"Failed to fetch resume: {str(e)}")
