import { useState, useRef, useEffect } from 'react'
import { AppShell } from '../components/Layout'

type Message = { role: 'user' | 'ai'; text: string; time: string }

const initialMessages: Message[] = [
  {
    role: 'ai',
    text: "Hey Rahul! I'm ARIA, your AI Career Mentor. I've analyzed your profile — you're on track but there are 3 critical skills gaps blocking your AI Engineer path. Want me to walk you through them?",
    time: '4:32 PM',
  },
  {
    role: 'user',
    text: 'I want a ₹20 LPA AI job. What do I need to do?',
    time: '4:33 PM',
  },
  {
    role: 'ai',
    text: "Great ambition! Based on your current skills (Python 88%, ML 74%, System Design 58%), I estimate a **14-month roadmap** with an **82% success probability** for a ₹20+ LPA AI role.\n\nHere's your critical path:\n• Month 1-3: Fill System Design & MLOps gaps\n• Month 4-8: Build 2 production AI projects\n• Month 9-12: Target FAANG internships\n• Month 13-14: Full-time conversion",
    time: '4:33 PM',
  },
]

const quickActions = [
  'Show my skill gaps',
  'Build a 6-month plan',
  'Find matching jobs',
  'Improve my resume',
  'Mock interview tips',
  'Salary benchmarks',
]

const suggestions = [
  'What skills should I focus on this month?',
  'Which companies are hiring AI engineers?',
  'Review my interview preparation',
]

function WaveBar({ delay }: { delay: number }) {
  return (
    <div
      className="w-0.5 rounded-full bg-blue-400"
      style={{
        animation: `wave 1.2s ease-in-out ${delay}s infinite`,
        minHeight: '4px',
      }}
    />
  )
}

export default function MentorPage() {
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  const aiResponses: Record<string, string> = {
    default: "That's a great question! Based on your current profile, I'd recommend focusing on System Design and MLOps as your next priority areas. Both are critical blockers to the AI Engineer path you're targeting. Want me to generate a specific study plan?",
  }

  const sendMessage = (text: string) => {
    if (!text.trim()) return
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    setMessages((prev) => [...prev, { role: 'user', text, time: now }])
    setInput('')
    setIsTyping(true)
    setTimeout(() => {
      setIsTyping(false)
      setMessages((prev) => [
        ...prev,
        { role: 'ai', text: aiResponses.default, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) },
      ])
    }, 1800)
  }

  const formatText = (text: string) => {
    return text.split('\n').map((line, i) => (
      <span key={i}>
        {line.split(/\*\*(.*?)\*\*/g).map((part, j) =>
          j % 2 === 1
            ? <strong key={j} className="text-white">{part}</strong>
            : <span key={j}>{part}</span>
        )}
        {i < text.split('\n').length - 1 && <br />}
      </span>
    ))
  }

  return (
    <AppShell>
      <div className="h-[calc(100vh-56px)] flex" style={{ maxHeight: 'calc(100vh - 56px)' }}>
        {/* Sidebar */}
        <div className="hidden lg:flex w-72 flex-col border-r py-5 px-4"
          style={{ borderColor: 'var(--border)', background: 'var(--bg-surface)' }}>
          <div className="flex items-center gap-3 mb-6">
            <div className="relative w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, rgba(59,130,246,0.3), rgba(139,92,246,0.3))', border: '1px solid rgba(139,92,246,0.3)' }}>
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <circle cx="9" cy="6" r="4" stroke="#8B5CF6" strokeWidth="1.5"/>
                <path d="M2 17c0-3.9 3.1-7 7-7s7 3.1 7 7" stroke="#8B5CF6" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-green-400"
                style={{ border: '2px solid var(--bg-base)' }} />
            </div>
            <div>
              <p className="text-sm font-semibold text-white" style={{ fontFamily: "'Poppins', sans-serif" }}>ARIA</p>
              <p className="text-xs text-green-400" style={{ fontFamily: "'Inter', sans-serif" }}>Active · Career Intelligence</p>
            </div>
          </div>

          <p className="text-xs text-slate-500 uppercase tracking-wider mb-3" style={{ fontFamily: "'Inter', sans-serif" }}>
            Quick Actions
          </p>
          <div className="flex flex-col gap-1.5 mb-6">
            {quickActions.map((a) => (
              <button key={a} onClick={() => sendMessage(a)}
                className="text-left text-xs text-slate-400 hover:text-white px-3 py-2 rounded-lg hover:bg-white/5 transition-all duration-150"
                style={{ fontFamily: "'Inter', sans-serif" }}>
                {a}
              </button>
            ))}
          </div>

          <p className="text-xs text-slate-500 uppercase tracking-wider mb-3" style={{ fontFamily: "'Inter', sans-serif" }}>
            Career Roadmap
          </p>
          <div className="flex flex-col gap-3 relative">
            <div className="absolute left-3 top-4 bottom-4 w-px" style={{ background: 'var(--border)' }} />
            {[
              { phase: 'Phase 1', label: 'Skill Foundation', done: true },
              { phase: 'Phase 2', label: 'Project Building', done: false, active: true },
              { phase: 'Phase 3', label: 'Internship Hunt', done: false },
              { phase: 'Phase 4', label: 'Full-time Offer', done: false },
            ].map((step) => (
              <div key={step.phase} className="flex items-center gap-3 pl-1">
                <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 z-10"
                  style={{
                    background: step.done ? 'rgba(52,211,153,0.2)' : step.active ? 'rgba(59,130,246,0.2)' : 'var(--bg-surface)',
                    border: `1px solid ${step.done ? 'rgba(52,211,153,0.4)' : step.active ? 'rgba(59,130,246,0.4)' : 'var(--input-border)'}`,
                  }}>
                  {step.done
                    ? <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M2 5l2 2 4-4" stroke="#34D399" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    : step.active
                      ? <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse-glow" />
                      : null}
                </div>
                <div>
                  <p className="text-xs text-slate-500" style={{ fontFamily: "'Inter', sans-serif" }}>{step.phase}</p>
                  <p className="text-xs" style={{ color: step.active ? 'white' : step.done ? 'rgba(148,163,184,0.6)' : 'rgba(148,163,184,0.4)', fontFamily: "'Inter', sans-serif" }}>
                    {step.label}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat area */}
        <div className="flex-1 flex flex-col">
          {/* Chat header */}
          <div className="flex items-center justify-between px-5 py-3 border-b"
            style={{ borderColor: 'var(--border)', background: 'var(--bg-surface)' }}>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, rgba(59,130,246,0.3), rgba(139,92,246,0.3))', border: '1px solid rgba(139,92,246,0.3)' }}>
                <svg width="15" height="15" viewBox="0 0 18 18" fill="none">
                  <circle cx="9" cy="6" r="4" stroke="#8B5CF6" strokeWidth="1.5"/>
                  <path d="M2 17c0-3.9 3.1-7 7-7s7 3.1 7 7" stroke="#8B5CF6" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </div>
              <div>
                <p className="text-sm font-semibold text-white" style={{ fontFamily: "'Poppins', sans-serif" }}>ARIA — Career Mentor</p>
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
                  <p className="text-xs text-slate-400" style={{ fontFamily: "'Inter', sans-serif" }}>Online · Analyzing your profile</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 hidden md:block" style={{ fontFamily: "'Inter', sans-serif" }}>
                Powered by CareerOS AGI
              </span>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 md:px-6 py-6 flex flex-col gap-4"
            style={{ scrollbarWidth: 'thin' }}>
            {messages.map((msg, i) => (
              <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                {msg.role === 'ai' && (
                  <div className="w-8 h-8 rounded-xl flex-shrink-0 flex items-center justify-center"
                    style={{ background: 'linear-gradient(135deg, rgba(59,130,246,0.3), rgba(139,92,246,0.3))', border: '1px solid rgba(139,92,246,0.3)' }}>
                    <svg width="14" height="14" viewBox="0 0 18 18" fill="none">
                      <circle cx="9" cy="6" r="4" stroke="#8B5CF6" strokeWidth="1.5"/>
                      <path d="M2 17c0-3.9 3.1-7 7-7s7 3.1 7 7" stroke="#8B5CF6" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                  </div>
                )}
                <div className={`max-w-lg ${msg.role === 'user' ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
                  <div
                    className="px-4 py-3 rounded-2xl text-sm leading-relaxed"
                    style={{
                      background: msg.role === 'ai'
                        ? 'var(--bg-surface)'
                        : 'linear-gradient(135deg, rgba(59,130,246,0.25), rgba(139,92,246,0.25))',
                      border: msg.role === 'ai'
                        ? '1px solid var(--border-accent)'
                        : '1px solid rgba(139,92,246,0.3)',
                      color: 'rgba(226,232,240,0.9)',
                      boxShadow: msg.role === 'user' ? '0 0 20px rgba(139,92,246,0.15)' : 'none',
                      fontFamily: "'Inter', sans-serif",
                      borderRadius: msg.role === 'ai' ? '4px 18px 18px 18px' : '18px 4px 18px 18px',
                    }}
                  >
                    {formatText(msg.text)}
                  </div>
                  <p className="text-xs text-slate-600 px-1" style={{ fontFamily: "'Inter', sans-serif" }}>{msg.time}</p>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-xl flex-shrink-0 flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg, rgba(59,130,246,0.3), rgba(139,92,246,0.3))', border: '1px solid rgba(139,92,246,0.3)' }}>
                  <svg width="14" height="14" viewBox="0 0 18 18" fill="none">
                    <circle cx="9" cy="6" r="4" stroke="#8B5CF6" strokeWidth="1.5"/>
                    <path d="M2 17c0-3.9 3.1-7 7-7s7 3.1 7 7" stroke="#8B5CF6" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                </div>
                <div className="px-4 py-3 rounded-2xl flex items-center gap-1.5"
                  style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: '4px 18px 18px 18px' }}>
                  {[0, 0.2, 0.4].map((d) => (
                    <div key={d} className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-pulse-glow"
                      style={{ animationDelay: `${d}s` }} />
                  ))}
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Suggestions */}
          <div className="px-4 md:px-6 py-2 flex gap-2 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
            {suggestions.map((s) => (
              <button key={s} onClick={() => sendMessage(s)}
                className="text-xs px-3 py-1.5 rounded-full flex-shrink-0 transition-all duration-150 hover:scale-105"
                style={{
                  background: 'rgba(59,130,246,0.1)',
                  border: '1px solid rgba(59,130,246,0.25)',
                  color: '#93C5FD',
                  fontFamily: "'Inter', sans-serif",
                }}>
                {s}
              </button>
            ))}
          </div>

          {/* Input bar */}
          <div className="px-4 md:px-6 py-4 border-t" style={{ borderColor: 'var(--border)' }}>
            <div className="flex items-center gap-3 glass rounded-2xl px-4 py-2.5"
              style={{ border: '1px solid var(--input-border)' }}>
              {/* Voice button */}
              <button
                onClick={() => setIsListening(!isListening)}
                className="flex items-center gap-1 flex-shrink-0 transition-all"
                style={{ color: isListening ? '#3B82F6' : 'rgba(148,163,184,0.5)' }}>
                {isListening
                  ? <div className="flex items-end gap-0.5 h-5">{[0, 0.1, 0.2, 0.3, 0.4].map((d) => <WaveBar key={d} delay={d} />)}</div>
                  : <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <rect x="5" y="1" width="6" height="9" rx="3"/>
                      <path d="M2 8c0 3.3 2.7 6 6 6s6-2.7 6-6"/>
                      <path d="M8 14v2"/>
                    </svg>
                }
              </button>

              <input
                type="text"
                placeholder="Ask ARIA anything about your career..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendMessage(input)}
                className="flex-1 bg-transparent text-sm text-white placeholder-slate-600 outline-none"
                style={{ fontFamily: "'Inter', sans-serif" }}
              />

              <button
                onClick={() => sendMessage(input)}
                disabled={!input.trim()}
                className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-200"
                style={{
                  background: input.trim() ? 'linear-gradient(135deg, #3B82F6, #8B5CF6)' : 'var(--bg-surface-strong)',
                  opacity: input.trim() ? 1 : 0.5,
                }}>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M2 7h10M8 3l4 4-4 4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  )
}
