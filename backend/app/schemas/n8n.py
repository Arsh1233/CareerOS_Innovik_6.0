from enum import Enum
from pydantic import BaseModel, Field
from typing import Dict, Any, Optional

class TargetAgent(str, Enum):
    RESUME_AGENT = "resume_agent"
    CAREER_TWIN = "career_twin"
    ARIA_MENTOR = "aria_mentor"
    ROADMAP_AGENT = "roadmap_agent"
    INTERVIEW_AGENT = "interview_agent"
    JOB_MATCH = "job_match"
    COLLEGE_ANALYTICS = "college_analytics"
    RECRUITER_ANALYTICS = "recruiter_analytics"

class N8nWebhookStatusUpdate(BaseModel):
    task_id: str = Field(..., description="The UUID of the task in the agent_tasks table")
    status: str = Field(..., description="Status of the task (e.g., 'completed', 'failed')")
    result_data: Optional[Dict[str, Any]] = Field(None, description="The parsed JSON output from the AI")
    error_message: Optional[str] = Field(None, description="Error details if the task failed")
