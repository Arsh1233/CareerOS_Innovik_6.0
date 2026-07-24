from pydantic import BaseModel
from typing import List, Optional


class ChatMessage(BaseModel):
    role: str          # "user" or "model"
    text: str


class MentorChatRequest(BaseModel):
    message: str
    history: Optional[List[ChatMessage]] = []


class MentorChatResponse(BaseModel):
    reply: str
