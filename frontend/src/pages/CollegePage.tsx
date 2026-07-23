import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { AppShell } from '../components/Layout'
import { useJobs, STATUS_COLORS } from '../context/JobsContext'

const departments = [
  { name: 'Computer Science', placed: 94, students: 120, color: '#3B82F6' },
  { name: 'AI & Data Science', placed: 97, students: 80, color: '#8B5CF6' },
  { name: 'Electronics', placed: 78, students: 100, color: '#06B6D4' },
  { name: 'Mechanical', placed: 62, students: 90, color: '#F59E0B' },
  { name: 'Civil', placed: 55, students: 70, color: '#EF4444' },
]

const yoy = [
  { year: '2021', pct: 68 },
  { year: '2022', pct: 74 },
  { year: '2023', pct: 81 },
  { year: '2024', pct: 87 },
  { year: '2025', pct: 94 },
]

const topCompanies = [
  { name: 'Google', hires: 18, color: '#3B82F6' },
  { name: 'Microsoft', hires: 24, color: '#8B5CF6' },
  { name: 'Amazon', hires: 31, color: '#06B6D4' },
  { name: 'Meta', hires: 12, color: '#F59E0B' },
  { name: 'Anthropic', hires: 7, color: '#34D399' },
]

const studentData = [
  { name: 'Rahul Sharma', branch: 'CSE AI', year: '3rd Year', cgpa: '9.2', score: 87, avatar: 'RS', color: '#3B82F6', skills: ['Python', 'ML', 'LLM'], studentId: 'rahul' },
  { name: 'Priya Mehta', branch: 'ECE', year: 'Final Year', cgpa: '9.5', score: 91, avatar: 'PM', color: '#8B5CF6', skills: ['VLSI', 'Embedded', 'C++'], studentId: 'priya' },
  { name: 'Arjun Kapoor', branch: 'CSE', year: '3rd Year', cgpa: '8.8', score: 72, avatar: 'AK', color: '#06B6D4', skills: ['Java', 'SQL', 'DSA'], studentId: 'arjun' },
  { name: 'Sneha Reddy', branch: 'CSAI', year: 'Final Year', cgpa: '9.1', score: 85, avatar: 'SR', color: '#F59E0B', skills: ['PyTorch', 'NLP', 'Python'], studentId: 'sneha' },
  { name: 'Vikram Singh', branch: 'CSE', year: 'Alumni', cgpa: '9.0', score: 90, avatar: 'VS', color: '#34D399', skills: ['React', 'Node', 'AWS'], studentId: 'vikram' },
  { name: 'Ananya Das', branch: 'Data Science', year: 'Final Year', cgpa: '8.6', score: 78, avatar: 'AD', color: '#EC4899', skills: ['R', 'Python', 'Tableau'], studentId: 'ananya' },
]

const placementCompanies = [
  { name: 'Anthropic', applied: 3, shortlisted: 2, offered: 2, accepted: 2 },
  { name: 'Google DeepMind', applied: 8, shortlisted: 4, offered: 3, accepted: 3 },
  { name: 'Microsoft', applied: 12, shortlisted: 6, offered: 4, accepted: 4 },
  { name: 'OpenAI', applied: 5, shortlisted: 2, offered: 1, accepted: 1 },
  { name: 'Sarvam AI', applied: 7, shortlisted: 4, offered: 3, accepted: 2 },
  { name: 'Zepto', applied: 13, shortlisted: 6, offered: 3, accepted: 2 },
]

const offerLetters = [
  { name: 'Rahul Sharma', avatar: 'RS', color: '#3B82F6', company: 'Anthropic', ctc: '₹95 LPA', status: 'Accepted' },
  { name: 'Priya Mehta', avatar: 'PM', color: '#8B5CF6', company: 'Google DeepMind', ctc: '₹80 LPA', status: 'Pending' },
  { name: 'Vikram Singh', avatar: 'VS', color: '#34D399', company: 'Sarvam AI', ctc: '₹40 LPA', status: 'Accepted' },
]

const driveRequests = [
  { company: 'Anthropic India', role: 'AI Safety Intern', date: 'Sep 15', color: '#3B82F6' },
  { company: 'Google', role: 'ML Engineer FTE', date: 'Oct 2', color: '#8B5CF6' },
  { company: 'Microsoft', role: 'AI Platform', date: 'Oct 10', color: '#06B6D4' },
]

const recruiterPartners = [
  { name: 'Anthropic', badge: 'Premium Partner', badgeColor: '#F59E0B', jds: 4, hires: 7, color: '#3B82F6' },
  { name: 'Google', badge: 'Premium Partner', badgeColor: '#F59E0B', jds: 8, hires: 18, color: '#8B5CF6' },
  { name: 'Microsoft', badge: 'Active', badgeColor: '#34D399', jds: 6, hires: 24, color: '#06B6D4' },
  { name: 'Sarvam AI', badge: 'Active', badgeColor: '#34D399', jds: 3, hires: 5, color: '#EC4899' },
]

const pipelineStages = [
  { label: 'Applied', count: 48, color: '#3B82F6' },
  { label: 'Shortlisted', count: 24, color: '#F59E0B' },
  { label: 'Interview', count: 18, color: '#8B5CF6' },
  { label: 'Offer', count: 11, color: '#34D399' },
  { label: 'Joined', count: 9, color: '#10B981' },
]

export default function CollegePage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [showDriveForm, setShowDriveForm] = useState(false)
  const [driveForm, setDriveForm] = useState({ company: '', date: '', roles: '', maxStudents: '' })
  const [searchParams, setSearchParams] = useSearchParams()
  const { jobs, applications } = useJobs()

  const activeTab = (searchParams.get('tab') ?? 'overview') as 'overview' | 'students' | 'placements' | 'departments' | 'recruiters'

  const tabs: { key: typeof activeTab; label: string }[] = [
    { key: 'overview', label: 'Overview' },
    { key: 'students', label: 'Students' },
    { key: 'placements', label: 'Placements' },
    { key: 'departments', label: 'Departments' },
    { key: 'recruiters', label: 'Recruiters' },
  ]

  const filteredStudents = studentData.filter((s) =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.branch.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const getStudentDerivedStatus = (studentName: string) => {
    const apps = applications.filter(a => a.studentName === studentName)
    if (apps.some(a => a.status === 'Offer')) return 'Placed'
    if (apps.some(a => a.status === 'Interview' || a.status === 'Shortlisted')) return 'Interviewing'
    return 'Searching'
  }

  const statusConfig: Record<string, { bg: string; text: string }> = {
    Placed: { bg: '#34D39915', text: '#34D399' },
    Interviewing: { bg: '#3B82F615', text: '#3B82F6' },
    Searching: { bg: '#F59E0B15', text: '#F59E0B' },
  }

  const poolJobs = jobs.slice(0, 4)

  return (
    <AppShell>
      <div className="min-h-screen px-4 md:px-6 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div>
              <div
                className="inline-flex items-center gap-2 glass rounded-full px-3 py-1 mb-3 text-xs border"
                style={{ fontFamily: "'Inter', sans-serif", color: '#34D399', borderColor: 'rgba(52,211,153,0.2)' }}
              >
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: '#34D399' }} />
                Institute Portal · IIT Delhi
              </div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2" style={{ fontFamily: "'Poppins', sans-serif", color: 'var(--text-1)' }}>
                College <span className="gradient-text">Analytics</span>
              </h1>
              <p className="text-sm" style={{ fontFamily: "'Inter', sans-serif", color: 'var(--text-2)' }}>
                Placement intelligence for Placement Cell — Batch 2025
              </p>
            </div>
            <button
              className="hidden md:flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all hover:scale-105"
              style={{ background: 'var(--bg-surface-strong)', border: '1px solid var(--border-accent)', fontFamily: "'Inter', sans-serif", color: 'var(--text-1)' }}
            >
              ↓ Export Report
            </button>
          </div>

          {/* KPIs */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {[
              { label: 'Overall Placement', val: '94%', delta: '+7% YoY', color: '#34D399' },
              { label: 'Avg Package', val: '₹24.5L', delta: '+₹3.2L vs 2024', color: '#3B82F6' },
              { label: 'Highest Offer', val: '₹1.2Cr', delta: 'Anthropic', color: '#8B5CF6' },
              { label: 'Recruiters Active', val: '312', delta: '18 new this season', color: '#F59E0B' },
            ].map((kpi) => (
              <div key={kpi.label} className="glass rounded-2xl p-4" style={{ border: '1px solid var(--border)' }}>
                <p className="text-xs mb-2" style={{ fontFamily: "'Inter', sans-serif", color: 'var(--text-2)' }}>{kpi.label}</p>
                <p className="text-2xl font-bold mb-0.5" style={{ color: kpi.color, fontFamily: "'Poppins', sans-serif" }}>{kpi.val}</p>
                <p className="text-xs" style={{ fontFamily: "'Inter', sans-serif", color: 'var(--text-3)' }}>{kpi.delta}</p>
              </div>
            ))}
          </div>

          {/* Tabs */}
          <div className="flex gap-1 glass rounded-xl p-1 mb-5 w-fit overflow-x-auto" style={{ border: '1px solid var(--border)' }}>
            {tabs.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setSearchParams(key === 'overview' ? {} : { tab: key })}
                className="px-4 py-2 rounded-lg text-xs font-medium transition-all duration-200 whitespace-nowrap"
                style={{
                  background: activeTab === key ? 'linear-gradient(135deg, #F59E0B, #EF4444)' : 'transparent',
                  color: activeTab === key ? '#fff' : 'var(--text-2)',
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                {label}
              </button>
            ))}
          </div>

          {/* ─── OVERVIEW TAB ─── */}
          {activeTab === 'overview' && (
            <div className="flex flex-col gap-5">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                {/* YoY growth */}
                <div className="lg:col-span-2 glass rounded-2xl p-5" style={{ border: '1px solid var(--border)' }}>
                  <p className="text-sm font-semibold mb-5" style={{ fontFamily: "'Poppins', sans-serif", color: 'var(--text-1)' }}>
                    Year-over-Year Placement Growth
                  </p>
                  <div className="flex items-end gap-4 h-40 relative">
                    {yoy.map((y, i) => (
                      <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
                        <p className="text-xs font-semibold" style={{ color: i === yoy.length - 1 ? '#34D399' : '#3B82F6', fontFamily: "'Poppins', sans-serif" }}>
                          {y.pct}%
                        </p>
                        <div
                          className="w-full rounded-t-lg transition-all duration-700 relative overflow-hidden"
                          style={{
                            height: `${(y.pct / 100) * 120}px`,
                            background: i === yoy.length - 1
                              ? 'linear-gradient(to top, #F59E0B, #34D399)'
                              : 'linear-gradient(to top, rgba(245,158,11,0.3), rgba(245,158,11,0.6))',
                            boxShadow: i === yoy.length - 1 ? '0 0 12px rgba(245,158,11,0.4)' : 'none',
                          }}
                        />
                        <p className="text-xs" style={{ fontFamily: "'Inter', sans-serif", color: 'var(--text-3)' }}>{y.year}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Skill distribution */}
                <div className="glass rounded-2xl p-5" style={{ border: '1px solid var(--border)' }}>
                  <p className="text-sm font-semibold mb-4" style={{ fontFamily: "'Poppins', sans-serif", color: 'var(--text-1)' }}>
                    Student Skill Distribution
                  </p>
                  {[
                    { skill: 'Python / ML', pct: 72, color: '#3B82F6' },
                    { skill: 'Web Dev', pct: 58, color: '#8B5CF6' },
                    { skill: 'Data Science', pct: 45, color: '#06B6D4' },
                    { skill: 'DevOps / Cloud', pct: 38, color: '#F59E0B' },
                    { skill: 'Mobile Dev', pct: 22, color: '#34D399' },
                  ].map((s) => (
                    <div key={s.skill} className="mb-3">
                      <div className="flex justify-between mb-0.5">
                        <span className="text-xs" style={{ fontFamily: "'Inter', sans-serif", color: 'var(--text-2)' }}>{s.skill}</span>
                        <span className="text-xs font-medium" style={{ color: s.color, fontFamily: "'Inter', sans-serif" }}>{s.pct}%</span>
                      </div>
                      <div className="w-full h-1.5 rounded-full" style={{ background: 'var(--bg-surface-strong)' }}>
                        <div className="h-full rounded-full" style={{ width: `${s.pct}%`, background: s.color }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Active JD Pool */}
              <div className="glass rounded-2xl p-5" style={{ border: '1px solid var(--border)' }}>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm font-semibold" style={{ fontFamily: "'Poppins', sans-serif", color: 'var(--text-1)' }}>
                      Active JD Pool
                    </p>
                    <p className="text-xs mt-0.5" style={{ fontFamily: "'Inter', sans-serif", color: 'var(--text-3)' }}>
                      8 opportunities from recruiting partners
                    </p>
                  </div>
                  <span
                    className="text-xs px-3 py-1 rounded-full font-medium"
                    style={{ background: '#F59E0B15', color: '#F59E0B', fontFamily: "'Inter', sans-serif" }}
                  >
                    8 open
                  </span>
                </div>
                <div className="flex flex-col gap-3">
                  {poolJobs.map((job) => (
                    <div
                      key={job.id}
                      className="flex items-center gap-3 rounded-xl px-4 py-3"
                      style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}
                    >
                      <div
                        className="w-9 h-9 rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0"
                        style={{ background: `${job.color}18`, color: job.color, border: `1px solid ${job.color}25`, fontFamily: "'Poppins', sans-serif" }}
                      >
                        {job.company[0]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate" style={{ fontFamily: "'Inter', sans-serif", color: 'var(--text-1)' }}>{job.title}</p>
                        <p className="text-xs truncate" style={{ fontFamily: "'Inter', sans-serif", color: 'var(--text-3)' }}>{job.company}</p>
                      </div>
                      <span
                        className="text-xs px-2 py-0.5 rounded-full hidden sm:inline"
                        style={{ background: `${job.color}15`, color: job.color, fontFamily: "'Inter', sans-serif" }}
                      >
                        {job.type}
                      </span>
                      <span
                        className="text-xs font-medium hidden md:inline"
                        style={{ fontFamily: "'Inter', sans-serif", color: 'var(--text-2)' }}
                      >
                        {job.salary}
                      </span>
                      <button
                        className="text-xs px-3 py-1.5 rounded-lg transition-all hover:scale-105 flex-shrink-0"
                        style={{ border: '1px solid var(--border)', color: 'var(--text-2)', fontFamily: "'Inter', sans-serif", background: 'transparent' }}
                      >
                        Forward to Students
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ─── STUDENTS TAB ─── */}
          {activeTab === 'students' && (
            <div>
              {/* Header row */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-5">
                <input
                  type="text"
                  placeholder="Search students..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 max-w-xs rounded-xl px-4 py-2.5 text-sm outline-none transition-all"
                  style={{
                    background: 'var(--input-bg)',
                    border: '1px solid var(--input-border)',
                    color: 'var(--text-1)',
                    fontFamily: "'Inter', sans-serif",
                  }}
                />
                <button
                  className="px-4 py-2.5 rounded-xl text-sm font-medium transition-all hover:scale-105"
                  style={{ border: '1px solid var(--border)', color: 'var(--text-2)', fontFamily: "'Inter', sans-serif", background: 'transparent' }}
                >
                  + Add Student
                </button>
                <div
                  className="flex items-center gap-2 text-xs ml-auto"
                  style={{ fontFamily: "'Inter', sans-serif", color: 'var(--text-3)' }}
                >
                  <span style={{ color: 'var(--text-1)', fontWeight: 600 }}>460</span> total
                  <span className="mx-1" style={{ color: 'var(--border)' }}>·</span>
                  <span style={{ color: '#34D399', fontWeight: 600 }}>432</span> active
                  <span className="mx-1" style={{ color: 'var(--border)' }}>·</span>
                  <span style={{ color: '#F59E0B', fontWeight: 600 }}>28</span> Alumni
                </div>
              </div>

              {/* Student cards grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                {filteredStudents.map((student) => {
                  const apps = applications.filter(a => a.studentName === student.name)
                  const derivedStatus = getStudentDerivedStatus(student.name)
                  const dotStatuses = apps.slice(0, 4).map(a => a.status)
                  const radius = 16
                  const circumference = 2 * Math.PI * radius
                  const filled = circumference * (student.score / 100)

                  return (
                    <div
                      key={student.name}
                      className="glass rounded-2xl p-4 hover:scale-[1.01] transition-all"
                      style={{ border: `1px solid ${student.color}25` }}
                    >
                      {/* Avatar + name */}
                      <div className="flex items-start gap-3 mb-3">
                        <div
                          className="w-11 h-11 rounded-xl flex items-center justify-center text-sm font-bold flex-shrink-0"
                          style={{
                            background: `linear-gradient(135deg, ${student.color}40, ${student.color}15)`,
                            color: student.color,
                            border: `1px solid ${student.color}30`,
                            fontFamily: "'Poppins', sans-serif",
                          }}
                        >
                          {student.avatar}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <p className="text-sm font-semibold" style={{ fontFamily: "'Poppins', sans-serif", color: 'var(--text-1)' }}>{student.name}</p>
                            <span
                              className="text-xs px-1.5 py-0.5 rounded"
                              style={{ background: 'var(--bg-surface-strong)', color: 'var(--text-3)', fontFamily: "'Inter', sans-serif" }}
                            >
                              {student.year}
                            </span>
                          </div>
                          <p className="text-xs mt-0.5" style={{ fontFamily: "'Inter', sans-serif", color: 'var(--text-2)' }}>{student.branch}</p>
                        </div>
                        {/* Mini ring */}
                        <div className="relative flex-shrink-0" style={{ width: 40, height: 40 }}>
                          <svg width="40" height="40" viewBox="0 0 40 40" style={{ transform: 'rotate(-90deg)' }}>
                            <circle cx="20" cy="20" r={radius} fill="none" stroke="var(--bg-surface-strong)" strokeWidth="4" />
                            <circle
                              cx="20" cy="20" r={radius} fill="none" stroke={student.color}
                              strokeWidth="4" strokeLinecap="round"
                              strokeDasharray={`${filled} ${circumference}`}
                            />
                          </svg>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-xs font-bold" style={{ color: student.color, fontFamily: "'Poppins', sans-serif", fontSize: 9 }}>{student.score}</span>
                          </div>
                        </div>
                      </div>

                      {/* CGPA + Status */}
                      <div className="flex items-center justify-between mb-3">
                        <span
                          className="text-xs px-2 py-0.5 rounded-full font-medium"
                          style={{ background: 'var(--bg-surface-strong)', color: 'var(--text-2)', fontFamily: "'Inter', sans-serif" }}
                        >
                          CGPA {student.cgpa}
                        </span>
                        <span
                          className="text-xs px-2.5 py-0.5 rounded-full font-medium"
                          style={{
                            background: statusConfig[derivedStatus].bg,
                            color: statusConfig[derivedStatus].text,
                            fontFamily: "'Inter', sans-serif",
                          }}
                        >
                          {derivedStatus}
                        </span>
                      </div>

                      {/* Application count + pipeline dots */}
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs" style={{ fontFamily: "'Inter', sans-serif", color: 'var(--text-3)' }}>
                          {apps.length} application{apps.length !== 1 ? 's' : ''}
                        </span>
                        <div className="flex items-center gap-1">
                          {dotStatuses.map((st, idx) => (
                            <div
                              key={idx}
                              className="w-2.5 h-2.5 rounded-full"
                              title={st}
                              style={{ background: STATUS_COLORS[st] }}
                            />
                          ))}
                          {apps.length === 0 && (
                            <span className="text-xs" style={{ color: 'var(--text-3)', fontFamily: "'Inter', sans-serif" }}>—</span>
                          )}
                        </div>
                      </div>

                      {/* View profile */}
                      <button
                        className="w-full text-xs py-2 rounded-lg transition-all hover:scale-[1.02]"
                        style={{ border: `1px solid ${student.color}30`, color: student.color, fontFamily: "'Inter', sans-serif", background: 'transparent' }}
                      >
                        View Full Profile
                      </button>
                    </div>
                  )
                })}
              </div>

              {/* Placement Drive Requests */}
              <div className="glass rounded-2xl p-5" style={{ border: '1px solid var(--border)' }}>
                <p className="text-sm font-semibold mb-4" style={{ fontFamily: "'Poppins', sans-serif", color: 'var(--text-1)' }}>
                  Placement Drive Requests
                  <span
                    className="ml-2 text-xs px-2 py-0.5 rounded-full"
                    style={{ background: '#F59E0B15', color: '#F59E0B', fontFamily: "'Inter', sans-serif" }}
                  >
                    3 pending
                  </span>
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {driveRequests.map((req) => (
                    <div
                      key={req.company}
                      className="rounded-xl p-4"
                      style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}
                    >
                      <div className="flex items-center gap-2.5 mb-3">
                        <div
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold"
                          style={{ background: `${req.color}18`, color: req.color, border: `1px solid ${req.color}25`, fontFamily: "'Poppins', sans-serif" }}
                        >
                          {req.company[0]}
                        </div>
                        <div>
                          <p className="text-sm font-medium" style={{ fontFamily: "'Poppins', sans-serif", color: 'var(--text-1)' }}>{req.company}</p>
                          <p className="text-xs" style={{ fontFamily: "'Inter', sans-serif", color: 'var(--text-3)' }}>{req.role}</p>
                        </div>
                      </div>
                      <p className="text-xs mb-3" style={{ fontFamily: "'Inter', sans-serif", color: 'var(--text-2)' }}>
                        Requested: <span style={{ color: 'var(--text-1)' }}>{req.date}</span>
                      </p>
                      <div className="flex gap-2">
                        <button
                          className="flex-1 text-xs py-1.5 rounded-lg font-medium transition-all hover:scale-105"
                          style={{ background: '#34D39915', color: '#34D399', border: '1px solid #34D39930', fontFamily: "'Inter', sans-serif" }}
                        >
                          Approve
                        </button>
                        <button
                          className="flex-1 text-xs py-1.5 rounded-lg font-medium transition-all hover:scale-105"
                          style={{ background: '#EF444415', color: '#EF4444', border: '1px solid #EF444430', fontFamily: "'Inter', sans-serif" }}
                        >
                          Decline
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ─── PLACEMENTS TAB ─── */}
          {activeTab === 'placements' && (
            <div className="flex flex-col gap-5">
              {/* Pipeline */}
              <div className="glass rounded-2xl p-5" style={{ border: '1px solid var(--border)' }}>
                <p className="text-sm font-semibold mb-5" style={{ fontFamily: "'Poppins', sans-serif", color: 'var(--text-1)' }}>
                  Placement Pipeline
                </p>
                <div className="flex items-center gap-1 overflow-x-auto pb-2">
                  {pipelineStages.map((stage, i) => (
                    <div key={stage.label} className="flex items-center">
                      <div
                        className="flex flex-col items-center px-5 py-4 rounded-xl flex-shrink-0"
                        style={{ background: `${stage.color}12`, border: `1px solid ${stage.color}25` }}
                      >
                        <span className="text-3xl font-bold" style={{ color: stage.color, fontFamily: "'Poppins', sans-serif" }}>
                          {stage.count}
                        </span>
                        <span className="text-xs mt-1" style={{ fontFamily: "'Inter', sans-serif", color: 'var(--text-2)' }}>
                          {stage.label}
                        </span>
                      </div>
                      {i < pipelineStages.length - 1 && (
                        <span className="mx-1 text-lg flex-shrink-0" style={{ color: 'var(--text-3)' }}>→</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Company-wise table */}
              <div className="glass rounded-2xl p-5" style={{ border: '1px solid var(--border)' }}>
                <p className="text-sm font-semibold mb-4" style={{ fontFamily: "'Poppins', sans-serif", color: 'var(--text-1)' }}>
                  Company-wise Placement Breakdown
                </p>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm" style={{ borderCollapse: 'collapse' }}>
                    <thead>
                      <tr>
                        {['Company', 'Role', 'Applied', 'Shortlisted', 'Offered', 'Accepted'].map(col => (
                          <th
                            key={col}
                            className="text-left pb-3 pr-4"
                            style={{ fontFamily: "'Inter', sans-serif", color: 'var(--text-3)', fontSize: 11, fontWeight: 500, borderBottom: '1px solid var(--border)' }}
                          >
                            {col}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {placementCompanies.map((c, i) => (
                        <tr
                          key={c.name}
                          style={{ background: i % 2 === 0 ? 'transparent' : 'var(--bg-surface)' }}
                        >
                          <td className="py-2.5 pr-4" style={{ fontFamily: "'Inter', sans-serif", color: 'var(--text-1)', fontSize: 13, fontWeight: 500 }}>{c.name}</td>
                          <td className="py-2.5 pr-4" style={{ fontFamily: "'Inter', sans-serif", color: 'var(--text-3)', fontSize: 12 }}>AI / ML</td>
                          <td className="py-2.5 pr-4" style={{ fontFamily: "'Inter', sans-serif", color: '#3B82F6', fontSize: 13 }}>{c.applied}</td>
                          <td className="py-2.5 pr-4" style={{ fontFamily: "'Inter', sans-serif", color: '#F59E0B', fontSize: 13 }}>{c.shortlisted}</td>
                          <td className="py-2.5 pr-4" style={{ fontFamily: "'Inter', sans-serif", color: '#34D399', fontSize: 13 }}>{c.offered}</td>
                          <td className="py-2.5 pr-4" style={{ fontFamily: "'Inter', sans-serif", color: '#10B981', fontSize: 13, fontWeight: 600 }}>{c.accepted}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Offer letter tracking */}
              <div className="glass rounded-2xl p-5" style={{ border: '1px solid var(--border)' }}>
                <p className="text-sm font-semibold mb-4" style={{ fontFamily: "'Poppins', sans-serif", color: 'var(--text-1)' }}>
                  Offer Letter Tracking
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {offerLetters.map((offer) => (
                    <div
                      key={offer.name}
                      className="rounded-xl p-4"
                      style={{ background: 'var(--bg-surface)', border: `1px solid ${offer.color}20` }}
                    >
                      <div className="flex items-center gap-2.5 mb-3">
                        <div
                          className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold"
                          style={{ background: `linear-gradient(135deg, ${offer.color}40, ${offer.color}15)`, color: offer.color, fontFamily: "'Poppins', sans-serif" }}
                        >
                          {offer.avatar}
                        </div>
                        <div>
                          <p className="text-sm font-semibold" style={{ fontFamily: "'Poppins', sans-serif", color: 'var(--text-1)' }}>{offer.name}</p>
                          <p className="text-xs" style={{ fontFamily: "'Inter', sans-serif", color: 'var(--text-3)' }}>{offer.company}</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-base font-bold" style={{ color: offer.color, fontFamily: "'Poppins', sans-serif" }}>{offer.ctc}</span>
                        <span
                          className="text-xs px-2.5 py-1 rounded-full font-medium"
                          style={{
                            background: offer.status === 'Accepted' ? '#34D39915' : '#F59E0B15',
                            color: offer.status === 'Accepted' ? '#34D399' : '#F59E0B',
                            fontFamily: "'Inter', sans-serif",
                          }}
                        >
                          {offer.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ─── DEPARTMENTS TAB ─── */}
          {activeTab === 'departments' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {departments.map((dept) => (
                <div
                  key={dept.name}
                  className="glass rounded-2xl p-5 hover:scale-[1.01] transition-all"
                  style={{ border: `1px solid ${dept.color}25` }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-semibold" style={{ fontFamily: "'Poppins', sans-serif", color: 'var(--text-1)' }}>{dept.name}</h3>
                    <span className="text-xs" style={{ fontFamily: "'Inter', sans-serif", color: 'var(--text-3)' }}>{dept.students} students</span>
                  </div>
                  <div className="relative w-24 h-24 mx-auto mb-3">
                    <svg className="w-24 h-24 -rotate-90" viewBox="0 0 96 96">
                      <circle cx="48" cy="48" r="40" fill="none" stroke="var(--bg-surface-strong)" strokeWidth="7" />
                      <circle
                        cx="48" cy="48" r="40" fill="none" stroke={dept.color}
                        strokeWidth="7" strokeLinecap="round"
                        strokeDasharray={`${2 * Math.PI * 40 * dept.placed / 100} ${2 * Math.PI * 40}`}
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-xl font-bold" style={{ color: dept.color, fontFamily: "'Poppins', sans-serif" }}>{dept.placed}%</span>
                      <span className="text-xs" style={{ fontFamily: "'Inter', sans-serif", color: 'var(--text-3)' }}>placed</span>
                    </div>
                  </div>
                  <p className="text-xs text-center" style={{ fontFamily: "'Inter', sans-serif", color: 'var(--text-2)' }}>
                    {Math.round(dept.students * dept.placed / 100)} / {dept.students} students placed
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* ─── RECRUITERS TAB ─── */}
          {activeTab === 'recruiters' && (
            <div className="flex flex-col gap-5">
              {/* Header with Schedule Drive button */}
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold" style={{ fontFamily: "'Poppins', sans-serif", color: 'var(--text-1)' }}>
                  Recruiter Dashboard
                </p>
                <button
                  onClick={() => setShowDriveForm(!showDriveForm)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all hover:scale-105"
                  style={{
                    background: showDriveForm ? '#F59E0B20' : 'var(--bg-surface)',
                    border: `1px solid ${showDriveForm ? '#F59E0B50' : 'var(--border)'}`,
                    color: showDriveForm ? '#F59E0B' : 'var(--text-1)',
                    fontFamily: "'Inter', sans-serif",
                  }}
                >
                  {showDriveForm ? '✕ Cancel' : '+ Schedule Campus Drive'}
                </button>
              </div>

              {/* Drive form (inline, slides in) */}
              {showDriveForm && (
                <div
                  className="glass rounded-2xl p-5"
                  style={{ border: '1px solid #F59E0B30' }}
                >
                  <p className="text-sm font-semibold mb-4" style={{ fontFamily: "'Poppins', sans-serif", color: '#F59E0B' }}>
                    Request Campus Drive
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                    {[
                      { key: 'company', label: 'Company Name', placeholder: 'e.g. Anthropic' },
                      { key: 'date', label: 'Drive Date', placeholder: 'e.g. Oct 15, 2025' },
                      { key: 'roles', label: 'Roles', placeholder: 'e.g. SDE, ML Engineer' },
                      { key: 'maxStudents', label: 'Max Students', placeholder: 'e.g. 50' },
                    ].map(({ key, label, placeholder }) => (
                      <div key={key}>
                        <label
                          className="block text-xs mb-1.5"
                          style={{ fontFamily: "'Inter', sans-serif", color: 'var(--text-2)' }}
                        >
                          {label}
                        </label>
                        <input
                          type="text"
                          placeholder={placeholder}
                          value={driveForm[key as keyof typeof driveForm]}
                          onChange={(e) => setDriveForm(f => ({ ...f, [key]: e.target.value }))}
                          className="w-full rounded-xl px-4 py-2.5 text-sm outline-none"
                          style={{
                            background: 'var(--input-bg)',
                            border: '1px solid var(--input-border)',
                            color: 'var(--text-1)',
                            fontFamily: "'Inter', sans-serif",
                          }}
                        />
                      </div>
                    ))}
                  </div>
                  <button
                    className="px-6 py-2.5 rounded-xl text-sm font-medium transition-all hover:scale-105"
                    style={{ background: 'linear-gradient(135deg, #F59E0B, #EF4444)', color: '#fff', fontFamily: "'Inter', sans-serif" }}
                    onClick={() => setShowDriveForm(false)}
                  >
                    Request Drive
                  </button>
                </div>
              )}

              {/* Top companies chart + heatmap */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                <div className="glass rounded-2xl p-5" style={{ border: '1px solid var(--border)' }}>
                  <p className="text-sm font-semibold mb-4" style={{ fontFamily: "'Poppins', sans-serif", color: 'var(--text-1)' }}>
                    Top Recruiting Companies
                  </p>
                  <div className="flex flex-col gap-3">
                    {topCompanies.map((c) => (
                      <div key={c.name} className="flex items-center gap-4">
                        <div
                          className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold flex-shrink-0"
                          style={{ background: `${c.color}18`, color: c.color, border: `1px solid ${c.color}25`, fontFamily: "'Poppins', sans-serif" }}
                        >
                          {c.name[0]}
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between mb-1">
                            <span className="text-xs" style={{ fontFamily: "'Inter', sans-serif", color: 'var(--text-2)' }}>{c.name}</span>
                            <span className="text-xs font-medium" style={{ color: c.color, fontFamily: "'Inter', sans-serif" }}>{c.hires} hires</span>
                          </div>
                          <div className="w-full h-1.5 rounded-full" style={{ background: 'var(--bg-surface-strong)' }}>
                            <div className="h-full rounded-full" style={{ width: `${(c.hires / 40) * 100}%`, background: c.color }} />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="glass rounded-2xl p-5" style={{ border: '1px solid var(--border)' }}>
                  <p className="text-sm font-semibold mb-4" style={{ fontFamily: "'Poppins', sans-serif", color: 'var(--text-1)' }}>
                    Recruiter Activity Heatmap
                  </p>
                  <p className="text-xs mb-4" style={{ fontFamily: "'Inter', sans-serif", color: 'var(--text-3)' }}>Interview activity — last 12 weeks</p>
                  <div className="grid gap-1" style={{ gridTemplateColumns: 'repeat(12, 1fr)' }}>
                    {Array.from({ length: 84 }).map((_, i) => {
                      const seed = (i * 2654435769) >>> 0
                      const intensity = (seed % 100) / 100
                      return (
                        <div
                          key={i}
                          className="aspect-square rounded-sm"
                          style={{
                            background: intensity > 0.7 ? '#F59E0B' : intensity > 0.4 ? 'rgba(245,158,11,0.4)' : intensity > 0.15 ? 'rgba(245,158,11,0.15)' : 'var(--bg-surface)',
                            boxShadow: intensity > 0.7 ? '0 0 4px rgba(245,158,11,0.4)' : 'none',
                          }}
                        />
                      )
                    })}
                  </div>
                  <div className="flex items-center gap-2 mt-3">
                    <span className="text-xs" style={{ fontFamily: "'Inter', sans-serif", color: 'var(--text-3)' }}>Less</span>
                    {[0.04, 0.15, 0.4, 0.7, 1].map((v, i) => (
                      <div
                        key={i}
                        className="w-3 h-3 rounded-sm"
                        style={{ background: v < 0.1 ? 'var(--bg-surface)' : `rgba(245,158,11,${v})` }}
                      />
                    ))}
                    <span className="text-xs" style={{ fontFamily: "'Inter', sans-serif", color: 'var(--text-3)' }}>More</span>
                  </div>
                </div>
              </div>

              {/* Active Recruiter Partnerships */}
              <div className="glass rounded-2xl p-5" style={{ border: '1px solid var(--border)' }}>
                <p className="text-sm font-semibold mb-4" style={{ fontFamily: "'Poppins', sans-serif", color: 'var(--text-1)' }}>
                  Active Recruiter Partnerships
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {recruiterPartners.map((partner) => (
                    <div
                      key={partner.name}
                      className="rounded-xl p-4 hover:scale-[1.02] transition-all"
                      style={{ background: 'var(--bg-surface)', border: `1px solid ${partner.color}20` }}
                    >
                      <div className="flex items-center gap-2.5 mb-3">
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold"
                          style={{ background: `linear-gradient(135deg, ${partner.color}40, ${partner.color}15)`, color: partner.color, fontFamily: "'Poppins', sans-serif" }}
                        >
                          {partner.name[0]}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold truncate" style={{ fontFamily: "'Poppins', sans-serif", color: 'var(--text-1)' }}>{partner.name}</p>
                          <span
                            className="text-xs px-1.5 py-0.5 rounded-full"
                            style={{ background: `${partner.badgeColor}15`, color: partner.badgeColor, fontFamily: "'Inter', sans-serif" }}
                          >
                            {partner.badge}
                          </span>
                        </div>
                      </div>
                      <div className="flex justify-between mb-3 text-xs" style={{ fontFamily: "'Inter', sans-serif" }}>
                        <span style={{ color: 'var(--text-3)' }}>JDs: <span style={{ color: 'var(--text-1)', fontWeight: 600 }}>{partner.jds}</span></span>
                        <span style={{ color: 'var(--text-3)' }}>Hires: <span style={{ color: partner.color, fontWeight: 600 }}>{partner.hires}</span></span>
                      </div>
                      <div className="flex gap-2">
                        <button
                          className="flex-1 text-xs py-1.5 rounded-lg transition-all hover:scale-105"
                          style={{ border: `1px solid ${partner.color}30`, color: partner.color, fontFamily: "'Inter', sans-serif", background: 'transparent' }}
                        >
                          View JDs
                        </button>
                        <button
                          className="flex-1 text-xs py-1.5 rounded-lg transition-all hover:scale-105"
                          style={{ border: '1px solid var(--border)', color: 'var(--text-2)', fontFamily: "'Inter', sans-serif", background: 'transparent' }}
                        >
                          Message
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  )
}
