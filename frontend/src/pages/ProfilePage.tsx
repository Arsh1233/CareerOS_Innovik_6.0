import { useState } from 'react'
import { AppShell } from '../components/Layout'
import { useTheme } from '../context/ThemeContext'
import type { ThemeMode } from '../context/ThemeContext'
import ActivityHeatmap from '../components/ActivityHeatmap'

const stats = [
  { label: 'Career Score', val: '87', unit: '%', color: '#3B82F6' },
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
  { label: 'Top 100', icon: '🏆', earned: false },
  { label: 'Streak 30', icon: '🔥', earned: false },
  { label: 'Perfect Score', icon: '💎', earned: false },
]

export default function ProfilePage() {
  const { mode, setMode } = useTheme()
  const [editing, setEditing] = useState(false)
  const [name, setName] = useState('Rahul Sharma')
  const [title, setTitle] = useState('B.Tech CSE (AI) — 3rd Year, IIT Delhi')
  const [bio, setBio] = useState('Aspiring AI engineer passionate about LLMs and distributed systems. Building the future, one model at a time.')
  const [activeTab, setActiveTab] = useState<'activity' | 'details' | 'preferences'>('activity')

  const themeOptions: { value: ThemeMode; label: string; icon: string }[] = [
    { value: 'light', label: 'Light', icon: '☀️' },
    { value: 'dark', label: 'Dark', icon: '🌙' },
    { value: 'system', label: 'System', icon: '💻' },
  ]

  return (
    <AppShell>
      {/* Decorative gradient blobs — give glass something to blur against */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden>
        <div className="absolute -top-32 -left-32 w-[600px] h-[600px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(59,130,246,0.18) 0%, transparent 70%)', filter: 'blur(60px)' }} />
        <div className="absolute top-1/3 right-0 w-[500px] h-[500px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.15) 0%, transparent 70%)', filter: 'blur(60px)' }} />
        <div className="absolute bottom-0 left-1/3 w-[400px] h-[400px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(6,182,212,0.12) 0%, transparent 70%)', filter: 'blur(60px)' }} />
      </div>

      <div className="min-h-screen px-4 md:px-6 py-8 relative z-10">
        <div className="max-w-6xl mx-auto">

          {/* Page header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold" style={{ color: 'var(--text-1)', fontFamily: "'Poppins', sans-serif" }}>
              My <span className="gradient-text">Profile</span>
            </h1>
            <p className="text-sm mt-1" style={{ color: 'var(--text-2)', fontFamily: "'Inter', sans-serif" }}>
              Your career identity and activity overview.
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-6">
            {/* ── Left sidebar ── */}
            <div className="lg:w-72 flex-shrink-0 flex flex-col gap-4">

              {/* Profile card — glassmorphism showcase */}
              <div className="glass-card p-6 flex flex-col items-center text-center relative overflow-hidden">
                {/* Card inner glow */}
                <div className="absolute inset-0 pointer-events-none"
                  style={{ background: 'radial-gradient(circle at 50% 0%, rgba(139,92,246,0.12) 0%, transparent 60%)' }} />

                {/* Avatar */}
                <div className="relative mb-4">
                  <div className="w-24 h-24 rounded-2xl flex items-center justify-center text-3xl font-bold relative z-10"
                    style={{
                      background: 'linear-gradient(135deg, #3B82F6, #8B5CF6)',
                      boxShadow: '0 0 32px rgba(139,92,246,0.35)',
                      fontFamily: "'Poppins', sans-serif",
                      color: '#fff',
                    }}>
                    RS
                  </div>
                  {/* Online dot */}
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center z-20"
                    style={{ background: 'var(--bg-base)', border: '2px solid var(--bg-base)' }}>
                    <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse-glow" />
                  </div>
                  {/* Upload overlay */}
                  <button className="absolute inset-0 rounded-2xl opacity-0 hover:opacity-100 flex items-center justify-center transition-opacity z-10"
                    style={{ background: 'rgba(0,0,0,0.5)' }}>
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="white" strokeWidth="1.5">
                      <path d="M3 12v3h12v-3M9 3v9M6 6l3-3 3 3" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                </div>

                {editing ? (
                  <div className="w-full flex flex-col gap-2 mb-4">
                    <input value={name} onChange={e => setName(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg text-sm text-center outline-none"
                      style={{ background: 'var(--input-bg)', border: '1px solid var(--input-border)', color: 'var(--text-1)', fontFamily: "'Poppins', sans-serif" }} />
                    <input value={title} onChange={e => setTitle(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg text-xs text-center outline-none"
                      style={{ background: 'var(--input-bg)', border: '1px solid var(--input-border)', color: 'var(--text-2)', fontFamily: "'Inter', sans-serif" }} />
                    <textarea value={bio} onChange={e => setBio(e.target.value)} rows={3}
                      className="w-full px-3 py-1.5 rounded-lg text-xs text-center outline-none resize-none"
                      style={{ background: 'var(--input-bg)', border: '1px solid var(--input-border)', color: 'var(--text-2)', fontFamily: "'Inter', sans-serif" }} />
                  </div>
                ) : (
                  <>
                    <p className="text-base font-bold mb-0.5" style={{ color: 'var(--text-1)', fontFamily: "'Poppins', sans-serif" }}>{name}</p>
                    <p className="text-xs mb-3" style={{ color: '#3B82F6', fontFamily: "'Inter', sans-serif" }}>{title}</p>
                    <p className="text-xs leading-relaxed mb-4" style={{ color: 'var(--text-2)', fontFamily: "'Inter', sans-serif" }}>{bio}</p>
                  </>
                )}

                <button
                  onClick={() => setEditing(!editing)}
                  className="w-full py-2 rounded-xl text-xs font-medium transition-all duration-200 hover:scale-[1.02]"
                  style={{
                    background: editing ? 'linear-gradient(135deg, #3B82F6, #8B5CF6)' : 'var(--bg-surface)',
                    border: editing ? 'none' : '1px solid var(--border-accent)',
                    color: editing ? '#fff' : 'var(--text-1)',
                    fontFamily: "'Inter', sans-serif",
                  }}
                >
                  {editing ? 'Save Profile' : 'Edit Profile'}
                </button>
              </div>

              {/* Stats grid — glass-card treatment */}
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

              {/* Tabs */}
              <div className="flex gap-1 glass-card p-1" style={{ borderRadius: '14px' }}>
                {(['activity', 'details', 'preferences'] as const).map(tab => (
                  <button key={tab}
                    onClick={() => setActiveTab(tab)}
                    className="flex-1 py-2 rounded-xl text-xs font-medium transition-all duration-200 capitalize"
                    style={{
                      background: activeTab === tab ? 'linear-gradient(135deg, #3B82F6, #8B5CF6)' : 'transparent',
                      color: activeTab === tab ? '#fff' : 'var(--text-2)',
                      fontFamily: "'Inter', sans-serif",
                    }}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Tab: Activity */}
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

              {/* Tab: Details */}
              {activeTab === 'details' && (
                <div className="flex flex-col gap-4">
                  <div className="glass-card p-6">
                    <p className="text-sm font-semibold mb-4" style={{ color: 'var(--text-1)', fontFamily: "'Poppins', sans-serif" }}>Account Information</p>
                    <div className="flex flex-col gap-4">
                      {[
                        { label: 'Email', val: 'rahul.sharma@iit.ac.in', icon: '✉' },
                        { label: 'Institution', val: 'IIT Delhi', icon: '🏫' },
                        { label: 'Degree', val: 'B.Tech CSE (AI/ML)', icon: '🎓' },
                        { label: 'Graduation', val: 'May 2026', icon: '📅' },
                        { label: 'Member Since', val: 'October 2024', icon: '⭐' },
                      ].map(item => (
                        <div key={item.label} className="flex items-center justify-between py-3 border-b last:border-0"
                          style={{ borderColor: 'var(--border)' }}>
                          <div className="flex items-center gap-3">
                            <span className="text-base w-8 text-center">{item.icon}</span>
                            <p className="text-sm" style={{ color: 'var(--text-2)', fontFamily: "'Inter', sans-serif" }}>{item.label}</p>
                          </div>
                          <p className="text-sm font-medium" style={{ color: 'var(--text-1)', fontFamily: "'Inter', sans-serif" }}>{item.val}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="glass-card p-6">
                    <p className="text-sm font-semibold mb-4" style={{ color: 'var(--text-1)', fontFamily: "'Poppins', sans-serif" }}>Danger Zone</p>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <button className="flex-1 py-2.5 rounded-xl text-sm border transition-colors hover:bg-red-500/10"
                        style={{ borderColor: 'rgba(239,68,68,0.3)', color: '#EF4444', fontFamily: "'Inter', sans-serif" }}>
                        Delete Account
                      </button>
                      <button className="flex-1 py-2.5 rounded-xl text-sm border transition-colors"
                        style={{ borderColor: 'var(--border-accent)', color: 'var(--text-2)', fontFamily: "'Inter', sans-serif" }}>
                        Export Data
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab: Preferences */}
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
                            borderColor: mode === opt.value ? '#3B82F6' : 'var(--border)',
                            background: mode === opt.value ? 'rgba(59,130,246,0.08)' : 'var(--bg-surface)',
                          }}>
                          <span className="text-2xl">{opt.icon}</span>
                          <p className="text-xs font-medium" style={{
                            color: mode === opt.value ? '#3B82F6' : 'var(--text-1)',
                            fontFamily: "'Inter', sans-serif",
                          }}>{opt.label}</p>
                          {mode === opt.value && (
                            <div className="w-4 h-4 rounded-full flex items-center justify-center"
                              style={{ background: '#3B82F6' }}>
                              <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                                <path d="M1.5 4l1.5 1.5 3.5-3.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Notifications */}
                  <div className="glass-card p-6">
                    <p className="text-sm font-semibold mb-4" style={{ color: 'var(--text-1)', fontFamily: "'Poppins', sans-serif" }}>Notifications</p>
                    <div className="flex flex-col gap-4">
                      {[
                        { label: 'Job match alerts', desc: 'When NEXUS finds a new high-match opportunity', on: true },
                        { label: 'Interview reminders', desc: '24h and 1h before scheduled mock sessions', on: true },
                        { label: 'Career roadmap updates', desc: 'When ARIA revises your learning path', on: false },
                        { label: 'Skill milestones', desc: 'Celebrate when you level up a skill', on: true },
                        { label: 'Weekly digest', desc: 'Summary of your week in career progress', on: false },
                      ].map((pref, i) => (
                        <div key={i} className="flex items-center justify-between">
                          <div>
                            <p className="text-sm" style={{ color: 'var(--text-1)', fontFamily: "'Inter', sans-serif" }}>{pref.label}</p>
                            <p className="text-xs mt-0.5" style={{ color: 'var(--text-3)', fontFamily: "'Inter', sans-serif" }}>{pref.desc}</p>
                          </div>
                          <div className="relative ml-4 flex-shrink-0">
                            <div className="w-10 h-5 rounded-full transition-colors duration-200 cursor-pointer"
                              style={{ background: pref.on ? '#3B82F6' : 'var(--bg-surface-strong)', border: '1px solid var(--border-accent)' }}>
                              <div className="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200"
                                style={{ transform: pref.on ? 'translateX(21px)' : 'translateX(2px)' }} />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* AI Agents */}
                  <div className="glass-card p-6">
                    <p className="text-sm font-semibold mb-1" style={{ color: 'var(--text-1)', fontFamily: "'Poppins', sans-serif" }}>AI Agent Settings</p>
                    <p className="text-xs mb-4" style={{ color: 'var(--text-2)', fontFamily: "'Inter', sans-serif" }}>Control how your AI agents interact with you.</p>
                    <div className="flex flex-col gap-3">
                      {[
                        { label: 'ARIA proactive suggestions', desc: 'Allow ARIA to proactively surface insights', on: true },
                        { label: 'ECHO auto-scheduling', desc: 'Let ECHO suggest interview slots automatically', on: false },
                        { label: 'Resume auto-update', desc: 'Automatically refresh resume analysis on new skills', on: true },
                      ].map((s, i) => (
                        <div key={i} className="flex items-center justify-between p-3 rounded-xl"
                          style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
                          <div>
                            <p className="text-xs font-medium" style={{ color: 'var(--text-1)', fontFamily: "'Inter', sans-serif" }}>{s.label}</p>
                            <p className="text-xs mt-0.5" style={{ color: 'var(--text-3)', fontFamily: "'Inter', sans-serif" }}>{s.desc}</p>
                          </div>
                          <div className="w-8 h-4 rounded-full ml-4 flex-shrink-0 relative cursor-pointer"
                            style={{ background: s.on ? '#8B5CF6' : 'var(--bg-surface-strong)', border: '1px solid var(--border-accent)' }}>
                            <div className="absolute top-0.5 w-3 h-3 rounded-full bg-white shadow transition-transform duration-200"
                              style={{ transform: s.on ? 'translateX(17px)' : 'translateX(2px)' }} />
                          </div>
                        </div>
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
