"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

interface Department { _id: string; name: string; description: string; createdAt: string }

const GRADIENTS = ["from-indigo-500 to-violet-600","from-teal-400 to-cyan-600","from-pink-500 to-rose-500","from-amber-400 to-orange-500","from-blue-500 to-indigo-600","from-emerald-400 to-teal-600"];
const GLOWS = ["glow-indigo","glow-teal","glow-pink","glow-amber","glow-indigo","glow-teal"];

export default function DepartmentsPage() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Department | null>(null);
  const [form, setForm] = useState({ name: "", description: "" });
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);

  async function fetchDepts() { const res = await fetch("/api/departments"); setDepartments(await res.json()); }
  useEffect(() => { fetchDepts(); setTimeout(() => setShow(true), 40); }, []);

  function openAdd() { setEditing(null); setForm({ name: "", description: "" }); setShowModal(true); }
  function openEdit(d: Department) { setEditing(d); setForm({ name: d.name, description: d.description }); setShowModal(true); }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault(); setLoading(true);
    const url = editing ? `/api/departments/${editing._id}` : "/api/departments";
    await fetch(url, { method: editing ? "PUT" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    setLoading(false); setShowModal(false); fetchDepts();
  }
  async function handleDelete(id: string) {
    if (!confirm("Delete this department?")) return;
    await fetch(`/api/departments/${id}`, { method: "DELETE" }); fetchDepts();
  }

  const inp = "glass-input w-full px-3 py-2.5 text-sm";

  return (
    <div style={{ opacity: show ? 1 : 0, transform: show ? "translateY(0)" : "translateY(16px)", transition: "opacity 400ms ease, transform 400ms ease" }}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold gradient-text">Departments</h2>
          <p className="text-sm mt-0.5" style={{ color: "rgba(255,255,255,0.7)" }}>{departments.length} departments</p>
        </div>
        <button onClick={openAdd} className="btn-glass flex items-center gap-2 px-4 py-2.5 text-sm">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          Add Department
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {departments.map((dept, i) => (
          <div key={dept._id} className={`glass-card ${GLOWS[i % GLOWS.length]} group`}
            style={{ opacity: show ? 1 : 0, transform: show ? "translateY(0) scale(1)" : "translateY(20px) scale(0.96)", transition: `opacity 420ms cubic-bezier(0.34,1.56,0.64,1) ${i * 80}ms, transform 420ms cubic-bezier(0.34,1.56,0.64,1) ${i * 80}ms` }}>
            {/* Top gradient bar */}
            <div className={`h-1 bg-gradient-to-r ${GRADIENTS[i % GRADIENTS.length]} transition-all duration-300 group-hover:h-1.5`} />
            <div className="p-5">
              <div className="flex items-start justify-between mb-4">
                <Link href={`/departments/${dept._id}`} className="flex items-center gap-3 flex-1 min-w-0">
                  <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${GRADIENTS[i % GRADIENTS.length]} flex items-center justify-center flex-shrink-0 shadow-lg transition-transform duration-300 group-hover:scale-110`}>
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-bold text-white group-hover:text-violet-300 transition-colors truncate">{dept.name}</h3>
                    <p className="text-xs mt-0.5 truncate" style={{ color: "rgba(255,255,255,0.65)" }}>{dept.description || "No description"}</p>
                  </div>
                </Link>
                <div className="flex gap-1 ml-2 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <button onClick={e => { e.preventDefault(); openEdit(dept); }} className="p-1.5 rounded-lg transition-all" style={{ color: "rgba(255,255,255,0.4)" }} onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "#818cf8"; (e.currentTarget as HTMLElement).style.background = "rgba(99,102,241,0.2)"; }} onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.4)"; (e.currentTarget as HTMLElement).style.background = "transparent"; }}>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                  </button>
                  <button onClick={e => { e.preventDefault(); handleDelete(dept._id); }} className="p-1.5 rounded-lg transition-all" style={{ color: "rgba(255,255,255,0.4)" }} onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "#f87171"; (e.currentTarget as HTMLElement).style.background = "rgba(239,68,68,0.2)"; }} onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.4)"; (e.currentTarget as HTMLElement).style.background = "transparent"; }}>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-between pt-3" style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}>
                <p className="text-xs" style={{ color: "rgba(255,255,255,0.6)" }}>Created {new Date(dept.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</p>
                <Link href={`/departments/${dept._id}`} className="flex items-center gap-1 text-xs font-semibold transition-colors" style={{ color: "#a78bfa" }} onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "#c4b5fd"; }} onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "#a78bfa"; }}>
                  View team <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                </Link>
              </div>
            </div>
          </div>
        ))}
        {departments.length === 0 && <div className="col-span-3 text-center py-16" style={{ color: "rgba(255,255,255,0.55)" }}>No departments yet</div>}
      </div>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4 animate-overlay-in" style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)" }}>
          <div className="glass-card w-full max-w-md animate-modal-in" style={{ background: "rgba(30,27,75,0.85)" }}>
            <div className="flex items-center justify-between px-6 py-5" style={{ borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
              <h3 className="text-base font-bold text-white">{editing ? "Edit Department" : "Add Department"}</h3>
              <button onClick={() => setShowModal(false)} className="p-1.5 rounded-lg transition-all" style={{ color: "rgba(255,255,255,0.4)" }} onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "#fff"; (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.1)"; }} onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.4)"; (e.currentTarget as HTMLElement).style.background = "transparent"; }}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: "rgba(255,255,255,0.8)" }}>Department Name</label>
                <input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className={inp} placeholder="e.g. Engineering" />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: "rgba(255,255,255,0.8)" }}>Description</label>
                <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={3} className={inp} placeholder="Brief description..." />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-2.5 rounded-xl text-sm font-semibold" style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.25)", color: "rgba(255,255,255,0.9)" }}>Cancel</button>
                <button type="submit" disabled={loading} className="btn-glass flex-1 py-2.5 text-sm disabled:opacity-60">{loading ? "Saving..." : editing ? "Save Changes" : "Create"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
