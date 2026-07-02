"use client";

import { Plus, ChevronDown, MoreVertical, X, Pause, Play, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";

interface Campaign { id: number; suburb: string; status: string; leads_captured: number; clicks: number; last_sent: string; }

const statusBadge: Record<string, string> = {
  Active: "bg-[#ECFDF3] border-[#86EFAC] text-[#16A34A]",
  Paused: "bg-[#FEF2F2] border-[#FCA5A5] text-[#EF4444]",
  Draft: "bg-[#FFF7ED] border-[#FDBA74] text-[#F59E0B]",
};

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [openMenu, setOpenMenu] = useState<number | null>(null);
  const [form, setForm] = useState({ suburb: "", radius: "10 km", type: "Seller Outreach", message: "" });
  const [saving, setSaving] = useState(false);

  async function fetchCampaigns() {
    const res = await fetch("/api/campaigns");
    setCampaigns(await res.json());
    setLoading(false);
  }

  useEffect(() => { fetchCampaigns(); }, []);

  async function createCampaign() {
    if (!form.suburb) return;
    setSaving(true);
    const res = await fetch("/api/campaigns", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: `${form.type} — ${form.suburb}`, property: form.suburb, status: "Active", budget: "$0", spent: "$0", leads: 0, views: 0 })
    });
    setSaving(false);
    if (res.ok) {
      setShowModal(false);
      setForm({ suburb: "", radius: "10 km", type: "Seller Outreach", message: "" });
      fetchCampaigns();
    }
  }

  async function toggleStatus(c: Campaign) {
    const newStatus = c.status === "Active" ? "Paused" : "Active";
    await fetch(`/api/campaigns/${c.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status: newStatus }) });
    setOpenMenu(null);
    fetchCampaigns();
  }

  async function deleteCampaign(id: number) {
    await fetch(`/api/campaigns/${id}`, { method: "DELETE" });
    setOpenMenu(null);
    fetchCampaigns();
  }

  return (
    <div className="space-y-5">
      {showModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[20px] border border-[#D9DEE9] shadow-[0_8px_40px_rgba(0,0,0,0.12)] w-full max-w-md p-7">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-[18px] font-bold text-[#1F2530]">Create a Campaign</h2>
              <button onClick={() => setShowModal(false)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100"><X size={16} className="text-[#6B7280]" /></button>
            </div>
            <div className="space-y-4">
              <div><label className="block text-[12px] font-medium text-[#404754] mb-1.5">Suburb / Area</label><input value={form.suburb} onChange={e => setForm(p => ({...p, suburb: e.target.value}))} placeholder="e.g. Bondi, NSW" className="w-full px-3 py-2.5 text-[13px] border border-[#D1D5DB] rounded-xl focus:outline-none focus:border-[#2342B0]" /></div>
              <div><label className="block text-[12px] font-medium text-[#404754] mb-1.5">Target Radius</label>
                <select value={form.radius} onChange={e => setForm(p => ({...p, radius: e.target.value}))} className="w-full px-3 py-2.5 text-[13px] border border-[#D1D5DB] rounded-xl focus:outline-none focus:border-[#2342B0] bg-white">
                  <option>5 km</option><option>10 km</option><option>20 km</option>
                </select>
              </div>
              <div><label className="block text-[12px] font-medium text-[#404754] mb-1.5">Campaign Type</label>
                <select value={form.type} onChange={e => setForm(p => ({...p, type: e.target.value}))} className="w-full px-3 py-2.5 text-[13px] border border-[#D1D5DB] rounded-xl focus:outline-none focus:border-[#2342B0] bg-white">
                  <option>Seller Outreach</option><option>Buyer Nurture</option>
                </select>
              </div>
              <div><label className="block text-[12px] font-medium text-[#404754] mb-1.5">Message</label><textarea rows={3} value={form.message} onChange={e => setForm(p => ({...p, message: e.target.value}))} placeholder="Your campaign message..." className="w-full px-3 py-2.5 text-[13px] border border-[#D1D5DB] rounded-xl resize-none focus:outline-none focus:border-[#2342B0]" /></div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowModal(false)} className="flex-1 rounded-full border border-[#D1D5DB] bg-white text-[#404756] text-sm font-medium py-2.5 hover:bg-gray-50 transition-colors">Cancel</button>
              <button onClick={createCampaign} disabled={saving || !form.suburb} className="flex-1 rounded-full bg-[#2342B0] text-white text-sm font-semibold py-2.5 hover:bg-[#1d3799] transition-colors disabled:opacity-50">{saving ? "Creating…" : "Create Campaign"}</button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-[20px] border border-[#D9DEE9] shadow-[0_2px_12px_rgba(0,0,0,0.04)] px-7 py-5 flex items-start justify-between">
        <div>
          <h1 className="text-[26px] font-bold text-[#1F2530] tracking-[-0.03em]">Seller Campaigns</h1>
          <p className="text-[14px] text-[#6B7280] mt-0.5">Activate campaigns, track responses, and connect with motivated vendors.</p>
        </div>
        <button onClick={() => setShowModal(true)} className="rounded-full bg-[#2342B0] text-white text-sm font-semibold px-5 py-2.5 hover:bg-[#1d3799] transition-colors flex items-center gap-2 text-[13px]">
          <Plus size={13} /> Create a Campaign
        </button>
      </div>

      <div className="bg-white rounded-[20px] border border-[#D9DEE9] shadow-[0_2px_12px_rgba(0,0,0,0.04)] overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#E5E7EB] bg-[#F9FAFB]/60">
              <th className="px-4 py-3 text-left text-[12px] font-semibold text-[#404754] uppercase tracking-wide">Suburb / Area</th>
              <th className="px-4 py-3 text-left text-[12px] font-semibold text-[#404754] uppercase tracking-wide">Status</th>
              <th className="px-4 py-3 text-left text-[12px] font-semibold text-[#404754] uppercase tracking-wide">Leads</th>
              <th className="px-4 py-3 text-left text-[12px] font-semibold text-[#404754] uppercase tracking-wide">Clicks</th>
              <th className="px-4 py-3 text-left text-[12px] font-semibold text-[#404754] uppercase tracking-wide">Last Sent</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E5E7EB]">
            {loading ? (
              <tr><td colSpan={6} className="px-6 py-12 text-center text-[13px] text-[#6B7280]">Loading…</td></tr>
            ) : campaigns.map((c) => (
              <tr key={c.id} className="hover:bg-[#F9FAFB] transition-colors">
                <td className="px-4 py-[18px]"><p className="text-[13px] font-semibold text-[#1F2530]">{c.suburb}</p></td>
                <td className="px-4 py-[18px]"><span className={`rounded-full text-xs font-semibold px-2.5 py-0.5 border ${statusBadge[c.status] || statusBadge.Draft}`}>{c.status}</span></td>
                <td className="px-4 py-[18px]"><span className="text-[13px] font-semibold text-[#1F2530]">{c.leads_captured}</span></td>
                <td className="px-4 py-[18px]"><span className="text-[13px] font-semibold text-[#1F2530]">{c.clicks.toLocaleString()}</span></td>
                <td className="px-4 py-[18px]"><span className="text-[13px] text-[#6B7280]">{c.last_sent}</span></td>
                <td className="px-4 py-[18px] relative">
                  <button onClick={() => setOpenMenu(openMenu === c.id ? null : c.id)} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-100">
                    <MoreVertical size={15} className="text-[#9CA3AF]" />
                  </button>
                  {openMenu === c.id && (
                    <div className="absolute right-4 top-10 bg-white rounded-xl border border-[#E5E7EB] shadow-lg z-10 overflow-hidden w-40">
                      <button onClick={() => toggleStatus(c)} className="w-full flex items-center gap-2.5 px-4 py-2.5 text-[13px] text-[#1F2530] hover:bg-[#F9FAFB] transition-colors">
                        {c.status === "Active" ? <><Pause size={13} /> Pause</> : <><Play size={13} /> Resume</>}
                      </button>
                      <button onClick={() => deleteCampaign(c.id)} className="w-full flex items-center gap-2.5 px-4 py-2.5 text-[13px] text-[#EF4444] hover:bg-[#FEF2F2] transition-colors">
                        <Trash2 size={13} /> Delete
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex items-center justify-between px-6 py-4 border-t border-[#E5E7EB]">
          <span className="text-[13px] text-[#6B7280]">{campaigns.length} campaign{campaigns.length !== 1 ? "s" : ""}</span>
          <div className="flex items-center gap-2">
            <button className="rounded-full border border-[#D1D5DB] bg-white text-[#404756] text-sm font-medium px-4 py-2 hover:bg-gray-50 transition-colors text-[13px]">Previous</button>
            <button className="rounded-full border border-[#D1D5DB] bg-white text-[#404756] text-sm font-medium px-4 py-2 hover:bg-gray-50 transition-colors text-[13px]">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}
