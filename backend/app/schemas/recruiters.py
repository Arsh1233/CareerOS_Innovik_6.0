from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from uuid import UUID

class RecruiterDashboardResponse(BaseModel):
    total_pipeline: int
    conversion_rate: float
    insight: str

class SearchRequest(BaseModel):
    semantic_query: str

class JobCreate(BaseModel):
    title: str
    description: str
    requirements: List[str]

class JobResponse(JobCreate):
    id: UUID
    status: str
