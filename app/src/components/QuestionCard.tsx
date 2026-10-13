import type { Question, Option } from '../types'

// ---------------------------------------------------------------------------
// OptionRow
// ---------------------------------------------------------------------------

interface OptionRowProps {
  option: Option;
  isSelected: boolean;
  isCorrect?: boolean;
  isWrong?: boolean;
  onSelect: () => void;
  showFeedback?: boolean;
  disabled?: boolean;
}

export function OptionRow({
  option,
  isSelected,
  isCorrect,
  isWrong,
  onSelect,
  showFeedback = false,
  disabled = false,
}: OptionRowProps) {
  const isCorrectAnswer = isCorrect && showFeedback
  const isUserWrong    = isWrong  && showFeedback

  // Row styles
  const rowBase = 'flex items-start gap-3 px-4 py-3 border rounded-[8px] transition-[border-color,background-color] duration-[150ms] ease-out'
  let rowExtra  = ''
  if (isCorrectAnswer)      rowExtra = 'bg-[var(--correct-bg)] border-2 border-[var(--correct)]'
  else if (isUserWrong)     rowExtra = 'bg-[var(--wrong-bg)] border-2 border-[var(--wrong)]'
  else if (isSelected)      rowExtra = 'bg-[var(--surface)] border-2 border-[var(--ink)]'
  else if (!disabled)       rowExtra = 'bg-[var(--surface)] border-[var(--border)] hover:border-[var(--accent)] cursor-pointer'
  else                      rowExtra = 'bg-[var(--surface)] border-[var(--border)]'

  // Key badge styles
  const keyBase  = 'flex-shrink-0 w-7 h-7 flex items-center justify-center text-[13px] font-semibold border rounded-[6px] transition-[background-color,color,border-color] duration-[150ms] ease-out'
  let keyExtra   = ''
  if (isCorrectAnswer)   keyExtra = 'bg-[var(--correct)] text-white border-[var(--correct)]'
  else if (isUserWrong)  keyExtra = 'bg-[var(--wrong)] text-white border-[var(--wrong)]'
  else if (isSelected)   keyExtra = 'bg-[var(--ink)] text-white border-[var(--ink)]'
  else                   keyExtra = 'bg-[var(--panel)] text-[var(--text-muted)] border-[var(--border)]'

  return (
    <div
      className={`${rowBase} ${rowExtra}`}
      onClick={!disabled ? onSelect : undefined}
      role="radio"
      aria-checked={isSelected}
      tabIndex={disabled ? -1 : 0}
      onKeyDown={(e) => {
        if (!disabled && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault()
          onSelect()
        }
      }}
    >
      <div className={`${keyBase} ${keyExtra}`}>{option.key}</div>
      <div className="flex-1 min-w-0">
        <p className="text-[15px] leading-relaxed text-[var(--text)] whitespace-pre-wrap">{option.text}</p>
        {showFeedback && isCorrectAnswer && (
          <span className="block mt-1 text-[12px] font-semibold text-[var(--correct)]">Correct</span>
        )}
        {showFeedback && isUserWrong && (
          <span className="block mt-1 text-[12px] font-semibold text-[var(--wrong)]">Your answer</span>
        )}
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// QuestionCard
// ---------------------------------------------------------------------------

interface QuestionCardProps {
  question: Question;
  selectedOption?: string | null;
  onSelectOption?: (key: string) => void;
  showFeedback?: boolean;
  correctOption?: string | null;
  meta?: string;
  onBookmark?: () => void;
  isBookmarked?: boolean;
  onStatusChange?: (status: 'unstudied' | 'studied' | 'needs-revision') => void;
  currentStatus?: 'unstudied' | 'studied' | 'needs-revision';
  // Props passed from Test/Exam result views
  showAnswer?: boolean;
  userAnswer?: string | null;
  questionNumber?: number;
}

export function QuestionCard({
  question,
  selectedOption,
  onSelectOption,
  showFeedback = false,
  correctOption,
  meta,
  onBookmark,
  isBookmarked,
  onStatusChange,
  currentStatus,
  showAnswer,
  userAnswer,
  questionNumber,
}: QuestionCardProps) {
  // Normalise dual prop shapes
  const effectiveSelected    = selectedOption ?? userAnswer ?? null
  const effectiveShowFeedback = showFeedback || showAnswer || false
  const effectiveCorrect     = correctOption ?? question.correctAnswer ?? null

  return (
    <article
      className="bg-[var(--surface)] border border-[var(--border)] rounded-[8px] p-7 shadow-[var(--shadow-md)] animate-fade-in"
      aria-label={questionNumber ? `Question ${questionNumber}` : undefined}
    >
      {/* Meta row */}
      {(meta || questionNumber) && (
        <div className="text-[13px] text-[var(--text-muted)] mb-3">
          {meta ?? `Question ${questionNumber}`}
        </div>
      )}

      {/* Question text */}
      <div className="mb-5">
        <p className="text-[17px] leading-[1.6] text-[var(--text)] whitespace-pre-wrap">
          {question.question}
        </p>
        {question.code && (
          <pre className="mt-3 px-4 py-4 bg-[var(--panel)] border border-[var(--border)] rounded-[6px] overflow-x-auto text-[13px] leading-relaxed">
            <code>{question.code}</code>
          </pre>
        )}
        {question.image && (
          <img
            src={question.image}
            alt="Question diagram"
            className="mt-3 max-w-full border border-[var(--border)] rounded-[6px]"
          />
        )}
      </div>

      {/* Options */}
      <div className="space-y-2" role="radiogroup" aria-label="Answer options">
        {question.options.map((option) => {
          const isSelected   = effectiveSelected === option.key
          const isCorrectOpt = effectiveShowFeedback && effectiveCorrect === option.key
          const isWrongOpt   = effectiveShowFeedback && effectiveSelected === option.key && effectiveSelected !== effectiveCorrect
          return (
            <OptionRow
              key={option.key}
              option={option}
              isSelected={isSelected}
              isCorrect={isCorrectOpt}
              isWrong={isWrongOpt}
              onSelect={() => !effectiveShowFeedback && onSelectOption?.(option.key)}
              showFeedback={effectiveShowFeedback}
              disabled={effectiveShowFeedback}
            />
          )
        })}
      </div>

      {/* Explanation */}
      {effectiveShowFeedback && question.explanation && (
        <div className="mt-5 p-5 bg-[var(--panel)] border border-[var(--border)] rounded-[8px]">
          <h4 className="text-[14px] font-semibold text-[var(--text)] mb-2">Explanation</h4>
          <div className="text-[14px] text-[var(--text)] leading-relaxed whitespace-pre-wrap">
            {question.explanation}
          </div>
        </div>
      )}

      {/* Footer: bookmark + status */}
      {(onBookmark || onStatusChange) && (
        <div
          className="mt-5 pt-4 flex items-center gap-4 flex-wrap"
          style={{ borderTop: '1px solid var(--border)' }}
        >
          {onBookmark && (
            <button
              type="button"
              onClick={onBookmark}
              className={[
                'flex items-center gap-1.5 text-[13px] font-medium transition-colors duration-[150ms] ease-out',
                isBookmarked ? 'text-[var(--ink)]' : 'text-[var(--text-muted)] hover:text-[var(--text)]',
              ].join(' ')}
              aria-pressed={isBookmarked}
            >
              <svg
                width="14" height="14"
                viewBox="0 0 24 24"
                fill={isBookmarked ? 'currentColor' : 'none'}
                stroke="currentColor" strokeWidth="2"
                aria-hidden="true"
              >
                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
              </svg>
              {isBookmarked ? 'Bookmarked' : 'Bookmark'}
            </button>
          )}
          {onStatusChange && (
            <div className="flex items-center gap-2">
              <label
                htmlFor={`status-${question.id}`}
                className="text-[13px] text-[var(--text-muted)] font-medium"
              >
                Status:
              </label>
              <select
                id={`status-${question.id}`}
                value={currentStatus || 'unstudied'}
                onChange={(e) => onStatusChange(e.target.value as 'unstudied' | 'studied' | 'needs-revision')}
                className="h-8 px-2 border border-[var(--border)] rounded-[6px] bg-[var(--surface)] text-[13px] text-[var(--text)]"
              >
                <option value="unstudied">Not studied</option>
                <option value="studied">Understood</option>
                <option value="needs-revision">Needs revision</option>
              </select>
            </div>
          )}
        </div>
      )}
    </article>
  )
}