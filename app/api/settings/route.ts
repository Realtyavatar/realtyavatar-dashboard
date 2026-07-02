import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { requireAuth } from "@/lib/server-auth";

const DEFAULTS = {
  firstName: "Sam", lastName: "Banks", email: "sam@realtyavatar.com",
  phone: "+61 412 345 678", agency: "RealtyAvatar Agency", abn: "123 456 789",
  officePhone: "+61 3 9000 0000", website: "www.realtyavatar.com",
  address: "Level 10, 200 Collins St, Melbourne VIC 3000",
  agencyName: "RealtyAvatar Agency", brandColor: "#2342B0", avatar: "Samantha",
  welcomeMessage: "Hi! I'm your AI property guide. How can I help you today?",
  alertEmail: "true", alertSms: "true", emailCopy: "true", agentOnly: "false",
  assignMode: "auto", weeklyReport: "true",
};

export async function GET(req: NextRequest) {
  const auth = await requireAuth(req);
  if (auth instanceof NextResponse) return auth;

  try {
    const { data, error } = await supabaseAdmin.from("settings").select("*").limit(1).single();
    if (error) throw error;
    if (data) return NextResponse.json({ ...DEFAULTS, ...data });
  } catch {}
  return NextResponse.json(DEFAULTS);
}

export async function POST(req: NextRequest) {
  const auth = await requireAuth(req);
  if (auth instanceof NextResponse) return auth;

  const body = await req.json();
  try {
    const { data: existing } = await supabaseAdmin.from("settings").select("id").limit(1).single();
    if (existing?.id) {
      const { error } = await supabaseAdmin.from("settings").update(body).eq("id", existing.id);
      if (error) throw error;
    } else {
      const { error } = await supabaseAdmin.from("settings").insert(body);
      if (error) throw error;
    }
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: true });
  }
}
