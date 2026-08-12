import type { Request, Response } from "express";

import { AppError } from "../../utils/app-error";

import { getReportById } from "./report.service";

import { subscribeToReport, type ReportStatusEvent } from "./report.events";

function sendEvent(res: Response, event: string, data: unknown): void {
  res.write(`event: ${event}\n` + `data: ${JSON.stringify(data)}\n\n`);
}

export async function reportEvents(req: Request, res: Response): Promise<void> {
  const reportId = req.params.id;

  if (!reportId) {
    throw new AppError("Report ID is required", 400, "REPORT_ID_REQUIRED");
  }

  res.setHeader("Content-Type", "text/event-stream");

  res.setHeader("Cache-Control", "no-cache, no-transform");

  res.setHeader("Connection", "keep-alive");

  res.setHeader("X-Accel-Buffering", "no");

  res.flushHeaders();

  let closed = false;

  const unsubscribe = subscribeToReport(
    reportId,
    (event: ReportStatusEvent) => {
      if (closed) {
        return;
      }

      sendEvent(res, "progress", {
        reportId: event.reportId,

        status: event.status,

        currentStep: event.currentStep,
      });

      if (event.status === "completed" || event.status === "failed") {
        sendEvent(res, event.status, {
          reportId: event.reportId,

          status: event.status,

          currentStep: event.currentStep,

          errorMessage: event.errorMessage ?? null,
        });

        closed = true;

        unsubscribe();

        res.end();
      }
    },
  );

  try {
    const report = await getReportById(reportId);

    if (!report) {
      closed = true;

      unsubscribe();

      sendEvent(res, "error", {
        message: "Report not found",
      });

      res.end();

      return;
    }

    // Send the latest persisted state immediately.
    // This allows the frontend to recover after
    // a reload or network reconnect.
    sendEvent(res, "progress", {
      reportId,

      status: report.status.status,

      currentStep: report.status.currentStep,
    });

    if (
      report.status.status === "completed" ||
      report.status.status === "failed"
    ) {
      sendEvent(res, report.status.status, {
        reportId,

        status: report.status.status,

        currentStep: report.status.currentStep,

        errorMessage: report.status.errorMessage ?? null,
      });

      closed = true;

      unsubscribe();

      res.end();

      return;
    }
  } catch (error) {
    closed = true;

    unsubscribe();

    console.error("SSE error:", error);

    sendEvent(res, "error", {
      message: "Failed to retrieve report status",
    });

    res.end();

    return;
  }

  req.on("close", () => {
    closed = true;

    unsubscribe();
  });
}
