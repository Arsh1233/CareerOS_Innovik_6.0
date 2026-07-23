from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional

class GenerateRoadmapRequest(BaseModel):
    goal_role: str = Field(..., description="The target role the student wants to achieve, e.g. 'Senior Frontend Developer'")
    timeframe_months: Optional[int] = Field(6, description="Desired timeframe to achieve this goal")

class RoadmapTask(BaseModel):
    id: str
    title: str
    description: str
    status: str = Field("pending", description="Status of the task: pending, in_progress, completed")
    estimated_hours: int
    resources: List[str]

class RoadmapResponse(BaseModel):
    student_id: str
    goal_role: str
    progress_percentage: int
    tasks: List[RoadmapTask]
