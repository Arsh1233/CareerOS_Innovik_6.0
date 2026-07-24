from fastapi import APIRouter, Depends, HTTPException, status
from typing import Dict, Any
from app.api.dependencies import get_current_user
from app.services.career_twin import CareerTwinService
from app.schemas.career_twin import GenerateTwinRequest

router = APIRouter()


def get_career_twin_service() -> CareerTwinService:
    return CareerTwinService()


@router.post("/generate", status_code=status.HTTP_200_OK)
async def generate_career_twin(
    request_data: GenerateTwinRequest,
    current_user: Dict[str, Any] = Depends(get_current_user),
    twin_service: CareerTwinService = Depends(get_career_twin_service),
):
    """
    Generates a Career Twin by calling Gemini 2.5 Flash directly.
    Returns the full twin data synchronously (replaces old n8n async dispatch).
    """
    user_id = current_user.get("id")
    if not user_id:
        raise HTTPException(status_code=401, detail="User ID not found in token")

    try:
        student_id = await twin_service.get_student_id(user_id)
        twin = await twin_service.generate_with_ai(
            student_id=student_id,
            target_role=request_data.target_role,
        )
        return twin

    except RuntimeError as e:
        # GOOGLE_API_KEY not configured
        raise HTTPException(status_code=503, detail=str(e))
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/me")
async def get_my_career_twin(
    current_user: Dict[str, Any] = Depends(get_current_user),
    twin_service: CareerTwinService = Depends(get_career_twin_service),
):
    """
    Fetches the most recent Career Twin for the authenticated student.
    """
    user_id = current_user.get("id")
    if not user_id:
        raise HTTPException(status_code=401, detail="User ID not found in token")

    try:
        student_id = await twin_service.get_student_id(user_id)
        twin = await twin_service.get_my_twin(student_id)

        if not twin:
            raise HTTPException(
                status_code=404,
                detail="No Career Twin found. Please generate one first.",
            )

        return twin
    except HTTPException:
        raise
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
