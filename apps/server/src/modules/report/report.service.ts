import { z } from "zod";
import { gemini, getAvailableGeminiModel } from "../../lib/gemini";
import { AppError } from "../../utils/app-error";
import { parseDocument } from "../documents/document.service";
import { buildReportPrompt } from "./report.prompt";

import {
  createReport,
  findReportById,
  updateReportData,
  updateReportPdfPath,
  updateReportStatus,
} from "./report.repository";

import { aiReportSchema, type Report } from "./report.schema";
import { generateReportPdf } from "./pdf/report-pdf.service";

export async function extractReport(
  documentText: string,
  sourceFile: string,
  sourceType: "pdf" | "csv" | "txt",
): Promise<Report> {
  const model = await getAvailableGeminiModel();

  const prompt = buildReportPrompt(documentText, sourceFile, sourceType);

  try {
    const response = await gemini.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseJsonSchema: z.toJSONSchema(aiReportSchema),
      },
    });

    if (!response.text) {
      throw new AppError(
        "Gemini returned an empty response",
        502,
        "AI_EMPTY_RESPONSE",
      );
    }

    let parsed: unknown;

    try {
      parsed = JSON.parse(response.text);
    } catch {
      throw new AppError(
        "Gemini returned invalid JSON",
        502,
        "AI_INVALID_JSON",
      );
    }

    const result = aiReportSchema.safeParse(parsed);

    if (!result.success) {
      console.error(result.error);

      throw new AppError(
        "Gemini returned invalid report data",
        502,
        "AI_INVALID_RESPONSE",
      );
    }

    return {
      ...result.data,

      metadata: {
        sourceFile,
        sourceType,
        model,
        version: "1.0",
      },
    };
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }

    console.error("Report extraction failed:", error);

    throw new AppError(
      "Failed to generate financial report",
      502,
      "REPORT_GENERATION_FAILED",
    );
  }
}

export async function createReportJob(
  companyName: string,
  originalFileName: string,
) {
  return createReport({
    companyName,
    originalFileName,
  });
}

export async function getReportById(reportId: string) {
  return findReportById(reportId);
}

export async function processReport(
  reportId: string,
  filePath: string,
  originalFileName: string,
) {
  try {
    await updateReportStatus(
      reportId,
      "extracting",
      "Reading financial document",
    );

    const document = await parseDocument(filePath, originalFileName);

    await updateReportStatus(
      reportId,
      "analyzing",
      "Analyzing financial information with AI",
    );

    const report = await extractReport(
      document.text,
      document.fileName,
      document.fileType,
    );

    await updateReportStatus(
      reportId,
      "report_generated",
      "Financial research report generated",
    );

    await updateReportData(reportId, {
      company: report.company,
      recommendation: report.recommendation,
      summary: report.summary,
      companyData: report.companyData,
      sections: report.sections,
      tables: report.tables,
      charts: report.charts,
      metadata: report.metadata,
    });

    await updateReportStatus(
      reportId,
      "pdf_generating",
      "Generating PDF report",
    );

    // PDF generation.

    const pdfPath = await generateReportPdf(report, reportId);

    await updateReportPdfPath(reportId, pdfPath);

    await updateReportStatus(reportId, "completed", "Report ready");
  } catch (error) {
    console.error(`Report ${reportId} processing failed:`, error);

    await updateReportStatus(
      reportId,
      "failed",
      "Report generation failed",
      error instanceof Error ? error.message : "Unknown error",
    );
  }
}
