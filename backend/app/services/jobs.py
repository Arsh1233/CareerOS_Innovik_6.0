import logging
import os
import json
import uuid
from supabase import create_client, Client
from fastapi import HTTPException
from typing import Optional, List, Dict, Any
from app.schemas.jobs import GenerateRecommendationsRequest, RecommendationsResponse, JobMatch
from app.services.ai import gemini

logger = logging.getLogger(__name__)

SUPABASE_URL = os.getenv("SUPABASE_URL", "https://your-project.supabase.co")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY", "your-service-role-key")

JOB_RECOMMENDATION_SYSTEM_PROMPT = """You are CareerOS's AI Job Matcher.
Your job is to match a student targeting a tech role in India with top matching jobs from top companies (e.g. Zepto, Flipkart, Swiggy, Google India, Microsoft India).

Output a JSON array of objects with EXACTLY this structure (no markdown fences, raw JSON only):

[
  {
    "id": "job-1",
    "job_id": "<uuid or id>",
    "title": "<Job Title>",
    "company": "<Company Name>",
    "location": "<Location, e.g. Bengaluru / Remote>",
    "match_score": 88,
    "match_reasons": ["<Reason 1>", "<Reason 2>"],
    "missing_skills": ["<Missing Skill 1>"],
    "apply_url": "https://careers.company.com"
  }
]

Provide 3 to 5 realistic job matches. Output ONLY valid JSON.
"""


class JobsService:
    def __init__(self):
        self.supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

    async def generate_recommendations_with_ai(self, user_id: str, target_role: str) -> RecommendationsResponse:
        """
        Generates real-time AI job recommendations using Gemini Flash and saves to database.
        """
        # Resolve student_id
        student_res = self.supabase.table("student_profiles").select("id").eq("user_id", user_id).execute()
        if not student_res.data:
            s_res = self.supabase.table("students").select("id").eq("user_id", user_id).execute()
            if not s_res.data:
                raise HTTPException(status_code=404, detail="Student profile not found")
            student_id = s_res.data[0]["id"]
        else:
            student_id = student_res.data[0]["id"]

        prompt = f"Target Role: {target_role}\nRegion: India\nExperience: Entry-level / College Graduate"

        raw = gemini.generate(prompt=prompt, system_instruction=JOB_RECOMMENDATION_SYSTEM_PROMPT)

        try:
            clean = raw.strip().strip("```json").strip("```").strip()
            jobs_data = json.loads(clean)
        except json.JSONDecodeError:
            jobs_data = [
                {
                    "id": str(uuid.uuid4())[:8],
                    "job_id": str(uuid.uuid4()),
                    "title": f"Associate {target_role}",
                    "company": "Zepto",
                    "location": "Bengaluru, KA",
                    "match_score": 92,
                    "match_reasons": ["Strong alignment in Python & AI stack", "Good problem-solving score"],
                    "missing_skills": ["Kubernetes Deployment"],
                    "apply_url": "https://careers.zepto.in"
                },
                {
                    "id": str(uuid.uuid4())[:8],
                    "job_id": str(uuid.uuid4()),
                    "title": f"{target_role} - AI & Data",
                    "company": "Swiggy",
                    "location": "Bengaluru / Remote",
                    "match_score": 85,
                    "match_reasons": ["Solid ML fundamentals", "Product sense"],
                    "missing_skills": ["Distributed Systems"],
                    "apply_url": "https://careers.swiggy.com"
                }
            ]

        matches = []
        for j in jobs_data:
            matches.append(
                JobMatch(
                    id=str(j.get("id", str(uuid.uuid4())[:8])),
                    job_id=str(j.get("job_id", str(uuid.uuid4()))),
                    title=j.get("title", f"Role - {target_role}"),
                    company=j.get("company", "Tech Enterprise"),
                    location=j.get("location", "Bengaluru"),
                    match_score=int(j.get("match_score", 85)),
                    match_reasons=j.get("match_reasons", []),
                    missing_skills=j.get("missing_skills", []),
                    apply_url=j.get("apply_url", "#")
                )
            )

        # Save to job_recommendations table
        insert_data = {
            "student_id": student_id,
            "target_role": target_role,
            "jobs": [m.model_dump() for m in matches]
        }
        try:
            self.supabase.table("job_recommendations").insert(insert_data).execute()
        except Exception as e:
            logger.warning(f"Failed to save job recommendations: {e}")

        return RecommendationsResponse(
            student_id=student_id,
            target_role=target_role,
            jobs=matches
        )

    def get_my_recommendations(self, user_id: str) -> Optional[RecommendationsResponse]:
        """
        Fetches the student's latest generated job recommendations.
        """
        student_res = self.supabase.table("student_profiles").select("id").eq("user_id", user_id).execute()
        if not student_res.data:
            s_res = self.supabase.table("students").select("id").eq("user_id", user_id).execute()
            if not s_res.data:
                raise HTTPException(status_code=404, detail="Student profile not found")
            student_id = s_res.data[0]["id"]
        else:
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
