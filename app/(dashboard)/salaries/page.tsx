"use client";
import { useEffect, useState, useCallback } from "react";
import Pagination from "@/components/Pagination";

interface Employee { _id: string; name: string; email: string }
interface Salary { _id: string; employee: Employee; amount: number; month: number; year: number; status: string; notes: string }

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const EMPTY = { employee: "", amount: "", month: new Date().getMonth() + 1, year: new Date().getFullYear(), status: "pending", notes: "" };

export default function SalariesPage() {
  const [salaries, setSalaries] = useState<Salary[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filterStatus, setFilterStatus] = useState("");
  const [filterEmployee, setFilterEmployee] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Salary | null>(null);
  const [form, setForm] = useState<any>(EMPTY);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [show, setShow] = useState(false);

  const fetchSalaries = useCallback(async () => {
    const params = new URLSearchParams({ page: String(page), limit: "10", status: filterStatus, employee: filterEmployee });
    const res = await fetch(`/api/salaries?${params}`);
    const data = await res.json();
    setSalaries(data.salaries); setTotal(data.total); setTotalPages(data.totalPages);
  }, [page, filterStatus, filterEmployee]);

  useEffect(() => { fetchSalaries(); }, [fetchSalaries]);
  useEffect(() => { fetch("/api/employees?limit=100").then(r => r.json()).then(d => setEmployees(d.employees)); setTimeout(() => setShow(true), 40); }, []);

  function openAdd() { setEditing(null); setForm(EMPTY); setError(""); setShowModal(true); }
  function openEdit(s: Salary) { setEditing(s); setForm({ employee: s.employee._id, amount: s.amount, month: s.month, year: s.year, status: s.status, notes: s.notes || "" }); setError(""); setShowModal(true); }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault(); setLoading(true); setError("");
    const url = editing ? `/api/salaries/${editing._id}` : "/api/salaries";
    const res = await fetch(url, { method: editing ? "PUT" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...form, amount: Number(form.amount) }) });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) return setError(data.error || "Something went wrong");
    setShowModal(false); fetchSalaries();
  }
  async function handleDelete(id: string) {
    if (!confirm("Delete this salary record?")) return;
    await fetch(`/api/salaries/${id}`, { method: "DELETE" }); fetchSalaries();
  }

  const inp = "glass-input w-full px-3 py-2.5 text-sm";

  return (
    <div style={{ opacity: show ? 1 : 0, transform: show ? "translateY(0)" : "translateY(16px)", transition: "opacity 400ms ease, transform 400ms ease" }}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold gradient-text">Salary Records</h2>
          <p className="text-sm mt-0.5" style={{ color: "rgba(255,255,255,0.7)" }}>{total} total records</p>
        </div>
        <button onClick={openAdd} className="btn-glass flex items-center gap-2 px-4 py-2.5 text-sm">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          Add Record
        </button>
      </div>

      <div className="glass-card p-4 mb-5 flex flex-wrap gap-3">
        <select value={filterEmployee} onChange={e => { setFilterEmployee(e.target.value); setPage(1); }} className={inp}>
          <option value="">All Employees</option>
          {employees.map(e => <option key={e._id} value={e._id}>{e.name}</option>)}
        </select>
        <select value={filterStatus} onChange={e => { setFilterStatus(e.target.value); setPage(1); }} className={inp}>
          <option value="">All Status</option>
          <option value="paid">Paid</option>
          <option value="pending">Pending</option>
        </select>
      </div>

      <div className="glass-card overflow-hidden">
        <table className="glass-table">
          <thead><tr>{["Employee","Period","Amount","Status","Notes","Actions"].map(h => <th key={h}>{h}</th>)}</tr></thead>
          <tbody>
            {salaries.length === 0 ? (
              <tr><td colSpan={6} className="text-center py-16" style={{ color: "rgba(255,255,255,0.55)" }}>No salary records found</td></tr>
            ) : salaries.map((s, i) => (
              <tr key={s._id} style={{ opacity: show ? 1 : 0, transition: `opacity 300ms ease ${i * 40}ms` }}>
                <td><p className="font-semibold text-white">{s.employee?.name}</p><p className="text-xs" style={{ color: "rgba(255,255,255,0.65)" }}>{s.employee?.email}</p></td>
                <td><span className="px-2.5 py-1 rounded-lg text-xs font-medium" style={{ background: "rgba(99,102,241,0.2)", color: "#a78bfa", border: "1px solid rgba(99,102,241,0.3)" }}>{MONTHS[s.month - 1]} {s.year}</span></td>
                <td className="font-bold text-white">${s.amount.toLocaleString()}</td>
                <td>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold"
                    style={s.status === "paid"
                      ? { background: "rgba(20,184,166,0.15)", color: "#2dd4bf", border: "1px solid rgba(20,184,166,0.3)" }
                      : { background: "rgba(245,158,11,0.15)", color: "#fbbf24", border: "1px solid rgba(245,158,11,0.3)" }}>
                    <span className="w-1.5 h-1.5 rounded-full" style={{ background: s.status === "paid" ? "#14B8A6" : "#F59E0B" }} />
                    {s.status.charAt(0).toUpperCase() + s.status.slice(1)}
                  </span>
                </td>
                <td style={{ color: "rgba(255,255,255,0.75)", fontSize: "0.75rem" }}>{s.notes || "—"}</td>
                <td>
                  <div className="flex items-center gap-1">
                    <button onClick={() => openEdit(s)} className="p-1.5 rounded-lg transition-all" style={{ color: "rgba(255,255,255,0.65)" }} onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "#818cf8"; (e.currentTarget as HTMLElement).style.background = "rgba(99,102,241,0.2)"; }} onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.65)"; (e.currentTarget as HTMLElement).style.background = "transparent"; }}>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                    </button>
                    <button onClick={() => handleDelete(s._id)} className="p-1.5 rounded-lg transition-all" style={{ color: "rgba(255,255,255,0.65)" }} onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "#f87171"; (e.currentTarget as HTMLElement).style.background = "rgba(239,68,68,0.2)"; }} onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.65)"; (e.currentTarget as HTMLElement).style.background = "transparent"; }}>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4 animate-overlay-in" style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)" }}>
          <div className="glass-card w-full max-w-md animate-modal-in" style={{ background: "rgba(30,27,75,0.85)" }}>
            <div className="flex items-center justify-between px-6 py-5" style={{ borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
              <h3 className="text-base font-bold text-white">{editing ? "Edit Salary Record" : "Add Salary Record"}</h3>
              <button onClick={() => setShowModal(false)} className="p-1.5 rounded-lg" style={{ color: "rgba(255,255,255,0.4)" }} onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "#fff"; (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.1)"; }} onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.4)"; (e.currentTarget as HTMLElement).style.background = "transparent"; }}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: "rgba(255,255,255,0.8)" }}>Employee</label>
                <select required value={form.employee} onChange={e => setForm({ ...form, employee: e.target.value })} className={inp}>
                  <option value="">Select employee...</option>
                  {employees.map(e => <option key={e._id} value={e._id}>{e.name}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold mb-1.5" style={{ color: "rgba(255,255,255,0.8)" }}>Month</label>
                  <select value={form.month} onChange={e => setForm({ ...form, month: Number(e.target.value) })} className={inp}>
                    {MONTHS.map((m, i) => <option key={i} value={i + 1}>{m}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1.5" style={{ color: "rgba(255,255,255,0.8)" }}>Year</label>
                  <input type="number" required value={form.year} onChange={e => setForm({ ...form, year: Number(e.target.value) })} className={inp} />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1.5" style={{ color: "rgba(255,255,255,0.8)" }}>Amount ($)</label>
                  <input type="number" required min={0} value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} className={inp} placeholder="0" />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1.5" style={{ color: "rgba(255,255,255,0.8)" }}>Status</label>
                  <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} className={inp}>
                    <option value="pending">Pending</option>
                    <option value="paid">Paid</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: "rgba(255,255,255,0.8)" }}>Notes</label>
                <input value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} className={inp} placeholder="Optional notes..." />
              </div>
              {error && <div className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm" style={{ background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.3)", color: "#fca5a5" }}>{error}</div>}
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-2.5 rounded-xl text-sm font-semibold" style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.25)", color: "rgba(255,255,255,0.9)" }}>Cancel</button>
                <button type="submit" disabled={loading} className="btn-glass flex-1 py-2.5 text-sm disabled:opacity-60">{loading ? "Saving..." : editing ? "Save Changes" : "Add Record"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
