/**
 * GET  /api/ai-usage       — current month usage stats for the org
 * POST /api/ai-usage       — update the monthly cap (admin only)
 */

import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/server-auth";
import { getUsageStats } from "@/lib/ai-cost";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  const auth = await requireAuth(req);
  if (auth instanceof NextResponse) return auth;

  const stats = await getUsageStats(auth.orgId);
  return NextResponse.json(stats);
}

export async function POST(req: NextRequest) {
  const auth = await requireAuth(req);
  if (auth instanceof NextResponse) return auth;

  // Only admin role can update the cap
  const adminRoles = ["Admin", "Principal Agent", "Principal", "Owner"];
  if (!adminRoles.includes(auth.role)) {
    return NextResponse.json({ error: "Admin role required" }, { status: 403 });
  }

  const { capUsd } = await req.json();
  if (typeof capUsd !== "number" || capUsd < 0) {
    return NextResponse.json({ error: "capUsd must be a non-negative number" }, { status: 400 });
  }

  const prefix = auth.orgId ? `org_${auth.orgId}_` : "";
  const key = `${prefix}ai_cost_cap_usd`;

  try {
    const { data: existing } = await supabaseAdmin
      .from("settings")
      .select("key")
      .eq("key", key)
      .single();

    if (existing) {
      await supabaseAdmin.from("settings").update({ value: String(capUsd) }).eq("key", key);
    } else {
      await supabaseAdmin.from("settings").insert({ key, value: String(capUsd) });
    }
  } catch {
    // best-effort
  }

  return NextResponse.json({ success: true, capUsd });
}
