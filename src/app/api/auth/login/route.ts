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

    const token = Buffer.from(`${safeUser.id}:${safeUser.email}-${Date.now()}`).toString('base64');

    const response = NextResponse.json(
      {
        data: {
          token,
          userinfo: {
            id: safeUser.id,
            name: safeUser.name,
            email: safeUser.email,
          }
        },
        message: "Login successful",
      },
      { status: 200 }
    );

    // Set cookie for middleware
    response.cookies.set({
      name: 'token',
      value: token,
      httpOnly: false, // so they could read it if they wanted
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 1 week
    });

    return response;
  } catch (e: unknown) {
    console.error("Login error:", e);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
