from fastapi import APIRouter, Depends, status
from typing import Dict, Any
from app.schemas.roadmaps import GenerateRoadmapRequest, RoadmapResponse
from app.services.roadmaps import RoadmapService
from app.api.dependencies import RequireRole

router = APIRouter()
roadmap_service = RoadmapService()

@router.post("/generate", response_model=RoadmapResponse, status_code=status.HTTP_200_OK)
async def generate_roadmap(
    request: GenerateRoadmapRequest,
    user: Dict[str, Any] = Depends(RequireRole(["student"]))
):
    """
    Generates a personalized career roadmap in real time using Gemini AI.
    """
    return await roadmap_service.generate_roadmap_with_ai(
        user_id=user["id"],
        request=request
    )

@router.get("/me", response_model=RoadmapResponse)
async def get_my_roadmap(user: Dict[str, Any] = Depends(RequireRole(["student"]))):
    """
    Retrieves the current user's generated roadmap.
    """
    return roadmap_service.get_my_roadmap(user_id=user["id"])
