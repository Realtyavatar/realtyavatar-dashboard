/**
 * GET  /api/widget/key  — get current key (masked) for display in settings
 * POST /api/widget/key  — rotate / generate a new key (admin only)
 */

import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/server-auth";
import { getWidgetKeyMasked, rotateWidgetKey } from "@/lib/widget-auth";

export async function GET(req: NextRequest) {
  const auth = await requireAuth(req);
  if (auth instanceof NextResponse) return auth;

  const result = await getWidgetKeyMasked(auth.orgId);
  return NextResponse.json(result ?? { masked: "", exists: false });
}

export async function POST(req: NextRequest) {
  const auth = await requireAuth(req);
  if (auth instanceof NextResponse) return auth;

  // Accept Admin or Principal-level roles
  const adminRoles = ["Admin", "Principal Agent", "Principal", "Owner"];
  if (!adminRoles.includes(auth.role)) {
    return NextResponse.json({ error: "Admin role required" }, { status: 403 });
  }

  const newKey = await rotateWidgetKey(auth.orgId);

  // Return the full key once — the user must copy it now
  return NextResponse.json({ key: newKey, message: "Copy this key — it won't be shown in full again." });
}
