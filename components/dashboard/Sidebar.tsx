"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import clsx from "clsx";
import { getSession, clearSession, type AgentSession } from "@/lib/auth";
import {
  LayoutGrid,
  Building2,
  Users,
  FileText,
  MessageSquare,
  Megaphone,
  Bell,
  Settings,
  Home,
  UserCog,
  CreditCard,
} from "lucide-react";

const nav = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutGrid, badge: 0 },
  { label: "Listings", href: "/dashboard/listings", icon: Building2, badge: 0 },
  { label: "Rentals", href: "/dashboard/rentals", icon: Home, badge: 0 },
  { label: "Leads", href: "/dashboard/leads", icon: Users, badge: 0 },
  { label: "Documents", href: "/dashboard/documents", icon: FileText, badge: 0 },
  { label: "Widget Settings", href: "/dashboard/widget", icon: MessageSquare, badge: 0 },
  { label: "Seller Campaigns", href: "/dashboard/campaigns", icon: Megaphone, badge: 0 },
  { label: "Team", href: "/dashboard/team", icon: UserCog, badge: 0 },
  { label: "Notifications", href: "/dashboard/notifications", icon: Bell, badge: 3 },
  { label: "Billing & Plans", href: "/dashboard/billing", icon: CreditCard, badge: 0 },
  { label: "Account Settings", href: "/dashboard/settings", icon: Settings, badge: 0 },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [agent, setAgent] = useState<AgentSession | null>(null);
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    setAgent(getSession());
  }, []);

  function handleLogout() {
    clearSession();
    router.push("/login");
  }

  function handleSwitch() {
    clearSession();
    router.push("/login");
  }

  return (
    <aside className="fixed left-6 top-6 bottom-6 w-[270px] bg-white rounded-[22px] border border-[#D9DEE9] shadow-[0_2px_16px_rgba(0,0,0,0.06)] flex flex-col z-30 overflow-hidden">
      {/* Logo */}
      <div className="px-6 pt-6 pb-5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#2342B0] flex items-center justify-center">
            <svg width="18" height="18" viewBox="0 0 20 20" fill="none"><path d="M3 9.5L10 3l7 6.5V17a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z" stroke="white" strokeWidth="1.5" strokeLinejoin="round"/><path d="M7 18v-6h6v6" stroke="white" strokeWidth="1.5" strokeLinejoin="round"/></svg>
          </div>
          <span className="text-[#2448C9] font-bold text-[17px] tracking-[-0.02em]">RealtyAvatar</span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 space-y-0.5 overflow-y-auto">
        {nav.map(({ label, href, icon: Icon, badge }) => {
          const active = pathname === href || (href !== "/dashboard" && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className={clsx(
                "relative flex items-center gap-3.5 px-4 py-[14px] rounded-xl text-[14px] font-medium transition-colors",
                active
                  ? "text-[#2342B0] font-semibold"
                  : "text-[#5B6270] hover:text-[#1F2530] hover:bg-gray-50"
              )}
            >
              {/* Active indicator bar */}
              {active && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[5px] h-9 bg-[#2342B0] rounded-r-full" />
              )}
              <Icon
                size={19}
                strokeWidth={active ? 2.2 : 1.8}
                className={active ? "text-[#2342B0]" : "text-[#5B6270]"}
              />
              <span className="flex-1">{label}</span>
              {badge > 0 && (
                <span className="w-5 h-5 rounded-full bg-[#EF4444] text-white text-[10px] font-bold flex items-center justify-center">{badge}</span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Agent profile + logout */}
      <div className="px-4 pb-5 pt-3 border-t border-[#E5E7EB] relative">
        {showMenu && (
          <div className="absolute bottom-full left-4 right-4 mb-2 bg-white rounded-xl border border-[#E5E7EB] shadow-lg overflow-hidden z-50">
            <button onClick={handleSwitch} className="w-full text-left px-4 py-3 text-[13px] font-medium text-[#404754] hover:bg-[#F9FAFB] flex items-center gap-2">
              <svg width="14" height="14" viewBox="0 0 20 20" fill="none"><path d="M8 5H6a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-2M13 3h4m0 0v4m0-4l-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
              Switch Agent
            </button>
            <button onClick={handleLogout} className="w-full text-left px-4 py-3 text-[13px] font-medium text-[#EF4444] hover:bg-[#FEF2F2] flex items-center gap-2 border-t border-[#E5E7EB]">
              <svg width="14" height="14" viewBox="0 0 20 20" fill="none"><path d="M13 7l4 3m0 0l-4 3m4-3H7m6 7H5a2 2 0 01-2-2V5a2 2 0 012-2h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
              Sign Out
            </button>
          </div>
        )}
        <button onClick={() => setShowMenu(!showMenu)} className="w-full flex items-center gap-3 p-3 rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] hover:bg-gray-100 transition-colors text-left">
          <div className="relative shrink-0">
            <div className="w-9 h-9 rounded-full bg-[#2342B0] flex items-center justify-center text-white text-xs font-bold">
              {agent ? agent.name.split(" ").map(n => n[0]).join("").slice(0,2).toUpperCase() : "??"}
            </div>
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-[#12B76A] rounded-full border-2 border-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-semibold text-[#20242E] truncate">{agent?.name || "Not signed in"}</p>
            <p className="text-[11px] text-[#6B7280] truncate">{agent?.role || "Agent"}</p>
          </div>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="shrink-0 text-gray-400">
            <path d="M5 6l3-3 3 3M5 10l3 3 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
    </aside>
  );
}
