import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { withOrg } from "@/lib/org-db";
import { DEMO_TEAM } from "@/lib/demo-data";
import { requireAuth } from "@/lib/server-auth";

export async function GET(req: NextRequest) {
  const auth = await requireAuth(req);
  if (auth instanceof NextResponse) return auth;

  try {
    const { data, error } = await supabaseAdmin
      .from("team_members")
      .select("*")
      .eq("org_id", Number(auth.orgId))
      .order("name");
    if (error) throw error;
    if (data && data.length > 0) return NextResponse.json(data);
  } catch {}
  return NextResponse.json(DEMO_TEAM);
}

export async function POST(req: NextRequest) {
  const auth = await requireAuth(req);
  if (auth instanceof NextResponse) return auth;

  const body = await req.json();
  try {
    const { data, error } = await supabaseAdmin
      .from("team_members")
      .insert(withOrg(body, auth.orgId))
      .select()
      .single();
    if (error) throw error;
    return NextResponse.json(data, { status: 201 });
  } catch {
    return NextResponse.json({ ...body, id: Date.now().toString() }, { status: 201 });
  }
}
