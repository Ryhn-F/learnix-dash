import { supabase } from "@/lib/supabase/supabase";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { identifier, password } = await request.json();

    if (!identifier || !password) {
      return NextResponse.json(
        { error: "Email/name and password are required" },
        { status: 400 }
      );
    }

    // Try to find user by email or name
    const { data: user, error: findError } = await supabase
      .from("users")
      .select("*")
      .or(`email.eq.${identifier},name.eq.${identifier}`)
      .single();

    if (findError || !user) {
      return NextResponse.json(
        { error: "Invalid credentials. User not found." },
        { status: 401 }
      );
    }

    // Check password (plain text comparison — matches Supabase default users table)
    if (user.password !== password) {
      return NextResponse.json(
        { error: "Invalid credentials. Wrong password." },
        { status: 401 }
      );
    }

    // Return user data (exclude password)
    const { password: _, ...safeUser } = user;

    return NextResponse.json(
      {
        data: {
          id: safeUser.id,
          name: safeUser.name,
          email: safeUser.email,
        },
        message: "Login successful",
      },
      { status: 200 }
    );
  } catch (e: unknown) {
    console.error("Login error:", e);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
