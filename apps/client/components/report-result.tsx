import { getReportPdfUrl } from "@/lib/reports-api";
import Link from "next/link";

interface ReportResultProps {
  reportId: string | null;
  companyName: string;
}

export function ReportResult({ reportId, companyName }: ReportResultProps) {
  if (!reportId) return null;

  return (
    <section className="mt-5 overflow-hidden rounded-2xl border border-[#1f4e79]/15 bg-[#1f4e79] p-7 sm:p-9">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-mono-label text-[11px] font-semibold uppercase tracking-[0.14em] text-white/60">
            Report Ready
          </p>
          <h2 className="font-display mt-1.5 text-2xl text-white">
            {companyName}
          </h2>
          <p className="mt-1.5 text-sm text-white/70">
            Your equity research report has been generated.
          </p>
        </div>

      <Link
          href={getReportPdfUrl(reportId)}
          download
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-white px-5 py-3 text-sm font-semibold text-[#1f4e79] transition hover:bg-white/90"
        >
          Download PDF
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 3v12" />
            <path d="M7 12l5 5 5-5" />
            <path d="M4 21h16" />
          </svg>
        </Link>
      </div>
    </section>
  );
}