"use client";

import type { ReportStatus } from "@/lib/reports-api";

interface ReportProgressProps {
  status: ReportStatus | null;
  currentStep: string;
  isConnected: boolean;
  companyName: string;
}

const steps: Array<{ status: ReportStatus; label: string }> = [
  { status: "extracting", label: "Extracting document" },
  { status: "analyzing", label: "Analyzing financials" },
  { status: "report_generated", label: "Drafting report" },
  { status: "pdf_generating", label: "Rendering PDF" },
  { status: "completed", label: "Ready" },
];

function Spinner() {
  return (
    <span className="h-3 w-3 shrink-0 animate-spin rounded-full border-2 border-white/20 border-t-white" />
  );
}

export function ReportProgress({ status, isConnected, companyName }: ReportProgressProps) {
  const hasStarted = status !== null;

  if (!hasStarted) {
    return (
      <aside className="h-fit rounded-2xl border border-white/20 bg-black p-6 lg:sticky lg:top-10">
        <p className="text-sm text-gray-500">
          Progress will appear here once you upload a document.
        </p>
      </aside>
    );
  }

  const currentIndex = steps.findIndex((s) => s.status === status);

  return (
    <aside className="h-fit rounded-2xl border border-white/20 bg-black p-6 lg:sticky lg:top-10">
      <h2 className="font-display truncate text-xl text-white">
        {companyName || "Untitled"}
      </h2>

      <div className="mt-1 flex items-center gap-1.5">
        <span className={["h-1.5 w-1.5 rounded-full", isConnected ? "bg-white" : "bg-white/30"].join(" ")} />
        <span className="text-xs text-gray-500">{isConnected ? "Live" : "Connecting"}</span>
      </div>

      <div className="mt-6 border-t border-white/20 pt-1">
        {steps.map((step, index) => {
          const completed = currentIndex > index;
          const current = currentIndex === index;

          return (
            <div key={step.status} className="flex items-center gap-3 border-b border-white/10 py-3 last:border-b-0">
              {completed ? (
                <span className="w-3 shrink-0 text-white">✓</span>
              ) : current ? (
                <Spinner />
              ) : (
                <span className="w-3 shrink-0" />
              )}
              <span
                className={[
                  "flex-1 text-sm",
                  completed ? "text-gray-500" : current ? "font-medium text-white" : "text-gray-600",
                ].join(" ")}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </aside>
  );
}