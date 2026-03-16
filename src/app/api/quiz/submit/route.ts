import { NextResponse } from "next/server";
import { QuizService } from "@/services/quiz.service";

export async function POST(request: Request) {
  try {
    const { userId, topic, score, questions } = await request.json();

    if (!userId || !topic || typeof score !== "number" || !questions) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const quizId = await QuizService.saveQuizAttempt(userId, topic, score, questions);

    return NextResponse.json({ success: true, quizId });
  } catch (error: any) {
    console.error("Submit Quiz Error:", error);
    return NextResponse.json({ error: error.message || "Failed to submit" }, { status: 500 });
  }
}
