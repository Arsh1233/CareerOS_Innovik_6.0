import { apiClient } from './client';

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export interface MentorChatResponse {
  reply: string;
}

export const mentorApi = {
  chat: (message: string, history: ChatMessage[] = [], user_profile?: Record<string, any>) =>
    apiClient<MentorChatResponse>('/mentor/chat', {
      method: 'POST',
      data: { message, history, user_profile },
    }),
};
