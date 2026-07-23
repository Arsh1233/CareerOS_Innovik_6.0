from fastapi import Depends, HTTPException, status
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

    def __call__(self, token_payload: Dict[str, Any] = Depends(verify_jwt_token)) -> Dict[str, Any]:
        """
        Extracts the user's role from the JWT (if injected by Supabase) 
        or assumes standard auth logic.
        """
        # In a real Supabase setup, if you append a custom claim for `role`,
        # you would access it here. We'll simulate fetching the role.
        # Often it's placed in `app_metadata` by a trigger:
        app_metadata = token_payload.get("app_metadata", {})
        user_role = app_metadata.get("role", "student") # Default fallback

        if user_role not in self.allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Operation not permitted. Required roles: {self.allowed_roles}",
            )
        
        # Return the payload so the router can use the user_id (sub)
        return token_payload

# Common dependencies for convenience
get_current_user = verify_jwt_token
get_current_student = RequireRole("student")
get_current_recruiter = RequireRole("recruiter")
get_current_college_admin = RequireRole("college_admin")
get_current_super_admin = RequireRole("super_admin")
