"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X } from "lucide-react";
import { Sidebar } from "@/components/dashboard/Sidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  useEffect(() => {
    // Verify the server-side cookie session is valid, not just localStorage.
    fetch("/api/auth/me")
      .then((res) => {
        if (!res.ok) router.replace("/login");
      })
      .catch(() => router.replace("/login"));
  }, [router]);

  // Close the mobile drawer whenever the route changes.
  useEffect(() => {
    setMobileNavOpen(false);
  }, [pathname]);

  return (
    <div className="flex min-h-screen bg-[#EAF1FF]">
      {/* Desktop sidebar */}
      <div className="hidden md:block">
        <Sidebar />
      </div>

      {/* Mobile top bar */}
      <header className="md:hidden fixed top-0 left-0 right-0 h-14 bg-white border-b border-[#D9DEE9] flex items-center justify-between px-4 z-40">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#2342B0] flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 20 20" fill="none"><path d="M3 9.5L10 3l7 6.5V17a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z" stroke="white" strokeWidth="1.5" strokeLinejoin="round"/><path d="M7 18v-6h6v6" stroke="white" strokeWidth="1.5" strokeLinejoin="round"/></svg>
          </div>
          <span className="text-[#2448C9] font-bold text-[16px] tracking-[-0.02em]">RealtyAvatar</span>
        </div>
        <button
          onClick={() => setMobileNavOpen(!mobileNavOpen)}
          aria-label={mobileNavOpen ? "Close navigation menu" : "Open navigation menu"}
          className="w-9 h-9 flex items-center justify-center rounded-lg border border-[#D9DEE9] text-[#404754] hover:bg-gray-50"
        >
          {mobileNavOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </header>

      {/* Mobile drawer */}
      {mobileNavOpen && (
        <div className="md:hidden">
          <div
            className="fixed inset-0 bg-black/40 z-40"
            onClick={() => setMobileNavOpen(false)}
            aria-hidden="true"
          />
          <Sidebar variant="mobile" onNavigate={() => setMobileNavOpen(false)} />
        </div>
      )}

      <main className="flex-1 mx-4 mt-[72px] mb-6 md:ml-[318px] md:mr-6 md:my-6 min-h-[calc(100vh-48px)]">
        {children}
      </main>
    </div>
  );
}
