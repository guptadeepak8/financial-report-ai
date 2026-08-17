"use client";

import {
  type ChangeEvent,
  type FormEvent,
  useState,
} from "react";

interface ReportFormProps {
  isSubmitting: boolean;
  onSubmit: (
    companyName: string,
    file: File,
  ) => void;
}

export function ReportForm({
  isSubmitting,
  onSubmit,
}: ReportFormProps) {
  const [companyName, setCompanyName] =
    useState("");

  const [file, setFile] =
    useState<File | null>(null);

  function handleFileChange(
    event: ChangeEvent<HTMLInputElement>,
  ) {
    const selectedFile =
      event.target.files?.[0] ?? null;

    setFile(selectedFile);
  }

  function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (!companyName.trim()) {
      return;
    }

    if (!file) {
      return;
    }

    onSubmit(
      companyName.trim(),
      file,
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
    >
      <div className="space-y-6">

        <div>
          <label
            htmlFor="companyName"
            className="mb-2 block text-sm font-semibold text-slate-900"
          >
            Company name
          </label>

          <input
            id="companyName"
            type="text"
            value={companyName}
            onChange={(event) =>
              setCompanyName(
                event.target.value,
              )
            }
            placeholder="e.g. LTTS"
            disabled={isSubmitting}
            className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-100"
          />
        </div>

        <div>
          <label
            htmlFor="document"
            className="mb-2 block text-sm font-semibold text-slate-900"
          >
            Financial document
          </label>

          <input
            id="document"
            type="file"
            accept=".pdf,.csv,.txt"
            onChange={handleFileChange}
            disabled={isSubmitting}
            className="block w-full cursor-pointer rounded-lg border border-dashed border-slate-300 bg-slate-50 p-4 text-sm"
          />

          <p className="mt-2 text-xs text-slate-500">
            Supported formats: PDF, CSV,
            TXT. Maximum file size: 20 MB.
          </p>

          {file && (
            <div className="mt-3 rounded-lg bg-slate-50 px-4 py-3">
              <p className="truncate text-sm font-medium text-slate-700">
                {file.name}
              </p>

              <p className="mt-1 text-xs text-slate-500">
                {(file.size / 1024 / 1024).toFixed(
                  2,
                )}{" "}
                MB
              </p>
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={
            isSubmitting ||
            !companyName.trim() ||
            !file
          }
          className="w-full rounded-lg bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting
            ? "Creating report..."
            : "Generate Report"}
        </button>
      </div>
    </form>
  );
}