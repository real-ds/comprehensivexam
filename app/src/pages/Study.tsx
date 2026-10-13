import { useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useQueries }  from '../context/QueryContext'
import { useProgress } from '../context/ProgressContext'
import { QuestionCard } from '../components/QuestionCard'
import { Button }       from '../components/Button'
import type { Question } from '../types'

const DIFFICULTIES = ['easy', 'medium', 'hard'] as const

// Thin toggle button used in filter bar
function ToggleChip({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 6,
        fontSize: 13, color: 'var(--text)', cursor: 'pointer',
      }}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        style={{ width: 16, height: 16 }}
      />
      {label}
    </label>
  )
}

export function Study() {
  const { questions, topics } = useQueries()
  const { getQuestionStatus, isBookmarked, toggleBookmark, setNote, getNote, updateStatus, getOverride } = useProgress()
  const [searchParams, setSearchParams] = useSearchParams()

  const topicParam     = searchParams.get('topic')      || 'all'
  const subtopicParam  = searchParams.get('subtopic')   || 'all'
  const diffParam      = searchParams.get('difficulty') || 'all'
  const bookmarkedOnly = searchParams.get('bookmarked') === 'true'
  const notStudiedOnly = searchParams.get('notStudied') === 'true'

  const [filtered, setFiltered]   = useState<Question[]>([])
  const [index, setIndex]         = useState(0)
  const [showFeedback, setShow]   = useState(true)
  const [selected, setSelected]   = useState<string | null>(null)
  const [note, setNoteLocal]      = useState('')

  const updateParam = (key: string, val: string | boolean) => {
    const next = Object.fromEntries(searchParams)
    if (val === '' || val === 'all' || val === false) delete next[key]
    else next[key] = String(val)
    setSearchParams(next)
  }

  const applyFilters = useCallback(() => {
    let qs = questions
    if (topicParam    !== 'all') qs = qs.filter((q) => q.topic     === topicParam)
    if (subtopicParam !== 'all') qs = qs.filter((q) => q.subtopic  === subtopicParam)
    if (diffParam     !== 'all') qs = qs.filter((q) => q.difficulty === diffParam)
    if (bookmarkedOnly)          qs = qs.filter((q) => isBookmarked(q.id))
    if (notStudiedOnly)          qs = qs.filter((q) => getQuestionStatus(q.id) === 'unstudied')
    setFiltered(qs)
    setIndex(0)
    setSelected(null)
  }, [topicParam, subtopicParam, diffParam, bookmarkedOnly, notStudiedOnly, questions, isBookmarked, getQuestionStatus])

  useEffect(() => { applyFilters() }, [applyFilters])

  const q       = filtered[index]
  const status  = q ? getQuestionStatus(q.id) : 'unstudied'
  const bookmarked = q ? isBookmarked(q.id) : false

  useEffect(() => { if (q) setNoteLocal(getNote(q.id) || '') }, [q?.id])

  const go = (i: number) => {
    if (i >= 0 && i < filtered.length) { setIndex(i); setSelected(null) }
  }

  const subtopics = Array.from(
    new Set(
      questions
        .filter((q) => topicParam === 'all' || q.topic === topicParam)
        .map((q) => q.subtopic)
        .filter(Boolean)
    )
  ) as string[]

  // ---------------------------------------------------------------------------
  // Empty state
  // ---------------------------------------------------------------------------
  if (!q) {
    return (
      <div style={{ textAlign: 'center', padding: '64px 0' }}>
        <p style={{ fontSize: 15, color: 'var(--text-muted)', marginBottom: 16 }}>No questions match your filters.</p>
        <Button variant="secondary" onClick={() => setSearchParams({})}>Clear filters</Button>
      </div>
    )
  }

  const correctOption = getOverride(q.id)?.answer ?? q.correctAnswer ?? null
  const metaLabel = [
    q.topic,
    q.difficulty && (q.difficulty.charAt(0).toUpperCase() + q.difficulty.slice(1)),
    `${index + 1} of ${filtered.length}`,
  ].filter(Boolean).join(' · ')

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------
  return (
    <div className="space-y-5">
      {/* Filter bar */}
      <div
        style={{
          display: 'flex', flexWrap: 'wrap', gap: 8,
          paddingBottom: 16, borderBottom: '1px solid var(--border)',
        }}
      >
        {/* Topic */}
        <select
          value={topicParam}
          onChange={(e) => updateParam('topic', e.target.value)}
          style={selectStyle}
          aria-label="Filter by topic"
        >
          <option value="all">All topics</option>
          {topics.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>

        {/* Subtopic */}
        <select
          value={subtopicParam}
          onChange={(e) => updateParam('subtopic', e.target.value)}
          disabled={topicParam === 'all'}
          style={{ ...selectStyle, opacity: topicParam === 'all' ? 0.5 : 1 }}
          aria-label="Filter by subtopic"
        >
          <option value="all">All subtopics</option>
          {subtopics.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>

        {/* Difficulty */}
        <select
          value={diffParam}
          onChange={(e) => updateParam('difficulty', e.target.value)}
          style={selectStyle}
          aria-label="Filter by difficulty"
        >
          <option value="all">All difficulties</option>
          {DIFFICULTIES.map((d) => <option key={d} value={d}>{d.charAt(0).toUpperCase() + d.slice(1)}</option>)}
        </select>

        <ToggleChip label="Bookmarked"  checked={bookmarkedOnly} onChange={(v) => updateParam('bookmarked', v)} />
        <ToggleChip label="Not studied" checked={notStudiedOnly} onChange={(v) => updateParam('notStudied', v)} />
      </div>

      {/* Question card */}
      <QuestionCard
        question={q}
        selectedOption={selected}
        onSelectOption={setSelected}
        showFeedback={showFeedback}
        correctOption={correctOption}
        meta={metaLabel}
        onBookmark={() => toggleBookmark(q.id)}
        isBookmarked={bookmarked}
        onStatusChange={(s) => updateStatus(q.id, s)}
        currentStatus={status}
      />

      {/* Navigation row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Button variant="secondary" onClick={() => go(index - 1)} disabled={index === 0}>Previous</Button>
          <span style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 500, fontVariantNumeric: 'tabular-nums' }}>
            {index + 1} / {filtered.length}
          </span>
          <Button variant="secondary" onClick={() => go(index + 1)} disabled={index === filtered.length - 1}>Next</Button>
        </div>
        <Button variant="secondary" onClick={() => setShow((f) => !f)}>
          {showFeedback ? 'Hide answer' : 'Show answer'}
        </Button>
      </div>

      {/* Personal note */}
      <div>
        <label
          htmlFor={`note-${q.id}`}
          style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 6 }}
        >
          Personal note
        </label>
        <textarea
          id={`note-${q.id}`}
          value={note}
          onChange={(e) => setNoteLocal(e.target.value)}
          onBlur={() => setNote(q.id, note)}
          style={{
            width: '100%', minHeight: 80,
            padding: '8px 12px',
            border: '1px solid var(--border)', borderRadius: 6,
            background: 'var(--surface)', color: 'var(--text)',
            fontSize: 13, lineHeight: 1.6,
            resize: 'vertical',
          }}
          placeholder="Add a personal note about this question…"
        />
      </div>

      {/* Jump-to palette */}
      <div style={{ paddingTop: 12, borderTop: '1px solid var(--border)' }}>
        <h3 style={{ margin: '0 0 8px', fontSize: 13, fontWeight: 600, color: 'var(--text-muted)' }}>
          Jump to question
        </h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {filtered.map((fq, i) => {
            const isCurrent  = i === index
            const qStatus    = getQuestionStatus(fq.id)
            const qBookmarked = isBookmarked(fq.id)
            return (
              <button
                key={fq.id}
                onClick={() => go(i)}
                style={{
                  width: 32, height: 32, fontSize: 12,
                  fontWeight: isCurrent ? 600 : 400,
                  border: qBookmarked ? '2px solid var(--marked)' : '1px solid var(--border)',
                  borderRadius: 6,
                  background: isCurrent
                    ? 'var(--ink)'
                    : qStatus === 'studied'
                    ? '#e8f5e9'
                    : 'var(--panel)',
                  color: isCurrent ? 'white' : 'var(--text)',
                  cursor: 'pointer',
                }}
                aria-current={isCurrent ? 'true' : 'false'}
                aria-label={`Question ${i + 1}`}
              >
                {i + 1}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

const selectStyle: React.CSSProperties = {
  height: 36, padding: '0 10px',
  border: '1px solid var(--border)', borderRadius: 6,
  background: 'var(--surface)', color: 'var(--text)',
  fontSize: 13,
}