"use client";

import Link from "next/link";
import { ArrowLeft, Pencil, MapPin, Bed, Bath, Car, Upload, X, CloudUpload } from "lucide-react";
import { use, useState, useEffect } from "react";

const statusOptions = ["Available", "Under Application", "Leased"];

export default function RentalDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [rental, setRental] = useState<any>(null);
  const [showEdit, setShowEdit] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [editForm, setEditForm] = useState<any>({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [uploadDocType, setUploadDocType] = useState("Tenancy Agreement");
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadSaving, setUploadSaving] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [docs, setDocs] = useState<any[]>([]);

  useEffect(() => {
    fetch(`/api/rentals/${id}`).then(r => r.json()).then(data => {
      if (data.error) return;
      setRental(data);
      setEditForm(data);
    });
  }, [id]);

  useEffect(() => {
    if (rental) {
      fetch(`/api/documents?search=${encodeURIComponent(rental.address)}`)
        .then(r => r.json()).then(d => setDocs(Array.isArray(d) ? d : []));
    }
  }, [rental]);

  async function uploadDoc() {
    if (!rental) return;
    setUploadSaving(true);
    const res = await fetch("/api/documents", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        property_address: rental.address,
        suburb: rental.suburb,
        doc_type: uploadDocType,
        file_name: uploadFile?.name || `${uploadDocType.toLowerCase().replace(/ /g, "_")}.pdf`,
        uploaded_by: "Sam Banks",
      }),
    });
    setUploadSaving(false);
    if (res.ok) {
      setShowUpload(false);
      setUploadFile(null);
      setUploadSuccess(true);
      setTimeout(() => setUploadSuccess(false), 3000);
      fetch(`/api/documents?search=${encodeURIComponent(rental.address)}`)
        .then(r => r.json()).then(d => setDocs(Array.isArray(d) ? d : []));
    }
  }

  async function saveEdit() {
    setSaving(true);
    const res = await fetch(`/api/rentals/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        address: editForm.address,
        suburb: editForm.suburb,
        rent: editForm.rent || editForm.price,
        beds: Number(editForm.beds),
        baths: Number(editForm.baths),
        cars: Number(editForm.cars || editForm.parking || 0),
        available: editForm.available,
        status: editForm.status,
      }),
    });
    const updated = await res.json();
    setRental(updated);
    setSaving(false);
    setShowEdit(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  if (!rental) return <div className="p-8 text-[#6B7280] text-[13px]">Loading…</div>;

  return (
    <div className="space-y-5">

      {/* Edit Modal */}
      {showEdit && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[20px] border border-[#D9DEE9] shadow-[0_8px_40px_rgba(0,0,0,0.12)] w-full max-w-lg p-7">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-[18px] font-bold text-[#1F2530]">Edit Rental</h2>
              <button onClick={() => setShowEdit(false)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100"><X size={16} className="text-[#6B7280]" /></button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2"><label className="block text-[12px] font-medium text-[#404754] mb-1.5">Address</label><input value={editForm.address || ""} onChange={e => setEditForm((p: any) => ({ ...p, address: e.target.value }))} className="w-full px-3 py-2.5 text-[13px] border border-[#D1D5DB] rounded-xl focus:outline-none focus:border-[#2342B0]" /></div>
              <div><label className="block text-[12px] font-medium text-[#404754] mb-1.5">Suburb</label><input value={editForm.suburb || ""} onChange={e => setEditForm((p: any) => ({ ...p, suburb: e.target.value }))} className="w-full px-3 py-2.5 text-[13px] border border-[#D1D5DB] rounded-xl focus:outline-none focus:border-[#2342B0]" /></div>
              <div><label className="block text-[12px] font-medium text-[#404754] mb-1.5">Weekly Rent</label><input value={editForm.rent || editForm.price || ""} onChange={e => setEditForm((p: any) => ({ ...p, rent: e.target.value }))} className="w-full px-3 py-2.5 text-[13px] border border-[#D1D5DB] rounded-xl focus:outline-none focus:border-[#2342B0]" /></div>
              <div><label className="block text-[12px] font-medium text-[#404754] mb-1.5">Bedrooms</label><input type="number" value={editForm.beds || ""} onChange={e => setEditForm((p: any) => ({ ...p, beds: e.target.value }))} className="w-full px-3 py-2.5 text-[13px] border border-[#D1D5DB] rounded-xl focus:outline-none focus:border-[#2342B0]" /></div>
              <div><label className="block text-[12px] font-medium text-[#404754] mb-1.5">Bathrooms</label><input type="number" value={editForm.baths || ""} onChange={e => setEditForm((p: any) => ({ ...p, baths: e.target.value }))} className="w-full px-3 py-2.5 text-[13px] border border-[#D1D5DB] rounded-xl focus:outline-none focus:border-[#2342B0]" /></div>
              <div><label className="block text-[12px] font-medium text-[#404754] mb-1.5">Available From</label><input value={editForm.available || ""} onChange={e => setEditForm((p: any) => ({ ...p, available: e.target.value }))} className="w-full px-3 py-2.5 text-[13px] border border-[#D1D5DB] rounded-xl focus:outline-none focus:border-[#2342B0]" /></div>
              <div className="col-span-2"><label className="block text-[12px] font-medium text-[#404754] mb-1.5">Status</label>
                <select value={editForm.status || "Available"} onChange={e => setEditForm((p: any) => ({ ...p, status: e.target.value }))} className="w-full px-3 py-2.5 text-[13px] border border-[#D1D5DB] rounded-xl focus:outline-none focus:border-[#2342B0] bg-white">
                  {statusOptions.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowEdit(false)} className="flex-1 rounded-full border border-[#D1D5DB] bg-white text-[#404756] text-sm font-medium py-2.5 hover:bg-gray-50 transition-colors">Cancel</button>
              <button onClick={saveEdit} disabled={saving} className="flex-1 rounded-full bg-[#2342B0] text-white text-sm font-semibold py-2.5 hover:bg-[#1d3799] transition-colors disabled:opacity-50">{saving ? "Saving…" : "Save Changes"}</button>
            </div>
          </div>
        </div>
      )}

      {/* Upload Modal */}
      {showUpload && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[20px] border border-[#D9DEE9] shadow-[0_8px_40px_rgba(0,0,0,0.12)] w-full max-w-md p-7">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-[18px] font-bold text-[#1F2530]">Upload Document</h2>
              <button onClick={() => setShowUpload(false)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100"><X size={16} className="text-[#6B7280]" /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-[12px] font-medium text-[#404754] mb-1.5">Property</label>
                <p className="text-[13px] font-medium text-[#1F2530] bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl px-3 py-2.5">{rental.address}</p>
              </div>
              <div>
                <label className="block text-[12px] font-medium text-[#404754] mb-1.5">Document Type</label>
                <select value={uploadDocType} onChange={e => setUploadDocType(e.target.value)} className="w-full px-3 py-2.5 text-[13px] border border-[#D1D5DB] rounded-xl focus:outline-none focus:border-[#2342B0] bg-white">
                  <option>Tenancy Agreement</option>
                  <option>Bond Receipt</option>
                  <option>Condition Report</option>
                  <option>Entry Notice</option>
                  <option>Lease Renewal</option>
                  <option>Other</option>
                </select>
              </div>
              <label className="block border-2 border-dashed border-[#D1D5DB] rounded-xl p-6 text-center cursor-pointer hover:border-[#2342B0] transition-colors">
                <CloudUpload size={22} className="mx-auto text-[#9CA3AF] mb-2" />
                {uploadFile
                  ? <p className="text-[13px] text-[#2342B0] font-medium">{uploadFile.name}</p>
                  : <p className="text-[13px] text-[#6B7280]"><span className="text-[#2342B0] font-medium">Click to upload</span> or drag and drop</p>
                }
                <input type="file" className="hidden" accept=".pdf,.doc,.docx" onChange={e => setUploadFile(e.target.files?.[0] || null)} />
              </label>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowUpload(false)} className="flex-1 rounded-full border border-[#D1D5DB] bg-white text-[#404756] text-sm font-medium py-2.5 hover:bg-gray-50 transition-colors">Cancel</button>
              <button onClick={uploadDoc} disabled={uploadSaving} className="flex-1 rounded-full bg-[#2342B0] text-white text-sm font-semibold py-2.5 hover:bg-[#1d3799] transition-colors disabled:opacity-50">
                {uploadSaving ? "Uploading…" : "Upload"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-white rounded-[20px] border border-[#D9DEE9] shadow-[0_2px_12px_rgba(0,0,0,0.04)] px-7 py-5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/rentals" className="w-9 h-9 flex items-center justify-center rounded-xl border border-[#D1D5DB] hover:bg-gray-50 transition-colors"><ArrowLeft size={16} className="text-[#6B7280]" /></Link>
          <h1 className="text-[22px] font-bold text-[#1F2530] tracking-[-0.02em]">{rental.address}</h1>
          {saved && <span className="text-[12px] text-[#16A34A] font-medium bg-[#ECFDF3] px-3 py-1 rounded-full border border-[#86EFAC]">✓ Saved</span>}
        </div>
        <button onClick={() => setShowEdit(true)} className="rounded-full bg-[#2342B0] text-white text-sm font-semibold px-5 py-2.5 shadow-sm hover:bg-[#1d3799] transition-colors flex items-center gap-2">
          <Pencil size={13} /> Edit Rental
        </button>
      </div>

      {/* Content */}
      <div className="grid grid-cols-[1fr_300px] gap-5">
        <div className="bg-white rounded-[20px] border border-[#D9DEE9] shadow-[0_2px_12px_rgba(0,0,0,0.04)] p-6">
          <div className="flex items-center gap-1.5 mb-2"><MapPin size={13} className="text-[#6B7280]" /><p className="text-[13px] text-[#6B7280]">{rental.suburb}</p></div>
          <p className="text-[26px] font-bold text-[#2342B0]">{rental.rent || rental.price}</p>
          <div className="flex items-center gap-4 mt-2 text-[13px] text-[#6B7280]">
            <span className="flex items-center gap-1.5"><Bed size={14} /> {rental.beds} Beds</span>
            <span className="flex items-center gap-1.5"><Bath size={14} /> {rental.baths} Baths</span>
            <span className="flex items-center gap-1.5"><Car size={14} /> {rental.cars || 0} Cars</span>
          </div>
          <div className="mt-4 pt-4 border-t border-[#F3F4F6]">
            <p className="text-[12px] text-[#6B7280]">Available: <span className="font-medium text-[#1F2530]">{rental.available}</span></p>
            <p className="text-[12px] text-[#6B7280] mt-1">Status: <span className={`font-medium ${rental.status === "Available" ? "text-[#16A34A]" : rental.status === "Leased" ? "text-[#6B7280]" : "text-[#F59E0B]"}`}>{rental.status}</span></p>
          </div>
        </div>

        <div className="bg-white rounded-[20px] border border-[#D9DEE9] shadow-[0_2px_12px_rgba(0,0,0,0.04)] p-5">
          <div className="flex items-center justify-between mb-3">
            <p className="text-[13px] font-semibold text-[#1F2530]">Documents</p>
            <span className="text-[11px] text-[#6B7280]">{docs.length} file{docs.length !== 1 ? "s" : ""}</span>
          </div>
          {uploadSuccess && <p className="text-[11px] text-[#16A34A] font-medium bg-[#ECFDF3] px-3 py-2 rounded-xl border border-[#86EFAC] mb-2">✓ Uploaded</p>}
          {docs.length === 0
            ? <p className="text-[12px] text-[#9CA3AF] text-center py-3">No documents yet</p>
            : docs.map(doc => (
              <div key={doc.id} className="flex justify-between items-center py-2.5 border-b border-[#F3F4F6] last:border-0">
                <div>
                  <p className="text-[12px] font-medium text-[#1F2530]">{doc.doc_type}</p>
                  <p className="text-[10px] text-[#9CA3AF]">{doc.file_name}</p>
                </div>
                <span className="rounded-full bg-[#ECFDF3] border border-[#86EFAC] text-[#16A34A] text-[10px] font-semibold px-2 py-0.5">Uploaded</span>
              </div>
            ))
          }
          <button onClick={() => setShowUpload(true)} className="mt-3 w-full rounded-full border border-[#D1D5DB] bg-white text-[#404756] text-[12px] font-medium py-2 hover:bg-gray-50 transition-colors flex items-center justify-center gap-1.5">
            <Upload size={12} /> Upload Document
          </button>
        </div>
      </div>
    </div>
  );
}
