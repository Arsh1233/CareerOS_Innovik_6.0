import pytest
from fastapi.testclient import TestClient
from unittest.mock import AsyncMock
from app.main import app
from app.schemas.users import (
    ProfileResponse, UserDetailsResponse, StudentDetails
)
from app.services.profiles import ProfileService
from app.api.v1.users.routes import get_profile_service
from app.dependencies import get_current_user

client = TestClient(app)

@pytest.fixture
def mock_profile_service():
    mock_service = AsyncMock(spec=ProfileService)
    app.dependency_overrides[get_profile_service] = lambda: mock_service
    yield mock_service
    app.dependency_overrides.clear()

@pytest.fixture
def mock_current_user():
    # Mocking verify_jwt_token/get_current_user to return a valid payload
    user_payload = {
        "sub": "mock-uuid-123",
        "user_metadata": {"role": "student"}
    }
    app.dependency_overrides[get_current_user] = lambda: user_payload
    yield user_payload
    app.dependency_overrides.clear()

def test_get_profile_success(mock_profile_service, mock_current_user):
    mock_profile_service.get_profile.return_value = ProfileResponse(
        first_name="John",
        last_name="Doe",
        avatar_url="https://example.com/avatar.png"
    )
    
    # We bypass the JWTAuthMiddleware logic by mocking get_current_user
    response = client.get("/api/v1/users/me/profile")
    
    assert response.status_code == 200
    assert response.json()["first_name"] == "John"
    assert response.json()["last_name"] == "Doe"
    mock_profile_service.get_profile.assert_called_once_with("mock-uuid-123")

def test_update_profile_success(mock_profile_service, mock_current_user):
    mock_profile_service.update_profile.return_value = ProfileResponse(
        first_name="Jane",
        last_name="Doe",
        avatar_url="https://example.com/avatar2.png"
    )
    
    response = client.put(
        "/api/v1/users/me/profile",
        json={"first_name": "Jane", "last_name": "Doe"}
    )
    
    assert response.status_code == 200
    assert response.json()["first_name"] == "Jane"
    mock_profile_service.update_profile.assert_called_once()

def test_get_role_details_success(mock_profile_service, mock_current_user):
    mock_profile_service.get_role_details.return_value = UserDetailsResponse(
        role="student",
        details=StudentDetails(major="Computer Science", graduation_year="2025")
    )
    
    response = client.get("/api/v1/users/me/details")
    
    assert response.status_code == 200
    data = response.json()
    assert data["role"] == "student"
    assert data["details"]["major"] == "Computer Science"
    mock_profile_service.get_role_details.assert_called_once_with("mock-uuid-123", "student")

def test_update_role_details_success(mock_profile_service, mock_current_user):
    mock_profile_service.update_role_details.return_value = UserDetailsResponse(
        role="student",
        details=StudentDetails(major="Physics", graduation_year="2026")
    )
    
    response = client.put(
        "/api/v1/users/me/details",
        json={"student": {"major": "Physics", "graduation_year": "2026"}}
    )
    
    assert response.status_code == 200
    data = response.json()
    assert data["role"] == "student"
    assert data["details"]["major"] == "Physics"
    mock_profile_service.update_role_details.assert_called_once()
