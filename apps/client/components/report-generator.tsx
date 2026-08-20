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

const stepDescriptions: Record<string, string> = {
  queued: "Your document is in line to be processed.",
  extracting: "Pulling line items, tables, and figures out of the filing — revenue, margins, balance sheet, cash flow.",
  analyzing: "Computing ratios, YoY/QoQ growth, and flagging notable shifts in the financials.",
  report_generated: "Writing the narrative sections — summary, outlook, and commentary on what the numbers mean.",
  pdf_generating: "Laying out tables and charts into the final report document.",
  completed: "Your report is ready to download.",
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
  const progressPercent = currentIndex >= 0 ? ((currentIndex + 1) / statusOrder.length) * 100 : 0;

  return (
    <main className="min-h-screen bg-black">
      <div className="mx-auto flex min-h-screen w-full max-w-5xl flex-col px-6 py-14 sm:px-8 lg:py-16">
        <header className="mb-10">
          <h1 className="font-display text-4xl leading-tight text-white sm:text-[2.75rem]">
            Turn a filing into a finished research report.
          </h1>
          <p className="mt-4 max-w-lg text-[15px] leading-relaxed text-gray-400">
            Upload a company&apos;s financial document. Get back a structured report
            tables, metrics, narrative sections, and charts as a downloadable PDF.
          </p>
        </header>

        <div className="grid flex-1 gap-6 lg:grid-cols-[280px_1fr]">
          <ReportProgress
            status={effectiveStatus}
            currentStep={currentStep}
            isConnected={isConnected}
            companyName={companyName}
          />

          <div className="relative flex min-h-[440px] flex-col justify-center rounded-2xl border border-white/20 bg-black p-8 sm:p-10">
            {isCompleted && (
              <button
                type="button"
                onClick={handleStartNew}
                className="absolute right-8 top-8 text-xs font-medium text-white underline underline-offset-4 sm:right-10 sm:top-10"
              >
                Start a new report
              </button>
            )}

            {errorMessage && (
              <div className="mb-6 rounded-lg border border-white/20 bg-white/5 px-4 py-3">
                <p className="text-sm font-medium text-white">{errorMessage}</p>
              </div>
            )}

            <div key={isCompleted ? "result" : effectiveStatus ?? "form"} className="stage-enter">
              {isCompleted && reportId ? (
                <ReportResult reportId={reportId} companyName={companyName} />
              ) : effectiveStatus ? (
                <div>
                  <div className="flex items-center gap-2">
                    <span className="h-3 w-3 animate-spin rounded-full border-2 border-white/20 border-t-white" />
                    <p className="text-xs text-gray-500">
                      Stage {currentIndex + 1} of {statusOrder.length}
                    </p>
                  </div>

                  <h2 className="font-display mt-2 text-3xl text-white sm:text-4xl">
                    {stepLabels[effectiveStatus] ?? currentStep}
                  </h2>

                  <div className="mt-5 h-1 w-full max-w-sm overflow-hidden rounded-full bg-white/10">
                    <div
                      className="h-full rounded-full bg-white transition-[width] duration-700 ease-out"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>

                  <p className="mt-3 max-w-sm text-[15px] leading-relaxed text-gray-400">
                    {stepDescriptions[effectiveStatus] ?? "Working on your report."}
                  </p>
                </div>
              ) : (
                <ReportForm isSubmitting={isSubmitting} onSubmit={handleSubmit} />
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}