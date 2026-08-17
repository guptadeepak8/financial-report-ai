"use client";

import { useReportJob } from "@/hooks/use-report-job";
import { useState } from "react";
import { ReportForm } from "./report-form";
import { ReportProgress } from "./report-progress";
import { ReportResult } from "./report-result";

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

  async function handleSubmit(companyName: string, file: File): Promise<void> {
    setCompanyName(companyName);
    await startReport(companyName, file);
  }

  const hasStarted = status !== null;
  const isCompleted = status === "completed";

  return (
    <main className="min-h-screen">
      <div className="mx-auto flex min-h-screen w-full max-w-3xl flex-col px-6 py-14 sm:px-8 lg:py-24">
        {/* Header */}
        <header className="mb-12">
          <div className="mb-5 flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-[#1f4e79] text-[11px] font-bold text-white">
              R
            </div>
            <p className="font-mono-label text-[11px] font-semibold uppercase tracking-[0.18em] text-[#1f4e79]">
              Equity Research · Report Engine
            </p>
          </div>

          <h1 className="font-display text-4xl leading-tight text-[#14171c] sm:text-[2.75rem]">
            Turn a filing into a
            <br />
            finished research report.
          </h1>

          <p className="mt-4 max-w-lg text-[15px] leading-relaxed text-[#5b6470]">
            Upload a company's financial document. Get back a structured
            report — tables, metrics, narrative sections, and charts — as a
            downloadable PDF.
          </p>
        </header>

        <ReportForm isSubmitting={isSubmitting} onSubmit={handleSubmit} />

        {errorMessage && (
          <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-5 py-4">
            <p className="text-sm font-medium text-red-800">{errorMessage}</p>
          </div>
        )}

        {hasStarted && (
          <ReportProgress
            status={status}
            currentStep={currentStep}
            isConnected={isConnected}
          />
        )}

        {isCompleted && (
          <ReportResult reportId={reportId} companyName={companyName} />
        )}

        <footer className="mt-auto pt-16">
          <p className="font-mono-label text-[10px] uppercase tracking-[0.14em] text-[#9aa2ac]">
            PDF · CSV · TXT supported
          </p>
        </footer>
      </div>
    </main>
  );
}