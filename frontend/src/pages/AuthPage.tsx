import { useState } from 'react'
import { useNavigate, Navigate, Link } from 'react-router-dom'
import { useRole, ROLE_CONFIG } from '../context/RoleContext'
import type { UserRole } from '../context/RoleContext'
import { api } from '../api'
import { useApi } from '../hooks/useApi'

const ROLES_LIST: { value: UserRole; emoji: string; label: string; desc: string }[] = [
  { value: 'student',   emoji: '🎓', label: 'Student',     desc: 'Career development & job hunting' },
  { value: 'recruiter', emoji: '🔍', label: 'Recruiter',   desc: 'Find and hire top AI talent' },
  { value: 'college',   emoji: '🏛️', label: 'Institution', desc: 'Manage campus placements' },
  { value: 'admin',     emoji: '⚙️', label: 'Admin',       desc: 'Platform administration' },
]

export default function AuthPage() {
  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const { role, setRole, config, signIn, isAuthenticated } = useRole()
  const navigate = useNavigate()

  const { request: loginReq, loading: loginLoading, error: loginError } = useApi(api.auth.login)
  const { request: registerReq, loading: registerLoading, error: registerError } = useApi(api.auth.register)

  const handleAuth = async () => {
    try {
      let res;
      if (mode === 'login') {
        res = await loginReq({ email, password });
      } else {
        res = await registerReq({ email, password, full_name: name, role });
      }
      // Use the returned role if available, otherwise fallback to the selected role
      const assignedRole = res?.user?.role || role;
      signIn(assignedRole, res?.access_token);
      navigate(ROLE_CONFIG[assignedRole as UserRole].primaryPath);
    } catch (e) {
      // Error is handled by useApi and displayed below
    }
  }

  if (isAuthenticated) return <Navigate to={config.primaryPath} replace />

  return (
    <div className="min-h-screen flex" style={{ background: 'var(--bg-base)' }}>
      {/* Left — animated hologram panel */}
      <div className="hidden lg:flex flex-1 relative overflow-hidden items-center justify-center p-16"
        style={{
          background: 'var(--bg-base)',
          borderRight: '1px solid rgba(59,130,246,0.15)',
        }}
      >
        {/* Grid overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `
              linear-gradient(rgba(59,130,246,0.05) 1px, transparent 1px),
              linear-gradient(90deg, rgba(59,130,246,0.05) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
          }}
        />
        {/* Glow orbs */}
        <div className="absolute top-1/4 left-1/3 w-64 h-64 rounded-full blur-3xl pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(59,130,246,0.2) 0%, transparent 70%)' }}
        />
        <div className="absolute bottom-1/3 right-1/4 w-48 h-48 rounded-full blur-3xl pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.2) 0%, transparent 70%)' }}
        />

        {/* Scan line */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div
            className="absolute w-full h-0.5 animate-scan"
            style={{ background: 'linear-gradient(90deg, transparent, rgba(59,130,246,0.4), transparent)' }}
          />
        </div>

        <div className="relative z-10 text-center">
          {/* Holographic avatar */}
          <div className="relative w-48 h-48 mx-auto mb-10 flex items-center justify-center">
            <div className="absolute w-48 h-48 rounded-full animate-spin-slow"
              style={{ border: '1px solid rgba(59,130,246,0.2)' }} />
            <div className="absolute w-36 h-36 rounded-full"
              style={{ border: '1px solid rgba(139,92,246,0.2)', animation: 'spin-slow 12s linear infinite reverse' }} />
            <div
              className="w-28 h-28 rounded-full flex items-center justify-center animate-float"
              style={{
                background: 'linear-gradient(135deg, rgba(59,130,246,0.25), rgba(139,92,246,0.25))',
                border: '1px solid rgba(139,92,246,0.3)',
                boxShadow: '0 0 40px rgba(59,130,246,0.3), 0 0 80px rgba(139,92,246,0.15)',
              }}
            >
              <svg width="52" height="52" viewBox="0 0 52 52" fill="none">
                <circle cx="26" cy="18" r="9" stroke="url(#ag)" strokeWidth="1.5"/>
                <path d="M8 46c0-9 8-16 18-16s18 7 18 16" stroke="url(#ag)" strokeWidth="1.5" strokeLinecap="round"/>
                <circle cx="26" cy="18" r="4" fill="url(#ag)" opacity="0.7"/>
                <path d="M40 8l3-3M40 8h3M43 5l-3 3" stroke="#06B6D4" strokeWidth="1.5" strokeLinecap="round"/>
                <defs>
                  <linearGradient id="ag" x1="8" y1="8" x2="44" y2="44" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#3B82F6"/>
                    <stop offset="1" stopColor="#8B5CF6"/>
                  </linearGradient>
                </defs>
              </svg>
            </div>

            {/* Orbiting indicator */}
            <div className="absolute animate-orbit" style={{ width: 0, height: 0, top: '50%', left: '50%' }}>
              <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#3B82F6', marginTop: '-5px', marginLeft: '-5px', boxShadow: '0 0 8px #3B82F6' }} />
            </div>
          </div>

          <h2 className="text-3xl font-bold mb-3" style={{ fontFamily: "'Poppins', sans-serif", color: 'var(--text-1)' }}>
            Welcome to{' '}
            <span className="gradient-text">CareerOS</span>
          </h2>
          <p className="text-sm max-w-xs mx-auto mb-8 leading-relaxed" style={{ fontFamily: "'Inter', sans-serif", color: 'var(--text-2)' }}>
            Your AI-powered career team is ready to deploy. Let's unlock your potential together.
          </p>

          {/* Social proof badges */}
          <div className="flex items-center justify-center gap-3 flex-wrap">
            {[
              { val: '87%', label: 'Placement Rate' },
              { val: '14mo', label: 'Avg. Time-to-Job' },
              { val: '4.2x', label: 'Salary Uplift' },
            ].map((b) => (
              <div key={b.label} className="glass rounded-xl px-4 py-2 text-center"
                style={{ border: '1px solid var(--border)' }}
              >
                <p className="text-sm font-bold gradient-text" style={{ fontFamily: "'Poppins', sans-serif" }}>{b.val}</p>
                <p className="text-xs" style={{ fontFamily: "'Inter', sans-serif", color: 'var(--text-3)' }}>{b.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right — auth card */}
      <div className="flex-1 lg:max-w-lg flex items-center justify-center p-8 relative">
        {/* Back to home */}
        <Link to="/" className="absolute top-6 left-6 flex items-center gap-1.5 text-xs transition-colors hover:opacity-80"
          style={{ color: 'var(--text-2)', fontFamily: "'Inter', sans-serif" }}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M9 2L4 7l5 5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Back to Home
        </Link>

        <div className="w-full max-w-md">
          {/* Logo (mobile) */}
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #3B82F6, #8B5CF6)' }}>
              <svg width="16" height="16" viewBox="0 0 18 18" fill="none">
                <path d="M9 2L15 5.5V12.5L9 16L3 12.5V5.5L9 2Z" stroke="white" strokeWidth="1.5" fill="none"/>
                <circle cx="9" cy="9" r="2.5" fill="white"/>
              </svg>
            </div>
            <span className="font-bold text-lg" style={{ fontFamily: "'Poppins', sans-serif", color: 'var(--text-1)' }}>CareerOS</span>
          </div>

          {/* Role selector */}
          <div className="mb-7">
            <p className="text-xs mb-2.5 font-medium" style={{ color: 'var(--text-2)', fontFamily: "'Inter', sans-serif" }}>
              I am a…
            </p>
            <div className="grid grid-cols-2 gap-2">
              {ROLES_LIST.map(r => (
                <button key={r.value} onClick={() => setRole(r.value as UserRole)}
                  className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left transition-all duration-200 hover:scale-[1.01]"
                  style={{
                    background: role === r.value ? `${ROLE_CONFIG[r.value].color}12` : 'var(--bg-surface)',
                    border: `1px solid ${role === r.value ? ROLE_CONFIG[r.value].color + '40' : 'var(--border)'}`,
                  }}>
                  <span className="text-lg leading-none flex-shrink-0">{r.emoji}</span>
                  <div>
                    <p className="text-xs font-semibold" style={{
                      color: role === r.value ? ROLE_CONFIG[r.value].color : 'var(--text-1)',
                      fontFamily: "'Poppins', sans-serif",
                    }}>{r.label}</p>
                    <p style={{ fontSize: '9px', color: 'var(--text-3)', fontFamily: "'Inter', sans-serif", lineHeight: 1.3 }}>{r.desc}</p>
                  </div>
                  {role === r.value && (
                    <div className="ml-auto w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ background: ROLE_CONFIG[r.value].color }}>
                      <svg width="7" height="7" viewBox="0 0 8 8" fill="none">
                        <path d="M1.5 4l1.5 1.5 3.5-3.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Mode toggle */}
          <div className="flex gap-1 glass rounded-xl p-1 mb-8" style={{ border: '1px solid var(--border)' }}>
            {(['login', 'signup'] as const).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className="flex-1 py-2 rounded-lg text-sm font-medium transition-all duration-200 capitalize"
                style={{
                  background: mode === m ? 'linear-gradient(135deg, #3B82F6, #8B5CF6)' : 'transparent',
                  color: mode === m ? 'var(--text-1)' : 'var(--text-2)',
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                {m === 'login' ? 'Sign In' : 'Create Account'}
              </button>
            ))}
          </div>

          <h1 className="text-2xl font-bold mb-1" style={{ fontFamily: "'Poppins', sans-serif", color: 'var(--text-1)' }}>
            {mode === 'login' ? 'Welcome back' : 'Start your journey'}
          </h1>
          <p className="text-sm mb-7" style={{ fontFamily: "'Inter', sans-serif", color: 'var(--text-2)' }}>
            {mode === 'login'
              ? 'Sign in to access your AI career team.'
              : 'Join 40M+ students already using CareerOS.'}
          </p>

          {/* Google */}
          <button
            className="w-full flex items-center justify-center gap-3 py-3 rounded-xl text-sm font-medium mb-5 transition-all duration-200 hover:bg-white/10"
            style={{
              background: 'var(--bg-surface-strong)',
              border: '1px solid var(--border-accent)',
              fontFamily: "'Inter', sans-serif",
              color: 'var(--text-1)',
            }}
          >
            <svg width="18" height="18" viewBox="0 0 18 18">
              <path d="M17.64 9.2a10 10 0 00-.16-1.76H9v3.33h4.84a4.14 4.14 0 01-1.8 2.72v2.26h2.92a8.78 8.78 0 002.68-6.55z" fill="#4285F4"/>
              <path d="M9 18a8.6 8.6 0 005.96-2.18l-2.91-2.26a5.4 5.4 0 01-8.07-2.85H.96v2.33A9 9 0 009 18z" fill="#34A853"/>
              <path d="M3.96 10.71A5.41 5.41 0 013.68 9c0-.6.1-1.17.28-1.71V4.96H.96A9 9 0 000 9c0 1.45.35 2.82.96 4.04l3-2.33z" fill="#FBBC05"/>
              <path d="M9 3.58a4.86 4.86 0 013.44 1.35l2.58-2.58A8.65 8.65 0 009 0 9 9 0 00.96 4.96l3 2.33A5.36 5.36 0 019 3.58z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>

          <div className="flex items-center gap-3 mb-5">
            <div className="flex-1 h-px" style={{ background: 'var(--border)' }} />
            <span className="text-xs" style={{ fontFamily: "'Inter', sans-serif", color: 'var(--text-3)' }}>or continue with email</span>
            <div className="flex-1 h-px" style={{ background: 'var(--border)' }} />
          </div>

          {/* Form */}
          <div className="flex flex-col gap-3">
            {(loginError || registerError) && (
              <div className="p-3 mb-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-medium">
                {loginError || registerError}
              </div>
            )}

            {mode === 'signup' && (
              <div>
                <label className="text-xs mb-1.5 block" style={{ fontFamily: "'Inter', sans-serif", color: 'var(--text-2)' }}>
                  Full Name
                </label>
                <input
                  type="text"
                  placeholder="Rahul Sharma"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl text-sm placeholder-slate-600 outline-none transition-all duration-200"
                  style={{
                    background: 'var(--input-bg)',
                    border: '1px solid var(--input-border)',
                    fontFamily: "'Inter', sans-serif",
                    color: 'var(--text-1)',
                  }}
                  onFocus={(e) => { e.target.style.borderColor = 'rgba(59,130,246,0.5)'; e.target.style.boxShadow = '0 0 0 3px rgba(59,130,246,0.1)' }}
                  onBlur={(e) => { e.target.style.borderColor = 'var(--input-border)'; e.target.style.boxShadow = 'none' }}
                />
              </div>
            )}

            <div>
              <label className="text-xs mb-1.5 block" style={{ fontFamily: "'Inter', sans-serif", color: 'var(--text-2)' }}>
                Email Address
              </label>
              <input
                type="email"
                placeholder="rahul@iit.ac.in"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl text-sm placeholder-slate-600 outline-none transition-all duration-200"
                style={{
                  background: 'var(--input-bg)',
                  border: '1px solid var(--input-border)',
                  fontFamily: "'Inter', sans-serif",
                  color: 'var(--text-1)',
                }}
                onFocus={(e) => { e.target.style.borderColor = 'rgba(59,130,246,0.5)'; e.target.style.boxShadow = '0 0 0 3px rgba(59,130,246,0.1)' }}
                onBlur={(e) => { e.target.style.borderColor = 'var(--input-border)'; e.target.style.boxShadow = 'none' }}
              />
            </div>

            <div>
              <div className="flex justify-between mb-1.5">
                <label className="text-xs" style={{ fontFamily: "'Inter', sans-serif", color: 'var(--text-2)' }}>Password</label>
                {mode === 'login' && (
                  <a href="#" className="text-xs text-blue-400 hover:text-blue-300 transition-colors" style={{ fontFamily: "'Inter', sans-serif" }}>
                    Forgot password?
                  </a>
                )}
              </div>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl text-sm placeholder-slate-600 outline-none transition-all duration-200"
                style={{
                  background: 'var(--input-bg)',
                  border: '1px solid var(--input-border)',
                  fontFamily: "'Inter', sans-serif",
                  color: 'var(--text-1)',
                }}
                onFocus={(e) => { e.target.style.borderColor = 'rgba(59,130,246,0.5)'; e.target.style.boxShadow = '0 0 0 3px rgba(59,130,246,0.1)' }}
                onBlur={(e) => { e.target.style.borderColor = 'var(--input-border)'; e.target.style.boxShadow = 'none' }}
              />
            </div>

            {mode === 'login' && (
              <div className="flex items-center gap-2">
                <input type="checkbox" id="remember" className="w-3.5 h-3.5 rounded accent-blue-500" />
                <label htmlFor="remember" className="text-xs" style={{ fontFamily: "'Inter', sans-serif", color: 'var(--text-2)' }}>
                  Remember me for 30 days
                </label>
              </div>
            )}

            <button
              onClick={handleAuth}
              disabled={loginLoading || registerLoading}
              className="w-full py-3 rounded-xl text-sm font-semibold text-center mt-2 transition-all duration-200 hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100"
              style={{
                background: `linear-gradient(135deg, ${config.color}, ${config.secondaryColor})`,
                boxShadow: `0 0 24px ${config.color}40`,
                fontFamily: "'Inter', sans-serif",
                color: '#fff',
              }}
            >
              {(loginLoading || registerLoading) 
                ? 'Processing...' 
                : (mode === 'login' ? `Sign In as ${config.label} →` : `Create ${config.label} Account →`)}
            </button>
          </div>

          <p className="text-center text-xs mt-6" style={{ fontFamily: "'Inter', sans-serif", color: 'var(--text-3)' }}>
            {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
            <button
              onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
              className="text-blue-400 hover:text-blue-300 transition-colors"
            >
              {mode === 'login' ? 'Sign up free' : 'Sign in'}
            </button>
          </p>

          {mode === 'signup' && (
            <p className="text-center text-xs mt-3" style={{ fontFamily: "'Inter', sans-serif", color: 'var(--text-3)' }}>
              By signing up you agree to our{' '}
              <a href="#" className="text-slate-500 hover:text-slate-400">Terms</a> and{' '}
              <a href="#" className="text-slate-500 hover:text-slate-400">Privacy Policy</a>.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
