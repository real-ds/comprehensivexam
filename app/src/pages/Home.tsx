import { Link } from 'react-router-dom'
import { useQueries }  from '../context/QueryContext'
import { useProgress } from '../context/ProgressContext'
import type { QuizAttempt } from '../types'
import { formatDistanceToNow } from 'date-fns'

// ---------------------------------------------------------------------------
// Mode cards config
// ---------------------------------------------------------------------------
const MODE_CARDS = [
  {
    path: '/study',
    label: 'Study',
    title: 'Study Mode',
    description: 'Browse questions with answers and explanations visible. Filter by topic, difficulty, or bookmarks.',
  },
  {
    path: '/test',
    label: 'Test',
    title: 'Test Mode',
    description: 'Practise a topic with configurable question count, timer, and instant or deferred feedback.',
  },
  {
    path: '/exam',
    label: 'Exam',
    title: 'Exam Mode',
    description: '100 questions, 100 minutes. Blind simulation with palette navigation and full post-exam review.',
  },
] as const

// ---------------------------------------------------------------------------
// Home
// ---------------------------------------------------------------------------
export function Home() {
  const { topicStats } = useQueries()
  const { getAttempts } = useProgress()
  const attempts = getAttempts()
  const recentAttempts = [...attempts].reverse().slice(0, 5)

  const totalQuestions = topicStats.reduce((s, t) => s + t.total, 0)
  const totalAnswered  = topicStats.reduce((s, t) => s + t.answered, 0)
  const totalFlagged   = topicStats.reduce((s, t) => s + t.flagged, 0)

  return (
    <div className="space-y-10">
      {/* Page header */}
      <div>
        <h1 style={{ margin: 0, fontSize: 24, fontWeight: 600, lineHeight: 1.3, color: 'var(--text)' }}>
          Comprehensive Exam Prep
        </h1>
        <p style={{ margin: '4px 0 0', fontSize: 15, color: 'var(--text-muted)' }}>
          {totalQuestions} questions across {topicStats.length} topics
          {totalAnswered > 0 && ` · ${Math.round((totalAnswered / totalQuestions) * 100)}% attempted`}
        </p>
      </div>

      {/* Mode cards */}
      <section>
        <h2 style={{ margin: '0 0 12px', fontSize: 13, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          Select mode
        </h2>
        <div style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
          {MODE_CARDS.map((mode) => (
            <div
              key={mode.path}
              style={{
                display: 'flex', flexDirection: 'column',
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: 8,
                padding: 24,
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              <h3 style={{ margin: '0 0 6px', fontSize: 15, fontWeight: 600, color: 'var(--text)' }}>
                {mode.title}
              </h3>
              <p style={{ margin: '0 0 20px', fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.6, flex: 1 }}>
                {mode.description}
              </p>
              <Link
                to={mode.path}
                style={{
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  height: 36, padding: '0 16px',
                  fontSize: 13, fontWeight: 600,
                  background: 'var(--ink)', color: 'white',
                  border: '1px solid var(--ink)',
                  borderRadius: 8,
                  textDecoration: 'none',
                  boxShadow: 'var(--shadow-sm)',
                  transition: 'background 150ms ease-out',
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = '#3a3835' }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'var(--ink)' }}
              >
                Start {mode.label}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Topic overview */}
      <section>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <h2 style={{ margin: 0, fontSize: 15, fontWeight: 600, color: 'var(--text)' }}>Topic overview</h2>
          <Link to="/study" style={{ fontSize: 13, color: 'var(--accent)' }}>Browse all</Link>
        </div>
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8, overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
          <table style={{ width: '100%', fontSize: 13, borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'var(--panel)', borderBottom: '1px solid var(--border)' }}>
                {['Topic', 'Questions', 'Attempted', 'Flagged'].map((h, i) => (
                  <th key={h} style={{ padding: '10px 16px', fontWeight: 600, color: 'var(--text-muted)', textAlign: i === 0 ? 'left' : 'right' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {topicStats.map((stat, i) => (
                <tr
                  key={stat.topic}
                  style={{ borderBottom: i < topicStats.length - 1 ? '1px solid var(--border)' : 'none' }}
                >
                  <td style={{ padding: '9px 16px', color: 'var(--text)' }}>{stat.topic}</td>
                  <td style={{ padding: '9px 16px', textAlign: 'right', color: 'var(--text)' }}>{stat.total}</td>
                  <td style={{ padding: '9px 16px', textAlign: 'right', color: 'var(--text-muted)' }}>{stat.answered}</td>
                  <td style={{ padding: '9px 16px', textAlign: 'right', color: 'var(--text-muted)' }}>{stat.flagged}</td>
                </tr>
              ))}
              <tr style={{ borderTop: '1px solid var(--border)' }}>
                <td style={{ padding: '10px 16px', fontWeight: 600, color: 'var(--text)' }}>Total</td>
                <td style={{ padding: '10px 16px', textAlign: 'right', fontWeight: 600, color: 'var(--text)' }}>{totalQuestions}</td>
                <td style={{ padding: '10px 16px', textAlign: 'right', fontWeight: 600, color: 'var(--text)' }}>{totalAnswered}</td>
                <td style={{ padding: '10px 16px', textAlign: 'right', fontWeight: 600, color: 'var(--text)' }}>{totalFlagged}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Recent attempts */}
      {recentAttempts.length > 0 && (
        <section>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <h2 style={{ margin: 0, fontSize: 15, fontWeight: 600, color: 'var(--text)' }}>Recent attempts</h2>
            <Link to="/progress" style={{ fontSize: 13, color: 'var(--accent)' }}>View all</Link>
          </div>
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8, overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
            <table style={{ width: '100%', fontSize: 13, borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'var(--panel)', borderBottom: '1px solid var(--border)' }}>
                  {['Mode', 'Score', 'Duration', 'When'].map((h) => (
                    <th key={h} style={{ padding: '10px 16px', fontWeight: 600, color: 'var(--text-muted)', textAlign: 'left' }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentAttempts.map((attempt: QuizAttempt, i) => {
                  const pct = Math.round((attempt.correctCount / attempt.totalQuestions) * 100)
                  const duration = attempt.completedAt
                    ? `${Math.floor((attempt.completedAt - attempt.startedAt) / 60000)} min`
                    : 'In progress'
                  return (
                    <tr key={attempt.id} style={{ borderBottom: i < recentAttempts.length - 1 ? '1px solid var(--border)' : 'none' }}>
                      <td style={{ padding: '9px 16px', textTransform: 'capitalize', fontWeight: 500, color: 'var(--text)' }}>{attempt.mode}</td>
                      <td style={{ padding: '9px 16px', color: 'var(--text)' }}>
                        {attempt.correctCount}/{attempt.totalQuestions}
                        <span style={{ marginLeft: 6, color: 'var(--text-muted)' }}>({pct}%)</span>
                      </td>
                      <td style={{ padding: '9px 16px', color: 'var(--text-muted)' }}>{duration}</td>
                      <td style={{ padding: '9px 16px', color: 'var(--text-muted)' }}>
                        {formatDistanceToNow(new Date(attempt.startedAt), { addSuffix: true })}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Footer actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, paddingTop: 16, borderTop: '1px solid var(--border)' }}>
        <Link
          to="/progress"
          style={{
            display: 'inline-flex', alignItems: 'center', height: 36, padding: '0 16px',
            fontSize: 13, fontWeight: 600,
            background: 'var(--surface)', color: 'var(--text)',
            border: '1px solid var(--border)',
            borderRadius: 8,
            textDecoration: 'none',
            boxShadow: 'var(--shadow-sm)',
            transition: 'border-color 150ms ease-out, box-shadow 150ms ease-out',
          }}
        >
          Progress Dashboard
        </Link>
        <button
          type="button"
          style={{ fontSize: 13, color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline', textUnderlineOffset: 2 }}
          onClick={() => {
            if (window.confirm('Reset all progress? This cannot be undone.')) {
              localStorage.clear()
              window.location.reload()
            }
          }}
        >
          Reset all progress
        </button>
      </div>
    </div>
  )
}