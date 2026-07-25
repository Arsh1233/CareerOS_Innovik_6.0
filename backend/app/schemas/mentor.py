from pydantic import BaseModel
from typing import List, Optional, Dict, Any


class ChatMessage(BaseModel):
    role: str          # "user" or "model"
    text: str


class MentorChatRequest(BaseModel):
    message: str
    history: Optional[List[ChatMessage]] = []
    user_profile: Optional[Dict[str, Any]] = None


class MentorChatResponse(BaseModel):
    reply: str
