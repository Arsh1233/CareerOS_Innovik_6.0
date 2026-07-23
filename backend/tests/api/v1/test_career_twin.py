import pytest
from fastapi.testclient import TestClient
from unittest.mock import AsyncMock, patch
from app.main import app
from app.services.career_twin import CareerTwinService
from app.api.v1.career_twin.routes import get_career_twin_service
from app.dependencies import get_current_student
from app.schemas.career_twin import CareerTwinResponse

client = TestClient(app)

@pytest.fixture
def mock_twin_service():
    mock_service = AsyncMock(spec=CareerTwinService)
    app.dependency_overrides[get_career_twin_service] = lambda: mock_service
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

def test_generate_twin_success(mock_twin_service, mock_current_student):
    mock_twin_service.get_student_id.return_value = "mock-student-123"
    mock_twin_service.check_resume_exists.return_value = True

    with patch("app.api.v1.career_twin.routes.dispatch_agent_task") as mock_dispatch:
        response = client.post(
            "/api/v1/career_twin/generate",
            json={"target_role": "Software Engineer"}
        )

        assert response.status_code == 202
        assert response.json()["status"] == "accepted"
        
        mock_dispatch.assert_called_once_with(
            user_id="mock-user-123",
            target_agent="career_twin",
            payload={"target_role": "Software Engineer"}
        )

def test_generate_twin_no_resume(mock_twin_service, mock_current_student):
    mock_twin_service.get_student_id.return_value = "mock-student-123"
    mock_twin_service.check_resume_exists.return_value = False

    response = client.post(
        "/api/v1/career_twin/generate",
        json={"target_role": "Software Engineer"}
    )

    assert response.status_code == 400
    assert "upload a resume" in response.json()["detail"]

def test_get_my_twin_success(mock_twin_service, mock_current_student):
    mock_twin_service.get_student_id.return_value = "mock-student-123"
    
    mock_twin = CareerTwinResponse(
        id="mock-twin-id",
        student_id="mock-student-123",
        readiness_score=85.0,
        strengths=["Python", "FastAPI"],
        weaknesses=["CSS"],
        recommended_roles=["Backend Engineer"]
    )
    mock_twin_service.get_my_twin.return_value = mock_twin

    response = client.get("/api/v1/career_twin/me")

    assert response.status_code == 200
    assert response.json()["readiness_score"] == 85.0
    assert "Python" in response.json()["strengths"]

def test_get_my_twin_not_found(mock_twin_service, mock_current_student):
    mock_twin_service.get_student_id.return_value = "mock-student-123"
    mock_twin_service.get_my_twin.return_value = None

    response = client.get("/api/v1/career_twin/me")

    assert response.status_code == 404
    assert "not found" in response.json()["detail"].lower()
