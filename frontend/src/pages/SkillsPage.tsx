import { AppShell } from '../components/Layout'

const currentSkills = [
  { name: 'Python', score: 88 },
  { name: 'Machine Learning', score: 74 },
  { name: 'Deep Learning', score: 65 },
  { name: 'SQL', score: 80 },
  { name: 'React', score: 70 },
  { name: 'System Design', score: 58 },
  { name: 'MLOps', score: 40 },
  { name: 'LLM Engineering', score: 55 },
]

const requiredSkills = [
  { name: 'Python', score: 90 },
  { name: 'Machine Learning', score: 85 },
  { name: 'Deep Learning', score: 80 },
  { name: 'SQL', score: 70 },
  { name: 'React', score: 50 },
  { name: 'System Design', score: 85 },
  { name: 'MLOps', score: 80 },
  { name: 'LLM Engineering', score: 90 },
]

const courses = [
  { title: 'MLOps Specialization', provider: 'Coursera', time: '6 weeks', match: 96, color: '#3B82F6' },
  { title: 'LLM Engineering with LangChain', provider: 'DeepLearning.AI', time: '4 weeks', match: 94, color: '#8B5CF6' },
  { title: 'System Design for ML', provider: 'Educative', time: '5 weeks', match: 89, color: '#06B6D4' },
  { title: 'Distributed Systems Fundamentals', provider: 'MIT OpenCourseWare', time: '8 weeks', match: 82, color: '#F59E0B' },
]

function RadarChart() {
  const cx = 120, cy = 120, r = 90
  const labels = currentSkills.slice(0, 8)
  const n = labels.length

  const toPoint = (angle: number, radius: number) => {
    const rad = (angle - 90) * (Math.PI / 180)
    return { x: cx + radius * Math.cos(rad), y: cy + radius * Math.sin(rad) }
  }

  const gridLevels = [0.25, 0.5, 0.75, 1.0]

  const currentPath = labels.map((s, i) => {
    const angle = (360 / n) * i
    const p = toPoint(angle, (s.score / 100) * r)
    return `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`
  }).join(' ') + ' Z'

  const requiredPath = requiredSkills.slice(0, 8).map((s, i) => {
    const angle = (360 / n) * i
    const p = toPoint(angle, (s.score / 100) * r)
    return `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`
  }).join(' ') + ' Z'

  return (
    <svg viewBox="0 0 240 240" className="w-full max-w-xs mx-auto">
      <defs>
        <linearGradient id="radarCurrent" x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#3B82F6" stopOpacity="0.5"/>
          <stop offset="1" stopColor="#8B5CF6" stopOpacity="0.3"/>
        </linearGradient>
        <linearGradient id="radarRequired" x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#06B6D4" stopOpacity="0.15"/>
          <stop offset="1" stopColor="#06B6D4" stopOpacity="0.05"/>
        </linearGradient>
      </defs>

      {/* Grid circles */}
      {gridLevels.map((level) => (
        <polygon key={level}
          points={labels.map((_, i) => {
            const p = toPoint((360 / n) * i, level * r)
            return `${p.x},${p.y}`
          }).join(' ')}
          fill="none"
          stroke="var(--border)"
          strokeWidth="1"
        />
      ))}

      {/* Axis lines */}
      {labels.map((_, i) => {
        const end = toPoint((360 / n) * i, r)
        return <line key={i} x1={cx} y1={cy} x2={end.x} y2={end.y} stroke="var(--border)" strokeWidth="1"/>
      })}

      {/* Required area */}
      <path d={requiredPath} fill="url(#radarRequired)" stroke="#06B6D4" strokeWidth="1.5" strokeDasharray="4 2" opacity="0.7"/>

      {/* Current area */}
      <path d={currentPath} fill="url(#radarCurrent)" stroke="#3B82F6" strokeWidth="2"/>

      {/* Dots */}
      {labels.map((s, i) => {
        const p = toPoint((360 / n) * i, (s.score / 100) * r)
        return <circle key={i} cx={p.x} cy={p.y} r="4" fill="#3B82F6" stroke="var(--bg-base)" strokeWidth="1.5"
          style={{ filter: 'drop-shadow(0 0 4px #3B82F6)' }}/>
      })}

      {/* Labels */}
      {labels.map((s, i) => {
        const p = toPoint((360 / n) * i, r + 18)
        return (
          <text key={i} x={p.x} y={p.y} textAnchor="middle" dominantBaseline="middle"
            fill="rgba(148,163,184,0.8)" fontSize="9" fontFamily="Inter, sans-serif">
            {s.name}
          </text>
        )
      })}
    </svg>
  )
}

export default function SkillsPage() {
  return (
    <AppShell>
      <div className="min-h-screen px-4 md:px-6 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 glass rounded-full px-3 py-1 mb-3 text-xs text-yellow-400 border border-yellow-500/20"
              style={{ fontFamily: "'Inter', sans-serif" }}>
              <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 animate-pulse-glow" />
              AI Skill Analysis
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
              Skill <span className="gradient-text">Gap Analysis</span>
            </h1>
            <p className="text-slate-400 text-sm" style={{ fontFamily: "'Inter', sans-serif" }}>
              Compare your current skills against what AI Engineer roles require.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* Radar + match score */}
            <div className="lg:col-span-5 flex flex-col gap-5">
              <div className="glass rounded-2xl p-6" style={{ border: '1px solid var(--border)' }}>
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm font-semibold text-white" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    Skill Radar
                  </p>
                  <div className="flex items-center gap-4 text-xs" style={{ fontFamily: "'Inter', sans-serif" }}>
                    <div className="flex items-center gap-1.5">
                      <div className="w-3 h-0.5 rounded bg-blue-500" />
                      <span className="text-slate-400">Current</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-3 h-0.5 rounded" style={{ background: '#06B6D4', opacity: 0.6 }} />
                      <span className="text-slate-400">Required</span>
                    </div>
                  </div>
                </div>
                <RadarChart />
              </div>

              {/* Overall match */}
              <div className="glass rounded-2xl p-6 text-center" style={{ border: '1px solid rgba(59,130,246,0.2)' }}>
                <p className="text-xs text-slate-400 mb-3" style={{ fontFamily: "'Inter', sans-serif" }}>
                  Overall Skill Match — AI Engineer
                </p>
                <p className="text-5xl font-bold gradient-text mb-1" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  69%
                </p>
                <p className="text-xs text-slate-500 mb-4" style={{ fontFamily: "'Inter', sans-serif" }}>
                  You need 31% more coverage to hit 100%
                </p>
                <div className="w-full h-2 rounded-full bg-slate-800 mb-2">
                  <div className="h-full rounded-full" style={{ width: '69%', background: 'linear-gradient(90deg, #3B82F6, #8B5CF6)' }} />
                </div>
                <p className="text-xs text-slate-500" style={{ fontFamily: "'Inter', sans-serif" }}>
                  Est. completion: <span className="text-white font-medium">3.5 months</span>
                </p>
              </div>
            </div>

            {/* Right side */}
            <div className="lg:col-span-7 flex flex-col gap-5">
              {/* Skill bar comparison */}
              <div className="glass rounded-2xl p-5" style={{ border: '1px solid var(--border)' }}>
                <p className="text-sm font-semibold text-white mb-4" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  Skill-by-Skill Breakdown
                </p>
                <div className="flex flex-col gap-3">
                  {currentSkills.map((skill, i) => {
                    const req = requiredSkills[i].score
                    const gap = Math.max(0, req - skill.score)
                    return (
                      <div key={skill.name}>
                        <div className="flex justify-between mb-1">
                          <span className="text-xs text-slate-300" style={{ fontFamily: "'Inter', sans-serif" }}>{skill.name}</span>
                          <span className="text-xs" style={{
                            color: gap > 20 ? '#EF4444' : gap > 5 ? '#F59E0B' : '#34D399',
                            fontFamily: "'Inter', sans-serif",
                          }}>
                            {gap > 0 ? `Gap: ${gap}%` : '✓ Sufficient'}
                          </span>
                        </div>
                        <div className="relative w-full h-1.5 rounded-full bg-slate-800">
                          {/* Required bar (background) */}
                          <div className="absolute h-full rounded-full opacity-20"
                            style={{ width: `${req}%`, background: '#06B6D4' }} />
                          {/* Current bar */}
                          <div className="absolute h-full rounded-full transition-all duration-700"
                            style={{
                              width: `${skill.score}%`,
                              background: gap > 20 ? '#EF4444' : gap > 5 ? '#F59E0B' : '#34D399',
                              boxShadow: `0 0 4px ${gap > 20 ? '#EF4444' : gap > 5 ? '#F59E0B' : '#34D399'}60`,
                            }} />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Recommended courses */}
              <div className="glass rounded-2xl p-5" style={{ border: '1px solid var(--border)' }}>
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm font-semibold text-white" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    Recommended Courses
                  </p>
                  <span className="text-xs text-blue-400" style={{ fontFamily: "'Inter', sans-serif" }}>
                    AI-curated for you
                  </span>
                </div>
                <div className="flex flex-col gap-3">
                  {courses.map((course) => (
                    <div key={course.title} className="flex items-center justify-between rounded-xl p-3 cursor-pointer hover:scale-[1.01] transition-all"
                      style={{ background: `${course.color}08`, border: `1px solid ${course.color}20` }}>
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                          style={{ background: `${course.color}20`, border: `1px solid ${course.color}30` }}>
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <rect x="2" y="2" width="12" height="10" rx="1.5" stroke={course.color} strokeWidth="1.2"/>
                            <path d="M5 7h6M5 9.5h4" stroke={course.color} strokeWidth="1.2" strokeLinecap="round"/>
                          </svg>
                        </div>
                        <div>
                          <p className="text-xs text-white font-medium" style={{ fontFamily: "'Inter', sans-serif" }}>{course.title}</p>
                          <p className="text-xs text-slate-500 mt-0.5" style={{ fontFamily: "'Inter', sans-serif" }}>
                            {course.provider} · {course.time}
                          </p>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0 ml-3">
                        <p className="text-xs font-bold" style={{ color: course.color, fontFamily: "'Poppins', sans-serif" }}>
                          {course.match}%
                        </p>
                        <p className="text-xs text-slate-500" style={{ fontFamily: "'Inter', sans-serif" }}>match</p>
                      </div>
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
