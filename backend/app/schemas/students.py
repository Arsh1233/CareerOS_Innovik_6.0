from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from uuid import UUID

class DashboardResponse(BaseModel):
    readiness_score: float
    active_applications: int
    roadmap_progress: float
    recent_tasks: List[str]

class CareerTwinResponse(BaseModel):
    id: UUID
    readiness_score: float
    strengths: List[str]
    weaknesses: List[str]
    recommended_roles: List[str]

class ResumeResponse(BaseModel):
    storage_url: str
    ats_score: Optional[float]
    parsed_data: Optional[Dict[str, Any]]

class SkillCreate(BaseModel):
    skill_name: str
    proficiency: int

class SkillResponse(SkillCreate):
    id: UUID

class RoadmapResponse(BaseModel):
    goal_role: str
    progress_percentage: float
    tasks: List[Dict[str, Any]]

class GenerateRequest(BaseModel):
    goal_role: str

class InterviewStartRequest(BaseModel):
    job_id: Optional[UUID] = None

class InterviewStartResponse(BaseModel):
    session_id: UUID
