import { supabase } from "@/lib/supabase/supabase";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Name, email, and password are required" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const { data: existingUser } = await supabase
      .from("users")
      .select("id")
      .or(`email.eq.${email},name.eq.${name}`)
      .single();

    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email or name already exists" },
        { status: 409 }
      );
    }

    // Insert new user
    const { data: newUser, error: insertError } = await supabase
      .from("users")
      .insert([{ name, email, password }])
      .select()
      .single();

    if (insertError || !newUser) {
      console.error("Register insert error:", insertError);
      return NextResponse.json(
        { error: "Failed to create user account" },
        { status: 500 }
      );
    }

    // Return user data (exclude password)
    const { password: _, ...safeUser } = newUser;

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
        message: "Registration successful",
      },
      { status: 201 }
    );

    // Set cookie for middleware
    response.cookies.set({
      name: 'token',
      value: token,
      httpOnly: false,
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 1 week
    });

    return response;
  } catch (e: unknown) {
    console.error("Register error:", e);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
