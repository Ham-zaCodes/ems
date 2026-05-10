"use client";
import { useEffect, useState } from "react";

interface User { _id: string; name: string; email: string; role: string; createdAt: string }
const EMPTY = { name: "", email: "", password: "", role: "manager" };

function Avatar({ name }: { name: string }) {
  const initials = name.split(" ").map(n => n[0]).slice(0, 2).join("").toUpperCase();
  return <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">{initials}</div>;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<User | null>(null);
  const [form, setForm] = useState(EMPTY);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [show, setShow] = useState(false);

  async function fetchUsers() { const res = await fetch("/api/users"); setUsers(await res.json()); }
  useEffect(() => { fetchUsers(); setTimeout(() => setShow(true), 40); }, []);

  function openAdd() { setEditing(null); setForm(EMPTY); setError(""); setShowModal(true); }
  function openEdit(u: User) { setEditing(u); setForm({ name: u.name, email: u.email, password: "", role: u.role }); setError(""); setShowModal(true); }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault(); setLoading(true); setError("");
    const body: any = { ...form };
    if (editing && !body.password) delete body.password;
    const url = editing ? `/api/users/${editing._id}` : "/api/users";
    const res = await fetch(url, { method: editing ? "PUT" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) return setError(data.error);
    setShowModal(false); fetchUsers();
  }
  async function handleDelete(id: string) {
    if (!confirm("Delete this user?")) return;
    const res = await fetch(`/api/users/${id}`, { method: "DELETE" });
    const data = await res.json();
    if (!res.ok) return alert(data.error);
    fetchUsers();
  }

  const inp = "glass-input w-full px-3 py-2.5 text-sm";

  return (
    <div style={{ opacity: show ? 1 : 0, transform: show ? "translateY(0)" : "translateY(16px)", transition: "opacity 400ms ease, transform 400ms ease" }}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold gradient-text">User Accounts</h2>
          <p className="text-sm mt-0.5" style={{ color: "rgba(255,255,255,0.7)" }}>{users.length} accounts</p>
        </div>
        <button onClick={openAdd} className="btn-glass flex items-center gap-2 px-4 py-2.5 text-sm">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          Add User
        </button>
      </div>

      <div className="glass-card overflow-hidden">
        <table className="glass-table">
          <thead><tr>{["User","Role","Created","Actions"].map(h => <th key={h}>{h}</th>)}</tr></thead>
          <tbody>
            {users.length === 0 ? (
              <tr><td colSpan={4} className="text-center py-16" style={{ color: "rgba(255,255,255,0.55)" }}>No users found</td></tr>
            ) : users.map((u, i) => (
              <tr key={u._id} style={{ opacity: show ? 1 : 0, transition: `opacity 300ms ease ${i * 50}ms` }}>
                <td><div className="flex items-center gap-3"><Avatar name={u.name} /><div><p className="font-semibold text-white">{u.name}</p><p className="text-xs" style={{ color: "rgba(255,255,255,0.65)" }}>{u.email}</p></div></div></td>
                <td>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold"
                    style={u.role === "admin"
                      ? { background: "rgba(99,102,241,0.2)", color: "#a78bfa", border: "1px solid rgba(99,102,241,0.35)" }
                      : { background: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.85)", border: "1px solid rgba(255,255,255,0.2)" }}>
                    <span className="w-1.5 h-1.5 rounded-full" style={{ background: u.role === "admin" ? "#8B5CF6" : "rgba(255,255,255,0.4)" }} />
                    {u.role.charAt(0).toUpperCase() + u.role.slice(1)}
                  </span>
                </td>
                <td style={{ color: "rgba(255,255,255,0.75)", fontSize: "0.75rem" }}>{new Date(u.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}</td>
                <td>
                  <div className="flex items-center gap-1">
                    <button onClick={() => openEdit(u)} className="p-1.5 rounded-lg transition-all" style={{ color: "rgba(255,255,255,0.65)" }} onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "#818cf8"; (e.currentTarget as HTMLElement).style.background = "rgba(99,102,241,0.2)"; }} onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.65)"; (e.currentTarget as HTMLElement).style.background = "transparent"; }}>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                    </button>
                    <button onClick={() => handleDelete(u._id)} className="p-1.5 rounded-lg transition-all" style={{ color: "rgba(255,255,255,0.65)" }} onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "#f87171"; (e.currentTarget as HTMLElement).style.background = "rgba(239,68,68,0.2)"; }} onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.65)"; (e.currentTarget as HTMLElement).style.background = "transparent"; }}>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4 animate-overlay-in" style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)" }}>
          <div className="glass-card w-full max-w-md animate-modal-in" style={{ background: "rgba(30,27,75,0.85)" }}>
            <div className="flex items-center justify-between px-6 py-5" style={{ borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
              <h3 className="text-base font-bold text-white">{editing ? "Edit User" : "Add User"}</h3>
              <button onClick={() => setShowModal(false)} className="p-1.5 rounded-lg" style={{ color: "rgba(255,255,255,0.4)" }} onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "#fff"; (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.1)"; }} onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.4)"; (e.currentTarget as HTMLElement).style.background = "transparent"; }}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {[["Full Name","name","text","John Doe"],["Email","email","email","john@co.com"],["Password","password","password","••••••••"]].map(([label,key,type,ph]) => (
                <div key={key}>
                  <label className="block text-xs font-semibold mb-1.5" style={{ color: "rgba(255,255,255,0.8)" }}>
                    {label} {key === "password" && editing && <span style={{ color: "rgba(255,255,255,0.55)", fontWeight: 400 }}>(leave blank to keep)</span>}
                  </label>
                  <input type={type} required={!(key === "password" && editing)} value={(form as any)[key]} onChange={e => setForm({ ...form, [key]: e.target.value })} className={inp} placeholder={ph} />
                </div>
              ))}
              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: "rgba(255,255,255,0.8)" }}>Role</label>
                <select value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} className={inp}>
                  <option value="admin">Admin</option>
                  <option value="manager">Manager</option>
                </select>
              </div>
              {error && <div className="px-4 py-3 rounded-xl text-sm" style={{ background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.3)", color: "#fca5a5" }}>{error}</div>}
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-2.5 rounded-xl text-sm font-semibold" style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.25)", color: "rgba(255,255,255,0.9)" }}>Cancel</button>
                <button type="submit" disabled={loading} className="btn-glass flex-1 py-2.5 text-sm disabled:opacity-60">{loading ? "Saving..." : editing ? "Save Changes" : "Create User"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
