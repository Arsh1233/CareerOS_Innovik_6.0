"""
Groq AI client — wraps groq SDK for use across all CareerOS agents.
Drop-in replacement for the Gemini client with the same generate() and chat() interface.
"""
import os
import time
import logging
from typing import List, Dict, Optional
# pyrefly: ignore [missing-import]
from groq import Groq

from dotenv import load_dotenv

logger = logging.getLogger(__name__)


def _get_client() -> Groq:
    """Reads GROQ_API_KEY dynamically so new keys take effect immediately."""
    load_dotenv(override=True)
    api_key = os.getenv("GROQ_API_KEY", "").strip().strip('"').strip("'")
    if not api_key:
        raise RuntimeError(
            "GROQ_API_KEY is not set. Add a valid Groq API key from https://console.groq.com/keys to backend/.env."
        )
    return Groq(api_key=api_key, timeout=15.0)


FALLBACK_MODELS = ["llama-3.3-70b-versatile", "llama-3.1-8b-instant", "gemma2-9b-it"]
MAX_RETRIES = 2
RETRY_DELAY = 5  # seconds


def _is_retryable(err_msg: str) -> bool:
    """Check if the error is retryable (rate limit, unavailable, etc.)."""
    retryable = ["429", "503", "rate_limit", "RESOURCE_EXHAUSTED", "UNAVAILABLE", "overloaded"]
    return any(code.lower() in err_msg.lower() for code in retryable)


def generate(prompt: str, system_instruction: str = "", max_output_tokens: int = 4096) -> str:
    """
    Single-turn generation with automatic model fallback and retry with backoff.
    """
    client = _get_client()

    messages = []
    if system_instruction:
        messages.append({"role": "system", "content": system_instruction})
    messages.append({"role": "user", "content": prompt})

    last_error = None
    for attempt in range(MAX_RETRIES + 1):
        for model_name in FALLBACK_MODELS:
            try:
                response = client.chat.completions.create(
                    model=model_name,
                    messages=messages,
                    temperature=0.7,
                    max_tokens=max_output_tokens,
                )
                text = response.choices[0].message.content
                if text:
                    return text
            except Exception as e:
                last_error = e
                err_msg = str(e)
                logger.warning(f"Model {model_name} failed (attempt {attempt+1}): {err_msg[:100]}")
                if _is_retryable(err_msg):
                    continue
                raise e

        if attempt < MAX_RETRIES:
            logger.info(f"All models exhausted, waiting {RETRY_DELAY}s before retry {attempt+2}...")
            time.sleep(RETRY_DELAY)

    if last_error:
        raise last_error
    return ""


def chat(
    message: str,
    history: List[Dict[str, str]],
    system_instruction: str = "",
) -> str:
    """
    Multi-turn chat with automatic model fallback and retry with backoff.
    """
    client = _get_client()

    messages = []
    if system_instruction:
        messages.append({"role": "system", "content": system_instruction})

    for turn in history:
        role = turn.get("role", "user")
        text = turn.get("text", "")
        # Map Gemini role names to OpenAI-compatible ones
        if role == "model":
            role = "assistant"
        messages.append({"role": role, "content": text})

    messages.append({"role": "user", "content": message})

    last_error = None
    for attempt in range(MAX_RETRIES + 1):
        for model_name in FALLBACK_MODELS:
            try:
                response = client.chat.completions.create(
                    model=model_name,
                    messages=messages,
                    temperature=0.8,
                    max_tokens=2048,
                )
                text = response.choices[0].message.content
                if text:
                    return text
            except Exception as e:
                last_error = e
                err_msg = str(e)
                logger.warning(f"Model {model_name} failed (attempt {attempt+1}): {err_msg[:100]}")
                if _is_retryable(err_msg):
                    continue
                raise e

        if attempt < MAX_RETRIES:
            logger.info(f"All models exhausted, waiting {RETRY_DELAY}s before retry {attempt+2}...")
            time.sleep(RETRY_DELAY)

    if last_error:
        raise last_error
    return ""
