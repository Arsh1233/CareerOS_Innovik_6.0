from pydantic import BaseModel, EmailStr
from typing import Optional
from uuid import UUID

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserRegister(BaseModel):
    email: EmailStr
    password: str
    role: str # student, recruiter, college, super_admin

class TokenSchema(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    expires_in: int

class UserOut(BaseModel):
    id: UUID
    email: EmailStr
    role: str

class OAuthUrlSchema(BaseModel):
    provider: str = "google"
    url: str
