"use client";
import { useState, useEffect } from "react";
import { Trash2 } from "lucide-react";

const initialAssignments = [
  { suburb: "Bondi, NSW", agent: "Sarah L." },
  { suburb: "Fitzroy, VIC", agent: "Jordan M." },
  { suburb: "St Kilda, VIC", agent: "Unassigned" },
  { suburb: "Toorak, VIC", agent: "Unassigned" },
];

function Checkbox({ checked, onChange, label }: { checked: boolean; onChange: () => void; label: string }) {
  return (
    <label className="flex items-center gap-2.5 cursor-pointer" onClick={onChange}>
      <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${checked ? "bg-[#2342B0] border-[#2342B0]" : "bg-white border-[#D1D5DB] hover:border-[#2342B0]"}`}>
        {checked && <svg width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M1 4l3 3 5-6" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
      </div>
      <span className="text-[13px] text-[#1F2530]">{label}</span>
    </label>
  );
}

function Radio({ checked, onChange, label }: { checked: boolean; onChange: () => void; label: string }) {
  return (
    <label className="flex items-center gap-2.5 cursor-pointer" onClick={onChange}>
      <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${checked ? "bg-[#2342B0] border-[#2342B0]" : "bg-white border-[#D1D5DB] hover:border-[#2342B0]"}`}>
        {checked && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
      </div>
      <span className={`text-[13px] ${checked ? "font-medium text-[#1F2530]" : "text-[#6B7280]"}`}>{label}</span>
    </label>
  );
}

export default function NotificationsPage() {
  const [emailAlert, setEmailAlert] = useState(true);
  const [smsAlert, setSmsAlert] = useState(true);
  const [emailCopy, setEmailCopy] = useState(true);
  const [agentOnly, setAgentOnly] = useState(false);
  const [assignMode, setAssignMode] = useState<"manual" | "auto">("auto");
  const [weeklyReport, setWeeklyReport] = useState(true);
  const [agentEmail, setAgentEmail] = useState("jordan@realtyexample.com");
  const [phone, setPhone] = useState("+61 412 345 678");
  const [assignments, setAssignments] = useState(initialAssignments);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/settings").then(r => r.json()).then(d => {
      if (d.alertEmail !== undefined) setEmailAlert(d.alertEmail === "true");
      if (d.alertSms !== undefined) setSmsAlert(d.alertSms === "true");
      if (d.emailCopy !== undefined) setEmailCopy(d.emailCopy === "true");
      if (d.agentOnly !== undefined) setAgentOnly(d.agentOnly === "true");
      if (d.assignMode) setAssignMode(d.assignMode as any);
      if (d.weeklyReport !== undefined) setWeeklyReport(d.weeklyReport === "true");
      if (d.agentEmail) setAgentEmail(d.agentEmail);
      if (d.agentPhone) setPhone(d.agentPhone);
    });
  }, []);

  async function save() {
    setSaving(true);
    await fetch("/api/settings", { method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ alertEmail: String(emailAlert), alertSms: String(smsAlert), emailCopy: String(emailCopy), agentOnly: String(agentOnly), assignMode, weeklyReport: String(weeklyReport), agentEmail, agentPhone: phone }) });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  function updateAgent(i: number, val: string) {
    setAssignments(prev => prev.map((a, idx) => idx === i ? { ...a, agent: val } : a));
  }

  return (
    <div className="space-y-5">
      <div className="bg-white rounded-[20px] border border-[#D9DEE9] shadow-[0_2px_12px_rgba(0,0,0,0.04)] px-7 py-5">
        <h1 className="text-[26px] font-bold text-[#1F2530] tracking-[-0.03em]">Notifications</h1>
        <p className="text-[14px] text-[#6B7280] mt-0.5">Manage how and when you're alerted about leads, document requests, and campaign interactions.</p>
      </div>

      <div className="bg-white rounded-[20px] border border-[#D9DEE9] shadow-[0_2px_12px_rgba(0,0,0,0.04)] overflow-hidden divide-y divide-[#E5E7EB]">

        {/* Lead alerts */}
        <div className="grid grid-cols-[260px_1fr] gap-8 p-7">
          <div>
            <p className="text-[14px] font-semibold text-[#1F2530]">Lead Alerts</p>
            <p className="text-[13px] text-[#6B7280] mt-1">Control how you get notified when a new lead is captured.</p>
          </div>
          <div className="space-y-5">
            <p className="text-[13px] font-semibold text-[#1F2530]">Notify When a New Lead Is Captured</p>
            <div className="flex items-center gap-5">
              <Checkbox checked={emailAlert} onChange={() => setEmailAlert(!emailAlert)} label="Send Email" />
              <Checkbox checked={smsAlert} onChange={() => setSmsAlert(!smsAlert)} label="Send SMS" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[12px] font-medium text-[#404754] mb-1.5">Agent Email</label>
                <input value={agentEmail} onChange={e => setAgentEmail(e.target.value)} className="w-full px-3 py-2.5 text-[13px] border border-[#D1D5DB] rounded-xl focus:outline-none focus:border-[#2342B0]" />
              </div>
              <div>
                <label className="block text-[12px] font-medium text-[#404754] mb-1.5">Phone Number</label>
                <input value={phone} onChange={e => setPhone(e.target.value)} className="w-full px-3 py-2.5 text-[13px] border border-[#D1D5DB] rounded-xl focus:outline-none focus:border-[#2342B0]" />
              </div>
            </div>
          </div>
        </div>

        {/* Document alerts */}
        <div className="grid grid-cols-[260px_1fr] gap-8 p-7">
          <div>
            <p className="text-[14px] font-semibold text-[#1F2530]">Document Alerts</p>
            <p className="text-[13px] text-[#6B7280] mt-1">Get notified when documents are sent via the widget.</p>
          </div>
          <div className="space-y-4">
            <p className="text-[13px] font-semibold text-[#1F2530]">Notify When a Document Is Sent by the Widget</p>
            <div className="flex flex-col gap-3">
              <Checkbox checked={emailCopy} onChange={() => setEmailCopy(!emailCopy)} label="Email Me a Copy" />
              <Checkbox checked={agentOnly} onChange={() => setAgentOnly(!agentOnly)} label="Notify Assigned Agent Only" />
            </div>
          </div>
        </div>

        {/* Team assignment */}
        <div className="grid grid-cols-[260px_1fr] gap-8 p-7">
          <div>
            <p className="text-[14px] font-semibold text-[#1F2530]">Team Assignment Rules</p>
            <p className="text-[13px] text-[#6B7280] mt-1">Route leads to the right agent automatically.</p>
          </div>
          <div className="space-y-4">
            <p className="text-[13px] font-semibold text-[#1F2530]">Assign Leads By:</p>
            <div className="flex flex-col gap-2.5">
              <Radio checked={assignMode === "manual"} onChange={() => setAssignMode("manual")} label="Manual Assignment" />
              <Radio checked={assignMode === "auto"} onChange={() => setAssignMode("auto")} label="Auto-Assign by Suburb" />
            </div>

            {assignMode === "auto" && (
              <div className="rounded-xl border border-[#E5E7EB] overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[#E5E7EB] bg-[#F9FAFB]">
                      <th className="px-4 py-2.5 text-left text-[11px] font-semibold text-[#404754] uppercase tracking-wide">Suburb / Area</th>
                      <th className="px-4 py-2.5 text-left text-[11px] font-semibold text-[#404754] uppercase tracking-wide">Assigned Agent</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E5E7EB]">
                    {assignments.map((row, i) => (
                      <tr key={i}>
                        <td className="px-4 py-2.5 text-[13px] text-[#1F2530]">{row.suburb}</td>
                        <td className="px-4 py-2.5">
                          <input
                            value={row.agent}
                            onChange={e => updateAgent(i, e.target.value)}
                            className="w-full px-2.5 py-1.5 text-[13px] border border-[#D1D5DB] rounded-lg focus:outline-none focus:border-[#2342B0]"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Weekly summary */}
        <div className="grid grid-cols-[260px_1fr] gap-8 p-7">
          <div>
            <p className="text-[14px] font-semibold text-[#1F2530]">Weekly Summary Email</p>
            <p className="text-[13px] text-[#6B7280] mt-1">Stay on top of platform performance every week.</p>
          </div>
          <div>
            <Checkbox checked={weeklyReport} onChange={() => setWeeklyReport(!weeklyReport)} label="Receive Weekly Activity Report" />
            <p className="text-[12px] text-[#6B7280] mt-1 ml-6">Includes top listings, widget performance, and chat summary</p>
          </div>
        </div>

        {/* Save */}
        <div className="flex justify-end px-7 py-5">
          <button onClick={save} className={`rounded-full text-sm font-semibold px-6 py-2.5 transition-colors ${saved ? "bg-[#ECFDF3] text-[#16A34A] border border-[#86EFAC]" : "bg-[#2342B0] text-white hover:bg-[#1d3799]"}`}>
            {saved ? "✓ Saved" : saving ? "Saving…" : "Save Preferences"}
          </button>
        </div>
      </div>
    </div>
  );
}
