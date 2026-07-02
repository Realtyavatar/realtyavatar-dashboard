"use client";

import { Plus, Mail, Phone, MoreVertical, X, Trash2, UserCog } from "lucide-react";
import { useState, useEffect } from "react";

interface Member { id: number; name: string; email: string; phone: string; role: string; department: string; status: string; avatar_color: string; }

const roles = ["Admin", "Agent", "Property Manager", "Assistant"];
const departments = ["Sales", "Rentals", "Management", "Admin"];

const deptColors: Record<string, string> = {
  Sales: "bg-[#EFF6FF] text-[#2342B0] border-[#93C5FD]",
  Rentals: "bg-[#F0FDF4] text-[#16A34A] border-[#86EFAC]",
  Management: "bg-[#FAF5FF] text-[#9333EA] border-[#D8B4FE]",
  Admin: "bg-[#FFF7ED] text-[#F59E0B] border-[#FDBA74]",
};

const roleColors: Record<string, string> = {
  Admin: "bg-[#FEF2F2] text-[#EF4444] border-[#FCA5A5]",
  Agent: "bg-[#F3F4F6] text-[#6B7280] border-[#E5E7EB]",
  "Property Manager": "bg-[#EFF6FF] text-[#2342B0] border-[#93C5FD]",
  Assistant: "bg-[#F9FAFB] text-[#9CA3AF] border-[#E5E7EB]",
};

function initials(name: string) { return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2); }

export default function TeamPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [openMenu, setOpenMenu] = useState<number | null>(null);
  const [form, setForm] = useState({ name: "", email: "", phone: "", role: "Agent", department: "Sales" });
  const [filter, setFilter] = useState("All");

  async function fetchMembers() {
    const res = await fetch("/api/team");
    setMembers(await res.json());
    setLoading(false);
  }

  useEffect(() => { fetchMembers(); }, []);

  async function addMember() {
    if (!form.name || !form.email) return;
    setSaving(true);
    const res = await fetch("/api/team", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    setSaving(false);
    if (res.ok) {
      setShowModal(false);
      setForm({ name: "", email: "", phone: "", role: "Agent", department: "Sales" });
      fetchMembers();
    }
  }

  async function removeMember(id: number) {
    await fetch(`/api/team/${id}`, { method: "DELETE" });
    setOpenMenu(null);
    fetchMembers();
  }

  async function toggleStatus(m: Member) {
    const newStatus = m.status === "Active" ? "Inactive" : "Active";
    await fetch(`/api/team/${m.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status: newStatus }) });
    setOpenMenu(null);
    fetchMembers();
  }

  const filtered = filter === "All" ? members : members.filter(m => m.department === filter);

  return (
    <div className="space-y-5">
      {showModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[20px] border border-[#D9DEE9] shadow-[0_8px_40px_rgba(0,0,0,0.12)] w-full max-w-md p-7">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-[18px] font-bold text-[#1F2530]">Add Team Member</h2>
              <button onClick={() => setShowModal(false)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100"><X size={16} className="text-[#6B7280]" /></button>
            </div>
            <div className="space-y-4">
              <div><label className="block text-[12px] font-medium text-[#404754] mb-1.5">Full Name</label><input value={form.name} onChange={e => setForm(p=>({...p,name:e.target.value}))} placeholder="e.g. Jake Morrison" className="w-full px-3 py-2.5 text-[13px] border border-[#D1D5DB] rounded-xl focus:outline-none focus:border-[#2342B0]" /></div>
              <div><label className="block text-[12px] font-medium text-[#404754] mb-1.5">Email</label><input type="email" value={form.email} onChange={e => setForm(p=>({...p,email:e.target.value}))} placeholder="jake@agency.com" className="w-full px-3 py-2.5 text-[13px] border border-[#D1D5DB] rounded-xl focus:outline-none focus:border-[#2342B0]" /></div>
              <div><label className="block text-[12px] font-medium text-[#404754] mb-1.5">Phone</label><input value={form.phone} onChange={e => setForm(p=>({...p,phone:e.target.value}))} placeholder="+61 4XX XXX XXX" className="w-full px-3 py-2.5 text-[13px] border border-[#D1D5DB] rounded-xl focus:outline-none focus:border-[#2342B0]" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-[12px] font-medium text-[#404754] mb-1.5">Role</label>
                  <select value={form.role} onChange={e => setForm(p=>({...p,role:e.target.value}))} className="w-full px-3 py-2.5 text-[13px] border border-[#D1D5DB] rounded-xl focus:outline-none focus:border-[#2342B0] bg-white">
                    {roles.map(r => <option key={r}>{r}</option>)}
                  </select>
                </div>
                <div><label className="block text-[12px] font-medium text-[#404754] mb-1.5">Department</label>
                  <select value={form.department} onChange={e => setForm(p=>({...p,department:e.target.value}))} className="w-full px-3 py-2.5 text-[13px] border border-[#D1D5DB] rounded-xl focus:outline-none focus:border-[#2342B0] bg-white">
                    {departments.map(d => <option key={d}>{d}</option>)}
                  </select>
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowModal(false)} className="flex-1 rounded-full border border-[#D1D5DB] bg-white text-[#404756] text-sm font-medium py-2.5 hover:bg-gray-50 transition-colors">Cancel</button>
              <button onClick={addMember} disabled={saving || !form.name || !form.email} className="flex-1 rounded-full bg-[#2342B0] text-white text-sm font-semibold py-2.5 hover:bg-[#1d3799] transition-colors disabled:opacity-50">{saving ? "Adding…" : "Add Member"}</button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-[20px] border border-[#D9DEE9] shadow-[0_2px_12px_rgba(0,0,0,0.04)] px-7 py-5 flex items-start justify-between">
        <div>
          <h1 className="text-[26px] font-bold text-[#1F2530] tracking-[-0.03em]">Team</h1>
          <p className="text-[14px] text-[#6B7280] mt-0.5">Manage your agents and staff under one agency account.</p>
        </div>
        <button onClick={() => setShowModal(true)} className="rounded-full bg-[#2342B0] text-white text-sm font-semibold px-5 py-2.5 shadow-sm hover:bg-[#1d3799] transition-colors flex items-center gap-2 text-[13px]">
          <Plus size={13} /> Add Member
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "Total Members", value: members.length, color: "bg-[#EFF6FF] text-[#2342B0]" },
          { label: "Sales Agents", value: members.filter(m => m.department === "Sales").length, color: "bg-[#F0FDF4] text-[#16A34A]" },
          { label: "Rental Managers", value: members.filter(m => m.department === "Rentals").length, color: "bg-[#FFF7ED] text-[#F59E0B]" },
          { label: "Active", value: members.filter(m => m.status === "Active").length, color: "bg-[#FAF5FF] text-[#9333EA]" },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-white rounded-[20px] border border-[#D9DEE9] shadow-[0_2px_12px_rgba(0,0,0,0.04)] p-5">
            <p className="text-[38px] font-bold text-[#1F2530] leading-none">{value}</p>
            <p className="text-[13px] text-[#6B7280] mt-1.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Team grid */}
      <div className="bg-white rounded-[20px] border border-[#D9DEE9] shadow-[0_2px_12px_rgba(0,0,0,0.04)] overflow-hidden">
        <div className="flex items-center gap-2 px-6 py-4 border-b border-[#E5E7EB]">
          {["All", "Sales", "Rentals", "Management", "Admin"].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-full text-[12px] font-medium border transition-colors ${filter === f ? "bg-[#2342B0] text-white border-[#2342B0]" : "bg-white text-[#6B7280] border-[#D1D5DB] hover:bg-gray-50"}`}>
              {f}
            </button>
          ))}
        </div>

        <div className="divide-y divide-[#E5E7EB]">
          {loading ? (
            <div className="px-6 py-12 text-center text-[13px] text-[#6B7280]">Loading…</div>
          ) : filtered.map((m) => (
            <div key={m.id} className="flex items-center gap-4 px-6 py-4 hover:bg-[#F9FAFB] transition-colors">
              {/* Avatar */}
              <div className="w-11 h-11 rounded-full flex items-center justify-center text-white text-[13px] font-bold shrink-0" style={{ background: m.avatar_color }}>
                {initials(m.name)}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-[14px] font-semibold text-[#1F2530]">{m.name}</p>
                  <span className={`rounded-full text-[10px] font-semibold px-2 py-0.5 border ${roleColors[m.role] || roleColors.Agent}`}>{m.role}</span>
                  {m.status === "Inactive" && <span className="rounded-full text-[10px] font-semibold px-2 py-0.5 bg-gray-100 border border-gray-200 text-gray-400">Inactive</span>}
                </div>
                <p className="text-[12px] text-[#6B7280] mt-0.5">{m.email} · {m.phone || "No phone"}</p>
              </div>

              {/* Department */}
              <span className={`rounded-full text-[11px] font-semibold px-3 py-1 border ${deptColors[m.department] || deptColors.Sales}`}>{m.department}</span>

              {/* Actions */}
              <div className="flex items-center gap-1">
                <a href={`mailto:${m.email}`} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors">
                  <Mail size={14} className="text-[#9CA3AF]" />
                </a>
                {m.phone && (
                  <a href={`tel:${m.phone}`} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors">
                    <Phone size={14} className="text-[#9CA3AF]" />
                  </a>
                )}
                <div className="relative">
                  <button onClick={() => setOpenMenu(openMenu === m.id ? null : m.id)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors">
                    <MoreVertical size={14} className="text-[#9CA3AF]" />
                  </button>
                  {openMenu === m.id && (
                    <div className="absolute right-0 top-9 bg-white rounded-xl border border-[#E5E7EB] shadow-lg z-10 overflow-hidden w-44">
                      <button onClick={() => toggleStatus(m)} className="w-full flex items-center gap-2.5 px-4 py-2.5 text-[13px] text-[#1F2530] hover:bg-[#F9FAFB] transition-colors">
                        <UserCog size={13} /> {m.status === "Active" ? "Deactivate" : "Activate"}
                      </button>
                      <button onClick={() => removeMember(m.id)} className="w-full flex items-center gap-2.5 px-4 py-2.5 text-[13px] text-[#EF4444] hover:bg-[#FEF2F2] transition-colors">
                        <Trash2 size={13} /> Remove
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
