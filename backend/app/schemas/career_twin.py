from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any

class GenerateTwinRequest(BaseModel):
    target_role: Optional[str] = Field(
        None, description="Optional target role for the AI to benchmark against. If omitted, it will infer based on the resume."
    )

class CareerTwinResponse(BaseModel):
    id: str
    student_id: str
    readiness_score: float
    strengths: Optional[List[str]] = None
    weaknesses: Optional[List[str]] = None
    recommended_roles: Optional[List[str]] = None
