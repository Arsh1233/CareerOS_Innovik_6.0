import logging
import os
import json
import uuid
from supabase import create_client, Client
from fastapi import HTTPException
from typing import Optional, Dict, Any, List
from app.schemas.roadmaps import GenerateRoadmapRequest, RoadmapResponse, RoadmapTask
from app.services.ai import gemini

logger = logging.getLogger(__name__)

SUPABASE_URL = os.getenv("SUPABASE_URL", "https://your-project.supabase.co")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY", "your-service-role-key")

ROADMAP_SYSTEM_PROMPT = """You are CareerOS's AI Learning Roadmap Generator.
Your job is to generate a highly detailed, month-by-month actionable learning roadmap for a student aiming for a specific goal role in tech.

Given the goal role and timeframe in months, output a JSON array of objects with EXACTLY this structure (no markdown fences, raw JSON only):

[
  {
    "id": "task-1",
    "title": "<Month 1 Milestone Title>",
    "description": "<Actionable description of what to build or learn this month>",
    "status": "pending",
    "estimated_hours": 30,
    "resources": ["<Resource 1>", "<Resource 2>"]
  }
]

Provide 4 to 8 distinct, structured tasks covering the target timeframe. Output ONLY valid JSON.
"""


class RoadmapService:
    def __init__(self):
        self.supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

    async def get_student_id(self, user_id: str) -> str:
        """Resolves the student_id from the user's user_id."""
        res = self.supabase.table("student_profiles").select("id").eq("user_id", user_id).execute()
        if not res.data:
            s_res = self.supabase.table("students").select("id").eq("user_id", user_id).execute()
            if not s_res.data:
                raise HTTPException(status_code=404, detail="Student profile not found")
            return s_res.data[0]["id"]
        return res.data[0]["id"]

    async def generate_roadmap_with_ai(self, user_id: str, request: GenerateRoadmapRequest) -> RoadmapResponse:
        """
        Generates a personalized roadmap using Gemini AI directly and saves it to Supabase.
        """
        student_id = await self.get_student_id(user_id)

        prompt = f"Goal Role: {request.goal_role}\nTimeframe: {request.timeframe_months or 6} months"

        # Call Gemini AI
        raw = gemini.generate(prompt=prompt, system_instruction=ROADMAP_SYSTEM_PROMPT)

        try:
            clean = raw.strip().strip("```json").strip("```").strip()
            tasks_data = json.loads(clean)
        except json.JSONDecodeError:
            tasks_data = [
                {
                    "id": "task-1",
                    "title": f"Master Foundations for {request.goal_role}",
                    "description": "Deep dive into core fundamentals, key libraries, and essential patterns.",
                    "status": "in_progress",
                    "estimated_hours": 40,
                    "resources": ["Official Docs", "LeetCode & System Design Guide"]
                },
                {
                    "id": "task-2",
                    "title": "Build Production Capstone Project",
                    "description": "Develop and deploy a full-stack project incorporating modern industry best practices.",
                    "status": "pending",
                    "estimated_hours": 60,
                    "resources": ["GitHub Project Starter", "Cloud Deployment Guide"]
                }
            ]

        tasks = []
        for i, t in enumerate(tasks_data):
            tasks.append(
                RoadmapTask(
                    id=str(t.get("id", f"task-{i+1}")),
                    title=t.get("title", f"Phase {i+1}"),
                    description=t.get("description", ""),
                    status=t.get("status", "pending"),
                    estimated_hours=t.get("estimated_hours", 25),
                    resources=t.get("resources", [])
                )
            )

        insert_data = {
            "student_id": student_id,
            "goal_role": request.goal_role,
            "progress_percentage": 0,
            "tasks": [t.model_dump() for t in tasks]
        }
        try:
            self.supabase.table("roadmaps").insert(insert_data).execute()
        except Exception as e:
            logger.warning(f"Failed to persist roadmap: {e}")

        return RoadmapResponse(
            student_id=student_id,
            goal_role=request.goal_role,
            progress_percentage=0,
            tasks=tasks
        )

    def get_my_roadmap(self, user_id: str) -> Optional[RoadmapResponse]:
        """
        Fetches the student's roadmap.
        """
        student_res = self.supabase.table("student_profiles").select("id").eq("user_id", user_id).execute()
        if not student_res.data:
            s_res = self.supabase.table("students").select("id").eq("user_id", user_id).execute()
            if not s_res.data:
                raise HTTPException(status_code=404, detail="Student profile not found")
            student_id = s_res.data[0]["id"]
        else:
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
