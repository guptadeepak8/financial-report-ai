import type { Request, Response } from "express";

import { getReportById } from "./report.service";

function sendEvent(res: Response, event: string, data: unknown) {
  res.write(`event: ${event}\n` + `data: ${JSON.stringify(data)}\n\n`);
}

export async function reportEvents(req: Request, res: Response): Promise<void> {
  const reportId = req.params.id;

  res.setHeader("Content-Type", "text/event-stream");

  res.setHeader("Cache-Control", "no-cache, no-transform");

  res.setHeader("Connection", "keep-alive");

  res.setHeader("X-Accel-Buffering", "no");

  res.flushHeaders();

  let closed = false;

  const sendProgress = async () => {
    if (closed) {
      return;
    }

    try {
      const report = await getReportById(reportId);

      if (!report) {
        sendEvent(res, "error", {
          message: "Report not found",
        });

        res.end();

        return;
      }

      sendEvent(res, "progress", {
        reportId: report.id,

        status: report.status.status,

        progress: report.status.progress,

        currentStep: report.status.currentStep,
      });

      if (
        report.status.status === "completed" ||
        report.status.status === "failed"
      ) {
        sendEvent(res, report.status.status, {
          reportId: report.id,

          status: report.status.status,

          progress: report.status.progress,

          currentStep: report.status.currentStep,

          errorMessage: report.status.errorMessage ?? null,
        });

        res.end();
      }
    } catch (error) {
      console.error("SSE error:", error);

      sendEvent(res, "error", {
        message: "Failed to retrieve report progress",
      });

      res.end();
    }
  };

  await sendProgress();

  const interval = setInterval(() => {
    void sendProgress();
  }, 1000);

  req.on("close", () => {
    closed = true;

    clearInterval(interval);
  });
}
