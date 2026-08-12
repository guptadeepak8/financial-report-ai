import type { Request, Response } from "express";

import { AppError } from "../../utils/app-error";

import {
  createReportJob,
  getReportById,
  processReport,
} from "./report.service";

export async function createReport(req: Request, res: Response): Promise<void> {
    console.log("BODY:", req.body);
  console.log("FILE:", req.file);
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

  const report = await createReportJob(
    companyName.trim(),
    req.file.originalname,
  );

  void processReport(report.id, req.file.path, req.file.originalname);

  res.status(202).json({
    success: true,

    data: {
      reportId: report.id,

      status: report.status.status,
    },
  });
}

export async function getReport(req: Request, res: Response): Promise<void> {
  const reportId = req.params.id;

  if (!reportId) {
    throw new AppError("Report ID is required", 400, "REPORT_ID_REQUIRED");
  }

  const report = await getReportById(reportId);

  if (!report) {
    throw new AppError("Report not found", 404, "REPORT_NOT_FOUND");
  }

  res.json({
    success: true,

    data: report,
  });
}
