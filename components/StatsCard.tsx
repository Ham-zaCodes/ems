"use client";
import { useEffect, useRef, useState } from "react";

interface StatsCardProps {
  title: string; value: string | number; icon: React.ReactNode;
  gradient: string; glow: string; trend?: string; delay?: number;
}

function useCountUp(target: number, duration = 1000, delay = 0) {
  const [val, setVal] = useState(0);
  const raf = useRef<number>(0);
  useEffect(() => {
    let start: number | null = null;
    const timeout = setTimeout(() => {
      const step = (ts: number) => {
        if (!start) start = ts;
        const p = Math.min((ts - start) / duration, 1);
        setVal(Math.floor((1 - Math.pow(1 - p, 3)) * target));
        if (p < 1) raf.current = requestAnimationFrame(step);
        else setVal(target);
      };
      raf.current = requestAnimationFrame(step);
    }, delay);
    return () => { clearTimeout(timeout); cancelAnimationFrame(raf.current); };
  }, [target, duration, delay]);
  return val;
}

export default function StatsCard({ title, value, icon, gradient, glow, trend, delay = 0 }: StatsCardProps) {
  const [visible, setVisible] = useState(false);
  const isNum = typeof value === "number";
  const isCur = typeof value === "string" && value.startsWith("$");
  const raw = isNum ? value : isCur ? parseInt(value.replace(/[$,]/g, ""), 10) : 0;
  const counted = useCountUp(raw, 1000, delay + 200);
  const display = isNum ? counted : isCur ? `$${counted.toLocaleString()}` : value;

  useEffect(() => { const t = setTimeout(() => setVisible(true), delay); return () => clearTimeout(t); }, [delay]);

  return (
    <div
      className={`glass-card ${glow} p-6 flex items-center gap-4`}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0) scale(1)" : "translateY(24px) scale(0.95)",
        transition: `opacity 450ms cubic-bezier(0.34,1.56,0.64,1) ${delay}ms, transform 450ms cubic-bezier(0.34,1.56,0.64,1) ${delay}ms`,
      }}
    >
      <div className={`icon-glow w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 ${gradient}`}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate" style={{ color: "rgba(255,255,255,0.8)" }}>{title}</p>
        <p className="text-3xl font-bold text-white mt-0.5 tabular-nums"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(8px)",
            transition: `opacity 400ms ease ${delay + 200}ms, transform 400ms ease ${delay + 200}ms`,
          }}
        >{display}</p>
        {trend && (
          <p className="text-xs font-medium mt-1" style={{ color: "rgba(255,255,255,0.7)", opacity: visible ? 1 : 0, transition: `opacity 300ms ease ${delay + 350}ms` }}>
            {trend}
          </p>
        )}
      </div>
    </div>
  );
}
