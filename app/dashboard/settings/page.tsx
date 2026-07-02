"use client";
import { Mail, Upload, X, AlertTriangle, Zap } from "lucide-react";
import { useState, useEffect } from "react";

export default function AccountSettingsPage() {
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showChangePw, setShowChangePw] = useState(false);
  const [showChangeEmail, setShowChangeEmail] = useState(false);
  const [form, setForm] = useState({ firstName: "Sam", lastName: "Banks", email: "sam@realtyavatar.com", phone: "+61 412 345 678", agency: "RealtyAvatar Agency", abn: "123 456 789", officePhone: "+61 3 9000 0000", website: "www.realtyavatar.com", address: "Level 10, 200 Collins St, Melbourne VIC 3000" });
  const [aiUsage, setAiUsage] = useState<{ capUsd: number; usedUsd: number; usedTokens: number; month: string } | null>(null);
  const [newCap, setNewCap] = useState("");
  const [savingCap, setSavingCap] = useState(false);
  const [capSaved, setCapSaved] = useState(false);

  useEffect(() => {
    fetch("/api/ai-usage").then(r => r.ok ? r.json() : null).then(d => {
      if (d) { setAiUsage(d); setNewCap(String(d.capUsd)); }
    }).catch(() => {});
    fetch("/api/settings").then(r => r.json()).then(d => {
      setForm(f => ({
        ...f,
        firstName: d.firstName || f.firstName,
        lastName: d.lastName || f.lastName,
        email: d.email || f.email,
        phone: d.phone || f.phone,
        agency: d.agency || f.agency,
        abn: d.abn || f.abn,
        officePhone: d.officePhone || f.officePhone,
        website: d.website || f.website,
        address: d.address || f.address,
      }));
    });
  }, []);

  function set(k: string, v: string) { setForm(f => ({ ...f, [k]: v })); }
  async function save() {
    setSaving(true);
    await fetch("/api/settings", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="space-y-5">
      {/* Delete confirm modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[20px] border border-[#D9DEE9] shadow-[0_8px_40px_rgba(0,0,0,0.12)] w-full max-w-sm p-7 text-center">
            <div className="w-12 h-12 rounded-full bg-[#FEF2F2] flex items-center justify-center mx-auto mb-4">
              <AlertTriangle size={22} className="text-[#EF4444]" />
            </div>
            <h2 className="text-[18px] font-bold text-[#1F2530]">Delete Account?</h2>
            <p className="text-[13px] text-[#6B7280] mt-2">This will permanently delete your account and all data. This cannot be undone.</p>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowDeleteConfirm(false)} className="flex-1 rounded-full border border-[#D1D5DB] bg-white text-[#404756] text-sm font-medium py-2.5 hover:bg-gray-50 transition-colors">Cancel</button>
              <button className="flex-1 rounded-full bg-[#EF4444] text-white text-sm font-semibold py-2.5 hover:bg-red-600 transition-colors">Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* Change password modal */}
      {showChangePw && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[20px] border border-[#D9DEE9] shadow-[0_8px_40px_rgba(0,0,0,0.12)] w-full max-w-sm p-7">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-[18px] font-bold text-[#1F2530]">Change Password</h2>
              <button onClick={() => setShowChangePw(false)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100"><X size={16} className="text-[#6B7280]" /></button>
            </div>
            <div className="space-y-4">
              <div><label className="block text-[12px] font-medium text-[#404754] mb-1.5">Current Password</label><input type="password" className="w-full px-3 py-2.5 text-[13px] border border-[#D1D5DB] rounded-xl focus:outline-none focus:border-[#2342B0]" /></div>
              <div><label className="block text-[12px] font-medium text-[#404754] mb-1.5">New Password</label><input type="password" className="w-full px-3 py-2.5 text-[13px] border border-[#D1D5DB] rounded-xl focus:outline-none focus:border-[#2342B0]" /></div>
              <div><label className="block text-[12px] font-medium text-[#404754] mb-1.5">Confirm New Password</label><input type="password" className="w-full px-3 py-2.5 text-[13px] border border-[#D1D5DB] rounded-xl focus:outline-none focus:border-[#2342B0]" /></div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowChangePw(false)} className="flex-1 rounded-full border border-[#D1D5DB] bg-white text-[#404756] text-sm font-medium py-2.5 hover:bg-gray-50 transition-colors">Cancel</button>
              <button onClick={() => setShowChangePw(false)} className="flex-1 rounded-full bg-[#2342B0] text-white text-sm font-semibold py-2.5 hover:bg-[#1d3799] transition-colors">Update Password</button>
            </div>
          </div>
        </div>
      )}

      {/* Change email modal */}
      {showChangeEmail && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[20px] border border-[#D9DEE9] shadow-[0_8px_40px_rgba(0,0,0,0.12)] w-full max-w-sm p-7">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-[18px] font-bold text-[#1F2530]">Change Email</h2>
              <button onClick={() => setShowChangeEmail(false)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100"><X size={16} className="text-[#6B7280]" /></button>
            </div>
            <div className="space-y-4">
              <div><label className="block text-[12px] font-medium text-[#404754] mb-1.5">New Email Address</label><input type="email" defaultValue={form.email} className="w-full px-3 py-2.5 text-[13px] border border-[#D1D5DB] rounded-xl focus:outline-none focus:border-[#2342B0]" /></div>
              <div><label className="block text-[12px] font-medium text-[#404754] mb-1.5">Confirm Password</label><input type="password" className="w-full px-3 py-2.5 text-[13px] border border-[#D1D5DB] rounded-xl focus:outline-none focus:border-[#2342B0]" /></div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowChangeEmail(false)} className="flex-1 rounded-full border border-[#D1D5DB] bg-white text-[#404756] text-sm font-medium py-2.5 hover:bg-gray-50 transition-colors">Cancel</button>
              <button onClick={() => setShowChangeEmail(false)} className="flex-1 rounded-full bg-[#2342B0] text-white text-sm font-semibold py-2.5 hover:bg-[#1d3799] transition-colors">Update Email</button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-[20px] border border-[#D9DEE9] shadow-[0_2px_12px_rgba(0,0,0,0.04)] px-7 py-5">
        <h1 className="text-[26px] font-bold text-[#1F2530] tracking-[-0.03em]">Account Settings</h1>
        <p className="text-[14px] text-[#6B7280] mt-0.5">Update your login credentials, contact info, and agency details.</p>
      </div>

      <div className="bg-white rounded-[20px] border border-[#D9DEE9] shadow-[0_2px_12px_rgba(0,0,0,0.04)] overflow-hidden divide-y divide-[#E5E7EB]">

        {/* Profile */}
        <div className="grid grid-cols-[260px_1fr] gap-8 p-7">
          <div>
            <p className="text-[14px] font-semibold text-[#1F2530]">Profile</p>
            <p className="text-[13px] text-[#6B7280] mt-1">Update your name, email, and contact details.</p>
          </div>
          <div className="space-y-5">
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 rounded-full bg-[#2342B0] flex items-center justify-center text-white text-xl font-bold shrink-0">SB</div>
              <div className="flex-1 border-2 border-dashed border-[#D1D5DB] rounded-xl p-4 text-center cursor-pointer hover:border-[#2342B0] transition-colors">
                <Upload size={18} className="mx-auto text-[#9CA3AF] mb-1" />
                <p className="text-[13px] text-[#6B7280]"><span className="text-[#2342B0] font-medium">Click to upload</span> or drag and drop</p>
                <p className="text-[11px] text-[#9CA3AF] mt-0.5">SVG, PNG, JPG (max 800×400px)</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div><label className="block text-[12px] font-medium text-[#404754] mb-1.5">First name</label><input value={form.firstName} onChange={e => set("firstName", e.target.value)} className="w-full px-3 py-2.5 text-[13px] border border-[#D1D5DB] rounded-xl focus:outline-none focus:border-[#2342B0]" /></div>
              <div><label className="block text-[12px] font-medium text-[#404754] mb-1.5">Last name</label><input value={form.lastName} onChange={e => set("lastName", e.target.value)} className="w-full px-3 py-2.5 text-[13px] border border-[#D1D5DB] rounded-xl focus:outline-none focus:border-[#2342B0]" /></div>
              <div><label className="block text-[12px] font-medium text-[#404754] mb-1.5">Email address</label>
                <div className="relative"><Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]" /><input value={form.email} onChange={e => set("email", e.target.value)} className="w-full pl-9 pr-3 py-2.5 text-[13px] border border-[#D1D5DB] rounded-xl focus:outline-none focus:border-[#2342B0]" /></div>
              </div>
              <div><label className="block text-[12px] font-medium text-[#404754] mb-1.5">Phone</label><input value={form.phone} onChange={e => set("phone", e.target.value)} className="w-full px-3 py-2.5 text-[13px] border border-[#D1D5DB] rounded-xl focus:outline-none focus:border-[#2342B0]" /></div>
            </div>
          </div>
        </div>

        {/* Agency */}
        <div className="grid grid-cols-[260px_1fr] gap-8 p-7">
          <div>
            <p className="text-[14px] font-semibold text-[#1F2530]">Agency Information</p>
            <p className="text-[13px] text-[#6B7280] mt-1">Your agency's public details used in the widget.</p>
          </div>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div><label className="block text-[12px] font-medium text-[#404754] mb-1.5">Agency Name</label><input value={form.agency} onChange={e => set("agency", e.target.value)} className="w-full px-3 py-2.5 text-[13px] border border-[#D1D5DB] rounded-xl focus:outline-none focus:border-[#2342B0]" /></div>
              <div><label className="block text-[12px] font-medium text-[#404754] mb-1.5">ABN / ID Number</label><input value={form.abn} onChange={e => set("abn", e.target.value)} className="w-full px-3 py-2.5 text-[13px] border border-[#D1D5DB] rounded-xl focus:outline-none focus:border-[#2342B0]" /></div>
              <div><label className="block text-[12px] font-medium text-[#404754] mb-1.5">Office Phone</label><input value={form.officePhone} onChange={e => set("officePhone", e.target.value)} className="w-full px-3 py-2.5 text-[13px] border border-[#D1D5DB] rounded-xl focus:outline-none focus:border-[#2342B0]" /></div>
              <div><label className="block text-[12px] font-medium text-[#404754] mb-1.5">Website</label><input value={form.website} onChange={e => set("website", e.target.value)} className="w-full px-3 py-2.5 text-[13px] border border-[#D1D5DB] rounded-xl focus:outline-none focus:border-[#2342B0]" /></div>
            </div>
            <div><label className="block text-[12px] font-medium text-[#404754] mb-1.5">Office Address</label><textarea rows={3} value={form.address} onChange={e => set("address", e.target.value)} className="w-full px-3 py-2.5 text-[13px] border border-[#D1D5DB] rounded-xl resize-none focus:outline-none focus:border-[#2342B0]" /></div>
          </div>
        </div>

        {/* Security */}
        <div className="grid grid-cols-[260px_1fr] gap-8 p-7">
          <div>
            <p className="text-[14px] font-semibold text-[#1F2530]">Security & Login</p>
            <p className="text-[13px] text-[#6B7280] mt-1">Manage credentials and view login history.</p>
          </div>
          <div className="space-y-5">
            <p className="text-[13px] font-semibold text-[#1F2530]">Login History</p>
            {["Apr 13, 2026 — Chrome — Melbourne, VIC", "Apr 12, 2026 — Safari — Melbourne, VIC"].map(e => (
              <div key={e} className="flex items-center gap-3 px-4 py-3 bg-[#F9FAFB] rounded-xl border border-[#E5E7EB]">
                <div className="w-2 h-2 rounded-full bg-[#12B76A] shrink-0" />
                <p className="text-[13px] text-[#6B7280]">{e}</p>
              </div>
            ))}
            <div className="flex items-center gap-3">
              <button onClick={() => setShowChangeEmail(true)} className="rounded-full border border-[#D1D5DB] bg-white text-[#404756] text-sm font-medium px-4 py-2 hover:bg-gray-50 transition-colors">Change Email</button>
              <button onClick={() => setShowChangePw(true)} className="rounded-full border border-[#D1D5DB] bg-white text-[#404756] text-sm font-medium px-4 py-2 hover:bg-gray-50 transition-colors">Change Password</button>
            </div>
            <div className="pt-4 border-t border-[#E5E7EB] flex justify-between items-center">
              <p className="text-[13px] text-[#6B7280]">Permanently delete your account and all data.</p>
              <button onClick={() => setShowDeleteConfirm(true)} className="rounded-full bg-[#EF4444] text-white text-[13px] font-semibold px-5 py-2 hover:bg-red-600 transition-colors">Delete my account</button>
            </div>
          </div>
        </div>

        {/* AI Usage & Cost Cap */}
        <div className="grid grid-cols-[260px_1fr] gap-8 p-7 border-t border-[#E5E7EB]">
          <div>
            <p className="text-[14px] font-semibold text-[#1F2530]">AI Usage &amp; Cost Cap</p>
            <p className="text-[13px] text-[#6B7280] mt-1">Monitor widget AI spend and set a monthly hard cap.</p>
          </div>
          <div className="space-y-4">
            {aiUsage ? (
              <>
                <div className="bg-[#F0F4FF] rounded-2xl p-5 flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[#2342B0]/10 flex items-center justify-center shrink-0">
                    <Zap size={18} className="text-[#2342B0]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-semibold text-[#1F2530]">{aiUsage.month} usage</p>
                    <p className="text-[13px] text-[#6B7280] mt-0.5">
                      <span className="font-medium text-[#1F2530]">${aiUsage.usedUsd.toFixed(4)}</span>
                      {" "}of{" "}
                      <span className="font-medium text-[#1F2530]">${aiUsage.capUsd.toFixed(2)}</span>
                      {" cap — "}
                      {aiUsage.usedTokens.toLocaleString()} tokens
                    </p>
                    <div className="mt-3 h-2 rounded-full bg-[#E0E7FF] overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          aiUsage.usedUsd / aiUsage.capUsd > 0.9
                            ? "bg-[#EF4444]"
                            : aiUsage.usedUsd / aiUsage.capUsd > 0.7
                            ? "bg-[#F59E0B]"
                            : "bg-[#2342B0]"
                        }`}
                        style={{ width: `${Math.min(100, (aiUsage.usedUsd / aiUsage.capUsd) * 100).toFixed(1)}%` }}
                      />
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <label className="text-[13px] font-medium text-[#404754] whitespace-nowrap">Monthly cap (USD $)</label>
                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={newCap}
                    onChange={e => setNewCap(e.target.value)}
                    className="w-28 px-3 py-2 text-[13px] border border-[#D1D5DB] rounded-xl focus:outline-none focus:border-[#2342B0]"
                  />
                  <button
                    onClick={async () => {
                      setSavingCap(true);
                      await fetch("/api/ai-usage", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ capUsd: Number(newCap) }) });
                      setSavingCap(false);
                      setCapSaved(true);
                      setTimeout(() => setCapSaved(false), 2000);
                      setAiUsage(a => a ? { ...a, capUsd: Number(newCap) } : a);
                    }}
                    className={`rounded-full text-sm font-semibold px-5 py-2 transition-colors ${
                      capSaved ? "bg-[#ECFDF3] text-[#16A34A] border border-[#86EFAC]" : "bg-[#2342B0] text-white hover:bg-[#1d3799]"
                    }`}
                  >
                    {capSaved ? "✓ Saved" : savingCap ? "Saving…" : "Update Cap"}
                  </button>
                </div>
              </>
            ) : (
              <p className="text-[13px] text-[#9CA3AF]">Loading usage data…</p>
            )}
          </div>
        </div>

        <div className="flex justify-end px-7 py-5">
          <button onClick={save} className={`rounded-full text-sm font-semibold px-6 py-2.5 transition-colors ${saved ? "bg-[#ECFDF3] text-[#16A34A] border border-[#86EFAC]" : "bg-[#2342B0] text-white hover:bg-[#1d3799]"}`}>
            {saved ? "✓ Saved" : saving ? "Saving…" : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}
