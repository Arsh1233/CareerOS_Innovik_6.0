import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { Navbar } from '../components/Layout'

// ─── Particles ────────────────────────────────────────────────────────────────
function Particles() {
  const particles = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    delay: `${Math.random() * 10}s`,
    duration: `${8 + Math.random() * 12}s`,
    color: i % 3 === 0 ? '#3B82F6' : i % 3 === 1 ? '#8B5CF6' : '#06B6D4',
    size: `${2 + Math.random() * 3}px`,
  }))

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {particles.map((p) => (
        <div
          key={p.id}
          className="particle"
          style={{
            left: p.left,
            bottom: '-10px',
            width: p.size,
            height: p.size,
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

// ─── Animated Stat ─────────────────────────────────────────────────────────────
function AnimatedStat({ value, label, delay }: { value: string; label: string; delay: string }) {
  const [visible, setVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) setVisible(true)
    }, { threshold: 0.3 })
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className="text-center"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(16px)',
        transition: `opacity 0.6s ease ${delay}, transform 0.6s ease ${delay}`,
      }}
    >
      <div className="text-4xl font-bold shimmer-text mb-1" style={{ fontFamily: "'Poppins', sans-serif" }}>
        {value}
      </div>
      <div className="text-sm text-slate-400" style={{ fontFamily: "'Inter', sans-serif" }}>{label}</div>
    </div>
  )
}

// ─── Hero ──────────────────────────────────────────────────────────────────────
function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden px-6 pt-20">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl pointer-events-none animate-pulse-glow"
        style={{ background: 'radial-gradient(circle, rgba(59,130,246,0.2) 0%, transparent 70%)' }} />
      <div className="absolute top-1/3 right-1/4 w-80 h-80 rounded-full blur-3xl pointer-events-none animate-pulse-glow"
        style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.2) 0%, transparent 70%)', animationDelay: '1.5s' }} />
      <div className="absolute bottom-1/4 left-1/3 w-64 h-64 rounded-full blur-3xl pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(6,182,212,0.12) 0%, transparent 70%)' }} />

      <div className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(rgba(59,130,246,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.04) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
          maskImage: 'radial-gradient(ellipse 80% 60% at 50% 50%, black 40%, transparent 100%)',
        }} />

      {/* Central avatar cluster */}
      <div className="relative mb-12 w-64 h-64 flex items-center justify-center">
        <div className="absolute w-64 h-64 rounded-full animate-spin-slow"
          style={{ border: '1px solid transparent', background: 'linear-gradient(var(--bg-base), var(--bg-base)) padding-box, linear-gradient(135deg, rgba(59,130,246,0.4), transparent, rgba(139,92,246,0.4)) border-box' }} />
        <div className="absolute w-48 h-48 rounded-full"
          style={{ border: '1px solid rgba(139,92,246,0.3)', animation: 'spin-slow 15s linear infinite reverse' }} />

        <div className="absolute animate-orbit" style={{ width: 0, height: 0, top: '50%', left: '50%' }}>
          <div className="w-3 h-3 rounded-full" style={{ background: '#3B82F6', marginTop: '-6px', marginLeft: '-6px', boxShadow: '0 0 8px #3B82F6' }} />
        </div>
        <div className="absolute animate-orbit2" style={{ width: 0, height: 0, top: '50%', left: '50%' }}>
          <div className="w-2 h-2 rounded-full" style={{ background: '#8B5CF6', marginTop: '-4px', marginLeft: '-4px', boxShadow: '0 0 8px #8B5CF6' }} />
        </div>

        <div className="relative w-36 h-36 rounded-full flex items-center justify-center animate-float"
          style={{
            background: 'linear-gradient(135deg, rgba(59,130,246,0.3), rgba(139,92,246,0.3))',
            border: '1px solid var(--border-accent)',
            boxShadow: '0 0 40px rgba(139,92,246,0.4), 0 0 80px rgba(59,130,246,0.2), inset 0 0 30px rgba(59,130,246,0.1)',
          }}>
          <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
            <circle cx="32" cy="24" r="12" stroke="url(#heroG)" strokeWidth="2"/>
            <path d="M12 56c0-11 9-20 20-20s20 9 20 20" stroke="url(#heroG)" strokeWidth="2" strokeLinecap="round"/>
            <circle cx="32" cy="24" r="5" fill="url(#heroG)" opacity="0.8"/>
            <path d="M48 16l4-4M48 16h4M48 16v4" stroke="#06B6D4" strokeWidth="1.5" strokeLinecap="round"/>
            <defs>
              <linearGradient id="heroG" x1="12" y1="12" x2="52" y2="52" gradientUnits="userSpaceOnUse">
                <stop stopColor="#3B82F6"/><stop offset="1" stopColor="#8B5CF6"/>
              </linearGradient>
            </defs>
          </svg>
        </div>

        {[
          { label: 'AI Engineer', top: '-12px', right: '-48px', color: '#3B82F6', delay: '0s' },
          { label: 'Product Manager', bottom: '-8px', left: '-56px', color: '#8B5CF6', delay: '0.5s' },
          { label: 'Data Scientist', top: '40px', left: '-72px', color: '#06B6D4', delay: '1s' },
        ].map((tag) => (
          <div key={tag.label} className="absolute glass rounded-full px-3 py-1 text-xs font-medium animate-float whitespace-nowrap"
            style={{
              top: tag.top,
              bottom: (tag as { bottom?: string }).bottom,
              left: (tag as { left?: string }).left,
              right: (tag as { right?: string }).right,
              color: tag.color,
              border: `1px solid ${tag.color}40`,
              boxShadow: `0 0 12px ${tag.color}30`,
              animationDelay: tag.delay,
              fontFamily: "'Inter', sans-serif",
            }}>
            {tag.label}
          </div>
        ))}
      </div>

      {/* Hero text */}
      <div className="text-center max-w-4xl relative z-10">
        <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 mb-6 text-xs text-slate-400 border border-white/10"
          style={{ fontFamily: "'Inter', sans-serif" }}>
          <span className="w-1.5 h-1.5 rounded-full animate-pulse-glow" style={{ background: '#3B82F6' }} />
          Powered by Agentic AI — v2.0 Now Live
        </div>

        <h1 className="text-5xl md:text-7xl font-bold leading-tight tracking-tight mb-6"
          style={{ fontFamily: "'Poppins', sans-serif" }}>
          Your Personal{' '}
          <span className="gradient-text">AI Career Team</span>
        </h1>

        <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed"
          style={{ fontFamily: "'Inter', sans-serif" }}>
          CareerOS deploys autonomous AI agents that plan your career path, optimize your resume, simulate interviews, and match you with opportunities — all in real time.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <Link to="/auth"
            className="relative group w-full sm:w-auto px-8 py-3.5 rounded-xl text-white font-semibold text-sm text-center transition-all duration-300 hover:scale-105"
            style={{
              background: 'linear-gradient(135deg, #3B82F6, #8B5CF6)',
              boxShadow: '0 0 30px rgba(139,92,246,0.5), 0 4px 15px rgba(0,0,0,0.3)',
              fontFamily: "'Inter', sans-serif",
            }}>
            Get Started Free
          </Link>
          <Link to="/dashboard"
            className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-xl text-sm font-semibold text-white transition-all duration-200 hover:bg-white/10"
            style={{
              background: 'var(--bg-hover)',
              border: '1px solid var(--border-accent)',
              fontFamily: "'Inter', sans-serif",
            }}>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <circle cx="9" cy="9" r="8" stroke="#3B82F6" strokeWidth="1.5"/>
              <path d="M7 6.5l5 2.5-5 2.5V6.5z" fill="#3B82F6"/>
            </svg>
            Watch Demo
          </Link>
        </div>

        <div className="grid grid-cols-3 gap-8 max-w-lg mx-auto">
          <AnimatedStat value="40M+" label="Students" delay="0s" />
          <AnimatedStat value="58K+" label="Colleges" delay="0.15s" />
          <AnimatedStat value="100K+" label="Recruiters" delay="0.3s" />
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-40">
        <span className="text-xs text-slate-500" style={{ fontFamily: "'Inter', sans-serif" }}>Scroll to explore</span>
        <div className="w-px h-8 bg-gradient-to-b from-slate-500 to-transparent" />
      </div>
    </section>
  )
}

// ─── Features ──────────────────────────────────────────────────────────────────
const features = [
  { icon: '⬡', title: 'Digital Career Twin', desc: 'A real-time holographic model of your career trajectory, skill gaps, and salary projections.', color: '#3B82F6', to: '/career-twin' },
  { icon: '◈', title: 'AI Career Mentor', desc: 'Chat with an intelligent agent that builds personalized roadmaps and predicts your placement probability.', color: '#8B5CF6', to: '/mentor' },
  { icon: '◻', title: 'Resume Analyzer', desc: 'ATS-optimized resume scoring with AI-generated improvements and keyword gap analysis.', color: '#06B6D4', to: '/resume' },
  { icon: '◎', title: 'AI Mock Interview', desc: 'Immersive voice-enabled interview simulations with live confidence scoring.', color: '#3B82F6', to: '/interview' },
  { icon: '⬠', title: 'Skill Gap Analysis', desc: 'Radar-based visualization of your skills vs. industry demand, with curated course recommendations.', color: '#8B5CF6', to: '/skills' },
  { icon: '◇', title: 'Job Matching Engine', desc: 'AI-ranked job and internship recommendations with match percentage and one-click apply.', color: '#06B6D4', to: '/jobs' },
]

function Features() {
  return (
    <section className="relative py-28 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 mb-5 text-xs text-blue-400 border border-blue-500/20"
            style={{ fontFamily: "'Inter', sans-serif" }}>
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
            Core Capabilities
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4" style={{ fontFamily: "'Poppins', sans-serif" }}>
            Everything Your Career{' '}
            <span className="gradient-text">Needs to Win</span>
          </h2>
          <p className="text-slate-400 text-lg max-w-xl mx-auto" style={{ fontFamily: "'Inter', sans-serif" }}>
            Six agentic modules working in concert, so you focus on growth while AI handles the strategy.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f, i) => (
            <Link key={f.title} to={f.to}
              className="group glass rounded-2xl p-6 hover:scale-[1.02] transition-all duration-300 block"
              style={{ animationDelay: `${i * 0.1}s`, borderColor: 'var(--border)' }}>
              <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4 transition-all duration-300 group-hover:scale-110 text-xl"
                style={{ background: `${f.color}15`, border: `1px solid ${f.color}30`, color: f.color }}>
                {f.icon}
              </div>
              <h3 className="text-white font-semibold text-base mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>{f.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-4" style={{ fontFamily: "'Inter', sans-serif" }}>{f.desc}</p>
              <div className="flex items-center gap-1.5 text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ color: f.color, fontFamily: "'Inter', sans-serif" }}>
                Explore feature
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M3 7h8M8 4l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── AI Agents ─────────────────────────────────────────────────────────────────
const agents = [
  { name: 'ARIA', subtitle: 'Career Intelligence Agent', desc: 'Analyzes your entire career profile and generates multi-year strategic roadmaps with probabilistic placement forecasts.', color: '#3B82F6', metrics: [{ label: 'Accuracy', val: '94%' }, { label: 'Roadmaps', val: '2.1M' }] },
  { name: 'NEXUS', subtitle: 'Opportunity Matching Agent', desc: 'Continuously scans 500K+ job listings and surfaces the highest-fit opportunities based on your evolving skill graph.', color: '#8B5CF6', metrics: [{ label: 'Match Rate', val: '89%' }, { label: 'Jobs Scanned', val: '500K+' }] },
  { name: 'ECHO', subtitle: 'Interview Simulation Agent', desc: 'Conducts immersive mock interviews with real-time confidence analysis, voice waveform feedback, and adaptive difficulty.', color: '#06B6D4', metrics: [{ label: 'Users Placed', val: '18K+' }, { label: 'Success', val: '82%' }] },
]

function AIAgents() {
  const [active, setActive] = useState(0)

  return (
    <section className="relative py-28 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 mb-5 text-xs text-purple-400 border border-purple-500/20"
            style={{ fontFamily: "'Inter', sans-serif" }}>
            <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse-glow" />
            Autonomous AI Agents
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4" style={{ fontFamily: "'Poppins', sans-serif" }}>
            Meet Your <span className="gradient-text">AI Career Crew</span>
          </h2>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {agents.map((agent, i) => (
            <div key={agent.name}
              className="relative glass rounded-2xl p-6 cursor-pointer transition-all duration-300 hover:scale-[1.02]"
              onClick={() => setActive(i)}
              style={{
                borderColor: active === i ? `${agent.color}50` : 'var(--border)',
                borderWidth: '1px',
                boxShadow: active === i ? `0 0 30px ${agent.color}20` : 'none',
              }}>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3 font-bold text-sm"
                    style={{ background: `${agent.color}20`, border: `1px solid ${agent.color}35`, color: agent.color, fontFamily: "'Poppins', sans-serif" }}>
                    AI
                  </div>
                  <h3 className="text-white font-bold text-lg" style={{ fontFamily: "'Poppins', sans-serif" }}>{agent.name}</h3>
                  <p className="text-xs" style={{ color: agent.color, fontFamily: "'Inter', sans-serif" }}>{agent.subtitle}</p>
                </div>
                {active === i && <div className="w-2 h-2 rounded-full animate-pulse-glow" style={{ background: agent.color }} />}
              </div>
              <p className="text-slate-400 text-sm leading-relaxed mb-5" style={{ fontFamily: "'Inter', sans-serif" }}>{agent.desc}</p>
              <div className="flex gap-4">
                {agent.metrics.map((m) => (
                  <div key={m.label}>
                    <p className="text-lg font-bold" style={{ color: agent.color, fontFamily: "'Poppins', sans-serif" }}>{m.val}</p>
                    <p className="text-xs text-slate-500" style={{ fontFamily: "'Inter', sans-serif" }}>{m.label}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Testimonials ──────────────────────────────────────────────────────────────
const testimonials = [
  { name: 'Priya Mehta', role: 'SDE-2 at Google', avatar: 'PM', color: '#3B82F6', text: "CareerOS's AI mentor built me a 12-month roadmap that I followed religiously. Got a ₹42 LPA offer from Google. The mock interview agent was so realistic I was almost nervous." },
  { name: 'Arjun Kapoor', role: 'Data Scientist at OpenAI', avatar: 'AK', color: '#8B5CF6', text: "The skill gap analysis showed me exactly what was missing. Filled those gaps in 3 months. The resume analyzer boosted my ATS score from 54% to 91% — calls started pouring in." },
  { name: 'Sneha Reddy', role: 'Product Manager at Stripe', avatar: 'SR', color: '#06B6D4', text: "I was pivoting from engineering to PM. ARIA mapped out the exact path, NEXUS found the perfect internship, and ECHO prepped me for every behavioral question. Landed Stripe in 8 months." },
  { name: 'Vikram Singh', role: 'ML Engineer at Meta', avatar: 'VS', color: '#F59E0B', text: "The Digital Career Twin is wild — I could literally see my future salary curve shift in real time as I completed each module. Incredibly motivating and scarily accurate." },
]

function Testimonials() {
  return (
    <section className="relative py-28 px-6 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 60% 30% at 50% 50%, rgba(139,92,246,0.06) 0%, transparent 70%)' }} />
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4" style={{ fontFamily: "'Poppins', sans-serif" }}>
            Real Students, <span className="gradient-text">Real Breakthroughs</span>
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {testimonials.map((t) => (
            <div key={t.name} className="glass rounded-2xl p-6 transition-all duration-300 hover:scale-[1.01]">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                  style={{ background: `${t.color}20`, color: t.color, border: `1px solid ${t.color}30`, fontFamily: "'Poppins', sans-serif" }}>
                  {t.avatar}
                </div>
                <div>
                  <p className="text-white font-semibold text-sm" style={{ fontFamily: "'Poppins', sans-serif" }}>{t.name}</p>
                  <p className="text-xs" style={{ color: t.color, fontFamily: "'Inter', sans-serif" }}>{t.role}</p>
                </div>
                <div className="ml-auto flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <svg key={j} width="12" height="12" viewBox="0 0 12 12" fill="#F59E0B">
                      <path d="M6 1l1.4 2.9L11 4.4l-2.5 2.4.6 3.4L6 8.7 2.9 10.2l.6-3.4L1 4.4l3.6-.5L6 1z"/>
                    </svg>
                  ))}
                </div>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>"{t.text}"</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── CTA ───────────────────────────────────────────────────────────────────────
function CTA() {
  return (
    <section className="relative py-28 px-6 text-center overflow-hidden">
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 70% 50% at 50% 50%, rgba(59,130,246,0.08) 0%, transparent 70%)' }} />
      <div className="max-w-3xl mx-auto relative z-10">
        <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight" style={{ fontFamily: "'Poppins', sans-serif" }}>
          Ready to Let <span className="gradient-text">AI</span> Build Your Career?
        </h2>
        <p className="text-slate-400 text-lg mb-10" style={{ fontFamily: "'Inter', sans-serif" }}>
          Join 40 million students already using CareerOS. Free to start. No credit card required.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/auth"
            className="w-full sm:w-auto px-10 py-4 rounded-xl text-white font-semibold text-base text-center transition-all duration-300 hover:scale-105 hover:shadow-2xl"
            style={{ background: 'linear-gradient(135deg, #3B82F6, #8B5CF6)', boxShadow: '0 0 40px rgba(139,92,246,0.5)', fontFamily: "'Poppins', sans-serif" }}>
            Start for Free →
          </Link>
          <Link to="/dashboard"
            className="w-full sm:w-auto px-10 py-4 rounded-xl text-sm text-slate-300 text-center transition-all duration-200 hover:text-white"
            style={{ background: 'var(--bg-surface)', border: '1px solid var(--input-border)', fontFamily: "'Inter', sans-serif" }}>
            Explore Dashboard
          </Link>
        </div>
      </div>
    </section>
  )
}

// ─── Footer ────────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="relative border-t px-6 py-14" style={{ borderColor: 'var(--border)' }}>
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 mb-12">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #3B82F6, #8B5CF6)' }}>
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path d="M9 2L15 5.5V12.5L9 16L3 12.5V5.5L9 2Z" stroke="white" strokeWidth="1.5" fill="none"/>
                  <circle cx="9" cy="9" r="2.5" fill="white"/>
                </svg>
              </div>
              <span className="font-bold text-white text-lg" style={{ fontFamily: "'Poppins', sans-serif" }}>CareerOS</span>
            </div>
            <p className="text-slate-500 text-sm leading-relaxed max-w-xs mb-5" style={{ fontFamily: "'Inter', sans-serif" }}>
              The world's first Agentic AI Career Operating System.
            </p>
          </div>
          {[
            { title: 'Product', links: [{ label: 'Dashboard', to: '/dashboard' }, { label: 'Career Twin', to: '/career-twin' }, { label: 'AI Mentor', to: '/mentor' }, { label: 'Interview', to: '/interview' }] },
            { title: 'Platform', links: [{ label: 'For Students', to: '/auth' }, { label: 'For Colleges', to: '/college' }, { label: 'For Recruiters', to: '/recruiter' }] },
            { title: 'Company', links: [{ label: 'About', to: '/' }, { label: 'Blog', to: '/' }, { label: 'Careers', to: '/' }] },
          ].map((col) => (
            <div key={col.title}>
              <p className="text-white font-semibold text-sm mb-4" style={{ fontFamily: "'Poppins', sans-serif" }}>{col.title}</p>
              <div className="flex flex-col gap-2.5">
                {col.links.map((link) => (
                  <Link key={link.label} to={link.to} className="text-slate-500 hover:text-slate-300 text-sm transition-colors duration-200" style={{ fontFamily: "'Inter', sans-serif" }}>
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t gap-4" style={{ borderColor: 'var(--border)' }}>
          <p className="text-xs text-slate-600" style={{ fontFamily: "'Inter', sans-serif" }}>© 2025 CareerOS Technologies Pvt. Ltd.</p>
          <div className="text-xs text-slate-600" style={{ fontFamily: "'Inter', sans-serif" }}>
            Built with <span className="text-purple-500 animate-pulse-glow">♥</span> for every student who deserves a shot
          </div>
        </div>
      </div>
    </footer>
  )
}

// ─── Page ──────────────────────────────────────────────────────────────────────
export default function HomePage() {
  return (
    <div className="relative min-h-screen" style={{ background: 'var(--bg-base)' }}>
      <Particles />
      <Navbar transparent />
      <main>
        <Hero />
        <Features />
        <AIAgents />
        <Testimonials />
        <CTA />
      </main>
      <Footer />
    </div>
  )
}
