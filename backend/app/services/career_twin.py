import os
import json
from supabase import create_client, Client
from typing import Optional, Dict, Any, List
from app.schemas.career_twin import CareerTwinResponse
from app.services.ai import gemini
from app.services.n8n_client import call_n8n_agent
from app.schemas.n8n import TargetAgent

SUPABASE_URL = os.getenv("SUPABASE_URL", "https://your-project.supabase.co")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY", "your-service-role-key")

CAREER_TWIN_SYSTEM_PROMPT = """You are CareerOS's Career Twin AI engine. Your job is to analyse a student's 
profile and produce a precise, data-driven Career Twin report.

Given the student's skills, branch, graduation year, and optionally a target role, output a JSON object with 
EXACTLY this structure (no extra keys, no markdown fences):

{
  "readiness_score": <float 0-100>,
  "placement_probability": <float 0-100>,
  "strengths": [<up to 4 specific strength strings>],
  "weaknesses": [<up to 4 specific weakness/gap strings>],
  "recommended_roles": [<up to 4 specific job role strings with salary range, e.g. "AI Engineer – ₹28-42 LPA">],
  "roadmap_summary": "<2-3 sentence personalised roadmap summary>",
  "critical_skills_to_learn": [<up to 4 specific skills>],
  "estimated_months_to_ready": <integer>
}

Be specific. Reference real companies and Indian market salaries. Output ONLY valid JSON.
"""


class CareerTwinService:
    def __init__(self):
        self.supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

    async def get_student_id(self, user_id: str) -> str:
        """Resolves the student_id from the user's user_id."""
        res = self.supabase.table("student_profiles").select("id").eq("user_id", user_id).execute()
        if not res.data:
            raise ValueError("Student profile not found for this user.")
        return res.data[0]["id"]

    async def get_student_context(self, student_id: str) -> Dict[str, Any]:
        """Fetches relevant student data to feed into the Career Twin prompt."""
        profile_res = self.supabase.table("student_profiles").select("*").eq("id", student_id).single().execute()
        profile = profile_res.data or {}
        return profile

    async def get_my_twin(self, student_id: str) -> Optional[Dict[str, Any]]:
        """Fetches the latest Career Twin record for the student."""
        try:
            res = (
                self.supabase.table("career_twins")
                .select("*")
                .eq("student_id", student_id)
                .order("created_at", desc=True)
                .limit(1)
                .execute()
            )
            if not res.data:
                return None
            return res.data[0]
        except Exception as e:
            raise ValueError(f"Failed to fetch Career Twin: {str(e)}")

    async def check_resume_exists(self, student_id: str) -> bool:
        """Verifies the student has uploaded a resume."""
        res = self.supabase.table("resumes").select("id").eq("student_id", student_id).limit(1).execute()
        return len(res.data) > 0

    async def generate_with_ai(self, student_id: str, target_role: Optional[str] = None) -> Dict[str, Any]:
        """
        Routes Career Twin generation through n8n Career Twin agent
        (with direct AI fallback if n8n is offline), then saves the result to Supabase.
        """
        # 1. Fetch student context
        context = await self.get_student_context(student_id)

        # 2. Build prompt
        prompt_lines = [
            f"Student Profile:",
            f"- Branch: {context.get('branch', 'Computer Science')}",
            f"- Graduation Year: {context.get('graduation_year', 'N/A')}",
            f"- Current Skills: {json.dumps(context.get('skills', []))}",
            f"- CGPA: {context.get('cgpa', 'N/A')}",
        ]
        if target_role:
            prompt_lines.append(f"- Target Role: {target_role}")

        prompt = "\n".join(prompt_lines)

        # Direct AI fallback function
        async def _direct_ai_fallback():
            raw = gemini.generate(prompt=prompt, system_instruction=CAREER_TWIN_SYSTEM_PROMPT)
            clean = raw.strip().strip("```json").strip("```").strip()
            return json.loads(clean)

        # 3. Call n8n Agent
        result = await call_n8n_agent(
            target_agent=TargetAgent.CAREER_TWIN,
            payload={
                "student_id": student_id,
                "target_role": target_role,
                "prompt": prompt
            },
            fallback_fn=_direct_ai_fallback
        )

        # 5. Persist to Supabase
        insert_data = {
            "student_id": student_id,
            "readiness_score": result.get("readiness_score", 0),
            "placement_probability": result.get("placement_probability", 0),
            "strengths": result.get("strengths", []),
            "weaknesses": result.get("weaknesses", []),
            "recommended_roles": result.get("recommended_roles", []),
            "roadmap_summary": result.get("roadmap_summary", ""),
            "critical_skills_to_learn": result.get("critical_skills_to_learn", []),
            "estimated_months_to_ready": result.get("estimated_months_to_ready", 12),
        }
        save_res = self.supabase.table("career_twins").insert(insert_data).execute()
        if not save_res.data:
            raise ValueError("Failed to save Career Twin to database.")

        return save_res.data[0]
