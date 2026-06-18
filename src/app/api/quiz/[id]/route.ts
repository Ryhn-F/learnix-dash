import { NextResponse } from "next/server";
import { QuizService } from "@/services/quiz.service";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json({ error: "Missing quiz ID" }, { status: 400 });
    }

    const attempt = await QuizService.getQuizAttemptById(id);

    if (!attempt) {
      return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, attempt });
  } catch (error: any) {
    console.error("Quiz Detail API Error:", error);
    return NextResponse.json(
      { error: error.message || "Internal Error" },
      { status: 500 }
    );
  }
}
