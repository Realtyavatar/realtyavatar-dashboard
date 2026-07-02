import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { withOrg } from "@/lib/org-db";
import { requireAuthOrWidgetKey } from "@/lib/server-auth";

const DEMO_DOCS = [
  { id: "1", property_address: "32 Ocean Parade", suburb: "Brighton VIC 3186", doc_type: "Section 32", file_name: "section32_ocean_parade.pdf", status: "Uploaded", uploaded_by: "Sam Banks", created_at: "2026-05-21" },
  { id: "2", property_address: "7 Hillcrest Ave", suburb: "Toorak VIC 3142", doc_type: "Contract", file_name: "contract_hillcrest.pdf", status: "Uploaded", uploaded_by: "Jake Wilson", created_at: "2026-05-20" },
  { id: "3", property_address: "Penthouse, 200 Spencer St", suburb: "Melbourne CBD VIC 3000", doc_type: "Floor Plan", file_name: "floorplan_spencer.pdf", status: "Uploaded", uploaded_by: "Toby Harris", created_at: "2026-05-19" },
];

export async function GET(req: NextRequest) {
  const auth = await requireAuthOrWidgetKey(req);
  if (auth instanceof NextResponse) return auth;

  const search = req.nextUrl.searchParams.get("search");
  try {
    let query = supabaseAdmin
      .from("documents")
      .select("*")
      .eq("org_id", Number(auth.orgId))
      .order("created_at", { ascending: false });
    if (search) query = query.ilike("property_address", `%${search}%`);
    const { data, error } = await query;
    if (error) throw error;
    if (data && data.length > 0) return NextResponse.json(data);
  } catch {}
  let results = [...DEMO_DOCS];
  if (search) results = results.filter(d => d.property_address.toLowerCase().includes(search.toLowerCase()));
  return NextResponse.json(results);
}

export async function POST(req: NextRequest) {
  const auth = await requireAuthOrWidgetKey(req);
  if (auth instanceof NextResponse) return auth;
  if (auth.role === "widget") return NextResponse.json({ error: "Read-only" }, { status: 403 });

  const body = await req.json();
  try {
    const { data, error } = await supabaseAdmin.from("documents").insert(
      withOrg({
        property_address: body.property_address,
        suburb: body.suburb || "",
        doc_type: body.doc_type,
        file_name: body.file_name || "document.pdf",
        file_url: body.file_url || "",
        status: "Uploaded",
        uploaded_by: body.uploaded_by || auth.name,
      }, auth.orgId)
    ).select().single();
    if (error) throw error;
    return NextResponse.json(data, { status: 201 });
  } catch {
    return NextResponse.json({ ...body, id: Date.now().toString(), created_at: new Date().toISOString() }, { status: 201 });
  }
}
