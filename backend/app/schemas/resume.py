from pydantic import BaseModel
from typing import List, Optional, Dict, Any


class ResumeAnalysisResponse(BaseModel):
    filename: str
    overall_score: int
    ats_score: int
    keyword_score: int
    impact_score: int
    format_score: int
    keywords_present: List[str]
    keywords_missing: List[str]
    suggestions: List[Dict[str, str]]  # [{type: "critical"|"warning"|"info", text: "..."}]
    parsed_sections: Dict[str, Any]    # {name, email, education, experience, projects, skills}


class ResumeOptimizeResponse(BaseModel):
    optimized_resume_markdown: str
    changes_made: List[str]
