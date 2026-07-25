import { useState } from 'react'
import { AppShell } from '../components/Layout'
import { useTheme } from '../context/ThemeContext'
import type { ThemeMode } from '../context/ThemeContext'
import { useRole } from '../context/RoleContext'
import ActivityHeatmap from '../components/ActivityHeatmap'

const stats = [
  { label: 'Career Score', val: '92', unit: '%', color: '#10B981' },
  { label: 'Day Streak', val: '14', unit: 'd', color: '#8B5CF6' },
  { label: 'Skills Mastered', val: '24', unit: '', color: '#06B6D4' },
  { label: 'Applications', val: '17', unit: '', color: '#F59E0B' },
  { label: 'Mock Interviews', val: '8', unit: '', color: '#34D399' },
  { label: 'Rank', val: '#42', unit: '', color: '#EC4899' },
]

const achievements = [
  { label: 'First Apply', icon: '🚀', earned: true },
  { label: 'Fast Learner', icon: '⚡', earned: true },
  { label: 'Interview Pro', icon: '🎯', earned: true },
  { label: 'Top 100', icon: '🏆', earned: true },
  { label: 'Streak 30', icon: '🔥', earned: false },
  { label: 'Perfect Score', icon: '💎', earned: false },
]

export default function ProfilePage() {
  const { mode, setMode } = useTheme()
  const { userProfile, updateUserProfile, initials } = useRole()
  const [editing, setEditing] = useState(false)
  const [activeTab, setActiveTab] = useState<'activity' | 'details' | 'links' | 'preferences'>('activity')

  // Editable local state
  const [formData, setFormData] = useState({ ...userProfile })

  const handleSave = () => {
    updateUserProfile(formData)
    setEditing(false)
  }

  // Calculate Profile Completion Score
  const fieldsToTrack = [
    formData.fullName,
    formData.email,
    formData.universityName,
    formData.universityEmail,
    formData.degree,
    formData.graduationYear,
    formData.cgpa,
    formData.githubUrl,
    formData.leetcodeUrl,
    formData.linkedinUrl,
  ]
  const completedFields = fieldsToTrack.filter(f => f && f.trim() !== '').length
  const completionPercentage = Math.round((completedFields / fieldsToTrack.length) * 100)

  const themeOptions: { value: ThemeMode; label: string; icon: string }[] = [
    { value: 'light', label: 'Light', icon: '☀️' },
    { value: 'dark', label: 'Dark', icon: '🌙' },
    { value: 'system', label: 'System', icon: '💻' },
  ]

  return (
    <AppShell>
      {/* Decorative gradient background blobs */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden>
        <div className="absolute -top-32 -left-32 w-150 h-150 rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(59,130,246,0.18) 0%, transparent 70%)', filter: 'blur(60px)' }} />
        <div className="absolute top-1/3 right-0 w-125 h-125 rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(16,185,129,0.15) 0%, transparent 70%)', filter: 'blur(60px)' }} />
      </div>

      <div className="min-h-screen px-4 md:px-6 py-8 relative z-10">
        <div className="max-w-6xl mx-auto">

          {/* Page header */}
          <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold" style={{ color: 'var(--text-1)', fontFamily: "'Poppins', sans-serif" }}>
                My <span className="gradient-text">Career Profile</span>
              </h1>
              <p className="text-sm mt-1" style={{ color: 'var(--text-2)', fontFamily: "'Inter', sans-serif" }}>
                Manage your university identity, coding handles (GitHub, LeetCode), and career preferences.
              </p>
            </div>

            {/* Profile completion badge */}
            <div className="flex items-center gap-3 glass-card px-4 py-2.5 rounded-2xl" style={{ border: '1px solid var(--border-accent)' }}>
              <div className="flex flex-col text-right">
                <span className="text-xs text-slate-400 font-medium">Profile Completion</span>
                <span className="text-sm font-bold text-emerald-400">{completionPercentage}% Completed</span>
              </div>
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 font-bold text-xs border border-emerald-500/30">
                {completionPercentage}%
              </div>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-6">
            {/* ── Left sidebar ── */}
            <div className="lg:w-80 shrink-0 flex flex-col gap-4">

              {/* Profile Card */}
              <div className="glass-card p-6 flex flex-col items-center text-center relative overflow-hidden">
                <div className="absolute inset-0 pointer-events-none"
                  style={{ background: 'radial-gradient(circle at 50% 0%, rgba(16,185,129,0.12) 0%, transparent 60%)' }} />

                {/* Avatar with dynamic initials */}
                <div className="relative mb-4">
                  <div className="w-24 h-24 rounded-2xl flex items-center justify-center text-3xl font-bold relative z-10 text-white shadow-2xl"
                    style={{
                      background: 'linear-gradient(135deg, #059669, #10B981, #3B82F6)',
                      boxShadow: '0 0 32px rgba(16,185,129,0.35)',
                      fontFamily: "'Poppins', sans-serif",
                    }}>
                    {initials}
                  </div>
                  {/* Online dot */}
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center z-20"
                    style={{ background: 'var(--bg-base)', border: '2px solid var(--bg-base)' }}>
                    <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse-glow" />
                  </div>
                </div>

                {editing ? (
                  <div className="w-full flex flex-col gap-2.5 mb-4 text-left">
                    <div>
                      <label className="text-[10px] text-slate-400">Full Name</label>
                      <input 
                        value={formData.fullName} 
                        onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                        className="w-full px-3 py-1.5 rounded-lg text-xs outline-none bg-slate-900 border border-slate-700 text-white" 
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-400">Target Role</label>
                      <input 
                        value={formData.targetRole} 
                        onChange={e => setFormData({ ...formData, targetRole: e.target.value })}
                        className="w-full px-3 py-1.5 rounded-lg text-xs outline-none bg-slate-900 border border-slate-700 text-emerald-400" 
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-400">University</label>
                      <input 
                        value={formData.universityName} 
                        onChange={e => setFormData({ ...formData, universityName: e.target.value })}
                        className="w-full px-3 py-1.5 rounded-lg text-xs outline-none bg-slate-900 border border-slate-700 text-white" 
                      />
                    </div>
                  </div>
                ) : (
                  <>
                    <p className="text-lg font-bold mb-0.5" style={{ color: 'var(--text-1)', fontFamily: "'Poppins', sans-serif" }}>
                      {userProfile.fullName || 'Arsh Chakraborty'}
                    </p>
                    <p className="text-xs font-semibold mb-1 text-emerald-400" style={{ fontFamily: "'Inter', sans-serif" }}>
                      {userProfile.targetRole || 'Full Stack & AI Engineer'}
                    </p>
                    <p className="text-xs mb-3 text-slate-400" style={{ fontFamily: "'Inter', sans-serif" }}>
                      🎓 {userProfile.universityName || 'IIT Delhi'} • {userProfile.degree || 'B.Tech CSE'} ({userProfile.graduationYear || '2026'})
                    </p>
                    <p className="text-xs leading-relaxed mb-4 text-slate-300" style={{ fontFamily: "'Inter', sans-serif" }}>
                      {userProfile.bio || 'Aspiring AI engineer passionate about building high-performance platforms.'}
                    </p>
                  </>
                )}

                {/* Quick Link Pills */}
                <div className="w-full flex flex-wrap items-center justify-center gap-1.5 mb-4">
                  {userProfile.githubUrl && (
                    <a href={userProfile.githubUrl} target="_blank" rel="noopener noreferrer"
                      className="px-2.5 py-1 rounded-lg text-[11px] font-medium bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors flex items-center gap-1">
                      <span>💻</span> GitHub
                    </a>
                  )}
                  {userProfile.leetcodeUrl && (
                    <a href={userProfile.leetcodeUrl} target="_blank" rel="noopener noreferrer"
                      className="px-2.5 py-1 rounded-lg text-[11px] font-medium bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 transition-colors flex items-center gap-1">
                      <span>⚡</span> LeetCode
                    </a>
                  )}
                  {userProfile.linkedinUrl && (
                    <a href={userProfile.linkedinUrl} target="_blank" rel="noopener noreferrer"
                      className="px-2.5 py-1 rounded-lg text-[11px] font-medium bg-blue-500/10 hover:bg-blue-500/20 text-blue-300 border border-blue-500/30 transition-colors flex items-center gap-1">
                      <span>in</span> LinkedIn
                    </a>
                  )}
                  {userProfile.portfolioUrl && (
                    <a href={userProfile.portfolioUrl} target="_blank" rel="noopener noreferrer"
                      className="px-2.5 py-1 rounded-lg text-[11px] font-medium bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 transition-colors flex items-center gap-1">
                      <span>🌐</span> Portfolio
                    </a>
                  )}
                </div>

                <button
                  onClick={() => editing ? handleSave() : setEditing(true)}
                  className="w-full py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 hover:scale-[1.02]"
                  style={{
                    background: editing ? 'linear-gradient(135deg, #059669, #10B981)' : 'var(--bg-surface)',
                    border: editing ? 'none' : '1px solid var(--border-accent)',
                    color: editing ? '#fff' : 'var(--text-1)',
                    fontFamily: "'Inter', sans-serif",
                  }}
                >
                  {editing ? '💾 Save Changes' : '✏️ Edit Profile Details'}
                </button>
              </div>

              {/* Stats grid */}
              <div className="glass-card p-4">
                <p className="text-xs font-semibold mb-3" style={{ color: 'var(--text-1)', fontFamily: "'Poppins', sans-serif" }}>Your Stats</p>
                <div className="grid grid-cols-2 gap-2">
                  {stats.map(s => (
                    <div key={s.label} className="rounded-xl p-3 text-center relative overflow-hidden"
                      style={{ background: `${s.color}0f`, border: `1px solid ${s.color}22` }}>
                      <p className="text-lg font-bold" style={{ color: s.color, fontFamily: "'Poppins', sans-serif" }}>
                        {s.val}<span className="text-sm">{s.unit}</span>
                      </p>
                      <p className="text-xs leading-tight mt-0.5" style={{ color: 'var(--text-2)', fontFamily: "'Inter', sans-serif" }}>{s.label}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Achievements */}
              <div className="glass-card p-4">
                <p className="text-xs font-semibold mb-3" style={{ color: 'var(--text-1)', fontFamily: "'Poppins', sans-serif" }}>Achievements</p>
                <div className="grid grid-cols-3 gap-2">
                  {achievements.map(a => (
                    <div key={a.label} className="flex flex-col items-center gap-1 p-2 rounded-lg"
                      style={{ opacity: a.earned ? 1 : 0.35 }}>
                      <span className="text-2xl">{a.icon}</span>
                      <p className="text-center" style={{ fontSize: '9px', color: 'var(--text-2)', fontFamily: "'Inter', sans-serif" }}>{a.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ── Main content ── */}
            <div className="flex-1 min-w-0 flex flex-col gap-4">

              {/* Tabs Bar */}
              <div className="flex gap-1 glass-card p-1 overflow-x-auto" style={{ borderRadius: '14px' }}>
                {[
                  { id: 'activity', label: '📊 Activity & Metrics' },
                  { id: 'details', label: '🎓 University & Academics' },
                  { id: 'links', label: '💻 Coding & Social Links' },
                  { id: 'preferences', label: '⚙️ Settings' },
                ].map(tab => (
                  <button 
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className="flex-1 min-w-30 py-2 rounded-xl text-xs font-medium transition-all duration-200"
                    style={{
                      background: activeTab === tab.id ? 'linear-gradient(135deg, #059669, #10B981)' : 'transparent',
                      color: activeTab === tab.id ? '#fff' : 'var(--text-2)',
                      fontFamily: "'Inter', sans-serif",
                    }}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Tab 1: Activity */}
              {activeTab === 'activity' && (
                <div className="glass-card p-6">
                  <div className="flex items-center justify-between mb-5">
                    <div>
                      <p className="text-sm font-semibold" style={{ color: 'var(--text-1)', fontFamily: "'Poppins', sans-serif" }}>Activity Heatmap</p>
                      <p className="text-xs mt-0.5" style={{ color: 'var(--text-2)', fontFamily: "'Inter', sans-serif" }}>Daily platform engagement over the past year</p>
                    </div>
                  </div>
                  <ActivityHeatmap label="activities" />
                </div>
              )}

              {/* Tab 2: University & Academic Details */}
              {activeTab === 'details' && (
                <div className="flex flex-col gap-4">
                  <div className="glass-card p-6">
                    <p className="text-sm font-semibold mb-4" style={{ color: 'var(--text-1)', fontFamily: "'Poppins', sans-serif" }}>Academic & Institutional Credentials</p>
                    <div className="flex flex-col gap-4">
                      {[
                        { label: 'Full Name', val: userProfile.fullName || 'Arsh Chakraborty', icon: '👤', key: 'fullName' },
                        { label: 'Personal Email', val: userProfile.email || 'chakrabortyarsh3@gmail.com', icon: '✉', key: 'email' },
                        { label: 'University / College', val: userProfile.universityName || 'IIT Delhi', icon: '🏫', key: 'universityName' },
                        { label: 'University Official Email', val: userProfile.universityEmail || 'arsh@iitd.ac.in', icon: '🎓', key: 'universityEmail' },
                        { label: 'Degree & Branch', val: userProfile.degree || 'B.Tech CSE (AI)', icon: '📜', key: 'degree' },
                        { label: 'Graduation Year', val: userProfile.graduationYear || '2026', icon: '📅', key: 'graduationYear' },
                        { label: 'Current CGPA / GPA', val: userProfile.cgpa || '8.9 / 10', icon: '⭐', key: 'cgpa' },
                        { label: 'Phone Number', val: userProfile.phone || '+91 8269766043', icon: '📞', key: 'phone' },
                      ].map(item => (
                        <div key={item.label} className="flex items-center justify-between py-3 border-b last:border-0"
                          style={{ borderColor: 'var(--border)' }}>
                          <div className="flex items-center gap-3">
                            <span className="text-base w-8 text-center">{item.icon}</span>
                            <p className="text-xs text-slate-400" style={{ fontFamily: "'Inter', sans-serif" }}>{item.label}</p>
                          </div>
                          <p className="text-xs font-semibold text-emerald-400" style={{ fontFamily: "'Inter', sans-serif" }}>{item.val}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 3: Coding & Social Links */}
              {activeTab === 'links' && (
                <div className="glass-card p-6 flex flex-col gap-5">
                  <div>
                    <h3 className="text-sm font-semibold" style={{ color: 'var(--text-1)', fontFamily: "'Poppins', sans-serif" }}>Coding Profiles & Portfolio Links</h3>
                    <p className="text-xs text-slate-400 mt-0.5">These links are used by recruiters and NEXUS job match algorithm to verify your skills.</p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">GitHub Profile URL</label>
                      <input 
                        type="url"
                        value={formData.githubUrl}
                        onChange={e => setFormData({ ...formData, githubUrl: e.target.value })}
                        placeholder="https://github.com/Arsh1233"
                        className="w-full px-3.5 py-2 rounded-xl text-xs bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">LeetCode Profile / Username</label>
                      <input 
                        type="text"
                        value={formData.leetcodeUrl}
                        onChange={e => setFormData({ ...formData, leetcodeUrl: e.target.value })}
                        placeholder="https://leetcode.com/Arsh1233"
                        className="w-full px-3.5 py-2 rounded-xl text-xs bg-slate-900 border border-slate-800 text-amber-300 focus:outline-none focus:border-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">LinkedIn Profile URL</label>
                      <input 
                        type="url"
                        value={formData.linkedinUrl}
                        onChange={e => setFormData({ ...formData, linkedinUrl: e.target.value })}
                        placeholder="https://linkedin.com/in/arsh1233"
                        className="w-full px-3.5 py-2 rounded-xl text-xs bg-slate-900 border border-slate-800 text-blue-300 focus:outline-none focus:border-emerald-500"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1">Codeforces / CodeChef Handle</label>
                        <input 
                          type="text"
                          value={formData.codeforcesHandle}
                          onChange={e => setFormData({ ...formData, codeforcesHandle: e.target.value })}
                          placeholder="arsh_master"
                          className="w-full px-3.5 py-2 rounded-xl text-xs bg-slate-900 border border-slate-800 text-purple-300 focus:outline-none focus:border-emerald-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1">Personal Portfolio URL</label>
                        <input 
                          type="url"
                          value={formData.portfolioUrl}
                          onChange={e => setFormData({ ...formData, portfolioUrl: e.target.value })}
                          placeholder="https://arsh-portfolio.dev"
                          className="w-full px-3.5 py-2 rounded-xl text-xs bg-slate-900 border border-slate-800 text-emerald-300 focus:outline-none focus:border-emerald-500"
                        />
                      </div>
                    </div>

                    <button
                      onClick={handleSave}
                      className="px-6 py-2.5 rounded-xl text-xs font-semibold text-white transition-all hover:scale-[1.02]"
                      style={{ background: 'linear-gradient(135deg, #059669, #10B981)', boxShadow: '0 0 20px rgba(16,185,129,0.3)' }}
                    >
                      💾 Update Links & Profiles
                    </button>
                  </div>
                </div>
              )}

              {/* Tab 4: Preferences */}
              {activeTab === 'preferences' && (
                <div className="flex flex-col gap-4">
                  {/* Theme */}
                  <div className="glass-card p-6">
                    <p className="text-sm font-semibold mb-1" style={{ color: 'var(--text-1)', fontFamily: "'Poppins', sans-serif" }}>Appearance</p>
                    <p className="text-xs mb-5" style={{ color: 'var(--text-2)', fontFamily: "'Inter', sans-serif" }}>
                      Choose your preferred color theme. "System" follows your OS setting.
                    </p>
                    <div className="grid grid-cols-3 gap-3">
                      {themeOptions.map(opt => (
                        <button key={opt.value}
                          onClick={() => setMode(opt.value)}
                          className="flex flex-col items-center gap-2 py-4 rounded-2xl border-2 transition-all duration-200"
                          style={{
                            borderColor: mode === opt.value ? '#10B981' : 'var(--border)',
                            background: mode === opt.value ? 'rgba(16,185,129,0.08)' : 'var(--bg-surface)',
                          }}>
                          <span className="text-2xl">{opt.icon}</span>
                          <p className="text-xs font-medium" style={{
                            color: mode === opt.value ? '#10B981' : 'var(--text-1)',
                            fontFamily: "'Inter', sans-serif",
                          }}>{opt.label}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  )
}
