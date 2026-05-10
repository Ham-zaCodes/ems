interface PaginationProps { page: number; totalPages: number; onPageChange: (page: number) => void; }

export default function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;
  return (
    <div className="flex items-center justify-between mt-5 px-1">
      <p className="text-sm" style={{ color: "rgba(255,255,255,0.4)" }}>Page {page} of {totalPages}</p>
      <div className="flex items-center gap-1">
        <button onClick={() => onPageChange(page - 1)} disabled={page === 1}
          className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm disabled:opacity-30 transition-all"
          style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.7)" }}
          onMouseEnter={e => { if (page !== 1) (e.currentTarget as HTMLElement).style.background = "rgba(99,102,241,0.25)"; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.07)"; }}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          Prev
        </button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
          <button key={p} onClick={() => onPageChange(p)}
            className="w-9 h-9 rounded-lg text-sm font-medium transition-all"
            style={{
              background: p === page ? "linear-gradient(135deg,#6366F1,#8B5CF6)" : "rgba(255,255,255,0.07)",
              border: p === page ? "1px solid rgba(139,92,246,0.5)" : "1px solid rgba(255,255,255,0.12)",
              color: "#fff",
              boxShadow: p === page ? "0 0 14px rgba(99,102,241,0.4)" : undefined,
            }}
          >{p}</button>
        ))}
        <button onClick={() => onPageChange(page + 1)} disabled={page === totalPages}
          className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm disabled:opacity-30 transition-all"
          style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.7)" }}
          onMouseEnter={e => { if (page !== totalPages) (e.currentTarget as HTMLElement).style.background = "rgba(99,102,241,0.25)"; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.07)"; }}
        >
          Next
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
        </button>
      </div>
    </div>
  );
}
