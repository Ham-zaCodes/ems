"use client";
import { useEffect, useState, useCallback } from "react";
import Pagination from "@/components/Pagination";

interface Department { _id: string; name: string }
interface Employee { _id: string; name: string; email: string; phone: string; position: string; department: Department; status: string; joinDate: string }

const EMPTY = { name: "", email: "", phone: "", position: "", department: "", status: "active", joinDate: "" };

function Avatar({ name }: { name: string }) {
  const initials = name.split(" ").map(n => n[0]).slice(0, 2).join("").toUpperCase();
  const gradients = ["from-indigo-500 to-violet-600","from-teal-400 to-cyan-600","from-pink-500 to-rose-500","from-amber-400 to-orange-500","from-blue-500 to-indigo-600"];
  return <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${gradients[name.charCodeAt(0) % gradients.length]} flex items-center justify-center text-xs font-bold text-white flex-shrink-0`}>{initials}</div>;
}

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [filterDept, setFilterDept] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Employee | null>(null);
  const [form, setForm] = useState(EMPTY);
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);

  const fetchEmployees = useCallback(async () => {
    const params = new URLSearchParams({ page: String(page), limit: "8", search, department: filterDept, status: filterStatus });
    const res = await fetch(`/api/employees?${params}`);
    const data = await res.json();
    setEmployees(data.employees); setTotal(data.total); setTotalPages(data.totalPages);
  }, [page, search, filterDept, filterStatus]);

  useEffect(() => { fetchEmployees(); }, [fetchEmployees]);
  useEffect(() => { fetch("/api/departments").then(r => r.json()).then(setDepartments); setTimeout(() => setShow(true), 40); }, []);

  function openAdd() { setEditing(null); setForm(EMPTY); setShowModal(true); }
  function openEdit(emp: Employee) {
    setEditing(emp);
    setForm({ name: emp.name, email: emp.email, phone: emp.phone, position: emp.position, department: emp.department._id, status: emp.status, joinDate: emp.joinDate.slice(0, 10) });
    setShowModal(true);
  }
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault(); setLoading(true);
    const url = editing ? `/api/employees/${editing._id}` : "/api/employees";
    await fetch(url, { method: editing ? "PUT" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    setLoading(false); setShowModal(false); fetchEmployees();
  }
  async function handleDelete(id: string) {
    if (!confirm("Delete this employee?")) return;
    await fetch(`/api/employees/${id}`, { method: "DELETE" }); fetchEmployees();
  }

  const inp = "glass-input w-full px-3 py-2.5 text-sm";

  return (
    <div style={{ opacity: show ? 1 : 0, transform: show ? "translateY(0)" : "translateY(16px)", transition: "opacity 400ms ease, transform 400ms ease" }}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold gradient-text">Employees</h2>
          <p className="text-sm mt-0.5" style={{ color: "rgba(255,255,255,0.7)" }}>{total} total employees</p>
        </div>
        <button onClick={openAdd} className="btn-glass flex items-center gap-2 px-4 py-2.5 text-sm">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          Add Employee
        </button>
      </div>

      {/* Filters */}
      <div className="glass-card p-4 mb-5 flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-48">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "rgba(255,255,255,0.6)" }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          <input type="text" placeholder="Search name, email, position..." value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} className={`${inp} pl-9`} />
        </div>
        <select value={filterDept} onChange={e => { setFilterDept(e.target.value); setPage(1); }} className={inp}>
          <option value="">All Departments</option>
          {departments.map(d => <option key={d._id} value={d._id}>{d.name}</option>)}
        </select>
        <select value={filterStatus} onChange={e => { setFilterStatus(e.target.value); setPage(1); }} className={inp}>
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      {/* Table */}
      <div className="glass-card overflow-hidden">
        <table className="glass-table">
          <thead><tr>{["Employee","Position","Department","Status","Join Date","Actions"].map(h => <th key={h}>{h}</th>)}</tr></thead>
          <tbody>
            {employees.length === 0 ? (
              <tr><td colSpan={6} className="text-center py-16" style={{ color: "rgba(255,255,255,0.55)" }}>
                <svg className="w-10 h-10 mx-auto mb-3" style={{ color: "rgba(255,255,255,0.15)" }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                No employees found
              </td></tr>
            ) : employees.map((emp, i) => (
              <tr key={emp._id} style={{ opacity: show ? 1 : 0, transform: show ? "translateX(0)" : "translateX(-8px)", transition: `opacity 300ms ease ${i * 40}ms, transform 300ms ease ${i * 40}ms` }}>
                <td><div className="flex items-center gap-3"><Avatar name={emp.name} /><div><p className="font-semibold text-white">{emp.name}</p><p className="text-xs" style={{ color: "rgba(255,255,255,0.65)" }}>{emp.email}</p></div></div></td>
                <td>{emp.position}</td>
                <td><span className="px-2.5 py-1 rounded-lg text-xs font-medium" style={{ background: "rgba(99,102,241,0.2)", color: "#a78bfa", border: "1px solid rgba(99,102,241,0.3)" }}>{emp.department?.name}</span></td>
                <td>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold"
                    style={emp.status === "active"
                      ? { background: "rgba(20,184,166,0.15)", color: "#2dd4bf", border: "1px solid rgba(20,184,166,0.3)" }
                      : { background: "rgba(239,68,68,0.15)", color: "#f87171", border: "1px solid rgba(239,68,68,0.3)" }}>
                    <span className="w-1.5 h-1.5 rounded-full" style={{ background: emp.status === "active" ? "#14B8A6" : "#ef4444", animation: emp.status === "active" ? "ping 1.4s infinite" : undefined }} />
                    {emp.status.charAt(0).toUpperCase() + emp.status.slice(1)}
                  </span>
                </td>
                <td style={{ color: "rgba(255,255,255,0.75)", fontSize: "0.75rem" }}>{new Date(emp.joinDate).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}</td>
                <td>
                  <div className="flex items-center gap-1">
                    <button onClick={() => openEdit(emp)} className="p-1.5 rounded-lg transition-all hover:scale-110" style={{ color: "rgba(255,255,255,0.65)" }} onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "#818cf8"; (e.currentTarget as HTMLElement).style.background = "rgba(99,102,241,0.2)"; }} onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.65)"; (e.currentTarget as HTMLElement).style.background = "transparent"; }}>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                    </button>
                    <button onClick={() => handleDelete(emp._id)} className="p-1.5 rounded-lg transition-all hover:scale-110" style={{ color: "rgba(255,255,255,0.65)" }} onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "#f87171"; (e.currentTarget as HTMLElement).style.background = "rgba(239,68,68,0.2)"; }} onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.65)"; (e.currentTarget as HTMLElement).style.background = "transparent"; }}>
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

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4 animate-overlay-in" style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)" }}>
          <div className="glass-card w-full max-w-lg animate-modal-in" style={{ background: "rgba(30,27,75,0.85)" }}>
            <div className="flex items-center justify-between px-6 py-5" style={{ borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
              <h3 className="text-base font-bold text-white">{editing ? "Edit Employee" : "Add New Employee"}</h3>
              <button onClick={() => setShowModal(false)} className="p-1.5 rounded-lg transition-all" style={{ color: "rgba(255,255,255,0.4)" }} onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "#fff"; (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.1)"; }} onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.4)"; (e.currentTarget as HTMLElement).style.background = "transparent"; }}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {[["Full Name","name","text","John Doe"],["Email","email","email","john@co.com"],["Phone","phone","text","+1 234 567"],["Position","position","text","Engineer"]].map(([label,key,type,ph]) => (
                  <div key={key}>
                    <label className="block text-xs font-semibold mb-1.5" style={{ color: "rgba(255,255,255,0.8)" }}>{label}</label>
                    <input required={key !== "phone"} type={type} value={(form as any)[key]} onChange={e => setForm({ ...form, [key]: e.target.value })} className={inp} placeholder={ph} />
                  </div>
                ))}
                <div>
                  <label className="block text-xs font-semibold mb-1.5" style={{ color: "rgba(255,255,255,0.8)" }}>Department</label>
                  <select required value={form.department} onChange={e => setForm({ ...form, department: e.target.value })} className={inp}>
                    <option value="">Select...</option>
                    {departments.map(d => <option key={d._id} value={d._id}>{d.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1.5" style={{ color: "rgba(255,255,255,0.8)" }}>Status</label>
                  <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} className={inp}>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-semibold mb-1.5" style={{ color: "rgba(255,255,255,0.8)" }}>Join Date</label>
                  <input required type="date" value={form.joinDate} onChange={e => setForm({ ...form, joinDate: e.target.value })} className={inp} />
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all" style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.25)", color: "rgba(255,255,255,0.9)" }}>Cancel</button>
                <button type="submit" disabled={loading} className="btn-glass flex-1 py-2.5 text-sm disabled:opacity-60">
                  {loading ? <span className="flex items-center justify-center gap-2"><svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>Saving...</span> : editing ? "Save Changes" : "Add Employee"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
