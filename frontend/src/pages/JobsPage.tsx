import { useState } from 'react'
import { AppShell } from '../components/Layout'
import { useJobs, STATUS_COLORS } from '../context/JobsContext'

const filters = ['All', 'Full-time', 'Internship', 'Remote']

const STUDENT_ID = 'rahul'
const STUDENT = {
  studentId: STUDENT_ID, studentName: 'Rahul Sharma', studentAvatar: 'RS',
  college: 'IIT Delhi', branch: 'CSE AI', cgpa: '9.2', matchScore: 0,
}

const PIPELINE_STAGES = ['Applied', 'Shortlisted', 'Interview', 'Offer']

const NEXT_STEP: Record<string, string> = {
  Applied: 'Awaiting screening — usually 3–5 business days',
  Shortlisted: 'Prepare for technical interview — check AI Mentor',
  Interview: '🎯 Interview scheduled! Review mock interview feedback',
  Offer: '🎉 Congratulations! Review and accept your offer',
  Rejected: 'Keep going — 87% of successful hires applied 5+ times',
}

function MatchRing({ pct, color, size = 72 }: { pct: number; color: string; size?: number }) {
  const r = (size - 10) / 2
  const circ = 2 * Math.PI * r
  const dash = (pct / 100) * circ
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ flexShrink: 0 }}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="5" />
      <circle
        cx={size / 2} cy={size / 2} r={r} fill="none"
        stroke={color} strokeWidth="5"
        strokeDasharray={`${dash} ${circ - dash}`}
        strokeLinecap="round"
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
      />
      <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle"
        fill={color} fontSize="13" fontWeight="700" fontFamily="'Poppins', sans-serif">
        {pct}%
      </text>
    </svg>
  )
}

export default function JobsPage() {
  const { jobs, applyToJob, hasApplied, getJobApplications, getStudentApplications } = useJobs()
  const [tab, setTab] = useState<'browse' | 'my-applications'>('browse')
  const [activeFilter, setActiveFilter] = useState('All')
  const [search, setSearch] = useState('')
  const [selectedJobId, setSelectedJobId] = useState<string>(jobs[0]?.id ?? '')
  const [saved, setSaved] = useState<Set<string>>(new Set())

  // ── Browse Tab ──────────────────────────────────────────────────────────────
  const filtered = jobs.filter((j) => {
    const matchFilter = activeFilter === 'All' || j.type === activeFilter || (activeFilter === 'Remote' && j.remote)
    const matchSearch = !search || j.company.toLowerCase().includes(search.toLowerCase()) || j.title.toLowerCase().includes(search.toLowerCase())
    return matchFilter && matchSearch
  })

  const selectedJob = jobs.find((j) => j.id === selectedJobId) ?? filtered[0] ?? null

  // ── My Applications Tab ─────────────────────────────────────────────────────
  const myApps = getStudentApplications(STUDENT_ID)
  const shortlisted = myApps.filter((a) => a.status === 'Shortlisted').length
  const interviews = myApps.filter((a) => a.status === 'Interview').length
  const offers = myApps.filter((a) => a.status === 'Offer').length

  const SKILL_MATCH_SEED = [88, 75, 82, 70]

  return (
    <AppShell>
      <div className="min-h-screen px-4 md:px-6 py-8">
        <div className="max-w-7xl mx-auto">

          {/* Header */}
          <div className="mb-6">
            <div className="inline-flex items-center gap-2 glass rounded-full px-3 py-1 mb-3 text-xs border"
              style={{ fontFamily: "'Inter', sans-serif", color: '#60A5FA', borderColor: 'rgba(59,130,246,0.2)' }}>
              <span className="w-1.5 h-1.5 rounded-full animate-pulse-glow" style={{ background: '#60A5FA' }} />
              NEXUS · AI Job Matching
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2" style={{ fontFamily: "'Poppins', sans-serif", color: 'var(--text-1)' }}>
              Job <span className="gradient-text">Opportunities</span>
            </h1>
            <p className="text-sm" style={{ fontFamily: "'Inter', sans-serif", color: 'var(--text-2)' }}>
              {filtered.length} opportunities matched to your profile · Updated 12 min ago
            </p>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 mb-6 glass rounded-xl p-1" style={{ border: '1px solid var(--border)', width: 'fit-content' }}>
            {(['browse', 'my-applications'] as const).map((t) => (
              <button key={t} onClick={() => setTab(t)}
                className="px-5 py-2 rounded-lg text-sm font-medium transition-all duration-200"
                style={{
                  background: tab === t ? 'linear-gradient(135deg, #3B82F6, #8B5CF6)' : 'transparent',
                  color: tab === t ? '#fff' : 'var(--text-2)',
                  fontFamily: "'Inter', sans-serif",
                }}>
                {t === 'browse' ? 'Browse Jobs' : `My Applications${myApps.length ? ` (${myApps.length})` : ''}`}
              </button>
            ))}
          </div>

          {/* ── BROWSE TAB ── */}
          {tab === 'browse' && (
            <>
              {/* Search + filters */}
              <div className="flex flex-col sm:flex-row gap-3 mb-6">
                <div className="flex-1 flex items-center gap-2 glass rounded-xl px-4 py-2.5"
                  style={{ border: '1px solid var(--border)' }}>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="rgba(148,163,184,0.5)" strokeWidth="1.5">
                    <circle cx="7" cy="7" r="5" /><path d="M11 11l3 3" />
                  </svg>
                  <input type="text" placeholder="Search roles, companies..."
                    value={search} onChange={(e) => setSearch(e.target.value)}
                    className="flex-1 bg-transparent text-sm outline-none"
                    style={{ fontFamily: "'Inter', sans-serif", color: 'var(--text-1)' }}
                  />
                </div>
                <div className="flex gap-2 flex-wrap">
                  {filters.map((f) => (
                    <button key={f} onClick={() => setActiveFilter(f)}
                      className="px-4 py-2 rounded-xl text-xs font-medium transition-all duration-200"
                      style={{
                        background: activeFilter === f ? 'linear-gradient(135deg, #3B82F6, #8B5CF6)' : 'var(--bg-surface)',
                        border: activeFilter === f ? 'none' : '1px solid var(--border)',
                        color: activeFilter === f ? '#fff' : 'var(--text-2)',
                        fontFamily: "'Inter', sans-serif",
                      }}>
                      {f}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                {/* Job list */}
                <div className="lg:col-span-5 flex flex-col gap-3">
                  {filtered.map((job) => {
                    const applied = hasApplied(job.id, STUDENT_ID)
                    const appCount = getJobApplications(job.id).length
                    const isSelected = job.id === selectedJobId
                    return (
                      <div key={job.id}
                        onClick={() => setSelectedJobId(job.id)}
                        className="glass rounded-2xl p-4 cursor-pointer transition-all duration-200 hover:scale-[1.01]"
                        style={{
                          border: isSelected ? `1px solid ${job.color}50` : '1px solid var(--border)',
                          boxShadow: isSelected ? `0 0 20px ${job.color}15` : 'none',
                        }}>
                        <div className="flex items-start justify-between mb-2.5">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold flex-shrink-0"
                              style={{ background: `${job.color}18`, color: job.color, border: `1px solid ${job.color}25`, fontFamily: "'Poppins', sans-serif" }}>
                              {job.company[0]}
                            </div>
                            <div>
                              <p className="text-sm font-semibold" style={{ fontFamily: "'Poppins', sans-serif", color: 'var(--text-1)' }}>{job.title}</p>
                              <p className="text-xs" style={{ fontFamily: "'Inter', sans-serif", color: 'var(--text-2)' }}>{job.company} · {job.location}</p>
                            </div>
                          </div>
                          {applied && (
                            <span className="text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0"
                              style={{ background: 'rgba(52,211,153,0.12)', color: '#34D399', border: '1px solid rgba(52,211,153,0.25)', fontFamily: "'Inter', sans-serif" }}>
                              Applied
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-1.5 mb-2">
                          <span className="text-xs px-2 py-0.5 rounded-full"
                            style={{ background: `${job.color}12`, color: job.color, fontFamily: "'Inter', sans-serif" }}>
                            {job.type}
                          </span>
                          <span className="text-xs" style={{ color: 'var(--text-3)', fontFamily: "'Inter', sans-serif" }}>·</span>
                          <span className="text-xs" style={{ color: 'var(--text-3)', fontFamily: "'Inter', sans-serif" }}>{job.location.split(',')[0]}</span>
                          <span className="text-xs" style={{ color: 'var(--text-3)', fontFamily: "'Inter', sans-serif" }}>·</span>
                          <span className="text-xs" style={{ color: 'var(--text-3)', fontFamily: "'Inter', sans-serif" }}>{job.salary}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex gap-1.5 flex-wrap">
                            {job.skills.slice(0, 3).map((s) => (
                              <span key={s} className="text-xs px-2 py-0.5 rounded-full"
                                style={{ background: 'var(--bg-surface)', color: 'var(--text-2)', border: '1px solid var(--border)', fontFamily: "'Inter', sans-serif" }}>
                                {s}
                              </span>
                            ))}
                          </div>
                          <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                            <span className="text-xs font-bold px-2 py-0.5 rounded-full"
                              style={{ background: `${job.color}18`, color: job.color, fontFamily: "'Poppins', sans-serif" }}>
                              {job.match}%
                            </span>
                          </div>
                        </div>
                        <div className="mt-2">
                          <span className="text-xs" style={{ color: 'var(--text-3)', fontFamily: "'Inter', sans-serif" }}>
                            {appCount} applicant{appCount !== 1 ? 's' : ''}
                          </span>
                        </div>
                      </div>
                    )
                  })}
                </div>

                {/* Job detail */}
                {selectedJob && (
                  <div className="lg:col-span-7">
                    <div className="glass rounded-2xl p-6 sticky top-20" style={{ border: `1px solid ${selectedJob.color}30` }}>

                      {/* Company header */}
                      <div className="flex items-start gap-4 mb-5">
                        <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold flex-shrink-0"
                          style={{
                            background: `linear-gradient(135deg, ${selectedJob.color}30, ${selectedJob.color}10)`,
                            color: selectedJob.color,
                            border: `1px solid ${selectedJob.color}30`,
                            fontFamily: "'Poppins', sans-serif",
                          }}>
                          {selectedJob.company[0]}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h2 className="text-xl font-bold mb-1" style={{ fontFamily: "'Poppins', sans-serif", color: 'var(--text-1)' }}>{selectedJob.title}</h2>
                          <p className="text-sm mb-2" style={{ fontFamily: "'Inter', sans-serif", color: 'var(--text-2)' }}>{selectedJob.company}</p>
                          <div className="flex gap-2 flex-wrap">
                            <span className="text-xs px-2.5 py-1 rounded-full"
                              style={{ background: `${selectedJob.color}15`, color: selectedJob.color, border: `1px solid ${selectedJob.color}25`, fontFamily: "'Inter', sans-serif" }}>
                              {selectedJob.type}
                            </span>
                            <span className="text-xs px-2.5 py-1 rounded-full"
                              style={{ background: 'var(--bg-surface)', color: 'var(--text-2)', border: '1px solid var(--border)', fontFamily: "'Inter', sans-serif" }}>
                              📍 {selectedJob.location}
                            </span>
                          </div>
                        </div>
                        <MatchRing pct={selectedJob.match} color={selectedJob.color} size={72} />
                      </div>

                      {/* Meta grid */}
                      <div className="grid grid-cols-3 gap-3 mb-5">
                        {[
                          { label: 'Salary', val: selectedJob.salary },
                          { label: 'Openings', val: `${selectedJob.openings} seats` },
                          { label: 'Deadline', val: selectedJob.deadline },
                        ].map((m) => (
                          <div key={m.label} className="rounded-xl p-3 text-center"
                            style={{ background: `${selectedJob.color}08`, border: `1px solid ${selectedJob.color}15` }}>
                            <p className="text-xs mb-0.5" style={{ fontFamily: "'Inter', sans-serif", color: 'var(--text-2)' }}>{m.label}</p>
                            <p className="text-xs font-semibold" style={{ fontFamily: "'Poppins', sans-serif", color: 'var(--text-1)' }}>{m.val}</p>
                          </div>
                        ))}
                      </div>

                      {/* Skills */}
                      <div className="mb-5">
                        <p className="text-xs font-medium mb-2 uppercase tracking-wider" style={{ fontFamily: "'Inter', sans-serif", color: 'var(--text-2)' }}>
                          Required Skills
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {selectedJob.skills.map((s) => (
                            <span key={s} className="text-xs px-3 py-1 rounded-full"
                              style={{ background: `${selectedJob.color}12`, color: selectedJob.color, border: `1px solid ${selectedJob.color}25`, fontFamily: "'Inter', sans-serif" }}>
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Description */}
                      <div className="mb-5">
                        <p className="text-xs font-medium mb-2 uppercase tracking-wider" style={{ fontFamily: "'Inter', sans-serif", color: 'var(--text-2)' }}>
                          About the Role
                        </p>
                        <p className="text-sm leading-relaxed" style={{ fontFamily: "'Inter', sans-serif", color: 'var(--text-2)' }}>
                          {selectedJob.description}
                        </p>
                      </div>

                      {/* Requirements */}
                      <div className="mb-5">
                        <p className="text-xs font-medium mb-2 uppercase tracking-wider" style={{ fontFamily: "'Inter', sans-serif", color: 'var(--text-2)' }}>
                          Requirements
                        </p>
                        <div className="flex flex-col gap-1.5">
                          {selectedJob.requirements.map((req, i) => (
                            <div key={i} className="flex items-start gap-2">
                              <span className="text-xs mt-0.5 flex-shrink-0" style={{ color: selectedJob.color }}>✓</span>
                              <span className="text-sm" style={{ fontFamily: "'Inter', sans-serif", color: 'var(--text-2)' }}>{req}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* NEXUS AI Match breakdown */}
                      <div className="mb-5 rounded-xl p-4" style={{ background: `${selectedJob.color}06`, border: `1px solid ${selectedJob.color}15` }}>
                        <p className="text-xs font-medium mb-3 uppercase tracking-wider" style={{ fontFamily: "'Inter', sans-serif", color: selectedJob.color }}>
                          NEXUS AI Match Breakdown
                        </p>
                        {selectedJob.skills.slice(0, 4).map((skill, i) => {
                          const pct = SKILL_MATCH_SEED[i] ?? 70
                          return (
                            <div key={skill} className="mb-2.5">
                              <div className="flex justify-between mb-1">
                                <span className="text-xs" style={{ fontFamily: "'Inter', sans-serif", color: 'var(--text-2)' }}>{skill}</span>
                                <span className="text-xs font-medium" style={{ color: selectedJob.color, fontFamily: "'Inter', sans-serif" }}>{pct}%</span>
                              </div>
                              <div className="w-full h-1.5 rounded-full" style={{ background: 'rgba(255,255,255,0.06)' }}>
                                <div className="h-full rounded-full transition-all duration-700"
                                  style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${selectedJob.color}, ${selectedJob.color}80)` }} />
                              </div>
                            </div>
                          )
                        })}
                      </div>

                      {/* CTA */}
                      <div className="flex gap-3">
                        {hasApplied(selectedJob.id, STUDENT_ID) ? (
                          <div className="flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-medium"
                            style={{ background: 'rgba(52,211,153,0.12)', border: '1px solid rgba(52,211,153,0.3)', color: '#34D399', fontFamily: "'Inter', sans-serif" }}>
                            ✓ Application Submitted
                          </div>
                        ) : (
                          <button
                            onClick={() => applyToJob(selectedJob.id, { ...STUDENT, matchScore: selectedJob.match })}
                            className="flex-1 py-3 rounded-xl text-sm font-semibold text-white transition-all hover:scale-[1.02]"
                            style={{ background: `linear-gradient(135deg, ${selectedJob.color}, #8B5CF6)`, fontFamily: "'Inter', sans-serif" }}>
                            Apply Now →
                          </button>
                        )}
                        <button
                          onClick={() => setSaved((s) => { const n = new Set(s); n.has(selectedJob.id) ? n.delete(selectedJob.id) : n.add(selectedJob.id); return n })}
                          className="px-4 py-3 rounded-xl text-sm transition-all hover:bg-white/10"
                          style={{
                            background: 'var(--bg-surface)',
                            border: '1px solid var(--border)',
                            fontFamily: "'Inter', sans-serif",
                            color: saved.has(selectedJob.id) ? '#F59E0B' : 'var(--text-2)',
                          }}>
                          {saved.has(selectedJob.id) ? '★ Saved' : '☆ Save'}
                        </button>
                      </div>

                    </div>
                  </div>
                )}
              </div>
            </>
          )}

          {/* ── MY APPLICATIONS TAB ── */}
          {tab === 'my-applications' && (
            <>
              {myApps.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 gap-4">
                  <div className="w-20 h-20 rounded-full flex items-center justify-center text-3xl"
                    style={{ background: 'linear-gradient(135deg, rgba(59,130,246,0.2), rgba(139,92,246,0.2))', border: '1px solid rgba(139,92,246,0.2)' }}>
                    📋
                  </div>
                  <p className="text-lg font-semibold" style={{ fontFamily: "'Poppins', sans-serif", color: 'var(--text-1)' }}>No applications yet</p>
                  <p className="text-sm text-center max-w-xs" style={{ fontFamily: "'Inter', sans-serif", color: 'var(--text-2)' }}>
                    Browse open positions and apply with one click
                  </p>
                  <button onClick={() => setTab('browse')}
                    className="px-6 py-3 rounded-xl text-sm font-semibold text-white transition-all hover:scale-[1.02]"
                    style={{ background: 'linear-gradient(135deg, #3B82F6, #8B5CF6)', fontFamily: "'Inter', sans-serif" }}>
                    Browse Jobs
                  </button>
                </div>
              ) : (
                <>
                  {/* Summary cards */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                    {[
                      { label: 'Total Applied', val: myApps.length, color: '#3B82F6' },
                      { label: 'Shortlisted', val: shortlisted, color: '#F59E0B' },
                      { label: 'Interviews', val: interviews, color: '#8B5CF6' },
                      { label: 'Offers', val: offers, color: '#34D399' },
                    ].map((s) => (
                      <div key={s.label} className="glass rounded-2xl p-4" style={{ border: '1px solid var(--border)' }}>
                        <p className="text-2xl font-bold mb-1" style={{ color: s.color, fontFamily: "'Poppins', sans-serif" }}>{s.val}</p>
                        <p className="text-xs" style={{ fontFamily: "'Inter', sans-serif", color: 'var(--text-2)' }}>{s.label}</p>
                      </div>
                    ))}
                  </div>

                  {/* Application cards */}
                  <div className="flex flex-col gap-4">
                    {myApps.map((app) => {
                      const stageIdx = PIPELINE_STAGES.indexOf(app.status)
                      const isRejected = app.status === 'Rejected'
                      return (
                        <div key={app.id} className="glass rounded-2xl p-5" style={{ border: '1px solid var(--border)' }}>
                          <div className="flex items-start justify-between gap-4 mb-4">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold flex-shrink-0"
                                style={{ background: `${app.color}18`, color: app.color, border: `1px solid ${app.color}25`, fontFamily: "'Poppins', sans-serif" }}>
                                {app.company[0]}
                              </div>
                              <div>
                                <h3 className="text-base font-semibold" style={{ fontFamily: "'Poppins', sans-serif", color: 'var(--text-1)' }}>{app.jobTitle}</h3>
                                <p className="text-sm" style={{ fontFamily: "'Inter', sans-serif", color: 'var(--text-2)' }}>{app.company}</p>
                              </div>
                            </div>
                            <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                              <span className="text-xs px-2.5 py-1 rounded-full font-medium"
                                style={{
                                  background: `${STATUS_COLORS[app.status]}18`,
                                  color: STATUS_COLORS[app.status],
                                  border: `1px solid ${STATUS_COLORS[app.status]}30`,
                                  fontFamily: "'Inter', sans-serif",
                                }}>
                                {app.status}
                              </span>
                              <span className="text-xs" style={{ fontFamily: "'Inter', sans-serif", color: 'var(--text-3)' }}>
                                Applied {app.appliedAt}
                              </span>
                              <span className="text-xs font-semibold" style={{ color: app.color, fontFamily: "'Inter', sans-serif" }}>
                                {app.matchScore}% match
                              </span>
                            </div>
                          </div>

                          {/* Progress pipeline */}
                          {!isRejected && (
                            <div className="flex items-center gap-0 mb-4">
                              {PIPELINE_STAGES.map((stage, i) => {
                                const done = i < stageIdx
                                const active = i === stageIdx
                                const future = i > stageIdx
                                return (
                                  <div key={stage} className="flex items-center flex-1">
                                    <div className="flex flex-col items-center" style={{ minWidth: 0 }}>
                                      <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all"
                                        style={{
                                          background: done ? app.color : active ? `linear-gradient(135deg, ${app.color}, #8B5CF6)` : 'var(--bg-surface)',
                                          border: future ? '2px solid var(--border)' : `2px solid ${app.color}`,
                                          color: done || active ? '#fff' : 'var(--text-3)',
                                          fontFamily: "'Inter', sans-serif",
                                          boxShadow: active ? `0 0 12px ${app.color}40` : 'none',
                                        }}>
                                        {done ? '✓' : i + 1}
                                      </div>
                                      <span className="text-xs mt-1 whitespace-nowrap hidden sm:block"
                                        style={{
                                          fontFamily: "'Inter', sans-serif",
                                          color: active ? app.color : done ? 'var(--text-2)' : 'var(--text-3)',
                                          fontWeight: active ? 600 : 400,
                                        }}>
                                        {stage}
                                      </span>
                                    </div>
                                    {i < PIPELINE_STAGES.length - 1 && (
                                      <div className="flex-1 h-0.5 mx-1"
                                        style={{ background: done ? app.color : 'var(--border)' }} />
                                    )}
                                  </div>
                                )
                              })}
                            </div>
                          )}

                          {/* Next step */}
                          <div className="rounded-xl px-4 py-2.5"
                            style={{ background: isRejected ? 'rgba(239,68,68,0.06)' : `${app.color}08`, border: `1px solid ${isRejected ? 'rgba(239,68,68,0.15)' : `${app.color}15`}` }}>
                            <p className="text-xs" style={{ fontFamily: "'Inter', sans-serif", color: isRejected ? '#EF4444' : 'var(--text-2)' }}>
                              <span className="font-medium" style={{ color: isRejected ? '#EF4444' : app.color }}>Next: </span>
                              {NEXT_STEP[app.status]}
                            </p>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </>
              )}
            </>
          )}

        </div>
      </div>
    </AppShell>
  )
}
