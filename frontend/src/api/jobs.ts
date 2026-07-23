import { apiClient } from './client';

export const jobsApi = {
  listJobs: () => apiClient<any[]>('/jobs', { method: 'GET' }),
  applyToJob: (jobId: string) => 
    apiClient<{ status: string }>(`/jobs/${jobId}/apply`, { method: 'POST' }),
};
