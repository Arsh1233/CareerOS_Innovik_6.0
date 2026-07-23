# pyrefly: ignore [missing-import]
from fastapi import APIRouter, HTTPException, Depends, status
from app.schemas.auth import UserLogin, UserRegister, TokenSchema, OAuthUrlSchema
from app.services.auth import AuthService

router = APIRouter()

def get_auth_service() -> AuthService:
    return AuthService()

@router.post("/register", response_model=TokenSchema)
async def register(
    user_data: UserRegister,
    auth_service: AuthService = Depends(get_auth_service)
):
    """
    Registers a new user via Email and Password.
    Injects the selected role into user_metadata.
    """
    try:
        return await auth_service.register_user(user_data)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))

@router.post("/login", response_model=TokenSchema)
async def login(
    user_data: UserLogin,
    auth_service: AuthService = Depends(get_auth_service)
):
    """
    Authenticates a user via Email and Password.
    """
    try:
        return await auth_service.login_user(user_data)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=str(e))

@router.get("/google/url", response_model=OAuthUrlSchema)
async def get_google_oauth_url(
    auth_service: AuthService = Depends(get_auth_service)
):
    """
    Returns the Supabase Google OAuth URL for the frontend to redirect to.
    """
    try:
        return await auth_service.get_oauth_url(provider="google")
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))
