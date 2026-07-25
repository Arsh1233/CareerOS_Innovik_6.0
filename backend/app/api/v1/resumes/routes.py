"""
Resume API routes — upload PDF for AI analysis, optimize, and download.
Uses Gemini AI directly (no n8n dependency).
"""
from fastapi import APIRouter, HTTPException, UploadFile, File, Form
from fastapi.responses import PlainTextResponse, Response
from typing import Dict, Any, Optional

from app.services.resume_ai import analyze_resume, optimize_resume, generate_job_description

router = APIRouter()

# In-memory store for the current session's analysis (per-server instance).
# In production you'd persist to Supabase; for the hackathon this is fine.
_session_store: Dict[str, Any] = {}


@router.post("/generate_jd")
def generate_jd_endpoint(payload: Dict[str, str]):
    """
    Generates a realistic Job Description for a specified target role using Gemini AI.
    """
    role = payload.get("role")
    if not role or not role.strip():
        raise HTTPException(status_code=400, detail="Role title is required.")

    try:
        jd_text = generate_job_description(role.strip())
        return {"status": "success", "job_description": jd_text}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate job description: {str(e)}")


@router.post("/analyze")
async def analyze(
    file: UploadFile = File(...),
    job_description: Optional[str] = Form(None)
):
    """
    Accepts a PDF resume and optional Job Description, extracts text with PyPDF2,
    sends to Gemini AI for scoring/analysis, and returns structured results.
    """
    if not file.filename:
        raise HTTPException(status_code=400, detail="No file provided")

    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are supported")

    try:
        file_bytes = await file.read()
        if len(file_bytes) > 5 * 1024 * 1024:
            raise HTTPException(status_code=400, detail="File size exceeds 5 MB limit")

        analysis = await analyze_resume(file_bytes, file.filename, job_description=job_description)

        # Store for later optimization
        _session_store["last_analysis"] = analysis

        # Remove raw text from the response (keep it server-side only)
        response = {k: v for k, v in analysis.items() if k != "resume_text"}
        return {"status": "success", "data": response}

    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")


@router.post("/optimize")
async def optimize():
    """
    Uses the last analyzed resume + analysis to generate an AI-optimized resume.
    Returns the optimized resume in markdown format.
    """
    analysis = _session_store.get("last_analysis")
    if not analysis:
        raise HTTPException(
            status_code=400,
            detail="No resume has been analyzed yet. Please upload and analyze a resume first."
        )

    resume_text = analysis.get("resume_text", "")
    if not resume_text:
        raise HTTPException(status_code=400, detail="Resume text not available. Please re-upload.")

    try:
        result = await optimize_resume(resume_text, analysis)
        _session_store["last_optimized"] = result
        return {"status": "success", "data": result}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Optimization failed: {str(e)}")


from fastapi.responses import PlainTextResponse, Response
from app.services.pdf_compiler import compile_latex_to_pdf


@router.get("/download")
async def download_optimized():
    """
    Returns the last optimized resume as a downloadable markdown / text file.
    """
    optimized = _session_store.get("last_optimized")
    if not optimized:
        raise HTTPException(status_code=400, detail="No optimized resume available. Run /optimize first.")

    content = optimized.get("optimized_latex") or optimized.get("optimized_resume_markdown", "")
    return PlainTextResponse(
        content=content,
        media_type="text/plain",
        headers={"Content-Disposition": "attachment; filename=Optimized_Resume.tex"},
    )


from fastapi.responses import PlainTextResponse, Response, HTMLResponse

@router.get("/view_pdf")
async def view_pdf():
    """
    Compiles the optimized LaTeX resume into PDF bytes for inline display in iframe (does not force download).
    """
    optimized = _session_store.get("last_optimized")
    if not optimized:
        # Fallback to last_analysis if available or clean HTML placeholder
        analysis = _session_store.get("last_analysis")
        if analysis and analysis.get("resume_text"):
            try:
                # Auto-generate optimization on-the-fly
                result = await optimize_resume(analysis["resume_text"], analysis)
                _session_store["last_optimized"] = result
                optimized = result
            except Exception:
                pass

    if not optimized:
        html_content = """
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body { background-color: #020617; color: #94A3B8; font-family: system-ui, -apple-system, sans-serif; display: flex; height: 100vh; margin: 0; align-items: center; justify-content: center; text-align: center; }
                .card { padding: 2rem; border-radius: 1rem; background: #0f172a; border: 1px solid #1e293b; max-width: 400px; }
                h3 { color: #f8fafc; margin-top: 0; font-size: 1.1rem; }
                p { font-size: 0.85rem; line-height: 1.5; color: #64748B; margin-bottom: 0; }
            </style>
        </head>
        <body>
            <div class="card">
                <h3>⚡ No Compiled PDF Available</h3>
                <p>Please click <b>⚡ Optimize Resume with AI</b> above to generate your compiled ATS-friendly PDF preview.</p>
            </div>
        </body>
        </html>
        """
        return HTMLResponse(content=html_content, status_code=200)

    latex_code = optimized.get("optimized_latex") or optimized.get("optimized_resume_markdown", "")
    try:
        pdf_bytes = compile_latex_to_pdf(latex_code)
        return Response(
            content=pdf_bytes,
            media_type="application/pdf",
            headers={"Content-Disposition": "inline; filename=Optimized_Resume.pdf"}
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate PDF: {str(e)}")


@router.get("/download_pdf")
async def download_pdf():
    """
    Compiles the optimized LaTeX resume into a clean PDF and returns it as a downloadable file.
    """
    optimized = _session_store.get("last_optimized")
    if not optimized:
        raise HTTPException(status_code=400, detail="No optimized resume available. Run /optimize first.")

    latex_code = optimized.get("optimized_latex") or optimized.get("optimized_resume_markdown", "")
    try:
        pdf_bytes = compile_latex_to_pdf(latex_code)
        return Response(
            content=pdf_bytes,
            media_type="application/pdf",
            headers={"Content-Disposition": "attachment; filename=Optimized_Resume.pdf"}
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate PDF: {str(e)}")


@router.get("/download_tex")
async def download_tex():
    """
    Returns raw LaTeX source code (.tex).
    """
    optimized = _session_store.get("last_optimized")
    if not optimized:
        raise HTTPException(status_code=400, detail="No optimized resume available. Run /optimize first.")

    latex_code = optimized.get("optimized_latex") or optimized.get("optimized_resume_markdown", "")
    return PlainTextResponse(
        content=latex_code,
        media_type="text/x-tex",
        headers={"Content-Disposition": "attachment; filename=Optimized_Resume.tex"}
    )
