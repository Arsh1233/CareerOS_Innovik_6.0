import { useState, useMemo } from 'react'

interface DayData {
  date: Date
  count: number
  dateStr: string
}

function generateData(): DayData[] {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const data: DayData[] = []
  for (let i = 363; i >= 0; i--) {
    const d = new Date(today)
    d.setDate(today.getDate() - i)
    const rand = Math.random()
    let count = 0
    if (rand > 0.58) count = Math.floor(Math.random() * 3) + 1
    if (rand > 0.80) count = Math.floor(Math.random() * 5) + 3
    if (rand > 0.92) count = Math.floor(Math.random() * 8) + 8
    if (rand > 0.97) count = Math.floor(Math.random() * 6) + 16
    data.push({ date: d, count, dateStr: d.toISOString().slice(0, 10) })
  }
  return data
}

function intensityLevel(count: number): 0 | 1 | 2 | 3 | 4 {
  if (count === 0) return 0
  if (count <= 2) return 1
  if (count <= 6) return 2
  if (count <= 12) return 3
  return 4
}

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
const DAY_LABELS = ['','Mon','','Wed','','Fri','']

const CELL = 13
const GAP = 2
const STEP = CELL + GAP
const DAY_LABEL_W = 28

interface Props {
  label?: string
}

export default function ActivityHeatmap({ label = 'activities' }: Props) {
  const [tooltip, setTooltip] = useState<{ x: number; y: number; date: string; count: number } | null>(null)

  const { weeks, totalCount, currentStreak, longestStreak } = useMemo(() => {
    const days = generateData()
    const totalCount = days.reduce((s, d) => s + d.count, 0)

    // Streak calculation
    let cs = 0
    for (let i = days.length - 1; i >= 0; i--) {
      if (days[i].count > 0) cs++
      else break
    }
    let ls = 0
    let run = 0
    for (const d of days) {
      if (d.count > 0) { run++; if (run > ls) ls = run }
      else run = 0
    }

    // Group into weeks (columns). Pad so first day aligns to its weekday.
    const firstDayOfWeek = days[0].date.getDay() // 0=Sun
    const padded: (DayData | null)[] = [
      ...Array(firstDayOfWeek).fill(null),
      ...days,
    ]
    const weeks: (DayData | null)[][] = []
    for (let i = 0; i < padded.length; i += 7) {
      weeks.push(padded.slice(i, i + 7))
    }

    return { days, weeks, totalCount, currentStreak: cs, longestStreak: ls }
  }, [])

  // Month labels: for each week column, check if it contains the 1st of a month
  const monthLabels: { col: number; label: string }[] = []
  weeks.forEach((week, col) => {
    const first = week.find(Boolean)
    if (first && first.date.getDate() <= 7) {
      // Check it's actually the start of the month within this week
      const d = first.date
      if (d.getDate() <= 7) {
        monthLabels.push({ col, label: MONTHS[d.getMonth()] })
      }
    }
  })

  const svgW = DAY_LABEL_W + weeks.length * STEP

  return (
    <div>
      {/* Summary row */}
      <div className="flex flex-wrap items-center gap-4 mb-4">
        <span className="text-xs" style={{ color: 'var(--text-2)', fontFamily: "'Inter', sans-serif" }}>
          <span className="font-semibold" style={{ color: 'var(--text-1)' }}>{totalCount.toLocaleString()}</span>{' '}
          {label} in the last year
        </span>
        <span className="text-xs" style={{ color: 'var(--text-2)', fontFamily: "'Inter', sans-serif" }}>
          Current streak: <span className="font-semibold" style={{ color: '#3B82F6' }}>{currentStreak} days</span>
        </span>
        <span className="text-xs" style={{ color: 'var(--text-2)', fontFamily: "'Inter', sans-serif" }}>
          Longest: <span className="font-semibold" style={{ color: '#8B5CF6' }}>{longestStreak} days</span>
        </span>
      </div>

      {/* Scrollable grid */}
      <div className="overflow-x-auto relative pb-1">
        <div className="relative inline-block" style={{ minWidth: svgW + 'px' }}>
          {/* Month labels */}
          <div className="flex" style={{ marginLeft: DAY_LABEL_W + 'px', height: '20px', marginBottom: '4px' }}>
            {weeks.map((_, col) => {
              const ml = monthLabels.find(m => m.col === col)
              return (
                <div key={col} style={{ width: STEP + 'px', flexShrink: 0 }}>
                  {ml && (
                    <span className="text-xs" style={{
                      color: 'var(--text-3)',
                      fontFamily: "'Inter', sans-serif",
                      fontSize: '10px',
                      whiteSpace: 'nowrap',
                    }}>
                      {ml.label}
                    </span>
                  )}
                </div>
              )
            })}
          </div>

          {/* Day labels + grid */}
          <div className="flex">
            {/* Day labels */}
            <div style={{ width: DAY_LABEL_W + 'px', flexShrink: 0 }}>
              {DAY_LABELS.map((label, i) => (
                <div key={i} style={{
                  height: STEP + 'px',
                  display: 'flex',
                  alignItems: 'center',
                  fontSize: '9px',
                  color: 'var(--text-3)',
                  fontFamily: "'Inter', sans-serif",
                  justifyContent: 'flex-end',
                  paddingRight: '6px',
                }}>
                  {label}
                </div>
              ))}
            </div>

            {/* Cells */}
            <div className="flex gap-[2px] relative">
              {weeks.map((week, col) => (
                <div key={col} className="flex flex-col gap-[2px]">
                  {Array.from({ length: 7 }).map((_, row) => {
                    const day = week[row] ?? null
                    const level = day ? intensityLevel(day.count) : -1
                    return (
                      <div
                        key={row}
                        style={{
                          width: CELL + 'px',
                          height: CELL + 'px',
                          borderRadius: '3px',
                          backgroundColor: level < 0
                            ? 'transparent'
                            : `var(--heat-${level})`,
                          cursor: day ? 'pointer' : 'default',
                          transition: 'transform 0.1s',
                        }}
                        onMouseEnter={(e) => {
                          if (!day) return
                          const rect = e.currentTarget.getBoundingClientRect()
                          const parent = e.currentTarget.closest('.overflow-x-auto')!.getBoundingClientRect()
                          setTooltip({
                            x: rect.left - parent.left + CELL / 2,
                            y: rect.top - parent.top - 4,
                            date: day.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                            count: day.count,
                          })
                        }}
                        onMouseLeave={() => setTooltip(null)}
                      />
                    )
                  })}
                </div>
              ))}

              {/* Tooltip */}
              {tooltip && (
                <div
                  className="absolute z-50 pointer-events-none rounded-lg px-2.5 py-1.5 text-xs whitespace-nowrap"
                  style={{
                    left: tooltip.x + 'px',
                    top: tooltip.y + 'px',
                    transform: 'translate(-50%, -100%)',
                    background: 'var(--bg-surface-strong)',
                    border: '1px solid var(--border-accent)',
                    color: 'var(--text-1)',
                    fontFamily: "'Inter', sans-serif",
                    boxShadow: '0 4px 16px rgba(0,0,0,0.25)',
                  }}
                >
                  <span style={{ color: '#3B82F6', fontWeight: 600 }}>{tooltip.count} {tooltip.count === 1 ? 'activity' : 'activities'}</span>
                  {' on '}{tooltip.date}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-1.5 mt-3">
        <span className="text-xs" style={{ color: 'var(--text-3)', fontFamily: "'Inter', sans-serif", fontSize: '10px' }}>Less</span>
        {[0,1,2,3,4].map(l => (
          <div key={l} style={{
            width: CELL + 'px', height: CELL + 'px', borderRadius: '3px',
            backgroundColor: `var(--heat-${l})`,
          }} />
        ))}
        <span className="text-xs" style={{ color: 'var(--text-3)', fontFamily: "'Inter', sans-serif", fontSize: '10px' }}>More</span>
      </div>
    </div>
  )
}
