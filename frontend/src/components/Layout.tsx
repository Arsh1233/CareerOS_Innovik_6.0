import { useState, useEffect, useRef } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'
import type { ThemeMode } from '../context/ThemeContext'
import { useRole } from '../context/RoleContext'

// ─── Particles ────────────────────────────────────────────────────────────────
function Particles({ isDark, roleColor }: { isDark: boolean; roleColor: string }) {
  const particles = Array.from({ length: 18 }, (_, i) => ({
    id: i,
    left: `${(i / 18) * 100 + Math.random() * 5}%`,
    delay: `${Math.random() * 10}s`,
    duration: `${8 + Math.random() * 12}s`,
    color: isDark
      ? (i % 3 === 0 ? roleColor : i % 3 === 1 ? '#8B5CF6' : '#06B6D4')
      : (i % 3 === 0 ? roleColor + '88' : i % 3 === 1 ? 'rgba(139,92,246,0.4)' : 'rgba(6,182,212,0.35)'),
    size: `${2 + Math.random() * 2}px`,
  }))

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {particles.map((p) => (
        <div key={p.id} className="particle"
          style={{
            left: p.left, bottom: '-10px',
            width: p.size, height: p.size,
            backgroundColor: p.color,
            animationDuration: p.duration,
            animationDelay: p.delay,
            boxShadow: `0 0 6px ${p.color}`,
          }}
        />
      ))}
    </div>
  )
}

// ─── Theme toggle ──────────────────────────────────────────────────────────────
function ThemeToggle() {
  const { mode, setMode } = useTheme()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const options: { value: ThemeMode; label: string; icon: React.ReactNode }[] = [
    {
      value: 'light', label: 'Light',
      icon: <svg width="13" height="13" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="7" cy="7" r="3"/><path d="M7 1v1.5M7 11.5V13M1 7h1.5M11.5 7H13M2.75 2.75l1 1M10.25 10.25l1 1M11.25 2.75l-1 1M3.75 10.25l-1 1" strokeLinecap="round"/></svg>,
    },
    {
      value: 'dark', label: 'Dark',
      icon: <svg width="13" height="13" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 8.5A5.5 5.5 0 015.5 2a5.5 5.5 0 100 10 5.5 5.5 0 006.5-3.5z" strokeLinecap="round" strokeLinejoin="round"/></svg>,
    },
    {
      value: 'system', label: 'System',
      icon: <svg width="13" height="13" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="1" y="2" width="12" height="8" rx="1.5"/><path d="M5 12h4M7 10v2" strokeLinecap="round"/></svg>,
    },
  ]

  const currentIcon = options.find((o) => o.value === mode)?.icon ?? options[2].icon

  return (
    <div ref={ref} className="relative">
      <button onClick={() => setOpen(!open)}
        className="w-7 h-7 rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-105"
        style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', color: 'var(--text-2)' }}
        title="Change theme">
        {currentIcon}
      </button>
      {open && (
        <div className="absolute right-0 top-9 w-32 rounded-xl overflow-hidden z-50"
          style={{ background: 'var(--bg-surface-strong)', border: '1px solid var(--border-accent)', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>
          {options.map((opt) => (
            <button key={opt.value} onClick={() => { setMode(opt.value); setOpen(false) }}
              className="w-full flex items-center gap-2 px-3 py-2 text-xs transition-colors hover:bg-[var(--bg-hover)] text-left"
              style={{
                color: mode === opt.value ? '#3B82F6' : 'var(--text-2)',
                background: mode === opt.value ? 'rgba(59,130,246,0.08)' : 'transparent',
                fontFamily: "'Inter', sans-serif",
              }}>
              <span style={{ color: mode === opt.value ? '#3B82F6' : 'var(--text-3)' }}>{opt.icon}</span>
              {opt.label}
              {mode === opt.value && (
                <svg className="ml-auto" width="9" height="9" viewBox="0 0 10 10" fill="none">
                  <path d="M2 5l2 2 4-4" stroke="#3B82F6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Navbar ────────────────────────────────────────────────────────────────────
export function Navbar({ transparent = false }: { transparent?: boolean }) {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()
  const { config, isAuthenticated, signOut } = useRole()
  const navigate = useNavigate()

  const handleSignOut = () => {
    signOut()
    navigate('/')
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const isActive = (path: string) => {
    const basePath = path.split('?')[0]
    const param = path.includes('?tab=') ? path.split('?tab=')[1] : null
    if (param) {
      return location.pathname === basePath && location.search.includes(`tab=${param}`)
    }
    if (path.endsWith('exact') || config.navItems.find(n => n.path === path)?.exact) {
      return location.pathname === basePath && !location.search
    }
    return location.pathname === basePath
  }

  const showBg = !transparent || scrolled
  const { navItems, moreItems, color: accentColor } = config

  return (
    <nav className="fixed top-0 inset-x-0 z-50 transition-all duration-500"
      style={{
        background: showBg ? 'var(--nav-bg)' : 'transparent',
        backdropFilter: showBg ? 'blur(24px)' : 'none',
        borderBottom: showBg ? '1px solid var(--border)' : 'none',
      }}>
      <div className="max-w-7xl mx-auto px-4 md:px-6 h-14 flex items-center justify-between">
        {/* Logo */}
        <Link to={isAuthenticated ? config.primaryPath : '/'} className="flex items-center gap-2 flex-shrink-0">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center"
            style={{ background: `linear-gradient(135deg, ${accentColor}, ${config.secondaryColor})` }}>
            <svg width="15" height="15" viewBox="0 0 18 18" fill="none">
              <path d="M9 2L15 5.5V12.5L9 16L3 12.5V5.5L9 2Z" stroke="white" strokeWidth="1.5" fill="none"/>
              <circle cx="9" cy="9" r="2.5" fill="white"/>
            </svg>
          </div>
          <div className="hidden sm:flex flex-col leading-none">
            <span className="font-bold text-sm tracking-tight" style={{ fontFamily: "'Poppins', sans-serif", color: 'var(--text-1)' }}>
              CareerOS
            </span>
            <span style={{ fontSize: '9px', color: accentColor, fontFamily: "'Inter', sans-serif", letterSpacing: '0.04em' }}>
              {config.tagline}
            </span>
          </div>
        </Link>

        {/* Desktop nav items — only when authenticated */}
        {isAuthenticated && (
          <div className="hidden lg:flex items-center gap-0.5 mx-4">
            {navItems.map((item) => (
              <Link key={item.path} to={item.path}
                className="px-3 py-1.5 rounded-lg text-xs transition-all duration-200"
                style={{
                  color: isActive(item.path) ? accentColor : 'var(--text-2)',
                  background: isActive(item.path) ? `${accentColor}14` : 'transparent',
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: isActive(item.path) ? 600 : 400,
                }}>
                {item.label}
              </Link>
            ))}
            {moreItems.length > 0 && (
              <>
                <span className="w-px h-4 mx-1" style={{ background: 'var(--border)' }} />
                {moreItems.map((item) => (
                  <Link key={item.path} to={item.path}
                    className="px-3 py-1.5 rounded-lg text-xs transition-all duration-200"
                    style={{
                      color: isActive(item.path) ? accentColor : 'var(--text-3)',
                      background: isActive(item.path) ? `${accentColor}14` : 'transparent',
                      fontFamily: "'Inter', sans-serif",
                    }}>
                    {item.label}
                  </Link>
                ))}
              </>
            )}
          </div>
        )}

        {/* Right controls */}
        {isAuthenticated ? (
          <div className="hidden lg:flex items-center gap-2">
            {/* Non-clickable role badge */}
            <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium"
              style={{ background: `${accentColor}15`, border: `1px solid ${accentColor}30`, color: accentColor, fontFamily: "'Inter', sans-serif" }}>
              <span>{config.emoji}</span>
              <span>{config.label}</span>
            </div>
            <ThemeToggle />
            {/* Profile avatar */}
            <Link to="/profile" className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold hover:scale-105 transition-transform"
              style={{ background: `linear-gradient(135deg, ${accentColor}, ${config.secondaryColor})`, color: '#fff', fontFamily: "'Poppins', sans-serif" }}>
              RS
            </Link>
            {/* Sign out */}
            <button onClick={handleSignOut}
              className="text-xs px-3 py-1.5 rounded-lg transition-colors hover:bg-[var(--bg-hover)]"
              style={{ color: 'var(--text-3)', fontFamily: "'Inter', sans-serif" }}>
              Sign Out
            </button>
          </div>
        ) : (
          <div className="hidden lg:flex items-center gap-2">
            <ThemeToggle />
            <Link to="/auth" className="text-xs px-3 py-1.5 transition-colors"
              style={{ color: 'var(--text-2)', fontFamily: "'Inter', sans-serif" }}>
              Sign In
            </Link>
            <Link to="/auth"
              className="text-xs font-medium preserve-white px-4 py-1.5 rounded-lg transition-all hover:scale-105"
              style={{
                background: `linear-gradient(135deg, ${accentColor}, ${config.secondaryColor})`,
                color: '#fff',
                fontFamily: "'Inter', sans-serif",
              }}>
              Get Started
            </Link>
          </div>
        )}

        {/* Mobile */}
        <div className="lg:hidden flex items-center gap-2">
          <ThemeToggle />
          <button onClick={() => setMenuOpen(!menuOpen)} style={{ color: 'var(--text-2)' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {menuOpen
                ? <><path d="M18 6L6 18"/><path d="M6 6l12 12"/></>
                : <><path d="M3 12h18"/><path d="M3 6h18"/><path d="M3 18h18"/></>}
            </svg>
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="lg:hidden border-t px-4 py-4 flex flex-col gap-1"
          style={{ background: 'var(--nav-bg)', borderColor: 'var(--border)' }}>
          {isAuthenticated ? (
            <>
              {[...navItems, ...moreItems].map((item) => (
                <Link key={item.path} to={item.path}
                  onClick={() => setMenuOpen(false)}
                  className="text-sm py-2.5 px-3 rounded-lg transition-colors"
                  style={{
                    color: isActive(item.path) ? accentColor : 'var(--text-2)',
                    background: isActive(item.path) ? `${accentColor}10` : 'transparent',
                    fontFamily: "'Inter', sans-serif",
                  }}>
                  {item.label}
                </Link>
              ))}
              <div className="mt-2 flex items-center justify-between px-3 py-2 rounded-lg"
                style={{ background: `${accentColor}10`, border: `1px solid ${accentColor}20` }}>
                <div className="flex items-center gap-1.5 text-xs font-medium"
                  style={{ color: accentColor, fontFamily: "'Inter', sans-serif" }}>
                  <span>{config.emoji}</span>
                  <span>{config.label}</span>
                </div>
                <button onClick={() => { handleSignOut(); setMenuOpen(false) }}
                  className="text-xs px-3 py-1.5 rounded-lg transition-colors hover:bg-[var(--bg-hover)]"
                  style={{ color: 'var(--text-3)', fontFamily: "'Inter', sans-serif" }}>
                  Sign Out
                </button>
              </div>
            </>
          ) : (
            <>
              <Link to="/auth" onClick={() => setMenuOpen(false)}
                className="text-sm py-2.5 px-3 rounded-lg transition-colors text-center"
                style={{ color: 'var(--text-2)', fontFamily: "'Inter', sans-serif" }}>
                Sign In
              </Link>
              <Link to="/auth" onClick={() => setMenuOpen(false)}
                className="mt-1 text-sm font-medium text-white px-4 py-2.5 rounded-lg text-center preserve-white"
                style={{ background: `linear-gradient(135deg, ${accentColor}, ${config.secondaryColor})`, fontFamily: "'Inter', sans-serif" }}>
                Get Started
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  )
}

// ─── AppShell ──────────────────────────────────────────────────────────────────
export function AppShell({ children, transparent = false }: { children: React.ReactNode; transparent?: boolean }) {
  const { isDark } = useTheme()
  const { config } = useRole()

  return (
    <div className="relative min-h-screen" style={{ background: 'var(--bg-base)' }}>
      <Particles isDark={isDark} roleColor={config.color} />
      <Navbar transparent={transparent} />
      <main className="relative z-10 pt-14">
        {children}
      </main>
    </div>
  )
}
