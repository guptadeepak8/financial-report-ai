
import { getReportPdfUrl } from "@/lib/reports-api";
import Link from "next/link";

interface ReportResultProps {
  reportId: string;
  companyName: string;
}

export function ReportResult({ reportId, companyName }: ReportResultProps) {
  return (
    <div className="flex flex-col items-start gap-6">
      <span className="rotate-3deg self-start rounded-sm bg-(--stamp-soft) px-2 py-1 font-mono-label text-[10px] font-bold uppercase tracking-[0.12em] text-(--stamp)">
        Report ready
      </span>

      <div>
        <p className="font-mono-label text-[10px] uppercase tracking-[0.14em] text-(--muted)">
          Stage 06 · Complete
        </p>
        <h2 className="font-display mt-1.5 text-3xl text-(--ink) sm:text-4xl">
          {companyName}
        </h2>
        <p className="mt-2 max-w-sm text-[15px] leading-relaxed text-(--muted)">
          Your equity research report has been assembled — tables, metrics, and
          narrative sections, ready to download.
        </p>
      </div>

      <Link
        href={getReportPdfUrl(reportId)}
        download
        className="inline-flex items-center gap-2 rounded-lg bg-(--ink-navy) px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-[#0f2438]"
      >
        Download PDF
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 3v12" />
          <path d="M7 12l5 5 5-5" />
          <path d="M4 21h16" />
        </svg>
      </Link>
    </div>
  );
}