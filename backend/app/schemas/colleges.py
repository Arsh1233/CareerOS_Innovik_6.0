from pydantic import BaseModel
from typing import List
from uuid import UUID

class CollegeAnalyticsResponse(BaseModel):
    avg_readiness_score: float
    top_skill_gaps: List[str]
    placement_forecast: str
