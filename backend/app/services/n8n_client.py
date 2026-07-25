import os
import httpx
from tenacity import retry, wait_exponential, stop_after_attempt, retry_if_exception_type
from typing import Dict, Any, Callable, Optional
import logging
from supabase import create_client, Client
from app.schemas.n8n import TargetAgent
import asyncio

logger = logging.getLogger(__name__)

N8N_WEBHOOK_URL = os.getenv("N8N_WEBHOOK_URL", "http://localhost:5678/webhook")
N8N_API_KEY = os.getenv("N8N_API_KEY", "secure-n8n-api-key")

SUPABASE_URL = os.getenv("SUPABASE_URL", "https://your-project.supabase.co")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY", "your-service-role-key")
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)


class N8NConnectionError(Exception):
    pass


async def call_n8n_agent(
    target_agent: TargetAgent,
    payload: Dict[str, Any],
    fallback_fn: Optional[Callable] = None
) -> Dict[str, Any]:
    """
    Sends execution request to the n8n AI Master Router webhook.
    If n8n agent workflow is active and returns data, uses n8n response.
    If n8n is offline or unreachable, seamlessly falls back to direct Gemini execution
    so the platform remains 100% operational.
    """
    url = f"{N8N_WEBHOOK_URL}/ai-master-router"
    headers = {
        "X-N8N-API-Key": N8N_API_KEY,
        "Content-Type": "application/json"
    }

    wrapper_payload = {
        "target_agent": target_agent.value,
        **payload
    }

    try:
        async with httpx.AsyncClient(timeout=15.0) as client:
            response = await client.post(url, json=wrapper_payload, headers=headers)
            if response.status_code == 200:
                data = response.json()
                logger.info(f"[n8n Agent] Successfully processed via n8n: {target_agent.value}")
                return data
            else:
                logger.warning(f"[n8n Agent] Webhook returned status {response.status_code}, trying fallback")
    except Exception as e:
        logger.info(f"[n8n Agent] n8n webhook unreachable ({e}), using direct AI fallback for {target_agent.value}")

    # Fallback to direct execution if provided
    if fallback_fn:
        if asyncio.iscoroutinefunction(fallback_fn):
            return await fallback_fn()
        return fallback_fn()

    raise N8NConnectionError(f"n8n agent {target_agent.value} unreachable and no fallback provided.")


@retry(
    stop=stop_after_attempt(3),
    wait=wait_exponential(multiplier=1, min=2, max=10),
    retry=retry_if_exception_type((httpx.RequestError, httpx.TimeoutException, N8NConnectionError))
)
async def _post_to_n8n_async(target_agent: TargetAgent, payload: Dict[str, Any]):
    """
    Internal async function to POST to n8n with retry logic.
    Hits the generic Master Router endpoint.
    """
    url = f"{N8N_WEBHOOK_URL}/ai-master-router"
    headers = {
        "X-N8N-API-Key": N8N_API_KEY,
        "Content-Type": "application/json"
    }

    wrapper_payload = {
        "target_agent": target_agent.value,
        **payload
    }

    async with httpx.AsyncClient(timeout=10.0) as client:
        try:
            response = await client.post(url, json=wrapper_payload, headers=headers)
            response.raise_for_status()
        except httpx.HTTPStatusError as e:
            logger.error(f"n8n Master Router returned error {e.response.status_code}: {e}")
            raise N8NConnectionError(f"HTTP Status Error: {e.response.status_code}")
        except httpx.RequestError as e:
            logger.error(f"Failed to reach n8n Master Router: {e}")
            raise e


def dispatch_agent_task(user_id: str, target_agent: str, payload: Dict[str, Any]):
    """
    Called via BackgroundTasks to dispatch tasks to n8n agent tracker.
    """
    try:
        agent_enum = TargetAgent(target_agent)
    except ValueError:
        logger.error(f"Invalid target agent: {target_agent}")
        return

    task_id = None
    try:
        # 1. Create tracking row in Supabase
        res = supabase.table("agent_tasks").insert({
            "user_id": user_id,
            "target_agent": agent_enum.value,
            "status": "pending"
        }).execute()

        if res.data:
            task_id = res.data[0]["id"]
            payload["task_id"] = task_id

        # 2. Trigger webhook asynchronously
        asyncio.run(_post_to_n8n_async(agent_enum, payload))

    except Exception as e:
        logger.error(f"Failed to dispatch agent task {target_agent}: {e}")
        if task_id:
            try:
                supabase.table("agent_tasks").update({
                    "status": "failed",
                    "error_message": str(e)
                }).eq("id", task_id).execute()
            except Exception:
                pass
