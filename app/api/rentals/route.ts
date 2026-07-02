import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { withOrg } from "@/lib/org-db";
import { DEMO_RENTALS } from "@/lib/demo-data";
import { requireAuthOrWidgetKey } from "@/lib/server-auth";

export async function GET(req: NextRequest) {
  const auth = await requireAuthOrWidgetKey(req);
  if (auth instanceof NextResponse) return auth;

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");
  const search = searchParams.get("search");

  try {
    let query = supabaseAdmin
      .from("rentals")
      .select("*")
      .eq("org_id", Number(auth.orgId))
      .order("created_at", { ascending: false });
    if (status && status !== "All") query = query.eq("status", status);
    if (search) query = query.or(`address.ilike.%${search}%,suburb.ilike.%${search}%`);
    const { data, error } = await query;
    if (error) throw error;
    if (data && data.length > 0) return NextResponse.json(data);
  } catch {}

  let results = [...DEMO_RENTALS];
  if (status && status !== "All") results = results.filter(r => r.status === status);
  if (search) results = results.filter(r =>
    r.address.toLowerCase().includes(search.toLowerCase()) ||
    r.suburb.toLowerCase().includes(search.toLowerCase())
  );
  return NextResponse.json(results);
}

export async function POST(req: NextRequest) {
  const auth = await requireAuthOrWidgetKey(req);
  if (auth instanceof NextResponse) return auth;
  if (auth.role === "widget") return NextResponse.json({ error: "Read-only" }, { status: 403 });

  const body = await req.json();
  try {
    const { data, error } = await supabaseAdmin
      .from("rentals")
      .insert(withOrg(body, auth.orgId))
      .select()
      .single();
    if (error) throw error;
    return NextResponse.json(data, { status: 201 });
  } catch {
    return NextResponse.json({ ...body, id: Date.now().toString() }, { status: 201 });
  }
}
