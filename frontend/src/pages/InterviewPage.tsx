import { useState, useEffect } from 'react'
import { AppShell } from '../components/Layout'

function WaveBar({ delay, active }: { delay: number; active: boolean }) {
  return (
    <div
      className="w-1 rounded-full"
      style={{
        background: 'linear-gradient(to top, #3B82F6, #8B5CF6)',
        animation: active ? `wave 0.8s ease-in-out ${delay}s infinite` : 'none',
        height: active ? '4px' : '4px',
        minHeight: '4px',
        maxHeight: '32px',
        transition: 'height 0.2s',
      }}
    />
  )
}

const questions = [
  { q: 'Tell me about yourself and your background in AI/ML.', category: 'Behavioral' },
  { q: 'Explain the difference between supervised and unsupervised learning with examples.', category: 'Technical' },
  { q: 'How would you design a recommendation system for a streaming platform?', category: 'System Design' },
  { q: 'Describe a challenging ML project you worked on and how you solved it.', category: 'Behavioral' },
  { q: 'What is the bias-variance tradeoff? How do you handle overfitting?', category: 'Technical' },
]

export default function InterviewPage() {
  const [started, setStarted] = useState(false)
  const [qIndex, setQIndex] = useState(0)
  const [speaking, setSpeaking] = useState(false)
  const [userSpeaking, setUserSpeaking] = useState(false)
  const [timer, setTimer] = useState(0)
  const [scores, setScores] = useState({ confidence: 0, technical: 0, communication: 0 })
  const [transcript, setTranscript] = useState('')
  const [feedback, setFeedback] = useState('')

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>
    if (started) {
      interval = setInterval(() => setTimer((t) => t + 1), 1000)
    }
    return () => clearInterval(interval)
  }, [started])

  useEffect(() => {
    if (started) {
      setSpeaking(true)
      const t = setTimeout(() => {
        setSpeaking(false)
        setScores({ confidence: 72 + Math.floor(Math.random() * 20), technical: 68 + Math.floor(Math.random() * 25), communication: 78 + Math.floor(Math.random() * 18) })
      }, 2500)
      return () => clearTimeout(t)
    }
  }, [started, qIndex])

  const handleAnswer = () => {
    setUserSpeaking(!userSpeaking)
    if (userSpeaking) {
      setTranscript("I've been working on machine learning projects for the past 2 years. I completed my B.Tech in CS with a specialization in AI at IIT Delhi. My most significant project was building a real-time fraud detection system...")
      setFeedback("Good opening! Structured your response well. Consider adding specific metrics to your projects for stronger impact.")
    }
  }

  const nextQuestion = () => {
    if (qIndex < questions.length - 1) {
      setQIndex((q) => q + 1)
      setTranscript('')
      setFeedback('')
      setUserSpeaking(false)
    }
  }

  const fmt = (s: number) => `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`

  return (
    <AppShell>
      <div className="min-h-screen px-4 md:px-6 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <div className="inline-flex items-center gap-2 glass rounded-full px-3 py-1 mb-3 text-xs text-cyan-400 border border-cyan-500/20"
              style={{ fontFamily: "'Inter', sans-serif" }}>
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse-glow" />
              ECHO · Interview Simulator
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
              AI Mock <span className="gradient-text">Interview</span>
            </h1>
            <p className="text-slate-400 text-sm" style={{ fontFamily: "'Inter', sans-serif" }}>
              Immersive voice interview with real-time confidence analysis.
            </p>
          </div>

          {!started ? (
            /* Pre-interview setup */
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="glass rounded-2xl p-8 flex flex-col items-center text-center"
                style={{ border: '1px solid rgba(139,92,246,0.2)' }}>
                <div className="relative w-36 h-36 flex items-center justify-center mb-6">
                  <div className="absolute w-36 h-36 rounded-full animate-spin-slow"
                    style={{ border: '1px solid rgba(59,130,246,0.2)' }} />
                  <div className="absolute w-24 h-24 rounded-full"
                    style={{ border: '1px solid rgba(139,92,246,0.25)', animation: 'spin-slow 12s linear infinite reverse' }} />
                  <div className="w-20 h-20 rounded-full flex items-center justify-center animate-float"
                    style={{
                      background: 'linear-gradient(135deg, rgba(59,130,246,0.25), rgba(139,92,246,0.25))',
                      border: '1px solid rgba(139,92,246,0.4)',
                      boxShadow: '0 0 30px rgba(139,92,246,0.3)',
                    }}>
                    <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
                      <circle cx="18" cy="12" r="7" stroke="url(#echoG)" strokeWidth="1.5"/>
                      <path d="M4 34c0-7.7 6.3-14 14-14s14 6.3 14 14" stroke="url(#echoG)" strokeWidth="1.5" strokeLinecap="round"/>
                      <circle cx="18" cy="12" r="3" fill="url(#echoG)" opacity="0.7"/>
                      <defs>
                        <linearGradient id="echoG" x1="4" y1="4" x2="32" y2="32" gradientUnits="userSpaceOnUse">
                          <stop stopColor="#3B82F6"/><stop offset="1" stopColor="#8B5CF6"/>
                        </linearGradient>
                      </defs>
                    </svg>
                  </div>
                </div>
                <p className="text-lg font-bold text-white mb-1" style={{ fontFamily: "'Poppins', sans-serif" }}>ECHO</p>
                <p className="text-xs text-blue-400 mb-4" style={{ fontFamily: "'Inter', sans-serif" }}>Interview Simulation Agent</p>
                <p className="text-sm text-slate-400 leading-relaxed mb-6" style={{ fontFamily: "'Inter', sans-serif" }}>
                  I'll conduct a 5-question AI Engineer mock interview. I'll analyze your confidence, technical depth, and communication in real time.
                </p>
                <button onClick={() => setStarted(true)}
                  className="w-full py-3.5 rounded-xl text-sm font-semibold text-white transition-all hover:scale-[1.02]"
                  style={{ background: 'linear-gradient(135deg, #3B82F6, #8B5CF6)', boxShadow: '0 0 24px rgba(139,92,246,0.4)', fontFamily: "'Inter', sans-serif" }}>
                  Start Interview →
                </button>
              </div>

              <div className="flex flex-col gap-4">
                {/* Interview details */}
                <div className="glass rounded-2xl p-5" style={{ border: '1px solid var(--border)' }}>
                  <p className="text-sm font-semibold text-white mb-4" style={{ fontFamily: "'Poppins', sans-serif" }}>Interview Details</p>
                  <div className="flex flex-col gap-3">
                    {[
                      { label: 'Role', val: 'AI Engineer (Senior)' },
                      { label: 'Company Type', val: 'FAANG / Top Startup' },
                      { label: 'Duration', val: '~25 minutes' },
                      { label: 'Questions', val: '5 (Mixed: Behavioral + Technical)' },
                      { label: 'Language', val: 'English' },
                    ].map((r) => (
                      <div key={r.label} className="flex justify-between">
                        <span className="text-xs text-slate-400" style={{ fontFamily: "'Inter', sans-serif" }}>{r.label}</span>
                        <span className="text-xs text-white font-medium" style={{ fontFamily: "'Inter', sans-serif" }}>{r.val}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="glass rounded-2xl p-5" style={{ border: '1px solid var(--border)' }}>
                  <p className="text-sm font-semibold text-white mb-3" style={{ fontFamily: "'Poppins', sans-serif" }}>What ECHO Measures</p>
                  {[
                    { label: 'Confidence Score', color: '#3B82F6' },
                    { label: 'Technical Depth', color: '#8B5CF6' },
                    { label: 'Communication Clarity', color: '#06B6D4' },
                    { label: 'Response Structure', color: '#F59E0B' },
                  ].map((m) => (
                    <div key={m.label} className="flex items-center gap-2 mb-2">
                      <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: m.color }} />
                      <span className="text-xs text-slate-400" style={{ fontFamily: "'Inter', sans-serif" }}>{m.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            /* Interview in progress */
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              {/* Main interview area */}
              <div className="lg:col-span-8 flex flex-col gap-4">
                {/* Timer + progress */}
                <div className="flex items-center justify-between glass rounded-xl px-4 py-2.5"
                  style={{ border: '1px solid var(--border)' }}>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-red-400 animate-pulse-glow" />
                    <span className="text-xs text-slate-300 font-medium" style={{ fontFamily: "'Inter', sans-serif" }}>LIVE</span>
                    <span className="text-sm font-mono text-white">{fmt(timer)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400" style={{ fontFamily: "'Inter', sans-serif" }}>
                      Q {qIndex + 1} / {questions.length}
                    </span>
                    <div className="flex gap-1">
                      {questions.map((_, i) => (
                        <div key={i} className="w-6 h-1 rounded-full"
                          style={{ background: i < qIndex ? '#34D399' : i === qIndex ? '#3B82F6' : 'var(--input-border)' }} />
                      ))}
                    </div>
                  </div>
                </div>

                {/* AI interviewer */}
                <div className="glass rounded-2xl p-6 flex items-start gap-5"
                  style={{ border: '1px solid rgba(139,92,246,0.2)', background: 'rgba(139,92,246,0.04)' }}>
                  {/* Avatar */}
                  <div className="relative w-16 h-16 flex-shrink-0">
                    <div className="w-16 h-16 rounded-2xl flex items-center justify-center"
                      style={{
                        background: 'linear-gradient(135deg, rgba(59,130,246,0.25), rgba(139,92,246,0.25))',
                        border: '1px solid rgba(139,92,246,0.4)',
                        boxShadow: speaking ? '0 0 20px rgba(139,92,246,0.5)' : 'none',
                      }}>
                      <svg width="28" height="28" viewBox="0 0 36 36" fill="none">
                        <circle cx="18" cy="12" r="7" stroke="#8B5CF6" strokeWidth="1.5"/>
                        <path d="M4 34c0-7.7 6.3-14 14-14s14 6.3 14 14" stroke="#8B5CF6" strokeWidth="1.5" strokeLinecap="round"/>
                      </svg>
                    </div>
                    {speaking && (
                      <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 flex gap-0.5 h-4 items-end">
                        {[0, 0.1, 0.15, 0.08, 0.2].map((d, i) => (
                          <WaveBar key={i} delay={d} active={speaking} />
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-xs text-purple-300 font-medium" style={{ fontFamily: "'Poppins', sans-serif" }}>
                        ECHO — {questions[qIndex].category}
                      </p>
                      {speaking && (
                        <div className="flex items-center gap-1.5 text-xs text-slate-400" style={{ fontFamily: "'Inter', sans-serif" }}>
                          <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse-glow" />
                          Speaking...
                        </div>
                      )}
                    </div>
                    <p className="text-sm text-white leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>
                      {questions[qIndex].q}
                    </p>
                  </div>
                </div>

                {/* User answer / transcript */}
                <div className="glass rounded-2xl p-5" style={{ border: '1px solid var(--border)', minHeight: '140px' }}>
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-xs text-slate-400 font-medium" style={{ fontFamily: "'Inter', sans-serif" }}>Your Answer</p>
                    {userSpeaking && (
                      <div className="flex items-center gap-1.5">
                        <div className="flex gap-0.5 h-4 items-end">
                          {[0, 0.08, 0.16, 0.06, 0.14, 0.22, 0.04].map((d, i) => (
                            <WaveBar key={i} delay={d} active={true} />
                          ))}
                        </div>
                        <span className="text-xs text-blue-400" style={{ fontFamily: "'Inter', sans-serif" }}>Recording...</span>
                      </div>
                    )}
                  </div>
                  {transcript
                    ? <p className="text-sm text-slate-300 leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>{transcript}</p>
                    : <p className="text-sm text-slate-600 italic" style={{ fontFamily: "'Inter', sans-serif" }}>
                        Press the microphone to start answering...
                      </p>
                  }
                </div>

                {/* Feedback */}
                {feedback && (
                  <div className="rounded-xl p-4"
                    style={{ background: 'rgba(52,211,153,0.07)', border: '1px solid rgba(52,211,153,0.2)' }}>
                    <p className="text-xs text-green-400 font-medium mb-1" style={{ fontFamily: "'Poppins', sans-serif" }}>
                      ECHO Feedback
                    </p>
                    <p className="text-xs text-slate-300 leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>{feedback}</p>
                  </div>
                )}

                {/* Controls */}
                <div className="flex items-center justify-between">
                  <button
                    onClick={handleAnswer}
                    className="flex items-center gap-2.5 px-5 py-3 rounded-xl text-sm font-medium transition-all duration-200 hover:scale-105"
                    style={{
                      background: userSpeaking ? 'rgba(239,68,68,0.15)' : 'linear-gradient(135deg, #3B82F6, #8B5CF6)',
                      border: userSpeaking ? '1px solid rgba(239,68,68,0.3)' : 'none',
                      color: userSpeaking ? '#EF4444' : 'white',
                      boxShadow: userSpeaking ? 'none' : '0 0 16px rgba(59,130,246,0.3)',
                      fontFamily: "'Inter', sans-serif",
                    }}>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <rect x="5" y="1" width="6" height="9" rx="3"/>
                      <path d="M2 8c0 3.3 2.7 6 6 6s6-2.7 6-6"/>
                      <path d="M8 14v2"/>
                    </svg>
                    {userSpeaking ? 'Stop Recording' : 'Start Answering'}
                  </button>

                  {transcript && (
                    <button onClick={nextQuestion}
                      className="flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-medium text-white transition-all hover:bg-white/10"
                      style={{ background: 'var(--border)', border: '1px solid var(--input-border)', fontFamily: "'Inter', sans-serif" }}>
                      Next Question
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <path d="M3 7h8M8 4l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                  )}
                </div>
              </div>

              {/* Score panel */}
              <div className="lg:col-span-4 flex flex-col gap-4">
                <div className="glass rounded-2xl p-5" style={{ border: '1px solid var(--border)' }}>
                  <p className="text-sm font-semibold text-white mb-4" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    Live Scores
                  </p>
                  {[
                    { label: 'Confidence', val: scores.confidence, color: '#3B82F6' },
                    { label: 'Technical Depth', val: scores.technical, color: '#8B5CF6' },
                    { label: 'Communication', val: scores.communication, color: '#06B6D4' },
                  ].map((s) => (
                    <div key={s.label} className="mb-4">
                      <div className="flex justify-between mb-1.5">
                        <span className="text-xs text-slate-400" style={{ fontFamily: "'Inter', sans-serif" }}>{s.label}</span>
                        <span className="text-sm font-bold" style={{ color: s.color, fontFamily: "'Poppins', sans-serif" }}>
                          {s.val > 0 ? `${s.val}%` : '--'}
                        </span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-slate-800">
                        <div className="h-full rounded-full transition-all duration-1000"
                          style={{ width: `${s.val}%`, background: s.color, boxShadow: `0 0 6px ${s.color}60` }} />
                      </div>
                    </div>
                  ))}

                  {scores.confidence > 0 && (
                    <div className="mt-4 pt-4 border-t text-center" style={{ borderColor: 'var(--border)' }}>
                      <p className="text-xs text-slate-400 mb-1" style={{ fontFamily: "'Inter', sans-serif" }}>Overall Performance</p>
                      <p className="text-3xl font-bold gradient-text" style={{ fontFamily: "'Poppins', sans-serif" }}>
                        {Math.round((scores.confidence + scores.technical + scores.communication) / 3)}%
                      </p>
                    </div>
                  )}
                </div>

                {/* Tips */}
                <div className="glass rounded-2xl p-5" style={{ border: '1px solid var(--border)' }}>
                  <p className="text-sm font-semibold text-white mb-3" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    Interview Tips
                  </p>
                  {[
                    'Use the STAR method for behavioral questions',
                    'Speak at 130-150 WPM for clarity',
                    'Pause 1-2s before answering complex questions',
                  ].map((tip, i) => (
                    <div key={i} className="flex items-start gap-2 mb-2">
                      <span className="text-blue-400 text-xs mt-0.5">→</span>
                      <p className="text-xs text-slate-400 leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>{tip}</p>
                    </div>
                  ))}
                </div>

                <div className="glass rounded-2xl p-4 text-center" style={{ border: '1px solid var(--border)' }}>
                  <p className="text-xs text-slate-400 mb-1" style={{ fontFamily: "'Inter', sans-serif" }}>Voice Analysis</p>
                  <div className="flex items-end justify-center gap-1 h-10">
                    {Array.from({ length: 16 }).map((_, i) => (
                      <div key={i} className="w-1 rounded-full"
                        style={{
                          background: userSpeaking ? 'linear-gradient(to top, #3B82F6, #8B5CF6)' : 'var(--input-border)',
                          animation: userSpeaking ? `wave ${0.6 + Math.random() * 0.8}s ease-in-out ${i * 0.05}s infinite` : 'none',
                          height: `${4 + Math.random() * 28}px`,
                          minHeight: '4px',
                        }} />
                    ))}
                  </div>
                  <p className="text-xs text-slate-600 mt-2" style={{ fontFamily: "'Inter', sans-serif" }}>
                    {userSpeaking ? 'ElevenLabs Voice AI Active' : 'Waiting for input'}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  )
}
