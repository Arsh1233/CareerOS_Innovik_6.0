from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, BackgroundTasks
from typing import Dict, Any
from app.dependencies import get_current_student
from app.services.resumes import ResumeService
from app.services.n8n_client import dispatch_agent_task

router = APIRouter()

def get_resume_service() -> ResumeService:
    return ResumeService()

@router.post("/upload")
async def upload_resume(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...),
    current_user: Dict[str, Any] = Depends(get_current_student),
    resume_service: ResumeService = Depends(get_resume_service)
):
    """
    Uploads a resume PDF, stores metadata, and triggers the Resume Parser Agent.
    """
    user_id = current_user.get("sub")
    if not user_id:
        raise HTTPException(status_code=401, detail="User ID not found in token")
        
    try:
        # 1. Resolve student_id
        student_id = await resume_service.get_student_id(user_id)
        
        # 2. Upload to storage
        storage_url = await resume_service.upload_resume(user_id, file)
        
        # 3. Store metadata
        resume_id = await resume_service.store_metadata(student_id, storage_url)
        
        # 4. Dispatch n8n background task
        background_tasks.add_task(
            dispatch_agent_task,
            user_id=user_id,
            target_agent="resume_agent",
            payload={
                "resume_id": resume_id,
                "storage_url": storage_url
            }
        )
        
        return {
            "status": "success",
            "message": "Resume uploaded and parsing started",
            "resume_id": resume_id,
            "storage_url": storage_url
        }
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/me")
async def get_my_resume(
    current_user: Dict[str, Any] = Depends(get_current_student),
    resume_service: ResumeService = Depends(get_resume_service)
):
    """
    Returns the latest resume metadata and parsed state for the student.
    """
    user_id = current_user.get("sub")
    if not user_id:
        raise HTTPException(status_code=401, detail="User ID not found in token")
        
    try:
        student_id = await resume_service.get_student_id(user_id)
        resume = await resume_service.get_my_resume(student_id)
        
        if not resume:
            return {"status": "not_found", "message": "No resume found"}
            
        return {"status": "success", "data": resume}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
