import os
from fastapi import APIRouter, Depends, HTTPException, status
from typing import Dict, Any, Optional
from app.api.dependencies import get_optional_user
from app.schemas.mentor import MentorChatRequest, MentorChatResponse
from app.services.ai import gemini

router = APIRouter()

ARIA_SYSTEM_PROMPT = """You are ARIA (Adaptive Reasoning Intelligence for Advancement), an elite AI Career Mentor 
embedded inside CareerOS — an AI-powered career platform for students in India targeting high-paying tech roles 
(₹15–50 LPA).

Your personality:
- Highly analytical, encouraging, and direct
- You speak like a world-class career coach combined with a technical recruiter
- You reference Indian job market context (LPA salaries, FAANG India, product companies, service companies)
- You are concise but deeply insightful — no generic advice

Your capabilities:
- Skill gap analysis and prioritisation
- Personalised roadmap generation (month-by-month)
- Resume and ATS optimisation advice
- Mock interview coaching and feedback
- Salary benchmarking for Indian tech roles
- Company-specific interview prep (Google, Microsoft, Amazon, Flipkart, Zepto, etc.)

Always:
- Give specific, actionable next steps
- Reference realistic timelines
- Use markdown-style formatting for lists and emphasis when helpful
- Ask clarifying follow-up questions when the user's query is vague

Never:
- Give generic or vague advice
- Recommend irrelevant resources
- Be overly verbose
"""


from app.services.n8n_client import call_n8n_agent
from app.schemas.n8n import TargetAgent


@router.post("/chat", response_model=MentorChatResponse)
async def mentor_chat(
    request: MentorChatRequest,
    current_user: Optional[Dict[str, Any]] = Depends(get_optional_user),
):
    """
    ARIA Mentor chat endpoint. Routes request through n8n ARIA Mentor agent
    (with direct AI fallback if n8n is offline).
    """
    try:
        history_dicts = [
            {"role": msg.role, "text": msg.text}
            for msg in (request.history or [])
        ]

        # Extract profile information from request or Supabase
        profile_data = dict(request.user_profile or {})

        if current_user and current_user.get("id"):
            try:
                from supabase import create_client
                supabase_url = os.getenv("SUPABASE_URL", "")
                supabase_key = os.getenv("SUPABASE_SERVICE_ROLE_KEY", "")
                if supabase_url and supabase_key:
                    sp = create_client(supabase_url, supabase_key)
                    res = sp.table("student_profiles").select("*").eq("user_id", current_user["id"]).execute()
                    if res.data:
                        db_profile = res.data[0]
                        for k, v in db_profile.items():
                            if v and (k not in profile_data or not profile_data[k]):
                                profile_data[k] = v
            except Exception:
                pass

        # Build dynamic System Instruction with full student profile details
        system_instruction = ARIA_SYSTEM_PROMPT
        if profile_data:
            name = profile_data.get("fullName") or profile_data.get("full_name") or "Student"
            degree = profile_data.get("degree") or profile_data.get("course") or "N/A"
            grad_year = profile_data.get("graduationYear") or profile_data.get("graduation_year") or "N/A"
            univ = profile_data.get("universityName") or profile_data.get("university_name") or "N/A"
            target_role = profile_data.get("targetRole") or profile_data.get("target_role") or "N/A"
            cgpa = profile_data.get("cgpa") or "N/A"
            phone = profile_data.get("phone") or "N/A"
            bio = profile_data.get("bio") or ""

            system_instruction += (
                f"\n\n--- CURRENT STUDENT PROFILE CONTEXT ---\n"
                f"- Student Full Name: {name}\n"
                f"- Course / Degree: {degree}\n"
                f"- Graduation Year: {grad_year}\n"
                f"- College / University: {univ}\n"
                f"- Target Goal Role: {target_role}\n"
                f"- CGPA / Academic Score: {cgpa}\n"
                f"- Contact Phone: {phone}\n"
            )
            if bio:
                system_instruction += f"- Bio / Background: {bio}\n"

            system_instruction += (
                "\nINSTRUCTIONS FOR MENTOR:\n"
                "1. Address the student naturally by their first name when appropriate.\n"
                "2. Tailor all advice, skill recommendations, and timelines specifically to their degree, graduation year, and target role.\n"
                "3. Reference their year of study and college context when giving career path advice.\n"
            )

        async def _direct_ai_fallback():
            reply = gemini.chat(
                message=request.message,
                history=history_dicts,
                system_instruction=system_instruction,
            )
            return {"reply": reply}

        res = await call_n8n_agent(
            target_agent=TargetAgent.ARIA_MENTOR,
            payload={
                "message": request.message,
                "history": history_dicts,
                "user_id": current_user.get("id") if current_user else "guest",
                "student_profile": profile_data
            },
            fallback_fn=_direct_ai_fallback
        )

        return MentorChatResponse(reply=res.get("reply", ""))
    except RuntimeError as e:
        raise HTTPException(
            status_code=503,
            detail=str(e),
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"AI mentor error: {str(e)}",
        )
