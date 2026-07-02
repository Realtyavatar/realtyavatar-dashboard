import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { DEMO_TEAM } from "@/lib/demo-data";
import { signSession, SESSION_COOKIE } from "@/lib/server-auth";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password required" }, { status: 400 });
    }

    // Fetch team member from DB
    let member: any = null;
    try {
      const { data } = await supabaseAdmin
        .from("team_members")
        .select("*")
        .eq("email", email.toLowerCase())
        .single();
      if (data) member = data;
    } catch {}

    // Fallback to demo data when Supabase not configured
    if (!member) {
      member = (DEMO_TEAM as any[]).find(
        (m) => m.email.toLowerCase() === email.toLowerCase()
      );
    }

    if (!member) {
      // Constant-time-ish delay to prevent user enumeration
      await new Promise((r) => setTimeout(r, 200));
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    // --- Password validation ---
    let valid = false;

    // bcrypt check for users who signed up via the signup form
    if (!valid && member.password_hash) {
      const { compare } = await import("bcryptjs");
      valid = await compare(password, member.password_hash);
    }

    // Fallback for demo/legacy accounts without a password_hash
    if (!valid && !member.password_hash) {
      const firstName = member.name.split(" ")[0].toLowerCase();
      valid = password === `realty${firstName}` || password === "realty123";
    }

    if (!valid) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    // Issue signed httpOnly JWT
    const token = await signSession({
      id: String(member.id),
      name: member.name,
      email: member.email,
      role: member.role,
      orgId: String(member.org_id ?? 1),  // default org 1 for existing rows
    });

    const response = NextResponse.json({
      success: true,
      user: {
        id: String(member.id),
        name: member.name,
        email: member.email,
        role: member.role,
      },
    });

    response.cookies.set(SESSION_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 8, // 8 hours
      path: "/",
    });

    return response;
  } catch (err) {
    console.error("Login error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
