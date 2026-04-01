import { ChatService } from "@/services/chat.service";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { userId, topic } = await request.json();

    const response = await ChatService.createSession(userId, topic);

    return NextResponse.json({ data: response }, { status: 201 });
  } catch (e) {
    console.log(e);
  }
}
