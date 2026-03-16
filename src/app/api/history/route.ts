import { ChatService } from "@/services/chat.service";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { sessionId } = await request.json();
    if (!sessionId) {
      return NextResponse.json(
        { error: "message is required" },
        { status: 400 },
      );
    }
    const res = await ChatService.getSessionMessages(sessionId);

    return NextResponse.json({ data: res });
  } catch (e: unknown) {
    console.warn(e);
  }
}
