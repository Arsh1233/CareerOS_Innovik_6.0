import { authApi } from './auth';
import { studentsApi } from './students';
import { recruitersApi } from './recruiters';
import { collegesApi } from './colleges';
import { jobsApi } from './jobs';

export const api = {
  auth: authApi,
  students: studentsApi,
  recruiters: recruitersApi,
  colleges: collegesApi,
  jobs: jobsApi
};

export default api;
