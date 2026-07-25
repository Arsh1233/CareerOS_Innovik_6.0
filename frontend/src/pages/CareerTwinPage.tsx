import { useState, useEffect } from 'react'
import { AppShell } from '../components/Layout'
import { api } from '../api'

interface CareerTwinData {
  readiness_score?: number
  placement_probability?: number
  strengths?: string[]
  weaknesses?: string[]
  recommended_roles?: string[]
  roadmap_summary?: string
  critical_skills_to_learn?: string[]
  estimated_months_to_ready?: number
}

const defaultSkills = [
  { name: 'Python', level: 88, status: 'strong' },
  { name: 'Machine Learning', level: 74, status: 'good' },
  { name: 'System Design', level: 58, status: 'gap' },
  { name: 'Deep Learning', level: 65, status: 'good' },
  { name: 'MLOps', level: 40, status: 'gap' },
  { name: 'LLM Engineering', level: 55, status: 'gap' },
]

const defaultMissingSkills = [
  { name: 'Kubernetes', priority: 'High', time: '3 weeks' },
  { name: 'Ray/Distributed ML', priority: 'High', time: '4 weeks' },
  { name: 'Vector Databases', priority: 'Medium', time: '2 weeks' },
  { name: 'LangChain / LangGraph', priority: 'Medium', time: '2 weeks' },
]

const defaultCareerProbabilities = [
  { role: 'AI Engineer', prob: 78, salary: '₹28-42 LPA', color: '#3B82F6' },
  { role: 'ML Researcher', prob: 61, salary: '₹32-55 LPA', color: '#8B5CF6' },
  { role: 'Data Scientist', prob: 84, salary: '₹18-32 LPA', color: '#06B6D4' },
  { role: 'Product Manager', prob: 45, salary: '₹24-40 LPA', color: '#F59E0B' },
]

export default function CareerTwinPage() {
  const [twin, setTwin] = useState<CareerTwinData | null>(null)

  useEffect(() => {
    api.students.getCareerTwin()
      .then(data => setTwin(data))
      .catch(() => {
        // Silently use defaults if not generated yet
      })
  }, [])

  const score = twin?.readiness_score ? Math.round(twin.readiness_score) : 87
  const months = twin?.estimated_months_to_ready ?? 14

  return (
    <AppShell>
      <div className="min-h-screen px-4 md:px-6 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <div className="inline-flex items-center gap-2 glass rounded-full px-3 py-1 mb-3 text-xs text-purple-400 border border-purple-500/20"
                style={{ fontFamily: "'Inter', sans-serif" }}>
                <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse-glow" />
                Live Simulation
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Your <span className="gradient-text">Digital Career Twin</span>
              </h1>
              <p className="text-slate-400 text-sm" style={{ fontFamily: "'Inter', sans-serif" }}>
                A holographic model of your career — skills, probabilities, and projections updated in real time.
              </p>
            </div>

          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* Central avatar panel */}
            <div className="lg:col-span-4 glass rounded-2xl p-8 flex flex-col items-center"
              style={{ border: '1px solid rgba(139,92,246,0.2)' }}>
              {/* Holographic avatar */}
              <div className="relative w-48 h-48 flex items-center justify-center mb-6">
                {/* Neural ring 1 */}
                <div className="absolute w-48 h-48 rounded-full animate-spin-slow"
                  style={{ border: '1px solid rgba(59,130,246,0.2)' }} />
                {/* Neural ring 2 */}
                <div className="absolute w-36 h-36 rounded-full"
                  style={{ border: '1px solid rgba(139,92,246,0.25)', animation: 'spin-slow 12s linear infinite reverse' }} />
                {/* Neural ring 3 */}
                <div className="absolute w-56 h-56 rounded-full"
                  style={{ border: '1px dashed rgba(6,182,212,0.15)', animation: 'spin-slow 18s linear infinite' }} />

                {/* Orbiting nodes */}
                {[0, 72, 144, 216, 288].map((deg, i) => (
                  <div key={i} className="absolute"
                    style={{
                      width: 0, height: 0, top: '50%', left: '50%',
                      transform: `rotate(${deg + i * 15}deg) translateX(95px)`,
                      animation: `spin-slow ${10 + i * 2}s linear infinite`,
                    }}>
                    <div className="w-2 h-2 rounded-full"
                      style={{
                        background: ['#3B82F6', '#8B5CF6', '#06B6D4', '#F59E0B', '#34D399'][i],
                        marginTop: '-4px', marginLeft: '-4px',
                        boxShadow: `0 0 8px ${['#3B82F6', '#8B5CF6', '#06B6D4', '#F59E0B', '#34D399'][i]}`,
                      }} />
                  </div>
                ))}

                {/* Core */}
                <div className="relative w-28 h-28 rounded-full flex items-center justify-center animate-float"
                  style={{
                    background: 'linear-gradient(135deg, rgba(59,130,246,0.3), rgba(139,92,246,0.3))',
                    border: '1px solid rgba(139,92,246,0.4)',
                    boxShadow: '0 0 40px rgba(139,92,246,0.35), 0 0 80px rgba(59,130,246,0.15)',
                  }}>
                  <svg width="52" height="52" viewBox="0 0 52 52" fill="none">
                    <circle cx="26" cy="18" r="9" stroke="url(#ct)" strokeWidth="1.5"/>
                    <path d="M8 46c0-9 8-16 18-16s18 7 18 16" stroke="url(#ct)" strokeWidth="1.5" strokeLinecap="round"/>
                    <circle cx="26" cy="18" r="4" fill="url(#ct)" opacity="0.7"/>
                    <defs>
                      <linearGradient id="ct" x1="8" y1="8" x2="44" y2="44" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#3B82F6"/>
                        <stop offset="1" stopColor="#8B5CF6"/>
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
              </div>

              <p className="text-lg font-bold text-white mb-0.5" style={{ fontFamily: "'Poppins', sans-serif" }}>Rahul Sharma</p>
              <p className="text-xs text-blue-400 mb-5" style={{ fontFamily: "'Inter', sans-serif" }}>B.Tech CSE (AI) — 3rd Year, IIT Delhi</p>

              {/* Circular score */}
              <div className="relative w-28 h-28 mb-5">
                <svg className="w-28 h-28 -rotate-90" viewBox="0 0 112 112">
                  <circle cx="56" cy="56" r="48" fill="none" stroke="var(--border)" strokeWidth="8"/>
                  <circle cx="56" cy="56" r="48" fill="none" stroke="url(#scoreGrad)"
                    strokeWidth="8" strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 48 * (score / 100)} ${2 * Math.PI * 48}`}/>
                  <defs>
                    <linearGradient id="scoreGrad" x1="0" y1="0" x2="1" y2="0">
                      <stop stopColor="#3B82F6"/>
                      <stop offset="1" stopColor="#8B5CF6"/>
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-bold text-white" style={{ fontFamily: "'Poppins', sans-serif" }}>{score}%</span>
                  <span className="text-xs text-slate-400" style={{ fontFamily: "'Inter', sans-serif" }}>Readiness</span>
                </div>
              </div>

              {/* Quick stats */}
              <div className="w-full grid grid-cols-2 gap-3">
                {[
                  { label: 'Time to Placement', val: `${months} months` },
                  { label: 'Salary Projection', val: '₹32 LPA' },
                  { label: 'Skills Mastered', val: '24 / 40' },
                  { label: 'Interview Score', val: '91%' },
                ].map((s) => (
                  <div key={s.label} className="rounded-xl p-3 text-center"
                    style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
                    <p className="text-sm font-bold gradient-text" style={{ fontFamily: "'Poppins', sans-serif" }}>{s.val}</p>
                    <p className="text-xs text-slate-500 mt-0.5 leading-tight" style={{ fontFamily: "'Inter', sans-serif" }}>{s.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right panels */}
            <div className="lg:col-span-8 flex flex-col gap-5">
              {/* Career probabilities */}
              <div className="glass rounded-2xl p-5" style={{ border: '1px solid var(--border)' }}>
                <p className="text-sm font-semibold text-white mb-4" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  Career Probability Map
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {defaultCareerProbabilities.map((c) => (
                    <div key={c.role} className="rounded-xl p-4 relative overflow-hidden"
                      style={{ background: `${c.color}08`, border: `1px solid ${c.color}25` }}>
                      <div className="flex justify-between items-start mb-3">
                        <p className="text-sm font-semibold text-white" style={{ fontFamily: "'Poppins', sans-serif" }}>{c.role}</p>
                        <span className="text-lg font-bold" style={{ color: c.color, fontFamily: "'Poppins', sans-serif" }}>
                          {c.prob}%
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mb-2" style={{ fontFamily: "'Inter', sans-serif" }}>{c.salary}</p>
                      <div className="w-full h-1.5 rounded-full" style={{ background: 'var(--bg-surface-strong)' }}>
                        <div className="h-full rounded-full"
                          style={{ width: `${c.prob}%`, background: c.color, boxShadow: `0 0 6px ${c.color}60` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Current + Missing skills */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="glass rounded-2xl p-5" style={{ border: '1px solid var(--border)' }}>
                  <p className="text-sm font-semibold text-white mb-4" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    Current Skills
                  </p>
                  <div className="flex flex-col gap-3">
                    {defaultSkills.map((s) => (
                      <div key={s.name}>
                        <div className="flex justify-between mb-1">
                          <span className="text-xs text-slate-300" style={{ fontFamily: "'Inter', sans-serif" }}>{s.name}</span>
                          <span className="text-xs font-medium" style={{
                            color: s.status === 'strong' ? '#34D399' : s.status === 'good' ? '#3B82F6' : '#F59E0B',
                            fontFamily: "'Inter', sans-serif",
                          }}>
                            {s.level}%
                          </span>
                        </div>
                        <div className="w-full h-1 rounded-full" style={{ background: 'var(--bg-surface-strong)' }}>
                          <div className="h-full rounded-full"
                            style={{
                              width: `${s.level}%`,
                              background: s.status === 'strong' ? '#34D399' : s.status === 'good' ? '#3B82F6' : '#F59E0B',
                            }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="glass rounded-2xl p-5" style={{ border: '1px solid var(--border)' }}>
                  <p className="text-sm font-semibold text-white mb-4" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    Missing Skills
                  </p>
                  <div className="flex flex-col gap-3">
                    {defaultMissingSkills.map((s) => (
                      <div key={s.name} className="flex items-center justify-between rounded-lg px-3 py-2.5"
                        style={{ background: 'rgba(245,158,11,0.07)', border: '1px solid rgba(245,158,11,0.15)' }}>
                        <div>
                          <p className="text-xs text-white font-medium" style={{ fontFamily: "'Inter', sans-serif" }}>{s.name}</p>
                          <p className="text-xs text-slate-500 mt-0.5" style={{ fontFamily: "'Inter', sans-serif" }}>{s.time} to learn</p>
                        </div>
                        <span className="text-xs px-2 py-0.5 rounded-full"
                          style={{
                            background: s.priority === 'High' ? 'rgba(239,68,68,0.15)' : 'rgba(245,158,11,0.15)',
                            color: s.priority === 'High' ? '#EF4444' : '#F59E0B',
                            fontFamily: "'Inter', sans-serif",
                          }}>
                          {s.priority}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Salary projection timeline */}
              <div className="glass rounded-2xl p-5" style={{ border: '1px solid var(--border)' }}>
                <p className="text-sm font-semibold text-white mb-4" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  Salary Projection Timeline
                </p>
                <div className="flex items-end justify-between gap-2 h-24">
                  {[
                    { label: 'Now', val: 0, lpa: 'Student' },
                    { label: '6mo', val: 15, lpa: '₹8 LPA' },
                    { label: '12mo', val: 45, lpa: '₹18 LPA' },
                    { label: '18mo', val: 70, lpa: '₹28 LPA' },
                    { label: '24mo', val: 88, lpa: '₹32 LPA' },
                    { label: '36mo', val: 100, lpa: '₹42 LPA' },
                  ].map((point, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1">
                      <p className="text-xs text-slate-500" style={{ fontFamily: "'Inter', sans-serif" }}>{point.lpa}</p>
                      <div className="w-full rounded-t-lg transition-all duration-500"
                        style={{
                          height: `${Math.max(point.val, 4)}%`,
                          background: `linear-gradient(to top, #3B82F6, #8B5CF6)`,
                          opacity: point.val === 0 ? 0.3 : 0.8 + i * 0.03,
                          boxShadow: point.val > 0 ? '0 0 8px rgba(59,130,246,0.4)' : 'none',
                          minHeight: '4px',
                        }} />
                      <p className="text-xs text-slate-500" style={{ fontFamily: "'Inter', sans-serif" }}>{point.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  )
}
