import { useState, useEffect, useCallback } from 'react'
import { useQueries }  from '../context/QueryContext'
import { useProgress } from '../context/ProgressContext'
import { QuestionCard } from '../components/QuestionCard'
import { Button }       from '../components/Button'
import type { Question, ExamConfig, QuizAttempt, AnswerRecord, ExamBlueprint } from '../types'
import { addLeaderboardEntry } from '../utils/leaderboard'

// Small toggle button (reused from Test page pattern)
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

export function Exam() {
  const { questions, topicStats } = useQueries()
  const { addAttempt, getLastExamQuestions } = useProgress()

  const [config, setConfig] = useState<ExamConfig>({
    mode: 'exam',
    totalQuestions: 100,
    durationMinutes: 100,
    negativeMarking: 0,
    shuffleQuestions: true,
    shuffleOptions: false,
    avoidRecent: false,
  })

  const [phase, setPhase]     = useState<'setup' | 'active' | 'results'>('setup')
  const [examQs, setExamQs]   = useState<Question[]>([])
  const [idx, setIdx]         = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [marked, setMarked]   = useState<Set<string>>(new Set())
  const [timeLeft, setTL]     = useState(config.durationMinutes * 60)
  const [startTime, setST]    = useState(0)
  const [playerName, setPlayerName] = useState(() => localStorage.getItem('mcq-player-name') || '')
  const [confirmOpen, setConfirmOpen] = useState(false)

  const current     = examQs[idx]
  const answeredCnt = Object.keys(answers).length
  const markedCnt   = marked.size
  const unAnswered  = examQs.length - answeredCnt

  // ------------------------------------------------------------------
  // Blueprint
  // ------------------------------------------------------------------
  const generateBlueprint = useCallback((): ExamBlueprint[] => {
    const total = questions.length
    if (total < 100) return []
    const bp: ExamBlueprint[] = []
    let alloc = 0
    topicStats.forEach((s) => {
      const ideal  = Math.round((s.total / total) * 100)
      const actual = Math.max(1, Math.min(ideal, s.total))
      bp.push({ topic: s.topic, allocated: actual, available: s.total })
      alloc += actual
    })
    const diff = 100 - alloc
    if (diff !== 0) {
      const adj = bp.filter((b) => b.available > b.allocated)
      if (adj.length) {
        const per = Math.floor(diff / adj.length)
        const rem = diff % adj.length
        adj.forEach((b, i) => { b.allocated += per + (i < rem ? 1 : 0) })
      }
    }
    return bp
  }, [questions, topicStats])

  // ------------------------------------------------------------------
  // Start exam
  // ------------------------------------------------------------------
  const handleStart = () => {
    const blueprint = generateBlueprint()
    const recentIds = config.avoidRecent ? (getLastExamQuestions() || []) : []
    let pool: Question[] = []
    blueprint.forEach((b) => {
      const tqs     = questions.filter((q) => q.topic === b.topic && !recentIds.includes(q.id))
      const shuffled = [...tqs].sort(() => Math.random() - 0.5)
      pool = [...pool, ...shuffled.slice(0, b.allocated)]
    })
    if (pool.length < 100) {
      const rest   = questions.filter((q) => !pool.includes(q) && !recentIds.includes(q.id))
      pool = [...pool, ...rest.slice(0, 100 - pool.length)]
    }
    if (config.shuffleQuestions) pool.sort(() => Math.random() - 0.5)
    setExamQs(pool.slice(0, 100))
    setAnswers({})
    setIdx(0)
    setMarked(new Set())
    setPhase('active')
    setST(Date.now())
    setTL(config.durationMinutes * 60)
  }

  // ------------------------------------------------------------------
  // Finish exam
  // ------------------------------------------------------------------
  const finishExam = useCallback(
    (finalAnswers = answers) => {
      const endTime = Date.now()
      let correct = 0
      let rawScore = 0
      const records: AnswerRecord[] = examQs.map((q) => {
        const sel = finalAnswers[q.id] || null
        const ok  = sel === q.correctAnswer
        if (ok) { correct++; rawScore += 1 }
        else if (sel && config.negativeMarking > 0) rawScore -= config.negativeMarking
        return { questionId: q.id, selectedOption: sel, isCorrect: ok, timeSpentMs: (endTime - startTime) / examQs.length, markedForReview: marked.has(q.id), timestamp: endTime }
      })
      const attempt: QuizAttempt = {
        id: crypto.randomUUID(), mode: 'exam', config,
        startedAt: startTime, completedAt: endTime,
        answers: records, score: Math.max(0, rawScore),
        totalQuestions: examQs.length, correctCount: correct, topicBreakdown: {},
      }
      addAttempt(attempt)
      addLeaderboardEntry({
        name: playerName.trim() || 'Anonymous',
        mode: 'exam',
        score: correct,
        total: examQs.length,
        percent: Math.round((correct / examQs.length) * 100),
        topics: [],
        durationMs: endTime - startTime,
      })
      localStorage.setItem('mcq-player-name', playerName.trim())
      setPhase('results')
    },
    [answers, examQs, startTime, config, marked, addAttempt, playerName]
  )

  // Timer
  useEffect(() => {
    if (phase !== 'active' || timeLeft <= 0) return
    const id = setInterval(() => {
      setTL((t) => {
        if (t <= 1) { clearInterval(id); finishExam(); return 0 }
        return t - 1
      })
    }, 1000)
    return () => clearInterval(id)
  }, [phase, timeLeft, finishExam])

  // Unload guard
  useEffect(() => {
    if (phase !== 'active') return
    const h = (e: BeforeUnloadEvent) => { e.preventDefault(); e.returnValue = '' }
    window.addEventListener('beforeunload', h)
    return () => window.removeEventListener('beforeunload', h)
  }, [phase])

  // ================================================================
  // SETUP
  // ================================================================
  if (phase === 'setup') {
    const blueprint = generateBlueprint()
    const canStart  = questions.length >= 100

    return (
      <div style={{ maxWidth: 560 }} className="space-y-6">
        <div>
          <h1 style={{ margin: '0 0 4px', fontSize: 24, fontWeight: 600, color: 'var(--text)' }}>Exam Mode</h1>
          <p style={{ margin: 0, fontSize: 13, color: 'var(--text-muted)' }}>100 questions · 100 marks · Blind test</p>
        </div>

        {!canStart && (
          <div style={{ padding: '12px 16px', border: '1px solid var(--wrong)', borderRadius: 8, background: 'var(--wrong-bg)', fontSize: 13, color: 'var(--wrong)' }} role="alert">
            Not enough questions (need 100, have {questions.length}).
          </div>
        )}

        {/* Blueprint table */}
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8, overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ padding: '10px 16px', background: 'var(--panel)', borderBottom: '1px solid var(--border)', fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Exam Blueprint
          </div>
          <table style={{ width: '100%', fontSize: 13, borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                <th style={{ textAlign: 'left',  padding: '8px 16px', fontWeight: 600, color: 'var(--text-muted)' }}>Topic</th>
                <th style={{ textAlign: 'right', padding: '8px 16px', fontWeight: 600, color: 'var(--text-muted)' }}>Allocated</th>
                <th style={{ textAlign: 'right', padding: '8px 16px', fontWeight: 600, color: 'var(--text-muted)' }}>Available</th>
              </tr>
            </thead>
            <tbody>
              {blueprint.map((b, i) => (
                <tr key={b.topic} style={{ borderBottom: i < blueprint.length - 1 ? '1px solid var(--border)' : 'none' }}>
                  <td style={{ padding: '8px 16px', color: 'var(--text)' }}>{b.topic}</td>
                  <td style={{ padding: '8px 16px', textAlign: 'right', fontWeight: 500, color: 'var(--text)' }}>{b.allocated}</td>
                  <td style={{ padding: '8px 16px', textAlign: 'right', color: 'var(--text-muted)' }}>{b.available}</td>
                </tr>
              ))}
              <tr style={{ borderTop: '1px solid var(--border)' }}>
                <td style={{ padding: '10px 16px', fontWeight: 600, color: 'var(--text)' }}>Total</td>
                <td style={{ padding: '10px 16px', textAlign: 'right', fontWeight: 600, color: 'var(--text)' }}>
                  {blueprint.reduce((s, b) => s + b.allocated, 0)}
                </td>
                <td />
              </tr>
            </tbody>
          </table>
        </div>

        {/* Config */}
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8, padding: 24, boxShadow: 'var(--shadow-sm)' }} className="space-y-5">
          {/* Name */}
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--text)', marginBottom: 6 }}>Your name (for leaderboard)</label>
            <input
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              placeholder="Anonymous"
              style={{ height: 36, width: '100%', padding: '0 12px', border: '1px solid var(--border)', borderRadius: 6, background: 'var(--surface)', color: 'var(--text)', fontSize: 15 }}
            />
          </div>

          {/* Duration */}
          <div>
            <label htmlFor="dur" style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--text)', marginBottom: 6 }}>
              Duration (minutes)
            </label>
            <input
              id="dur"
              type="number"
              value={config.durationMinutes}
              onChange={(e) => setConfig((p) => ({ ...p, durationMinutes: parseInt(e.target.value) || 100 }))}
              min={10} max={180}
              style={{ height: 36, width: 120, padding: '0 12px', border: '1px solid var(--border)', borderRadius: 6, background: 'var(--surface)', color: 'var(--text)', fontSize: 15 }}
            />
          </div>

          {/* Negative marking */}
          <div>
            <p style={{ margin: '0 0 8px', fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>Negative marking</p>
            <div style={{ display: 'flex', gap: 8 }}>
              {([0, 0.25, 0.5] as const).map((v) => (
                <SegButton key={v} active={config.negativeMarking === v} onClick={() => setConfig((p) => ({ ...p, negativeMarking: v }))}>
                  {v === 0 ? 'Off' : `-${v}`}
                </SegButton>
              ))}
            </div>
          </div>

          {/* Options */}
          <label style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: 'var(--text)', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={config.avoidRecent}
              onChange={(e) => setConfig((p) => ({ ...p, avoidRecent: e.target.checked }))}
              style={{ width: 16, height: 16 }}
            />
            Avoid questions from last exam
          </label>

          <Button fullWidth onClick={handleStart} disabled={!canStart}>
            Start Exam
          </Button>
        </div>
      </div>
    )
  }

  // ================================================================
  // RESULTS
  // ================================================================
  if (phase === 'results') {
    const correct  = examQs.filter((q) => answers[q.id] === q.correctAnswer).length
    const wrong    = Object.keys(answers).filter((id) => answers[id] !== examQs.find((q) => q.id === id)?.correctAnswer).length
    const skipped  = examQs.length - Object.keys(answers).length
    const pct      = Math.round((correct / examQs.length) * 100)
    const rawScore = correct - wrong * config.negativeMarking

    return (
      <div className="space-y-8">
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8, padding: 32, boxShadow: 'var(--shadow-sm)' }}>
          <h1 style={{ margin: '0 0 16px', fontSize: 24, fontWeight: 600, color: 'var(--text)' }}>Exam Results</h1>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 16 }}>
            <span style={{ fontSize: 32, fontWeight: 600, color: 'var(--text)', fontVariantNumeric: 'tabular-nums' }}>{correct}/100</span>
            <span style={{ fontSize: 15, color: 'var(--text-muted)' }}>{pct}%</span>
          </div>
          <div style={{ display: 'flex', gap: 24, fontSize: 13, color: 'var(--text-muted)', marginBottom: 24, flexWrap: 'wrap' }}>
            <span><strong style={{ color: 'var(--correct)' }}>{correct}</strong> correct</span>
            <span><strong style={{ color: 'var(--wrong)' }}>{wrong}</strong> wrong</span>
            <span><strong style={{ color: 'var(--text)' }}>{skipped}</strong> skipped</span>
            {config.negativeMarking > 0 && (
              <span>Raw score: <strong style={{ color: 'var(--text)' }}>{Math.max(0, rawScore).toFixed(2)}</strong></span>
            )}
          </div>
          <Button onClick={() => { setPhase('setup'); setAnswers({}); setIdx(0); setExamQs([]); setMarked(new Set()) }}>
            New Exam
          </Button>
        </div>

        <div>
          <h2 style={{ margin: '0 0 16px', fontSize: 20, fontWeight: 600, color: 'var(--text)' }}>Full Review</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {examQs.map((q, i) => (
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
  // ACTIVE EXAM
  // ================================================================
  const userAnswer = answers[current?.id]
  const isMarkedQ  = marked.has(current?.id)
  const progress   = ((idx + 1) / examQs.length) * 100
  const isWarning  = timeLeft < 300

  return (
    <div className="space-y-5">
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 20, fontWeight: 600, color: 'var(--text)' }}>Exam Mode</h1>
          <p style={{ margin: '2px 0 0', fontSize: 13, color: 'var(--text-muted)' }}>
            {answeredCnt} answered · {unAnswered} remaining
            {markedCnt > 0 && ` · ${markedCnt} marked`}
          </p>
        </div>
        <div
          className={isWarning ? 'animate-pulse-warn' : ''}
          style={{ fontSize: 16, fontWeight: 600, fontFamily: 'monospace', fontVariantNumeric: 'tabular-nums', color: isWarning ? 'var(--wrong)' : 'var(--text)' }}
          role="timer"
          aria-label={`${Math.floor(timeLeft / 60)} minutes remaining`}
        >
          {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ height: 8, borderRadius: 4, background: 'var(--border)', overflow: 'hidden' }} role="progressbar" aria-valuenow={idx + 1} aria-valuemax={examQs.length}>
        <div style={{ height: '100%', width: `${progress}%`, background: 'var(--ink)', transition: 'width 200ms ease-out' }} />
      </div>

      {/* Question card */}
      {current && (
        <QuestionCard
          question={current}
          questionNumber={idx + 1}
          selectedOption={userAnswer}
          onSelectOption={(key) => setAnswers((p) => ({ ...p, [current.id]: key }))}
          showFeedback={false}
          meta={`Q${idx + 1} of ${examQs.length} · ${current.topic}`}
        />
      )}

      {/* Controls */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div style={{ display: 'flex', gap: 8 }}>
          <Button variant="secondary" onClick={() => setIdx((i) => i - 1)} disabled={idx === 0}>Previous</Button>
          <Button variant="secondary" onClick={() => setIdx((i) => i + 1)} disabled={idx === examQs.length - 1}>Next</Button>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            onClick={() =>
              setMarked((prev) => {
                const next = new Set(prev)
                next.has(current.id) ? next.delete(current.id) : next.add(current.id)
                return next
              })
            }
            style={{
              height: 40, padding: '0 16px', fontSize: 15, fontWeight: 600,
              border: isMarkedQ ? '2px solid var(--marked)' : '1px solid var(--border)',
              borderRadius: 8,
              background: 'var(--surface)',
              color: isMarkedQ ? 'var(--marked)' : 'var(--text)',
              cursor: 'pointer',
              transition: 'border-color 150ms, color 150ms',
            }}
          >
            {isMarkedQ ? 'Unmark' : 'Mark for review'}
          </button>
          <Button onClick={() => setConfirmOpen(true)}>Submit exam</Button>
        </div>
      </div>

      {/* Question Palette */}
      <div style={{ background: 'var(--panel)', border: '1px solid var(--border)', borderRadius: 8, padding: 16 }}>
        <h3 style={{ margin: '0 0 12px', fontSize: 13, fontWeight: 600, color: 'var(--text-muted)' }}>Question palette</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, 32px)', gap: 6 }}>
          {examQs.map((q, i) => {
            const isAns    = !!answers[q.id]
            const isMarkedP = marked.has(q.id)
            const isCur    = i === idx
            return (
              <button
                key={q.id}
                onClick={() => setIdx(i)}
                style={{
                  width: 32, height: 32, fontSize: 12,
                  fontWeight: isCur ? 600 : 400,
                  border: isCur
                    ? '2px solid var(--accent)'
                    : isMarkedP
                    ? '2px solid var(--marked)'
                    : '1px solid var(--border)',
                  borderRadius: 6,
                  background: isAns && !isCur ? 'var(--ink)' : isCur ? 'white' : 'var(--panel)',
                  color: isAns && !isCur ? 'white' : 'var(--text)',
                  outline: isCur ? '2px solid var(--accent)' : 'none',
                  outlineOffset: isCur ? 2 : 0,
                  cursor: 'pointer',
                }}
                aria-label={`Q${i + 1}${isAns ? ', answered' : ''}${isMarkedP ? ', marked' : ''}${isCur ? ', current' : ''}`}
                aria-current={isCur ? 'true' : 'false'}
              >
                {i + 1}
              </button>
            )
          })}
        </div>
        {/* Legend */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, marginTop: 12, paddingTop: 12, borderTop: '1px solid var(--border)', fontSize: 12, color: 'var(--text-muted)' }}>
          {[
            { label: 'Unanswered', bg: 'var(--panel)',   border: '1px solid var(--border)' },
            { label: 'Answered',   bg: 'var(--ink)',      border: '1px solid var(--ink)' },
            { label: 'Marked',     bg: 'transparent',     border: '2px solid var(--marked)' },
            { label: 'Current',    bg: 'white',           border: '2px solid var(--accent)' },
          ].map(({ label, bg, border }) => (
            <span key={label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ display: 'inline-block', width: 12, height: 12, borderRadius: 3, background: bg, border }} />
              {label}
            </span>
          ))}
        </div>
      </div>

      {/* Confirm submit dialog */}
      {confirmOpen && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(31,29,26,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }}
          onClick={(e) => e.target === e.currentTarget && setConfirmOpen(false)}
        >
          <div
            className="animate-fade-in"
            style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8, padding: 24, maxWidth: 380, width: '90%', boxShadow: 'var(--shadow-md)' }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="confirm-title"
          >
            <h2 id="confirm-title" style={{ margin: '0 0 16px', fontSize: 18, fontWeight: 600, color: 'var(--text)' }}>
              Submit exam?
            </h2>
            <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 24, lineHeight: 1.8 }}>
              <div><strong style={{ color: 'var(--text)' }}>{answeredCnt}</strong> answered</div>
              <div><strong style={{ color: 'var(--text)' }}>{unAnswered}</strong> unanswered</div>
              {markedCnt > 0 && (
                <div><strong style={{ color: 'var(--marked)' }}>{markedCnt}</strong> marked for review</div>
              )}
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
              <Button variant="secondary" onClick={() => setConfirmOpen(false)}>Continue exam</Button>
              <Button onClick={() => { setConfirmOpen(false); finishExam() }}>Submit</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}