from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks, status
from typing import Dict, Any
from app.dependencies import get_current_student
from app.services.career_twin import CareerTwinService
from app.services.n8n_client import dispatch_agent_task
from app.schemas.career_twin import GenerateTwinRequest, CareerTwinResponse

router = APIRouter()

def get_career_twin_service() -> CareerTwinService:
    return CareerTwinService()

@router.post("/generate", status_code=status.HTTP_202_ACCEPTED)
async def generate_career_twin(
    request_data: GenerateTwinRequest,
    background_tasks: BackgroundTasks,
    current_user: Dict[str, Any] = Depends(get_current_student),
    twin_service: CareerTwinService = Depends(get_career_twin_service)
):
    """
    Dispatches the Career Twin generation task to n8n asynchronously.
    Requires the user to have an uploaded resume.
    """
    user_id = current_user.get("sub")
    if not user_id:
        raise HTTPException(status_code=401, detail="User ID not found in token")
        
    try:
        student_id = await twin_service.get_student_id(user_id)
        
        # Verify resume exists
        has_resume = await twin_service.check_resume_exists(student_id)
        if not has_resume:
            raise ValueError("You must upload a resume before generating a Career Twin.")
        
        # Dispatch background task to n8n
        payload = request_data.model_dump(exclude_unset=True)
        background_tasks.add_task(
            dispatch_agent_task,
            user_id=user_id,
            target_agent="career_twin",
            payload=payload
        )
        
        return {
            "status": "accepted",
            "message": "Career Twin generation started. Please check back later."
        }
        
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/me", response_model=CareerTwinResponse)
async def get_my_career_twin(
    current_user: Dict[str, Any] = Depends(get_current_student),
    twin_service: CareerTwinService = Depends(get_career_twin_service)
):
    """
    Fetches the existing Career Twin for the authenticated student.
    """
    user_id = current_user.get("sub")
    if not user_id:
        raise HTTPException(status_code=401, detail="User ID not found in token")
        
    try:
        student_id = await twin_service.get_student_id(user_id)
        twin = await twin_service.get_my_twin(student_id)
        
        if not twin:
            raise HTTPException(status_code=404, detail="Career Twin not found. Please generate one.")
            
        return twin
    except HTTPException:
        raise
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
