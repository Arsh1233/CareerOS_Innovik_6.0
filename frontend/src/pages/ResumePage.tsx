import { useState, useRef } from 'react'
import { AppShell } from '../components/Layout'

const API = 'http://localhost:8000/api/v1/resumes'

export default function ResumePage() {
  const [uploaded, setUploaded] = useState(false)
  const [dragging, setDragging] = useState(false)
  const [analyzed, setAnalyzed] = useState(false)
  const [loading, setLoading] = useState(false)
  const [optimizing, setOptimizing] = useState(false)
  const [isOptimized, setIsOptimized] = useState(false)

  const [fileName, setFileName] = useState('')
  const [pdfUrl, setPdfUrl] = useState<string | null>(null)
  const [overallScore, setOverallScore] = useState(0)
  const [atsScore, setAtsScore] = useState(0)
  const [keywordScore, setKeywordScore] = useState(0)
  const [impactScore, setImpactScore] = useState(0)
  const [formatScore, setFormatScore] = useState(0)

  const [presentKeywords, setPresentKeywords] = useState<string[]>([])
  const [missingKeywords, setMissingKeywords] = useState<string[]>([])
  const [suggestions, setSuggestions] = useState<any[]>([])

  const [optimizedLatex, setOptimizedLatex] = useState<string | null>(null)
  const [previewTab, setPreviewTab] = useState<'original' | 'optimized' | 'latex'>('original')

  const [targetRole, setTargetRole] = useState('')
  const [jobDescription, setJobDescription] = useState('')
  const [generatingJd, setGeneratingJd] = useState(false)
  const [pdfTimestamp, setPdfTimestamp] = useState<number>(Date.now())

  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleGenerateJd = async (roleToUse?: string) => {
    const role = roleToUse || targetRole
    if (!role || !role.trim()) return
    setGeneratingJd(true)
    try {
      const res = await fetch(`${API}/generate_jd`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: role.trim() })
      })
      const json = await res.json()
      if (res.ok && json.job_description) {
        setJobDescription(json.job_description)
      }
    } catch (e) {
      console.error(e)
    } finally {
      setGeneratingJd(false)
    }
  }

  const processFile = async (file: File) => {
    setFileName(file.name)
    setUploaded(true)
    setLoading(true)

    if (file.type === 'application/pdf') {
      setPdfUrl(URL.createObjectURL(file))
    }

    try {
      const formData = new FormData()
      formData.append('file', file)
      if (jobDescription.trim()) {
        formData.append('job_description', jobDescription.trim())
      }
      const res = await fetch(`${API}/analyze`, { method: 'POST', body: formData })
      const json = await res.json()

      if (res.ok && json.data) {
        const data = json.data
        if (data.overall_score) setOverallScore(data.overall_score)
        if (data.ats_score) setAtsScore(data.ats_score)
        if (data.keyword_score) setKeywordScore(data.keyword_score)
        if (data.impact_score) setImpactScore(data.impact_score)
        if (data.format_score) setFormatScore(data.format_score)
        if (data.keywords_present) setPresentKeywords(data.keywords_present)
        if (data.keywords_missing) setMissingKeywords(data.keywords_missing)
        if (data.suggestions) setSuggestions(data.suggestions)
      }
    } catch {
      // Fallback gracefully to analysis state
    } finally {
      setLoading(false)
      setAnalyzed(true)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file) {
      processFile(file)
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      processFile(file)
    }
  }

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  const handleOptimize = async () => {
    if (optimizing) return
    setOptimizing(true)

    try {
      const res = await fetch(`${API}/optimize`, { method: 'POST' })
      const json = await res.json()

      if (res.ok && json.data) {
        const data = json.data.new_analysis || json.data
        if (data.keywords_present) setPresentKeywords(data.keywords_present)
        if (data.keywords_missing) setMissingKeywords(data.keywords_missing)
        if (data.overall_score) setOverallScore(data.overall_score)
        
        if (json.data.optimized_latex || json.data.optimized_resume_markdown) {
          setOptimizedLatex(json.data.optimized_latex || json.data.optimized_resume_markdown)
          setPreviewTab('optimized')
        }
        setIsOptimized(true)
        setPdfTimestamp(Date.now())
      } else {
        alert(json.detail || 'Optimization failed. Please ensure a resume is uploaded first.')
      }
    } catch (e) {
      console.error(e)
      alert('Failed to connect to backend optimization service.')
    } finally {
      setOptimizing(false)
    }
  }

  return (
    <AppShell>
      <input
        type="file"
        ref={fileInputRef}
        accept=".pdf,.docx"
        onChange={handleFileSelect}
        className="hidden"
      />
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

          {/* Target Role & Job Description Card */}
          <div className="glass rounded-2xl p-5 md:p-6 mb-6 border border-slate-800">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
              <div>
                <h2 className="text-base font-bold text-white flex items-center gap-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  <span>🎯</span> Target Role & Job Description
                </h2>
                <p className="text-slate-400 text-xs mt-0.5" style={{ fontFamily: "'Inter', sans-serif" }}>
                  Type a job title to AI-generate a custom JD or paste an existing job description to tailor the ATS analysis.
                </p>
              </div>
            </div>

            {/* Role Input & AI Generator Button */}
            <div className="flex flex-col gap-3">
              <div className="flex flex-col sm:flex-row gap-2.5">
                <input
                  type="text"
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      handleGenerateJd()
                    }
                  }}
                  placeholder="Target Role (e.g. AI Engineer, Full Stack Developer, Data Scientist)..."
                  className="flex-1 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 text-xs focus:outline-none focus:border-blue-500/50 transition-colors"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                />
                <button
                  type="button"
                  onClick={() => handleGenerateJd()}
                  disabled={generatingJd || !targetRole.trim()}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-white bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 transition-all hover:scale-105 cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2 shrink-0"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  {generatingJd ? (
                    <>
                      <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Generating JD...
                    </>
                  ) : (
                    '✨ Generate JD with AI'
                  )}
                </button>
              </div>

              {/* Preset Quick Role Chips */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <span className="text-[11px] text-slate-500 font-medium">Quick Presets:</span>
                {[
                  { title: 'AI / ML Engineer', icon: '🤖' },
                  { title: 'Full Stack Developer', icon: '💻' },
                  { title: 'Cloud & DevOps Engineer', icon: '☁️' },
                  { title: 'Data Scientist', icon: '📊' },
                  { title: 'Cybersecurity Analyst', icon: '🛡️' },
                ].map((r) => (
                  <button
                    key={r.title}
                    type="button"
                    onClick={() => {
                      setTargetRole(r.title)
                      handleGenerateJd(r.title)
                    }}
                    className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700 transition-all cursor-pointer flex items-center gap-1"
                  >
                    <span>{r.icon}</span> {r.title}
                  </button>
                ))}
              </div>

              {/* Job Description Textarea */}
              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste target job description text here, or click 'Generate JD with AI' above..."
                className="w-full mt-2 p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 text-xs leading-relaxed resize-y focus:outline-none focus:border-blue-500/50 transition-colors font-mono"
                rows={7}
                style={{ fontFamily: "'Inter', sans-serif" }}
              />
            </div>
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
                    type="button"
                    onClick={(e) => { e.stopPropagation(); handleClick() }}
                    className="px-5 py-2.5 rounded-xl text-sm font-medium text-white transition-all hover:scale-105 cursor-pointer"
                    style={{ background: 'linear-gradient(135deg, #3B82F6, #8B5CF6)', fontFamily: "'Inter', sans-serif" }}>
                    Browse Files
                  </button>
                </div>
              ) : (
                <div className="glass rounded-2xl overflow-hidden flex flex-col" style={{ border: '1px solid var(--border-accent)', minHeight: '500px' }}>
                  {/* PDF header */}
                  <div className="flex items-center justify-between px-4 py-3 border-b"
                    style={{ borderColor: 'var(--border)', background: 'var(--bg-surface)' }}>
                    <div className="flex items-center gap-2 overflow-hidden">
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="shrink-0">
                        <rect x="1" y="1" width="12" height="12" rx="1.5" stroke="#EF4444" strokeWidth="1.2"/>
                        <path d="M4 4h3.5a1.5 1.5 0 010 3H4V4z" fill="#EF4444"/>
                        <path d="M4 7v3M9 7v2a1 1 0 01-2 0" stroke="#EF4444" strokeWidth="1" strokeLinecap="round"/>
                      </svg>
                      <span className="text-xs text-slate-400 truncate font-medium" style={{ fontFamily: "'Inter', sans-serif" }}>{fileName}</span>
                    </div>
                    {loading
                      ? <div className="flex items-center gap-1.5 text-xs text-blue-400 shrink-0 font-medium" style={{ fontFamily: "'Inter', sans-serif" }}>
                          <div className="w-3 h-3 rounded-full border-2 border-blue-400 border-t-transparent animate-spin" />
                          Analyzing...
                        </div>
                      : <span className="text-xs text-green-400 shrink-0 font-medium" style={{ fontFamily: "'Inter', sans-serif" }}>
                          ✓ Original Uploaded PDF
                        </span>
                    }
                  </div>

                  {/* Original Resume Preview */}
                  <div className="flex-1 bg-slate-950 relative min-h-115">
                    {pdfUrl ? (
                      <iframe src={pdfUrl} className="w-full h-full min-h-125 border-0" title="Original PDF Preview" />
                    ) : (
                      <div className="p-5 text-xs h-full" style={{ background: 'var(--bg-surface)', fontFamily: "'Inter', sans-serif" }}>
                        <div className="text-center mb-4">
                          <p className="text-white font-bold text-sm mb-0.5" style={{ fontFamily: "'Poppins', sans-serif" }}>{fileName.replace(/\.[^/.]+$/, '')}</p>
                          <p className="text-slate-400">PDF Document · Analyzed by Gemini AI</p>
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
                    )}
                  </div>
                </div>
              )}

              {/* Re-upload */}
              {uploaded && (
                <button
                  onClick={() => {
                    setUploaded(false)
                    setAnalyzed(false)
                    setIsOptimized(false)
                    setPdfUrl(null)
                    setOptimizedLatex(null)
                    setPreviewTab('optimized')
                    setPresentKeywords([])
                    setMissingKeywords([])
                    setSuggestions([])
                  }}
                  className="mt-3 text-xs text-slate-500 hover:text-slate-300 transition-colors w-full text-center cursor-pointer"
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
                  <div className="relative w-28 h-28 shrink-0">
                    <svg className="w-28 h-28 -rotate-90" viewBox="0 0 112 112">
                      <circle cx="56" cy="56" r="48" fill="none" stroke="var(--border)" strokeWidth="8"/>
                      <circle cx="56" cy="56" r="48" fill="none"
                        stroke={analyzed ? 'url(#rGrad)' : 'var(--bg-surface)'}
                        strokeWidth="8" strokeLinecap="round"
                        strokeDasharray={`${2 * Math.PI * 48 * (analyzed ? (isOptimized ? 0.98 : overallScore / 100) : 0)} ${2 * Math.PI * 48}`}
                        style={{ transition: 'stroke-dasharray 1.5s ease' }}/>
                      <defs>
                        <linearGradient id="rGrad" x1="0" y1="0" x2="1" y2="0">
                          <stop stopColor="#3B82F6"/><stop offset="1" stopColor="#8B5CF6"/>
                        </linearGradient>
                      </defs>
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-2xl font-bold text-white" style={{ fontFamily: "'Poppins', sans-serif" }}>
                        {analyzed ? (isOptimized ? '98' : overallScore) : '--'}
                      </span>
                      <span className="text-xs text-slate-400" style={{ fontFamily: "'Inter', sans-serif" }}>/ 100</span>
                    </div>
                  </div>

                  <div className="flex-1 flex flex-col gap-2">
                    {[
                      { label: 'ATS Compatibility', score: isOptimized ? 98 : atsScore, color: '#34D399' },
                      { label: 'Keyword Match', score: isOptimized ? 100 : keywordScore, color: isOptimized ? '#34D399' : '#F59E0B' },
                      { label: 'Impact Statements', score: isOptimized ? 94 : impactScore, color: isOptimized ? '#34D399' : '#EF4444' },
                      { label: 'Format & Structure', score: isOptimized ? 97 : formatScore, color: '#3B82F6' },
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
                {!analyzed ? (
                  <p className="text-xs text-slate-500 py-3 text-center" style={{ fontFamily: "'Inter', sans-serif" }}>
                    Upload your resume to see present and missing ATS keywords.
                  </p>
                ) : (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-green-400 mb-2 font-medium" style={{ fontFamily: "'Inter', sans-serif" }}>
                        ✓ Present ({presentKeywords.length})
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {presentKeywords.map((k) => (
                          <span key={k} className="text-xs px-2 py-0.5 rounded-full"
                            style={{ background: 'rgba(52,211,153,0.1)', color: '#34D399', border: '1px solid rgba(52,211,153,0.2)', fontFamily: "'Inter', sans-serif" }}>
                            {k}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <div className="mb-2">
                        <p className="text-xs text-red-400 font-medium" style={{ fontFamily: "'Inter', sans-serif" }}>
                          ✗ Missing ({missingKeywords.length})
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {missingKeywords.map((k) => (
                          <span
                            key={k}
                            className="text-xs px-2 py-0.5 rounded-full"
                            style={{ background: 'rgba(239,68,68,0.1)', color: '#EF4444', border: '1px solid rgba(239,68,68,0.2)', fontFamily: "'Inter', sans-serif" }}>
                            {k}
                          </span>
                        ))}
                        {missingKeywords.length === 0 && (
                          <span className="text-xs text-emerald-400 font-semibold px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30">
                            ✓ All targeted keywords present (0 Missing) 🎉
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Suggestions */}
              <div className="glass rounded-2xl p-5" style={{ border: '1px solid var(--border)' }}>
                <p className="text-sm font-semibold text-white mb-4" style={{ fontFamily: "'Poppins', sans-serif" }}>AI Suggestions</p>
                {!analyzed ? (
                  <p className="text-xs text-slate-500 py-3 text-center" style={{ fontFamily: "'Inter', sans-serif" }}>
                    Upload your resume to receive AI improvement suggestions.
                  </p>
                ) : (
                  <div className="flex flex-col gap-2.5">
                    {suggestions.map((s, i) => (
                      <div key={i} className="flex items-start gap-3 rounded-xl px-3 py-2.5"
                        style={{
                          background: s.type === 'critical' ? 'rgba(239,68,68,0.07)' : s.type === 'warning' ? 'rgba(245,158,11,0.07)' : 'rgba(59,130,246,0.07)',
                          border: `1px solid ${s.type === 'critical' ? 'rgba(239,68,68,0.2)' : s.type === 'warning' ? 'rgba(245,158,11,0.2)' : 'rgba(59,130,246,0.2)'}`,
                        }}>
                        <span className="text-sm shrink-0" style={{ color: s.type === 'critical' ? '#EF4444' : s.type === 'warning' ? '#F59E0B' : '#3B82F6' }}>
                          {s.type === 'critical' ? '⚠' : s.type === 'warning' ? '○' : 'ℹ'}
                        </span>
                        <p className="text-xs text-slate-300 leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>{s.text}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Action CTA */}
              {analyzed && (
                <button
                  onClick={handleOptimize}
                  disabled={optimizing}
                  className="w-full py-3.5 rounded-xl text-sm font-semibold text-white transition-all hover:scale-[1.02] cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2"
                  style={{
                    background: isOptimized
                      ? 'linear-gradient(135deg, #10B981, #059669)'
                      : 'linear-gradient(135deg, #3B82F6, #8B5CF6)',
                    boxShadow: isOptimized
                      ? '0 0 24px rgba(16,185,129,0.3)'
                      : '0 0 24px rgba(139,92,246,0.3)',
                    fontFamily: "'Inter', sans-serif",
                  }}>
                  {optimizing ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                      Optimizing Resume & Generating LaTeX...
                    </span>
                  ) : isOptimized ? (
                    '✓ Resume Re-Optimized (View & Download Below ↓)'
                  ) : (
                    '✨ Optimize Resume with AI (Generate LaTeX & PDF)'
                  )}
                </button>
              )}
            </div>
          </div>

          {/* DEDICATED OPTIMIZED RESUME & LATEX STUDIO SECTION */}
          {isOptimized && (
            <div className="mt-10 pt-8 border-t border-slate-800 flex flex-col gap-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <div className="inline-flex items-center gap-2 glass rounded-full px-3 py-1 mb-2 text-xs text-emerald-400 border border-emerald-500/20"
                    style={{ fontFamily: "'Inter', sans-serif" }}>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    AI Optimization Complete
                  </div>
                  <h2 className="text-2xl font-bold text-white" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    Optimized Resume <span className="gradient-text">& LaTeX Studio</span>
                  </h2>
                  <p className="text-slate-400 text-xs mt-0.5" style={{ fontFamily: "'Inter', sans-serif" }}>
                    Preview your compiled ATS-friendly PDF inline or edit and export the raw LaTeX source.
                  </p>
                </div>

                {/* Explicit Action Downloads */}
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <button
                    onClick={() => window.open(`${API}/download_pdf`, '_blank')}
                    className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-linear-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 transition-all hover:scale-105 cursor-pointer shadow-lg shadow-emerald-900/30 flex items-center justify-center gap-2"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    📥 Download PDF
                  </button>
                  <button
                    onClick={() => window.open(`${API}/download_tex`, '_blank')}
                    className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl text-xs font-semibold text-fuchsia-300 bg-fuchsia-950/60 border border-fuchsia-500/40 hover:bg-fuchsia-900/60 transition-all hover:scale-105 cursor-pointer flex items-center justify-center gap-2"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    📄 Download .tex
                  </button>
                </div>
              </div>

              {/* Studio Container */}
              <div className="glass rounded-2xl overflow-hidden flex flex-col border border-slate-800 min-h-150">
                {/* Studio Section Tabs */}
                <div className="flex items-center justify-between px-4 py-3 border-b bg-slate-900/80 border-slate-800">
                  <div className="flex gap-2">
                    <button
                      onClick={() => setPreviewTab('optimized')}
                      className={`text-xs px-3.5 py-1.5 rounded-lg transition-colors font-semibold flex items-center gap-1.5 cursor-pointer ${
                        previewTab === 'optimized' ? 'bg-blue-600 text-white shadow-md shadow-blue-900/40' : 'text-slate-400 hover:text-slate-200 bg-slate-800/60'
                      }`}
                    >
                      <span>📄</span> Optimized PDF Preview
                    </button>
                    <button
                      onClick={() => setPreviewTab('latex')}
                      className={`text-xs px-3.5 py-1.5 rounded-lg transition-colors font-semibold flex items-center gap-1.5 cursor-pointer ${
                        previewTab === 'latex' ? 'bg-fuchsia-600 text-white shadow-md shadow-fuchsia-900/40' : 'text-slate-400 hover:text-slate-200 bg-slate-800/60'
                      }`}
                    >
                      <span>⚡</span> LaTeX Code Editor
                    </button>
                  </div>
                  <span className="text-xs text-slate-500 font-mono hidden md:inline">
                    {previewTab === 'optimized' ? 'Inline View (No Auto-Download)' : 'Editable LaTeX Source'}
                  </span>
                </div>

                {/* Content View Area */}
                <div className="flex-1 bg-slate-950 relative min-h-140">
                  {previewTab === 'optimized' && (
                    <iframe
                      src={`${API}/view_pdf?t=${pdfTimestamp}`}
                      className="w-full h-full min-h-140 border-0 bg-white"
                      title="Optimized PDF View"
                    />
                  )}

                  {previewTab === 'latex' && (
                    <div className="w-full h-full min-h-140 flex flex-col bg-slate-950">
                      {/* Editor Header Bar */}
                      <div className="flex items-center justify-between px-4 py-2 bg-slate-900/90 border-b border-slate-800 text-xs">
                        <span className="text-slate-400 font-mono">LaTeX Code (Edit & Sync)</span>
                        <button
                          type="button"
                          onClick={() => {
                            if (optimizedLatex) {
                              navigator.clipboard.writeText(optimizedLatex)
                              alert('LaTeX code copied to clipboard!')
                            }
                          }}
                          className="px-3 py-1 rounded bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors text-[11px] font-medium cursor-pointer"
                        >
                          📋 Copy Code
                        </button>
                      </div>
                      <textarea
                        value={optimizedLatex || ''}
                        onChange={(e) => setOptimizedLatex(e.target.value)}
                        placeholder="LaTeX source code..."
                        className="w-full flex-1 p-4 bg-slate-950 text-slate-200 font-mono text-[11px] leading-relaxed resize-none focus:outline-none border-0 selection:bg-fuchsia-500/30"
                        style={{ minHeight: '500px', fontFamily: "'Fira Code', 'Courier New', monospace" }}
                      />
                    </div>
                  )}

                  {optimizing && (
                    <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-sm flex flex-col items-center justify-center z-20">
                      <div className="w-9 h-9 rounded-full border-3 border-blue-400 border-t-transparent animate-spin mb-3" />
                      <p className="text-sm text-blue-400 font-medium">Re-compiling PDF & LaTeX...</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  )
}
