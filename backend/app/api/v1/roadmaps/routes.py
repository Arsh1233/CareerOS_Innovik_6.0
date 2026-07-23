from fastapi import APIRouter, Depends, BackgroundTasks, status
from typing import Dict, Any
from app.schemas.roadmaps import GenerateRoadmapRequest, RoadmapResponse
from app.services.roadmaps import RoadmapService
from app.api.dependencies import RequireRole

router = APIRouter()
roadmap_service = RoadmapService()

@router.post("/generate", status_code=status.HTTP_202_ACCEPTED)
async def generate_roadmap(
    request: GenerateRoadmapRequest,
    background_tasks: BackgroundTasks,
    user: Dict[str, Any] = Depends(RequireRole(["student"]))
):
    """
    Triggers the generation of a personalized career roadmap via the n8n agent.
    Returns 202 Accepted immediately.
    """
    return roadmap_service.trigger_roadmap_generation(
        user_id=user["id"],
        request=request,
        background_tasks=background_tasks
    )

@router.get("/me", response_model=RoadmapResponse)
async def get_my_roadmap(user: Dict[str, Any] = Depends(RequireRole(["student"]))):
    """
    Retrieves the current user's generated roadmap.
    """
    return roadmap_service.get_my_roadmap(user_id=user["id"])
