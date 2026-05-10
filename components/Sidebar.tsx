"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const links = [
  { href: "/dashboard", label: "Dashboard",
    icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg> },
  { href: "/employees", label: "Employees",
    icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg> },
  { href: "/departments", label: "Departments",
    icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg> },
  { href: "/salaries", label: "Salaries",
    icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> },
  { href: "/users", label: "User Accounts",
    icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" /></svg> },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { const t = setTimeout(() => setMounted(true), 60); return () => clearTimeout(t); }, []);

  async function handleLogout() {
    setLoggingOut(true);
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  }

  return (
    <aside
      className="glass w-64 min-h-screen flex flex-col fixed left-0 top-0 bottom-0 z-30"
      style={{ borderRight: "1px solid rgba(255,255,255,0.12)", borderRadius: 0 }}
    >
      {/* Logo */}
      <Link
        href="/dashboard"
        className="px-6 py-5 flex items-center gap-3 group"
        style={{
          borderBottom: "1px solid rgba(255,255,255,0.1)",
          opacity: mounted ? 1 : 0,
          transform: mounted ? "translateY(0)" : "translateY(-10px)",
          transition: "opacity 400ms ease, transform 400ms ease",
        }}
      >
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center icon-glow"
          style={{
            background: "linear-gradient(135deg, #6366F1, #8B5CF6)",
            transition: "transform 200ms cubic-bezier(0.34,1.56,0.64,1)",
          }}
          onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.12) rotate(-5deg)")}
          onMouseLeave={e => (e.currentTarget.style.transform = "scale(1) rotate(0deg)")}
        >
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        </div>
        <div>
          <h1 className="text-sm font-bold text-white tracking-wide">EMS Admin</h1>
          <p className="text-xs" style={{ color: "rgba(255,255,255,0.65)" }}>Management System</p>
        </div>
      </Link>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto">
        <p className="text-xs font-semibold uppercase tracking-widest px-3 mb-3"
          style={{ color: "rgba(255,255,255,0.55)", opacity: mounted ? 1 : 0, transition: "opacity 300ms ease 100ms" }}>
          Main Menu
        </p>
        <div className="space-y-1">
          {links.map((link, i) => {
            const active = pathname === link.href || (link.href !== "/dashboard" && pathname.startsWith(link.href));
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`nav-item${active ? " nav-active" : ""} flex items-center gap-3 px-3 py-2.5 text-sm font-medium`}
                style={{
                  opacity: mounted ? 1 : 0,
                  transform: mounted ? "translateX(0)" : "translateX(-16px)",
                  transition: `opacity 380ms cubic-bezier(0.34,1.56,0.64,1) ${120 + i * 65}ms,
                               transform 380ms cubic-bezier(0.34,1.56,0.64,1) ${120 + i * 65}ms`,
                  background: active ? "linear-gradient(135deg, rgba(99,102,241,0.35), rgba(139,92,246,0.25))" : undefined,
                  border: active ? "1px solid rgba(139,92,246,0.4)" : "1px solid transparent",
                  color: active ? "#fff" : "rgba(255,255,255,0.78)",
                  boxShadow: active ? "0 0 20px rgba(99,102,241,0.2)" : undefined,
                }}
              >
                <span className="nav-icon" style={{ color: active ? "#c4b5fd" : "rgba(255,255,255,0.65)" }}>
                  {link.icon}
                </span>
                <span className="flex-1">{link.label}</span>
                {active && (
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full rounded-full bg-violet-400"
                      style={{ animation: "ping 1.4s cubic-bezier(0,0,0.2,1) infinite", opacity: 0.7 }} />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-violet-400" />
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Logout */}
      <div className="px-3 py-4" style={{ borderTop: "1px solid rgba(255,255,255,0.1)", opacity: mounted ? 1 : 0, transition: "opacity 350ms ease 500ms" }}>
        <button
          onClick={handleLogout}
          disabled={loggingOut}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium disabled:opacity-50"
          style={{
            color: "rgba(255,255,255,0.75)",
            border: "1px solid transparent",
            transition: "all 160ms ease",
          }}
          onMouseEnter={e => {
            const el = e.currentTarget as HTMLElement;
            el.style.background = "rgba(239,68,68,0.15)";
            el.style.color = "#fca5a5";
            el.style.border = "1px solid rgba(239,68,68,0.3)";
          }}
          onMouseLeave={e => {
            const el = e.currentTarget as HTMLElement;
            el.style.background = "transparent";
            el.style.color = "rgba(255,255,255,0.5)";
            el.style.border = "1px solid transparent";
          }}
        >
          {loggingOut
            ? <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
            : <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
          }
          {loggingOut ? "Signing out..." : "Sign Out"}
        </button>
      </div>
    </aside>
  );
}
