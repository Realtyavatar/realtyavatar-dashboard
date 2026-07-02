"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/dashboard/Sidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    // Verify the server-side cookie session is valid, not just localStorage.
    fetch("/api/auth/me")
      .then((res) => {
        if (!res.ok) router.replace("/login");
      })
      .catch(() => router.replace("/login"));
  }, [router]);

  return (
    <div className="flex min-h-screen bg-[#EAF1FF]">
      <Sidebar />
      <main className="flex-1 ml-[318px] mr-6 my-6 min-h-[calc(100vh-48px)]">
        {children}
      </main>
    </div>
  );
}
