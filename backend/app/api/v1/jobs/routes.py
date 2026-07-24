from fastapi import APIRouter, Depends, status
from typing import Dict, Any
import logging
from app.schemas.jobs import GenerateRecommendationsRequest, RecommendationsResponse
from app.services.jobs import JobsService
from app.api.dependencies import RequireRole

router = APIRouter()
logger = logging.getLogger(__name__)

@router.post("/recommend", response_model=RecommendationsResponse, status_code=status.HTTP_200_OK)
async def generate_job_recommendations(
    request: GenerateRecommendationsRequest,
    user: dict = Depends(RequireRole(["student"])),
    jobs_service: JobsService = Depends()
):
    """
    Generates personalized real-time job recommendations using Gemini AI.
    """
    user_id = user.get("id") or user.get("sub")
    return await jobs_service.generate_recommendations_with_ai(
        user_id=user_id,
        target_role=request.target_role
    )

@router.get("/recommendations", response_model=RecommendationsResponse)
async def get_my_recommendations(
    user: dict = Depends(RequireRole(["student"])),
    jobs_service: JobsService = Depends()
):
    """
    Returns the latest generated job recommendations for the student.
    """
    user_id = user.get("id") or user.get("sub")
    return jobs_service.get_my_recommendations(user_id)
