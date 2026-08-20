import { getReportPdfUrl } from "@/lib/reports-api";
import Link from "next/link";

interface ReportResultProps {
  reportId: string;
  companyName: string;
}

export function ReportResult({ reportId, companyName }: ReportResultProps) {
  return (
    <div className="flex flex-col items-start gap-6">
      <span className="text-xs font-medium text-gray-500">Report ready</span>

      <h2 className="font-display text-3xl text-white sm:text-4xl">{companyName}</h2>

      <Link
        href={getReportPdfUrl(reportId)}
        download
        className="inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3.5 text-sm font-medium text-black transition hover:bg-gray-200"
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