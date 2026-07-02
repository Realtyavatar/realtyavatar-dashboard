import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { withOrg } from "@/lib/org-db";
import { DEMO_LISTINGS } from "@/lib/demo-data";
import { requireAuthOrWidgetKey } from "@/lib/server-auth";

export async function GET(req: NextRequest) {
  const auth = await requireAuthOrWidgetKey(req);
  if (auth instanceof NextResponse) return auth;

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");
  const search = searchParams.get("search");

  try {
    let query = supabaseAdmin
      .from("listings")
      .select("*")
      .eq("org_id", Number(auth.orgId))
      .order("created_at", { ascending: false });
    if (status && status !== "All") query = query.eq("status", status);
    if (search) query = query.or(`address.ilike.%${search}%,suburb.ilike.%${search}%`);
    const { data, error } = await query;
    if (error) throw error;
    if (data && data.length > 0) return NextResponse.json(data);
  } catch {}

  let results = [...DEMO_LISTINGS];
  if (status && status !== "All") results = results.filter(l => l.status === status);
  if (search) results = results.filter(l =>
    l.address.toLowerCase().includes(search.toLowerCase()) ||
    l.suburb.toLowerCase().includes(search.toLowerCase())
  );
  return NextResponse.json(results);
}

export async function POST(req: NextRequest) {
  const auth = await requireAuthOrWidgetKey(req);
  if (auth instanceof NextResponse) return auth;
  // Block widget-key callers from mutating
  if (auth.role === "widget") return NextResponse.json({ error: "Read-only" }, { status: 403 });

  const raw = await req.json();
  // Map form fields → DB columns (form sends `cars`, table has `parking`)
  const body = {
    address: raw.address,
    suburb: raw.suburb,
    price: raw.price,
    type: raw.type,
    beds: raw.beds,
    baths: raw.baths,
    parking: raw.parking ?? raw.cars ?? 0,
    status: raw.status,
  };
  try {
    const { data, error } = await supabaseAdmin
      .from("listings")
      .insert(withOrg(body, auth.orgId))
      .select()
      .single();
    if (error) throw error;
    return NextResponse.json(data, { status: 201 });
  } catch {
    return NextResponse.json({ ...body, id: Date.now().toString() }, { status: 201 });
  }
}
