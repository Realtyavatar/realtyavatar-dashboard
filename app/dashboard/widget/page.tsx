"use client";

import { ExternalLink, Upload, KeyRound, RefreshCw, Copy, Check } from "lucide-react";
import { useState, useEffect } from "react";

export default function WidgetSettingsPage() {
  const [agencyName, setAgencyName] = useState("Acme Agency");
  const [brandColor, setBrandColor] = useState("#FC9D3D");
  const [avatar, setAvatar] = useState<"Sam" | "Samantha">("Samantha");
  const [welcome, setWelcome] = useState("Hi! I'm Samantha, your AI property guide. What can I help you today?");
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [apiKeyMasked, setApiKeyMasked] = useState("");
  const [apiKeyExists, setApiKeyExists] = useState(false);
  const [newKeyFull, setNewKeyFull] = useState("");
  const [rotatingKey, setRotatingKey] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetch("/api/widget/key").then(r => r.ok ? r.json() : null).then(d => {
      if (d) { setApiKeyMasked(d.masked); setApiKeyExists(d.exists); }
    }).catch(() => {});
    fetch("/api/settings").then(r => r.json()).then(d => {
      if (d.agencyName) setAgencyName(d.agencyName);
      if (d.brandColor) setBrandColor(d.brandColor);
      if (d.avatar) setAvatar(d.avatar as any);
      if (d.welcomeMessage) setWelcome(d.welcomeMessage);
    });
  }, []);

  async function save() {
    setSaving(true);
    await fetch("/api/settings", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ agencyName, brandColor, avatar, welcomeMessage: welcome }) });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  const displayName = avatar === "Samantha" ? "Samantha" : "Sam";

  return (
    <div className="space-y-5">
      <div className="bg-white rounded-[20px] border border-[#D9DEE9] shadow-[0_2px_12px_rgba(0,0,0,0.04)] px-7 py-5">
        <h1 className="text-[26px] font-bold text-[#1F2530] tracking-[-0.03em]">Widget Settings</h1>
        <p className="text-[14px] text-[#6B7280] mt-0.5">Customize the look, feel, and voice of your AI assistant to match your agency's brand.</p>
      </div>

      <div className="grid grid-cols-[1fr_380px] gap-5 items-start">
        {/* Config */}
        <div className="bg-white rounded-[20px] border border-[#D9DEE9] shadow-[0_2px_12px_rgba(0,0,0,0.04)] p-7 space-y-6">
          {/* Logo */}
          <div>
            <label className="block text-[13px] font-semibold text-[#1F2530] mb-3">Upload Logo</label>
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl flex items-center justify-center shrink-0" style={{ background: brandColor + "33" }}>
                <div className="w-6 h-6 rounded-full" style={{ background: brandColor }} />
              </div>
              <div>
                <p className="text-[13px] font-medium text-[#1F2530]">AcmeAgency_logo.png</p>
                <div className="flex gap-3 mt-1">
                  <button className="text-[12px] text-[#2342B0] font-medium hover:underline flex items-center gap-1"><Upload size={11} /> Change Logo</button>
                  <button className="text-[12px] text-[#EF4444] font-medium hover:underline">Remove</button>
                </div>
              </div>
            </div>
          </div>

          {/* Agency name */}
          <div>
            <label className="block text-[13px] font-semibold text-[#1F2530] mb-2">Agency Name</label>
            <input value={agencyName} onChange={e => setAgencyName(e.target.value)} className="w-full px-3 py-2.5 text-[13px] border border-[#D1D5DB] rounded-xl focus:outline-none focus:border-[#2342B0]" />
          </div>

          {/* Brand color */}
          <div>
            <label className="block text-[13px] font-semibold text-[#1F2530] mb-2">Brand Color</label>
            <div className="flex items-center gap-3">
              <input type="color" value={brandColor} onChange={e => setBrandColor(e.target.value)} className="w-9 h-9 rounded-lg border border-[#E5E7EB] cursor-pointer p-0.5" />
              <input value={brandColor} onChange={e => setBrandColor(e.target.value)} className="flex-1 px-3 py-2.5 text-[13px] border border-[#D1D5DB] rounded-xl focus:outline-none focus:border-[#2342B0]" />
            </div>
          </div>

          {/* Avatar */}
          <div>
            <label className="block text-[13px] font-semibold text-[#1F2530] mb-2">Select Avatar</label>
            <div className="flex items-center gap-3">
              {(["Sam", "Samantha"] as const).map(a => (
                <button
                  key={a}
                  onClick={() => setAvatar(a)}
                  className={`flex-1 py-3 rounded-xl text-[13px] font-semibold border transition-all ${
                    avatar === a
                      ? "bg-[#2342B0] text-white border-[#2342B0]"
                      : "bg-white text-[#6B7280] border-[#D1D5DB] hover:border-[#2342B0]"
                  }`}
                >
                  {a}
                </button>
              ))}
            </div>
          </div>

          {/* Welcome message */}
          <div>
            <label className="block text-[13px] font-semibold text-[#1F2530] mb-2">Edit Welcome Message</label>
            <textarea rows={4} value={welcome} onChange={e => setWelcome(e.target.value)} className="w-full px-3 py-2.5 text-[13px] border border-[#D1D5DB] rounded-xl resize-none focus:outline-none focus:border-[#2342B0]" />
          </div>

          {/* Widget API Key */}
          <div className="border-t border-[#E5E7EB] pt-6">
            <label className="block text-[13px] font-semibold text-[#1F2530] mb-1">Widget API Key</label>
            <p className="text-[12px] text-[#6B7280] mb-3">Pass this key via <code className="bg-[#F3F4F6] px-1 rounded text-[11px]">x-widget-key</code> header or <code className="bg-[#F3F4F6] px-1 rounded text-[11px]">REALTYAVATAR_WIDGET_API_KEY</code> env var in your site.</p>
            <div className="flex items-center gap-2">
              <div className="flex-1 flex items-center gap-2 px-3 py-2.5 bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl">
                <KeyRound size={13} className="text-[#9CA3AF] shrink-0" />
                <span className="text-[13px] font-mono text-[#4B5563] flex-1">
                  {newKeyFull || (apiKeyExists ? apiKeyMasked : <span className="text-[#9CA3AF] not-italic font-sans">No key yet — generate one below</span>)}
                </span>
                {newKeyFull && (
                  <button
                    onClick={() => { navigator.clipboard.writeText(newKeyFull); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
                    className="text-[12px] font-medium text-[#2342B0] flex items-center gap-1 shrink-0"
                  >
                    {copied ? <><Check size={11} /> Copied</> : <><Copy size={11} /> Copy</>}
                  </button>
                )}
              </div>
              <button
                onClick={async () => {
                  if (!confirm(apiKeyExists ? "Rotate the key? The old key will stop working immediately." : "Generate a new widget API key?")) return;
                  setRotatingKey(true);
                  const res = await fetch("/api/widget/key", { method: "POST" });
                  const data = await res.json();
                  setRotatingKey(false);
                  if (data.key) { setNewKeyFull(data.key); setApiKeyExists(true); setApiKeyMasked(data.key.slice(0,10) + "••••••••" + data.key.slice(-4)); }
                }}
                className="rounded-xl border border-[#D1D5DB] bg-white text-[#404756] text-[12px] font-medium px-3 py-2.5 hover:bg-gray-50 transition-colors flex items-center gap-1.5 shrink-0"
              >
                <RefreshCw size={12} className={rotatingKey ? "animate-spin" : ""} />
                {apiKeyExists ? "Rotate" : "Generate"}
              </button>
            </div>
            {newKeyFull && (
              <p className="text-[11px] text-[#EF4444] mt-2">⚠ Copy this key now — it won&apos;t be shown in full again.</p>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={save}
              className={`rounded-full text-sm font-semibold px-6 py-2.5 transition-colors ${saved ? "bg-[#ECFDF3] text-[#16A34A] border border-[#86EFAC]" : "bg-[#2342B0] text-white hover:bg-[#1d3799]"}`}
            >
              {saved ? "✓ Saved" : saving ? "Saving…" : "Save Changes"}
            </button>
            <button className="rounded-full border border-[#D1D5DB] bg-white text-[#404756] text-sm font-medium px-5 py-2.5 hover:bg-gray-50 transition-colors flex items-center gap-1.5">
              <ExternalLink size={13} /> Installation Instructions
            </button>
          </div>
        </div>

        {/* Live preview — updates in real time */}
        <div className="bg-white rounded-[20px] border border-[#D9DEE9] shadow-[0_2px_12px_rgba(0,0,0,0.04)] p-5 sticky top-6">
          <p className="text-[13px] font-semibold text-[#6B7280] uppercase tracking-wider mb-4">Live Preview</p>
          <div className="bg-[#F5F7FA] rounded-2xl overflow-hidden border border-[#E5E7EB]">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-[#E5E7EB]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ background: brandColor }}>
                  {displayName[0]}
                </div>
                <div>
                  <p className="text-[12px] font-semibold text-[#1F2530]">{displayName}</p>
                  <p className="text-[10px] text-[#6B7280]">{agencyName}</p>
                </div>
              </div>
              <button className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 text-xs">✕</button>
            </div>

            {/* Body */}
            <div className="px-5 py-6 flex flex-col items-center text-center gap-4">
              <div className="w-14 h-14 rounded-full flex items-center justify-center text-white text-lg font-bold" style={{ background: brandColor }}>
                {displayName[0]}
              </div>
              <p className="text-[13px] text-[#1F2530] font-medium leading-relaxed">{welcome}</p>
              <div className="self-end text-white text-[12px] font-medium px-4 py-2.5 rounded-2xl rounded-br-sm max-w-[85%] text-left" style={{ background: brandColor }}>
                Show me 2-bedroom houses under $1.2M
              </div>
              <div className="self-start bg-white border border-[#E5E7EB] text-[#1F2530] text-[12px] px-4 py-2.5 rounded-2xl rounded-bl-sm max-w-[85%] text-left">
                Great choice! Let me find what's available…
              </div>
            </div>

            {/* Input */}
            <div className="flex items-center gap-2 px-4 py-3 bg-white border-t border-[#E5E7EB]">
              <input placeholder="Ask me anything" className="flex-1 text-[12px] text-[#9CA3AF] bg-transparent focus:outline-none" readOnly />
              <button className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-white" style={{ background: brandColor }}>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M13 1L1 6l5 2m7-7L8 13 8 8m5-7L6 8" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
