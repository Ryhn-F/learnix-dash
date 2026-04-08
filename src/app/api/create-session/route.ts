import { ChatService } from "@/services/chat.service";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    console.log("[create-session API] Incoming request...");
    const start = Date.now();
    
    const { userId, topic } = await request.json();
    console.log(`[create-session API] Parsed body. userId: ${userId}, topic: ${topic}`);

    console.log("[create-session API] Calling ChatService.createSession...");
    const response = await ChatService.createSession(userId, topic);
    
    const duration = Date.now() - start;
    console.log(`[create-session API] Success. Took ${duration}ms. Session ID created.`);

    return NextResponse.json({ data: response }, { status: 201 });
  } catch (e: any) {
    console.error("[create-session API] ERROR:", e);
    return NextResponse.json(
      { error: "Failed inside ChatService.createSession", details: e?.message || String(e) },
      { status: 500 }
    );
  }
}
