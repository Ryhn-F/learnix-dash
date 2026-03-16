import { NextResponse } from "next/server";
import { AIService } from "@/services/ai.service";
import { ChatService } from "@/services/chat.service";

export async function POST(request: Request) {
  try {
    const { sessionId, message, topic, history } = await request.json();

    if (!message) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 },
      );
    }

    // Save user message
    await ChatService.saveMessage(sessionId, {
      role: "user",
      content: message,
      timestamp: Date.now(),
    });

    // Call Gemini
    const aiResponse = await AIService.chatWithTutor(
      topic,
      message,
      history || [],
    );

    // Save AI message
    await ChatService.saveMessage(sessionId, {
      role: "assistant",
      content: aiResponse as string,
      timestamp: Date.now(),
    });

    return NextResponse.json({ result: aiResponse });
  } catch (error: any) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to chat" },
      { status: 500 },
    );
  }
}
