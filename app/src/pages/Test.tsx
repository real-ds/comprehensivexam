import { useState, useEffect } from 'react'
import { useQueries }  from '../context/QueryContext'
import { useProgress } from '../context/ProgressContext'
import { QuestionCard } from '../components/QuestionCard'
import { Button }       from '../components/Button'
import type { Question, TestConfig, QuizAttempt, AnswerRecord } from '../types'

const Q_COUNTS = [10, 20, 30] as const

// Small segment-button helper (no gradients, no pills)
function SegButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      style={{
        height: 36, padding: '0 16px', fontSize: 13, fontWeight: 600,
        border: active ? '1px solid var(--ink)' : '1px solid var(--border)',
        borderRadius: 8,
        background: active ? 'var(--ink)' : 'var(--surface)',
        color: active ? 'white' : 'var(--text)',
        cursor: 'pointer',
        transition: 'background 150ms ease-out, color 150ms ease-out',
      }}
    >
      {children}
    </button>
  )
}

export function Test() {
  const { topics, getRandomQuestions } = useQueries()
  const { addAttempt } = useProgress()

  const [config, setConfig] = useState<TestConfig>({
    mode: 'test',
    topics: [],
    questionCount: 10,
    difficulty: [],
    shuffleQuestions: true,
    shuffleOptions: false,
    timer: 'off',
    feedbackStyle: 'instant',
  })

  const [phase, setPhase]     = useState<'setup' | 'active' | 'results'>('setup')
  const [questions, setQs]    = useState<Question[]>([])
  const [idx, setIdx]         = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [timeLeft, setTL]     = useState<number | null>(null)
  const [startTime, setST]    = useState(0)

  const current = questions[idx]
  const isLast  = idx === questions.length - 1

  // ------------------------------------------------------------------
  // Start
  // ------------------------------------------------------------------
  const handleStart = () => {
    if (!config.topics.length) return
    let pool: Question[] = []
    config.topics.forEach((t) => { pool = [...pool, ...getRandomQuestions(t, 1000)] })
    if (config.difficulty.length) pool = pool.filter((q) => q.difficulty && config.difficulty.includes(q.difficulty))
    const count = config.questionCount === 'all' ? pool.length : Math.min(config.questionCount, pool.length)
    let selected = pool.slice(0, count)
    if (config.shuffleQuestions) selected = selected.sort(() => Math.random() - 0.5)
    setQs(selected)
    setAnswers({})
    setIdx(0)
    setPhase('active')
    setST(Date.now())
    if (config.timer !== 'off') setTL(count * 60)
  }

  // ------------------------------------------------------------------
  // Finish
  // ------------------------------------------------------------------
  const finish = (finalAnswers = answers) => {
    const endTime = Date.now()
    let correct = 0
    const records: AnswerRecord[] = questions.map((q) => {
      const sel = finalAnswers[q.id] || null
      const ok  = sel === q.correctAnswer
      if (ok) correct++
      return { questionId: q.id, selectedOption: sel, isCorrect: ok, timeSpentMs: (endTime - startTime) / questions.length, markedForReview: false, timestamp: endTime }
    })
    const attempt: QuizAttempt = {
      id: crypto.randomUUID(), mode: 'test', config,
      startedAt: startTime, completedAt: endTime,
      answers: records, score: correct, totalQuestions: questions.length, correctCount: correct, topicBreakdown: {},
    }
    addAttempt(attempt)
    setPhase('results')
  }

  // Timer
  useEffect(() => {
    if (phase !== 'active' || config.timer === 'off' || timeLeft === null || timeLeft <= 0) return
    const id = setInterval(() => {
      setTL((t) => {
        if (t !== null && t <= 1) { clearInterval(id); finish(); return 0 }
        return (t ?? 0) - 1
      })
    }, 1000)
    return () => clearInterval(id)
  }, [phase, config.timer, timeLeft])

  // ================================================================
  // SETUP screen
  // ================================================================
  if (phase === 'setup') {
    return (
      <div style={{ maxWidth: 520 }}>
        <h1 style={{ margin: '0 0 24px', fontSize: 24, fontWeight: 600, color: 'var(--text)' }}>Test Setup</h1>

        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8, padding: 24, boxShadow: 'var(--shadow-sm)' }}>
          {/* Topics */}
          <fieldset style={{ margin: 0, padding: 0, border: 'none', marginBottom: 24 }}>
            <legend style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', marginBottom: 10 }}>Topics</legend>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {topics.map((topic) => (
                <label key={topic} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 15, color: 'var(--text)', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={config.topics.includes(topic)}
                    onChange={(e) =>
                      setConfig((p) => ({
                        ...p,
                        topics: e.target.checked ? [...p.topics, topic] : p.topics.filter((t) => t !== topic),
                      }))
                    }
                    style={{ width: 16, height: 16 }}
                  />
                  {topic}
                </label>
              ))}
            </div>
          </fieldset>

          {/* Divider */}
          <div style={{ borderTop: '1px solid var(--border)', marginBottom: 24 }} />

          {/* Question count */}
          <div style={{ marginBottom: 20 }}>
            <p style={{ margin: '0 0 8px', fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>Question count</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {Q_COUNTS.map((c) => (
                <SegButton key={c} active={config.questionCount === c} onClick={() => setConfig((p) => ({ ...p, questionCount: c }))}>
                  {c}
                </SegButton>
              ))}
              <SegButton active={config.questionCount === 'all'} onClick={() => setConfig((p) => ({ ...p, questionCount: 'all' }))}>
                All
              </SegButton>
            </div>
          </div>

          {/* Feedback */}
          <div style={{ marginBottom: 20 }}>
            <p style={{ margin: '0 0 8px', fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>Feedback style</p>
            <div style={{ display: 'flex', gap: 8 }}>
              <SegButton active={config.feedbackStyle === 'instant'} onClick={() => setConfig((p) => ({ ...p, feedbackStyle: 'instant' }))}>
                Instant
              </SegButton>
              <SegButton active={config.feedbackStyle === 'end'} onClick={() => setConfig((p) => ({ ...p, feedbackStyle: 'end' }))}>
                At end
              </SegButton>
            </div>
          </div>

          {/* Shuffle */}
          <label style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: 'var(--text)', cursor: 'pointer', marginBottom: 24 }}>
            <input
              type="checkbox"
              checked={config.shuffleQuestions}
              onChange={(e) => setConfig((p) => ({ ...p, shuffleQuestions: e.target.checked }))}
              style={{ width: 16, height: 16 }}
            />
            Shuffle questions
          </label>

          <Button fullWidth onClick={handleStart} disabled={!config.topics.length}>
            Start Test
          </Button>
        </div>
      </div>
    )
  }

  // ================================================================
  // RESULTS screen
  // ================================================================
  if (phase === 'results') {
    const correct = questions.filter((q) => answers[q.id] === q.correctAnswer).length
    const pct     = Math.round((correct / questions.length) * 100)
    const wrongOnly = questions.filter((q) => answers[q.id] !== q.correctAnswer)

    return (
      <div className="space-y-8">
        {/* Score block */}
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8, padding: 32, boxShadow: 'var(--shadow-sm)' }}>
          <h1 style={{ margin: '0 0 16px', fontSize: 24, fontWeight: 600, color: 'var(--text)' }}>Test Results</h1>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 24 }}>
            <span style={{ fontSize: 32, fontWeight: 600, color: 'var(--text)', fontVariantNumeric: 'tabular-nums' }}>
              {correct}/{questions.length}
            </span>
            <span style={{ fontSize: 15, color: 'var(--text-muted)' }}>{pct}% correct</span>
          </div>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <Button
              onClick={() => {
                setPhase('setup'); setAnswers({}); setIdx(0); setQs([])
              }}
            >
              New Test
            </Button>
            {wrongOnly.length > 0 && (
              <Button
                variant="secondary"
                onClick={() => {
                  setQs(wrongOnly); setAnswers({}); setIdx(0)
                  setPhase('active'); setST(Date.now())
                }}
              >
                Retry wrong answers ({wrongOnly.length})
              </Button>
            )}
          </div>
        </div>

        {/* Review */}
        <div>
          <h2 style={{ margin: '0 0 16px', fontSize: 20, fontWeight: 600, color: 'var(--text)' }}>Question review</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {questions.map((q, i) => (
              <QuestionCard
                key={q.id}
                question={q}
                questionNumber={i + 1}
                showAnswer={true}
                userAnswer={answers[q.id]}
                meta={`Q${i + 1} · ${q.topic} · ${answers[q.id] === q.correctAnswer ? 'Correct' : answers[q.id] ? 'Wrong' : 'Skipped'}`}
              />
            ))}
          </div>
        </div>
      </div>
    )
  }

  // ================================================================
  // ACTIVE quiz
  // ================================================================
  const userAnswer  = answers[current?.id]
  const showFeedback = config.feedbackStyle === 'instant' && !!userAnswer
  const progress    = ((idx + 1) / questions.length) * 100

  return (
    <div className="space-y-5">
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 20, fontWeight: 600, color: 'var(--text)' }}>Test Mode</h1>
          <p style={{ margin: '2px 0 0', fontSize: 13, color: 'var(--text-muted)' }}>
            Question {idx + 1} of {questions.length}
          </p>
        </div>
        {timeLeft !== null && (
          <div
            className={timeLeft < 300 ? 'animate-pulse-warn' : ''}
            style={{
              fontSize: 15, fontWeight: 600, fontFamily: 'monospace', fontVariantNumeric: 'tabular-nums',
              color: timeLeft < 300 ? 'var(--wrong)' : 'var(--text)',
            }}
            role="timer"
          >
            {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}
          </div>
        )}
      </div>

      {/* Progress bar */}
      <div
        style={{ height: 8, borderRadius: 4, background: 'var(--border)', overflow: 'hidden' }}
        role="progressbar"
        aria-valuenow={idx + 1}
        aria-valuemin={1}
        aria-valuemax={questions.length}
      >
        <div style={{ height: '100%', width: `${progress}%`, background: 'var(--ink)', transition: 'width 200ms ease-out' }} />
      </div>

      {/* Card */}
      {current && (
        <QuestionCard
          question={current}
          questionNumber={idx + 1}
          selectedOption={userAnswer}
          onSelectOption={(key) => setAnswers((p) => ({ ...p, [current.id]: key }))}
          showFeedback={showFeedback}
          correctOption={current.correctAnswer}
          meta={`${current.topic}${current.difficulty ? ` · ${current.difficulty}` : ''}`}
        />
      )}

      {/* Navigation */}
      <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 4 }}>
        <Button variant="secondary" onClick={() => setIdx((i) => i - 1)} disabled={idx === 0}>
          Previous
        </Button>
        <Button onClick={() => { if (isLast) finish(); else setIdx((i) => i + 1) }}>
          {isLast ? 'Finish' : 'Next'}
        </Button>
      </div>
    </div>
  )
}