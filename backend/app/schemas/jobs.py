from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional

class JobMatch(BaseModel):
    id: str
    job_id: str
    title: str
    company: str
    location: str
    match_score: int
    match_reasons: List[str]
    missing_skills: List[str]
    apply_url: str

class RecommendationsResponse(BaseModel):
    student_id: str
    target_role: str
    jobs: List[JobMatch]

class GenerateRecommendationsRequest(BaseModel):
    target_role: Optional[str] = Field(None, description="The specific role to target for jobs.")
