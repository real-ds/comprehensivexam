export interface Option {
  key: string;
  text: string;
}

export interface Question {
  id: string;
  topic: string;
  subtopic?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  question: string;
  code?: string | null;
  image?: string | null;
  options: Option[];
  correctAnswer?: string | null;
  explanation?: string | null;
  marks: number;
  sourcePage?: number;
  confidence?: 'high' | 'medium' | 'low';
  needsReview?: boolean;
  reviewReason?: string | null;
  sourceSection?: string;
  sourceNumber?: number;
  extractionFlags?: string[];
}

export interface QuestionSummary {
  id: string;
  topic: string;
  subtopic?: string;
  difficulty?: string;
  sourcePage?: number;
  hasCode: boolean;
  hasImage: boolean;
  extractionFlags?: string[];
}

export interface TopicStats {
  topic: string;
  total: number;
  answered: number;
  flagged: number;
  subtopics: Record<string, number>;
}

export type QuizMode = 'study' | 'test' | 'exam';

export interface TestConfig {
  mode: 'test';
  topics: string[];
  questionCount: number | 'all';
  difficulty: string[];
  shuffleQuestions: boolean;
  shuffleOptions: boolean;
  timer: 'off' | 'per-question' | 'total';
  feedbackStyle: 'instant' | 'end';
}

export interface ExamConfig {
  mode: 'exam';
  totalQuestions: 100;
  durationMinutes: number;
  negativeMarking: number;
  shuffleQuestions: boolean;
  shuffleOptions: boolean;
  avoidRecent: boolean;
}

export interface StudyFilters {
  topic: string | 'all';
  subtopic: string | 'all';
  difficulty: string | 'all';
  bookmarked: boolean;
  notStudied: boolean;
}

export interface AnswerRecord {
  questionId: string;
  selectedOption: string | null;
  isCorrect: boolean | null;
  timeSpentMs: number;
  markedForReview: boolean;
  timestamp: number;
}

export interface QuizAttempt {
  id: string;
  mode: QuizMode;
  config: TestConfig | ExamConfig | StudyFilters;
  startedAt: number;
  completedAt?: number;
  answers: AnswerRecord[];
  score?: number;
  totalQuestions: number;
  correctCount: number;
  topicBreakdown: Record<string, { correct: number; total: number }>;
}

export interface UserProgress {
  questionStatus: Record<string, 'unstudied' | 'studied' | 'needs-revision'>;
  bookmarks: string[];
  notes: Record<string, string>;
  attempts: QuizAttempt[];
  overrides: Record<string, { answer: string; explanation: string }>;
  lastExamQuestions?: string[];
}

export interface ExamBlueprint {
  topic: string;
  allocated: number;
  available: number;
}