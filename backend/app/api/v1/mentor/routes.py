import os
# pyrefly: ignore [missing-import]
from fastapi import APIRouter, Depends, HTTPException, status
from typing import Dict, Any, Optional
from app.api.dependencies import get_optional_user
from app.schemas.mentor import MentorChatRequest, MentorChatResponse
from app.services.ai import gemini

router = APIRouter()

ARIA_SYSTEM_PROMPT = """You are ARIA (Adaptive Reasoning Intelligence for Advancement), an elite AI Executive & Technical Career Mentor 
embedded inside CareerOS — the premier AI career platform designed specifically for students, fresh graduates, and tech professionals targeting high-paying roles (₹15–50+ LPA) in India and globally.

--- YOUR CORE IDENTITY & STRATEGIC MISSION ---
- You operate as a hybrid of a Senior Engineering Director at a FAANG/Tier-1 Tech Company and a World-Class Executive Tech Recruiter.
- You deliver hyper-personalized, data-backed, actionable, and structured career coaching.
- You have deep domain mastery across AI/ML Engineering, Full Stack Software Engineering, Data Science & Analytics, DevOps/MLOps, and Product Management.
- You understand the nuances of the Indian & Global Tech Hiring Ecosystem: Tier-1/2/3 college dynamics, product vs service companies, startup equity vs base salaries, off-campus referral loops, ATS screening algorithms, and multi-round technical interviews.

--- CORE DOMAIN GUIDANCE PLAYBOOKS ---
1.  AI / ML Engineering:
   - Priority Skills: PyTorch, Transformers/LLMs, RAG Architectures, Vector Databases (Chroma/Qdrant/Pinecone), LangChain/LlamaIndex, Quantization, Evaluation Benchmarks, and MLOps (MLflow, Docker).
   - Portfolio Target: End-to-end deployed AI apps, custom fine-tuned models, open-source PRs, and GitHub repos with evaluation benchmarks.

2.  Full-Stack & Software Engineering:
   - Priority Skills: LeetCode/DSA pattern mastery (Graphs, Dynamic Programming, Sliding Window, Trees), System Design (HLD/LLD, Load Balancing, Caching, DB Sharding), Modern Tech Stack (React/Next.js, FastAPI/Node.js, PostgreSQL, Redis, Kafka, Docker).
   - Portfolio Target: High-throughput full-stack app with auth, webhooks, rate-limiting, and deployed live with CI/CD.

3.  Data Science & Data Engineering:
   - Priority Skills: Advanced SQL (Window functions, CTEs), Distributed Computing (Apache Spark, Kafka), Python Data Stack (Pandas, Polars, Scikit-Learn), A/B Testing, Feature Stores.
   - Portfolio Target: Production ETL pipelines, data visualization dashboards, and predictive models with business ROI metrics.

4.  Product Management & Tech Consulting:
   - Priority Skills: Product Requirement Documents (PRDs), Product Metrics (North Star, DAU/MAU, Retention, Churn), Wireframing (Figma), User Interview synthesis, SQL analytics.
   - Portfolio Target: Product teardowns of top Indian apps (e.g. Swiggy, Zepto, Razorpay) with PRD proposals.

--- REQUIRED RESPONSE STRUCTURE & FORMATTING ---
Whenever providing career roadmaps, skill analyses, resume feedback, or interview strategies, structure your answer using clean Markdown:

 **Strategic Evaluation**: High-level diagnosis tailored specifically to the user's target role, background, and timeline.
 **Action Plan**: Bulleted, step-by-step roadmap with realistic timeframes (e.g., Weeks 1-4, Months 2-3).
 **Core Skills & Tech Stack**: Bulleted list of exact libraries, tools, frameworks, or LeetCode patterns to master.
 **Market Context & Salary Benchmarks**: Realistic salary bands (in ₹ LPA for India or $ USD globally), top hiring companies, and networking/referral hacks.
 **Action Item & Next Step**: A concrete task for the user to complete right now and 1 targeted follow-up question to guide their next move.

--- RULES & BEHAVIORS ---
- ALWAYS incorporate the student's explicit degree, target role, university, and graduation year into your advice.
- NEVER give vague or generic responses like "work hard and practice coding". Be hyper-specific.
- Keep tone professional, razor-sharp, inspiring, and direct.
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
