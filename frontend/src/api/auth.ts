import { apiClient } from './client';

export const authApi = {
  login: (data: any) => apiClient<any>('/auth/login', { method: 'POST', data }),
  register: (data: any) => apiClient<any>('/auth/register', { method: 'POST', data }),
  getGoogleUrl: () => apiClient<{ url: string }>('/auth/google/url', { method: 'GET' }),
  
  // Profile is nested under /users/me in the backend
  getProfile: () => apiClient<any>('/users/me/profile', { method: 'GET' }),
  updateProfile: (data: any) => apiClient<any>('/users/me/profile', { method: 'PUT', data }),
  
  logout: () => {
    localStorage.removeItem('careeros_access_token');
    localStorage.removeItem('careeros_refresh_token');
  }
};
