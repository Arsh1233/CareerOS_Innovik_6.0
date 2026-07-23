from sqlalchemy import Column, String, ForeignKey
from sqlalchemy.orm import relationship
from .base import BaseModel

class User(BaseModel):
    __tablename__ = "users"
    # id matches Supabase auth.users.id
    email = Column(String, unique=True, index=True, nullable=False)
    role = Column(String, nullable=False, index=True) # student, recruiter, college, super_admin
    
    profile = relationship("Profile", back_populates="user", uselist=False)

class Profile(BaseModel):
    __tablename__ = "profiles"
    user_id = Column(ForeignKey("users.id"), unique=True, nullable=False)
    first_name = Column(String)
    last_name = Column(String)
    avatar_url = Column(String)
    
    user = relationship("User", back_populates="profile")

class Student(BaseModel):
    __tablename__ = "students"
    user_id = Column(ForeignKey("users.id"), unique=True, nullable=False)
    college_id = Column(ForeignKey("colleges.id"), nullable=True, index=True)
    graduation_year = Column(String)
    major = Column(String)

class Recruiter(BaseModel):
    __tablename__ = "recruiters"
    user_id = Column(ForeignKey("users.id"), unique=True, nullable=False)
    company_name = Column(String, index=True)

class College(BaseModel):
    __tablename__ = "colleges"
    user_id = Column(ForeignKey("users.id"), unique=True, nullable=False)
    name = Column(String, index=True)
    domain = Column(String, unique=True)
