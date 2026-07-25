import { useState, useRef, useEffect } from 'react'
import { AppShell } from '../components/Layout'
import { mentorApi, type ChatMessage as ApiChatMessage } from '../api/mentor'
import { useRole } from '../context/RoleContext'

type Message = { role: 'user' | 'ai'; text: string; time: string }

const quickActions = [
  'Audit my skills for target role',
  '6-Month High-Pay Placement Roadmap',
  'ATS Resume Audit & Key Keywords',
  'Tier-1 Referral & LinkedIn Strategy',
  'Mock Technical Interview Question',
  'Salary Benchmarks (in ₹ LPA)',
]

const suggestions = [
  'What 5 projects will get me hired as an AI Engineer in India?',
  'How do I prepare for System Design & Coding Rounds in 3 months?',
  'What is the expected salary (LPA) for my target role & batch year?',
  'How do I get off-campus referrals at Google, Microsoft, and top startups?',
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
  const { userProfile } = useRole()
  const firstName = userProfile?.fullName?.split(' ')[0] || 'there'

  const initialMessages: Message[] = [
    {
      role: 'ai',
      text: `Hey ${firstName}! I'm ARIA, your AI Career Mentor. I've loaded your profile context (${userProfile.degree || 'Tech Degree'}, Class of ${userProfile.graduationYear || '2026'} at ${userProfile.universityName || 'your university'}). What goal or question can I help you with today?`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]

  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [, setError] = useState<string | null>(null)
  const bottomRef = useRef<HTMLDivElement>(null)

  // Keep API-format history in sync
  const historyRef = useRef<ApiChatMessage[]>([])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  const sendMessage = async (text: string) => {
    const trimmed = text.trim()
    if (!trimmed || isTyping) return

    const userTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    const userMessage: Message = { role: 'user', text: trimmed, time: userTime }

    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setIsTyping(true)
    setError(null)

    // Append to history
    historyRef.current.push({ role: 'user', text: trimmed })

    try {
      // Send message to AI backend along with userProfile details (degree, year, etc.)
      const res = await mentorApi.chat(trimmed, historyRef.current.slice(0, -1), userProfile)
      const replyText = res?.reply || "I'm analyzing your profile. Could you provide a bit more context?"
      const replyTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

      setMessages((prev) => [...prev, { role: 'ai', text: replyText, time: replyTime }])
      historyRef.current.push({ role: 'model', text: replyText })
    } catch (e: any) {
      console.error("Mentor chat error:", e)
      const errMsg = e?.message || 'Connecting to Gemini AI...'
      setError(errMsg)

      const replyTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      setMessages((prev) => [
        ...prev,
        {
          role: 'ai',
          text: `I'm having trouble reaching the AI server right now (${errMsg}). Please make sure backend is running.`,
          time: replyTime,
        },
      ])
    } finally {
      setIsTyping(false)
    }
  }

  const formatText = (text: string) => {
    const lines = text.split('\n')
    const elements: React.ReactNode[] = []
    let i = 0

    while (i < lines.length) {
      const line = lines[i]

      // Code block: ```...```
      if (line.trim().startsWith('```')) {
        line.trim().slice(3)
        const codeLines: string[] = []
        i++
        while (i < lines.length && !lines[i].trim().startsWith('```')) {
          codeLines.push(lines[i])
          i++
        }
        i++ // skip closing ```
        elements.push(
          <pre
            key={`code-${i}`}
            className="rounded-lg px-4 py-3 my-2 text-xs overflow-x-auto"
            style={{
              background: 'rgba(0,0,0,0.4)',
              border: '1px solid rgba(139,92,246,0.2)',
              fontFamily: "'Fira Code', 'Cascadia Code', monospace",
              color: '#93C5FD',
            }}
          >
            <code>{codeLines.join('\n')}</code>
          </pre>
        )
        continue
      }

      // Horizontal rule: ---
      if (/^-{3,}$/.test(line.trim())) {
        elements.push(
          <hr
            key={`hr-${i}`}
            className="my-3"
            style={{ border: 'none', borderTop: '1px solid rgba(139,92,246,0.2)' }}
          />
        )
        i++
        continue
      }

      // Headings: ### H3, ## H2, # H1
      const headingMatch = line.match(/^(#{1,4})\s+(.*)/)
      if (headingMatch) {
        const level = headingMatch[1].length
        const content = headingMatch[2]
        const sizes: Record<number, string> = {
          1: 'text-base',
          2: 'text-sm',
          3: 'text-sm',
          4: 'text-xs',
        }
        elements.push(
          <p
            key={`h-${i}`}
            className={`${sizes[level] || 'text-sm'} font-bold mt-3 mb-1.5`}
            style={{ color: '#E2E8F0', fontFamily: "'Poppins', sans-serif" }}
          >
            {renderInline(content)}
          </p>
        )
        i++
        continue
      }

      // Numbered list item (possibly with bullet sub-items): 1. or 1)
      if (/^\s*\d+[\.)\]]\s+/.test(line)) {
        // Collect the full numbered list block: numbered items + their bullet sub-items
        type NumItem = { num: number; text: string; subs: string[] }
        const items: NumItem[] = []

        while (i < lines.length) {
          const numMatch = lines[i]?.match(/^\s*(\d+)[\.)\]]\s+(.*)/)
          if (numMatch) {
            items.push({ num: parseInt(numMatch[1]), text: numMatch[2], subs: [] })
            i++
            // Collect any bullet sub-items that follow this numbered item
            while (i < lines.length && /^\s*[\*\-•]\s+/.test(lines[i])) {
              items[items.length - 1].subs.push(lines[i].replace(/^\s*[\*\-•]\s+/, ''))
              i++
            }
          } else {
            break
          }
        }

        elements.push(
          <ol key={`ol-${i}`} className="my-1.5 flex flex-col gap-2 pl-1">
            {items.map((item, idx) => (
              <li key={idx} className="flex flex-col gap-1">
                <div className="flex items-start gap-2 text-sm leading-relaxed">
                  <span
                    className="mt-0.5 w-5 h-5 rounded-full flex items-center justify-center shrink-0 text-xs font-bold"
                    style={{
                      background: 'rgba(59,130,246,0.15)',
                      color: '#93C5FD',
                      border: '1px solid rgba(59,130,246,0.3)',
                      fontFamily: "'Inter', sans-serif",
                    }}
                  >
                    {item.num}
                  </span>
                  <span>{renderInline(item.text)}</span>
                </div>
                {item.subs.length > 0 && (
                  <ul className="ml-7 flex flex-col gap-1">
                    {item.subs.map((sub, si) => (
                      <li key={si} className="flex items-start gap-2 text-sm leading-relaxed">
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0"
                          style={{ background: 'rgba(148,163,184,0.4)' }} />
                        <span style={{ color: 'rgba(203,213,225,0.85)' }}>{renderInline(sub)}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ol>
        )
        continue
      }

      // Standalone bullet list (not under a numbered item)
      if (/^\s*[\*\-•]\s+/.test(line)) {
        const items: string[] = []
        while (i < lines.length && /^\s*[\*\-•]\s+/.test(lines[i])) {
          items.push(lines[i].replace(/^\s*[\*\-•]\s+/, ''))
          i++
        }
        elements.push(
          <ul key={`ul-${i}`} className="my-1.5 flex flex-col gap-1 pl-1">
            {items.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2 text-sm leading-relaxed">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0"
                  style={{ background: 'linear-gradient(135deg, #3B82F6, #8B5CF6)' }} />
                <span>{renderInline(item)}</span>
              </li>
            ))}
          </ul>
        )
        continue
      }

      // Empty line
      if (line.trim() === '') {
        elements.push(<div key={`br-${i}`} className="h-1.5" />)
        i++
        continue
      }

      // Regular paragraph
      elements.push(
        <p key={`p-${i}`} className="leading-relaxed">
          {renderInline(line)}
        </p>
      )
      i++
    }

    return <>{elements}</>
  }

  /** Renders inline markdown: **bold**, *italic*, `code`, and plain text */
  const renderInline = (text: string): React.ReactNode => {
    // Process: **bold**, *italic*, `inline code`
    const parts = text.split(/(\*\*.*?\*\*|\*.*?\*|`[^`]+`)/g)
    return parts.map((part, k) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={k} className="font-semibold" style={{ color: '#F1F5F9' }}>
            {part.slice(2, -2)}
          </strong>
        )
      }
      if (part.startsWith('*') && part.endsWith('*') && !part.startsWith('**')) {
        return (
          <em key={k} style={{ color: '#CBD5E1' }}>
            {part.slice(1, -1)}
          </em>
        )
      }
      if (part.startsWith('`') && part.endsWith('`')) {
        return (
          <code
            key={k}
            className="px-1.5 py-0.5 rounded text-xs"
            style={{
              background: 'rgba(139,92,246,0.15)',
              color: '#C4B5FD',
              border: '1px solid rgba(139,92,246,0.2)',
              fontFamily: "'Fira Code', monospace",
            }}
          >
            {part.slice(1, -1)}
          </code>
        )
      }
      return <span key={k}>{part}</span>
    })
  }

  return (
    <AppShell>
      <div className="h-[calc(100vh-56px)] flex" style={{ maxHeight: 'calc(100vh - 56px)' }}>
        {/* Sidebar */}
        <div
          className="hidden lg:flex w-72 flex-col border-r py-5 px-4"
          style={{ borderColor: 'var(--border)', background: 'var(--bg-surface)' }}
        >
          <div className="flex items-center gap-3 mb-6">
            <div
              className="relative w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
              style={{
                background: 'linear-gradient(135deg, rgba(59,130,246,0.3), rgba(139,92,246,0.3))',
                border: '1px solid rgba(139,92,246,0.3)',
              }}
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <circle cx="9" cy="6" r="4" stroke="#8B5CF6" strokeWidth="1.5" />
                <path d="M2 17c0-3.9 3.1-7 7-7s7 3.1 7 7" stroke="#8B5CF6" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              <span
                className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-green-400"
                style={{ border: '2px solid var(--bg-base)' }}
              />
            </div>
            <div>
              <p className="text-sm font-semibold text-white" style={{ fontFamily: "'Poppins', sans-serif" }}>
                ARIA
              </p>
              <p className="text-xs text-green-400" style={{ fontFamily: "'Inter', sans-serif" }}>
                Active · Gemini 2.0 Flash
              </p>
            </div>
          </div>

          <p className="text-xs text-slate-500 uppercase tracking-wider mb-3" style={{ fontFamily: "'Inter', sans-serif" }}>
            Quick Actions
          </p>
          <div className="flex flex-col gap-1.5 mb-6">
            {quickActions.map((a) => (
              <button
                key={a}
                onClick={() => sendMessage(a)}
                className="text-left text-xs text-slate-400 hover:text-white px-3 py-2 rounded-lg hover:bg-white/5 transition-all duration-150 cursor-pointer"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
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
                <div
                  className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 z-10"
                  style={{
                    background: step.done
                      ? 'rgba(52,211,153,0.2)'
                      : step.active
                        ? 'rgba(59,130,246,0.2)'
                        : 'var(--bg-surface)',
                    border: `1px solid ${step.done
                        ? 'rgba(52,211,153,0.4)'
                        : step.active
                          ? 'rgba(59,130,246,0.4)'
                          : 'var(--input-border)'
                      }`,
                  }}
                >
                  {step.done ? (
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                      <path d="M2 5l2 2 4-4" stroke="#34D399" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  ) : step.active ? (
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse-glow" />
                  ) : null}
                </div>
                <div>
                  <p className="text-xs text-slate-500" style={{ fontFamily: "'Inter', sans-serif" }}>
                    {step.phase}
                  </p>
                  <p
                    className="text-xs"
                    style={{
                      color: step.active ? 'white' : step.done ? 'rgba(148,163,184,0.6)' : 'rgba(148,163,184,0.4)',
                      fontFamily: "'Inter', sans-serif",
                    }}
                  >
                    {step.label}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Chat header */}
          <div
            className="flex items-center justify-between px-5 py-3 border-b"
            style={{ borderColor: 'var(--border)', background: 'var(--bg-surface)' }}
          >
            <div className="flex items-center gap-3">
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center"
                style={{
                  background: 'linear-gradient(135deg, rgba(59,130,246,0.3), rgba(139,92,246,0.3))',
                  border: '1px solid rgba(139,92,246,0.3)',
                }}
              >
                <svg width="15" height="15" viewBox="0 0 18 18" fill="none">
                  <circle cx="9" cy="6" r="4" stroke="#8B5CF6" strokeWidth="1.5" />
                  <path d="M2 17c0-3.9 3.1-7 7-7s7 3.1 7 7" stroke="#8B5CF6" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-semibold text-white" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  ARIA — AI Career Mentor
                </p>
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
                  <p className="text-xs text-slate-400" style={{ fontFamily: "'Inter', sans-serif" }}>
                    Online · Powered by Gemini Flash
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 md:px-6 py-6 flex flex-col gap-4" style={{ scrollbarWidth: 'thin' }}>
            {messages.map((msg, i) => (
              <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                {msg.role === 'ai' && (
                  <div
                    className="w-8 h-8 rounded-xl shrink-0 flex items-center justify-center"
                    style={{
                      background: 'linear-gradient(135deg, rgba(59,130,246,0.3), rgba(139,92,246,0.3))',
                      border: '1px solid rgba(139,92,246,0.3)',
                    }}
                  >
                    <svg width="14" height="14" viewBox="0 0 18 18" fill="none">
                      <circle cx="9" cy="6" r="4" stroke="#8B5CF6" strokeWidth="1.5" />
                      <path d="M2 17c0-3.9 3.1-7 7-7s7 3.1 7 7" stroke="#8B5CF6" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  </div>
                )}
                <div className={`max-w-lg ${msg.role === 'user' ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
                  <div
                    className="px-4 py-3 rounded-2xl text-sm leading-relaxed"
                    style={{
                      background:
                        msg.role === 'ai'
                          ? 'var(--bg-surface)'
                          : 'linear-gradient(135deg, rgba(59,130,246,0.25), rgba(139,92,246,0.25))',
                      border:
                        msg.role === 'ai'
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
                  <p className="text-xs text-slate-600 px-1" style={{ fontFamily: "'Inter', sans-serif" }}>
                    {msg.time}
                  </p>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-3">
                <div
                  className="w-8 h-8 rounded-xl shrink-0 flex items-center justify-center"
                  style={{
                    background: 'linear-gradient(135deg, rgba(59,130,246,0.3), rgba(139,92,246,0.3))',
                    border: '1px solid rgba(139,92,246,0.3)',
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 18 18" fill="none">
                    <circle cx="9" cy="6" r="4" stroke="#8B5CF6" strokeWidth="1.5" />
                    <path d="M2 17c0-3.9 3.1-7 7-7s7 3.1 7 7" stroke="#8B5CF6" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </div>
                <div
                  className="px-4 py-3 rounded-2xl flex items-center gap-1.5"
                  style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: '4px 18px 18px 18px' }}
                >
                  {[0, 0.2, 0.4].map((d) => (
                    <div
                      key={d}
                      className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-pulse-glow"
                      style={{ animationDelay: `${d}s` }}
                    />
                  ))}
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Suggestions */}
          <div className="px-4 md:px-6 py-2 flex gap-2 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
            {suggestions.map((s) => (
              <button
                key={s}
                onClick={() => sendMessage(s)}
                className="text-xs px-3 py-1.5 rounded-full shrink-0 transition-all duration-150 hover:scale-105 cursor-pointer"
                style={{
                  background: 'rgba(59,130,246,0.1)',
                  border: '1px solid rgba(59,130,246,0.25)',
                  color: '#93C5FD',
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                {s}
              </button>
            ))}
          </div>

          {/* Input bar */}
          <div className="px-4 md:px-6 py-4 border-t" style={{ borderColor: 'var(--border)' }}>
            <form
              onSubmit={(e) => {
                e.preventDefault()
                sendMessage(input)
              }}
              className="flex items-center gap-3 glass rounded-2xl px-4 py-2.5"
              style={{ border: '1px solid var(--input-border)' }}
            >
              {/* Voice button */}
              <button
                type="button"
                onClick={() => setIsListening(!isListening)}
                className="flex items-center gap-1 shrink-0 transition-all cursor-pointer"
                style={{ color: isListening ? '#3B82F6' : 'rgba(148,163,184,0.5)' }}
              >
                {isListening ? (
                  <div className="flex items-end gap-0.5 h-5">
                    {[0, 0.1, 0.2, 0.3, 0.4].map((d) => (
                      <WaveBar key={d} delay={d} />
                    ))}
                  </div>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <rect x="5" y="1" width="6" height="9" rx="3" />
                    <path d="M2 8c0 3.3 2.7 6 6 6s6-2.7 6-6" />
                    <path d="M8 14v2" />
                  </svg>
                )}
              </button>

              <input
                type="text"
                placeholder="Ask ARIA anything about your career..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1 bg-transparent text-sm text-white placeholder-slate-600 outline-none"
                style={{ fontFamily: "'Inter', sans-serif" }}
              />

              <button
                type="submit"
                disabled={!input.trim() || isTyping}
                className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-all duration-200 cursor-pointer disabled:opacity-50"
                style={{
                  background: input.trim() ? 'linear-gradient(135deg, #3B82F6, #8B5CF6)' : 'var(--bg-surface-strong)',
                }}
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M2 7h10M8 3l4 4-4 4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </form>
          </div>
        </div>
      </div>
    </AppShell>
  )
}
