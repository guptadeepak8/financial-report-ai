"use client";

import { useState } from "react";
import type { ReportStatus } from "@/lib/reports-api";

interface ReportProgressProps {
  status: ReportStatus | null;
  currentStep: string;
  isConnected: boolean;
  companyName: string;
}

const steps: Array<{ status: ReportStatus; code: string; label: string }> = [
  { status: "extracting", code: "01", label: "Extracting document" },
  { status: "analyzing", code: "02", label: "Analyzing financials" },
  { status: "report_generated", code: "03", label: "Drafting report" },
  { status: "pdf_generating", code: "04", label: "Rendering PDF" },
  { status: "completed", code: "05", label: "Ready" },
];

export function ReportProgress({ status, isConnected, companyName }: ReportProgressProps) {
  const [caseRef] = useState(() => {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
    return `REF-${y}${m}${day}-${rand}`;
  });

  const hasStarted = status !== null;
  const currentIndex = hasStarted ? steps.findIndex((s) => s.status === status) : -1;

  return (
    <aside className="h-fit rounded-2xl border border-[var(--rule)] bg-white p-6 lg:sticky lg:top-10">
      <p className="font-mono-label text-[10px] uppercase tracking-[0.14em] text-[var(--muted)]">
        Case file · {caseRef}
      </p>
      <h2 className="font-display mt-1.5 truncate text-xl text-[var(--ink)]">
        {companyName || "Untitled company"}
      </h2>

      <div className="mt-2 flex items-center gap-1.5">
        <span
          className={[
            "h-1.5 w-1.5 rounded-full",
            isConnected ? "bg-emerald-500" : "bg-[#c3c9d1]",
          ].join(" ")}
        />
        <span className="font-mono-label text-[10px] uppercase tracking-wide text-[var(--muted)]">
          {!hasStarted ? "Idle" : isConnected ? "Live" : "Connecting"}
        </span>
      </div>

      <div className="mt-6 border-t border-[var(--rule)] pt-1">
        {steps.map((step, index) => {
          const completed = hasStarted && currentIndex > index;
          const current = hasStarted && currentIndex === index;

          return (
            <div
              key={step.status}
              className="flex items-center gap-3 border-b border-[var(--rule)] py-3 last:border-b-0"
            >
              <span
                className={[
                  "font-mono-label text-[10px] font-bold",
                  completed || current ? "text-[var(--ink-navy)]" : "text-[#c3c9d1]",
                ].join(" ")}
              >
                {step.code}
              </span>
              <span
                className={[
                  "flex-1 text-sm",
                  completed
                    ? "text-[var(--muted)]"
                    : current
                      ? "font-semibold text-[var(--ink)]"
                      : "text-[#c3c9d1]",
                ].join(" ")}
              >
                {step.label}
              </span>
              {current && (
                <span className="rotate-[-4deg] rounded-sm bg-[var(--stamp-soft)] px-1.5 py-0.5 font-mono-label text-[9px] font-bold uppercase tracking-wide text-[var(--stamp)]">
                  Live
                </span>
              )}
              {completed && <span className="text-[var(--ink-navy)]">✓</span>}
            </div>
          );
        })}
      </div>
    </aside>
  );
}