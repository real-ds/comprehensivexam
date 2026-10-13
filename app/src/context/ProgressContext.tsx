import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react'
import type { UserProgress, QuizAttempt } from '../types'

const STORAGE_KEY = 'mcq-quiz-progress'

const defaultProgress: UserProgress = {
  questionStatus: {},
  bookmarks: [],
  notes: {},
  attempts: [],
  overrides: {},
  lastExamQuestions: [],
}

interface ProgressContextType {
  progress: UserProgress;
  loaded: boolean;
  save: (newProgress: UserProgress) => void;
  updateStatus: (questionId: string, status: 'unstudied' | 'studied' | 'needs-revision') => void;
  toggleBookmark: (questionId: string) => void;
  setNote: (questionId: string, note: string) => void;
  addAttempt: (attempt: QuizAttempt) => void;
  setOverride: (questionId: string, answer: string, explanation: string) => void;
  clearOverride: (questionId: string) => void;
  setLastExamQuestions: (ids: string[]) => void;
  exportProgress: () => string;
  importProgress: (json: string) => boolean;
  resetProgress: () => void;
  getQuestionStatus: (id: string) => 'unstudied' | 'studied' | 'needs-revision';
  isBookmarked: (id: string) => boolean;
  getNote: (id: string) => string;
  getOverride: (id: string) => { answer: string; explanation: string } | undefined;
  getLastExamQuestions: () => string[];
  getAttempts: () => QuizAttempt[];
}

const ProgressContext = createContext<ProgressContextType | null>(null)

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [progress, setProgress] = useState<UserProgress>(defaultProgress)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        setProgress({ ...defaultProgress, ...parsed })
      }
    } catch (e) {
      console.warn('Failed to load progress:', e)
    } finally {
      setLoaded(true)
    }
  }, [])

  const save = useCallback((newProgress: UserProgress) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newProgress))
      setProgress(newProgress)
    } catch (e) {
      console.error('Failed to save progress:', e)
    }
  }, [])

  const updateStatus = useCallback((questionId: string, status: 'unstudied' | 'studied' | 'needs-revision') => {
    setProgress(prev => ({
      ...prev,
      questionStatus: { ...prev.questionStatus, [questionId]: status },
    }))
  }, [])

  const toggleBookmark = useCallback((questionId: string) => {
    setProgress(prev => {
      const bookmarks = prev.bookmarks.includes(questionId)
        ? prev.bookmarks.filter(id => id !== questionId)
        : [...prev.bookmarks, questionId]
      return { ...prev, bookmarks }
    })
  }, [])

  const setNote = useCallback((questionId: string, note: string) => {
    setProgress(prev => ({
      ...prev,
      notes: { ...prev.notes, [questionId]: note },
    }))
  }, [])

  const addAttempt = useCallback((attempt: QuizAttempt) => {
    setProgress(prev => ({
      ...prev,
      attempts: [attempt, ...prev.attempts].slice(0, 100),
    }))
  }, [])

  const setOverride = useCallback((questionId: string, answer: string, explanation: string) => {
    setProgress(prev => ({
      ...prev,
      overrides: { ...prev.overrides, [questionId]: { answer, explanation } },
    }))
  }, [])

  const clearOverride = useCallback((questionId: string) => {
    setProgress(prev => {
      const { [questionId]: _, ...rest } = prev.overrides
      return { ...prev, overrides: rest }
    })
  }, [])

  const setLastExamQuestions = useCallback((ids: string[]) => {
    setProgress(prev => ({ ...prev, lastExamQuestions: ids }))
  }, [])

  const exportProgress = useCallback(() => {
    return JSON.stringify(progress, null, 2)
  }, [progress])

  const importProgress = useCallback((json: string) => {
    try {
      const parsed = JSON.parse(json)
      setProgress({ ...defaultProgress, ...parsed })
      return true
    } catch {
      return false
    }
  }, [])

  const resetProgress = useCallback(() => {
    setProgress(defaultProgress)
    localStorage.removeItem(STORAGE_KEY)
  }, [])

  const getQuestionStatus = useCallback((id: string) => progress.questionStatus[id] || 'unstudied', [progress])
  const isBookmarked = useCallback((id: string) => progress.bookmarks.includes(id), [progress])
  const getNote = useCallback((id: string) => progress.notes[id] || '', [progress])
  const getOverride = useCallback((id: string) => progress.overrides[id], [progress])
  const getLastExamQuestions = useCallback(() => progress.lastExamQuestions || [], [progress])
  const getAttempts = useCallback(() => progress.attempts, [progress])

  const value: ProgressContextType = {
    progress,
    loaded,
    save,
    updateStatus,
    toggleBookmark,
    setNote,
    addAttempt,
    setOverride,
    clearOverride,
    setLastExamQuestions,
    exportProgress,
    importProgress,
    resetProgress,
    getQuestionStatus,
    isBookmarked,
    getNote,
    getOverride,
    getLastExamQuestions,
    getAttempts,
  }

  return (
    <ProgressContext.Provider value={value}>
      {children}
    </ProgressContext.Provider>
  )
}

export function useProgress() {
  const ctx = useContext(ProgressContext)
  if (!ctx) throw new Error('useProgress must be used within ProgressProvider')
  return ctx
}