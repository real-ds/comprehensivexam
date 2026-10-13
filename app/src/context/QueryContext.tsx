import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import type { Question, TopicStats } from '../types'
import questionsJson from '../../data/questions.json'

interface QueryContextType {
  questions: Question[];
  questionsById: Map<string, Question>;
  topics: string[];
  topicStats: TopicStats[];
  loading: boolean;
  error: string | null;
  getQuestion: (id: string) => Question | undefined;
  getQuestionsByTopic: (topic: string) => Question[];
  getRandomQuestions: (topic: string, count: number, excludeIds?: string[]) => Question[];
}

const QueryContext = createContext<QueryContextType | null>(null)

export function QueryProvider({ children }: { children: ReactNode }) {
  const [questions, setQuestions] = useState<Question[]>([])
  const [questionsById, setQuestionsById] = useState<Map<string, Question>>(new Map())
  const [topics, setTopics] = useState<string[]>([])
  const [topicStats, setTopicStats] = useState<TopicStats[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    try {
      const data = questionsJson as any
      const qs: Question[] = data.questions || data
      setQuestions(qs)
      const map = new Map<string, Question>(qs.map((q: Question) => [q.id, q]))
      setQuestionsById(map)
      const topicSet = new Set<string>(qs.map((q: Question) => q.topic))
      setTopics(Array.from(topicSet).sort())
      const stats: TopicStats[] = []
      for (const topic of topicSet) {
        const tqs = qs.filter((q: Question) => q.topic === topic)
        const subtopics: Record<string, number> = {}
        for (const q of tqs) {
          if (q.subtopic) subtopics[q.subtopic] = (subtopics[q.subtopic] || 0) + 1
        }
        stats.push({
          topic,
          total: tqs.length,
          answered: tqs.filter((q: Question) => q.correctAnswer).length,
          flagged: tqs.filter((q: Question) => q.needsReview).length,
          subtopics,
        })
      }
      setTopicStats(stats)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }, [])

  const getQuestion = (id: string) => questionsById.get(id)

  const getQuestionsByTopic = (topic: string) =>
    questions.filter(q => q.topic === topic)

  const getRandomQuestions = (topic: string, count: number, excludeIds: string[] = []) => {
    const pool = questions.filter(q => q.topic === topic && !excludeIds.includes(q.id))
    const shuffled = [...pool].sort(() => Math.random() - 0.5)
    return shuffled.slice(0, count)
  }

  return (
    <QueryContext.Provider value={{
      questions,
      questionsById,
      topics,
      topicStats,
      loading,
      error,
      getQuestion,
      getQuestionsByTopic,
      getRandomQuestions,
    }}>
      {children}
    </QueryContext.Provider>
  )
}

export function useQueries() {
  const ctx = useContext(QueryContext)
  if (!ctx) throw new Error('useQueries must be used within QueryProvider')
  return ctx
}