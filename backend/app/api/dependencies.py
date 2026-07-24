from fastapi import Depends, HTTPException, Security, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from typing import Dict, Any, Optional
from app.core.security import verify_jwt_token, SUPABASE_JWT_SECRET
import jwt

optional_security = HTTPBearer(auto_error=False)

async def get_current_user(payload: Dict[str, Any] = Depends(verify_jwt_token)) -> Dict[str, Any]:
    """
    Dependency that extracts the current user's data from the verified JWT.
    """
    user_id = payload.get("sub")
    if not user_id:
        raise HTTPException(status_code=401, detail="User ID not found in token")
    
    app_metadata = payload.get("app_metadata", {})
    role = app_metadata.get("role", "student")
    
    return {
        "id": user_id,
        "email": payload.get("email"),
        "role": role
    }

async def get_optional_user(credentials: Optional[HTTPAuthorizationCredentials] = Security(optional_security)) -> Optional[Dict[str, Any]]:
    """
    Optional dependency that returns user dict if valid token provided, else None.
    """
    if not credentials:
        return None
    try:
        payload = jwt.decode(
            credentials.credentials,
            SUPABASE_JWT_SECRET,
            algorithms=["HS256"],
            options={"verify_aud": False}
        )
        return {
            "id": payload.get("sub", "guest"),
            "email": payload.get("email"),
            "role": payload.get("app_metadata", {}).get("role", "student")
        }
    except Exception:
        return None

class RequireRole:
    """
    Dependency class for Role-Based Access Control (RBAC).
    Usage: Depends(RequireRole(["recruiter", "college"]))
    """
    def __init__(self, allowed_roles: list[str]):
        self.allowed_roles = allowed_roles

    async def __call__(self, user: Dict[str, Any] = Depends(get_current_user)):
        if user.get("role") not in self.allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Operation not permitted. Required roles: {self.allowed_roles}"
            )
        return user

import os
from fastapi import Header

WEBHOOK_SECRET = os.getenv("WEBHOOK_SECRET", "super-secret-webhook-key")

async def verify_n8n_webhook_secret(authorization: str | None = Header(None, description="Bearer token matching WEBHOOK_SECRET")):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Invalid or missing Authorization header")
    
    token = authorization.split(" ")[1]
    
    if token != WEBHOOK_SECRET:
        raise HTTPException(status_code=403, detail="Unauthorized webhook caller")
    
    return True
