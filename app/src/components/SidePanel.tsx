import { useState, useEffect, useCallback } from 'react'
import { NavLink, Link } from 'react-router-dom'
import { useQueries } from '../context/QueryContext'

const NAV_ITEMS = [
  { path: '/',         label: 'Home',     exact: true },
  { path: '/study',   label: 'Study'  },
  { path: '/test',    label: 'Test'   },
  { path: '/exam',    label: 'Exam'   },
  { path: '/progress', label: 'Progress' },
  { path: '/leaderboard', label: 'Leaderboard' },
] as const

function MenuIcon({ open }: { open: boolean }) {
  return (
    <svg
      width="20" height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden="true"
    >
      {open
        ? <path d="M6 18L18 6M6 6l12 12" />
        : <path d="M3 12h18M3 6h18M3 18h18" />
      }
    </svg>
  )
}

export function SidePanel({
  isExam = false,
  examPalette,
  onPaletteSelect,
  sidebarOpen = true,
}: {
  isExam?: boolean;
  examPalette?: { id: string; state: 'unanswered' | 'answered' | 'marked' | 'current' }[];
  onPaletteSelect?: (id: string) => void;
  sidebarOpen?: boolean;
}) {
  const { topics, topicStats } = useQueries()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  useEffect(() => { if (!isMobile) setMobileOpen(false) }, [isMobile])

  const close = useCallback(() => setMobileOpen(false), [])

  // ------------------------------------------------------------------
  // Exam palette sidebar
  // ------------------------------------------------------------------
  if (isExam && examPalette) {
    return (
      <aside
        className={`fixed left-0 top-0 h-full w-64 bg-panel border-r border-border z-40 transition-transform duration-default ${!sidebarOpen ? '-translate-x-full' : ''}`}
      >
        <div style={{ padding: '20px 16px', borderBottom: '1px solid var(--border)' }}>
          <h2 style={{ margin: 0, fontSize: 15, fontWeight: 600, color: 'var(--text)' }}>
            Question Palette
          </h2>
          <p style={{ margin: '4px 0 0', fontSize: 13, color: 'var(--text-muted)' }}>
            Click a number to jump
          </p>
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: 16 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 32px)', gap: 8 }}>
            {examPalette.map((item, i) => {
              const isCurrent  = item.state === 'current'
              const isAnswered = item.state === 'answered'
              const isMarked   = item.state === 'marked'
              return (
                <button
                  key={item.id}
                  onClick={() => onPaletteSelect?.(item.id)}
                  style={{
                    width: 32, height: 32,
                    fontSize: 12, fontWeight: isCurrent ? 600 : 400,
                    border: isCurrent
                      ? '2px solid var(--accent)'
                      : isMarked
                      ? '2px solid var(--marked)'
                      : '1px solid var(--border)',
                    borderRadius: 6,
                    background: isAnswered ? 'var(--ink)' : isCurrent ? 'white' : 'var(--panel)',
                    color: isAnswered && !isCurrent ? 'white' : 'var(--text)',
                    outline: isCurrent ? '2px solid var(--accent)' : 'none',
                    outlineOffset: isCurrent ? 2 : 0,
                    cursor: 'pointer',
                  }}
                  aria-label={`Question ${i + 1}, ${item.state}`}
                  aria-current={isCurrent ? 'true' : 'false'}
                >
                  {i + 1}
                </button>
              )
            })}
          </div>

          {/* Legend */}
          <div style={{ marginTop: 16, paddingTop: 12, borderTop: '1px solid var(--border)' }}>
            {[
              { label: 'Unanswered', bg: 'var(--panel)',   border: '1px solid var(--border)' },
              { label: 'Answered',   bg: 'var(--ink)',      border: '1px solid var(--ink)' },
              { label: 'Marked',     bg: 'transparent',     border: '2px solid var(--marked)' },
              { label: 'Current',    bg: 'white',           border: '2px solid var(--accent)' },
            ].map(({ label, bg, border }) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6, fontSize: 13, color: 'var(--text-muted)' }}>
                <span style={{ display: 'inline-block', width: 14, height: 14, borderRadius: 3, background: bg, border }} />
                {label}
              </div>
            ))}
          </div>
        </div>
      </aside>
    )
  }

  // ------------------------------------------------------------------
  // Normal navigation sidebar
  // ------------------------------------------------------------------
  return (
    <>
      {/* Mobile hamburger */}
      {isMobile && (
        <button
          style={{
            position: 'fixed', top: 16, left: 16, zIndex: 50,
            padding: 8,
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: 6,
            boxShadow: 'var(--shadow-sm)',
            color: 'var(--text)',
            cursor: 'pointer',
          }}
          onClick={() => setMobileOpen((o) => !o)}
          aria-expanded={mobileOpen}
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
        >
          <MenuIcon open={mobileOpen} />
        </button>
      )}

      {/* Sidebar */}
      <aside
        style={{
          position: 'fixed', inset: '0 auto 0 0',
          width: 256,
          background: 'var(--panel)',
          borderRight: '1px solid var(--border)',
          zIndex: 40,
          display: 'flex',
          flexDirection: 'column',
          transform: isMobile && !mobileOpen ? 'translateX(-100%)' : 'translateX(0)',
          transition: isMobile ? 'transform 200ms ease-out' : 'none',
        }}
        aria-label="Main navigation"
      >
        {/* App name */}
        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)' }}>
          <span style={{ fontSize: 16, fontWeight: 600, color: 'var(--text)', letterSpacing: '-0.01em' }}>
            MCQ Quiz
          </span>
        </div>

        {/* Navigation links */}
        <nav style={{ padding: '8px 12px' }} aria-label="Main">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={'exact' in item ? item.exact : false}
              onClick={isMobile ? close : undefined}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                height: 40,
                paddingLeft: 16,
                paddingRight: 16,
                fontSize: 15,
                fontWeight: isActive ? 600 : 400,
                color: isActive ? 'var(--ink)' : 'var(--text-muted)',
                borderLeft: isActive ? '3px solid var(--accent)' : '3px solid transparent',
                background: isActive ? 'var(--surface)' : 'transparent',
                boxShadow: isActive ? 'var(--shadow-sm)' : 'none',
                textDecoration: 'none',
                transition: 'color 150ms ease-out, background 150ms ease-out',
                borderRadius: '0 6px 6px 0',
              })}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Topics list */}
        <div style={{ marginTop: 'auto', borderTop: '1px solid var(--border)', padding: '12px' }}>
          <p style={{ margin: '0 0 4px', padding: '0 16px', fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Topics
          </p>
          <div style={{ maxHeight: 224, overflowY: 'auto' }}>
            {topics.map((topic) => {
              const stat = topicStats.find((s) => s.topic === topic)
              return (
                <Link
                  key={topic}
                  to={`/study?topic=${encodeURIComponent(topic)}`}
                  onClick={isMobile ? close : undefined}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    height: 36,
                    padding: '0 16px',
                    fontSize: 13,
                    color: 'var(--text-muted)',
                    textDecoration: 'none',
                    transition: 'color 150ms ease-out',
                  }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = 'var(--text)' }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = 'var(--text-muted)' }}
                >
                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{topic}</span>
                  <span style={{ marginLeft: 8, flexShrink: 0, fontWeight: 500 }}>{stat?.total ?? 0}</span>
                </Link>
              )
            })}
          </div>
        </div>
      </aside>

      {/* Mobile backdrop */}
      {isMobile && mobileOpen && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(31,29,26,0.5)', zIndex: 30 }}
          onClick={close}
          aria-hidden="true"
        />
      )}
    </>
  )
}