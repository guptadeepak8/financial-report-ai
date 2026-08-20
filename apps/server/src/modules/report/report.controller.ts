import type { Request, Response } from "express";

import fs from "node:fs/promises";
import path from "node:path";

import { AppError } from "../../utils/app-error";

import {
  createReportJob,
  getReportById,
  processReport,
} from "./report.service";
import { getRouteParam } from "../../utils/get-route-param";

export async function createReport(req: Request, res: Response): Promise<void> {
  const companyName = req.body.companyName;

  if (typeof companyName !== "string" || !companyName.trim()) {
    throw new AppError(
      "Company name is required",
      400,
      "COMPANY_NAME_REQUIRED",
    );
  }

  if (!req.file) {
    throw new AppError(
      "Financial document is required",
      400,
      "DOCUMENT_REQUIRED",
    );
  }

  const report = createReportJob(companyName.trim(), req.file.originalname);

  void processReport(report.id, req.file.path, req.file.originalname);

  res.status(202).json({
    success: true,

    data: {
      reportId: report.id,
      status: report.status.status,
      message: report.status.message,
    },
  });
}

export async function getReport(req: Request, res: Response): Promise<void> {
  const reportId = getRouteParam(req.params.id);

  if (!reportId) {
    throw new AppError("Report ID is required", 400, "REPORT_ID_REQUIRED");
  }

  const report = getReportById(reportId);

  if (!report) {
    throw new AppError("Report not found", 404, "REPORT_NOT_FOUND");
  }

  res.json({
    success: true,
    data: {
      reportId: report.id,
      companyName: report.companyName,
      status: report.status.status,
      message: report.status.message,
      error: report.error,
      downloadUrl:
        report.status.status === "completed"
          ? `/api/v1/reports/${report.id}/download`
          : undefined,
    },
  });
}

export async function downloadReport(
  req: Request,
  res: Response,
): Promise<void> {
  const reportId = getRouteParam(req.params.id);

  if (!reportId) {
    throw new AppError("Report ID is required", 400, "REPORT_ID_REQUIRED");
  }

  const report = getReportById(reportId);

  if (!report) {
    throw new AppError("Report not found", 404, "REPORT_NOT_FOUND");
  }

  if (report.status.status !== "completed") {
    throw new AppError("Report is not ready yet", 409, "REPORT_NOT_READY");
  }

  if (!report.pdfPath) {
    throw new AppError("Generated PDF not found", 404, "PDF_NOT_FOUND");
  }

  const pdfPath = path.resolve(report.pdfPath);

  try {
    await fs.access(pdfPath);
  } catch {
    throw new AppError(
      "Generated PDF file does not exist",
      404,
      "PDF_FILE_NOT_FOUND",
    );
  }

  res.download(pdfPath, `${report.companyName}-research-report.pdf`);
}
