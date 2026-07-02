"use client";

import Link from "next/link";
import { ArrowLeft, Pencil, MapPin, Bed, Bath, Car, Upload, Eye, X, CloudUpload } from "lucide-react";
import { use, useState, useEffect } from "react";
import { notFound } from "next/navigation";

export default function ListingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [listing, setListing] = useState<any>(null);
  const [showUpload, setShowUpload] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [editForm, setEditForm] = useState<any>({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [uploadingImg, setUploadingImg] = useState(false);
  const [uploadDocType, setUploadDocType] = useState("Section 32");
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadSaving, setUploadSaving] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [docs, setDocs] = useState<any[]>([]);

  useEffect(() => {
    if (listing) {
      fetch(`/api/documents?search=${encodeURIComponent(listing.address)}`)
        .then(r => r.json()).then(d => setDocs(Array.isArray(d) ? d : []));
    }
  }, [listing]);

  useEffect(() => {
    fetch(`/api/listings/${id}`).then(r => r.json()).then(data => {
      if (data.error) return;
      setListing(data);
      setEditForm(data);
    });
  }, [id]);

  async function handleImageUpload(file: File) {
    setUploadingImg(true);
    const reader = new FileReader();
    reader.onload = async (e) => {
      const base64 = e.target?.result as string;
      // Store as base64 data URL in img field
      const res = await fetch(`/api/listings/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ img: base64 }),
      });
      const updated = await res.json();
      setListing((prev: any) => ({ ...prev, img: updated.img || base64 }));
      setUploadingImg(false);
    };
    reader.readAsDataURL(file);
  }

  async function uploadDoc() {
    if (!listing) return;
    setUploadSaving(true);
    const res = await fetch("/api/documents", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        property_address: listing.address,
        suburb: listing.suburb,
        doc_type: uploadDocType,
        file_name: uploadFile?.name || `${uploadDocType.toLowerCase().replace(/ /g,"_")}.pdf`,
        uploaded_by: "Sam Banks",
      }),
    });
    setUploadSaving(false);
    if (res.ok) {
      setShowUpload(false);
      setUploadFile(null);
      setUploadSuccess(true);
      setTimeout(() => setUploadSuccess(false), 3000);
      // Refresh docs
      fetch(`/api/documents?search=${encodeURIComponent(listing.address)}`)
        .then(r => r.json()).then(d => setDocs(Array.isArray(d) ? d : []));
    }
  }

  async function saveEdit() {
    setSaving(true);
    const res = await fetch(`/api/listings/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ address: editForm.address, suburb: editForm.suburb, price: editForm.price, type: editForm.type, beds: Number(editForm.beds), baths: Number(editForm.baths), cars: Number(editForm.cars || editForm.parking || 0) }),
    });
    const updated = await res.json();
    setListing(updated);
    setSaving(false);
    setShowEdit(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  if (!listing) return <div className="p-8 text-[#6B7280] text-[13px]">Loading…</div>;

  return (
    <div className="space-y-5">
      {showUpload && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[20px] border border-[#D9DEE9] shadow-[0_8px_40px_rgba(0,0,0,0.12)] w-full max-w-md p-7">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-[18px] font-bold text-[#1F2530]">Upload Document</h2>
              <button onClick={() => setShowUpload(false)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100"><X size={16} className="text-[#6B7280]" /></button>
            </div>
            <div className="space-y-4">
              <div><label className="block text-[12px] font-medium text-[#404754] mb-1.5">Property</label>
                <p className="text-[13px] font-medium text-[#1F2530] bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl px-3 py-2.5">{listing?.address}</p>
              </div>
              <div><label className="block text-[12px] font-medium text-[#404754] mb-1.5">Document Type</label>
                <select value={uploadDocType} onChange={e => setUploadDocType(e.target.value)} className="w-full px-3 py-2.5 text-[13px] border border-[#D1D5DB] rounded-xl focus:outline-none focus:border-[#2342B0] bg-white">
                  <option>Section 32</option><option>Contract of Sale</option><option>Floor Plan</option><option>Vendor Disclosure</option><option>Building Report</option><option>Pest Report</option><option>Other</option>
                </select>
              </div>
              <label className="block border-2 border-dashed border-[#D1D5DB] rounded-xl p-6 text-center cursor-pointer hover:border-[#2342B0] transition-colors">
                <CloudUpload size={22} className="mx-auto text-[#9CA3AF] mb-2" />
                {uploadFile ? (
                  <p className="text-[13px] text-[#2342B0] font-medium">{uploadFile.name}</p>
                ) : (
                  <><p className="text-[13px] text-[#6B7280]"><span className="text-[#2342B0] font-medium">Click to upload</span> or drag and drop</p>
                  <p className="text-[11px] text-[#9CA3AF] mt-0.5">PDF, DOC up to 20MB</p></>
                )}
                <input type="file" className="hidden" accept=".pdf,.doc,.docx" onChange={e => setUploadFile(e.target.files?.[0] || null)} />
              </label>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowUpload(false)} className="flex-1 rounded-full border border-[#D1D5DB] bg-white text-[#404756] text-sm font-medium py-2.5 hover:bg-gray-50 transition-colors">Cancel</button>
              <button onClick={uploadDoc} disabled={uploadSaving} className="flex-1 rounded-full bg-[#2342B0] text-white text-sm font-semibold py-2.5 hover:bg-[#1d3799] transition-colors disabled:opacity-50">{uploadSaving ? "Uploading…" : "Upload"}</button>
            </div>
          </div>
        </div>
      )}

      {showEdit && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[20px] border border-[#D9DEE9] shadow-[0_8px_40px_rgba(0,0,0,0.12)] w-full max-w-lg p-7">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-[18px] font-bold text-[#1F2530]">Edit Listing</h2>
              <button onClick={() => setShowEdit(false)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100"><X size={16} className="text-[#6B7280]" /></button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2"><label className="block text-[12px] font-medium text-[#404754] mb-1.5">Address</label><input value={editForm.address} onChange={e => setEditForm((p:any) => ({...p, address: e.target.value}))} className="w-full px-3 py-2.5 text-[13px] border border-[#D1D5DB] rounded-xl focus:outline-none focus:border-[#2342B0]" /></div>
              <div><label className="block text-[12px] font-medium text-[#404754] mb-1.5">Suburb</label><input value={editForm.suburb} onChange={e => setEditForm((p:any) => ({...p, suburb: e.target.value}))} className="w-full px-3 py-2.5 text-[13px] border border-[#D1D5DB] rounded-xl focus:outline-none focus:border-[#2342B0]" /></div>
              <div><label className="block text-[12px] font-medium text-[#404754] mb-1.5">Price</label><input value={editForm.price} onChange={e => setEditForm((p:any) => ({...p, price: e.target.value}))} className="w-full px-3 py-2.5 text-[13px] border border-[#D1D5DB] rounded-xl focus:outline-none focus:border-[#2342B0]" /></div>
              <div><label className="block text-[12px] font-medium text-[#404754] mb-1.5">Type</label><select value={editForm.type} onChange={e => setEditForm((p:any) => ({...p, type: e.target.value}))} className="w-full px-3 py-2.5 text-[13px] border border-[#D1D5DB] rounded-xl focus:outline-none focus:border-[#2342B0] bg-white"><option>Sale</option><option>Rent</option></select></div>
              <div><label className="block text-[12px] font-medium text-[#404754] mb-1.5">Bedrooms</label><input type="number" value={editForm.beds} onChange={e => setEditForm((p:any) => ({...p, beds: e.target.value}))} className="w-full px-3 py-2.5 text-[13px] border border-[#D1D5DB] rounded-xl focus:outline-none focus:border-[#2342B0]" /></div>
              <div><label className="block text-[12px] font-medium text-[#404754] mb-1.5">Bathrooms</label><input type="number" value={editForm.baths} onChange={e => setEditForm((p:any) => ({...p, baths: e.target.value}))} className="w-full px-3 py-2.5 text-[13px] border border-[#D1D5DB] rounded-xl focus:outline-none focus:border-[#2342B0]" /></div>
              <div><label className="block text-[12px] font-medium text-[#404754] mb-1.5">Car Spaces</label><input type="number" value={editForm.cars || editForm.parking || ""} onChange={e => setEditForm((p:any) => ({...p, cars: e.target.value}))} className="w-full px-3 py-2.5 text-[13px] border border-[#D1D5DB] rounded-xl focus:outline-none focus:border-[#2342B0]" /></div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowEdit(false)} className="flex-1 rounded-full border border-[#D1D5DB] bg-white text-[#404756] text-sm font-medium py-2.5 hover:bg-gray-50 transition-colors">Cancel</button>
              <button onClick={saveEdit} disabled={saving} className="flex-1 rounded-full bg-[#2342B0] text-white text-sm font-semibold py-2.5 hover:bg-[#1d3799] transition-colors disabled:opacity-50">{saving ? "Saving…" : "Save Changes"}</button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-[20px] border border-[#D9DEE9] shadow-[0_2px_12px_rgba(0,0,0,0.04)] px-7 py-5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/listings" className="w-9 h-9 flex items-center justify-center rounded-xl border border-[#D1D5DB] hover:bg-gray-50 transition-colors"><ArrowLeft size={16} className="text-[#6B7280]" /></Link>
          <h1 className="text-[26px] font-bold text-[#1F2530] tracking-[-0.03em]">{listing.address}</h1>
          {saved && <span className="text-[12px] text-[#16A34A] font-medium bg-[#ECFDF3] px-3 py-1 rounded-full border border-[#86EFAC]">✓ Saved</span>}
          <span className={`rounded-full text-xs font-semibold px-2.5 py-0.5 border ${listing.type === "Sale" ? "bg-[#ECFDF3] border-[#86EFAC] text-[#16A34A]" : "bg-[#FFF7ED] border-[#FDBA74] text-[#F59E0B]"}`}>{listing.type}</span>
        </div>
        <div className="flex items-center gap-3">
          <button className="rounded-full border border-[#D1D5DB] bg-white text-[#404756] text-sm font-medium px-4 py-2 shadow-sm hover:bg-gray-50 transition-colors flex items-center gap-2"><Eye size={13} /> Preview</button>
          <button onClick={() => setShowEdit(true)} className="rounded-full bg-[#2342B0] text-white text-sm font-semibold px-5 py-2.5 shadow-sm hover:bg-[#1d3799] transition-colors flex items-center gap-2"><Pencil size={13} /> Edit Listing</button>
        </div>
      </div>

      <div className="grid grid-cols-[1fr_320px] gap-5">
        <div className="bg-white rounded-[20px] border border-[#D9DEE9] shadow-[0_2px_12px_rgba(0,0,0,0.04)] overflow-hidden">
          <label className="h-48 flex items-center justify-center cursor-pointer group relative overflow-hidden" style={{ background: listing.img && listing.img.startsWith('data:') ? 'transparent' : '#F9FAFB' }}>
            {listing.img && listing.img.startsWith('data:') ? (
              <img src={listing.img} alt={listing.address} className="w-full h-full object-cover" />
            ) : (
              <div className="flex flex-col items-center gap-2 text-[#9CA3AF]">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>
                <p className="text-[13px]">Click to add photo</p>
              </div>
            )}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              {uploadingImg
                ? <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
                : <p className="text-white text-[13px] font-semibold">{listing.img ? 'Change Photo' : 'Upload Photo'}</p>
              }
            </div>
            <input type="file" accept="image/*" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) handleImageUpload(f); e.target.value = ""; }} />
          </label>
          <div className="p-6">
            <h2 className="text-[20px] font-bold text-[#1F2530]">{listing.address}</h2>
            <div className="flex items-center gap-1.5 mt-1"><MapPin size={13} className="text-[#6B7280]" /><p className="text-[13px] text-[#6B7280]">{listing.suburb}</p></div>
            <p className="text-[22px] font-bold text-[#2342B0] mt-3">{listing.price}</p>
            <div className="flex items-center gap-4 mt-2 text-[13px] text-[#6B7280]">
              <span className="flex items-center gap-1.5"><Bed size={14} /> {listing.beds} Beds</span>
              <span className="flex items-center gap-1.5"><Bath size={14} /> {listing.baths} Baths</span>
              <span className="flex items-center gap-1.5"><Car size={14} /> {listing.parking} Parking</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-[20px] border border-[#D9DEE9] shadow-[0_2px_12px_rgba(0,0,0,0.04)] p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-[15px] font-bold text-[#1F2530]">Documents</h2>
            <span className="text-[11px] text-[#6B7280]">{docs.length} file{docs.length !== 1 ? "s" : ""}</span>
          </div>
          {uploadSuccess && <p className="text-[12px] text-[#16A34A] font-medium bg-[#ECFDF3] px-3 py-2 rounded-xl border border-[#86EFAC]">✓ Document uploaded</p>}
          {docs.length === 0 ? (
            <p className="text-[12px] text-[#9CA3AF] text-center py-4">No documents uploaded yet</p>
          ) : (
            <div className="space-y-1">
              {docs.map(doc => (
                <div key={doc.id} className="flex items-center justify-between py-2.5 border-b border-[#F3F4F6] last:border-0">
                  <div>
                    <p className="text-[12px] font-medium text-[#1F2530]">{doc.doc_type}</p>
                    <p className="text-[10px] text-[#9CA3AF] mt-0.5">{doc.file_name}</p>
                  </div>
                  <span className="rounded-full bg-[#ECFDF3] border border-[#86EFAC] text-[#16A34A] text-[10px] font-semibold px-2 py-0.5">Uploaded</span>
                </div>
              ))}
            </div>
          )}
          <button onClick={() => setShowUpload(true)} className="w-full rounded-full border border-[#D1D5DB] bg-white text-[#404756] text-sm font-medium px-4 py-2.5 shadow-sm hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
            <Upload size={13} /> Upload Document
          </button>
        </div>
      </div>
    </div>
  );
}
