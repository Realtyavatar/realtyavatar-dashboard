import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { signSession, SESSION_COOKIE } from "@/lib/server-auth";

function slugify(str: string) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export async function POST(req: NextRequest) {
  try {
    const { firstName, lastName, agencyName, email, password } = await req.json();

    if (!firstName || !lastName || !agencyName || !email || !password) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    if (password.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters" }, { status: 400 });
    }

    const emailLower = email.toLowerCase().trim();

    // Check if email already exists
    const { data: existing } = await supabaseAdmin
      .from("team_members")
      .select("id")
      .eq("email", emailLower)
      .single();

    if (existing) {
      return NextResponse.json({ error: "An account with this email already exists" }, { status: 409 });
    }

    // Create slug (ensure unique)
    let slug = slugify(agencyName);
    const { data: slugCheck } = await supabaseAdmin.from("orgs").select("id").eq("slug", slug).single();
    if (slugCheck) {
      slug = `${slug}-${Date.now()}`;
    }

    // Create org
    const { data: org, error: orgError } = await supabaseAdmin
      .from("orgs")
      .insert({ name: agencyName, slug, plan: "starter" })
      .select()
      .single();

    if (orgError || !org) {
      console.error("Org create error:", orgError);
      return NextResponse.json({ error: "Failed to create account" }, { status: 500 });
    }

    // Hash password
    const { hash } = await import("bcryptjs");
    const passwordHash = await hash(password, 10);

    // Create team member as owner
    const { data: member, error: memberError } = await supabaseAdmin
      .from("team_members")
      .insert({
        name: `${firstName} ${lastName}`,
        email: emailLower,
        role: "owner",
        org_id: org.id,
        password_hash: passwordHash,
      })
      .select()
      .single();

    if (memberError || !member) {
      console.error("Member create error:", memberError);
      // Rollback org
      await supabaseAdmin.from("orgs").delete().eq("id", org.id);
      return NextResponse.json({ error: "Failed to create account" }, { status: 500 });
    }

    // Auto sign-in
    const token = await signSession({
      id: String(member.id),
      name: member.name,
      email: member.email,
      role: member.role,
      orgId: String(org.id),
    });

    const response = NextResponse.json({
      success: true,
      user: { id: String(member.id), name: member.name, email: member.email, role: member.role },
    });

    response.cookies.set(SESSION_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 8,
      path: "/",
    });

    return response;
  } catch (err) {
    console.error("Signup error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
