import { createContext, useContext, useState } from 'react'

export type JobType = 'Full-time' | 'Internship' | 'Contract' | 'Part-time'
export type AppStatus = 'Applied' | 'Shortlisted' | 'Interview' | 'Offer' | 'Rejected'

export interface Job {
  id: string
  title: string
  company: string
  type: JobType
  location: string
  remote: boolean
  salary: string
  skills: string[]
  description: string
  requirements: string[]
  openings: number
  deadline: string
  postedAt: string
  color: string
  match: number
  recruiterCompany?: string
}

export interface Application {
  id: string
  jobId: string
  jobTitle: string
  company: string
  color: string
  studentId: string
  studentName: string
  studentAvatar: string
  college: string
  branch: string
  cgpa: string
  matchScore: number
  status: AppStatus
  appliedAt: string
  notes: string
}

const DEFAULT_JOBS: Job[] = [
  {
    id: 'j1', title: 'AI Safety Researcher', company: 'Anthropic', type: 'Full-time',
    location: 'San Francisco, CA', remote: false, salary: '₹95–140 LPA', match: 94,
    skills: ['Python', 'LLM', 'Safety', 'RL'], color: '#3B82F6', openings: 3,
    deadline: '2025-09-30', postedAt: '2025-07-10',
    description: 'Join our safety team to research and mitigate risks in frontier AI models. You will work on interpretability, alignment, and evaluation methodologies.',
    requirements: ['PhD or equivalent in ML/CS', '3+ years LLM research', 'Published safety or alignment research', 'Strong Python & PyTorch'],
  },
  {
    id: 'j2', title: 'ML Engineer', company: 'Google DeepMind', type: 'Full-time',
    location: 'London, UK', remote: false, salary: '₹80–120 LPA', match: 89,
    skills: ['TensorFlow', 'ML', 'Python', 'Distributed Systems'], color: '#8B5CF6', openings: 5,
    deadline: '2025-10-15', postedAt: '2025-07-08',
    description: 'Build and scale machine learning infrastructure for research teams. Own the full ML lifecycle from experiment to production.',
    requirements: ['BTech/MTech CS or related', '2+ years ML engineering', 'TensorFlow or JAX expertise', 'Experience with large-scale training'],
  },
  {
    id: 'j3', title: 'AI Research Intern', company: 'OpenAI', type: 'Internship',
    location: 'Remote', remote: true, salary: '₹2.5L/mo', match: 85,
    skills: ['PyTorch', 'NLP', 'LLM', 'Research'], color: '#06B6D4', openings: 10,
    deadline: '2025-08-31', postedAt: '2025-07-12',
    description: '6-month internship working directly with research scientists on frontier model capabilities. Publish papers, run experiments, contribute to GPT-5 evaluation.',
    requirements: ['Pursuing MS/PhD in ML/AI', 'Strong PyTorch skills', 'NLP or RL background', 'Prior research experience a plus'],
  },
  {
    id: 'j4', title: 'ML Researcher', company: 'Hugging Face', type: 'Full-time',
    location: 'Remote', remote: true, salary: '₹55–85 LPA', match: 82,
    skills: ['Transformers', 'NLP', 'Python', 'Open Source'], color: '#F59E0B', openings: 2,
    deadline: '2025-09-20', postedAt: '2025-07-05',
    description: 'Research and develop state-of-the-art NLP models. Publish open-source model weights and contribute to the Transformers library.',
    requirements: ['BTech/MTech in CS', '1+ years NLP research', 'Hugging Face ecosystem experience', 'Open source contributions preferred'],
  },
  {
    id: 'j5', title: 'AI Platform Engineer', company: 'Microsoft', type: 'Full-time',
    location: 'Hyderabad, IN', remote: false, salary: '₹40–65 LPA', match: 78,
    skills: ['Azure', 'MLOps', 'Python', 'Kubernetes'], color: '#0EA5E9', openings: 8,
    deadline: '2025-10-01', postedAt: '2025-07-01',
    description: 'Design and operate Microsoft\'s Azure AI platform infrastructure. Enable internal ML teams to train and serve models at scale.',
    requirements: ['BTech CS/ECE', '2+ years cloud/DevOps', 'Azure certifications a plus', 'Strong Kubernetes & CI/CD'],
  },
  {
    id: 'j6', title: 'LLM Engineer', company: 'Sarvam AI', type: 'Full-time',
    location: 'Bangalore, IN', remote: false, salary: '₹35–55 LPA', match: 88,
    skills: ['LLM', 'Python', 'LangChain', 'Fine-tuning'], color: '#8B5CF6', openings: 4,
    deadline: '2025-09-15', postedAt: '2025-07-14',
    description: 'Build India\'s most capable multilingual LLM. Work on fine-tuning, RLHF, and Indic language data pipelines.',
    requirements: ['BTech CS', 'LLM fine-tuning experience', 'Python & LangChain', 'Hindi/Indic language interest'],
  },
  {
    id: 'j7', title: 'Data Scientist', company: 'Zepto', type: 'Full-time',
    location: 'Bangalore, IN', remote: false, salary: '₹28–42 LPA', match: 74,
    skills: ['Python', 'SQL', 'ML', 'A/B Testing'], color: '#34D399', openings: 6,
    deadline: '2025-09-10', postedAt: '2025-07-03',
    description: 'Drive growth and operational efficiency through data science at India\'s fastest-growing quick commerce company.',
    requirements: ['BTech CS/Maths/Stats', 'Strong SQL & Python', 'ML model deployment experience', 'Business analytical mindset'],
  },
  {
    id: 'j8', title: 'Applied ML Intern', company: 'Cohere', type: 'Internship',
    location: 'Remote', remote: true, salary: '₹1.8L/mo', match: 80,
    skills: ['NLP', 'PyTorch', 'LLM', 'APIs'], color: '#EC4899', openings: 5,
    deadline: '2025-08-20', postedAt: '2025-07-11',
    description: '4-month internship building LLM-powered enterprise applications. Work with Command R+ and Embed models to solve real business problems.',
    requirements: ['Pursuing BTech/MTech CS', 'PyTorch & NLP basics', 'API integration experience', 'Strong problem-solving'],
  },
]

const DEFAULT_APPLICATIONS: Application[] = [
  { id: 'a1', jobId: 'j1', jobTitle: 'AI Safety Researcher', company: 'Anthropic', color: '#3B82F6', studentId: 'rahul', studentName: 'Rahul Sharma', studentAvatar: 'RS', college: 'IIT Delhi', branch: 'CSE AI', cgpa: '9.2', matchScore: 94, status: 'Shortlisted', appliedAt: '2025-07-15', notes: '' },
  { id: 'a2', jobId: 'j3', jobTitle: 'AI Research Intern', company: 'OpenAI', color: '#06B6D4', studentId: 'rahul', studentName: 'Rahul Sharma', studentAvatar: 'RS', college: 'IIT Delhi', branch: 'CSE AI', cgpa: '9.2', matchScore: 85, status: 'Applied', appliedAt: '2025-07-18', notes: '' },
  { id: 'a3', jobId: 'j6', jobTitle: 'LLM Engineer', company: 'Sarvam AI', color: '#8B5CF6', studentId: 'rahul', studentName: 'Rahul Sharma', studentAvatar: 'RS', college: 'IIT Delhi', branch: 'CSE AI', cgpa: '9.2', matchScore: 88, status: 'Interview', appliedAt: '2025-07-10', notes: '' },
  { id: 'a4', jobId: 'j1', jobTitle: 'AI Safety Researcher', company: 'Anthropic', color: '#3B82F6', studentId: 'priya', studentName: 'Priya Mehta', studentAvatar: 'PM', college: 'IIT Bombay', branch: 'ECE', cgpa: '9.5', matchScore: 91, status: 'Interview', appliedAt: '2025-07-14', notes: '' },
  { id: 'a5', jobId: 'j2', jobTitle: 'ML Engineer', company: 'Google DeepMind', color: '#8B5CF6', studentId: 'arjun', studentName: 'Arjun Kapoor', studentAvatar: 'AK', college: 'BITS Pilani', branch: 'CS', cgpa: '8.8', matchScore: 88, status: 'Applied', appliedAt: '2025-07-16', notes: '' },
  { id: 'a6', jobId: 'j4', jobTitle: 'ML Researcher', company: 'Hugging Face', color: '#F59E0B', studentId: 'sneha', studentName: 'Sneha Reddy', studentAvatar: 'SR', college: 'NIT Warangal', branch: 'CSE', cgpa: '9.1', matchScore: 85, status: 'Shortlisted', appliedAt: '2025-07-13', notes: '' },
]

interface JobsContextValue {
  jobs: Job[]
  applications: Application[]
  postJob: (job: Omit<Job, 'id' | 'postedAt' | 'match'>) => void
  applyToJob: (jobId: string, student: Pick<Application, 'studentId' | 'studentName' | 'studentAvatar' | 'college' | 'branch' | 'cgpa' | 'matchScore'>) => void
  updateApplicationStatus: (appId: string, status: AppStatus, notes?: string) => void
  getJobApplications: (jobId: string) => Application[]
  getStudentApplications: (studentId: string) => Application[]
  hasApplied: (jobId: string, studentId: string) => boolean
}

const JobsContext = createContext<JobsContextValue>({
  jobs: DEFAULT_JOBS, applications: DEFAULT_APPLICATIONS,
  postJob: () => {}, applyToJob: () => {}, updateApplicationStatus: () => {},
  getJobApplications: () => [], getStudentApplications: () => [], hasApplied: () => false,
})

export function JobsProvider({ children }: { children: React.ReactNode }) {
  const [jobs, setJobs] = useState<Job[]>(DEFAULT_JOBS)
  const [applications, setApplications] = useState<Application[]>(DEFAULT_APPLICATIONS)

  const postJob = (job: Omit<Job, 'id' | 'postedAt' | 'match'>) => {
    const newJob: Job = { ...job, id: `j${Date.now()}`, postedAt: new Date().toISOString().slice(0, 10), match: 0 }
    setJobs(prev => [newJob, ...prev])
  }

  const applyToJob = (jobId: string, student: Pick<Application, 'studentId' | 'studentName' | 'studentAvatar' | 'college' | 'branch' | 'cgpa' | 'matchScore'>) => {
    const job = jobs.find(j => j.id === jobId)
    if (!job) return
    const app: Application = {
      id: `a${Date.now()}`, jobId, jobTitle: job.title, company: job.company, color: job.color,
      ...student, status: 'Applied', appliedAt: new Date().toISOString().slice(0, 10), notes: '',
    }
    setApplications(prev => [app, ...prev])
  }

  const updateApplicationStatus = (appId: string, status: AppStatus, notes = '') => {
    setApplications(prev => prev.map(a => a.id === appId ? { ...a, status, notes: notes || a.notes } : a))
  }

  const getJobApplications = (jobId: string) => applications.filter(a => a.jobId === jobId)
  const getStudentApplications = (studentId: string) => applications.filter(a => a.studentId === studentId)
  const hasApplied = (jobId: string, studentId: string) => applications.some(a => a.jobId === jobId && a.studentId === studentId)

  return (
    <JobsContext.Provider value={{ jobs, applications, postJob, applyToJob, updateApplicationStatus, getJobApplications, getStudentApplications, hasApplied }}>
      {children}
    </JobsContext.Provider>
  )
}

export function useJobs() {
  return useContext(JobsContext)
}

export const STATUS_COLORS: Record<AppStatus, string> = {
  Applied: '#3B82F6', Shortlisted: '#F59E0B', Interview: '#8B5CF6', Offer: '#34D399', Rejected: '#EF4444',
}
