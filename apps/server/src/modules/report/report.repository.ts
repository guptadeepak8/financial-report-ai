import { ReportModel } from "./report.model";

export type ReportStatus =
  | "queued"
  | "extracting"
  | "analyzing"
  | "report_generated"
  | "pdf_generating"
  | "completed"
  | "failed";

export async function createReport(data: {
  companyName: string;
  originalFileName: string;
}) {
  return ReportModel.create({
    companyName: data.companyName,

    originalFileName: data.originalFileName,

    status: {
      status: "queued",

      progress: 0,

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
) {
  return ReportModel.findByIdAndUpdate(
    reportId,
    {
      $set: {
        "status.status": status,
        "status.currentStep": currentStep,
      },
    },
    {
      returnDocument: "after",
    },
  ).lean();
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

export async function markReportFailed(reportId: string, errorMessage: string) {
  return ReportModel.findByIdAndUpdate(
    reportId,
    {
      $set: {
        "status.status": "failed",

        "status.currentStep": "Report generation failed",

        "status.errorMessage": errorMessage,
      },
    },
    {
     returnDocument: "after",
    },
  ).lean();
}
