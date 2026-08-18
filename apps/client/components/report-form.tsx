"use client";

import { type ChangeEvent, type FormEvent, useState } from "react";

interface ReportFormProps {
  isSubmitting: boolean;
  onSubmit: (companyName: string, file: File) => void;
}

export function ReportForm({ isSubmitting, onSubmit }: ReportFormProps) {
  const [companyName, setCompanyName] = useState("");
  const [file, setFile] = useState<File | null>(null);

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    setFile(event.target.files?.[0] ?? null);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!companyName.trim() || !file) return;
    onSubmit(companyName.trim(), file);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-7">
      <div>
        <p className="font-mono-label text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
          Stage 01 · Intake
        </p>
        <h2 className="font-display mt-1.5 text-2xl text-[var(--ink)] sm:text-[1.75rem]">
          Start a new report
        </h2>
      </div>

      <div>
        <label htmlFor="companyName" className="mb-2 block text-sm font-semibold text-[var(--ink)]">
          Company name
        </label>
        <input
          id="companyName"
          type="text"
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
          placeholder="e.g. LTTS"
          disabled={isSubmitting}
          className="w-full border-0 border-b-2 border-[var(--rule)] bg-transparent px-0.5 py-2.5 text-[15px] text-[var(--ink)] outline-none transition placeholder:text-[#b3b9c2] focus:border-[var(--ink-navy)] disabled:opacity-50"
        />
      </div>

      <div>
        <label htmlFor="document" className="mb-2 block text-sm font-semibold text-[var(--ink)]">
          Financial document
        </label>

        <label
          htmlFor="document"
          className="flex cursor-pointer items-center justify-between gap-4 rounded-lg border border-dashed border-[var(--rule)] bg-[var(--paper)] px-4 py-3.5 transition hover:border-[var(--ink-navy)]"
        >
          <span className="text-sm text-[var(--muted)]">
            {file ? "Replace file" : "Choose PDF, CSV, or TXT"}
          </span>
          <span className="font-mono-label text-[10px] uppercase tracking-wide text-[var(--ink-navy)]">
            Browse
          </span>
        </label>
        <input
          id="document"
          type="file"
          accept=".pdf,.csv,.txt"
          onChange={handleFileChange}
          disabled={isSubmitting}
          className="hidden"
        />

        <p className="mt-2 text-xs text-[var(--muted)]">Max file size 20 MB.</p>

        {file && (
          <div className="mt-3 flex items-center justify-between gap-3 border-t border-[var(--rule)] pt-3">
            <span className="truncate font-mono-label text-xs text-[var(--ink)]">{file.name}</span>
            <span className="shrink-0 rotate-[-3deg] rounded-sm bg-[var(--stamp-soft)] px-1.5 py-0.5 font-mono-label text-[9px] font-bold uppercase tracking-wide text-[var(--stamp)]">
              Attached
            </span>
          </div>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting || !companyName.trim() || !file}
        className="mt-2 w-full rounded-lg bg-[var(--ink-navy)] px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-[#0f2438] disabled:cursor-not-allowed disabled:opacity-40"
      >
        {isSubmitting ? "Starting…" : "Generate report"}
      </button>
    </form>
  );
}