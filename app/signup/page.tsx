"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Mail, Lock, Eye, EyeOff, User, Building2 } from "lucide-react";
import { setSession } from "@/lib/auth";

export default function SignupPage() {
  const router = useRouter();
  const [form, setForm] = useState({ firstName: "", lastName: "", agencyName: "", email: "", password: "" });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function set(k: string, v: string) { setForm(f => ({ ...f, [k]: v })); }

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!form.firstName || !form.lastName || !form.agencyName || !form.email || !form.password) {
      setError("All fields are required.");
      return;
    }
    if (form.password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong.");
        return;
      }
      setSession(data.user);
      router.push("/dashboard");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#EAF1FF] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-[#2342B0] flex items-center justify-center">
            <svg width="22" height="22" viewBox="0 0 20 20" fill="none">
              <path d="M3 9.5L10 3l7 6.5V17a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z" stroke="white" strokeWidth="1.5" strokeLinejoin="round"/>
              <path d="M7 18v-6h6v6" stroke="white" strokeWidth="1.5" strokeLinejoin="round"/>
            </svg>
          </div>
          <span className="text-[#2448C9] font-bold text-[20px] tracking-[-0.02em]">RealtyAvatar</span>
        </div>

        <div className="bg-white rounded-[24px] border border-[#D9DEE9] shadow-[0_4px_24px_rgba(0,0,0,0.06)] p-8">
          <h1 className="text-[22px] font-bold text-[#1F2530] mb-1">Create your account</h1>
          <p className="text-[13px] text-[#6B7280] mb-6">Get started with RealtyAvatar — free to try</p>

          <form onSubmit={handleSignup} className="space-y-4">
            {/* Name row */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[12px] font-medium text-[#404754] mb-1.5">First Name</label>
                <div className="relative">
                  <User size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
                  <input type="text" value={form.firstName} onChange={e => set("firstName", e.target.value)}
                    placeholder="Sam"
                    className="w-full pl-9 pr-3 py-3 border border-[#D1D5DB] rounded-xl text-[14px] focus:outline-none focus:border-[#2342B0]" />
                </div>
              </div>
              <div>
                <label className="block text-[12px] font-medium text-[#404754] mb-1.5">Last Name</label>
                <input type="text" value={form.lastName} onChange={e => set("lastName", e.target.value)}
                  placeholder="Banks"
                  className="w-full px-3 py-3 border border-[#D1D5DB] rounded-xl text-[14px] focus:outline-none focus:border-[#2342B0]" />
              </div>
            </div>

            {/* Agency name */}
            <div>
              <label className="block text-[12px] font-medium text-[#404754] mb-1.5">Agency Name</label>
              <div className="relative">
                <Building2 size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
                <input type="text" value={form.agencyName} onChange={e => set("agencyName", e.target.value)}
                  placeholder="Banks Real Estate"
                  className="w-full pl-9 pr-3 py-3 border border-[#D1D5DB] rounded-xl text-[14px] focus:outline-none focus:border-[#2342B0]" />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-[12px] font-medium text-[#404754] mb-1.5">Email Address</label>
              <div className="relative">
                <Mail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
                <input type="email" value={form.email} onChange={e => set("email", e.target.value)}
                  placeholder="you@youragency.com.au"
                  className="w-full pl-9 pr-3 py-3 border border-[#D1D5DB] rounded-xl text-[14px] focus:outline-none focus:border-[#2342B0]" />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-[12px] font-medium text-[#404754] mb-1.5">Password</label>
              <div className="relative">
                <Lock size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
                <input type={showPw ? "text" : "password"} value={form.password} onChange={e => set("password", e.target.value)}
                  placeholder="Min. 8 characters"
                  className="w-full pl-9 pr-10 py-3 border border-[#D1D5DB] rounded-xl text-[14px] focus:outline-none focus:border-[#2342B0]" />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]">
                  {showPw ? <EyeOff size={15}/> : <Eye size={15}/>}
                </button>
              </div>
            </div>

            {error && (
              <p className="text-[13px] text-[#EF4444] bg-[#FEF2F2] px-3 py-2 rounded-xl">{error}</p>
            )}

            <button type="submit" disabled={loading}
              className="w-full bg-[#2342B0] text-white rounded-xl py-3 font-semibold text-[15px] hover:bg-[#1d3799] transition-colors disabled:opacity-50 mt-2">
              {loading ? "Creating account…" : "Create Account →"}
            </button>
          </form>

          <p className="text-[12px] text-[#9CA3AF] text-center mt-5">
            Already have an account?{" "}
            <Link href="/login" className="text-[#2342B0] font-medium hover:underline">Sign in</Link>
          </p>
        </div>

        <p className="text-[11px] text-[#9CA3AF] text-center mt-4">
          By signing up you agree to our Terms of Service & Privacy Policy
        </p>
      </div>
    </div>
  );
}
