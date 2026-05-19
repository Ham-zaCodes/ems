"use client";
import { useEffect, useState } from "react";

interface Department { _id: string; name: string; }
interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  department?: { _id: string; name: string } | null;
  position?: string | null;
  createdAt: string;
}

const EMPTY = { name: "", email: "", password: "", role: "employee", department: "", position: "" };

const POSITIONS = [
  "Software Engineer", "Senior Software Engineer", "Frontend Developer",
  "Backend Developer", "Full Stack Developer", "DevOps Engineer",
  "UI/UX Designer", "Graphic Designer", "Product Manager",
  "Project Manager", "HR Manager", "HR Coordinator",
  "Marketing Manager", "Social Media Coordinator", "Content Writer",
  "Sales Manager", "Sales Executive", "Accountant",
  "Finance Manager", "Data Analyst", "Engineering Clerk",
  "Office Manager", "Receptionist", "Intern",
];

const ROLE_STYLE: Record<string, { bg: string; color: string; dot: string; label: string }> = {
  admin:    { bg: "rgba(99,102,241,0.2)",  color: "#a78bfa", dot: "#8B5CF6", label: "Admin"    },
  manager:  { bg: "rgba(20,184,166,0.2)",  color: "#5eead4", dot: "#14b8a6", label: "Manager"  },
  employee: { bg: "rgba(251,191,36,0.15)", color: "#fcd34d", dot: "#f59e0b", label: "Employee" },
};

function Avatar({ name }: { name: string }) {
  const initials = name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();
  return (
    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
      {initials}
    </div>
  );
}

function CredentialsCard({ name, email, password, role, position, department, onClose }: {
  name: string; email: string; password: string; role: string;
  position: string; department: string; onClose: () => void;
}) {
  const [copied, setCopied] = useState(false);

  const credText = [
    `Name: ${name}`,
    `Email: ${email}`,
    `Password: ${password}`,
    `Role: ${role}`,
    position && `Position: ${position}`,
    department && `Department: ${department}`,
  ].filter(Boolean).join("\n");

  const handleCopy = () => {
    navigator.clipboard.writeText(credText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const fields = [
    { label: "Full Name",   value: name },
    { label: "Email",       value: email },
    { label: "Password",    value: password },
    { label: "Role",        value: role.charAt(0).toUpperCase() + role.slice(1) },
    ...(position   ? [{ label: "Position",   value: position }]   : []),
    ...(department ? [{ label: "Department", value: department }] : []),
  ];

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 9999,
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "16px", background: "rgba(0,0,0,0.75)", backdropFilter: "blur(8px)",
    }}>
      <div style={{
        width: "100%", maxWidth: "440px", borderRadius: "20px", padding: "24px",
        background: "rgba(30,27,75,0.97)", border: "1px solid rgba(255,255,255,0.15)",
        display: "flex", flexDirection: "column", gap: "16px",
        boxShadow: "0 25px 60px rgba(0,0,0,0.5)",
      }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{
            width: "40px", height: "40px", borderRadius: "50%",
            background: "rgba(99,102,241,0.2)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <svg width="20" height="20" fill="none" stroke="#818cf8" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
            </svg>
          </div>
          <div>
            <h3 style={{ color: "#fff", fontWeight: 700, fontSize: "1rem", margin: 0 }}>Account Created!</h3>
            <p style={{ color: "rgba(255,255,255,0.55)", fontSize: "0.75rem", margin: 0 }}>
              Share these credentials with the user
            </p>
          </div>
        </div>

        {/* Credentials Box */}
        <div style={{
          borderRadius: "12px", padding: "16px",
          background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.1)",
          display: "flex", flexDirection: "column", gap: "10px",
        }}>
          {fields.map(({ label, value }) => (
            <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "16px" }}>
              <span style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.75rem", fontWeight: 600, flexShrink: 0 }}>
                {label}
              </span>
              <span style={{
                color: label === "Password" ? "#fcd34d" : "rgba(255,255,255,0.9)",
                fontSize: "0.875rem", fontWeight: 700, fontFamily: "monospace",
                textAlign: "right", overflow: "hidden", textOverflow: "ellipsis",
              }}>
                {value}
              </span>
            </div>
          ))}
        </div>

        {/* Warning */}
        <div style={{
          borderRadius: "12px", padding: "12px 16px",
          background: "rgba(251,191,36,0.1)", border: "1px solid rgba(251,191,36,0.25)",
          color: "#fcd34d", fontSize: "0.75rem",
          display: "flex", alignItems: "flex-start", gap: "8px",
        }}>
          <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ flexShrink: 0, marginTop: "1px" }}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <span>This password will not be shown again. Copy and share it with the user now.</span>
        </div>

        {/* Actions */}
        <div style={{ display: "flex", gap: "12px" }}>
          <button
            onClick={handleCopy}
            style={{
              flex: 1, padding: "10px", borderRadius: "12px",
              background: copied ? "rgba(16,185,129,0.2)" : "rgba(99,102,241,0.2)",
              border: copied ? "1px solid rgba(16,185,129,0.4)" : "1px solid rgba(99,102,241,0.4)",
              color: copied ? "#6ee7b7" : "#a78bfa",
              fontWeight: 600, fontSize: "0.875rem", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center", gap: "6px",
            }}
          >
            {copied ? "✓ Copied!" : "Copy Credentials"}
          </button>
          <button
            onClick={onClose}
            style={{
              flex: 1, padding: "10px", borderRadius: "12px",
              background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.2)",
              color: "rgba(255,255,255,0.85)", fontWeight: 600, fontSize: "0.875rem", cursor: "pointer",
            }}
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}

export default function UsersPage() {
  const [users, setUsers]             = useState<User[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [showModal, setShowModal]     = useState(false);
  const [editing, setEditing]         = useState<User | null>(null);
  const [form, setForm]               = useState(EMPTY);
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState("");
  const [show, setShow]               = useState(false);
  const [createdCreds, setCreatedCreds] = useState<{
    name: string; email: string; password: string;
    role: string; position: string; department: string;
  } | null>(null);

  async function fetchUsers() {
    const res = await fetch("/api/users");
    const data = await res.json();
    if (Array.isArray(data)) setUsers(data);
  }

  async function fetchDepartments() {
    const res = await fetch("/api/departments");
    const data = await res.json();
    if (Array.isArray(data)) setDepartments(data);
  }

  useEffect(() => {
    fetchUsers();
    fetchDepartments();
    setTimeout(() => setShow(true), 40);
  }, []);

  function openAdd() {
    setEditing(null);
    setForm(EMPTY);
    setError("");
    setShowModal(true);
  }

  function openEdit(u: User) {
    setEditing(u);
    setForm({
      name: u.name, email: u.email, password: "",
      role: u.role, department: u.department?._id ?? "", position: u.position ?? "",
    });
    setError("");
    setShowModal(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const body: any = { ...form };
    if (editing && !body.password) delete body.password;
    if (!body.department) body.department = null;
    if (!body.position)   body.position   = null;

    const url    = editing ? `/api/users/${editing._id}` : "/api/users";
    const method = editing ? "PUT" : "POST";

    const res  = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    setLoading(false);

    if (!res.ok) return setError(data.error);

    setShowModal(false);
    fetchUsers();

    if (!editing) {
      const deptName = departments.find((d) => d._id === form.department)?.name ?? "";
      setCreatedCreds({
        name: form.name, email: form.email, password: form.password,
        role: form.role, position: form.position, department: deptName,
      });
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this user?")) return;
    const res  = await fetch(`/api/users/${id}`, { method: "DELETE" });
    const data = await res.json();
    if (!res.ok) return alert(data.error);
    fetchUsers();
  }

  const inp = "glass-input w-full px-3 py-2.5 text-sm";

  return (
    <>
      {/* Credentials Card */}
      {createdCreds && (
        <CredentialsCard {...createdCreds} onClose={() => setCreatedCreds(null)} />
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 9999,
          display: "flex", alignItems: "center", justifyContent: "center",
          padding: "16px", background: "rgba(0,0,0,0.75)", backdropFilter: "blur(8px)",
        }}>
          <div style={{
            width: "100%", maxWidth: "520px", maxHeight: "88vh",
            borderRadius: "20px", background: "rgba(30,27,75,0.97)",
            border: "1px solid rgba(255,255,255,0.15)",
            display: "flex", flexDirection: "column",
            overflow: "hidden", boxShadow: "0 25px 60px rgba(0,0,0,0.5)",
          }}>
            {/* Header */}
            <div style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "20px 24px", borderBottom: "1px solid rgba(255,255,255,0.1)", flexShrink: 0,
            }}>
              <div>
                <h3 style={{ color: "#fff", fontWeight: 700, fontSize: "1rem", margin: 0 }}>
                  {editing ? "Edit User" : "Create User Account"}
                </h3>
                <p style={{ color: "rgba(255,255,255,0.45)", fontSize: "0.75rem", marginTop: "2px", marginBottom: 0 }}>
                  {editing ? "Update user details" : "Fill in credentials, role, department and position"}
                </p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                style={{
                  background: "transparent", border: "none",
                  color: "rgba(255,255,255,0.45)", cursor: "pointer",
                  padding: "6px", borderRadius: "8px",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}
              >
                <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", flex: 1, minHeight: 0 }}>

              {/* Scrollable fields */}
              <div style={{
                overflowY: "auto", flex: 1, padding: "24px",
                display: "flex", flexDirection: "column", gap: "16px",
              }}>
                {/* Row 1: Name + Email */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  <div>
                    <label style={{ display: "block", color: "rgba(255,255,255,0.75)", fontSize: "0.75rem", fontWeight: 600, marginBottom: "6px" }}>
                      Full Name
                    </label>
                    <input type="text" required value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="John Doe" className={inp} />
                  </div>
                  <div>
                    <label style={{ display: "block", color: "rgba(255,255,255,0.75)", fontSize: "0.75rem", fontWeight: 600, marginBottom: "6px" }}>
                      Email Address
                    </label>
                    <input type="email" required value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="john@company.com" className={inp} />
                  </div>
                </div>

                {/* Row 2: Password + Role */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  <div>
                    <label style={{ display: "block", color: "rgba(255,255,255,0.75)", fontSize: "0.75rem", fontWeight: 600, marginBottom: "6px" }}>
                      Password{" "}
                      {editing && <span style={{ color: "rgba(255,255,255,0.35)", fontWeight: 400 }}>(optional)</span>}
                    </label>
                    <input type="password" required={!editing} value={form.password}
                      onChange={(e) => setForm({ ...form, password: e.target.value })}
                      placeholder="Min. 6 chars" minLength={6} className={inp} />
                  </div>
                  <div>
                    <label style={{ display: "block", color: "rgba(255,255,255,0.75)", fontSize: "0.75rem", fontWeight: 600, marginBottom: "6px" }}>
                      Role
                    </label>
                    <select value={form.role}
                      onChange={(e) => setForm({ ...form, role: e.target.value })}
                      className={inp}>
                      <option value="employee">Employee</option>
                      <option value="manager">Manager</option>
                      <option value="admin">Admin</option>
                    </select>
                    <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "0.7rem", marginTop: "4px" }}>
                      {form.role === "admin"    && "Full system access"}
                      {form.role === "manager"  && "Manage teams & salaries"}
                      {form.role === "employee" && "View own profile only"}
                    </p>
                  </div>
                </div>

                {/* Row 3: Department + Position */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  <div>
                    <label style={{ display: "block", color: "rgba(255,255,255,0.75)", fontSize: "0.75rem", fontWeight: 600, marginBottom: "6px" }}>
                      Department{" "}
                      <span style={{ color: "rgba(255,255,255,0.35)", fontWeight: 400 }}>(optional)</span>
                    </label>
                    <select value={form.department}
                      onChange={(e) => setForm({ ...form, department: e.target.value })}
                      className={inp}>
                      <option value="">— None —</option>
                      {departments.map((d) => (
                        <option key={d._id} value={d._id}>{d.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label style={{ display: "block", color: "rgba(255,255,255,0.75)", fontSize: "0.75rem", fontWeight: 600, marginBottom: "6px" }}>
                      Position{" "}
                      <span style={{ color: "rgba(255,255,255,0.35)", fontWeight: 400 }}>(optional)</span>
                    </label>
                    <select value={form.position}
                      onChange={(e) => setForm({ ...form, position: e.target.value })}
                      className={inp}>
                      <option value="">— None —</option>
                      {POSITIONS.map((p) => (
                        <option key={p} value={p}>{p}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Custom position */}
                {form.position === "" && (
                  <div>
                    <label style={{ display: "block", color: "rgba(255,255,255,0.5)", fontSize: "0.75rem", fontWeight: 600, marginBottom: "6px" }}>
                      Custom Position{" "}
                      <span style={{ fontWeight: 400 }}>(type if not in list)</span>
                    </label>
                    <input type="text" value={form.position}
                      onChange={(e) => setForm({ ...form, position: e.target.value })}
                      placeholder="e.g. Lead Architect" className={inp} />
                  </div>
                )}

                {/* Error */}
                {error && (
                  <div style={{
                    padding: "12px 16px", borderRadius: "12px",
                    background: "rgba(239,68,68,0.15)",
                    border: "1px solid rgba(239,68,68,0.3)",
                    color: "#fca5a5", fontSize: "0.875rem",
                  }}>
                    {error}
                  </div>
                )}
              </div>

              {/* Footer — always visible */}
              <div style={{
                padding: "16px 24px", borderTop: "1px solid rgba(255,255,255,0.08)",
                display: "flex", gap: "12px", flexShrink: 0,
                background: "rgba(30,27,75,0.97)",
              }}>
                <button type="button" onClick={() => setShowModal(false)}
                  style={{
                    flex: 1, padding: "10px", borderRadius: "12px",
                    background: "rgba(255,255,255,0.08)",
                    border: "1px solid rgba(255,255,255,0.2)",
                    color: "rgba(255,255,255,0.85)",
                    fontWeight: 600, fontSize: "0.875rem", cursor: "pointer",
                  }}>
                  Cancel
                </button>
                <button type="submit" disabled={loading}
                  style={{
                    flex: 1, padding: "10px", borderRadius: "12px",
                    background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                    border: "none", color: "#fff",
                    fontWeight: 700, fontSize: "0.875rem",
                    cursor: loading ? "not-allowed" : "pointer",
                    opacity: loading ? 0.6 : 1,
                    display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                  }}>
                  {loading ? "Saving..." : editing ? "Save Changes" : "Create Account"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Page content */}
      <div style={{
        opacity: show ? 1 : 0,
        transform: show ? "translateY(0)" : "translateY(16px)",
        transition: "opacity 400ms ease, transform 400ms ease",
      }}>
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold gradient-text">User Accounts</h2>
            <p className="text-sm mt-0.5" style={{ color: "rgba(255,255,255,0.7)" }}>
              {users.length} accounts
            </p>
          </div>
          <button onClick={openAdd} className="btn-glass flex items-center gap-2 px-4 py-2.5 text-sm">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add User
          </button>
        </div>

        {/* Table */}
        <div className="glass-card overflow-hidden">
          <table className="glass-table">
            <thead>
              <tr>
                {["User", "Position", "Department", "Role", "Created", "Actions"].map((h) => (
                  <th key={h}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-16" style={{ color: "rgba(255,255,255,0.55)" }}>
                    No users found
                  </td>
                </tr>
              ) : users.map((u, i) => {
                const roleStyle = ROLE_STYLE[u.role] ?? ROLE_STYLE.employee;
                return (
                  <tr key={u._id} style={{ opacity: show ? 1 : 0, transition: `opacity 300ms ease ${i * 50}ms` }}>
                    {/* User */}
                    <td>
                      <div className="flex items-center gap-3">
                        <Avatar name={u.name} />
                        <div>
                          <p className="font-semibold text-white">{u.name}</p>
                          <p className="text-xs" style={{ color: "rgba(255,255,255,0.65)" }}>{u.email}</p>
                        </div>
                      </div>
                    </td>
                    {/* Position */}
                    <td>
                      <span style={{ color: u.position ? "rgba(255,255,255,0.85)" : "rgba(255,255,255,0.3)", fontSize: "0.875rem" }}>
                        {u.position ?? "—"}
                      </span>
                    </td>
                    {/* Department */}
                    <td>
                      {u.department ? (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold"
                          style={{ background: "rgba(99,102,241,0.15)", color: "#a5b4fc", border: "1px solid rgba(99,102,241,0.3)" }}>
                          {u.department.name}
                        </span>
                      ) : (
                        <span style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.875rem" }}>—</span>
                      )}
                    </td>
                    {/* Role */}
                    <td>
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold"
                        style={{ background: roleStyle.bg, color: roleStyle.color, border: `1px solid ${roleStyle.dot}44` }}>
                        <span className="w-1.5 h-1.5 rounded-full" style={{ background: roleStyle.dot }} />
                        {roleStyle.label}
                      </span>
                    </td>
                    {/* Created */}
                    <td style={{ color: "rgba(255,255,255,0.75)", fontSize: "0.75rem" }}>
                      {new Date(u.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                    </td>
                    {/* Actions */}
                    <td>
                      <div className="flex items-center gap-1">
                        <button onClick={() => openEdit(u)} className="p-1.5 rounded-lg transition-all"
                          style={{ color: "rgba(255,255,255,0.65)", background: "transparent", border: "none", cursor: "pointer" }}
                          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "#818cf8"; (e.currentTarget as HTMLElement).style.background = "rgba(99,102,241,0.2)"; }}
                          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.65)"; (e.currentTarget as HTMLElement).style.background = "transparent"; }}>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button onClick={() => handleDelete(u._id)} className="p-1.5 rounded-lg transition-all"
                          style={{ color: "rgba(255,255,255,0.65)", background: "transparent", border: "none", cursor: "pointer" }}
                          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "#f87171"; (e.currentTarget as HTMLElement).style.background = "rgba(239,68,68,0.2)"; }}
                          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.65)"; (e.currentTarget as HTMLElement).style.background = "transparent"; }}>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
