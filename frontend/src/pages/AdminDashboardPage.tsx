import { useSearchParams } from 'react-router-dom'
import { AppShell } from '../components/Layout'

const tabs = [
  { key: 'overview', label: 'Overview' },
  { key: 'users', label: 'Users' },
  { key: 'institutions', label: 'Institutions' },
  { key: 'analytics', label: 'Analytics' },
  { key: 'system', label: 'System' },
]

const kpis = [
  { label: 'Total Students', val: '40.2M', delta: '+2.1M this month', color: '#3B82F6' },
  { label: 'Institutions', val: '58,420', delta: '+312 new', color: '#F59E0B' },
  { label: 'Recruiters', val: '1,04,882', delta: '+8.2K', color: '#10B981' },
  { label: 'Platform ARR', val: '₹142Cr', delta: '+18% YoY', color: '#EF4444' },
]

const weeklyData = [
  { week: 'W1', total: 38200, students: 35800, recruiters: 1900, colleges: 500 },
  { week: 'W2', total: 41500, students: 38900, recruiters: 2100, colleges: 500 },
  { week: 'W3', total: 39800, students: 37200, recruiters: 2100, colleges: 500 },
  { week: 'W4', total: 45200, students: 42400, recruiters: 2300, colleges: 500 },
  { week: 'W5', total: 43900, students: 41100, recruiters: 2300, colleges: 500 },
  { week: 'W6', total: 48700, students: 45800, recruiters: 2400, colleges: 500 },
  { week: 'W7', total: 52100, students: 49000, recruiters: 2600, colleges: 500 },
  { week: 'W8', total: 56400, students: 53000, recruiters: 2900, colleges: 500 },
]

const services = [
  { name: 'API Gateway', status: 'ok', uptime: '99.99%', latency: '12ms' },
  { name: 'AI Models', status: 'ok', uptime: '99.8%', latency: '340ms' },
  { name: 'Database', status: 'ok', uptime: '99.95%', latency: '4ms' },
  { name: 'Email Service', status: 'warn', uptime: '98.2%', latency: '820ms' },
  { name: 'Storage', status: 'ok', uptime: '99.99%', latency: '22ms' },
]

const systemEvents = [
  { time: '2m ago', actor: 'System', action: 'AI model updated to v3.2', severity: 'info' },
  { time: '18m ago', actor: 'Admin', action: '50 accounts batch-verified', severity: 'info' },
  { time: '1h ago', actor: 'System', action: 'Email delivery degraded — investigating', severity: 'warning' },
  { time: '3h ago', actor: 'Admin', action: 'Feature flag "Video Interviews" enabled', severity: 'info' },
  { time: '6h ago', actor: 'System', action: 'Unusual login spike — 3x normal rate', severity: 'critical' },
]

const recentUsers = [
  { name: 'Aryan Kapoor', role: 'student', institution: 'IIT Delhi', joined: 'Jul 21, 2026', status: 'Active' },
  { name: 'Priya Mehta', role: 'recruiter', institution: 'Google India', joined: 'Jul 21, 2026', status: 'Active' },
  { name: 'Sneha Reddy', role: 'student', institution: 'BITS Pilani', joined: 'Jul 20, 2026', status: 'Pending' },
  { name: 'Vikram Singh', role: 'recruiter', institution: 'Microsoft', joined: 'Jul 20, 2026', status: 'Active' },
  { name: 'Ananya Das', role: 'student', institution: 'NIT Warangal', joined: 'Jul 19, 2026', status: 'Active' },
  { name: 'Rohit Sharma', role: 'college', institution: 'IIT Madras', joined: 'Jul 18, 2026', status: 'Active' },
  { name: 'Kavya Nair', role: 'student', institution: 'IIIT Hyderabad', joined: 'Jul 18, 2026', status: 'Suspended' },
  { name: 'Aditya Verma', role: 'recruiter', institution: 'Flipkart', joined: 'Jul 17, 2026', status: 'Pending' },
]

const institutions = [
  { name: 'IIT Delhi', tier: 'Premium', students: 12400, placement: 94, sub: 'Active', color: '#3B82F6' },
  { name: 'IIT Bombay', tier: 'Premium', students: 13200, placement: 96, sub: 'Active', color: '#8B5CF6' },
  { name: 'BITS Pilani', tier: 'Premium', students: 9800, placement: 91, sub: 'Active', color: '#06B6D4' },
  { name: 'NIT Warangal', tier: 'Standard', students: 7600, placement: 82, sub: 'Active', color: '#F59E0B' },
  { name: 'IIIT Hyderabad', tier: 'Standard', students: 5200, placement: 88, sub: 'Trial', color: '#10B981' },
  { name: 'IIT Madras', tier: 'Premium', students: 11800, placement: 95, sub: 'Active', color: '#EC4899' },
]

const featureAdoption = [
  { name: 'AI Mentor', pct: 92, color: '#3B82F6' },
  { name: 'Resume Analyzer', pct: 85, color: '#8B5CF6' },
  { name: 'Career Twin', pct: 78, color: '#06B6D4' },
  { name: 'Job Matching', pct: 89, color: '#10B981' },
  { name: 'Mock Interview', pct: 71, color: '#F59E0B' },
  { name: 'Skill Gap', pct: 68, color: '#EF4444' },
]

const systemCards = [
  { name: 'API', status: 'ok', latency: '12ms', uptime: '99.99%', lastIncident: 'Never' },
  { name: 'Database', status: 'ok', latency: '4ms', uptime: '99.95%', lastIncident: '14 days ago' },
  { name: 'AI Models', status: 'ok', latency: '340ms', uptime: '99.8%', lastIncident: '3 days ago' },
  { name: 'Email', status: 'warn', latency: '820ms', uptime: '98.2%', lastIncident: '1 hour ago' },
  { name: 'Storage', status: 'ok', latency: '22ms', uptime: '99.99%', lastIncident: 'Never' },
  { name: 'CDN', status: 'ok', latency: '8ms', uptime: '99.97%', lastIncident: '30 days ago' },
]

const featureFlags = [
  { name: 'New AI Career Twin v2', on: true },
  { name: 'GPT-4o Integration', on: true },
  { name: 'Video Interviews', on: true },
  { name: 'Resume PDF Export', on: false },
  { name: 'Bulk Recruiter Import', on: false },
  { name: 'College SSO', on: true },
]

const errorLog = [
  { time: '1h ago', service: 'Email', message: 'SMTP connection timeout (5xx)', severity: 'warning', resolved: false },
  { time: '3h ago', service: 'AI Models', message: 'Rate limit hit — OpenAI fallback triggered', severity: 'warning', resolved: true },
  { time: '8h ago', service: 'API', message: 'Auth token validation spike (800/min)', severity: 'info', resolved: true },
  { time: '1d ago', service: 'Database', message: 'Slow query detected (>2s) on jobs_table', severity: 'warning', resolved: true },
  { time: '2d ago', service: 'Storage', message: 'S3 presigned URL expiry mismatch', severity: 'info', resolved: true },
]

const severityBadge = (s: string) => {
  const map: Record<string, { bg: string; color: string }> = {
    info: { bg: 'rgba(59,130,246,0.15)', color: '#3B82F6' },
    warning: { bg: 'rgba(245,158,11,0.15)', color: '#F59E0B' },
    critical: { bg: 'rgba(239,68,68,0.15)', color: '#EF4444' },
  }
  return map[s] ?? map['info']
}

const roleBadge = (r: string) => {
  const map: Record<string, { bg: string; color: string }> = {
    student: { bg: 'rgba(59,130,246,0.15)', color: '#3B82F6' },
    recruiter: { bg: 'rgba(139,92,246,0.15)', color: '#8B5CF6' },
    college: { bg: 'rgba(16,185,129,0.15)', color: '#10B981' },
    admin: { bg: 'rgba(239,68,68,0.15)', color: '#EF4444' },
  }
  return map[r] ?? { bg: 'rgba(100,100,100,0.15)', color: '#888' }
}

const statusBadge = (s: string) => {
  const map: Record<string, { bg: string; color: string }> = {
    Active: { bg: 'rgba(16,185,129,0.15)', color: '#10B981' },
    Pending: { bg: 'rgba(245,158,11,0.15)', color: '#F59E0B' },
    Suspended: { bg: 'rgba(239,68,68,0.15)', color: '#EF4444' },
    Trial: { bg: 'rgba(245,158,11,0.15)', color: '#F59E0B' },
    Expired: { bg: 'rgba(100,100,100,0.15)', color: '#888' },
  }
  return map[s] ?? { bg: 'rgba(100,100,100,0.15)', color: '#888' }
}

const tierBadge = (t: string) => {
  const map: Record<string, { bg: string; color: string }> = {
    Premium: { bg: 'rgba(239,68,68,0.15)', color: '#EF4444' },
    Standard: { bg: 'rgba(59,130,246,0.15)', color: '#3B82F6' },
    Trial: { bg: 'rgba(245,158,11,0.15)', color: '#F59E0B' },
  }
  return map[t] ?? { bg: 'rgba(100,100,100,0.15)', color: '#888' }
}

const maxWeeklyTotal = Math.max(...weeklyData.map((d) => d.total))

export default function AdminDashboardPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const activeTab = searchParams.get('tab') ?? 'overview'

  return (
    <AppShell>
      <div className="min-h-screen px-4 md:px-6 py-8">
        <div className="max-w-7xl mx-auto">

          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div>
              <div
                className="inline-flex items-center gap-2 glass rounded-full px-3 py-1 mb-3 text-xs border"
                style={{ fontFamily: "'Inter', sans-serif", color: '#EF4444', borderColor: 'rgba(239,68,68,0.25)' }}
              >
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: '#EF4444' }} />
                System Admin · Platform v2.4.1
              </div>
              <h1
                className="text-3xl md:text-4xl font-bold mb-2"
                style={{ fontFamily: "'Poppins', sans-serif", color: 'var(--text-1)' }}
              >
                Admin <span className="gradient-text">Dashboard</span>
              </h1>
              <p className="text-sm" style={{ fontFamily: "'Inter', sans-serif", color: 'var(--text-2)' }}>
                Full platform visibility and control
              </p>
            </div>
            <button
              className="hidden md:flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all hover:scale-105"
              style={{
                background: 'var(--bg-surface-strong)',
                border: '1px solid var(--border-accent)',
                fontFamily: "'Inter', sans-serif",
                color: 'var(--text-1)',
              }}
            >
              ↓ Download Report
            </button>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {kpis.map((kpi) => (
              <div key={kpi.label} className="glass rounded-2xl p-4" style={{ border: '1px solid var(--border)' }}>
                <p className="text-xs mb-2" style={{ fontFamily: "'Inter', sans-serif", color: 'var(--text-2)' }}>
                  {kpi.label}
                </p>
                <p className="text-2xl font-bold mb-0.5" style={{ color: kpi.color, fontFamily: "'Poppins', sans-serif" }}>
                  {kpi.val}
                </p>
                <p className="text-xs" style={{ fontFamily: "'Inter', sans-serif", color: 'var(--text-3)' }}>
                  {kpi.delta}
                </p>
              </div>
            ))}
          </div>

          {/* Tab Selector */}
          <div className="flex gap-1 glass rounded-xl p-1 mb-5 w-fit" style={{ border: '1px solid var(--border)' }}>
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setSearchParams(tab.key === 'overview' ? {} : { tab: tab.key })}
                className="px-5 py-2 rounded-lg text-xs font-medium capitalize transition-all duration-200"
                style={{
                  background:
                    activeTab === tab.key ? 'linear-gradient(135deg, #EF4444, #EC4899)' : 'transparent',
                  color: activeTab === tab.key ? '#fff' : 'var(--text-2)',
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* ── Overview ── */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* User Growth Chart */}
                <div className="md:col-span-2 glass rounded-2xl p-5" style={{ border: '1px solid var(--border)' }}>
                  <p className="text-sm font-semibold mb-4" style={{ fontFamily: "'Poppins', sans-serif", color: 'var(--text-1)' }}>
                    Weekly New User Growth
                  </p>
                  <div className="flex items-end gap-3 h-44">
                    {weeklyData.map((d) => {
                      const pct = (d.total / maxWeeklyTotal) * 100
                      return (
                        <div key={d.week} className="flex-1 flex flex-col items-center gap-1">
                          <span className="text-xs" style={{ fontFamily: "'Inter', sans-serif", color: 'var(--text-3)', fontSize: 10 }}>
                            {(d.total / 1000).toFixed(1)}K
                          </span>
                          <div
                            className="w-full rounded-t-lg transition-all duration-500"
                            style={{
                              height: `${pct}%`,
                              background: 'linear-gradient(180deg, #EF4444, #EC4899)',
                              minHeight: 8,
                            }}
                          />
                          <span className="text-xs" style={{ fontFamily: "'Inter', sans-serif", color: 'var(--text-3)', fontSize: 10 }}>
                            {d.week}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                  <div className="flex gap-4 mt-4">
                    {[
                      { label: 'Students', color: '#3B82F6' },
                      { label: 'Recruiters', color: '#10B981' },
                      { label: 'Colleges', color: '#F59E0B' },
                    ].map((l) => (
                      <div key={l.label} className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full" style={{ background: l.color }} />
                        <span className="text-xs" style={{ fontFamily: "'Inter', sans-serif", color: 'var(--text-3)' }}>
                          {l.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Platform Health */}
                <div className="glass rounded-2xl p-5" style={{ border: '1px solid var(--border)' }}>
                  <p className="text-sm font-semibold mb-4" style={{ fontFamily: "'Poppins', sans-serif", color: 'var(--text-1)' }}>
                    Platform Health
                  </p>
                  <div className="space-y-3">
                    {services.map((svc) => (
                      <div key={svc.name} className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <span
                            className="w-2 h-2 rounded-full shrink-0"
                            style={{ background: svc.status === 'ok' ? '#10B981' : '#F59E0B' }}
                          />
                          <span
                            className="text-xs truncate"
                            style={{ fontFamily: "'Inter', sans-serif", color: 'var(--text-1)' }}
                          >
                            {svc.name}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <span
                            className="text-xs font-medium"
                            style={{ color: svc.status === 'ok' ? '#10B981' : '#F59E0B', fontFamily: "'Inter', sans-serif" }}
                          >
                            {svc.uptime}
                          </span>
                          <span
                            className="text-xs px-1.5 py-0.5 rounded"
                            style={{
                              background: 'var(--bg-surface-strong)',
                              color: 'var(--text-3)',
                              fontFamily: "'Inter', sans-serif",
                            }}
                          >
                            {svc.latency}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                  {services.find((s) => s.status === 'warn') && (
                    <div
                      className="mt-4 rounded-xl px-3 py-2 text-xs"
                      style={{
                        background: 'rgba(245,158,11,0.1)',
                        border: '1px solid rgba(245,158,11,0.2)',
                        color: '#F59E0B',
                        fontFamily: "'Inter', sans-serif",
                      }}
                    >
                      ⚠ Email Service degraded — team notified
                    </div>
                  )}
                </div>
              </div>

              {/* System Events Feed */}
              <div className="glass rounded-2xl p-5" style={{ border: '1px solid var(--border)' }}>
                <p className="text-sm font-semibold mb-4" style={{ fontFamily: "'Poppins', sans-serif", color: 'var(--text-1)' }}>
                  Recent System Events
                </p>
                <div className="space-y-3">
                  {systemEvents.map((ev, i) => {
                    const badge = severityBadge(ev.severity)
                    return (
                      <div
                        key={i}
                        className="flex items-center gap-4 py-2 rounded-xl px-3"
                        style={{ background: 'var(--bg-surface-strong)' }}
                      >
                        <span className="text-xs w-14 shrink-0" style={{ fontFamily: "'Inter', sans-serif", color: 'var(--text-3)' }}>
                          {ev.time}
                        </span>
                        <span
                          className="text-xs font-medium w-14 shrink-0"
                          style={{ fontFamily: "'Inter', sans-serif", color: 'var(--text-2)' }}
                        >
                          {ev.actor}
                        </span>
                        <span className="text-xs flex-1" style={{ fontFamily: "'Inter', sans-serif", color: 'var(--text-1)' }}>
                          {ev.action}
                        </span>
                        <span
                          className="text-xs px-2 py-0.5 rounded-full capitalize shrink-0"
                          style={{ background: badge.bg, color: badge.color, fontFamily: "'Inter', sans-serif" }}
                        >
                          {ev.severity}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          )}

          {/* ── Users ── */}
          {activeTab === 'users' && (
            <div className="space-y-6">
              {/* Summary Row */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: 'Students', val: '40.2M', color: '#3B82F6' },
                  { label: 'Recruiters', val: '104K', color: '#8B5CF6' },
                  { label: 'Institutions', val: '58K', color: '#10B981' },
                  { label: 'Admins', val: '12', color: '#EF4444' },
                ].map((s) => (
                  <div key={s.label} className="glass rounded-2xl p-4" style={{ border: '1px solid var(--border)' }}>
                    <p className="text-xs mb-1" style={{ fontFamily: "'Inter', sans-serif", color: 'var(--text-2)' }}>
                      {s.label}
                    </p>
                    <p className="text-2xl font-bold" style={{ color: s.color, fontFamily: "'Poppins', sans-serif" }}>
                      {s.val}
                    </p>
                  </div>
                ))}
              </div>

              {/* Role Distribution */}
              <div className="glass rounded-2xl p-5" style={{ border: '1px solid var(--border)' }}>
                <p className="text-sm font-semibold mb-4" style={{ fontFamily: "'Poppins', sans-serif", color: 'var(--text-1)' }}>
                  Role Distribution
                </p>
                <div className="space-y-3">
                  {[
                    { label: 'Students', pct: 94, color: '#3B82F6' },
                    { label: 'Recruiters', pct: 5, color: '#8B5CF6' },
                    { label: 'Institutions', pct: 1, color: '#10B981' },
                  ].map((r) => (
                    <div key={r.label} className="space-y-1">
                      <div className="flex justify-between">
                        <span className="text-xs" style={{ fontFamily: "'Inter', sans-serif", color: 'var(--text-2)' }}>
                          {r.label}
                        </span>
                        <span className="text-xs font-medium" style={{ fontFamily: "'Inter', sans-serif", color: r.color }}>
                          {r.pct}%
                        </span>
                      </div>
                      <div className="h-2 rounded-full" style={{ background: 'var(--bg-surface-strong)' }}>
                        <div
                          className="h-2 rounded-full transition-all duration-700"
                          style={{ width: `${r.pct}%`, background: r.color }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Users Table */}
              <div className="glass rounded-2xl p-5" style={{ border: '1px solid var(--border)' }}>
                <p className="text-sm font-semibold mb-4" style={{ fontFamily: "'Poppins', sans-serif", color: 'var(--text-1)' }}>
                  Recent Users
                </p>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr>
                        {['Name', 'Role', 'Institution', 'Joined', 'Status'].map((h) => (
                          <th
                            key={h}
                            className="text-left pb-3 pr-4"
                            style={{ fontFamily: "'Inter', sans-serif", color: 'var(--text-3)', fontWeight: 500 }}
                          >
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {recentUsers.map((u, i) => {
                        const rb = roleBadge(u.role)
                        const sb = statusBadge(u.status)
                        return (
                          <tr
                            key={i}
                            style={{ borderTop: '1px solid var(--border)' }}
                          >
                            <td className="py-2.5 pr-4" style={{ fontFamily: "'Inter', sans-serif", color: 'var(--text-1)' }}>
                              {u.name}
                            </td>
                            <td className="py-2.5 pr-4">
                              <span
                                className="px-2 py-0.5 rounded-full capitalize text-xs"
                                style={{ background: rb.bg, color: rb.color, fontFamily: "'Inter', sans-serif" }}
                              >
                                {u.role}
                              </span>
                            </td>
                            <td className="py-2.5 pr-4" style={{ fontFamily: "'Inter', sans-serif", color: 'var(--text-2)' }}>
                              {u.institution}
                            </td>
                            <td className="py-2.5 pr-4" style={{ fontFamily: "'Inter', sans-serif", color: 'var(--text-3)' }}>
                              {u.joined}
                            </td>
                            <td className="py-2.5">
                              <span
                                className="px-2 py-0.5 rounded-full text-xs"
                                style={{ background: sb.bg, color: sb.color, fontFamily: "'Inter', sans-serif" }}
                              >
                                {u.status}
                              </span>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ── Institutions ── */}
          {activeTab === 'institutions' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {institutions.map((inst) => {
                  const tb = tierBadge(inst.tier)
                  const sb = statusBadge(inst.sub)
                  return (
                    <div
                      key={inst.name}
                      className="glass rounded-2xl p-5"
                      style={{ border: `1px solid var(--border)` }}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold"
                          style={{ background: `${inst.color}20`, color: inst.color, fontFamily: "'Poppins', sans-serif" }}
                        >
                          {inst.name.split(' ').map((w) => w[0]).join('').slice(0, 2)}
                        </div>
                        <div className="flex gap-1.5">
                          <span
                            className="text-xs px-2 py-0.5 rounded-full"
                            style={{ background: tb.bg, color: tb.color, fontFamily: "'Inter', sans-serif" }}
                          >
                            {inst.tier}
                          </span>
                          <span
                            className="text-xs px-2 py-0.5 rounded-full"
                            style={{ background: sb.bg, color: sb.color, fontFamily: "'Inter', sans-serif" }}
                          >
                            {inst.sub}
                          </span>
                        </div>
                      </div>
                      <p className="font-semibold mb-1" style={{ fontFamily: "'Poppins', sans-serif", color: 'var(--text-1)' }}>
                        {inst.name}
                      </p>
                      <div className="flex gap-4 mt-2">
                        <div>
                          <p className="text-xs" style={{ fontFamily: "'Inter', sans-serif", color: 'var(--text-3)' }}>Students</p>
                          <p className="text-sm font-semibold" style={{ color: inst.color, fontFamily: "'Poppins', sans-serif" }}>
                            {inst.students.toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs" style={{ fontFamily: "'Inter', sans-serif", color: 'var(--text-3)' }}>Placement</p>
                          <p className="text-sm font-semibold" style={{ color: '#10B981', fontFamily: "'Poppins', sans-serif" }}>
                            {inst.placement}%
                          </p>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Summary Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { label: 'Premium Subscribers', val: '312', color: '#EF4444' },
                  { label: 'Free Tier', val: '18,420', color: '#3B82F6' },
                  { label: 'Trial', val: '4,200', color: '#F59E0B' },
                ].map((s) => (
                  <div key={s.label} className="glass rounded-2xl p-4" style={{ border: '1px solid var(--border)' }}>
                    <p className="text-xs mb-1" style={{ fontFamily: "'Inter', sans-serif", color: 'var(--text-2)' }}>
                      {s.label}
                    </p>
                    <p className="text-2xl font-bold" style={{ color: s.color, fontFamily: "'Poppins', sans-serif" }}>
                      {s.val}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Analytics ── */}
          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Feature Adoption */}
                <div className="glass rounded-2xl p-5" style={{ border: '1px solid var(--border)' }}>
                  <p className="text-sm font-semibold mb-4" style={{ fontFamily: "'Poppins', sans-serif", color: 'var(--text-1)' }}>
                    Feature Adoption
                  </p>
                  <div className="space-y-3">
                    {featureAdoption.map((f) => (
                      <div key={f.name} className="space-y-1">
                        <div className="flex justify-between">
                          <span className="text-xs" style={{ fontFamily: "'Inter', sans-serif", color: 'var(--text-2)' }}>
                            {f.name}
                          </span>
                          <span className="text-xs font-medium" style={{ fontFamily: "'Inter', sans-serif", color: f.color }}>
                            {f.pct}%
                          </span>
                        </div>
                        <div className="h-2 rounded-full" style={{ background: 'var(--bg-surface-strong)' }}>
                          <div
                            className="h-2 rounded-full transition-all duration-700"
                            style={{ width: `${f.pct}%`, background: f.color }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Engagement Metrics */}
                <div className="glass rounded-2xl p-5" style={{ border: '1px solid var(--border)' }}>
                  <p className="text-sm font-semibold mb-4" style={{ fontFamily: "'Poppins', sans-serif", color: 'var(--text-1)' }}>
                    Engagement Metrics
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { label: 'DAU', val: '2.4M', color: '#3B82F6' },
                      { label: 'Avg Session', val: '18 min', color: '#8B5CF6' },
                      { label: 'D7 Retention', val: '74%', color: '#10B981' },
                      { label: 'D30 Retention', val: '52%', color: '#F59E0B' },
                    ].map((m) => (
                      <div
                        key={m.label}
                        className="rounded-xl p-4"
                        style={{ background: 'var(--bg-surface-strong)', border: '1px solid var(--border)' }}
                      >
                        <p className="text-xs mb-1" style={{ fontFamily: "'Inter', sans-serif", color: 'var(--text-3)' }}>
                          {m.label}
                        </p>
                        <p className="text-xl font-bold" style={{ color: m.color, fontFamily: "'Poppins', sans-serif" }}>
                          {m.val}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Revenue Breakdown */}
              <div>
                <p className="text-sm font-semibold mb-3" style={{ fontFamily: "'Poppins', sans-serif", color: 'var(--text-1)' }}>
                  Revenue Breakdown
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { label: 'Student Premium', val: '₹42Cr', pct: 30, color: '#3B82F6' },
                    { label: 'Institution Plans', val: '₹78Cr', pct: 55, color: '#EF4444' },
                    { label: 'Recruiter Seats', val: '₹22Cr', pct: 15, color: '#10B981' },
                  ].map((r) => (
                    <div key={r.label} className="glass rounded-2xl p-5" style={{ border: '1px solid var(--border)' }}>
                      <p className="text-xs mb-1" style={{ fontFamily: "'Inter', sans-serif", color: 'var(--text-2)' }}>
                        {r.label}
                      </p>
                      <p className="text-2xl font-bold mb-3" style={{ color: r.color, fontFamily: "'Poppins', sans-serif" }}>
                        {r.val}
                      </p>
                      <div className="space-y-1">
                        <div className="flex justify-between">
                          <span className="text-xs" style={{ fontFamily: "'Inter', sans-serif", color: 'var(--text-3)' }}>
                            % of total ARR
                          </span>
                          <span className="text-xs font-medium" style={{ fontFamily: "'Inter', sans-serif", color: r.color }}>
                            {r.pct}%
                          </span>
                        </div>
                        <div className="h-1.5 rounded-full" style={{ background: 'var(--bg-surface-strong)' }}>
                          <div
                            className="h-1.5 rounded-full"
                            style={{ width: `${r.pct}%`, background: r.color }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── System ── */}
          {activeTab === 'system' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Service Health Grid */}
                <div className="glass rounded-2xl p-5" style={{ border: '1px solid var(--border)' }}>
                  <p className="text-sm font-semibold mb-4" style={{ fontFamily: "'Poppins', sans-serif", color: 'var(--text-1)' }}>
                    Service Health
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    {systemCards.map((svc) => (
                      <div
                        key={svc.name}
                        className="rounded-xl p-3"
                        style={{ background: 'var(--bg-surface-strong)', border: '1px solid var(--border)' }}
                      >
                        <div className="flex items-center gap-1.5 mb-2">
                          <span
                            className="w-2 h-2 rounded-full"
                            style={{ background: svc.status === 'ok' ? '#10B981' : '#F59E0B' }}
                          />
                          <span className="text-xs font-medium" style={{ fontFamily: "'Inter', sans-serif", color: 'var(--text-1)' }}>
                            {svc.name}
                          </span>
                        </div>
                        <p className="text-lg font-bold" style={{ color: svc.status === 'ok' ? '#10B981' : '#F59E0B', fontFamily: "'Poppins', sans-serif" }}>
                          {svc.uptime}
                        </p>
                        <div className="flex justify-between mt-1">
                          <span className="text-xs" style={{ fontFamily: "'Inter', sans-serif", color: 'var(--text-3)' }}>
                            {svc.latency}
                          </span>
                          <span className="text-xs" style={{ fontFamily: "'Inter', sans-serif", color: 'var(--text-3)' }}>
                            {svc.lastIncident}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Feature Flags */}
                <div className="glass rounded-2xl p-5" style={{ border: '1px solid var(--border)' }}>
                  <p className="text-sm font-semibold mb-4" style={{ fontFamily: "'Poppins', sans-serif", color: 'var(--text-1)' }}>
                    Feature Flags
                  </p>
                  <div className="space-y-3">
                    {featureFlags.map((ff) => (
                      <div key={ff.name} className="flex items-center justify-between">
                        <span className="text-xs" style={{ fontFamily: "'Inter', sans-serif", color: 'var(--text-1)' }}>
                          {ff.name}
                        </span>
                        {/* Pill Toggle (visual only) */}
                        <div
                          className="w-10 h-5 rounded-full relative transition-all"
                          style={{ background: ff.on ? '#10B981' : 'var(--bg-surface-strong)', border: ff.on ? 'none' : '1px solid var(--border)' }}
                        >
                          <div
                            className="absolute top-0.5 w-4 h-4 rounded-full transition-all duration-200"
                            style={{
                              background: ff.on ? '#fff' : 'var(--text-3)',
                              left: ff.on ? '22px' : '2px',
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Error Log */}
              <div className="glass rounded-2xl p-5" style={{ border: '1px solid var(--border)' }}>
                <p className="text-sm font-semibold mb-4" style={{ fontFamily: "'Poppins', sans-serif", color: 'var(--text-1)' }}>
                  Recent Error Log
                </p>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr>
                        {['Time', 'Service', 'Error', 'Severity', 'Status'].map((h) => (
                          <th
                            key={h}
                            className="text-left pb-3 pr-4"
                            style={{ fontFamily: "'Inter', sans-serif", color: 'var(--text-3)', fontWeight: 500 }}
                          >
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {errorLog.map((err, i) => {
                        const sb = severityBadge(err.severity)
                        const resolvedStyle = err.resolved
                          ? { bg: 'rgba(16,185,129,0.15)', color: '#10B981' }
                          : { bg: 'rgba(239,68,68,0.15)', color: '#EF4444' }
                        return (
                          <tr key={i} style={{ borderTop: '1px solid var(--border)' }}>
                            <td className="py-2.5 pr-4" style={{ fontFamily: "'Inter', sans-serif", color: 'var(--text-3)' }}>
                              {err.time}
                            </td>
                            <td className="py-2.5 pr-4" style={{ fontFamily: "'Inter', sans-serif", color: 'var(--text-2)' }}>
                              {err.service}
                            </td>
                            <td className="py-2.5 pr-4" style={{ fontFamily: "'Inter', sans-serif", color: 'var(--text-1)' }}>
                              {err.message}
                            </td>
                            <td className="py-2.5 pr-4">
                              <span
                                className="px-2 py-0.5 rounded-full capitalize"
                                style={{ background: sb.bg, color: sb.color, fontFamily: "'Inter', sans-serif" }}
                              >
                                {err.severity}
                              </span>
                            </td>
                            <td className="py-2.5">
                              <span
                                className="px-2 py-0.5 rounded-full"
                                style={{ background: resolvedStyle.bg, color: resolvedStyle.color, fontFamily: "'Inter', sans-serif" }}
                              >
                                {err.resolved ? 'Resolved' : 'Open'}
                              </span>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </AppShell>
  )
}
