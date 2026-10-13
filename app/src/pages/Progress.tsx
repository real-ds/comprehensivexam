import { Link } from 'react-router-dom'
import { useQueries } from '../context/QueryContext'
import { useProgress } from '../context/ProgressContext'
import { formatDistanceToNow } from 'date-fns'

export function Progress() {
  const { topicStats } = useQueries()
  const { getAttempts } = useProgress()

  const attempts = getAttempts()
  const examAttempts = attempts.filter((a) => a.mode === 'exam')
  const testAttempts = attempts.filter((a) => a.mode === 'test')

  const calculateTopicPerf = (topic: string) => {
    let correct = 0
    let total = 0
    attempts.forEach((attempt) => {
      attempt.answers.forEach((answer) => {
        if (answer.questionId.startsWith(topic.substring(0, 2).toLowerCase())) {
          total++
          if (answer.isCorrect) correct++
        }
      })
    })
    return {
      topic,
      correct,
      total,
      accuracy: total > 0 ? Math.round((correct / total) * 100) : 0,
    }
  }

  const topicPerf = topicStats.map((s) => calculateTopicPerf(s.topic))
  const weakTopics = topicPerf.filter((p) => p.accuracy < 60 && p.total > 0)
  const totalQuestions = topicStats.reduce((s, t) => s + t.total, 0)
  const totalAttemptedQuestions = attempts.reduce((s, a) => s + a.totalQuestions, 0)
  const totalCorrectQuestions = attempts.reduce((s, a) => s + a.correctCount, 0)
  const overallAccuracy =
    totalAttemptedQuestions > 0
      ? Math.round((totalCorrectQuestions / totalAttemptedQuestions) * 100)
      : 0

  return (
    <div className="space-y-10">
      <div>
        <h1 style={{ margin: 0, fontSize: 24, fontWeight: 600, color: 'var(--text)' }}>
          Progress Dashboard
        </h1>
        <p style={{ margin: '4px 0 0', fontSize: 13, color: 'var(--text-muted)' }}>
          Track your performance across all topics and attempts
        </p>
      </div>

      {/* Stat cards */}
      <section>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 16 }}>
          {[
            { label: 'Total questions', value: totalQuestions },
            { label: 'Tests taken', value: testAttempts.length },
            { label: 'Exams taken', value: examAttempts.length },
            { label: 'Overall accuracy', value: attempts.length > 0 ? `${overallAccuracy}%` : '—' },
          ].map(({ label, value }) => (
            <div
              key={label}
              style={{
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: 8,
                padding: '16px 20px',
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              <p style={{ margin: '0 0 4px', fontSize: 13, color: 'var(--text-muted)' }}>{label}</p>
              <p style={{ margin: 0, fontSize: 24, fontWeight: 600, color: 'var(--text)', fontVariantNumeric: 'tabular-nums' }}>
                {value}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Topic performance */}
      <section>
        <h2 style={{ margin: '0 0 12px', fontSize: 15, fontWeight: 600, color: 'var(--text)' }}>
          Topic performance
        </h2>
        <div
          style={{
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: 8,
            overflow: 'hidden',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <table style={{ width: '100%', fontSize: 13, borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)', background: 'var(--panel)' }}>
                <th style={{ textAlign: 'left', padding: '10px 16px', fontWeight: 600, color: 'var(--text-muted)' }}>
                  Topic
                </th>
                <th style={{ textAlign: 'center', padding: '10px 16px', fontWeight: 600, color: 'var(--text-muted)' }}>
                  Accuracy
                </th>
                <th style={{ textAlign: 'center', padding: '10px 16px', fontWeight: 600, color: 'var(--text-muted)' }}>
                  Correct / Attempted
                </th>
              </tr>
            </thead>
            <tbody>
              {topicPerf.map((perf, i) => (
                <tr
                  key={perf.topic}
                  style={{ borderBottom: i < topicPerf.length - 1 ? '1px solid var(--border)' : 'none' }}
                >
                  <td style={{ padding: '9px 16px', color: 'var(--text)' }}>{perf.topic}</td>
                  <td style={{ padding: '9px 16px', textAlign: 'center' }}>
                    <span
                      style={{
                        fontWeight: 600,
                        color:
                          perf.total === 0
                            ? 'var(--text-muted)'
                            : perf.accuracy >= 80
                            ? 'var(--correct)'
                            : perf.accuracy >= 60
                            ? 'var(--marked)'
                            : 'var(--wrong)',
                      }}
                    >
                      {perf.total === 0 ? '—' : `${perf.accuracy}%`}
                    </span>
                  </td>
                  <td style={{ padding: '9px 16px', textAlign: 'center', color: 'var(--text-muted)' }}>
                    {perf.total === 0 ? '—' : `${perf.correct}/${perf.total}`}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Exam score trend */}
      {examAttempts.length > 0 && (
        <section>
          <h2 style={{ margin: '0 0 12px', fontSize: 15, fontWeight: 600, color: 'var(--text)' }}>
            Exam score trend
          </h2>
          <div
            style={{
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: 8,
              padding: 20,
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 12, height: 160 }}>
              {examAttempts.slice(-10).map((attempt, i) => {
                const pct = (attempt.correctCount / attempt.totalQuestions) * 100
                const barH = Math.max(8, (pct / 100) * 128)
                return (
                  <div
                    key={attempt.id}
                    style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}
                  >
                    <span style={{ fontSize: 11, color: 'var(--text-muted)', fontVariantNumeric: 'tabular-nums' }}>
                      {Math.round(pct)}%
                    </span>
                    <div
                      style={{
                        height: barH,
                        width: '100%',
                        maxWidth: 36,
                        background: 'var(--ink)',
                        borderRadius: '4px 4px 0 0',
                      }}
                      title={`Exam ${i + 1}: ${Math.round(pct)}%`}
                    />
                    <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{i + 1}</span>
                  </div>
                )
              })}
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginTop: 8,
                fontSize: 11,
                color: 'var(--text-muted)',
              }}
            >
              <span>Oldest</span>
              <span>Most recent</span>
            </div>
          </div>
        </section>
      )}

      {/* Recent attempts */}
      <section>
        <h2 style={{ margin: '0 0 12px', fontSize: 15, fontWeight: 600, color: 'var(--text)' }}>
          Recent attempts
        </h2>
        {attempts.length === 0 ? (
          <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>
            No attempts yet. Start studying to see your progress.
          </p>
        ) : (
          <div
            style={{
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: 8,
              overflow: 'hidden',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <table style={{ width: '100%', fontSize: 13, borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)', background: 'var(--panel)' }}>
                  <th style={{ textAlign: 'left', padding: '10px 16px', fontWeight: 600, color: 'var(--text-muted)' }}>
                    Mode
                  </th>
                  <th style={{ textAlign: 'left', padding: '10px 16px', fontWeight: 600, color: 'var(--text-muted)' }}>
                    Score
                  </th>
                  <th style={{ textAlign: 'left', padding: '10px 16px', fontWeight: 600, color: 'var(--text-muted)' }}>
                    Accuracy
                  </th>
                  <th style={{ textAlign: 'left', padding: '10px 16px', fontWeight: 600, color: 'var(--text-muted)' }}>
                    When
                  </th>
                </tr>
              </thead>
              <tbody>
                {[...attempts].reverse().slice(0, 10).map((attempt, i, arr) => (
                  <tr
                    key={attempt.id}
                    style={{ borderBottom: i < arr.length - 1 ? '1px solid var(--border)' : 'none' }}
                  >
                    <td style={{ padding: '9px 16px', textTransform: 'capitalize', fontWeight: 500, color: 'var(--text)' }}>
                      {attempt.mode}
                    </td>
                    <td style={{ padding: '9px 16px', color: 'var(--text)', fontVariantNumeric: 'tabular-nums' }}>
                      {attempt.correctCount}/{attempt.totalQuestions}
                    </td>
                    <td style={{ padding: '9px 16px' }}>
                      <span
                        style={{
                          fontWeight: 600,
                          color:
                            attempt.correctCount / attempt.totalQuestions >= 0.8
                              ? 'var(--correct)'
                              : attempt.correctCount / attempt.totalQuestions >= 0.6
                              ? 'var(--marked)'
                              : 'var(--wrong)',
                        }}
                      >
                        {Math.round((attempt.correctCount / attempt.totalQuestions) * 100)}%
                      </span>
                    </td>
                    <td style={{ padding: '9px 16px', color: 'var(--text-muted)' }}>
                      {formatDistanceToNow(new Date(attempt.startedAt), { addSuffix: true })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Weak topics */}
      {weakTopics.length > 0 && (
        <section>
          <h2 style={{ margin: '0 0 12px', fontSize: 15, fontWeight: 600, color: 'var(--text)' }}>
            Topics needing attention
          </h2>
          <div
            style={{
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: 8,
              overflow: 'hidden',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            {weakTopics.map((perf, i) => (
              <div
                key={perf.topic}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 16px',
                  borderBottom: i < weakTopics.length - 1 ? '1px solid var(--border)' : 'none',
                }}
              >
                <span style={{ fontSize: 13, color: 'var(--text)' }}>{perf.topic}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--wrong)' }}>
                    {perf.accuracy}%
                  </span>
                  <Link
                    to={`/study?topic=${encodeURIComponent(perf.topic)}`}
                    style={{ fontSize: 13, color: 'var(--accent)' }}
                  >
                    Review
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}