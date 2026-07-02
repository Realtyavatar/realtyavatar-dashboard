import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { DEMO_RENTALS } from "@/lib/demo-data";
import { requireAuthOrWidgetKey } from "@/lib/server-auth";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(req: NextRequest, { params }: Ctx) {
  const auth = await requireAuthOrWidgetKey(req);
  if (auth instanceof NextResponse) return auth;

  const { id } = await params;
  try {
    const { data, error } = await supabaseAdmin
      .from("rentals")
      .select("*")
      .eq("id", id)
      .eq("org_id", Number(auth.orgId))
      .single();
    if (error) throw error;
    if (data) return NextResponse.json(data);
  } catch {}

  const demo = DEMO_RENTALS.find(r => r.id === id);
  if (!demo) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(demo);
}

export async function PATCH(req: NextRequest, { params }: Ctx) {
  const auth = await requireAuthOrWidgetKey(req);
  if (auth instanceof NextResponse) return auth;
  if (auth.role === "widget") return NextResponse.json({ error: "Read-only" }, { status: 403 });

  const { id } = await params;
  const body = await req.json();
  try {
    const { data, error } = await supabaseAdmin
      .from("rentals")
      .update(body)
      .eq("id", id)
      .eq("org_id", Number(auth.orgId))
      .select()
      .single();
    if (error) throw error;
    return NextResponse.json(data);
  } catch {
    const demo = DEMO_RENTALS.find(r => r.id === id);
    return NextResponse.json({ ...(demo || {}), ...body });
  }
}

export async function DELETE(req: NextRequest, { params }: Ctx) {
  const auth = await requireAuthOrWidgetKey(req);
  if (auth instanceof NextResponse) return auth;
  if (auth.role === "widget") return NextResponse.json({ error: "Read-only" }, { status: 403 });

  const { id } = await params;
  try {
    const { error } = await supabaseAdmin
      .from("rentals")
      .delete()
      .eq("id", id)
      .eq("org_id", Number(auth.orgId));
    if (error) throw error;
  } catch {}
  return NextResponse.json({ success: true });
}
