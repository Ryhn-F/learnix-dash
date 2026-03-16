export interface QuizQuestion {
  id?: string;
  question: string;
  options: string[];
  answer: string;
  explanation: string;
}

export interface Quiz {
  type: "quiz";
  topic: string;
  difficulty: "easy" | "medium" | "hard";
  questions: QuizQuestion[];
}

export interface QuizAttempt {
  id: string;
  user_id: string;
  topic: string;
  score: number;
  total_questions: number;
  created_at: string;
  questions?: QuizQuestion[];
}

export interface QuizGenerateRequest {
  topic: string;
  difficulty: "easy" | "medium" | "hard";
  numQuestions: number;
}

export interface QuizSubmitRequest {
  topic: string;
  score: number;
  total_questions: number;
  questions: QuizQuestion[];
}
