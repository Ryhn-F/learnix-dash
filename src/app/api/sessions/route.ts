import { supabase } from "@/lib/supabase/supabase";
import { NextResponse } from "next/server";
import { AIService } from "@/services/ai.service";

export const dynamic = "force-dynamic";

// GET: Fetch all chat sessions for a user
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "userId is required" },
        { status: 400 },
      );
    }

    const { data, error } = await supabase
      .from("sessions_chat")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json(
        { error: "Failed to fetch sessions" + error.message },
        { status: 500 },
      );
    }

    return NextResponse.json({ data }, { status: 200 });
  } catch (e: unknown) {
    console.error("Sessions fetch error:", e);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

// POST: Create a new chat session entry in Supabase
export async function POST(request: Request) {
  try {
    const { sessionId, userId, firstMessage } = await request.json();

    if (!sessionId || !userId) {
      return NextResponse.json(
        { error: "sessionId and userId are required" },
        { status: 400 },
      );
    }

    let chatTitle = "New Chat";
    if (firstMessage) {
      chatTitle = await AIService.generateChatTitle(firstMessage);
    }

    const { data, error } = await supabase
      .from("sessions_chat")
      .insert({
        session_id: sessionId,
        user_id: userId,
        chat_title: chatTitle,
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error("Supabase insert error:", error);
      return NextResponse.json(
        { error: "Failed to create session record" },
        { status: 500 },
      );
    }

    return NextResponse.json({ data }, { status: 201 });
  } catch (e: unknown) {
    console.error("Session create error:", e);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
