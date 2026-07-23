import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import HomePage from './pages/HomePage'
import { useRole } from './context/RoleContext'

const AuthPage = lazy(() => import('./pages/AuthPage'))
const DashboardPage = lazy(() => import('./pages/DashboardPage'))
const CareerTwinPage = lazy(() => import('./pages/CareerTwinPage'))
const MentorPage = lazy(() => import('./pages/MentorPage'))
const ResumePage = lazy(() => import('./pages/ResumePage'))
const SkillsPage = lazy(() => import('./pages/SkillsPage'))
const InterviewPage = lazy(() => import('./pages/InterviewPage'))
const JobsPage = lazy(() => import('./pages/JobsPage'))
const RecruiterPage = lazy(() => import('./pages/RecruiterPage'))
const CollegePage = lazy(() => import('./pages/CollegePage'))
const ProfilePage = lazy(() => import('./pages/ProfilePage'))
const AdminDashboardPage = lazy(() => import('./pages/AdminDashboardPage'))
const OnboardingPage = lazy(() => import('./pages/OnboardingPage'))

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useRole()
  if (!isAuthenticated) return <Navigate to="/auth" replace />
  return <>{children}</>
}

function LandingRedirect() {
  const { isAuthenticated, config } = useRole()
  if (isAuthenticated) return <Navigate to={config.primaryPath} replace />
  return <HomePage />
}

function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg-base)' }}>
      <div className="flex flex-col items-center gap-4">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ background: 'linear-gradient(135deg, #3B82F6, #8B5CF6)' }}
        >
          <svg width="20" height="20" viewBox="0 0 18 18" fill="none">
            <path d="M9 2L15 5.5V12.5L9 16L3 12.5V5.5L9 2Z" stroke="white" strokeWidth="1.5" fill="none"/>
            <circle cx="9" cy="9" r="2.5" fill="white"/>
          </svg>
        </div>
        <div className="flex gap-1.5">
          {[0, 0.2, 0.4].map((d) => (
            <div
              key={d}
              className="w-1.5 h-1.5 rounded-full animate-pulse-glow"
              style={{ background: '#8B5CF6', animationDelay: `${d}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<LandingRedirect />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/onboarding" element={<ProtectedRoute><OnboardingPage /></ProtectedRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
          <Route path="/career-twin" element={<ProtectedRoute><CareerTwinPage /></ProtectedRoute>} />
          <Route path="/mentor" element={<ProtectedRoute><MentorPage /></ProtectedRoute>} />
          <Route path="/resume" element={<ProtectedRoute><ResumePage /></ProtectedRoute>} />
          <Route path="/skills" element={<ProtectedRoute><SkillsPage /></ProtectedRoute>} />
          <Route path="/interview" element={<ProtectedRoute><InterviewPage /></ProtectedRoute>} />
          <Route path="/jobs" element={<ProtectedRoute><JobsPage /></ProtectedRoute>} />
          <Route path="/recruiter" element={<ProtectedRoute><RecruiterPage /></ProtectedRoute>} />
          <Route path="/college" element={<ProtectedRoute><CollegePage /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
          <Route path="/admin" element={<ProtectedRoute><AdminDashboardPage /></ProtectedRoute>} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}
