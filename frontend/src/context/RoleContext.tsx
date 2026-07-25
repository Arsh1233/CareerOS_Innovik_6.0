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

export interface UserProfile {
  fullName: string
  email: string
  universityName: string
  universityEmail: string
  phone: string
  degree: string
  graduationYear: string
  cgpa: string
  targetRole: string
  githubUrl: string
  leetcodeUrl: string
  linkedinUrl: string
  portfolioUrl: string
  codeforcesHandle: string
  bio: string
}

export const DEFAULT_USER_PROFILE: UserProfile = {
  fullName: 'Arsh Chakraborty',
  email: 'chakrabortyarsh3@gmail.com',
  universityName: 'Indian Institute of Technology, Delhi',
  universityEmail: 'arsh@iitd.ac.in',
  phone: '+91 8269766043',
  degree: 'B.Tech Computer Science & Engineering (AI)',
  graduationYear: '2026',
  cgpa: '8.9',
  targetRole: 'Full Stack & AI Engineer',
  githubUrl: 'https://github.com/Arsh1233',
  leetcodeUrl: 'https://leetcode.com/Arsh1233',
  linkedinUrl: 'https://linkedin.com/in/arsh1233',
  portfolioUrl: 'https://arsh-portfolio.dev',
  codeforcesHandle: 'arsh_master',
  bio: 'Aspiring AI & Distributed Systems Engineer passionate about LLMs, web platforms, and high-performance algorithms.',
}

export function getInitials(name?: string, email?: string): string {
  if (name && name.trim()) {
    const parts = name.trim().split(/\s+/)
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
    }
    return parts[0].slice(0, 2).toUpperCase()
  }
  if (email && email.trim()) {
    return email.slice(0, 2).toUpperCase()
  }
  return 'AC'
}

interface RoleContextValue {
  role: UserRole
  config: RoleConfig
  setRole: (r: UserRole) => void
  isAuthenticated: boolean
  userProfile: UserProfile
  initials: string
  updateUserProfile: (updates: Partial<UserProfile>) => void
  signIn: (role: UserRole, token?: string, profile?: Partial<UserProfile>) => void
  signOut: () => void
}

const RoleContext = createContext<RoleContextValue>({
  role: 'student',
  config: ROLE_CONFIG.student,
  setRole: () => {},
  isAuthenticated: false,
  userProfile: DEFAULT_USER_PROFILE,
  initials: 'AC',
  updateUserProfile: () => {},
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
  const [userProfile, setUserProfileState] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('careeros-user-profile')
    if (saved) {
      try {
        return { ...DEFAULT_USER_PROFILE, ...JSON.parse(saved) }
      } catch {
        return DEFAULT_USER_PROFILE
      }
    }
    return DEFAULT_USER_PROFILE
  })

  const setRole = (r: UserRole) => {
    setRoleState(r)
    localStorage.setItem('careeros-role', r)
  }

  const updateUserProfile = (updates: Partial<UserProfile>) => {
    setUserProfileState(prev => {
      const next = { ...prev, ...updates }
      localStorage.setItem('careeros-user-profile', JSON.stringify(next))
      return next
    })
  }

  const signIn = (role: UserRole, token?: string, profile?: Partial<UserProfile>) => {
    setRoleState(role)
    setIsAuthenticated(true)
    localStorage.setItem('careeros-role', role)
    localStorage.setItem('careeros-authed', 'true')
    if (token) {
      localStorage.setItem('careeros_access_token', token)
    }
    if (profile) {
      updateUserProfile(profile)
    }
  }

  const signOut = () => {
    setIsAuthenticated(false)
    localStorage.removeItem('careeros-authed')
    localStorage.removeItem('careeros-role')
    localStorage.removeItem('careeros_access_token')
    localStorage.removeItem('careeros_refresh_token')
    document.documentElement.removeAttribute('data-role')
  }

  useEffect(() => {
    document.documentElement.setAttribute('data-role', role)
  }, [role])

  const initials = getInitials(userProfile.fullName, userProfile.email)

  return (
    <RoleContext.Provider value={{
      role,
      config: ROLE_CONFIG[role],
      setRole,
      isAuthenticated,
      userProfile,
      initials,
      updateUserProfile,
      signIn,
      signOut
    }}>
      {children}
    </RoleContext.Provider>
  )
}

export function useRole() {
  return useContext(RoleContext)
}
