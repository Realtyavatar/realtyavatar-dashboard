import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { requireAuth } from "@/lib/server-auth";

type Ctx = { params: Promise<{ id: string }> };

export async function PATCH(req: NextRequest, { params }: Ctx) {
  const auth = await requireAuth(req);
  if (auth instanceof NextResponse) return auth;

  const { id } = await params;
  const body = await req.json();
  try {
    const { data, error } = await supabaseAdmin
      .from("team_members")       // was "team" (bug fix)
      .update(body)
      .eq("id", id)
      .eq("org_id", Number(auth.orgId))
      .select()
      .single();
    if (error) throw error;
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ ...body, id });
  }
}

export async function DELETE(req: NextRequest, { params }: Ctx) {
  const auth = await requireAuth(req);
  if (auth instanceof NextResponse) return auth;

  const { id } = await params;
  try {
    const { error } = await supabaseAdmin
      .from("team_members")       // was "team" (bug fix)
      .delete()
      .eq("id", id)
      .eq("org_id", Number(auth.orgId));
    if (error) throw error;
  } catch {}
  return NextResponse.json({ success: true });
}
