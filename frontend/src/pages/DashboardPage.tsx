import { Link } from 'react-router-dom'
import { AppShell } from '../components/Layout'
import { useRole } from '../context/RoleContext'

const weeklyGoals = [
  { label: 'Complete 3 DSA problems', done: true },
  { label: 'Finish ML Foundations module', done: true },
  { label: 'Mock interview with ECHO', done: false },
  { label: 'Apply to 5 internships', done: false },
]

const internships = [
  { company: 'Anthropic', role: 'AI Safety Intern', match: 94, salary: '₹2.5L/mo', color: '#3B82F6' },
  { company: 'Google DeepMind', role: 'Research Intern', match: 88, salary: '₹3.2L/mo', color: '#8B5CF6' },
  { company: 'Microsoft', role: 'ML Engineer Intern', match: 82, salary: '₹1.8L/mo', color: '#06B6D4' },
]

const timeline = [
  { event: 'Completed System Design module', time: 'Today', icon: '✓', color: '#34D399' },
  { event: 'Mock Interview with ECHO — 91% confidence', time: 'Yesterday', icon: '🎯', color: '#3B82F6' },
  { event: 'Resume score improved: 72% → 91%', time: '2 days ago', icon: '↑', color: '#8B5CF6' },
  { event: 'Joined CareerOS', time: '3 months ago', icon: '★', color: '#F59E0B' },
]

export default function DashboardPage() {
  const { userProfile } = useRole()

  const now = new Date()
  const formattedDate = now.toLocaleDateString('en-US', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
  const hour = now.getHours()
  const greeting = hour < 12 ? 'Good Morning' : hour < 17 ? 'Good Afternoon' : 'Good Evening'
  const firstName = userProfile?.fullName ? userProfile.fullName.trim().split(' ')[0] : 'User'

  return (
    <AppShell>
      <div className="min-h-screen px-4 md:px-6 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header row */}
          <div className="flex items-start justify-between mb-8">
            <div>
              <p className="text-xs text-slate-500 mb-1" style={{ fontFamily: "'Inter', sans-serif" }}>
                {formattedDate}
              </p>
              <h1 className="text-2xl md:text-3xl font-bold text-white" style={{ fontFamily: "'Poppins', sans-serif" }}>
                {greeting}, <span className="gradient-text">{firstName}</span>
              </h1>
              <p className="text-slate-400 text-sm mt-1" style={{ fontFamily: "'Inter', sans-serif" }}>
                Your AI team has been working — 3 updates since you last visited.
              </p>
            </div>
          </div>

          {/* KPI row */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {[
              { label: 'Career Readiness', val: '87%', sub: '+3% this week', color: '#3B82F6', bar: 87 },
              { label: 'Placement Prob.', val: '78%', sub: 'AI Engineer', color: '#8B5CF6', bar: 78 },
              { label: 'Skills Mastered', val: '24/40', sub: '8 in progress', color: '#06B6D4', bar: 60 },
              { label: 'Applications Sent', val: '17', sub: '3 interviews', color: '#F59E0B', bar: 45 },
            ].map((kpi) => (
              <div key={kpi.label} className="glass rounded-2xl p-4" style={{ border: '1px solid var(--border)' }}>
                <p className="text-xs text-slate-400 mb-2" style={{ fontFamily: "'Inter', sans-serif" }}>{kpi.label}</p>
                <p className="text-2xl font-bold mb-1" style={{ color: kpi.color, fontFamily: "'Poppins', sans-serif" }}>
                  {kpi.val}
                </p>
                <p className="text-xs text-slate-500 mb-3" style={{ fontFamily: "'Inter', sans-serif" }}>{kpi.sub}</p>
                <div className="w-full h-1 rounded-full" style={{ background: 'var(--bg-surface-strong)' }}>
                  <div className="h-full rounded-full transition-all duration-1000"
                    style={{ width: `${kpi.bar}%`, background: kpi.color, boxShadow: `0 0 6px ${kpi.color}60` }} />
                </div>
              </div>
            ))}
          </div>

          {/* AI prediction banner */}
          <div className="rounded-2xl p-4 mb-6 relative overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, rgba(59,130,246,0.1), rgba(139,92,246,0.1))',
              border: '1px solid rgba(139,92,246,0.25)',
            }}
          >
            <div className="absolute inset-0 pointer-events-none"
              style={{ background: 'radial-gradient(circle at 80% 50%, rgba(139,92,246,0.08) 0%, transparent 60%)' }} />
            <div className="relative z-10 flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: 'rgba(139,92,246,0.25)', border: '1px solid rgba(139,92,246,0.3)' }}>
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <circle cx="9" cy="9" r="7" stroke="#8B5CF6" strokeWidth="1.5" />
                  <path d="M9 5v4l2.5 2.5" stroke="#8B5CF6" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-xs text-purple-300 font-semibold mb-0.5" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  ARIA Prediction Update
                </p>
                <p className="text-sm text-slate-300 leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>
                  You have a{' '}
                  <span className="text-white font-semibold">78% probability</span> of becoming an{' '}
                  <span className="text-blue-300 font-semibold">AI Engineer</span>{' '}
                  within <span className="text-purple-300 font-semibold">14 months</span>.
                  Complete 2 more modules to push this to 85%.
                </p>
              </div>
              <Link to="/career-twin"
                className="text-xs px-4 py-2 rounded-lg text-white shrink-0 hidden md:block transition-all hover:scale-105"
                style={{ background: 'linear-gradient(135deg, #3B82F6, #8B5CF6)', fontFamily: "'Inter', sans-serif" }}>
                View Career Twin
              </Link>
            </div>
          </div>

          {/* Main 3-col grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* Weekly goals */}
            <div className="glass rounded-2xl p-5" style={{ border: '1px solid var(--border)' }}>
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm font-semibold text-white" style={{ fontFamily: "'Poppins', sans-serif" }}>Weekly Goals</p>
                <span className="text-xs text-blue-400" style={{ fontFamily: "'Inter', sans-serif" }}>
                  {weeklyGoals.filter((g) => g.done).length}/{weeklyGoals.length} done
                </span>
              </div>
              <div className="flex flex-col gap-3">
                {weeklyGoals.map((goal, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div
                      className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                      style={{
                        background: goal.done ? 'rgba(52,211,153,0.2)' : 'var(--bg-surface)',
                        border: `1px solid ${goal.done ? 'rgba(52,211,153,0.4)' : 'var(--border-accent)'}`,
                      }}
                    >
                      {goal.done && (
                        <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                          <path d="M2 5l2.5 2.5L8 3" stroke="#34D399" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </div>
                    <span
                      className="text-xs"
                      style={{
                        color: goal.done ? 'var(--text-3)' : 'var(--text-1)',
                        textDecoration: goal.done ? 'line-through' : 'none',
                        fontFamily: "'Inter', sans-serif",
                      }}
                    >
                      {goal.label}
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-4 w-full h-1.5 rounded-full" style={{ background: 'var(--bg-surface-strong)' }}>
                <div className="h-full rounded-full"
                  style={{ width: '50%', background: 'linear-gradient(90deg, #3B82F6, #8B5CF6)' }} />
              </div>
            </div>

            {/* Internship recommendations */}
            <div className="glass rounded-2xl p-5" style={{ border: '1px solid var(--border)' }}>
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm font-semibold text-white" style={{ fontFamily: "'Poppins', sans-serif" }}>Top Matches</p>
                <Link to="/jobs" className="text-xs text-blue-400 hover:text-blue-300 transition-colors" style={{ fontFamily: "'Inter', sans-serif" }}>
                  View all
                </Link>
              </div>
              <div className="flex flex-col gap-3">
                {internships.map((job) => (
                  <div key={job.company} className="rounded-xl p-3 hover:bg-white/5 transition-colors cursor-pointer"
                    style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold"
                          style={{ background: `${job.color}20`, color: job.color, fontFamily: "'Poppins', sans-serif" }}>
                          {job.company[0]}
                        </div>
                        <div>
                          <p className="text-xs text-white font-medium" style={{ fontFamily: "'Inter', sans-serif" }}>{job.company}</p>
                          <p className="text-xs text-slate-500" style={{ fontFamily: "'Inter', sans-serif" }}>{job.role}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-bold" style={{ color: job.color, fontFamily: "'Poppins', sans-serif" }}>{job.match}%</p>
                        <p className="text-xs text-slate-500" style={{ fontFamily: "'Inter', sans-serif" }}>{job.salary}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Activity timeline */}
            <div className="glass rounded-2xl p-5" style={{ border: '1px solid var(--border)' }}>
              <p className="text-sm font-semibold text-white mb-4" style={{ fontFamily: "'Poppins', sans-serif" }}>Activity Timeline</p>
              <div className="flex flex-col gap-4 relative">
                <div className="absolute left-3.5 top-6 bottom-0 w-px" style={{ background: 'var(--border)' }} />
                {timeline.map((item, i) => (
                  <div key={i} className="flex gap-3">
                    <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs shrink-0 relative z-10"
                      style={{ background: `${item.color}20`, border: `1px solid ${item.color}40`, color: item.color }}>
                      {item.icon}
                    </div>
                    <div className="flex-1 pt-1">
                      <p className="text-xs text-slate-300 leading-snug" style={{ fontFamily: "'Inter', sans-serif" }}>{item.event}</p>
                      <p className="text-xs text-slate-600 mt-0.5" style={{ fontFamily: "'Inter', sans-serif" }}>{item.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick nav row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-5">
            {[
              { label: 'Career Twin', sub: 'View your digital self', to: '/career-twin', color: '#3B82F6' },
              { label: 'AI Mentor', sub: 'Chat with ARIA', to: '/mentor', color: '#8B5CF6' },
              { label: 'Mock Interview', sub: 'Practice with ECHO', to: '/interview', color: '#06B6D4' },
              { label: 'Skill Gap', sub: 'Analyze your skills', to: '/skills', color: '#F59E0B' },
            ].map((card) => (
              <Link key={card.to} to={card.to}
                className="glass rounded-xl p-4 hover:scale-[1.02] transition-all duration-200 cursor-pointer block"
                style={{ border: `1px solid ${card.color}20` }}>
                <p className="text-sm font-semibold text-white mb-0.5" style={{ fontFamily: "'Poppins', sans-serif" }}>{card.label}</p>
                <p className="text-xs text-slate-500" style={{ fontFamily: "'Inter', sans-serif" }}>{card.sub}</p>
                <div className="mt-3 flex items-center gap-1 text-xs" style={{ color: card.color, fontFamily: "'Inter', sans-serif" }}>
                  Open <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2.5 6h7M7 3.5l2.5 2.5L7 8.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  )
}
