import { apiClient } from './client';

export const recruitersApi = {
  getAnalytics: () => apiClient<any>('/recruiters/analytics', { method: 'GET' }),
  
  searchCandidates: (data: { semantic_query: string }) => 
    apiClient<{ status: string }>('/recruiters/search', { method: 'POST', data }),
    
  createJob: (data: { title: string; description: string; requirements: string[] }) => 
    apiClient<any>('/recruiters/jobs', { method: 'POST', data }),
};
