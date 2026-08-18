import crypto from "node:crypto";
import { emitReportStatus } from "./report.events";

export type ReportStatus =
  | "extracting"
  | "analyzing"
  | "report_generated"
  | "pdf_generating"
  | "completed"
  | "failed";

export interface ReportRecord {
  id: string;
  companyName: string;
  originalFileName: string;

  status: {
    status: ReportStatus;
    message: string;
  };

  data?: unknown;
  pdfPath?: string;
  error?: string;
}

const reports = new Map<string, ReportRecord>();

export function createReport(
  companyName: string,
  originalFileName: string,
): ReportRecord {
  const report: ReportRecord = {
    id: crypto.randomUUID(),

    companyName,
    originalFileName,

    status: {
      status: "extracting",
      message: "Report queued",
    },
  };

  reports.set(report.id, report);

  return report;
}

export function findReportById(reportId: string): ReportRecord | undefined {
  return reports.get(reportId);
}

export function updateReportStatus(
  reportId: string,
  status: ReportStatus,
  message: string,
  error?: string,
): void {
  const report = reports.get(reportId);

  if (!report) {
    throw new Error(`Report ${reportId} not found`);
  }

  report.status = {
    status,
    message,
  };

  if (error) {
    report.error = error;
  }

  reports.set(reportId, report);

   emitReportStatus({
    reportId,
    status,
    currentStep: message,
    errorMessage: error ?? null,
  });
}

export function updateReportData(reportId: string, data: unknown): void {
  const report = reports.get(reportId);

  if (!report) {
    throw new Error(`Report ${reportId} not found`);
  }

  report.data = data;

  reports.set(reportId, report);
}

export function updateReportPdfPath(reportId: string, pdfPath: string): void {
  const report = reports.get(reportId);

  if (!report) {
    throw new Error(`Report ${reportId} not found`);
  }

  report.pdfPath = pdfPath;

  reports.set(reportId, report);
}
