"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

interface Department {
  _id: string;
  name: string;
  description: string;
  createdAt: string;
}
interface Employee {
  _id: string;
  name: string;
  email: string;
  phone: string;
  position: string;
  status: string;
  joinDate: string;
}

function Avatar({ name }: { name: string }) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  const gradients = [
    "from-indigo-500 to-violet-600",
    "from-teal-400 to-cyan-600",
    "from-pink-500 to-rose-500",
    "from-amber-400 to-orange-500",
  ];
  return (
    <div
      className={`w-9 h-9 rounded-full bg-gradient-to-br ${gradients[name.charCodeAt(0) % gradients.length]} flex items-center justify-center text-xs font-bold text-white flex-shrink-0`}
    >
      {initials}
    </div>
  );
}

export default function DepartmentDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [dept, setDept] = useState<Department | null>(null);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [show, setShow] = useState(false);

  useEffect(() => {
    async function load() {
      const [deptRes, empRes, meRes] = await Promise.all([
        fetch("/api/departments"),
        fetch(`/api/departments/${id}/employees`),
        fetch("/api/auth/me"),
      ]);
      const depts: Department[] = await deptRes.json();
      setDept(depts.find((d) => d._id === id) || null);
      setEmployees(await empRes.json());
      setSession(meRes.ok ? await meRes.json() : null);
      setLoading(false);
      setTimeout(() => setShow(true), 40);
    }
    load();
  }, [id]);

  const isAdmin = session?.role === "admin";

  if (loading)
    return (
      <div className="flex items-center justify-center py-24">
        <svg
          className="animate-spin w-8 h-8"
          style={{ color: "#8B5CF6" }}
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
          />
        </svg>
      </div>
    );
  if (!dept)
    return (
      <p style={{ color: "rgba(255,255,255,0.5)" }}>Department not found.</p>
    );

  const active = employees.filter((e) => e.status === "active").length;
  const stats = [
    { label: "Total", value: employees.length, color: "#6366F1" },
    { label: "Active", value: active, color: "#14B8A6" },
    { label: "Inactive", value: employees.length - active, color: "#EC4899" },
  ];

  return (
    <div
      style={{
        opacity: show ? 1 : 0,
        transform: show ? "translateY(0)" : "translateY(16px)",
        transition: "opacity 400ms ease, transform 400ms ease",
      }}
    >
      <div className="flex items-start justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-lg">
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.8}
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
          </div>
          <div>
            <h2 className="text-2xl font-bold gradient-text">{dept.name}</h2>
            <p
              className="text-sm mt-0.5"
              style={{ color: "rgba(255,255,255,0.7)" }}
            >
              {dept.description || "No description"}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-5 mb-8">
        {stats.map((s, i) => (
          <div
            key={s.label}
            className="glass-card p-5 flex items-center gap-4"
            style={{
              opacity: show ? 1 : 0,
              transform: show ? "translateY(0)" : "translateY(16px)",
              transition: `opacity 400ms ease ${i * 80}ms, transform 400ms ease ${i * 80}ms`,
            }}
          >
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center"
              style={{
                background: `${s.color}22`,
                border: `1px solid ${s.color}44`,
              }}
            >
              <span className="text-xl font-bold" style={{ color: s.color }}>
                {s.value}
              </span>
            </div>
            <p
              className="text-sm font-medium"
              style={{ color: "rgba(255,255,255,0.8)" }}
            >
              {s.label}
            </p>
          </div>
        ))}
      </div>

      <div className="glass-card overflow-hidden">
        <div
          className="px-6 py-4 flex items-center justify-between"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}
        >
          <h3 className="font-bold text-white">Team Members</h3>
          <span
            className="text-xs px-2.5 py-1 rounded-full"
            style={{
              background: "rgba(99,102,241,0.2)",
              color: "#a78bfa",
              border: "1px solid rgba(99,102,241,0.3)",
            }}
          >
            {employees.length} members
          </span>
        </div>
        <table className="glass-table">
          <thead>
            <tr>
              {["Employee", "Phone", "Position", "Status", "Join Date"].map(
                (h) => (
                  <th key={h}>{h}</th>
                ),
              )}
            </tr>
          </thead>
          <tbody>
            {employees.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="text-center py-16"
                  style={{ color: "rgba(255,255,255,0.55)" }}
                >
                  No employees in this department
                </td>
              </tr>
            ) : (
              employees.map((emp, i) => (
                <tr
                  key={emp._id}
                  style={{
                    opacity: show ? 1 : 0,
                    transition: `opacity 300ms ease ${i * 40}ms`,
                  }}
                >
                  <td>
                    <div className="flex items-center gap-3">
                      <Avatar name={emp.name} />
                      <div>
                        <p className="font-semibold text-white">{emp.name}</p>
                        <p
                          className="text-xs"
                          style={{ color: "rgba(255,255,255,0.65)" }}
                        >
                          {emp.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td
                    style={{
                      color: "rgba(255,255,255,0.75)",
                      fontSize: "0.75rem",
                    }}
                  >
                    {emp.phone || "—"}
                  </td>
                  <td>{emp.position}</td>
                  <td>
                    <span
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold"
                      style={
                        emp.status === "active"
                          ? {
                              background: "rgba(20,184,166,0.15)",
                              color: "#2dd4bf",
                              border: "1px solid rgba(20,184,166,0.3)",
                            }
                          : {
                              background: "rgba(239,68,68,0.15)",
                              color: "#f87171",
                              border: "1px solid rgba(239,68,68,0.3)",
                            }
                      }
                    >
                      <span
                        className="w-1.5 h-1.5 rounded-full"
                        style={{
                          background:
                            emp.status === "active" ? "#14B8A6" : "#ef4444",
                        }}
                      />
                      {emp.status.charAt(0).toUpperCase() + emp.status.slice(1)}
                    </span>
                  </td>
                  <td
                    style={{
                      color: "rgba(255,255,255,0.75)",
                      fontSize: "0.75rem",
                    }}
                  >
                    {new Date(emp.joinDate).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
