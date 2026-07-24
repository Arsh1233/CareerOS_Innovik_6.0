"""
Gemini 2.5 Flash client — wraps google-genai for use across all CareerOS agents.
"""
import os
from typing import List, Dict, Optional
from google import genai
from google.genai import types

GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY", "")

_client: Optional[genai.Client] = None


def _get_client() -> genai.Client:
    """Lazily initialises the Gemini client so import errors don't crash startup."""
    global _client
    if _client is None:
        api_key = os.getenv("GOOGLE_API_KEY", "")
        if not api_key:
            raise RuntimeError(
                "GOOGLE_API_KEY is not set. Add it to backend/.env to enable AI features."
            )
        _client = genai.Client(api_key=api_key)
    return _client


MODEL = "gemini-flash-latest"


def generate(prompt: str, system_instruction: str = "") -> str:
    """
    Single-turn generation. Returns the response text.
    """
    client = _get_client()
    config = types.GenerateContentConfig(
        system_instruction=system_instruction or None,
        temperature=0.7,
        max_output_tokens=2048,
    )
    response = client.models.generate_content(
        model=MODEL,
        contents=prompt,
        config=config,
    )
    return response.text or ""


def chat(
    message: str,
    history: List[Dict[str, str]],
    system_instruction: str = "",
) -> str:
    """
    Multi-turn chat. `history` is a list of {"role": "user"|"model", "text": "..."} dicts.
    Returns the model reply text.
    """
    client = _get_client()

    # Build contents list from history + new user message
    contents: List[types.Content] = []
    for turn in history:
        role = turn.get("role", "user")
        text = turn.get("text", "")
        contents.append(
            types.Content(role=role, parts=[types.Part(text=text)])
        )
    # Append current message
    contents.append(
        types.Content(role="user", parts=[types.Part(text=message)])
    )

    config = types.GenerateContentConfig(
        system_instruction=system_instruction or None,
        temperature=0.8,
        max_output_tokens=2048,
    )
    response = client.models.generate_content(
        model=MODEL,
        contents=contents,
        config=config,
    )
    return response.text or ""
