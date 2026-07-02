"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { verifyAgent, setSession, getSession } from "@/lib/auth";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // Check real server-side session
    fetch("/api/auth/me")
      .then((res) => { if (res.ok) router.replace("/dashboard"); })
      .catch(() => {});
  }, [router]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!email || !password) { setError("Please enter your email and password."); return; }
    setLoading(true);
    const agent = await verifyAgent(email, password);
    setLoading(false);
    if (!agent) {
      setError("Invalid email or password.");
      return;
    }
    setSession(agent);
    router.push("/dashboard");
  }

  return (
    <div className="min-h-screen bg-[#EAF1FF] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
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
          <h1 className="text-[22px] font-bold text-[#1F2530] mb-1">Agent Login</h1>
          <p className="text-[13px] text-[#6B7280] mb-6">Sign in to your RealtyAvatar dashboard</p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-[12px] font-medium text-[#404754] mb-1.5">Email Address</label>
              <div className="relative">
                <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@realtyavatar.com"
                  className="w-full pl-10 pr-4 py-3 border border-[#D1D5DB] rounded-xl text-[14px] focus:outline-none focus:border-[#2342B0]" />
              </div>
            </div>

            <div>
              <label className="block text-[12px] font-medium text-[#404754] mb-1.5">Password</label>
              <div className="relative">
                <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
                <input type={showPw ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} placeholder="Your password"
                  className="w-full pl-10 pr-10 py-3 border border-[#D1D5DB] rounded-xl text-[14px] focus:outline-none focus:border-[#2342B0]" />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]">
                  {showPw ? <EyeOff size={15}/> : <Eye size={15}/>}
                </button>
              </div>
            </div>

            {error && <p className="text-[13px] text-[#EF4444] bg-[#FEF2F2] px-3 py-2 rounded-xl">{error}</p>}

            <button type="submit" disabled={loading}
              className="w-full bg-[#2342B0] text-white rounded-xl py-3 font-semibold text-[15px] hover:bg-[#1d3799] transition-colors disabled:opacity-50">
              {loading ? "Signing in…" : "Sign In →"}
            </button>
          </form>

          <p className="text-[12px] text-[#9CA3AF] text-center mt-5">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-[#2342B0] font-medium hover:underline">Sign up free</Link>
          </p>

          <div className="mt-4 p-4 bg-[#F9FAFB] rounded-xl border border-[#E5E7EB]">
            <p className="text-[12px] font-semibold text-[#404754] mb-2">Agent Login Guide:</p>
            <p className="text-[11px] text-[#6B7280]">Email: your agent email (e.g. sam@realtyavatar.com)</p>
            <p className="text-[11px] text-[#6B7280]">Password: <strong>realty</strong> + your first name (e.g. <strong>realtysam</strong>)</p>
            <p className="text-[11px] text-[#9CA3AF] mt-1">Or use master password: <strong>realty123</strong></p>
          </div>
        </div>
      </div>
    </div>
  );
}
