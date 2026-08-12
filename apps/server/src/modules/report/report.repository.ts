import { ReportModel } from "./report.model";

import { emitReportStatus, type ReportStatusEvent } from "./report.events";
import type {ReportStatus} from "./report.schema";
export async function createReport(data: {
  companyName: string;
  originalFileName: string;
}) {
  return ReportModel.create({
    companyName: data.companyName,
    originalFileName: data.originalFileName,
    status: {
      status: "queued",
      currentStep: "Queued",
    },
  });
}

export async function findReportById(reportId: string) {
  return ReportModel.findById(reportId).lean();
}

export async function updateReportStatus(
  reportId: string,
  status: ReportStatus,
  currentStep: string,
  errorMessage?: string,
) {
  const report = await ReportModel.findByIdAndUpdate(
    reportId,
    {
      $set: {
        "status.status": status,
        "status.currentStep": currentStep,
        ...(errorMessage
          ? {
              "status.errorMessage": errorMessage,
            }
          : {}),
      },
    },

    {
      returnDocument: "after",
    },
  ).lean();

  if (!report) {
    return null;
  }

  const event: ReportStatusEvent = {
    reportId,
    status,
    currentStep,
    ...(errorMessage
      ? {
          errorMessage,
        }
      : {}),
  };

  emitReportStatus(event);

  return report;
}

export async function updateReportData(
  reportId: string,
  data: {
    company: unknown;
    recommendation: unknown;
    summary: unknown;
    companyData: unknown;
    sections: unknown[];
    tables: unknown[];
    charts: unknown[];
    metadata: unknown;
  },
) {
  return ReportModel.findByIdAndUpdate(
    reportId,
    {
      $set: data,
    },

    {
      returnDocument: "after",
    },
  ).lean();
}

export async function updateReportPdfPath(
  reportId: string,
  pdfPath: string,
) {
  return ReportModel.findByIdAndUpdate(
    reportId,
    {
      $set: {
        pdfPath,
      },
    },
    {
      returnDocument: "after",
    },
  ).lean();
}
