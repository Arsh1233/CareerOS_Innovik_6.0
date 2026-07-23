from sqlalchemy import Column, String, Integer, ForeignKey, JSON, Float, Text
from .base import BaseModel

class Resume(BaseModel):
    __tablename__ = "resumes"
    student_id = Column(ForeignKey("students.id"), nullable=False, index=True)
    storage_url = Column(String, nullable=False)
    parsed_data = Column(JSON, nullable=True)
    ats_score = Column(Float, nullable=True)

class Skill(BaseModel):
    __tablename__ = "skills"
    student_id = Column(ForeignKey("students.id"), nullable=False, index=True)
    skill_name = Column(String, index=True, nullable=False)
    proficiency = Column(Integer) # 1-100

class CareerTwin(BaseModel):
    __tablename__ = "career_twins"
    student_id = Column(ForeignKey("students.id"), unique=True, nullable=False)
    readiness_score = Column(Float, nullable=False, index=True)
    strengths = Column(JSON)
    weaknesses = Column(JSON)
    recommended_roles = Column(JSON)

class Roadmap(BaseModel):
    __tablename__ = "roadmaps"
    student_id = Column(ForeignKey("students.id"), nullable=False, index=True)
    goal_role = Column(String)
    tasks = Column(JSON)
    progress_percentage = Column(Float, default=0.0)

class InterviewSession(BaseModel):
    __tablename__ = "interview_sessions"
    student_id = Column(ForeignKey("students.id"), nullable=False, index=True)
    job_id = Column(ForeignKey("jobs.id"), nullable=True, index=True)
    overall_score = Column(Float)
    feedback_summary = Column(Text)
