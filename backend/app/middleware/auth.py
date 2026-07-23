# pyrefly: ignore [missing-import]
from fastapi import Request
# pyrefly: ignore [missing-import]
from starlette.middleware.base import BaseHTTPMiddleware
# pyrefly: ignore [missing-import]
from starlette.responses import JSONResponse
# pyrefly: ignore [missing-import]
import jwt
import os

SUPABASE_JWT_SECRET = os.getenv("SUPABASE_JWT_SECRET", "super-secret-jwt-token-with-at-least-32-characters-long")

class JWTAuthMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        # Allow open paths like auth, docs, etc.
        if request.url.path.startswith("/api/v1/auth/") or request.url.path.startswith("/docs") or request.url.path.startswith("/openapi"):
            return await call_next(request)

        auth_header = request.headers.get("Authorization")
        if not auth_header or not auth_header.startswith("Bearer "):
            # We don't raise here, we let the route-level dependencies block it if required
            request.state.user = None
            return await call_next(request)

        token = auth_header.split(" ")[1]
        try:
            payload = jwt.decode(
                token,
                SUPABASE_JWT_SECRET,
                algorithms=["HS256"],
                audience="authenticated"
            )
            request.state.user = payload
        except Exception:
            request.state.user = None

        return await call_next(request)
