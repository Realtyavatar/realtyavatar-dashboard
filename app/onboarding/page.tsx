"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, ChevronRight, Globe, Upload, Palette, Play, Rocket, Eye, EyeOff, Mail, Lock, User, Building2, CloudUpload } from "lucide-react";

const STEPS = [
  { id: 1, label: "Create account" },
  { id: 2, label: "Agency details" },
  { id: 3, label: "Add your website" },
  { id: 4, label: "Load listings" },
  { id: 5, label: "Customise widget" },
  { id: 6, label: "Go live" },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [showPw, setShowPw] = useState(false);
  const [form, setForm] = useState({
    firstName: "", lastName: "", email: "", password: "",
    agency: "", phone: "", website: "",
    widgetColor: "#2342B0", avatar: "Samantha",
    welcome: "Hi! I'm Samantha, your AI property guide. What can I help you today?",
  });
  const [listingsLoaded, setListingsLoaded] = useState(false);
  const [loadingListings, setLoadingListings] = useState(false);

  function set(k: string, v: string) { setForm(f => ({ ...f, [k]: v })); }
  function next() { setStep(s => Math.min(s + 1, 6)); }
  function back() { setStep(s => Math.max(s - 1, 1)); }

  async function loadListings() {
    setLoadingListings(true);
    await new Promise(r => setTimeout(r, 1800));
    setLoadingListings(false);
    setListingsLoaded(true);
  }

  return (
    <div className="min-h-screen bg-[#EAF1FF] flex">
      {/* Left sidebar — steps */}
      <div className="w-72 bg-white border-r border-[#E5E7EB] flex flex-col p-8 shrink-0">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-9 h-9 rounded-xl bg-[#2342B0] flex items-center justify-center">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M3 9.5L10 3l7 6.5V17a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z" stroke="white" strokeWidth="1.5" strokeLinejoin="round"/>
              <path d="M7 18v-6h6v6" stroke="white" strokeWidth="1.5" strokeLinejoin="round"/>
            </svg>
          </div>
          <span className="text-[#2448C9] font-bold text-[17px]">RealtyAvatar</span>
        </div>

        <div className="space-y-1">
          {STEPS.map(s => (
            <div key={s.id} className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-colors ${step === s.id ? "bg-[#EFF6FF]" : ""}`}>
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                step > s.id ? "bg-[#2342B0] text-white" :
                step === s.id ? "bg-[#2342B0] text-white" :
                "bg-[#F3F4F6] text-[#9CA3AF]"
              }`}>
                {step > s.id ? <Check size={13} /> : s.id}
              </div>
              <span className={`text-[13px] font-medium ${step === s.id ? "text-[#2342B0]" : step > s.id ? "text-[#1F2530]" : "text-[#9CA3AF]"}`}>{s.label}</span>
            </div>
          ))}
        </div>

        <div className="mt-auto">
          <div className="h-1.5 bg-[#E5E7EB] rounded-full">
            <div className="h-1.5 bg-[#2342B0] rounded-full transition-all" style={{ width: `${((step - 1) / 5) * 100}%` }} />
          </div>
          <p className="text-[11px] text-[#9CA3AF] mt-2">Step {step} of 6</p>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-lg">

          {/* Step 1 — Create account */}
          {step === 1 && (
            <div className="bg-white rounded-[24px] border border-[#D9DEE9] shadow-[0_4px_24px_rgba(0,0,0,0.06)] p-8">
              <h1 className="text-[24px] font-bold text-[#1F2530] tracking-[-0.03em]">Create your account</h1>
              <p className="text-[14px] text-[#6B7280] mt-1">Get started with RealtyAvatar in minutes.</p>
              <div className="mt-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div><label className="block text-[12px] font-medium text-[#404754] mb-1.5">First name</label><input value={form.firstName} onChange={e => set("firstName", e.target.value)} placeholder="Sam" className="w-full px-3 py-2.5 text-[13px] border border-[#D1D5DB] rounded-xl focus:outline-none focus:border-[#2342B0]" /></div>
                  <div><label className="block text-[12px] font-medium text-[#404754] mb-1.5">Last name</label><input value={form.lastName} onChange={e => set("lastName", e.target.value)} placeholder="Banks" className="w-full px-3 py-2.5 text-[13px] border border-[#D1D5DB] rounded-xl focus:outline-none focus:border-[#2342B0]" /></div>
                </div>
                <div><label className="block text-[12px] font-medium text-[#404754] mb-1.5">Email address</label>
                  <div className="relative"><Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]" /><input type="email" value={form.email} onChange={e => set("email", e.target.value)} placeholder="you@agency.com" className="w-full pl-9 pr-3 py-2.5 text-[13px] border border-[#D1D5DB] rounded-xl focus:outline-none focus:border-[#2342B0]" /></div>
                </div>
                <div><label className="block text-[12px] font-medium text-[#404754] mb-1.5">Password</label>
                  <div className="relative"><Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
                    <input type={showPw ? "text" : "password"} value={form.password} onChange={e => set("password", e.target.value)} placeholder="Min. 8 characters" className="w-full pl-9 pr-9 py-2.5 text-[13px] border border-[#D1D5DB] rounded-xl focus:outline-none focus:border-[#2342B0]" />
                    <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]">{showPw ? <EyeOff size={14} /> : <Eye size={14} />}</button>
                  </div>
                </div>
                <button onClick={next} className="w-full rounded-full bg-[#2342B0] text-white font-semibold py-3 text-[14px] hover:bg-[#1d3799] transition-colors flex items-center justify-center gap-2 mt-2">
                  Continue <ChevronRight size={16} />
                </button>
                <p className="text-center text-[12px] text-[#6B7280]">Already have an account? <a href="/login" className="text-[#2342B0] font-medium hover:underline">Sign in</a></p>
              </div>
            </div>
          )}

          {/* Step 2 — Agency details */}
          {step === 2 && (
            <div className="bg-white rounded-[24px] border border-[#D9DEE9] shadow-[0_4px_24px_rgba(0,0,0,0.06)] p-8">
              <h1 className="text-[24px] font-bold text-[#1F2530] tracking-[-0.03em]">Your agency details</h1>
              <p className="text-[14px] text-[#6B7280] mt-1">This will appear in your widget and communications.</p>
              <div className="mt-6 space-y-4">
                <div><label className="block text-[12px] font-medium text-[#404754] mb-1.5">Agency name</label>
                  <div className="relative"><Building2 size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]" /><input value={form.agency} onChange={e => set("agency", e.target.value)} placeholder="e.g. Premier Real Estate" className="w-full pl-9 pr-3 py-2.5 text-[13px] border border-[#D1D5DB] rounded-xl focus:outline-none focus:border-[#2342B0]" /></div>
                </div>
                <div><label className="block text-[12px] font-medium text-[#404754] mb-1.5">Phone number</label><input value={form.phone} onChange={e => set("phone", e.target.value)} placeholder="+61 4XX XXX XXX" className="w-full px-3 py-2.5 text-[13px] border border-[#D1D5DB] rounded-xl focus:outline-none focus:border-[#2342B0]" /></div>
                <div>
                  <label className="block text-[12px] font-medium text-[#404754] mb-1.5">Agency logo</label>
                  <div className="border-2 border-dashed border-[#D1D5DB] rounded-xl p-5 text-center cursor-pointer hover:border-[#2342B0] transition-colors">
                    <CloudUpload size={20} className="mx-auto text-[#9CA3AF] mb-1.5" />
                    <p className="text-[13px] text-[#6B7280]"><span className="text-[#2342B0] font-medium">Click to upload</span> or drag and drop</p>
                    <p className="text-[11px] text-[#9CA3AF] mt-0.5">PNG, JPG, SVG up to 2MB</p>
                  </div>
                </div>
                <div className="flex gap-3 mt-2">
                  <button onClick={back} className="flex-1 rounded-full border border-[#D1D5DB] bg-white text-[#404756] font-medium py-3 text-[14px] hover:bg-gray-50 transition-colors">Back</button>
                  <button onClick={next} className="flex-1 rounded-full bg-[#2342B0] text-white font-semibold py-3 text-[14px] hover:bg-[#1d3799] transition-colors flex items-center justify-center gap-2">Continue <ChevronRight size={16} /></button>
                </div>
              </div>
            </div>
          )}

          {/* Step 3 — Add website */}
          {step === 3 && (
            <div className="bg-white rounded-[24px] border border-[#D9DEE9] shadow-[0_4px_24px_rgba(0,0,0,0.06)] p-8">
              <div className="w-12 h-12 rounded-2xl bg-[#EFF6FF] flex items-center justify-center mb-5">
                <Globe size={22} className="text-[#2342B0]" />
              </div>
              <h1 className="text-[24px] font-bold text-[#1F2530] tracking-[-0.03em]">Connect your website</h1>
              <p className="text-[14px] text-[#6B7280] mt-1">We'll scan it to import your active listings automatically.</p>
              <div className="mt-6 space-y-4">
                <div><label className="block text-[12px] font-medium text-[#404754] mb-1.5">Website URL</label>
                  <div className="relative"><Globe size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]" /><input value={form.website} onChange={e => set("website", e.target.value)} placeholder="https://youragency.com.au" className="w-full pl-9 pr-3 py-2.5 text-[13px] border border-[#D1D5DB] rounded-xl focus:outline-none focus:border-[#2342B0]" /></div>
                </div>
                <div className="bg-[#F9FAFB] rounded-xl p-4 border border-[#E5E7EB]">
                  <p className="text-[12px] font-semibold text-[#1F2530] mb-1">Supported platforms</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {["REA Group", "Domain", "AgentPoint", "Box+Dice", "Custom CMS"].map(p => (
                      <span key={p} className="text-[11px] bg-white border border-[#E5E7EB] rounded-full px-2.5 py-1 text-[#6B7280]">{p}</span>
                    ))}
                  </div>
                </div>
                <div className="flex gap-3 mt-2">
                  <button onClick={back} className="flex-1 rounded-full border border-[#D1D5DB] bg-white text-[#404756] font-medium py-3 text-[14px] hover:bg-gray-50 transition-colors">Back</button>
                  <button onClick={next} className="flex-1 rounded-full bg-[#2342B0] text-white font-semibold py-3 text-[14px] hover:bg-[#1d3799] transition-colors flex items-center justify-center gap-2">Connect <ChevronRight size={16} /></button>
                </div>
              </div>
            </div>
          )}

          {/* Step 4 — Load listings */}
          {step === 4 && (
            <div className="bg-white rounded-[24px] border border-[#D9DEE9] shadow-[0_4px_24px_rgba(0,0,0,0.06)] p-8">
              <div className="w-12 h-12 rounded-2xl bg-[#F0FDF4] flex items-center justify-center mb-5">
                <Building2 size={22} className="text-[#16A34A]" />
              </div>
              <h1 className="text-[24px] font-bold text-[#1F2530] tracking-[-0.03em]">Load your listings</h1>
              <p className="text-[14px] text-[#6B7280] mt-1">We'll import your active properties from {form.website || "your website"}.</p>
              <div className="mt-6">
                {!listingsLoaded ? (
                  <button onClick={loadListings} disabled={loadingListings} className="w-full rounded-xl border-2 border-dashed border-[#D1D5DB] py-8 flex flex-col items-center gap-3 hover:border-[#2342B0] transition-colors disabled:opacity-60">
                    {loadingListings ? (
                      <>
                        <div className="w-8 h-8 rounded-full border-2 border-[#2342B0] border-t-transparent animate-spin" />
                        <p className="text-[13px] text-[#6B7280]">Scanning your website…</p>
                      </>
                    ) : (
                      <>
                        <CloudUpload size={28} className="text-[#9CA3AF]" />
                        <p className="text-[13px] font-medium text-[#1F2530]">Click to import listings</p>
                        <p className="text-[12px] text-[#9CA3AF]">Or drag and drop a CSV file</p>
                      </>
                    )}
                  </button>
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-[#F0FDF4] rounded-xl border border-[#86EFAC]">
                      <Check size={16} className="text-[#16A34A] shrink-0" />
                      <p className="text-[13px] font-medium text-[#16A34A]">8 listings imported successfully</p>
                    </div>
                    {["32 Ocean Parade, Brighton", "7 Hillcrest Ave, Toorak", "Penthouse, 200 Spencer St"].map(a => (
                      <div key={a} className="flex items-center gap-3 px-4 py-3 bg-[#F9FAFB] rounded-xl border border-[#E5E7EB]">
                        <div className="w-2 h-2 rounded-full bg-[#16A34A] shrink-0" />
                        <p className="text-[13px] text-[#1F2530]">{a}</p>
                      </div>
                    ))}
                    <p className="text-[12px] text-[#6B7280] text-center">+5 more listings</p>
                  </div>
                )}
                <div className="flex gap-3 mt-6">
                  <button onClick={back} className="flex-1 rounded-full border border-[#D1D5DB] bg-white text-[#404756] font-medium py-3 text-[14px] hover:bg-gray-50 transition-colors">Back</button>
                  <button onClick={next} disabled={!listingsLoaded} className="flex-1 rounded-full bg-[#2342B0] text-white font-semibold py-3 text-[14px] hover:bg-[#1d3799] transition-colors disabled:opacity-40 flex items-center justify-center gap-2">Review & Approve <ChevronRight size={16} /></button>
                </div>
              </div>
            </div>
          )}

          {/* Step 5 — Customise widget */}
          {step === 5 && (
            <div className="bg-white rounded-[24px] border border-[#D9DEE9] shadow-[0_4px_24px_rgba(0,0,0,0.06)] p-8">
              <div className="w-12 h-12 rounded-2xl bg-[#FAF5FF] flex items-center justify-center mb-5">
                <Palette size={22} className="text-[#9333EA]" />
              </div>
              <h1 className="text-[24px] font-bold text-[#1F2530] tracking-[-0.03em]">Customise your widget</h1>
              <p className="text-[14px] text-[#6B7280] mt-1">Make it match your brand before going live.</p>
              <div className="mt-6 space-y-5">
                <div>
                  <label className="block text-[12px] font-medium text-[#404754] mb-2">Brand colour</label>
                  <div className="flex items-center gap-3">
                    <input type="color" value={form.widgetColor} onChange={e => set("widgetColor", e.target.value)} className="w-10 h-10 rounded-lg border border-[#E5E7EB] cursor-pointer p-0.5" />
                    <input value={form.widgetColor} onChange={e => set("widgetColor", e.target.value)} className="flex-1 px-3 py-2.5 text-[13px] border border-[#D1D5DB] rounded-xl focus:outline-none focus:border-[#2342B0]" />
                  </div>
                </div>
                <div>
                  <label className="block text-[12px] font-medium text-[#404754] mb-2">AI avatar</label>
                  <div className="flex gap-3">
                    {["Sam", "Samantha"].map(a => (
                      <button key={a} onClick={() => set("avatar", a)} className={`flex-1 py-2.5 rounded-xl text-[13px] font-semibold border transition-all ${form.avatar === a ? "bg-[#2342B0] text-white border-[#2342B0]" : "bg-white text-[#6B7280] border-[#D1D5DB] hover:border-[#2342B0]"}`}>{a}</button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-[12px] font-medium text-[#404754] mb-2">Welcome message</label>
                  <textarea rows={3} value={form.welcome} onChange={e => set("welcome", e.target.value)} className="w-full px-3 py-2.5 text-[13px] border border-[#D1D5DB] rounded-xl resize-none focus:outline-none focus:border-[#2342B0]" />
                </div>

                {/* Mini preview */}
                <div className="rounded-xl border border-[#E5E7EB] overflow-hidden bg-[#F9FAFB]">
                  <div className="flex items-center justify-between px-3 py-2 bg-white border-b border-[#E5E7EB]">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full flex items-center justify-center text-white text-[10px] font-bold" style={{ background: form.widgetColor }}>{form.avatar[0]}</div>
                      <span className="text-[11px] font-semibold text-[#1F2530]">{form.avatar} · {form.agency || "Your Agency"}</span>
                    </div>
                  </div>
                  <div className="px-4 py-4 text-center">
                    <p className="text-[11px] text-[#6B7280]">{form.welcome}</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button onClick={back} className="flex-1 rounded-full border border-[#D1D5DB] bg-white text-[#404756] font-medium py-3 text-[14px] hover:bg-gray-50 transition-colors">Back</button>
                  <button onClick={next} className="flex-1 rounded-full bg-[#2342B0] text-white font-semibold py-3 text-[14px] hover:bg-[#1d3799] transition-colors flex items-center justify-center gap-2">Save & Continue <ChevronRight size={16} /></button>
                </div>
              </div>
            </div>
          )}

          {/* Step 6 — Go live */}
          {step === 6 && (
            <div className="bg-white rounded-[24px] border border-[#D9DEE9] shadow-[0_4px_24px_rgba(0,0,0,0.06)] p-8 text-center">
              <div className="w-16 h-16 rounded-full bg-[#ECFDF3] flex items-center justify-center mx-auto mb-5">
                <Rocket size={28} className="text-[#16A34A]" />
              </div>
              <h1 className="text-[26px] font-bold text-[#1F2530] tracking-[-0.03em]">You're ready to go live!</h1>
              <p className="text-[14px] text-[#6B7280] mt-2 max-w-sm mx-auto">Add this snippet to your website's <code className="bg-[#F3F4F6] px-1 py-0.5 rounded text-[12px]">&lt;/body&gt;</code> tag to activate your AI assistant.</p>

              <div className="mt-6 bg-[#1F2530] rounded-xl p-4 text-left">
                <p className="text-[11px] text-[#9CA3AF] mb-2 font-mono">Installation snippet</p>
                <code className="text-[12px] text-[#86EFAC] font-mono leading-relaxed block">
                  {`<script src="https://widget.realtyavatar.com/v1/embed.js"\n  data-agency="${form.agency || "your-agency"}"\n  data-color="${form.widgetColor}"\n  data-avatar="${form.avatar.toLowerCase()}"\n></script>`}
                </code>
              </div>

              <div className="mt-6 space-y-3">
                <button onClick={() => router.push("/dashboard")} className="w-full rounded-full bg-[#2342B0] text-white font-semibold py-3 text-[14px] hover:bg-[#1d3799] transition-colors flex items-center justify-center gap-2">
                  <Rocket size={16} /> Go to Dashboard
                </button>
                <button className="w-full rounded-full border border-[#D1D5DB] bg-white text-[#404756] font-medium py-3 text-[14px] hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
                  <Play size={14} /> Watch quick tutorial
                </button>
              </div>

              <div className="mt-6 grid grid-cols-3 gap-3">
                {[
                  { icon: Building2, label: "8 listings", sub: "imported" },
                  { icon: Palette, label: form.avatar, sub: "AI assistant" },
                  { icon: Globe, label: "Widget ready", sub: "to install" },
                ].map(({ icon: Icon, label, sub }) => (
                  <div key={label} className="bg-[#F9FAFB] rounded-xl p-3 border border-[#E5E7EB]">
                    <Icon size={18} className="text-[#2342B0] mx-auto mb-1" />
                    <p className="text-[12px] font-semibold text-[#1F2530]">{label}</p>
                    <p className="text-[11px] text-[#9CA3AF]">{sub}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
