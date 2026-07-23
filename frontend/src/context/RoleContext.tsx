import { createContext, useContext, useState, useEffect } from 'react'

export type UserRole = 'student' | 'recruiter' | 'college' | 'admin'

export interface NavItem {
  label: string
  path: string
  exact?: boolean
}

export interface RoleConfig {
  label: string
  emoji: string
  color: string
  secondaryColor: string
  tagline: string
  description: string
  primaryPath: string
  navItems: NavItem[]
  moreItems: NavItem[]
  features: string[]
}

export const ROLE_CONFIG: Record<UserRole, RoleConfig> = {
  student: {
    label: 'Student',
    emoji: '🎓',
    color: '#3B82F6',
    secondaryColor: '#8B5CF6',
    tagline: 'Career Development',
    description: 'AI-powered tools to land your dream job',
    primaryPath: '/dashboard',
    navItems: [
      { label: 'Dashboard', path: '/dashboard', exact: true },
      { label: 'Career Twin', path: '/career-twin' },
      { label: 'AI Mentor', path: '/mentor' },
      { label: 'Resume', path: '/resume' },
      { label: 'Jobs', path: '/jobs' },
      { label: 'Interview', path: '/interview' },
      { label: 'Skills', path: '/skills' },
    ],
    moreItems: [
      { label: 'Profile', path: '/profile' },
    ],
    features: ['Career Twin', 'AI Mock Interviews', 'Resume Analyzer', 'Job Matching'],
  },
  recruiter: {
    label: 'Recruiter',
    emoji: '🔍',
    color: '#10B981',
    secondaryColor: '#06B6D4',
    tagline: 'Talent Acquisition',
    description: 'AI-ranked candidates from top institutions',
    primaryPath: '/recruiter',
    navItems: [
      { label: 'Dashboard', path: '/recruiter', exact: true },
      { label: 'Candidates', path: '/recruiter?tab=candidates' },
      { label: 'Job Postings', path: '/recruiter?tab=jobs' },
      { label: 'Pipeline', path: '/recruiter?tab=pipeline' },
      { label: 'Analytics', path: '/recruiter?tab=analytics' },
    ],
    moreItems: [],
    features: ['AI Candidate Screening', 'Talent Pipeline', 'Smart Job Posts', 'Hiring Analytics'],
  },
  college: {
    label: 'Institution',
    emoji: '🏛️',
    color: '#F59E0B',
    secondaryColor: '#F97316',
    tagline: 'Placement Management',
    description: 'End-to-end placement intelligence for your campus',
    primaryPath: '/college',
    navItems: [
      { label: 'Overview', path: '/college', exact: true },
      { label: 'Students', path: '/college?tab=students' },
      { label: 'Departments', path: '/college?tab=departments' },
      { label: 'Recruiters', path: '/college?tab=recruiters' },
      { label: 'Reports', path: '/college?tab=overview' },
    ],
    moreItems: [],
    features: ['Placement Analytics', 'Student Progress', 'Recruiter Network', 'Batch Reports'],
  },
  admin: {
    label: 'Admin',
    emoji: '⚙️',
    color: '#EF4444',
    secondaryColor: '#EC4899',
    tagline: 'Platform Administration',
    description: 'Full visibility and control over CareerOS',
    primaryPath: '/admin',
    navItems: [
      { label: 'Overview', path: '/admin', exact: true },
      { label: 'Users', path: '/admin?tab=users' },
      { label: 'Institutions', path: '/admin?tab=institutions' },
      { label: 'Analytics', path: '/admin?tab=analytics' },
      { label: 'System', path: '/admin?tab=system' },
    ],
    moreItems: [],
    features: ['Platform Metrics', 'User Management', 'System Health', 'Feature Flags'],
  },
}

interface RoleContextValue {
  role: UserRole
  config: RoleConfig
  setRole: (r: UserRole) => void
  isAuthenticated: boolean
  signIn: (role: UserRole) => void
  signOut: () => void
}

const RoleContext = createContext<RoleContextValue>({
  role: 'student',
  config: ROLE_CONFIG.student,
  setRole: () => {},
  isAuthenticated: false,
  signIn: () => {},
  signOut: () => {},
})

export function RoleProvider({ children }: { children: React.ReactNode }) {
  const [role, setRoleState] = useState<UserRole>(() =>
    (localStorage.getItem('careeros-role') as UserRole) ?? 'student'
  )
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() =>
    localStorage.getItem('careeros-authed') === 'true'
  )

  const setRole = (r: UserRole) => {
    setRoleState(r)
    localStorage.setItem('careeros-role', r)
  }

  const signIn = (role: UserRole) => {
    setRoleState(role)
    setIsAuthenticated(true)
    localStorage.setItem('careeros-role', role)
    localStorage.setItem('careeros-authed', 'true')
  }

  const signOut = () => {
    setIsAuthenticated(false)
    localStorage.removeItem('careeros-authed')
    localStorage.removeItem('careeros-role')
    document.documentElement.removeAttribute('data-role')
  }

  useEffect(() => {
    document.documentElement.setAttribute('data-role', role)
  }, [role])

  return (
    <RoleContext.Provider value={{ role, config: ROLE_CONFIG[role], setRole, isAuthenticated, signIn, signOut }}>
      {children}
    </RoleContext.Provider>
  )
}

export function useRole() {
  return useContext(RoleContext)
}
