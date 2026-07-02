import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { withOrg } from "@/lib/org-db";
import { DEMO_LEADS } from "@/lib/demo-data";
import { requireAuth } from "@/lib/server-auth";

// GET — authenticated (dashboard reads, org-scoped)
export async function GET(req: NextRequest) {
  const auth = await requireAuth(req);
  if (auth instanceof NextResponse) return auth;

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");
  const search = searchParams.get("search");

  try {
    let query = supabaseAdmin
      .from("leads")
      .select("*")
      .eq("org_id", Number(auth.orgId))
      .order("created_at", { ascending: false });
    if (status && status !== "All") query = query.eq("status", status);
    if (search) query = query.or(`name.ilike.%${search}%,property.ilike.%${search}%,email.ilike.%${search}%`);
    const { data, error } = await query;
    if (error) throw error;
    if (data && data.length > 0) return NextResponse.json(data);
  } catch {}

  let results = [...DEMO_LEADS];
  if (status && status !== "All") results = results.filter(l => l.status === status);
  if (search) results = results.filter(l =>
    l.name.toLowerCase().includes(search.toLowerCase()) ||
    l.property.toLowerCase().includes(search.toLowerCase()) ||
    l.email.toLowerCase().includes(search.toLowerCase())
  );
  return NextResponse.json(results);
}

// POST — public (widget + buyer portal submit leads)
// No auth required — this is the inbound lead capture endpoint.
// orgId comes from the widget embed param; falls back to 1 (default org).
export async function POST(req: NextRequest) {
  const body = await req.json();

  // Basic input validation
  if (!body.name || !body.email) {
    return NextResponse.json({ error: "name and email are required" }, { status: 400 });
  }

  const orgId = Number(body.orgId ?? 1);

  try {
    const { data, error } = await supabaseAdmin.from("leads").insert(
      withOrg({
        name: body.name,
        email: body.email || "",
        phone: body.phone || "",
        property: body.property || "",
        suburb: body.suburb || "",
        budget: body.budget || "",
        price: body.price || "",
        requested: body.requested || "Section 32",
        status: body.status || "New",
        captured: new Date().toLocaleDateString("en-AU", { day: "2-digit", month: "short", year: "numeric" }),
      }, orgId)
    ).select().single();
    if (error) throw error;
    return NextResponse.json(data, { status: 201 });
  } catch {
    const newLead = {
      ...body,
      id: Date.now().toString(),
      captured: new Date().toLocaleDateString("en-AU", { day: "2-digit", month: "short", year: "numeric" }),
      status: body.status || "New",
    };
    return NextResponse.json(newLead, { status: 201 });
  }
}
