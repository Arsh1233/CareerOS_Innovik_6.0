from sqlalchemy import Column, String, ForeignKey, JSON, Float, Text
from .base import BaseModel

class Job(BaseModel):
    __tablename__ = "jobs"
    recruiter_id = Column(ForeignKey("recruiters.id"), nullable=False, index=True)
    title = Column(String, nullable=False, index=True)
    description = Column(Text)
    requirements = Column(JSON)
    status = Column(String, default="open", index=True) # open, closed

class Application(BaseModel):
    __tablename__ = "applications"
    job_id = Column(ForeignKey("jobs.id"), nullable=False, index=True)
    student_id = Column(ForeignKey("students.id"), nullable=False, index=True)
    status = Column(String, default="applied", index=True) # applied, interviewed, hired, rejected
    match_score = Column(Float, index=True)

class Analytics(BaseModel):
    __tablename__ = "analytics"
    metric_type = Column(String, index=True, nullable=False)
    entity_id = Column(String, nullable=False, index=True)
    data = Column(JSON)
