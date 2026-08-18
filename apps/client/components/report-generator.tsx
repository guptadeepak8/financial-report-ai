"use client";

import { useReportJob } from "@/hooks/use-report-job";
import { useState } from "react";
import { ReportForm } from "./report-form";
import { ReportProgress } from "./report-progress";
import { ReportResult } from "./report-result";

const stepLabels: Record<string, string> = {
  queued: "Queued",
  extracting: "Extracting document",
  analyzing: "Analyzing financials",
  report_generated: "Drafting report",
  pdf_generating: "Rendering PDF",
  completed: "Ready",
};

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

  async function handleSubmit(name: string, file: File): Promise<void> {
    setCompanyName(name);
    await startReport(name, file);
  }

  const isCompleted = status === "completed";

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
            report — tables, metrics, narrative sections, and charts — as a
            downloadable PDF.
          </p>
        </header>

        <div className="grid flex-1 gap-6 lg:grid-cols-[280px_1fr]">
          <ReportProgress
            status={status}
            currentStep={currentStep}
            isConnected={isConnected}
            companyName={companyName}
          />

          <div className="flex min-h-[440px] flex-col justify-center rounded-2xl border border-[var(--rule)] bg-white p-8 shadow-[0_1px_2px_rgba(20,23,28,0.04)] sm:p-10">
            {errorMessage && (
              <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3">
                <p className="text-sm font-medium text-red-800">{errorMessage}</p>
              </div>
            )}

            <div key={isCompleted ? "result" : status ?? "form"} className="stage-enter">
              {isCompleted && reportId ? (
                <ReportResult reportId={reportId} companyName={companyName} />
              ) : status ? (
                <div>
                  <p className="font-mono-label text-[10px] uppercase tracking-[0.14em] text-[var(--muted)]">
                    In progress
                  </p>
                  <h2 className="font-display mt-1.5 text-3xl text-[var(--ink)] sm:text-4xl">
                    {stepLabels[status] ?? currentStep}
                  </h2>
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