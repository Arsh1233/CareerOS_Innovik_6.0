# pyrefly: ignore [missing-import]
from fastapi import Depends, HTTPException, status, Request
from typing import Dict, Any, Callable
from app.core.security import verify_jwt_token

class RequireRole:
    """
    Dependency generator for Role-Based Access Control.
    Usage:
        @router.get("/protected")
        def protected_route(user = Depends(RequireRole("student"))):
            ...
    """
    def __init__(self, allowed_roles: list[str] | str):
        if isinstance(allowed_roles, str):
            self.allowed_roles = [allowed_roles]
        else:
            self.allowed_roles = allowed_roles

    def __call__(self, request: Request, token_payload: Dict[str, Any] = Depends(verify_jwt_token)) -> Dict[str, Any]:
        """
        Extracts the user's role from the JWT payload.
        Supabase typically injects user_metadata into app_metadata or user_metadata.
        """
        # If the middleware successfully parsed it, we can use request.state.user
        payload = getattr(request.state, "user", token_payload)
        
        if not payload:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Not authenticated"
            )

        # In Supabase, role can be stored in user_metadata during sign_up
        user_metadata = payload.get("user_metadata", {})
        app_metadata = payload.get("app_metadata", {})
        
        user_role = user_metadata.get("role") or app_metadata.get("role") or "student"

        if user_role not in self.allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Operation not permitted. Required roles: {self.allowed_roles}",
            )
        
        # Return the payload so the router can use the user_id (sub)
        return payload

# Common dependencies for convenience
get_current_user = verify_jwt_token
get_current_student = RequireRole("student")
get_current_recruiter = RequireRole("recruiter")
get_current_college_admin = RequireRole("college_admin")
get_current_super_admin = RequireRole("super_admin")
