const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api/v1";

export type ReportStatus =
  | "extracting"
  | "analyzing"
  | "report_generated"
  | "pdf_generating"
  | "completed"
  | "failed";

export interface ReportStatusEvent {
  reportId: string;
  status: ReportStatus;
  currentStep: string;
  errorMessage?: string | null;
}

export interface CreateReportResponse {
  success: boolean;

  data: {
    reportId: string;
    status: ReportStatus;
  };
}

export interface ReportResponse {
  success: boolean;

  data: {
    _id: string;
    companyName: string;
    originalFileName: string;

    status: {
      status: ReportStatus;
      currentStep: string;
      errorMessage?: string | null;
    };
  };
}

export async function createReport(
  companyName: string,
  file: File,
): Promise<CreateReportResponse> {
  const formData = new FormData();

  formData.append("companyName", companyName);

  formData.append("file", file);

  const response = await fetch(`${API_URL}/reports`, {
    method: "POST",
    body: formData,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.message ?? "Failed to create report");
  }

  return data;
}

export async function getReport(reportId: string): Promise<ReportResponse> {
  const response = await fetch(`${API_URL}/reports/${reportId}`, {
    cache: "no-store",
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.message ?? "Failed to retrieve report");
  }

  return data;
}

export function getReportEventsUrl(reportId: string): string {
  return `${API_URL}/reports/${reportId}/events`;
}

export function getReportPdfUrl(reportId: string): string {
  return `${API_URL}/reports/${reportId}/pdf`;
}
