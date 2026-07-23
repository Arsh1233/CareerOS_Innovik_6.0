import { apiClient } from './client';

export const collegesApi = {
  getAnalytics: () => apiClient<any>('/colleges/analytics', { method: 'GET' }),
};
