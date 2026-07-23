import pytest
from httpx import AsyncClient, ASGITransport
from app.main import app
import os
from unittest.mock import patch, MagicMock

@pytest.mark.asyncio
async def test_webhook_unauthorized():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        response = await ac.post(
            "/api/v1/webhooks/n8n/status",
            json={"task_id": "test-id", "status": "completed"}
        )
        assert response.status_code == 401

@pytest.mark.asyncio
async def test_webhook_invalid_secret():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        response = await ac.post(
            "/api/v1/webhooks/n8n/status",
            json={"task_id": "test-id", "status": "completed"},
            headers={"Authorization": "Bearer wrong-secret"}
        )
        assert response.status_code == 403

@pytest.mark.asyncio
@patch("app.api.v1.webhooks.n8n.supabase")
async def test_webhook_success(mock_supabase):
    # Setup mock
    mock_execute = MagicMock()
    mock_execute.execute.return_value = MagicMock(data=[{"id": "test-id"}])
    mock_eq = MagicMock()
    mock_eq.eq.return_value = mock_execute
    mock_update = MagicMock()
    mock_update.update.return_value = mock_eq
    mock_supabase.table.return_value = mock_update

    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        response = await ac.post(
            "/api/v1/webhooks/n8n/status",
            json={
                "task_id": "test-id", 
                "status": "completed", 
                "result_data": {"test": "data"}
            },
            headers={"Authorization": "Bearer super-secret-webhook-key"}
        )
        assert response.status_code == 200
        assert response.json() == {"status": "success", "message": "Task status updated"}
        mock_supabase.table.assert_called_with("agent_tasks")
        mock_update.update.assert_called_once()
        mock_eq.eq.assert_called_with("id", "test-id")

@pytest.mark.asyncio
@patch("app.api.v1.webhooks.n8n.supabase")
async def test_webhook_not_found(mock_supabase):
    # Setup mock for missing row
    mock_execute = MagicMock()
    mock_execute.execute.return_value = MagicMock(data=[]) # No data returned
    mock_eq = MagicMock()
    mock_eq.eq.return_value = mock_execute
    mock_update = MagicMock()
    mock_update.update.return_value = mock_eq
    mock_supabase.table.return_value = mock_update

    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        response = await ac.post(
            "/api/v1/webhooks/n8n/status",
            json={"task_id": "missing-id", "status": "completed"},
            headers={"Authorization": "Bearer super-secret-webhook-key"}
        )
        assert response.status_code == 404
