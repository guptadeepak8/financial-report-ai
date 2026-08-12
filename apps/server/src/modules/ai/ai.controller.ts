import type { Request, Response } from "express";

import { AppError } from "../../utils/app-error";
import { extractReport } from "./ai.service";

export async function extractReportFromDocument(
  req: Request,
  res: Response,
): Promise<void> {
  const { text, sourceFile, sourceType } = req.body;

  if (!text) {
    throw new AppError(
      "Document text is required",
      400,
      "DOCUMENT_TEXT_REQUIRED",
    );
  }

  const report = await extractReport(
    text,
    sourceFile ?? "unknown",
    sourceType ?? "txt",
  );

  res.status(200).json({
    success: true,
    data: report,
  });
}
