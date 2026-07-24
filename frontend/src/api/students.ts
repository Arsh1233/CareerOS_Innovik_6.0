import { apiClient } from './client';

export const studentsApi = {
  getDashboard: () => apiClient<any>('/students/me/dashboard', { method: 'GET' }),
  
  getCareerTwin: () => apiClient<any>('/career_twin/me', { method: 'GET' }),
  generateCareerTwin: (data?: { target_role?: string }) => apiClient<any>('/career_twin/generate', { method: 'POST', data }),
  
  uploadResume: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return apiClient<{ status: string }>('/students/resumes/upload', { method: 'POST', data: formData });
  },
  getResume: () => apiClient<any>('/students/resumes/me', { method: 'GET' }),
  
  getSkills: () => apiClient<any[]>('/students/skills/me', { method: 'GET' }),
  addSkill: (data: { skill_name: string; proficiency: number }) => 
    apiClient<any>('/students/skills/me', { method: 'POST', data }),
    
  getRoadmap: () => apiClient<any>('/students/roadmaps/me', { method: 'GET' }),
  generateRoadmap: (data: { goal_role: string }) => 
    apiClient<{ status: string }>('/students/roadmaps/generate', { method: 'POST', data }),
    
  startInterview: (data: { job_id?: string }) => 
    apiClient<{ session_id: string }>('/students/interviews/start', { method: 'POST', data }),
  uploadInterviewAudio: (sessionId: string, file: File) => {
    const formData = new FormData();
    formData.append('session_id', sessionId);
    formData.append('file', file);
    return apiClient<{ status: string }>('/students/interviews/audio', { method: 'POST', data: formData });
  }
};
