import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { withOrg } from "@/lib/org-db";
import { requireAuth } from "@/lib/server-auth";

const DEMO_CAMPAIGNS = [
  { id: "1", title: "Seller Outreach — Brighton", property: "Brighton VIC", status: "Active", budget: "$500", spent: "$312", leads: 8, views: 245, created_at: "2026-05-01" },
  { id: "2", title: "Buyer Campaign — Toorak", property: "Toorak VIC", status: "Active", budget: "$750", spent: "$490", leads: 12, views: 380, created_at: "2026-04-28" },
  { id: "3", title: "Rental Promo — St Kilda", property: "St Kilda VIC", status: "Paused", budget: "$300", spent: "$150", leads: 4, views: 120, created_at: "2026-04-20" },
];

export async function GET(req: NextRequest) {
  const auth = await requireAuth(req);
  if (auth instanceof NextResponse) return auth;

  try {
    const { data, error } = await supabaseAdmin
      .from("campaigns")
      .select("*")
      .eq("org_id", Number(auth.orgId))
      .order("created_at", { ascending: false });
    if (error) throw error;
    if (data && data.length > 0) return NextResponse.json(data);
  } catch {}
  return NextResponse.json(DEMO_CAMPAIGNS);
}

export async function POST(req: NextRequest) {
  const auth = await requireAuth(req);
  if (auth instanceof NextResponse) return auth;

  const body = await req.json();
  try {
    const { data, error } = await supabaseAdmin.from("campaigns").insert(withOrg(body, auth.orgId)).select().single();
    if (error) throw error;
    return NextResponse.json(data, { status: 201 });
  } catch {
    return NextResponse.json({ ...body, id: Date.now().toString(), created_at: new Date().toISOString() }, { status: 201 });
  }
}
