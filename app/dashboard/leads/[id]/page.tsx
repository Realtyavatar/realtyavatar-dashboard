"use client";

import { ArrowLeft, Download, Phone, Mail, Bed, Bath, Car } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { use, useState, useEffect } from "react";

const statusBadge: Record<string, string> = {
  Hot: "bg-[#FEF2F2] border-[#FCA5A5] text-[#EF4444]",
  Warm: "bg-[#FFF7ED] border-[#FDBA74] text-[#F59E0B]",
  New: "bg-[#EFF6FF] border-[#93C5FD] text-[#2342B0]",
  Cold: "bg-gray-100 border-gray-200 text-gray-500",
};

const interestedProperties = [
  { address: "2-Bedroom Apartment in Bondi", price: "$1,150,000", type: "Sale", beds: 2, baths: 1, car: 1, status: "Requested: Section 32", time: "Apr 13 – 9:16AM", img: "#DBEAFE", listingId: "1" },
  { address: "Modern Studio in Surry Hills", price: "$750/week", type: "Lease", beds: 1, baths: 1, car: 0, status: "Under Contract", time: "Apr 13 – 9:30AM", img: "#DCF8E8", listingId: "2" },
  { address: "Family Home in Chatswood", price: "$2,300,000", type: "Sale", beds: 4, baths: 2, car: 2, status: "Offer Accepted", time: "Apr 13 – 10:05AM", img: "#FEF3C7", listingId: "3" },
];

export default function LeadDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [lead, setLead] = useState<any>(null);
  const [status, setStatus] = useState("New");
  const [notes, setNotes] = useState("");
  const [noteSaved, setNoteSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch(`/api/leads/${id}`).then(r => r.json()).then(data => {
      if (data.error) return;
      setLead(data);
      setStatus(data.status);
      setNotes(data.notes || "");
    });
  }, [id]);

  async function updateStatus(s: string) {
    setStatus(s);
    await fetch(`/api/leads/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status: s }) });
  }

  async function saveNote() {
    setSaving(true);
    await fetch(`/api/leads/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ notes }) });
    setSaving(false);
    setNoteSaved(true);
    setTimeout(() => setNoteSaved(false), 2000);
  }

  if (!lead) return <div className="p-8 text-[#6B7280] text-[13px]">Loading…</div>;

  return (
    <div className="space-y-5">
      <div className="bg-white rounded-[20px] border border-[#D9DEE9] shadow-[0_2px_12px_rgba(0,0,0,0.04)] px-7 py-5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/leads" className="w-9 h-9 flex items-center justify-center rounded-xl border border-[#D1D5DB] hover:bg-gray-50 transition-colors">
            <ArrowLeft size={16} className="text-[#6B7280]" />
          </Link>
          <h1 className="text-[26px] font-bold text-[#1F2530] tracking-[-0.03em]">{lead.name}</h1>
          <span className={`rounded-full text-xs font-semibold px-2.5 py-0.5 border ${statusBadge[status]}`}>{status}</span>
        </div>
        <button className="rounded-full border border-[#D1D5DB] bg-white text-[#404756] text-sm font-medium px-4 py-2 shadow-sm hover:bg-gray-50 transition-colors flex items-center gap-2 text-[13px]">
          <Download size={13} /> Export Lead
        </button>
      </div>

      <div className="grid grid-cols-[380px_1fr] gap-5 items-start">
        <div className="space-y-4">
          <div className="bg-white rounded-[20px] border border-[#D9DEE9] shadow-[0_2px_12px_rgba(0,0,0,0.04)] p-6 space-y-5">
            <h2 className="text-[15px] font-bold text-[#1F2530]">Lead Info</h2>
            <div className="space-y-1">
              {[
                { label: "Name", value: lead.name },
                { label: "Email", value: lead.email },
                { label: "Phone", value: lead.phone },
                { label: "Suburb", value: lead.suburb },
                { label: "Budget", value: lead.budget },
                { label: "Captured", value: lead.captured },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between items-start py-2.5 border-b border-[#F3F4F6] last:border-0">
                  <span className="text-[12px] font-medium text-[#6B7280]">{label}</span>
                  <span className="text-[13px] font-semibold text-[#1F2530] text-right max-w-[200px]">{value || "—"}</span>
                </div>
              ))}
            </div>
            <div className="flex gap-2.5">
              <a href={`mailto:${lead.email}`} className="flex-1 rounded-full border border-[#D1D5DB] bg-white text-[#404756] text-sm font-medium py-2.5 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 text-[13px]">
                <Mail size={13} /> Email
              </a>
              <a href={`tel:${lead.phone}`} className="flex-1 rounded-full bg-[#2342B0] text-white text-sm font-semibold py-2.5 hover:bg-[#1d3799] transition-colors flex items-center justify-center gap-2 text-[13px]">
                <Phone size={13} /> Call
              </a>
            </div>
          </div>

          <div className="bg-white rounded-[20px] border border-[#D9DEE9] shadow-[0_2px_12px_rgba(0,0,0,0.04)] p-5">
            <p className="text-[13px] font-semibold text-[#1F2530] mb-3">Update Status</p>
            <div className="grid grid-cols-2 gap-2">
              {(["Hot", "Warm", "New", "Cold"] as const).map(s => (
                <button key={s} onClick={() => updateStatus(s)}
                  className={`rounded-xl py-2 text-[12px] font-semibold border transition-all ${status === s ? statusBadge[s] + " shadow-sm" : "border-[#E5E7EB] bg-[#F9FAFB] text-[#6B7280] hover:border-[#D1D5DB]"}`}>
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-[20px] border border-[#D9DEE9] shadow-[0_2px_12px_rgba(0,0,0,0.04)] p-5">
            <p className="text-[13px] font-semibold text-[#1F2530] mb-3">Notes</p>
            <textarea rows={4} value={notes} onChange={e => setNotes(e.target.value)} placeholder="Add a note about this lead..." className="w-full px-3 py-2.5 text-[13px] border border-[#D1D5DB] rounded-xl resize-none focus:outline-none focus:border-[#2342B0]" />
            <button onClick={saveNote} disabled={saving}
              className={`mt-2 w-full rounded-full text-sm font-semibold py-2 transition-colors ${noteSaved ? "bg-[#ECFDF3] text-[#16A34A] border border-[#86EFAC]" : "bg-[#2342B0] text-white hover:bg-[#1d3799]"}`}>
              {noteSaved ? "✓ Saved" : saving ? "Saving…" : "Save Note"}
            </button>
          </div>
        </div>

        <div className="bg-white rounded-[20px] border border-[#D9DEE9] shadow-[0_2px_12px_rgba(0,0,0,0.04)] p-6 space-y-4">
          <h2 className="text-[15px] font-bold text-[#1F2530]">Interested Properties</h2>
          <div className="space-y-3">
            {interestedProperties.map((p) => (
              <div key={p.address} className="flex items-center gap-4 p-4 rounded-xl border border-[#E5E7EB] hover:border-[#2342B0]/30 transition-colors">
                <div className="w-16 h-16 rounded-xl shrink-0 relative" style={{ background: p.img }}>
                  <span className={`absolute top-1.5 left-1.5 text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${p.type === "Sale" ? "bg-[#ECFDF3] text-[#16A34A]" : "bg-[#EFF6FF] text-[#2342B0]"}`}>{p.type}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-semibold text-[#1F2530]">{p.address}</p>
                  <p className="text-[14px] font-bold text-[#2342B0] mt-0.5">{p.price}</p>
                  <div className="flex items-center gap-3 mt-1 text-[11px] text-[#6B7280]">
                    <span className="flex items-center gap-1"><Bed size={11} />{p.beds}</span>
                    <span className="flex items-center gap-1"><Bath size={11} />{p.baths}</span>
                    {p.car > 0 && <span className="flex items-center gap-1"><Car size={11} />{p.car}</span>}
                  </div>
                  <span className={`mt-1.5 inline-block text-[11px] font-semibold px-2 py-0.5 rounded-full ${p.status.includes("Requested") ? "bg-[#EFF6FF] text-[#2342B0]" : p.status === "Offer Accepted" ? "bg-[#ECFDF3] text-[#16A34A]" : "bg-[#FEF3C7] text-[#F59E0B]"}`}>{p.status}</span>
                </div>
                <Link href={`/dashboard/listings/${p.listingId}`} className="rounded-full border border-[#D1D5DB] bg-white text-[#404756] text-sm font-medium px-4 py-2 hover:bg-gray-50 transition-colors text-[12px] shrink-0">View Listing</Link>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-[#E5E7EB]">
            <p className="text-[13px] font-semibold text-[#1F2530] mb-3">Send Document</p>
            <div className="flex gap-3">
              <select className="flex-1 px-3 py-2.5 text-[13px] border border-[#D1D5DB] rounded-xl focus:outline-none focus:border-[#2342B0] bg-white">
                <option>Section 32 — 32 Ocean Parade</option>
                <option>Contract — 7 Hillcrest Ave</option>
                <option>Floor Plan — Penthouse 200 Spencer</option>
              </select>
              <button className="rounded-full bg-[#2342B0] text-white text-[13px] font-semibold px-5 hover:bg-[#1d3799] transition-colors">Send</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
