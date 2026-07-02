"use client";

import { Upload, Plus, ArrowUp, MessageSquare, FileText, User, Building2, X } from "lucide-react";
import Link from "next/link";
import { leads } from "@/lib/leads";
import { listings } from "@/lib/listings";
import { useState } from "react";

const kpis = [
  { label: "New Leads Today", value: leads.length.toString(), delta: "+12%", icon: User, color: "bg-[#EFF6FF] text-[#2342B0]", href: "/dashboard/leads" },
  { label: "Active Listings", value: listings.length.toString(), delta: "+3", icon: Building2, color: "bg-[#F0FDF4] text-[#16A34A]", href: "/dashboard/listings" },
  { label: "Documents Sent This Week", value: "87", delta: "+24%", icon: FileText, color: "bg-[#FFF7ED] text-[#F59E0B]", href: "/dashboard/documents" },
  { label: "Chats Started This Week", value: "24", delta: "+18%", icon: MessageSquare, color: "bg-[#FAF5FF] text-[#9333EA]", href: "/dashboard/widget" },
];

const activity = [
  { icon: FileText, text: "Section 32 uploaded for 14 Collins St", time: "2m ago", href: "/dashboard/documents" },
  { icon: User, text: "New lead: James Whitfield — 32 Ocean Parade", time: "18m ago", href: "/dashboard/leads/1" },
  { icon: MessageSquare, text: "New chat started on 7 Hillcrest Ave", time: "1h ago", href: "/dashboard/listings/2" },
  { icon: FileText, text: "Property search: 'beachfront 4 bed under 3M'", time: "2h ago", href: "/dashboard/leads" },
  { icon: FileText, text: "Contract requested for Penthouse, 200 Spencer", time: "3h ago", href: "/dashboard/documents" },
  { icon: User, text: "New lead: Sophie Laurent — 55 Bay Rd", time: "5h ago", href: "/dashboard/leads/4" },
];

const topListings = listings.slice(0, 5).map(l => ({ address: l.address, views: Math.floor(Math.random() * 40) + 10, id: l.id }));

const chartData = [
  { day: "Mon", value: 8 }, { day: "Tue", value: 14 }, { day: "Wed", value: 11 },
  { day: "Thu", value: 18 }, { day: "Fri", value: 24 }, { day: "Sat", value: 9 }, { day: "Sun", value: 6 },
];
const maxChart = Math.max(...chartData.map(d => d.value));

export default function DashboardOverview() {
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  return (
    <div className="space-y-5">
      {/* Upload modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[20px] border border-[#D9DEE9] shadow-[0_8px_40px_rgba(0,0,0,0.12)] w-full max-w-md p-7">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-[18px] font-bold text-[#1F2530]">Upload Document</h2>
              <button onClick={() => setShowUploadModal(false)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100"><X size={16} className="text-[#6B7280]" /></button>
            </div>
            <div className="space-y-4">
              <div><label className="block text-[12px] font-medium text-[#404754] mb-1.5">Property</label>
                <select className="w-full px-3 py-2.5 text-[13px] border border-[#D1D5DB] rounded-xl focus:outline-none focus:border-[#2342B0] bg-white">
                  {listings.map(l => <option key={l.id}>{l.address}</option>)}
                </select>
              </div>
              <div><label className="block text-[12px] font-medium text-[#404754] mb-1.5">Document Type</label>
                <select className="w-full px-3 py-2.5 text-[13px] border border-[#D1D5DB] rounded-xl focus:outline-none focus:border-[#2342B0] bg-white">
                  <option>Section 32</option><option>Contract</option><option>Floor Plan</option><option>Rental Form</option>
                </select>
              </div>
              <div className="border-2 border-dashed border-[#D1D5DB] rounded-xl p-6 text-center cursor-pointer hover:border-[#2342B0] transition-colors">
                <Upload size={22} className="mx-auto text-[#9CA3AF] mb-2" />
                <p className="text-[13px] text-[#6B7280]"><span className="text-[#2342B0] font-medium">Click to upload</span> or drag and drop</p>
                <p className="text-[11px] text-[#9CA3AF] mt-0.5">PDF, DOC up to 20MB</p>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowUploadModal(false)} className="flex-1 rounded-full border border-[#D1D5DB] bg-white text-[#404756] text-sm font-medium py-2.5 hover:bg-gray-50 transition-colors">Cancel</button>
              <button onClick={() => setShowUploadModal(false)} className="flex-1 rounded-full bg-[#2342B0] text-white text-sm font-semibold py-2.5 hover:bg-[#1d3799] transition-colors">Upload</button>
            </div>
          </div>
        </div>
      )}

      {/* Add listing modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[20px] border border-[#D9DEE9] shadow-[0_8px_40px_rgba(0,0,0,0.12)] w-full max-w-lg p-7">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-[18px] font-bold text-[#1F2530]">Add New Listing</h2>
              <button onClick={() => setShowAddModal(false)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100"><X size={16} className="text-[#6B7280]" /></button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2"><label className="block text-[12px] font-medium text-[#404754] mb-1.5">Address</label><input className="w-full px-3 py-2.5 text-[13px] border border-[#D1D5DB] rounded-xl focus:outline-none focus:border-[#2342B0]" /></div>
              <div><label className="block text-[12px] font-medium text-[#404754] mb-1.5">Suburb</label><input className="w-full px-3 py-2.5 text-[13px] border border-[#D1D5DB] rounded-xl focus:outline-none focus:border-[#2342B0]" /></div>
              <div><label className="block text-[12px] font-medium text-[#404754] mb-1.5">Price</label><input className="w-full px-3 py-2.5 text-[13px] border border-[#D1D5DB] rounded-xl focus:outline-none focus:border-[#2342B0]" /></div>
              <div><label className="block text-[12px] font-medium text-[#404754] mb-1.5">Type</label><select className="w-full px-3 py-2.5 text-[13px] border border-[#D1D5DB] rounded-xl focus:outline-none focus:border-[#2342B0] bg-white"><option>Sale</option><option>Rent</option></select></div>
              <div><label className="block text-[12px] font-medium text-[#404754] mb-1.5">Bedrooms</label><input type="number" className="w-full px-3 py-2.5 text-[13px] border border-[#D1D5DB] rounded-xl focus:outline-none focus:border-[#2342B0]" /></div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowAddModal(false)} className="flex-1 rounded-full border border-[#D1D5DB] bg-white text-[#404756] text-sm font-medium py-2.5 hover:bg-gray-50 transition-colors">Cancel</button>
              <button onClick={() => setShowAddModal(false)} className="flex-1 rounded-full bg-[#2342B0] text-white text-sm font-semibold py-2.5 hover:bg-[#1d3799] transition-colors">Add Listing</button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-white rounded-[20px] border border-[#D9DEE9] shadow-[0_2px_12px_rgba(0,0,0,0.04)] px-7 py-5 flex items-center justify-between">
        <div>
          <h1 className="text-[26px] font-bold text-[#1F2530] tracking-[-0.03em]">Dashboard Overview</h1>
          <p className="text-[14px] text-[#6B7280] mt-0.5">Welcome back, Sam! Here's what's been happening.</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => setShowUploadModal(true)} className="rounded-full border border-[#D1D5DB] bg-white text-[#404756] text-sm font-medium px-4 py-2 shadow-sm hover:bg-gray-50 transition-colors flex items-center gap-2">
            <Upload size={14} /> Upload Document
          </button>
          <button onClick={() => setShowAddModal(true)} className="rounded-full bg-[#2342B0] text-white text-sm font-semibold px-5 py-2.5 shadow-sm hover:bg-[#1d3799] transition-colors flex items-center gap-2">
            <Plus size={14} /> Add New Listing
          </button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-4 gap-4">
        {kpis.map(({ label, value, delta, icon: Icon, color, href }) => (
          <Link key={label} href={href} className="bg-white rounded-[20px] border border-[#D9DEE9] shadow-[0_2px_12px_rgba(0,0,0,0.04)] p-5 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}><Icon size={18} /></div>
              <span className="flex items-center gap-1 text-xs font-semibold text-[#16A34A] bg-[#ECFDF3] border border-[#86EFAC] rounded-full px-2 py-0.5">
                <ArrowUp size={10} />{delta}
              </span>
            </div>
            <p className="mt-4 text-[38px] font-bold text-[#1F2530] leading-none">{value}</p>
            <p className="mt-1.5 text-[13px] text-[#6B7280] font-medium">{label}</p>
          </Link>
        ))}
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-[1fr_360px] gap-4">
        {/* Recent activity */}
        <div className="bg-white rounded-[20px] border border-[#D9DEE9] shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
          <div className="px-6 py-4 border-b border-[#E5E7EB] flex items-center justify-between">
            <h2 className="text-[16px] font-bold text-[#1F2530]">Recent activity</h2>
            <Link href="/dashboard/leads" className="text-xs font-medium text-[#2342B0] hover:underline">View all</Link>
          </div>
          <div className="divide-y divide-[#E5E7EB]">
            {activity.map((item, i) => (
              <Link key={i} href={item.href} className="flex items-center gap-4 px-6 py-4 hover:bg-[#F9FAFB] transition-colors">
                <div className="w-9 h-9 rounded-full bg-[#F5F6FA] flex items-center justify-center shrink-0">
                  <item.icon size={15} className="text-[#6B7280]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] text-[#2D3340] font-medium truncate">{item.text}</p>
                  <p className="text-[12px] text-[#6B7280] mt-0.5">{item.time}</p>
                </div>
                {i < 2 && <span className="w-2 h-2 rounded-full bg-[#12B76A] shrink-0" />}
              </Link>
            ))}
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-4">
          <div className="bg-white rounded-[20px] border border-[#D9DEE9] shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
            <div className="px-5 py-4 border-b border-[#E5E7EB] flex items-center justify-between">
              <h2 className="text-[15px] font-bold text-[#1F2530]">Top listings this week</h2>
              <Link href="/dashboard/listings" className="text-xs font-medium text-[#2342B0] hover:underline">View all</Link>
            </div>
            <div className="divide-y divide-[#E5E7EB]">
              {topListings.map(({ address, views, id }) => (
                <Link key={id} href={`/dashboard/listings/${id}`} className="flex items-center gap-3 px-5 py-3 hover:bg-[#F9FAFB] transition-colors">
                  <div className="w-8 h-8 rounded-md bg-[#EAF1FF] shrink-0" />
                  <p className="flex-1 text-[13px] text-[#2D3340] font-medium truncate">{address}</p>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[12px] text-[#6B7280]">{views} views</span>
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M5 10.5l4-3.5-4-3.5" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-[20px] border border-[#D9DEE9] shadow-[0_2px_12px_rgba(0,0,0,0.04)] p-5">
            <h2 className="text-[15px] font-bold text-[#1F2530] mb-4">Daily chats this week</h2>
            <div className="flex items-end gap-2 h-24">
              {chartData.map(({ day, value }) => (
                <div key={day} className="flex-1 flex flex-col items-center gap-1.5">
                  <div className="w-full bg-[#2342B0] rounded-t-md flex items-start justify-center pt-1 relative hover:bg-[#1d3799] transition-colors cursor-pointer" style={{ height: `${(value / maxChart) * 80}px` }}>
                    <span className="text-[10px] font-bold text-white">{value}</span>
                  </div>
                  <span className="text-[11px] text-[#6B7280]">{day}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
