import { NextResponse } from "next/server";
import { AIService } from "@/services/ai.service";
import { GenerateQuizInputSchema } from "@/utils/validators";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validated = GenerateQuizInputSchema.parse(body);

    const quiz = await AIService.generateQuiz(
      validated.topic,
      validated.difficulty,
      validated.numQuestions
    );

    return NextResponse.json({ success: true, quiz });
  } catch (error: any) {
    console.error("Generate Quiz Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Internal server error" },
      { status: error.errors ? 400 : 500 }
    );
  }
}
