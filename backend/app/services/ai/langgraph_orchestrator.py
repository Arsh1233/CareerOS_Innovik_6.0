from typing import TypedDict, List, Dict, Any, Optional
from langgraph.graph import StateGraph, END
from pydantic import BaseModel

# ==========================================
# 1. CORE STATE MODELS (PYDANTIC)
# ==========================================

class Skill(BaseModel):
    name: str
    level: int  # 1-5
    years_experience: float

class StudentProfileContext(BaseModel):
    student_id: str
    grad_year: int
    branch: str
    skills: List[Skill]
    resume_text: Optional[str] = None

class JobContext(BaseModel):
    job_id: str
    title: str
    required_skills: List[str]

# ==========================================
# 2. LANGGRAPH STATES (TYPED DICTS)
# ==========================================

class StudentState(TypedDict):
    """
    State for the Student Intelligence Layer
    Agents: Resume, Career Twin, ARIA Mentor, ECHO Interview
    """
    student_context: StudentProfileContext
    current_agent: str
    messages: List[Dict[str, str]]  # Chat history for ARIA/ECHO
    
    # Resume Output
    ats_score: Optional[float]
    extracted_keywords: Optional[List[str]]
    resume_suggestions: Optional[List[str]]
    
    # Twin Output
    placement_probability: Optional[float]
    readiness_score: Optional[float]
    skill_gaps: Optional[List[str]]
    
    # Interview Output
    current_question: Optional[str]
    interview_feedback: Optional[str]

class RecruiterState(TypedDict):
    """
    State for the Recruiter Intelligence Layer
    Agents: Talent Search, Candidate Ranking, Hiring Analytics
    """
    recruiter_id: str
    target_job: JobContext
    query: str
    
    # Outputs
    ranked_candidates: List[Dict[str, Any]]
    funnel_metrics: Dict[str, int]
    ai_candidate_summary: Optional[str]

class CollegeState(TypedDict):
    """
    State for the College Intelligence Layer
    Agents: Placement Analytics, Employability Monitoring, Department Performance
    """
    college_id: str
    
    # Outputs
    department_rankings: Dict[str, float]
    at_risk_students: List[str]
    placement_forecast: Dict[str, float]

# ==========================================
# 3. AGENT ORCHESTRATOR MOCKS
# ==========================================
# (Actual Gemini calls would be placed in these nodes)

def route_student_agent(state: StudentState):
    """Routes to specific student agent based on current_agent flag."""
    return state["current_agent"]

# Initialize Graphs
student_graph = StateGraph(StudentState)
recruiter_graph = StateGraph(RecruiterState)
college_graph = StateGraph(CollegeState)

# (Node and Edge connections will be added here in the implementation phase)
