"use client";
import { useEffect, useState } from "react";
import StatsCard from "@/components/StatsCard";
import Link from "next/link";

interface Stats { totalEmployees: number; activeEmployees: number; totalDepartments: number; totalSalaryPaid: number; totalSalary: number }

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [show, setShow] = useState(false);
  useEffect(() => { fetch("/api/stats").then(r => r.json()).then(setStats); setTimeout(() => setShow(true), 40); }, []);

  const cards = stats ? [
    { title: "Total Employees",  value: stats.totalEmployees,  gradient: "bg-gradient-to-br from-indigo-500 to-violet-600", glow: "glow-indigo", trend: `${stats.activeEmployees} active`, delay: 0,
      icon: <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/></svg> },
    { title: "Active Employees", value: stats.activeEmployees, gradient: "bg-gradient-to-br from-teal-400 to-cyan-600",    glow: "glow-teal",   trend: `${stats.totalEmployees - stats.activeEmployees} inactive`, delay: 100,
      icon: <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg> },
    { title: "Departments",      value: stats.totalDepartments, gradient: "bg-gradient-to-br from-pink-500 to-rose-600",   glow: "glow-pink",   trend: "Active teams", delay: 200,
      icon: <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg> },
    { title: "Total Salary Paid",value: `$${stats.totalSalaryPaid.toLocaleString()}`, gradient: "bg-gradient-to-br from-amber-400 to-orange-500", glow: "glow-amber", trend: `$${stats.totalSalary.toLocaleString()} total`, delay: 300,
      icon: <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg> },
  ] : [];

  const quickLinks = [
    { href: "/employees",   label: "Manage Employees", desc: "Add, edit or remove employees", dot: "#6366F1", delay: 0   },
    { href: "/departments", label: "View Departments", desc: "Organize your teams",            dot: "#EC4899", delay: 70  },
    { href: "/salaries",    label: "Salary Records",   desc: "Track payroll and payments",     dot: "#F59E0B", delay: 140 },
    { href: "/users",       label: "User Accounts",    desc: "Manage admin access",            dot: "#14B8A6", delay: 210 },
  ];

  return (
    <div>
      <div style={{ opacity: show ? 1 : 0, transform: show ? "translateY(0)" : "translateY(-14px)", transition: "opacity 350ms ease, transform 350ms ease" }} className="mb-8">
        <h2 className="text-3xl font-bold gradient-text">Dashboard</h2>
        <p className="text-sm mt-1" style={{ color: "rgba(255,255,255,0.72)" }}>Welcome back! Here's what's happening.</p>
      </div>

      {!stats ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="glass-card p-6 h-28 animate-pulse">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl" style={{ background: "rgba(255,255,255,0.08)" }} />
                <div className="flex-1 space-y-2">
                  <div className="h-3 rounded w-24" style={{ background: "rgba(255,255,255,0.08)" }} />
                  <div className="h-6 rounded w-16" style={{ background: "rgba(255,255,255,0.08)" }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          {cards.map(c => <StatsCard key={c.title} {...c} />)}
        </div>
      )}

      <div className="glass-card p-6" style={{ opacity: show ? 1 : 0, transform: show ? "translateY(0)" : "translateY(16px)", transition: "opacity 400ms ease 360ms, transform 400ms ease 360ms" }}>
        <h3 className="text-sm font-semibold mb-4" style={{ color: "rgba(255,255,255,0.85)" }}>Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {quickLinks.map(q => (
            <Link key={q.href} href={q.href} className="action-card p-4 flex items-start gap-3 group"
              style={{ opacity: show ? 1 : 0, transform: show ? "translateY(0)" : "translateY(12px)", transition: `opacity 380ms cubic-bezier(0.34,1.56,0.64,1) ${420 + q.delay}ms, transform 380ms cubic-bezier(0.34,1.56,0.64,1) ${420 + q.delay}ms` }}
            >
              {/* Glow dot top-right */}
              <span className="absolute top-3 right-3 w-2 h-2 rounded-full" style={{ background: q.dot, boxShadow: `0 0 8px ${q.dot}` }} />
              <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: `${q.dot}22`, border: `1px solid ${q.dot}44` }}>
                <svg className="w-4 h-4 arrow-icon" style={{ color: q.dot }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-semibold text-white group-hover:text-violet-300 transition-colors">{q.label}</p>
                <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.65)" }}>{q.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
