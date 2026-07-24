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


@router.post("/chat", response_model=MentorChatResponse)
async def mentor_chat(
    request: MentorChatRequest,
    current_user: Optional[Dict[str, Any]] = Depends(get_optional_user),
):
    """
    ARIA Mentor chat endpoint. Accepts a user message + conversation history,
    calls Gemini AI, and returns the AI reply.
    Works for logged-in and guest users alike.
    """
    try:
        history_dicts = [
            {"role": msg.role, "text": msg.text}
            for msg in (request.history or [])
        ]
        reply = gemini.chat(
            message=request.message,
            history=history_dicts,
            system_instruction=ARIA_SYSTEM_PROMPT,
        )
        return MentorChatResponse(reply=reply)
    except RuntimeError as e:
        raise HTTPException(
            status_code=status.HTTP_533_SERVICE_UNAVAILABLE if hasattr(status, 'HTTP_533_SERVICE_UNAVAILABLE') else 503,
            detail=str(e),
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"AI mentor error: {str(e)}",
        )
