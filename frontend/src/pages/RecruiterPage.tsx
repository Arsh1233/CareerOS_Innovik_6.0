import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { AppShell } from '../components/Layout'
import { useJobs, STATUS_COLORS } from '../context/JobsContext'
import type { JobType, AppStatus } from '../context/JobsContext'

const candidates = [
  { name: 'Rahul Sharma', college: 'IIT Delhi', role: 'AI Engineer', score: 94, skills: ['Python', 'ML', 'LLM'], status: 'Shortlisted', avatar: 'RS', color: '#3B82F6' },
  { name: 'Priya Mehta', college: 'IIT Bombay', role: 'ML Researcher', score: 91, skills: ['PyTorch', 'NLP', 'Research'], status: 'Interview', avatar: 'PM', color: '#8B5CF6' },
  { name: 'Arjun Kapoor', college: 'BITS Pilani', role: 'Data Scientist', score: 88, skills: ['Python', 'SQL', 'Stats'], status: 'Applied', avatar: 'AK', color: '#06B6D4' },
  { name: 'Sneha Reddy', college: 'NIT Warangal', role: 'AI Engineer', score: 85, skills: ['TF', 'MLOps', 'Cloud'], status: 'Shortlisted', avatar: 'SR', color: '#F59E0B' },
  { name: 'Vikram Singh', college: 'IIT Madras', role: 'LLM Engineer', score: 90, skills: ['LangChain', 'LLM', 'Python'], status: 'Offer', avatar: 'VS', color: '#34D399' },
  { name: 'Ananya Das', college: 'IIIT Hyderabad', role: 'Data Scientist', score: 82, skills: ['R', 'Python', 'SQL'], status: 'Applied', avatar: 'AD', color: '#EC4899' },
]

const localStatusColors: Record<string, string> = {
  Applied: '#3B82F6',
  Shortlisted: '#F59E0B',
  Interview: '#8B5CF6',
  Offer: '#34D399',
}

function matchScoreColor(score: number) {
  if (score >= 90) return '#34D399'
  if (score >= 80) return '#3B82F6'
  if (score >= 70) return '#F59E0B'
  return '#EF4444'
}

export default function RecruiterPage() {
  const [selected, setSelected] = useState<number | null>(0)
  const [searchParams, setSearchParams] = useSearchParams()
  const [postingOpen, setPostingOpen] = useState(false)
  const activeTab = (searchParams.get('tab') ?? 'candidates') as 'candidates' | 'analytics' | 'jobs' | 'pipeline'

  const { jobs, applications, getJobApplications, postJob, updateApplicationStatus } = useJobs()

  const [form, setForm] = useState({
    title: '', company: 'Anthropic India', type: 'Full-time' as JobType,
    location: '', remote: false, salary: '', description: '',
    requirements: '', skills: '', openings: 1, deadline: '',
  })

  const tabs: { key: 'candidates' | 'analytics' | 'jobs' | 'pipeline'; label: string }[] = [
    { key: 'candidates', label: 'Top Candidates' },
    { key: 'jobs', label: 'Job Postings' },
    { key: 'pipeline', label: 'Pipeline' },
    { key: 'analytics', label: 'Hiring Analytics' },
  ]

  function handleSubmitJob(e: React.FormEvent) {
    e.preventDefault()
    postJob({
      title: form.title, company: form.company, type: form.type,
      location: form.location || 'Remote', remote: form.remote,
      salary: form.salary, description: form.description,
      requirements: form.requirements.split('\n').filter(Boolean),
      skills: form.skills.split(',').map(s => s.trim()).filter(Boolean),
      openings: form.openings, deadline: form.deadline,
      color: '#10B981', recruiterCompany: form.company,
    })
    setPostingOpen(false)
    setForm({ title: '', company: 'Anthropic India', type: 'Full-time', location: '', remote: false, salary: '', description: '', requirements: '', skills: '', openings: 1, deadline: '' })
  }

  const kanbanStatuses: AppStatus[] = ['Applied', 'Shortlisted', 'Interview', 'Offer']
  const rejectedApps = applications.filter(a => a.status === 'Rejected')

  const inputStyle = {
    background: 'var(--input-bg)',
    border: '1px solid var(--input-border)',
    color: 'var(--text-1)',
    borderRadius: 10,
    padding: '8px 12px',
    fontFamily: "'Inter', sans-serif",
    fontSize: 14,
    width: '100%',
    outline: 'none',
  }

  const labelStyle = {
    fontFamily: "'Inter', sans-serif",
    fontSize: 12,
    color: 'var(--text-2)',
    marginBottom: 4,
    display: 'block' as const,
  }

  return (
    <AppShell>
      <div className="min-h-screen px-4 md:px-6 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div>
              <div className="inline-flex items-center gap-2 glass rounded-full px-3 py-1 mb-3 text-xs border"
                style={{ fontFamily: "'Inter', sans-serif", color: '#10B981', borderColor: '#10B98130' }}>
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: '#10B981' }} />
                Enterprise · Recruiter Portal
              </div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2" style={{ fontFamily: "'Poppins', sans-serif", color: 'var(--text-1)' }}>
                Recruiter <span className="gradient-text">Dashboard</span>
              </h1>
              <p className="text-sm" style={{ fontFamily: "'Inter', sans-serif", color: 'var(--text-2)' }}>
                AI-ranked candidate pool for Senior AI Engineer — Anthropic India
              </p>
            </div>
            <button
              onClick={() => setPostingOpen(true)}
              className="hidden md:flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all hover:scale-105"
              style={{ background: 'linear-gradient(135deg, #10B981, #06B6D4)', fontFamily: "'Inter', sans-serif", color: '#fff' }}>
              + Post New Role
            </button>
          </div>

          {/* KPIs */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {[
              { label: 'Total Applicants', val: '1,247', delta: '+12%', color: '#3B82F6' },
              { label: 'AI Shortlisted', val: '84', delta: '6.7% rate', color: '#8B5CF6' },
              { label: 'Interviews Scheduled', val: '23', delta: 'This week', color: '#06B6D4' },
              { label: 'Offers Extended', val: '5', delta: '21% conversion', color: '#34D399' },
            ].map((kpi) => (
              <div key={kpi.label} className="glass rounded-2xl p-4" style={{ border: '1px solid var(--border)' }}>
                <p className="text-xs mb-2" style={{ fontFamily: "'Inter', sans-serif", color: 'var(--text-2)' }}>{kpi.label}</p>
                <p className="text-2xl font-bold mb-0.5" style={{ color: kpi.color, fontFamily: "'Poppins', sans-serif" }}>{kpi.val}</p>
                <p className="text-xs" style={{ fontFamily: "'Inter', sans-serif", color: 'var(--text-3)' }}>{kpi.delta}</p>
              </div>
            ))}
          </div>

          {/* Tabs */}
          <div className="flex gap-1 glass rounded-xl p-1 mb-5 w-fit" style={{ border: '1px solid var(--border)' }}>
            {tabs.map(({ key, label }) => (
              <button key={key} onClick={() => setSearchParams(key === 'candidates' ? {} : { tab: key })}
                className="px-5 py-2 rounded-lg text-xs font-medium transition-all duration-200"
                style={{
                  background: activeTab === key ? 'linear-gradient(135deg, #10B981, #06B6D4)' : 'transparent',
                  color: activeTab === key ? '#fff' : 'var(--text-2)',
                  fontFamily: "'Inter', sans-serif",
                }}>
                {label}
              </button>
            ))}
          </div>

          {/* ── Candidates Tab ── */}
          {activeTab === 'candidates' && (
            <div>
              {/* Top bar */}
              <div className="flex items-center justify-between mb-4 glass rounded-xl px-4 py-3" style={{ border: '1px solid var(--border)' }}>
                <p className="text-xs" style={{ fontFamily: "'Inter', sans-serif", color: 'var(--text-2)' }}>
                  Showing AI-shortlisted candidates for: <span style={{ color: '#10B981', fontWeight: 600 }}>Senior AI Engineer</span>
                </p>
                <select
                  style={{ ...inputStyle, width: 'auto', padding: '4px 10px', fontSize: 12 }}>
                  <option style={{ background: '#0f172a', color: '#e2e8f0' }}>Filter by Job</option>
                  {jobs.map(j => (
                    <option key={j.id} style={{ background: '#0f172a', color: '#e2e8f0' }}>{j.title} — {j.company}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                {/* Candidate list */}
                <div className="lg:col-span-5 flex flex-col gap-3">
                  {candidates.map((c, i) => (
                    <div key={i} onClick={() => setSelected(i)}
                      className="glass rounded-2xl p-4 cursor-pointer transition-all duration-200 hover:scale-[1.01]"
                      style={{
                        border: selected === i ? `1px solid ${c.color}40` : '1px solid var(--border)',
                        boxShadow: selected === i ? `0 0 16px ${c.color}15` : 'none',
                      }}>
                      <div className="flex items-center justify-between mb-2.5">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold shrink-0"
                            style={{ background: `${c.color}20`, color: c.color, border: `1px solid ${c.color}30`, fontFamily: "'Poppins', sans-serif" }}>
                            {c.avatar}
                          </div>
                          <div>
                            <p className="text-sm font-semibold" style={{ fontFamily: "'Poppins', sans-serif", color: 'var(--text-1)' }}>{c.name}</p>
                            <p className="text-xs" style={{ fontFamily: "'Inter', sans-serif", color: 'var(--text-2)' }}>{c.college} · {c.role}</p>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          <span className="text-sm font-bold" style={{ color: c.color, fontFamily: "'Poppins', sans-serif" }}>{c.score}%</span>
                          <span className="text-xs px-2 py-0.5 rounded-full"
                            style={{ background: `${localStatusColors[c.status] ?? '#888'}15`, color: localStatusColors[c.status] ?? '#888', fontFamily: "'Inter', sans-serif" }}>
                            {c.status}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-1.5">
                        {c.skills.map((s) => (
                          <span key={s} className="text-xs px-2 py-0.5 rounded-full"
                            style={{ background: 'var(--bg-surface)', color: 'var(--text-2)', fontFamily: "'Inter', sans-serif" }}>
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Candidate detail */}
                {selected !== null && (
                  <div className="lg:col-span-7">
                    <div className="glass rounded-2xl p-6 sticky top-20"
                      style={{ border: `1px solid ${candidates[selected].color}30` }}>
                      <div className="flex items-start gap-4 mb-6">
                        <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-xl font-bold shrink-0"
                          style={{ background: `${candidates[selected].color}20`, color: candidates[selected].color, border: `1px solid ${candidates[selected].color}30`, fontFamily: "'Poppins', sans-serif" }}>
                          {candidates[selected].avatar}
                        </div>
                        <div className="flex-1">
                          <h2 className="text-lg font-bold" style={{ fontFamily: "'Poppins', sans-serif", color: 'var(--text-1)' }}>
                            {candidates[selected].name}
                          </h2>
                          <p className="text-sm" style={{ fontFamily: "'Inter', sans-serif", color: 'var(--text-2)' }}>
                            {candidates[selected].college} · {candidates[selected].role}
                          </p>
                          <span className="inline-flex mt-1.5 text-xs px-3 py-0.5 rounded-full"
                            style={{ background: `${localStatusColors[candidates[selected].status] ?? '#888'}15`, color: localStatusColors[candidates[selected].status] ?? '#888', fontFamily: "'Inter', sans-serif" }}>
                            {candidates[selected].status}
                          </span>
                        </div>
                        <div className="text-right">
                          <p className="text-3xl font-bold" style={{ color: candidates[selected].color, fontFamily: "'Poppins', sans-serif" }}>
                            {candidates[selected].score}%
                          </p>
                          <p className="text-xs" style={{ fontFamily: "'Inter', sans-serif", color: 'var(--text-2)' }}>AI Match</p>
                        </div>
                      </div>

                      {/* Score breakdown */}
                      <div className="mb-5">
                        <p className="text-xs uppercase tracking-wider mb-3" style={{ fontFamily: "'Inter', sans-serif", color: 'var(--text-2)' }}>
                          Performance Breakdown
                        </p>
                        {[
                          { label: 'Technical Skills', val: 92 },
                          { label: 'Problem Solving', val: 88 },
                          { label: 'Communication', val: 79 },
                          { label: 'Interview Score', val: 91 },
                          { label: 'Cultural Fit', val: 85 },
                        ].map((s) => (
                          <div key={s.label} className="mb-2">
                            <div className="flex justify-between mb-0.5">
                              <span className="text-xs" style={{ fontFamily: "'Inter', sans-serif", color: 'var(--text-2)' }}>{s.label}</span>
                              <span className="text-xs font-medium" style={{ color: candidates[selected].color, fontFamily: "'Inter', sans-serif" }}>{s.val}%</span>
                            </div>
                            <div className="w-full h-1 rounded-full" style={{ background: 'var(--bg-surface-strong)' }}>
                              <div className="h-full rounded-full transition-all duration-700"
                                style={{ width: `${s.val}%`, background: candidates[selected].color }} />
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* AI insight */}
                      <div className="rounded-xl p-3 mb-4"
                        style={{ background: `${candidates[selected].color}08`, border: `1px solid ${candidates[selected].color}20` }}>
                        <p className="text-xs font-medium mb-1" style={{ color: candidates[selected].color, fontFamily: "'Poppins', sans-serif" }}>
                          NEXUS AI Insight
                        </p>
                        <p className="text-xs leading-relaxed" style={{ fontFamily: "'Inter', sans-serif", color: 'var(--text-2)' }}>
                          Strong candidate with deep Python and ML expertise. Slightly below bar on system design — recommend one technical screening round to verify.
                        </p>
                      </div>

                      <div className="flex gap-3">
                        <button className="flex-1 py-2.5 rounded-xl text-sm font-medium transition-all hover:scale-[1.02]"
                          style={{ background: 'linear-gradient(135deg, #10B981, #06B6D4)', fontFamily: "'Inter', sans-serif", color: '#fff' }}>
                          Schedule Interview
                        </button>
                        <button className="px-4 py-2.5 rounded-xl text-sm transition-all hover:bg-white/10"
                          style={{ background: 'var(--input-bg)', border: '1px solid var(--input-border)', fontFamily: "'Inter', sans-serif", color: 'var(--text-2)' }}>
                          Message
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── Jobs Tab ── */}
          {activeTab === 'jobs' && (
            <div>
              {/* Summary row */}
              <div className="flex items-center gap-3 mb-4">
                <p className="text-xs" style={{ fontFamily: "'Inter', sans-serif", color: 'var(--text-2)' }}>
                  <span style={{ color: '#10B981', fontWeight: 700 }}>{jobs.length}</span> active postings ·{' '}
                  <span style={{ color: '#10B981', fontWeight: 700 }}>{applications.length}</span> total applications
                </p>
                <button
                  onClick={() => setPostingOpen(true)}
                  className="ml-auto flex md:hidden items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium"
                  style={{ background: 'linear-gradient(135deg, #10B981, #06B6D4)', color: '#fff', fontFamily: "'Inter', sans-serif" }}>
                  + Post New Role
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {jobs.map((job) => {
                  const jobApps = getJobApplications(job.id)
                  const shortlisted = jobApps.filter(a => a.status === 'Shortlisted' || a.status === 'Interview' || a.status === 'Offer').length
                  return (
                    <div key={job.id} className="glass rounded-2xl p-5 hover:scale-[1.01] transition-all"
                      style={{ border: '1px solid var(--border)' }}>
                      {/* Avatar + title */}
                      <div className="flex items-start gap-3 mb-3">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold shrink-0"
                          style={{ background: `${job.color}20`, color: job.color, border: `1px solid ${job.color}30`, fontFamily: "'Poppins', sans-serif" }}>
                          {job.company[0]}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-base font-semibold" style={{ fontFamily: "'Poppins', sans-serif", color: 'var(--text-1)' }}>{job.title}</h3>
                          <p className="text-xs mt-0.5" style={{ fontFamily: "'Inter', sans-serif", color: 'var(--text-2)' }}>
                            {job.company} · {job.type} · {job.location}
                          </p>
                        </div>
                        <span className="text-xs px-2.5 py-1 rounded-full font-medium shrink-0"
                          style={{ background: '#10B98115', color: '#10B981', border: '1px solid #10B98130', fontFamily: "'Inter', sans-serif" }}>
                          Active
                        </span>
                      </div>

                      {/* Salary + Remote badges */}
                      <div className="flex flex-wrap gap-2 mb-3">
                        {job.salary && (
                          <span className="text-xs px-2 py-0.5 rounded-full"
                            style={{ background: '#10B98110', color: '#10B981', fontFamily: "'Inter', sans-serif" }}>
                            {job.salary}
                          </span>
                        )}
                        {job.remote && (
                          <span className="text-xs px-2 py-0.5 rounded-full"
                            style={{ background: 'var(--bg-surface)', color: 'var(--text-2)', fontFamily: "'Inter', sans-serif" }}>
                            Remote
                          </span>
                        )}
                      </div>

                      {/* Skills chips */}
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {job.skills.slice(0, 3).map(s => (
                          <span key={s} className="text-xs px-2 py-0.5 rounded-full"
                            style={{ background: 'var(--bg-surface)', color: 'var(--text-2)', fontFamily: "'Inter', sans-serif" }}>
                            {s}
                          </span>
                        ))}
                      </div>

                      {/* Stats row */}
                      <div className="flex items-center gap-3 mb-4 text-xs" style={{ fontFamily: "'Inter', sans-serif", color: 'var(--text-3)' }}>
                        <span><span style={{ color: 'var(--text-1)', fontWeight: 600 }}>{jobApps.length}</span> applicants</span>
                        <span>·</span>
                        <span><span style={{ color: 'var(--text-1)', fontWeight: 600 }}>{job.openings}</span> openings</span>
                        {job.deadline && (
                          <>
                            <span>·</span>
                            <span>Deadline: {job.deadline}</span>
                          </>
                        )}
                      </div>

                      {/* Shortlisted badge */}
                      {shortlisted > 0 && (
                        <div className="mb-3">
                          <span className="text-xs px-2.5 py-1 rounded-full"
                            style={{ background: '#F59E0B15', color: '#F59E0B', border: '1px solid #F59E0B30', fontFamily: "'Inter', sans-serif" }}>
                            {shortlisted} shortlisted
                          </span>
                        </div>
                      )}

                      {/* Action buttons */}
                      <div className="flex gap-2">
                        <button
                          onClick={() => setSearchParams({ tab: 'pipeline' })}
                          className="flex-1 py-2 rounded-xl text-xs font-medium transition-all hover:scale-[1.02]"
                          style={{ background: 'linear-gradient(135deg, #10B981, #06B6D4)', fontFamily: "'Inter', sans-serif", color: '#fff' }}>
                          View Applicants
                        </button>
                        <button className="px-4 py-2 rounded-xl text-xs transition-all hover:bg-white/10"
                          style={{ background: 'var(--input-bg)', border: '1px solid var(--input-border)', fontFamily: "'Inter', sans-serif", color: 'var(--text-2)' }}>
                          Edit
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* ── Pipeline Tab ── */}
          {activeTab === 'pipeline' && (
            <div>
              {/* AI insight banner */}
              <div className="rounded-xl px-4 py-3 mb-5 flex items-start gap-3"
                style={{ background: '#10B98110', border: '1px solid #10B98130' }}>
                <span style={{ fontSize: 16 }}>✦</span>
                <p className="text-xs leading-relaxed" style={{ fontFamily: "'Inter', sans-serif", color: 'var(--text-2)' }}>
                  <span style={{ color: '#10B981', fontWeight: 600 }}>NEXUS</span> has automatically scored and ranked{' '}
                  <span style={{ color: 'var(--text-1)', fontWeight: 600 }}>{applications.length} candidates</span> based on skill match, interview history, and career trajectory.
                </p>
              </div>

              {/* Kanban columns */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {kanbanStatuses.map((status) => {
                  const colApps = applications.filter(a => a.status === status)
                  const colColor = STATUS_COLORS[status]
                  return (
                    <div key={status} className="glass rounded-2xl overflow-hidden"
                      style={{ border: '1px solid var(--border)', borderLeft: `3px solid ${colColor}` }}>
                      {/* Column header */}
                      <div className="flex items-center justify-between px-4 py-3"
                        style={{ borderBottom: '1px solid var(--border)' }}>
                        <p className="text-sm font-semibold" style={{ fontFamily: "'Poppins', sans-serif", color: 'var(--text-1)' }}>{status}</p>
                        <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                          style={{ background: `${colColor}15`, color: colColor, fontFamily: "'Inter', sans-serif" }}>
                          {colApps.length}
                        </span>
                      </div>

                      {/* Cards */}
                      <div className="flex flex-col gap-2 p-3">
                        {colApps.map((app) => {
                          const scoreColor = matchScoreColor(app.matchScore)
                          return (
                            <div key={app.id} className="rounded-xl p-3"
                              style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
                              <div className="flex items-center gap-2.5 mb-2">
                                <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold shrink-0"
                                  style={{ background: `linear-gradient(135deg, ${scoreColor}30, ${scoreColor}15)`, color: scoreColor, fontFamily: "'Poppins', sans-serif" }}>
                                  {app.studentAvatar}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-xs font-semibold truncate" style={{ fontFamily: "'Poppins', sans-serif", color: 'var(--text-1)' }}>{app.studentName}</p>
                                  <p className="text-xs truncate" style={{ fontFamily: "'Inter', sans-serif", color: 'var(--text-2)' }}>{app.college} · {app.branch}</p>
                                </div>
                                <span className="text-xs font-bold shrink-0"
                                  style={{ color: scoreColor, fontFamily: "'Poppins', sans-serif" }}>
                                  {app.matchScore}%
                                </span>
                              </div>
                              <p className="text-xs mb-2" style={{ fontFamily: "'Inter', sans-serif", color: 'var(--text-3)' }}>{app.jobTitle}</p>
                              <div className="flex gap-1.5 flex-wrap">
                                {status === 'Applied' && (
                                  <>
                                    <button
                                      onClick={() => updateApplicationStatus(app.id, 'Shortlisted')}
                                      className="text-xs px-2 py-1 rounded-lg transition-all hover:scale-[1.03]"
                                      style={{ background: '#F59E0B15', color: '#F59E0B', border: '1px solid #F59E0B30', fontFamily: "'Inter', sans-serif" }}>
                                      Shortlist
                                    </button>
                                    <button
                                      onClick={() => updateApplicationStatus(app.id, 'Rejected')}
                                      className="text-xs px-2 py-1 rounded-lg transition-all hover:scale-[1.03]"
                                      style={{ background: '#EF444410', color: '#EF4444', border: '1px solid #EF444430', fontFamily: "'Inter', sans-serif" }}>
                                      Reject
                                    </button>
                                  </>
                                )}
                                {status === 'Shortlisted' && (
                                  <>
                                    <button
                                      onClick={() => updateApplicationStatus(app.id, 'Interview')}
                                      className="text-xs px-2 py-1 rounded-lg transition-all hover:scale-[1.03]"
                                      style={{ background: '#8B5CF615', color: '#8B5CF6', border: '1px solid #8B5CF630', fontFamily: "'Inter', sans-serif" }}>
                                      Schedule Interview
                                    </button>
                                    <button
                                      onClick={() => updateApplicationStatus(app.id, 'Rejected')}
                                      className="text-xs px-2 py-1 rounded-lg transition-all hover:scale-[1.03]"
                                      style={{ background: '#EF444410', color: '#EF4444', border: '1px solid #EF444430', fontFamily: "'Inter', sans-serif" }}>
                                      Reject
                                    </button>
                                  </>
                                )}
                                {status === 'Interview' && (
                                  <button
                                    onClick={() => updateApplicationStatus(app.id, 'Offer')}
                                    className="text-xs px-2 py-1 rounded-lg transition-all hover:scale-[1.03]"
                                    style={{ background: '#34D39915', color: '#34D399', border: '1px solid #34D39930', fontFamily: "'Inter', sans-serif" }}>
                                    Extend Offer
                                  </button>
                                )}
                              </div>
                            </div>
                          )
                        })}
                        {colApps.length === 0 && (
                          <p className="text-xs text-center py-4" style={{ fontFamily: "'Inter', sans-serif", color: 'var(--text-3)' }}>No candidates</p>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Rejected section */}
              {rejectedApps.length > 0 && (
                <details className="glass rounded-2xl overflow-hidden" style={{ border: '1px solid var(--border)', borderLeft: '3px solid #EF4444' }}>
                  <summary className="flex items-center justify-between px-4 py-3 cursor-pointer"
                    style={{ borderBottom: rejectedApps.length > 0 ? '1px solid var(--border)' : 'none' }}>
                    <p className="text-sm font-semibold" style={{ fontFamily: "'Poppins', sans-serif", color: 'var(--text-1)' }}>Rejected</p>
                    <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                      style={{ background: '#EF444415', color: '#EF4444', fontFamily: "'Inter', sans-serif" }}>
                      {rejectedApps.length}
                    </span>
                  </summary>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 p-3">
                    {rejectedApps.map((app) => (
                      <div key={app.id} className="rounded-xl p-3"
                        style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', opacity: 0.7 }}>
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0"
                            style={{ background: '#EF444415', color: '#EF4444', fontFamily: "'Poppins', sans-serif" }}>
                            {app.studentAvatar}
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-semibold truncate" style={{ fontFamily: "'Poppins', sans-serif", color: 'var(--text-2)' }}>{app.studentName}</p>
                            <p className="text-xs truncate" style={{ fontFamily: "'Inter', sans-serif", color: 'var(--text-3)' }}>{app.jobTitle}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </details>
              )}
            </div>
          )}

          {/* ── Analytics Tab ── */}
          {activeTab === 'analytics' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {/* Funnel */}
              <div className="glass rounded-2xl p-5 md:col-span-2 lg:col-span-1" style={{ border: '1px solid var(--border)' }}>
                <p className="text-sm font-semibold mb-4" style={{ fontFamily: "'Poppins', sans-serif", color: 'var(--text-1)' }}>Hiring Funnel</p>
                {[
                  { stage: 'Total Applied', count: 1247, pct: 100, color: '#3B82F6' },
                  { stage: 'AI Screened', count: 842, pct: 67, color: '#8B5CF6' },
                  { stage: 'Shortlisted', count: 84, pct: 10, color: '#06B6D4' },
                  { stage: 'Interviewed', count: 23, pct: 3, color: '#F59E0B' },
                  { stage: 'Offered', count: 5, pct: 0.4, color: '#34D399' },
                ].map((s) => (
                  <div key={s.stage} className="mb-3">
                    <div className="flex justify-between mb-1">
                      <span className="text-xs" style={{ fontFamily: "'Inter', sans-serif", color: 'var(--text-2)' }}>{s.stage}</span>
                      <span className="text-xs font-medium" style={{ fontFamily: "'Inter', sans-serif", color: 'var(--text-1)' }}>{s.count.toLocaleString()}</span>
                    </div>
                    <div className="w-full h-2 rounded-full" style={{ background: 'var(--bg-surface-strong)' }}>
                      <div className="h-full rounded-full" style={{ width: `${s.pct}%`, background: s.color, boxShadow: `0 0 6px ${s.color}50` }} />
                    </div>
                  </div>
                ))}
              </div>

              {/* College distribution */}
              <div className="glass rounded-2xl p-5" style={{ border: '1px solid var(--border)' }}>
                <p className="text-sm font-semibold mb-4" style={{ fontFamily: "'Poppins', sans-serif", color: 'var(--text-1)' }}>Top Colleges</p>
                {[
                  { college: 'IIT Delhi', count: 32, color: '#3B82F6' },
                  { college: 'IIT Bombay', count: 28, color: '#8B5CF6' },
                  { college: 'BITS Pilani', count: 19, color: '#06B6D4' },
                  { college: 'IIT Madras', count: 15, color: '#F59E0B' },
                  { college: 'IIIT Hyderabad', count: 12, color: '#34D399' },
                ].map((c, i) => (
                  <div key={i} className="flex items-center justify-between mb-2.5">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full shrink-0" style={{ background: c.color }} />
                      <span className="text-xs" style={{ fontFamily: "'Inter', sans-serif", color: 'var(--text-2)' }}>{c.college}</span>
                    </div>
                    <span className="text-xs font-medium" style={{ fontFamily: "'Inter', sans-serif", color: 'var(--text-1)' }}>{c.count}</span>
                  </div>
                ))}
              </div>

              {/* Placement stats */}
              <div className="glass rounded-2xl p-5" style={{ border: '1px solid var(--border)' }}>
                <p className="text-sm font-semibold mb-4" style={{ fontFamily: "'Poppins', sans-serif", color: 'var(--text-1)' }}>Placement Stats</p>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: 'Avg. Time-to-Hire', val: '18 days', color: '#3B82F6' },
                    { label: 'Offer Acceptance', val: '80%', color: '#34D399' },
                    { label: 'Retention (1yr)', val: '92%', color: '#8B5CF6' },
                    { label: 'Avg. AI Score', val: '87%', color: '#F59E0B' },
                  ].map((s) => (
                    <div key={s.label} className="rounded-xl p-3 text-center"
                      style={{ background: `${s.color}08`, border: `1px solid ${s.color}20` }}>
                      <p className="text-lg font-bold mb-0.5" style={{ color: s.color, fontFamily: "'Poppins', sans-serif" }}>{s.val}</p>
                      <p className="text-xs leading-tight" style={{ fontFamily: "'Inter', sans-serif", color: 'var(--text-3)' }}>{s.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Post JD Modal ── */}
      {postingOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(6px)' }}
          onClick={(e) => { if (e.target === e.currentTarget) setPostingOpen(false) }}>
          <div className="glass-strong rounded-2xl w-full max-w-2xl mx-4 overflow-hidden"
            style={{ border: '1px solid var(--border-accent)', maxHeight: '90vh', overflowY: 'auto' }}>
            {/* Modal header */}
            <div className="flex items-center justify-between px-6 py-4"
              style={{ borderBottom: '1px solid var(--border)' }}>
              <div>
                <h2 className="text-base font-bold" style={{ fontFamily: "'Poppins', sans-serif", color: 'var(--text-1)' }}>
                  Post Job Description
                </h2>
                <p className="text-xs mt-0.5" style={{ fontFamily: "'Inter', sans-serif", color: 'var(--text-2)' }}>
                  Fill in the details to publish a new role
                </p>
              </div>
              <button onClick={() => setPostingOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-lg transition-all hover:bg-white/10"
                style={{ color: 'var(--text-2)', fontSize: 18, fontFamily: "'Inter', sans-serif" }}>
                ×
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmitJob} className="px-6 py-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Job Title — full width */}
                <div className="md:col-span-2">
                  <label style={labelStyle}>Job Title *</label>
                  <input
                    required
                    value={form.title}
                    onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                    placeholder="e.g. Senior AI Engineer"
                    style={inputStyle}
                  />
                </div>

                {/* Company */}
                <div>
                  <label style={labelStyle}>Company Name</label>
                  <input
                    value={form.company}
                    onChange={e => setForm(f => ({ ...f, company: e.target.value }))}
                    style={inputStyle}
                  />
                </div>

                {/* Job Type */}
                <div>
                  <label style={labelStyle}>Job Type</label>
                  <select
                    value={form.type}
                    onChange={e => setForm(f => ({ ...f, type: e.target.value as JobType }))}
                    style={inputStyle}>
                    <option>Full-time</option>
                    <option>Internship</option>
                    <option>Contract</option>
                    <option>Part-time</option>
                  </select>
                </div>

                {/* Location */}
                <div>
                  <label style={labelStyle}>Location</label>
                  <input
                    value={form.location}
                    onChange={e => setForm(f => ({ ...f, location: e.target.value }))}
                    placeholder="e.g. Bengaluru / Remote"
                    style={inputStyle}
                  />
                </div>

                {/* Remote toggle */}
                <div className="flex items-center gap-3 pt-5">
                  <input
                    type="checkbox"
                    id="remote-toggle"
                    checked={form.remote}
                    onChange={e => setForm(f => ({ ...f, remote: e.target.checked }))}
                    style={{ accentColor: '#10B981', width: 16, height: 16 }}
                  />
                  <label htmlFor="remote-toggle" style={{ ...labelStyle, marginBottom: 0, cursor: 'pointer' }}>
                    Remote / Hybrid
                  </label>
                </div>

                {/* Salary */}
                <div>
                  <label style={labelStyle}>Salary Range</label>
                  <input
                    value={form.salary}
                    onChange={e => setForm(f => ({ ...f, salary: e.target.value }))}
                    placeholder="₹28–42 LPA"
                    style={inputStyle}
                  />
                </div>

                {/* Openings */}
                <div>
                  <label style={labelStyle}>Openings</label>
                  <input
                    type="number"
                    min={1}
                    value={form.openings}
                    onChange={e => setForm(f => ({ ...f, openings: parseInt(e.target.value) || 1 }))}
                    style={inputStyle}
                  />
                </div>

                {/* Deadline */}
                <div>
                  <label style={labelStyle}>Application Deadline</label>
                  <input
                    type="date"
                    value={form.deadline}
                    onChange={e => setForm(f => ({ ...f, deadline: e.target.value }))}
                    style={inputStyle}
                  />
                </div>

                {/* Empty spacer */}
                <div />

                {/* Skills — full width */}
                <div className="md:col-span-2">
                  <label style={labelStyle}>Required Skills</label>
                  <input
                    value={form.skills}
                    onChange={e => setForm(f => ({ ...f, skills: e.target.value }))}
                    placeholder="Python, PyTorch, LLM — comma separated"
                    style={inputStyle}
                  />
                </div>

                {/* Description — full width */}
                <div className="md:col-span-2">
                  <label style={labelStyle}>Job Description</label>
                  <textarea
                    rows={4}
                    value={form.description}
                    onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                    placeholder="Describe the role, team, and impact..."
                    style={{ ...inputStyle, resize: 'vertical' }}
                  />
                </div>

                {/* Requirements — full width */}
                <div className="md:col-span-2">
                  <label style={labelStyle}>Requirements (one per line)</label>
                  <textarea
                    rows={3}
                    value={form.requirements}
                    onChange={e => setForm(f => ({ ...f, requirements: e.target.value }))}
                    placeholder={'• BTech CS\n• 2+ years ML...'}
                    style={{ ...inputStyle, resize: 'vertical' }}
                  />
                </div>
              </div>

              {/* Submit */}
              <div className="mt-5 flex gap-3">
                <button type="submit"
                  className="flex-1 py-3 rounded-xl text-sm font-semibold transition-all hover:scale-[1.02]"
                  style={{ background: 'linear-gradient(135deg, #10B981, #06B6D4)', fontFamily: "'Inter', sans-serif", color: '#fff' }}>
                  Post Job Description
                </button>
                <button type="button" onClick={() => setPostingOpen(false)}
                  className="px-5 py-3 rounded-xl text-sm transition-all hover:bg-white/10"
                  style={{ background: 'var(--input-bg)', border: '1px solid var(--input-border)', fontFamily: "'Inter', sans-serif", color: 'var(--text-2)' }}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AppShell>
  )
}
