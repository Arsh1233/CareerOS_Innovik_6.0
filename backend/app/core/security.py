import os
import jwt
from fastapi import HTTPException, Security, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from typing import Dict, Any

# We use standard HTTPBearer to extract the token from the Authorization header
security = HTTPBearer()

SUPABASE_JWT_SECRET = os.getenv("SUPABASE_JWT_SECRET", "super-secret-jwt-token-with-at-least-32-characters-long")
ALGORITHM = "HS256"

def verify_jwt_token(credentials: HTTPAuthorizationCredentials = Security(security)) -> Dict[str, Any]:
    """
    Verifies the Supabase JWT token.
    Supabase signs its JWTs using HS256 and the project's JWT Secret.
    """
    token = credentials.credentials
    try:
        # Decode and verify the JWT token
        # audience is typically "authenticated" in Supabase
        payload = jwt.decode(
            token, 
            SUPABASE_JWT_SECRET, 
            algorithms=[ALGORITHM], 
            audience="authenticated"
        )
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token has expired",
            headers={"WWW-Authenticate": "Bearer"},
        )
    except jwt.InvalidTokenError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Invalid token: {str(e)}",
            headers={"WWW-Authenticate": "Bearer"},
        )
