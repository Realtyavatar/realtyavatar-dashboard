"use client";

import { Search, Upload, Plus, ChevronDown, Pencil, MoreVertical, X } from "lucide-react";
import { AddressAutocomplete } from "@/components/AddressAutocomplete";
import { PriceInput } from "@/components/PriceInput";
import Link from "next/link";
import { useState, useEffect, useCallback } from "react";

interface Listing { id: number; address: string; suburb: string; price: string; type: string; beds: number; baths: number; parking: number; docs: string; img: string; }

export default function ListingsPage() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [form, setForm] = useState({ address: "", suburb: "", price: "", type: "House", beds: "", baths: "", cars: "", status: "Active", agent: "Sam Banks" });

  async function fetchListings() {
    const params = new URLSearchParams();
    if (statusFilter !== "All") params.set("status", statusFilter);
    if (search) params.set("search", search);
    const res = await fetch(`/api/listings?${params}`);
    setListings(await res.json());
    setLoading(false);
  }

  useEffect(() => { fetchListings(); }, [search, statusFilter]);

  async function addListing() {
    if (!form.address) return;
    setSaving(true);
    const res = await fetch("/api/listings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        address: form.address,
        suburb: form.suburb,
        price: form.price,
        type: form.type,
        beds: parseInt(form.beds) || 0,
        baths: parseInt(form.baths) || 0,
        cars: parseInt(form.cars) || 0,
        status: form.status,
        agent: form.agent,
        days: 0,
      })
    });
    setSaving(false);
    if (res.ok) {
      setShowModal(false);
      setForm({ address: "", suburb: "", price: "", type: "House", beds: "", baths: "", cars: "", status: "Active", agent: "Sam Banks" });
      fetchListings();
    }
  }

  return (
    <div className="space-y-5">
      {showModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[20px] border border-[#D9DEE9] shadow-[0_8px_40px_rgba(0,0,0,0.12)] w-full max-w-lg p-7">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-[18px] font-bold text-[#1F2530]">Add New Listing</h2>
              <button onClick={() => setShowModal(false)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100"><X size={16} className="text-[#6B7280]" /></button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-[12px] font-medium text-[#404754] mb-1.5">Address</label>
                <AddressAutocomplete
                  value={form.address}
                  onChange={(address, suburb) => setForm(p => ({ ...p, address, suburb: suburb || p.suburb }))}
                  placeholder="Start typing an address..."
                  className="w-full px-3 py-2.5 text-[13px] border border-[#D1D5DB] rounded-xl focus:outline-none focus:border-[#2342B0]"
                />
              </div>
              <div><label className="block text-[12px] font-medium text-[#404754] mb-1.5">Suburb</label><input value={form.suburb} onChange={e => setForm(p=>({...p,suburb:e.target.value}))} placeholder="Auto-filled from address" className="w-full px-3 py-2.5 text-[13px] border border-[#D1D5DB] rounded-xl focus:outline-none focus:border-[#2342B0]" /></div>
              <div><label className="block text-[12px] font-medium text-[#404754] mb-1.5">Price</label><PriceInput value={form.price} onChange={v => setForm(p=>({...p,price:v}))} placeholder="$3,200,000" className="w-full px-3 py-2.5 text-[13px] border border-[#D1D5DB] rounded-xl focus:outline-none focus:border-[#2342B0]" /></div>
              <div><label className="block text-[12px] font-medium text-[#404754] mb-1.5">Type</label><select value={form.type} onChange={e => setForm(p=>({...p,type:e.target.value}))} className="w-full px-3 py-2.5 text-[13px] border border-[#D1D5DB] rounded-xl focus:outline-none focus:border-[#2342B0] bg-white"><option>House</option><option>Apartment</option><option>Townhouse</option><option>Land</option><option>Rural</option></select></div>
              <div><label className="block text-[12px] font-medium text-[#404754] mb-1.5">Status</label><select value={form.status} onChange={e => setForm(p=>({...p,status:e.target.value}))} className="w-full px-3 py-2.5 text-[13px] border border-[#D1D5DB] rounded-xl focus:outline-none focus:border-[#2342B0] bg-white"><option>Active</option><option>Under Offer</option><option>Sold</option></select></div>
              <div><label className="block text-[12px] font-medium text-[#404754] mb-1.5">Bedrooms</label><input type="number" min="0" value={form.beds} onChange={e => setForm(p=>({...p,beds:e.target.value}))} className="w-full px-3 py-2.5 text-[13px] border border-[#D1D5DB] rounded-xl focus:outline-none focus:border-[#2342B0]" /></div>
              <div><label className="block text-[12px] font-medium text-[#404754] mb-1.5">Bathrooms</label><input type="number" min="0" value={form.baths} onChange={e => setForm(p=>({...p,baths:e.target.value}))} className="w-full px-3 py-2.5 text-[13px] border border-[#D1D5DB] rounded-xl focus:outline-none focus:border-[#2342B0]" /></div>
              <div><label className="block text-[12px] font-medium text-[#404754] mb-1.5">Car Spaces</label><input type="number" min="0" value={form.cars} onChange={e => setForm(p=>({...p,cars:e.target.value}))} className="w-full px-3 py-2.5 text-[13px] border border-[#D1D5DB] rounded-xl focus:outline-none focus:border-[#2342B0]" /></div>
              <div className="col-span-2"><label className="block text-[12px] font-medium text-[#404754] mb-1.5">Agent</label><input value={form.agent} onChange={e => setForm(p=>({...p,agent:e.target.value}))} placeholder="Agent name" className="w-full px-3 py-2.5 text-[13px] border border-[#D1D5DB] rounded-xl focus:outline-none focus:border-[#2342B0]" /></div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowModal(false)} className="flex-1 rounded-full border border-[#D1D5DB] bg-white text-[#404756] text-sm font-medium py-2.5 hover:bg-gray-50 transition-colors">Cancel</button>
              <button onClick={addListing} disabled={saving || !form.address} className="flex-1 rounded-full bg-[#2342B0] text-white text-sm font-semibold py-2.5 hover:bg-[#1d3799] transition-colors disabled:opacity-50">{saving ? "Saving…" : "Add Listing"}</button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-[20px] border border-[#D9DEE9] shadow-[0_2px_12px_rgba(0,0,0,0.04)] px-7 py-5 flex items-start justify-between">
        <div>
          <h1 className="text-[26px] font-bold text-[#1F2530] tracking-[-0.03em]">Listings</h1>
          <p className="text-[14px] text-[#6B7280] mt-0.5 max-w-xl">Manage your active properties, upload documents, and control what appears in the widget.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="rounded-full border border-[#D1D5DB] bg-white text-[#404756] text-sm font-medium px-4 py-2 shadow-sm hover:bg-gray-50 transition-colors flex items-center gap-2 text-[13px]"><Upload size={13} /> Upload Bulk</button>
          <button onClick={() => setShowModal(true)} className="rounded-full bg-[#2342B0] text-white text-sm font-semibold px-5 py-2.5 shadow-sm hover:bg-[#1d3799] transition-colors flex items-center gap-2 text-[13px]"><Plus size={13} /> Add New Listing</button>
        </div>
      </div>

      <div className="bg-white rounded-[20px] border border-[#D9DEE9] shadow-[0_2px_12px_rgba(0,0,0,0.04)] overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E5E7EB]">
          <div className="flex items-center gap-2">
            <button className="rounded-full border border-[#D1D5DB] bg-white text-[#404756] text-sm font-medium px-4 py-2 shadow-sm hover:bg-gray-50 transition-colors flex items-center gap-1.5 text-[13px]">All type <ChevronDown size={13} /></button>
            <button className="rounded-full border border-[#D1D5DB] bg-white text-[#404756] text-sm font-medium px-4 py-2 shadow-sm hover:bg-gray-50 transition-colors flex items-center gap-1.5 text-[13px]">All price range <ChevronDown size={13} /></button>
          </div>
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
            <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search listings..." className="pl-9 pr-4 py-2 text-[13px] bg-white border border-[#D1D5DB] rounded-full w-52 focus:outline-none focus:border-[#2342B0]" />
          </div>
        </div>

        <table className="w-full">
          <thead>
            <tr className="border-b border-[#E5E7EB]">
              <th className="px-6 py-3 text-left"><div className="w-4 h-4 rounded border border-[#D1D5DB] bg-white" /></th>
              <th className="px-4 py-3 text-left text-[12px] font-semibold text-[#404754] uppercase tracking-wide">Property</th>
              <th className="px-4 py-3 text-left text-[12px] font-semibold text-[#404754] uppercase tracking-wide">Price</th>
              <th className="px-4 py-3 text-left text-[12px] font-semibold text-[#404754] uppercase tracking-wide">Type</th>
              <th className="px-4 py-3 text-left text-[12px] font-semibold text-[#404754] uppercase tracking-wide">Docs</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E5E7EB]">
            {loading ? (
              <tr><td colSpan={6} className="px-6 py-12 text-center text-[13px] text-[#6B7280]">Loading…</td></tr>
            ) : listings.map((l) => (
              <tr key={l.id} className="hover:bg-[#F9FAFB] transition-colors cursor-pointer">
                <td className="px-6 py-[18px]"><div className="w-4 h-4 rounded border border-[#D1D5DB] bg-white" /></td>
                <td className="px-4 py-[18px]">
                  <Link href={`/dashboard/listings/${l.id}`} className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-lg shrink-0" style={{ background: l.img }} />
                    <div>
                      <p className="text-[13px] font-semibold text-[#1F2530] hover:text-[#2342B0] transition-colors">{l.address}</p>
                      <p className="text-[12px] text-[#6B7280] mt-0.5">{l.suburb}</p>
                    </div>
                  </Link>
                </td>
                <td className="px-4 py-[18px]"><p className="text-[13px] font-semibold text-[#1F2530]">{l.price}</p></td>
                <td className="px-4 py-[18px]">
                  <span className={`rounded-full text-xs font-semibold px-2.5 py-0.5 border ${l.type === "Sale" ? "bg-[#ECFDF3] border-[#86EFAC] text-[#16A34A]" : "bg-[#FFF7ED] border-[#FDBA74] text-[#F59E0B]"}`}>{l.type}</span>
                </td>
                <td className="px-4 py-[18px]">
                  <span className={`text-[13px] font-medium ${l.docs?.includes("Missing") ? "text-[#EF4444]" : l.docs === "Complete" ? "text-[#16A34A]" : "text-[#6B7280]"}`}>{l.docs}</span>
                </td>
                <td className="px-4 py-[18px]">
                  <div className="flex items-center gap-1 justify-end">
                    <Link href={`/dashboard/listings/${l.id}`} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-100"><Pencil size={13} className="text-[#9CA3AF]" /></Link>
                    <button className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-100"><MoreVertical size={15} className="text-[#9CA3AF]" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex items-center justify-between px-6 py-4 border-t border-[#E5E7EB]">
          <span className="text-[13px] text-[#6B7280]">{listings.length} listing{listings.length !== 1 ? "s" : ""}</span>
          <div className="flex items-center gap-2">
            <button className="rounded-full border border-[#D1D5DB] bg-white text-[#404756] text-sm font-medium px-4 py-2 hover:bg-gray-50 transition-colors text-[13px]">Previous</button>
            <button className="rounded-full border border-[#D1D5DB] bg-white text-[#404756] text-sm font-medium px-4 py-2 hover:bg-gray-50 transition-colors text-[13px]">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}
