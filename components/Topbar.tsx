"use client";
import { usePathname, useRouter } from "next/navigation";

const PAGE_TITLES: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/employees": "Employees",
  "/departments": "Departments",
  "/salaries": "Salaries",
  "/users": "User Accounts",
};

export default function Topbar() {
  const pathname = usePathname();
  const router = useRouter();
  const isRoot = Object.keys(PAGE_TITLES).includes(pathname);
  const title = PAGE_TITLES[pathname] ?? "Details";

  return (
    <div className="flex items-center gap-3 mb-8">
      {!isRoot && (
        <button
          onClick={() => router.back()}
          className="flex items-center justify-center w-9 h-9 rounded-xl text-white/60 hover:text-white transition-all duration-200"
          style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)" }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(99,102,241,0.25)"; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.08)"; }}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      )}
      <div>
        <h1 className="text-xl font-bold gradient-text">{title}</h1>
        {!isRoot && (
          <button onClick={() => router.back()} className="text-xs mt-0.5 flex items-center gap-1 transition-colors"
            style={{ color: "rgba(255,255,255,0.65)" }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "#a78bfa"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.65)"; }}
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            Go back
          </button>
        )}
      </div>
    </div>
  );
}
