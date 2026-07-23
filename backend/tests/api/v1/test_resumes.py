import pytest
from fastapi.testclient import TestClient
from unittest.mock import AsyncMock, patch, MagicMock
from app.main import app
from app.services.resumes import ResumeService
from app.api.v1.resumes.routes import get_resume_service
from app.dependencies import get_current_student

client = TestClient(app)

@pytest.fixture
def mock_resume_service():
    mock_service = AsyncMock(spec=ResumeService)
    app.dependency_overrides[get_resume_service] = lambda: mock_service
    yield mock_service
    app.dependency_overrides.clear()

@pytest.fixture
def mock_current_student():
    user_payload = {
        "sub": "mock-user-123",
        "user_metadata": {"role": "student"}
    }
    app.dependency_overrides[get_current_student] = lambda: user_payload
    yield user_payload
    app.dependency_overrides.clear()

def test_upload_resume_success(mock_resume_service, mock_current_student):
    mock_resume_service.get_student_id.return_value = "mock-student-123"
    mock_resume_service.upload_resume.return_value = "https://example.com/resume.pdf"
    mock_resume_service.store_metadata.return_value = "mock-resume-id"

    # We need to mock the BackgroundTasks or the dispatch_agent_task so it doesn't actually fire
    with patch("app.api.v1.resumes.routes.dispatch_agent_task") as mock_dispatch:
        response = client.post(
            "/api/v1/resumes/upload",
            files={"file": ("test.pdf", b"dummy pdf content", "application/pdf")}
        )

        assert response.status_code == 200
        assert response.json()["status"] == "success"
        assert response.json()["resume_id"] == "mock-resume-id"
        assert response.json()["storage_url"] == "https://example.com/resume.pdf"
        
        # Verify the background task was appended/called (fastapi TestClient executes background tasks synchronously)
        # Because we mocked dispatch_agent_task itself, we can assert it was called
        mock_dispatch.assert_called_once_with(
            user_id="mock-user-123",
            target_agent="resume_agent",
            payload={
                "resume_id": "mock-resume-id",
                "storage_url": "https://example.com/resume.pdf"
            }
        )

def test_get_my_resume_success(mock_resume_service, mock_current_student):
    mock_resume_service.get_student_id.return_value = "mock-student-123"
    mock_resume_service.get_my_resume.return_value = {
        "id": "mock-resume-id",
        "student_id": "mock-student-123",
        "storage_url": "https://example.com/resume.pdf",
        "parsed_data": {"name": "Test User"},
        "ats_score": 85.5
    }

    response = client.get("/api/v1/resumes/me")

    assert response.status_code == 200
    assert response.json()["data"]["id"] == "mock-resume-id"
    assert response.json()["data"]["ats_score"] == 85.5

def test_get_my_resume_not_found(mock_resume_service, mock_current_student):
    mock_resume_service.get_student_id.return_value = "mock-student-123"
    mock_resume_service.get_my_resume.return_value = None

    response = client.get("/api/v1/resumes/me")

    assert response.status_code == 200
    assert response.json()["status"] == "not_found"
