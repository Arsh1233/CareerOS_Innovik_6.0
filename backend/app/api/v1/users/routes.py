from fastapi import APIRouter, Depends, HTTPException, status
from typing import Dict, Any
from app.dependencies import get_current_user
from app.schemas.users import (
    ProfileUpdate, ProfileResponse, 
    UserDetailsUpdate, UserDetailsResponse
)
from app.services.profiles import ProfileService

router = APIRouter()

def get_profile_service() -> ProfileService:
    return ProfileService()

@router.get("/me/profile", response_model=ProfileResponse)
async def get_profile(
    current_user: Dict[str, Any] = Depends(get_current_user),
    profile_service: ProfileService = Depends(get_profile_service)
):
    """
    Get the base profile for the currently authenticated user.
    """
    user_id = current_user.get("sub")
    if not user_id:
        raise HTTPException(status_code=401, detail="User ID not found in token")
        
    try:
        return await profile_service.get_profile(user_id)
    except ValueError as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/me/profile", response_model=ProfileResponse)
async def update_profile(
    profile_data: ProfileUpdate,
    current_user: Dict[str, Any] = Depends(get_current_user),
    profile_service: ProfileService = Depends(get_profile_service)
):
    """
    Update the base profile for the currently authenticated user.
    """
    user_id = current_user.get("sub")
    if not user_id:
        raise HTTPException(status_code=401, detail="User ID not found in token")
        
    try:
        return await profile_service.update_profile(user_id, profile_data)
    except ValueError as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/me/details", response_model=UserDetailsResponse)
async def get_role_details(
    current_user: Dict[str, Any] = Depends(get_current_user),
    profile_service: ProfileService = Depends(get_profile_service)
):
    """
    Get the role-specific details for the currently authenticated user.
    """
    user_id = current_user.get("sub")
    
    user_metadata = current_user.get("user_metadata", {})
    app_metadata = current_user.get("app_metadata", {})
    role = user_metadata.get("role") or app_metadata.get("role") or "student"
    
    if not user_id:
        raise HTTPException(status_code=401, detail="User ID not found in token")
        
    try:
        return await profile_service.get_role_details(user_id, role)
    except ValueError as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/me/details", response_model=UserDetailsResponse)
async def update_role_details(
    details_data: UserDetailsUpdate,
    current_user: Dict[str, Any] = Depends(get_current_user),
    profile_service: ProfileService = Depends(get_profile_service)
):
    """
    Update the role-specific details for the currently authenticated user.
    """
    user_id = current_user.get("sub")
    
    user_metadata = current_user.get("user_metadata", {})
    app_metadata = current_user.get("app_metadata", {})
    role = user_metadata.get("role") or app_metadata.get("role") or "student"
    
    if not user_id:
        raise HTTPException(status_code=401, detail="User ID not found in token")
        
    try:
        return await profile_service.update_role_details(user_id, role, details_data)
    except ValueError as e:
        raise HTTPException(status_code=500, detail=str(e))
