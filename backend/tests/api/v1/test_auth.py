# pyrefly: ignore [missing-import]
import pytest
# pyrefly: ignore [missing-import]
from fastapi.testclient import TestClient
from unittest.mock import AsyncMock, patch
from app.main import app
from app.schemas.auth import TokenSchema, OAuthUrlSchema
from app.services.auth import AuthService

client = TestClient(app)

@pytest.fixture
def mock_auth_service():
    with patch("app.api.v1.auth.routes.get_auth_service") as mock_get_service:
        mock_service = AsyncMock(spec=AuthService)
        mock_get_service.return_value = mock_service
        yield mock_service

def test_register_success(mock_auth_service):
    mock_auth_service.register_user.return_value = TokenSchema(
        access_token="mock_access_token",
        refresh_token="mock_refresh_token",
        expires_in=3600
    )
    
    response = client.post(
        "/api/v1/auth/register",
        json={"email": "test@example.com", "password": "password123", "role": "student"}
    )
    
    assert response.status_code == 200
    assert response.json()["access_token"] == "mock_access_token"
    mock_auth_service.register_user.assert_called_once()

def test_register_failure(mock_auth_service):
    mock_auth_service.register_user.side_effect = ValueError("Email already in use")
    
    response = client.post(
        "/api/v1/auth/register",
        json={"email": "test@example.com", "password": "password123", "role": "student"}
    )
    
    assert response.status_code == 400
    assert response.json()["detail"] == "Email already in use"

def test_login_success(mock_auth_service):
    mock_auth_service.login_user.return_value = TokenSchema(
        access_token="mock_access_token",
        refresh_token="mock_refresh_token",
        expires_in=3600
    )
    
    response = client.post(
        "/api/v1/auth/login",
        json={"email": "test@example.com", "password": "password123"}
    )
    
    assert response.status_code == 200
    assert response.json()["access_token"] == "mock_access_token"

def test_login_failure(mock_auth_service):
    mock_auth_service.login_user.side_effect = ValueError("Invalid email or password.")
    
    response = client.post(
        "/api/v1/auth/login",
        json={"email": "test@example.com", "password": "wrongpassword"}
    )
    
    assert response.status_code == 401
    assert response.json()["detail"] == "Invalid email or password."

def test_google_oauth_url(mock_auth_service):
    mock_auth_service.get_oauth_url.return_value = OAuthUrlSchema(
        provider="google",
        url="https://mock-supabase.co/auth/v1/authorize?provider=google"
    )
    
    response = client.get("/api/v1/auth/google/url")
    
    assert response.status_code == 200
    assert response.json()["url"] == "https://mock-supabase.co/auth/v1/authorize?provider=google"
