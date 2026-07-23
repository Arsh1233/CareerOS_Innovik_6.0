from fastapi import APIRouter, Depends, HTTPException, status
from app.schemas.n8n import N8nWebhookStatusUpdate
from app.api.dependencies import verify_n8n_webhook_secret
import logging
from supabase import create_client, Client
import os

logger = logging.getLogger(__name__)

router = APIRouter()

SUPABASE_URL = os.getenv("SUPABASE_URL", "https://your-project.supabase.co")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY", "your-service-role-key")
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

@router.post("/status", dependencies=[Depends(verify_n8n_webhook_secret)])
async def update_agent_status(payload: N8nWebhookStatusUpdate):
    """
    Webhook endpoint for n8n to report the status of an async agent task.
    Requires WEBHOOK_SECRET Bearer token.
    """
    logger.info(f"Received n8n webhook update for task_id: {payload.task_id} with status: {payload.status}")
    
    try:
        # Update the task in Supabase
        # We also want to capture the specific output if successful
        update_data = {
            "status": payload.status,
            "result": payload.result_data,
            "error_message": payload.error_message
        }
        
        response = supabase.table("agent_tasks").update(update_data).eq("id", payload.task_id).execute()
        
        if not response.data:
            logger.warning(f"Task ID {payload.task_id} not found in database")
            raise HTTPException(status_code=404, detail="Task not found")
            
        return {"status": "success", "message": "Task status updated"}
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating agent task status: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error while updating status")
