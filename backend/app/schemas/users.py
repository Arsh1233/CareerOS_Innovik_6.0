from pydantic import BaseModel, Field
from typing import Optional, Union

# Base Profile
class ProfileUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    avatar_url: Optional[str] = None

class ProfileResponse(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    avatar_url: Optional[str] = None

# Role Specific Details
class StudentDetails(BaseModel):
    graduation_year: Optional[str] = None
    major: Optional[str] = None
    college_id: Optional[str] = None

class RecruiterDetails(BaseModel):
    company_name: Optional[str] = None

class CollegeDetails(BaseModel):
    name: Optional[str] = None
    domain: Optional[str] = None

# We can accept any of these in the update payload for /me/details
class UserDetailsUpdate(BaseModel):
    student: Optional[StudentDetails] = None
    recruiter: Optional[RecruiterDetails] = None
    college: Optional[CollegeDetails] = None

# The response from /me/details
class UserDetailsResponse(BaseModel):
    role: str
    details: Union[StudentDetails, RecruiterDetails, CollegeDetails, None] = None
