export interface User {
  id: string;
  email: string;
  name: string;
  created_at: string;
}

export interface UserProgressStat {
  topic: string;
  highest_score: number;
  attempts: number;
}

export interface UserProgress {
  totalAttempts: number;
  averageScore: number;
  recentTopics: string[];
  history: {
    id: string;
    topic: string;
    score: number;
    total_questions: number;
    created_at: string;
  }[];
}
