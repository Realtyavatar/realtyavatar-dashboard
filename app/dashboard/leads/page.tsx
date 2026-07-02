"use client";

import { Search, ChevronDown, MoreVertical, Plus, Download, X } from "lucide-react";
import { AddressAutocomplete } from "@/components/AddressAutocomplete";
import Link from "next/link";
import { useState, useEffect, useCallback } from "react";

interface Lead {
  id: number; name: string; email: string; phone: string;
  property: string; suburb: string; budget: string; price: string;
  requested: string; status: string; notes: string; captured: string;
}

const statusBadge: Record<string, string> = {
  Hot: "bg-[#FEF2F2] border-[#FCA5A5] text-[#EF4444]",
  Warm: "bg-[#FFF7ED] border-[#FDBA74] text-[#F59E0B]",
  New: "bg-[#EFF6FF] border-[#93C5FD] text-[#2342B0]",
  Cold: "bg-gray-100 border-gray-200 text-gray-500",
};

const filters = ["All", "Hot", "Warm", "New", "Cold"];

function initials(name: string) { return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0,2); }

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [selected, setSelected] = useState<number[]>([]);
  const [newLead, setNewLead] = useState({ firstName: "", lastName: "", email: "", phone: "", property: "", status: "New" });
  const [saving, setSaving] = useState(false);

  const fetchLeads = useCallback(async () => {
    const params = new URLSearchParams();
    if (activeFilter !== "All") params.set("status", activeFilter);
    if (search) params.set("search", search);
    const res = await fetch(`/api/leads?${params}`);
    setLeads(await res.json());
    setLoading(false);
  }, [activeFilter, search]);

  useEffect(() => { fetchLeads(); }, [fetchLeads]);

  async function addLead() {
    if (!newLead.firstName) return;
    setSaving(true);
    const res = await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...newLead, name: `${newLead.firstName} ${newLead.lastName}`.trim() }),
    });
    setSaving(false);
    if (res.ok) {
      setShowAddModal(false);
      setNewLead({ firstName: "", lastName: "", email: "", phone: "", property: "", status: "New" });
      fetchLeads();
    }
  }

  function toggleSelect(id: number) {
    setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  }

  function timeAgo(dateStr: string) { return dateStr || "Recently"; }

  return (
    <div className="space-y-5">
      {showAddModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[20px] border border-[#D9DEE9] shadow-[0_8px_40px_rgba(0,0,0,0.12)] w-full max-w-md p-7">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-[18px] font-bold text-[#1F2530]">Add Lead</h2>
              <button onClick={() => setShowAddModal(false)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100"><X size={16} className="text-[#6B7280]" /></button>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-[12px] font-medium text-[#404754] mb-1.5">First Name</label><input value={newLead.firstName} onChange={e => setNewLead(p => ({...p, firstName: e.target.value}))} className="w-full px-3 py-2.5 text-[13px] border border-[#D1D5DB] rounded-xl focus:outline-none focus:border-[#2342B0]" /></div>
                <div><label className="block text-[12px] font-medium text-[#404754] mb-1.5">Last Name</label><input value={newLead.lastName} onChange={e => setNewLead(p => ({...p, lastName: e.target.value}))} className="w-full px-3 py-2.5 text-[13px] border border-[#D1D5DB] rounded-xl focus:outline-none focus:border-[#2342B0]" /></div>
              </div>
              <div><label className="block text-[12px] font-medium text-[#404754] mb-1.5">Email</label><input type="email" value={newLead.email} onChange={e => setNewLead(p => ({...p, email: e.target.value}))} className="w-full px-3 py-2.5 text-[13px] border border-[#D1D5DB] rounded-xl focus:outline-none focus:border-[#2342B0]" /></div>
              <div><label className="block text-[12px] font-medium text-[#404754] mb-1.5">Phone</label><input value={newLead.phone} onChange={e => setNewLead(p => ({...p, phone: e.target.value}))} className="w-full px-3 py-2.5 text-[13px] border border-[#D1D5DB] rounded-xl focus:outline-none focus:border-[#2342B0]" /></div>
              <div>
                <label className="block text-[12px] font-medium text-[#404754] mb-1.5">Interested Property</label>
                <AddressAutocomplete
                  value={newLead.property}
                  onChange={(address) => setNewLead(p => ({ ...p, property: address }))}
                  placeholder="Start typing an address..."
                  className="w-full px-3 py-2.5 text-[13px] border border-[#D1D5DB] rounded-xl focus:outline-none focus:border-[#2342B0]"
                />
              </div>
              <div><label className="block text-[12px] font-medium text-[#404754] mb-1.5">Status</label>
                <select value={newLead.status} onChange={e => setNewLead(p => ({...p, status: e.target.value}))} className="w-full px-3 py-2.5 text-[13px] border border-[#D1D5DB] rounded-xl focus:outline-none focus:border-[#2342B0] bg-white">
                  <option>New</option><option>Hot</option><option>Warm</option><option>Cold</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowAddModal(false)} className="flex-1 rounded-full border border-[#D1D5DB] bg-white text-[#404756] text-sm font-medium py-2.5 hover:bg-gray-50 transition-colors">Cancel</button>
              <button onClick={addLead} disabled={saving || !newLead.firstName} className="flex-1 rounded-full bg-[#2342B0] text-white text-sm font-semibold py-2.5 hover:bg-[#1d3799] transition-colors disabled:opacity-50">
                {saving ? "Saving…" : "Add Lead"}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-[20px] border border-[#D9DEE9] shadow-[0_2px_12px_rgba(0,0,0,0.04)] px-7 py-5 flex items-start justify-between">
        <div>
          <h1 className="text-[26px] font-bold text-[#1F2530] tracking-[-0.03em]">Leads</h1>
          <p className="text-[14px] text-[#6B7280] mt-0.5">View and manage leads captured by your assistant.</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="rounded-full border border-[#D1D5DB] bg-white text-[#404756] text-sm font-medium px-4 py-2 hover:bg-gray-50 transition-colors flex items-center gap-1.5 text-[13px]">
            <Download size={13} /> Export
          </button>
          <button onClick={() => setShowAddModal(true)} className="rounded-full bg-[#2342B0] text-white text-sm font-semibold px-5 py-2.5 hover:bg-[#1d3799] transition-colors flex items-center gap-2 text-[13px]">
            <Plus size={13} /> Add Lead
          </button>
        </div>
      </div>

      <div className="bg-white rounded-[20px] border border-[#D9DEE9] shadow-[0_2px_12px_rgba(0,0,0,0.04)] overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E5E7EB]">
          <div className="flex items-center gap-2">
            {filters.map(f => (
              <button key={f} onClick={() => setActiveFilter(f)}
                className={`px-3 py-1.5 rounded-full text-[12px] font-medium border transition-colors ${activeFilter === f ? "bg-[#2342B0] text-white border-[#2342B0]" : "bg-white text-[#6B7280] border-[#D1D5DB] hover:bg-gray-50"}`}>
                {f}
              </button>
            ))}
          </div>
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search leads..." className="pl-9 pr-4 py-2 text-[13px] bg-white border border-[#D1D5DB] rounded-full w-52 focus:outline-none focus:border-[#2342B0]" />
          </div>
        </div>

        <table className="w-full">
          <thead>
            <tr className="border-b border-[#E5E7EB]">
              <th className="px-6 py-3"><button onClick={() => setSelected(selected.length === leads.length ? [] : leads.map(l => l.id))} className={`w-4 h-4 rounded border flex items-center justify-center ${selected.length === leads.length && leads.length > 0 ? "bg-[#2342B0] border-[#2342B0]" : "bg-white border-[#D1D5DB]"}`}>{selected.length === leads.length && leads.length > 0 && <svg width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M1 4l3 3 5-6" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}</button></th>
              <th className="px-4 py-3 text-left text-[12px] font-semibold text-[#404754] uppercase tracking-wide">Lead</th>
              <th className="px-4 py-3 text-left text-[12px] font-semibold text-[#404754] uppercase tracking-wide">Property / Price</th>
              <th className="px-4 py-3 text-left text-[12px] font-semibold text-[#404754] uppercase tracking-wide">Requested</th>
              <th className="px-4 py-3 text-left text-[12px] font-semibold text-[#404754] uppercase tracking-wide">Status</th>
              <th className="px-4 py-3 text-left text-[12px] font-semibold text-[#404754] uppercase tracking-wide">Captured</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E5E7EB]">
            {loading ? (
              <tr><td colSpan={7} className="px-6 py-12 text-center text-[13px] text-[#6B7280]">Loading…</td></tr>
            ) : leads.length === 0 ? (
              <tr><td colSpan={7} className="px-6 py-12 text-center text-[13px] text-[#6B7280]">No leads found.</td></tr>
            ) : leads.map((lead) => (
              <tr key={lead.id} className={`transition-colors cursor-pointer ${selected.includes(lead.id) ? "bg-[#EFF6FF]" : "hover:bg-[#F9FAFB]"}`}>
                <td className="px-6 py-[18px]">
                  <button onClick={() => toggleSelect(lead.id)} className={`w-4 h-4 rounded border flex items-center justify-center ${selected.includes(lead.id) ? "bg-[#2342B0] border-[#2342B0]" : "bg-white border-[#D1D5DB]"}`}>
                    {selected.includes(lead.id) && <svg width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M1 4l3 3 5-6" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                  </button>
                </td>
                <td className="px-4 py-[18px]">
                  <Link href={`/dashboard/leads/${lead.id}`} className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-[#EAF1FF] flex items-center justify-center text-[11px] font-bold text-[#2342B0] shrink-0">{initials(lead.name)}</div>
                    <div>
                      <p className="text-[13px] font-semibold text-[#1F2530] hover:text-[#2342B0] transition-colors">{lead.name}</p>
                      <p className="text-[12px] text-[#6B7280]">{lead.email}</p>
                    </div>
                  </Link>
                </td>
                <td className="px-4 py-[18px]">
                  <p className="text-[13px] font-semibold text-[#1F2530]">{lead.price}</p>
                  <p className="text-[12px] text-[#6B7280] mt-0.5 max-w-[200px] truncate">{lead.property}</p>
                </td>
                <td className="px-4 py-[18px]"><span className="rounded-full bg-[#EFF6FF] border border-[#93C5FD] text-[#2342B0] text-xs font-semibold px-2.5 py-0.5">{lead.requested}</span></td>
                <td className="px-4 py-[18px]"><span className={`rounded-full text-xs font-semibold px-2.5 py-0.5 border ${statusBadge[lead.status] || statusBadge.New}`}>{lead.status}</span></td>
                <td className="px-4 py-[18px]"><span className="text-[13px] text-[#6B7280]">{timeAgo(lead.captured)}</span></td>
                <td className="px-4 py-[18px]"><button className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-100"><MoreVertical size={15} className="text-[#9CA3AF]" /></button></td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex items-center justify-between px-6 py-4 border-t border-[#E5E7EB]">
          <span className="text-[13px] text-[#6B7280]">{leads.length} lead{leads.length !== 1 ? "s" : ""}</span>
          <div className="flex items-center gap-2">
            <button className="rounded-full border border-[#D1D5DB] bg-white text-[#404756] text-sm font-medium px-4 py-2 hover:bg-gray-50 transition-colors text-[13px]">Previous</button>
            <button className="rounded-full border border-[#D1D5DB] bg-white text-[#404756] text-sm font-medium px-4 py-2 hover:bg-gray-50 transition-colors text-[13px]">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}
