// report-generator.tsx
"use client";

import { useReportJob } from "@/hooks/use-report-job";
import { useState } from "react";
import { ReportForm } from "./report-form";
import { ReportProgress } from "./report-progress";
import { ReportResult } from "./report-result";
import type { ReportStatus } from "@/lib/reports-api";

const stepLabels: Record<string, string> = {
  queued: "Queued",
  extracting: "Extracting document",
  analyzing: "Analyzing financials",
  report_generated: "Drafting report",
  pdf_generating: "Rendering PDF",
  completed: "Ready",
};

const statusOrder: ReportStatus[] = [
  "extracting",
  "analyzing",
  "report_generated",
  "pdf_generating",
  "completed",
];

export default function ReportGenerator() {
  const {
    reportId,
    status,
    currentStep,
    errorMessage,
    isSubmitting,
    isConnected,
    startReport,
  } = useReportJob();

  const [companyName, setCompanyName] = useState("");

  const [viewMode, setViewMode] = useState<"auto" | "form">("auto");

  const effectiveStatus: ReportStatus | null = viewMode === "form" ? null : status;

  async function handleSubmit(name: string, file: File): Promise<void> {
    setCompanyName(name);
    setViewMode("auto");
    await startReport(name, file);
  }

  function handleStartNew() {
    setCompanyName("");
    setViewMode("form");
  }

  const isCompleted = effectiveStatus === "completed";
  const currentIndex = effectiveStatus ? statusOrder.indexOf(effectiveStatus) : -1;
  const progressPercent =
    currentIndex >= 0 ? ((currentIndex + 1) / statusOrder.length) * 100 : 0;

  return (
    <main className="min-h-screen">
      <div className="mx-auto flex min-h-screen w-full max-w-5xl flex-col px-6 py-14 sm:px-8 lg:py-16">
        <header className="mb-10">
          <div className="mb-5 flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-[var(--ink-navy)] text-[11px] font-bold text-white">
              R
            </div>
            <p className="font-mono-label text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--ink-navy)]">
              Equity Research · Report Engine
            </p>
          </div>

          <h1 className="font-display text-4xl leading-tight text-[var(--ink)] sm:text-[2.75rem]">
            Turn a filing into a finished research report.
          </h1>
          <p className="mt-4 max-w-lg text-[15px] leading-relaxed text-[var(--muted)]">
            Upload a company&apos;s financial document. Get back a structured
            report tables, metrics, narrative sections, and charts  as a
            downloadable PDF.
          </p>
        </header>

        <div className="grid flex-1 gap-6 lg:grid-cols-[280px_1fr]">
          <ReportProgress
            status={effectiveStatus}
            currentStep={currentStep}
            isConnected={isConnected}
            companyName={companyName}
          />

          <div className="relative flex min-h-[440px] flex-col justify-center rounded-2xl border border-[var(--rule)] bg-white p-8 shadow-[0_1px_2px_rgba(20,23,28,0.04)] sm:p-10">
            {isCompleted && (
              <button
                type="button"
                onClick={handleStartNew}
                className="absolute right-8 top-8 font-mono-label text-[10px] font-semibold uppercase tracking-wide text-[var(--ink-navy)] underline decoration-[var(--rule)] underline-offset-4 hover:decoration-[var(--ink-navy)] sm:right-10 sm:top-10"
              >
                Start a new report
              </button>
            )}

            {errorMessage && (
              <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3">
                <p className="text-sm font-medium text-red-800">{errorMessage}</p>
              </div>
            )}

            <div
              key={isCompleted ? "result" : effectiveStatus ?? "form"}
              className="stage-enter"
            >
              {isCompleted && reportId ? (
                <ReportResult reportId={reportId} companyName={companyName} />
              ) : effectiveStatus ? (
                <div>
                  <div className="flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--stamp)] opacity-60" />
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--stamp)]" />
                    </span>
                    <p className="font-mono-label text-[10px] uppercase tracking-[0.14em] text-[var(--muted)]">
                      In progress · stage {currentIndex + 1} of {statusOrder.length}
                    </p>
                  </div>

                  <h2 className="font-display mt-2 text-3xl text-[var(--ink)] sm:text-4xl">
                    {stepLabels[effectiveStatus] ?? currentStep}
                  </h2>

                  <div className="mt-5 h-1 w-full max-w-sm overflow-hidden rounded-full bg-[var(--rule)]">
                    <div
                      className="h-full rounded-full bg-[var(--ink-navy)] transition-[width] duration-700 ease-out"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>

                  <p className="mt-3 max-w-sm text-[15px] leading-relaxed text-[var(--muted)]">
                    Sit tight — this updates live as each stage completes on the left.
                  </p>
                </div>
              ) : (
                <ReportForm isSubmitting={isSubmitting} onSubmit={handleSubmit} />
              )}
            </div>
          </div>
        </div>

        <footer className="mt-10">
          <p className="font-mono-label text-[10px] uppercase tracking-[0.14em] text-[#9aa2ac]">
            PDF · CSV · TXT supported
          </p>
        </footer>
      </div>
    </main>
  );
}