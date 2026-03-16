import { NextResponse } from "next/server";
import { QuizService } from "@/services/quiz.service";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }

    const progress = await QuizService.getUserProgress(userId);

    return NextResponse.json({ success: true, progress });
  } catch (error: any) {
    console.error("Progress API Error:", error);
    return NextResponse.json({ error: error.message || "Internal Error" }, { status: 500 });
  }
}
