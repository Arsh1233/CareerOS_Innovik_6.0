import pytest
from httpx import AsyncClient, ASGITransport
from app.main import app
import os
from unittest.mock import patch, MagicMock
from app.api.dependencies import get_current_user

# Create a mock for the get_current_user dependency
async def mock_get_current_user():
    return {"id": "test-user-id", "email": "test@test.com", "role": "student", "sub": "test-user-id"}

# We need to override the dependency in the app
@pytest.fixture(autouse=True)
def override_auth_dependency():
    app.dependency_overrides[get_current_user] = mock_get_current_user
    yield
    app.dependency_overrides.clear()

@pytest.mark.asyncio
async def test_trigger_job_recommendations():
    # Mock the JobsService dependency
    with patch("app.api.v1.jobs.routes.JobsService") as mock_jobs_service_class, \
         patch("app.api.v1.jobs.routes.dispatch_agent_task") as mock_dispatch:
        
        # Setup mock JobsService
        mock_jobs_service = MagicMock()
        mock_jobs_service_class.return_value = mock_jobs_service
        
        # Mock Supabase table calls
        mock_table = MagicMock()
        mock_jobs_service.supabase.table.return_value = mock_table
        
        # Mock select().eq().execute() chain for students
        mock_student_execute = MagicMock()
        mock_student_execute.data = [{"id": "student-123"}]
        mock_eq_student = MagicMock()
        mock_eq_student.execute.return_value = mock_student_execute
        mock_select_student = MagicMock()
        mock_select_student.eq.return_value = mock_eq_student
        
        # Mock select().eq().execute() chain for career twins
        mock_twin_execute = MagicMock()
        mock_twin_execute.data = [{"id": "twin-123"}]
        mock_eq_twin = MagicMock()
        mock_eq_twin.execute.return_value = mock_twin_execute
        mock_select_twin = MagicMock()
        mock_select_twin.eq.return_value = mock_eq_twin
        
        # Attach to table mock
        def side_effect_table(name):
            if name == "students":
                mock_table.select.return_value = mock_select_student
            elif name == "career_twins":
                mock_table.select.return_value = mock_select_twin
            return mock_table
            
        mock_jobs_service.supabase.table.side_effect = side_effect_table
        
        # Setup mock n8n client
        mock_dispatch.return_value = None

        async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
            response = await ac.post("/api/v1/jobs/recommend", json={
                "target_role": "Senior Developer"
            })
            
            assert response.status_code == 202
            data = response.json()
            assert "Job recommendations generation started" in data["message"]
            assert data["status"] == "accepted"

@pytest.mark.asyncio
async def test_get_recommendations_success():
    with patch("app.api.v1.jobs.routes.JobsService") as mock_jobs_service_class:
        mock_jobs_service = MagicMock()
        mock_jobs_service_class.return_value = mock_jobs_service
        
        from app.schemas.jobs import RecommendationsResponse, JobMatch
        
        mock_jobs_service.get_my_recommendations.return_value = RecommendationsResponse(
            student_id="test-user-id",
            target_role="Software Engineer",
            jobs=[
                JobMatch(
                    id="job1",
                    job_id="ext_1",
                    title="Frontend Developer",
                    company="Tech Corp",
                    location="Remote",
                    match_score=95,
                    match_reasons=["Knows React"],
                    missing_skills=["GraphQL"],
                    apply_url="https://example.com"
                )
            ]
        )

        async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
            response = await ac.get("/api/v1/jobs/recommendations")
            
            assert response.status_code == 200
            data = response.json()
            assert data["student_id"] == "test-user-id"
            assert len(data["jobs"]) == 1
            assert data["jobs"][0]["title"] == "Frontend Developer"
