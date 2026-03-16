import { supabase, hasSupabaseConfig } from "../lib/supabase/supabase";
import { QuizQuestion } from "../types/quiz";

export class QuizService {
  static async saveQuizAttempt(
    userId: string,
    topic: string,
    score: number,
    questions: QuizQuestion[]
  ) {
    if (!hasSupabaseConfig) {
      console.warn("Supabase not configured. Quiz attempt will not be saved.");
      return "mock-quiz-id";
    }

    const { data: attemptData, error: attemptError } = await supabase
      .from("quiz_attempts")
      .insert({
        user_id: userId,
        topic,
        score,
        total_questions: questions.length,
      })
      .select("id")
      .single();

    if (attemptError) throw new Error(attemptError.message);

    const quizId = attemptData.id;

    // Save questions
    const questionInserts = questions.map((q) => ({
      quiz_id: quizId,
      question: q.question,
      options: JSON.stringify(q.options),
      answer: q.answer,
      explanation: q.explanation,
    }));

    const { error: questionError } = await supabase
      .from("quiz_questions")
      .insert(questionInserts);

    if (questionError) throw new Error(questionError.message);

    return quizId;
  }

  static async getUserProgress(userId: string) {
    if (!hasSupabaseConfig) {
      // Return mock data
      return {
        totalAttempts: 5,
        averageScore: 75,
        recentTopics: ["Physics", "History", "Math"],
        history: [],
      };
    }

    const { data: history, error } = await supabase
      .from("quiz_attempts")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);

    const totalAttempts = history.length;
    const averageScore =
      history.reduce((acc, curr) => acc + (curr.score / curr.total_questions) * 100, 0) /
        (totalAttempts || 1);
    
    // get unique topics
    const recentTopics = Array.from(new Set(history.map((h) => h.topic))).slice(0, 3);

    return {
      totalAttempts,
      averageScore: Math.round(averageScore),
      recentTopics,
      history,
    };
  }
}
