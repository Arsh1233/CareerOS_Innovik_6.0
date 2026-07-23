import { useState } from 'react'
import { AppShell } from '../components/Layout'

const keywords = {
  present: ['Python', 'Machine Learning', 'TensorFlow', 'React', 'SQL', 'Git', 'REST APIs', 'Docker'],
  missing: ['Kubernetes', 'MLOps', 'LangChain', 'Vector DB', 'System Design', 'Distributed Systems'],
}

const suggestions = [
  { type: 'critical', text: 'Add quantified metrics to your project descriptions (e.g., "improved model accuracy by 12%")' },
  { type: 'critical', text: 'Include MLOps tools (MLflow, Kubeflow) — required in 73% of AI Engineer JDs' },
  { type: 'warning', text: 'Your Summary section is too generic — tailor it to "AI/ML Engineer" specifically' },
  { type: 'warning', text: 'Add GitHub links to all 3 listed projects' },
  { type: 'info', text: 'Move your Skills section above Education for technical roles' },
  { type: 'info', text: 'Add a "Projects" section with 2-3 production-grade examples' },
]

export default function ResumePage() {
  const [uploaded, setUploaded] = useState(false)
  const [dragging, setDragging] = useState(false)
  const [analyzed, setAnalyzed] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragging(false)
    setUploaded(true)
    setLoading(true)
    setTimeout(() => { setLoading(false); setAnalyzed(true) }, 2000)
  }

  const handleClick = () => {
    setUploaded(true)
    setLoading(true)
    setTimeout(() => { setLoading(false); setAnalyzed(true) }, 2000)
  }

  return (
    <AppShell>
      <div className="min-h-screen px-4 md:px-6 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 glass rounded-full px-3 py-1 mb-3 text-xs text-cyan-400 border border-cyan-500/20"
              style={{ fontFamily: "'Inter', sans-serif" }}>
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
              AI-Powered Analysis
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
              Resume <span className="gradient-text">Analyzer</span>
            </h1>
            <p className="text-slate-400 text-sm" style={{ fontFamily: "'Inter', sans-serif" }}>
              ATS-score your resume and get AI-driven improvements in seconds.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* Upload / Preview area */}
            <div className="lg:col-span-5">
              {!uploaded ? (
                <div
                  className="rounded-2xl p-10 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300"
                  style={{
                    background: dragging ? 'rgba(59,130,246,0.08)' : 'var(--bg-surface)',
                    border: `2px dashed ${dragging ? 'rgba(59,130,246,0.6)' : 'var(--input-border)'}`,
                    minHeight: '360px',
                  }}
                  onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
                  onDragLeave={() => setDragging(false)}
                  onDrop={handleDrop}
                  onClick={handleClick}
                >
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5"
                    style={{ background: dragging ? 'rgba(59,130,246,0.2)' : 'var(--input-bg)', border: '1px solid var(--input-border)' }}>
                    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="#3B82F6" strokeWidth="1.5">
                      <path d="M14 3v16M8 9l6-6 6 6"/>
                      <path d="M4 20v4h20v-4"/>
                    </svg>
                  </div>
                  <p className="text-white font-semibold mb-1.5" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    Drop your resume here
                  </p>
                  <p className="text-slate-500 text-sm mb-4" style={{ fontFamily: "'Inter', sans-serif" }}>
                    PDF, DOCX up to 5MB
                  </p>
                  <button
                    className="px-5 py-2.5 rounded-xl text-sm font-medium text-white transition-all hover:scale-105"
                    style={{ background: 'linear-gradient(135deg, #3B82F6, #8B5CF6)', fontFamily: "'Inter', sans-serif" }}>
                    Browse Files
                  </button>
                </div>
              ) : (
                <div className="glass rounded-2xl overflow-hidden" style={{ border: '1px solid var(--border-accent)', minHeight: '360px' }}>
                  {/* PDF mock header */}
                  <div className="flex items-center justify-between px-4 py-3 border-b"
                    style={{ borderColor: 'var(--border)', background: 'var(--bg-surface)' }}>
                    <div className="flex items-center gap-2">
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <rect x="1" y="1" width="12" height="12" rx="1.5" stroke="#EF4444" strokeWidth="1.2"/>
                        <path d="M4 4h3.5a1.5 1.5 0 010 3H4V4z" fill="#EF4444"/>
                        <path d="M4 7v3M9 7v2a1 1 0 01-2 0" stroke="#EF4444" strokeWidth="1" strokeLinecap="round"/>
                      </svg>
                      <span className="text-xs text-slate-400" style={{ fontFamily: "'Inter', sans-serif" }}>Rahul_Sharma_Resume.pdf</span>
                    </div>
                    {loading
                      ? <div className="flex items-center gap-1.5 text-xs text-blue-400" style={{ fontFamily: "'Inter', sans-serif" }}>
                          <div className="w-3 h-3 rounded-full border-2 border-blue-400 border-t-transparent animate-spin" />
                          Analyzing...
                        </div>
                      : <span className="text-xs text-green-400" style={{ fontFamily: "'Inter', sans-serif" }}>✓ Analyzed</span>
                    }
                  </div>

                  {/* Resume preview mock */}
                  <div className="p-5 text-xs" style={{ background: 'var(--bg-surface)', fontFamily: "'Inter', sans-serif" }}>
                    <div className="text-center mb-4">
                      <p className="text-white font-bold text-sm mb-0.5" style={{ fontFamily: "'Poppins', sans-serif" }}>Rahul Sharma</p>
                      <p className="text-slate-400">rahul@iit.ac.in · Delhi, India · github.com/rahul</p>
                    </div>
                    {['Education', 'Experience', 'Projects', 'Skills'].map((section) => (
                      <div key={section} className="mb-4">
                        <div className="text-slate-300 font-semibold border-b mb-2 pb-1"
                          style={{ borderColor: 'var(--border-accent)', fontFamily: "'Poppins', sans-serif" }}>
                          {section}
                        </div>
                        {Array.from({ length: section === 'Skills' ? 2 : 3 }).map((_, i) => (
                          <div key={i} className="h-2 rounded-full mb-1.5"
                            style={{ background: 'var(--bg-surface-strong)', width: `${60 + Math.random() * 35}%` }} />
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Re-upload */}
              {uploaded && (
                <button
                  onClick={() => { setUploaded(false); setAnalyzed(false) }}
                  className="mt-3 text-xs text-slate-500 hover:text-slate-300 transition-colors w-full text-center"
                  style={{ fontFamily: "'Inter', sans-serif" }}>
                  Upload a different resume
                </button>
              )}
            </div>

            {/* Analysis results */}
            <div className="lg:col-span-7 flex flex-col gap-4">
              {/* Score meter */}
              <div className="glass rounded-2xl p-5" style={{ border: '1px solid var(--border)' }}>
                <p className="text-sm font-semibold text-white mb-4" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  Resume Score
                </p>
                <div className="flex items-center gap-6">
                  {/* Big score */}
                  <div className="relative w-28 h-28 flex-shrink-0">
                    <svg className="w-28 h-28 -rotate-90" viewBox="0 0 112 112">
                      <circle cx="56" cy="56" r="48" fill="none" stroke="var(--border)" strokeWidth="8"/>
                      <circle cx="56" cy="56" r="48" fill="none"
                        stroke={analyzed ? 'url(#rGrad)' : 'var(--bg-surface)'}
                        strokeWidth="8" strokeLinecap="round"
                        strokeDasharray={`${2 * Math.PI * 48 * (analyzed ? 0.76 : 0)} ${2 * Math.PI * 48}`}
                        style={{ transition: 'stroke-dasharray 1.5s ease' }}/>
                      <defs>
                        <linearGradient id="rGrad" x1="0" y1="0" x2="1" y2="0">
                          <stop stopColor="#3B82F6"/><stop offset="1" stopColor="#8B5CF6"/>
                        </linearGradient>
                      </defs>
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-2xl font-bold text-white" style={{ fontFamily: "'Poppins', sans-serif" }}>
                        {analyzed ? '76' : '--'}
                      </span>
                      <span className="text-xs text-slate-400" style={{ fontFamily: "'Inter', sans-serif" }}>/ 100</span>
                    </div>
                  </div>

                  <div className="flex-1 flex flex-col gap-2">
                    {[
                      { label: 'ATS Compatibility', score: 91, color: '#34D399' },
                      { label: 'Keyword Match', score: 68, color: '#F59E0B' },
                      { label: 'Impact Statements', score: 55, color: '#EF4444' },
                      { label: 'Format & Structure', score: 88, color: '#3B82F6' },
                    ].map((s) => (
                      <div key={s.label}>
                        <div className="flex justify-between mb-0.5">
                          <span className="text-xs text-slate-400" style={{ fontFamily: "'Inter', sans-serif" }}>{s.label}</span>
                          <span className="text-xs font-medium" style={{ color: s.color, fontFamily: "'Inter', sans-serif" }}>
                            {analyzed ? `${s.score}%` : '--'}
                          </span>
                        </div>
                        <div className="w-full h-1 rounded-full bg-slate-800">
                          <div className="h-full rounded-full transition-all duration-1000"
                            style={{ width: analyzed ? `${s.score}%` : '0%', background: s.color }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Keywords */}
              <div className="glass rounded-2xl p-5" style={{ border: '1px solid var(--border)' }}>
                <p className="text-sm font-semibold text-white mb-4" style={{ fontFamily: "'Poppins', sans-serif" }}>Keywords Analysis</p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-green-400 mb-2 font-medium" style={{ fontFamily: "'Inter', sans-serif" }}>✓ Present</p>
                    <div className="flex flex-wrap gap-1.5">
                      {keywords.present.map((k) => (
                        <span key={k} className="text-xs px-2 py-0.5 rounded-full"
                          style={{ background: 'rgba(52,211,153,0.1)', color: '#34D399', border: '1px solid rgba(52,211,153,0.2)', fontFamily: "'Inter', sans-serif" }}>
                          {k}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-red-400 mb-2 font-medium" style={{ fontFamily: "'Inter', sans-serif" }}>✗ Missing</p>
                    <div className="flex flex-wrap gap-1.5">
                      {keywords.missing.map((k) => (
                        <span key={k} className="text-xs px-2 py-0.5 rounded-full"
                          style={{ background: 'rgba(239,68,68,0.1)', color: '#EF4444', border: '1px solid rgba(239,68,68,0.2)', fontFamily: "'Inter', sans-serif" }}>
                          {k}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Suggestions */}
              <div className="glass rounded-2xl p-5" style={{ border: '1px solid var(--border)' }}>
                <p className="text-sm font-semibold text-white mb-4" style={{ fontFamily: "'Poppins', sans-serif" }}>AI Suggestions</p>
                <div className="flex flex-col gap-2.5">
                  {suggestions.map((s, i) => (
                    <div key={i} className="flex items-start gap-3 rounded-xl px-3 py-2.5"
                      style={{
                        background: s.type === 'critical' ? 'rgba(239,68,68,0.07)' : s.type === 'warning' ? 'rgba(245,158,11,0.07)' : 'rgba(59,130,246,0.07)',
                        border: `1px solid ${s.type === 'critical' ? 'rgba(239,68,68,0.2)' : s.type === 'warning' ? 'rgba(245,158,11,0.2)' : 'rgba(59,130,246,0.2)'}`,
                      }}>
                      <span className="text-sm flex-shrink-0" style={{ color: s.type === 'critical' ? '#EF4444' : s.type === 'warning' ? '#F59E0B' : '#3B82F6' }}>
                        {s.type === 'critical' ? '⚠' : s.type === 'warning' ? '○' : 'ℹ'}
                      </span>
                      <p className="text-xs text-slate-300 leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>{s.text}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Download CTA */}
              {analyzed && (
                <button
                  className="w-full py-3.5 rounded-xl text-sm font-semibold text-white transition-all hover:scale-[1.02]"
                  style={{
                    background: 'linear-gradient(135deg, #3B82F6, #8B5CF6)',
                    boxShadow: '0 0 24px rgba(139,92,246,0.3)',
                    fontFamily: "'Inter', sans-serif",
                  }}>
                  ↓ Download AI-Optimized Resume
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  )
}
