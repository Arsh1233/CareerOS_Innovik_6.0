import pytest
from httpx import AsyncClient, ASGITransport
from app.main import app
from unittest.mock import patch, MagicMock

@pytest.fixture
def auth_headers():
    # We mock the JWTAuthMiddleware in testing, or mock the dependencies
    # For now, we patch the dependency `get_current_user` directly
    return {"Authorization": "Bearer test-token"}

@pytest.mark.asyncio
@patch("app.api.dependencies.get_current_user")
@patch("app.api.v1.roadmaps.routes.roadmap_service")
async def test_generate_roadmap_success(mock_roadmap_service, mock_get_user):
    # Setup mock user
    mock_get_user.return_value = {"id": "test-user-id", "email": "test@test.com", "role": "student"}
    
    # Setup mock service
    mock_roadmap_service.trigger_roadmap_generation.return_value = {"status": "accepted", "message": "Roadmap generation started"}

    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        from app.core.security import verify_jwt_token
        app.dependency_overrides[verify_jwt_token] = lambda: {"sub": "test-user-id", "email": "test@test.com", "app_metadata": {"role": "student"}}
        
        response = await ac.post(
            "/api/v1/roadmaps/generate",
            json={"goal_role": "Senior Frontend Developer", "timeframe_months": 6},
            headers={"Authorization": "Bearer test-token"}
        )
        assert response.status_code == 202
        assert response.json() == {"status": "accepted", "message": "Roadmap generation started"}

        app.dependency_overrides.clear()

    # But we can test the RoadmapService directly!
@pytest.mark.asyncio
@patch("app.services.roadmaps.BackgroundTasks")
async def test_trigger_roadmap_service(mock_bg_tasks):
    from app.services.roadmaps import RoadmapService
    from app.schemas.roadmaps import GenerateRoadmapRequest
    
    service = RoadmapService()
    
    # Mock supabase manually
    mock_supabase = MagicMock()
    service.supabase = mock_supabase
    
    # Mock student fetch
    mock_execute = MagicMock()
    mock_execute.execute.return_value = MagicMock(data=[{"id": "student-123"}])
    
    mock_eq = MagicMock()
    mock_eq.eq.return_value = mock_execute
    
    mock_select = MagicMock()
    mock_select.select.return_value = mock_eq
    
    # The first call is for student, second is for twin
    # We'll just return the same mock structure for simplicity
    mock_supabase.table.return_value = mock_select
    
    req = GenerateRoadmapRequest(goal_role="Backend Engineer", timeframe_months=3)
    
    res = service.trigger_roadmap_generation("user-123", req, mock_bg_tasks)
    
    assert res["status"] == "accepted"
    mock_bg_tasks.add_task.assert_called_once()
