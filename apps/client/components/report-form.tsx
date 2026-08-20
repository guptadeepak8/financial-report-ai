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
      <h2 className="font-display text-2xl text-white sm:text-[1.75rem]">
        Start a new report
      </h2>

      <div>
        <label htmlFor="companyName" className="mb-2 block text-sm font-medium text-white">
          Company name
        </label>
        <input
          id="companyName"
          type="text"
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
          placeholder="e.g. LTTS"
          disabled={isSubmitting}
          className="w-full border-0 border-b-2 border-white/20 bg-transparent px-0.5 py-2.5 text-[15px] text-white outline-none transition placeholder:text-gray-600 focus:border-white disabled:opacity-50"
        />
      </div>

      <div>
        <label htmlFor="document" className="mb-2 block text-sm font-medium text-white">
          Financial document
        </label>

        <label
          htmlFor="document"
          className="flex cursor-pointer items-center justify-between gap-4 rounded-lg border border-dashed border-white/30 bg-white/5 px-4 py-3.5 transition hover:border-white"
        >
          <span className="text-sm text-gray-400">
            {file ? "Replace file" : "Choose PDF, CSV, or TXT"}
          </span>
          <span className="text-xs font-medium text-white">Browse</span>
        </label>
        <input
          id="document"
          type="file"
          accept=".pdf,.csv,.txt"
          onChange={handleFileChange}
          disabled={isSubmitting}
          className="hidden"
        />

        <p className="mt-2 text-xs text-gray-500">Max file size 20 MB.</p>

        {file && (
          <div className="mt-3 flex items-center justify-between gap-3 border-t border-white/20 pt-3">
            <span className="truncate text-xs text-white">{file.name}</span>
            <span className="shrink-0 text-xs text-gray-500">Attached</span>
          </div>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting || !companyName.trim() || !file}
        className="mt-2 w-full rounded-lg bg-white px-5 py-3.5 text-sm font-medium text-black transition hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-30"
      >
        {isSubmitting ? "Starting…" : "Generate report"}
      </button>
    </form>
  );
}