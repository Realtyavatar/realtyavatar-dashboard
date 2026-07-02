"use client";

import { Search, Upload, X, CloudUpload, FileText, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";

interface Doc {
  id: string;
  property_address: string;
  suburb: string;
  doc_type: string;
  file_name: string;
  file_url?: string;
  status: string;
  uploaded_by: string;
  created_at: string;
}

const DOC_TYPES = ["Section 32", "Contract of Sale", "Floor Plan", "Vendor Disclosure", "Building Report", "Pest Report", "Title Search", "Other"];

function DocBadge({ status }: { status: string }) {
  if (status === "Uploaded") return <span className="rounded-full bg-[#ECFDF3] border border-[#86EFAC] text-[#16A34A] text-xs font-semibold px-2.5 py-0.5">Uploaded</span>;
  return <span className="rounded-full bg-[#FEF2F2] border border-[#FCA5A5] text-[#EF4444] text-xs font-semibold px-2.5 py-0.5">Missing</span>;
}

export default function DocumentsPage() {
  const [docs, setDocs] = useState<Doc[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [form, setForm] = useState({ property_address: "", suburb: "", doc_type: "Section 32" });
  const [successMsg, setSuccessMsg] = useState("");

  async function fetchDocs() {
    const res = await fetch(`/api/documents${search ? `?search=${search}` : ""}`);
    const data = await res.json();
    setDocs(Array.isArray(data) ? data : []);
    setLoading(false);
  }

  useEffect(() => { fetchDocs(); }, [search]);

  async function uploadDoc() {
    if (!form.property_address || !form.doc_type) return;
    setSaving(true);
    const res = await fetch("/api/documents", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        property_address: form.property_address,
        suburb: form.suburb,
        doc_type: form.doc_type,
        file_name: selectedFile?.name || `${form.doc_type.toLowerCase().replace(/ /g, "_")}.pdf`,
        uploaded_by: "Sam Banks",
      }),
    });
    setSaving(false);
    if (res.ok) {
      setShowModal(false);
      setForm({ property_address: "", suburb: "", doc_type: "Section 32" });
      setSelectedFile(null);
      setSuccessMsg("Document uploaded successfully");
      setTimeout(() => setSuccessMsg(""), 3000);
      fetchDocs();
    }
  }

  async function deleteDoc(id: string) {
    if (!confirm("Delete this document?")) return;
    await fetch(`/api/documents/${id}`, { method: "DELETE" });
    fetchDocs();
  }

  return (
    <div className="space-y-5">
      {/* Upload Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[20px] border border-[#D9DEE9] shadow-[0_8px_40px_rgba(0,0,0,0.12)] w-full max-w-md p-7">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-[18px] font-bold text-[#1F2530]">Upload Document</h2>
              <button onClick={() => setShowModal(false)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100"><X size={16} className="text-[#6B7280]" /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-[12px] font-medium text-[#404754] mb-1.5">Property Address *</label>
                <input value={form.property_address} onChange={e => setForm(p => ({...p, property_address: e.target.value}))}
                  placeholder="e.g. 32 Ocean Parade" className="w-full px-3 py-2.5 text-[13px] border border-[#D1D5DB] rounded-xl focus:outline-none focus:border-[#2342B0]" />
              </div>
              <div>
                <label className="block text-[12px] font-medium text-[#404754] mb-1.5">Suburb</label>
                <input value={form.suburb} onChange={e => setForm(p => ({...p, suburb: e.target.value}))}
                  placeholder="e.g. Brighton VIC 3186" className="w-full px-3 py-2.5 text-[13px] border border-[#D1D5DB] rounded-xl focus:outline-none focus:border-[#2342B0]" />
              </div>
              <div>
                <label className="block text-[12px] font-medium text-[#404754] mb-1.5">Document Type *</label>
                <select value={form.doc_type} onChange={e => setForm(p => ({...p, doc_type: e.target.value}))}
                  className="w-full px-3 py-2.5 text-[13px] border border-[#D1D5DB] rounded-xl focus:outline-none focus:border-[#2342B0] bg-white">
                  {DOC_TYPES.map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[12px] font-medium text-[#404754] mb-1.5">File</label>
                <label className="block border-2 border-dashed border-[#D1D5DB] rounded-xl p-6 text-center cursor-pointer hover:border-[#2342B0] transition-colors">
                  <CloudUpload size={24} className="mx-auto text-[#9CA3AF] mb-2" />
                  {selectedFile ? (
                    <p className="text-[13px] text-[#2342B0] font-medium">{selectedFile.name}</p>
                  ) : (
                    <>
                      <p className="text-[13px] text-[#6B7280]"><span className="text-[#2342B0] font-medium">Click to upload</span> or drag and drop</p>
                      <p className="text-[11px] text-[#9CA3AF] mt-0.5">PDF, DOC, DOCX up to 20MB</p>
                    </>
                  )}
                  <input type="file" className="hidden" accept=".pdf,.doc,.docx" onChange={e => setSelectedFile(e.target.files?.[0] || null)} />
                </label>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowModal(false)} className="flex-1 rounded-full border border-[#D1D5DB] bg-white text-[#404756] text-sm font-medium py-2.5 hover:bg-gray-50 transition-colors">Cancel</button>
              <button onClick={uploadDoc} disabled={saving || !form.property_address}
                className="flex-1 rounded-full bg-[#2342B0] text-white text-sm font-semibold py-2.5 hover:bg-[#1d3799] transition-colors disabled:opacity-50">
                {saving ? "Uploading…" : "Upload Document"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-white rounded-[20px] border border-[#D9DEE9] shadow-[0_2px_12px_rgba(0,0,0,0.04)] px-7 py-5 flex items-start justify-between">
        <div>
          <h1 className="text-[26px] font-bold text-[#1F2530] tracking-[-0.03em]">Documents</h1>
          <p className="text-[14px] text-[#6B7280] mt-0.5">Upload and manage property documents — Section 32s, contracts, floor plans and more.</p>
        </div>
        <button onClick={() => setShowModal(true)}
          className="rounded-full bg-[#2342B0] text-white text-sm font-semibold px-5 py-2.5 shadow-sm hover:bg-[#1d3799] transition-colors flex items-center gap-2 text-[13px]">
          <Upload size={13} /> Upload Document
        </button>
      </div>

      {successMsg && (
        <div className="bg-[#ECFDF3] border border-[#86EFAC] rounded-xl px-5 py-3 text-[#16A34A] text-sm font-medium">✓ {successMsg}</div>
      )}

      {/* Search + Table */}
      <div className="bg-white rounded-[20px] border border-[#D9DEE9] shadow-[0_2px_12px_rgba(0,0,0,0.04)] overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E5E7EB]">
          <p className="text-[14px] font-semibold text-[#1F2530]">{docs.length} document{docs.length !== 1 ? "s" : ""}</p>
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
            <input value={search} onChange={e => setSearch(e.target.value)} type="text" placeholder="Search by property..."
              className="pl-9 pr-4 py-2 text-[13px] bg-white border border-[#D1D5DB] rounded-full w-56 focus:outline-none focus:border-[#2342B0]" />
          </div>
        </div>

        {loading ? (
          <div className="p-10 text-center text-[#9CA3AF] text-[14px]">Loading…</div>
        ) : docs.length === 0 ? (
          <div className="p-10 text-center">
            <FileText size={32} className="mx-auto text-[#D1D5DB] mb-3" />
            <p className="text-[14px] font-medium text-[#6B7280]">No documents yet</p>
            <p className="text-[12px] text-[#9CA3AF] mt-1">Upload your first document above</p>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-[#F9FAFB]">
              <tr>
                {["Property", "Suburb", "Document Type", "File", "Uploaded", "Status", ""].map(h => (
                  <th key={h} className="px-5 py-3 text-left text-[11px] font-semibold text-[#6B7280] uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F3F4F6]">
              {docs.map(doc => (
                <tr key={doc.id} className="hover:bg-[#F9FAFB] transition-colors">
                  <td className="px-5 py-4 text-[13px] font-medium text-[#1F2530]">{doc.property_address}</td>
                  <td className="px-5 py-4 text-[13px] text-[#6B7280]">{doc.suburb}</td>
                  <td className="px-5 py-4 text-[13px] text-[#1F2530]">{doc.doc_type}</td>
                  <td className="px-5 py-4 text-[13px] text-[#2342B0] font-mono">{doc.file_name}</td>
                  <td className="px-5 py-4 text-[12px] text-[#9CA3AF]">{new Date(doc.created_at).toLocaleDateString("en-AU")}</td>
                  <td className="px-5 py-4"><DocBadge status={doc.status} /></td>
                  <td className="px-5 py-4">
                    <button onClick={() => deleteDoc(doc.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-[#9CA3AF] hover:text-[#EF4444] transition-colors">
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
