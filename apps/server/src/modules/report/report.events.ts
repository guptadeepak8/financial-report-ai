import { EventEmitter } from "node:events";

import type { ReportStatus } from "./report.schema";

export interface ReportStatusEvent {
  reportId: string;

  status: ReportStatus;

  currentStep: string;

  errorMessage?: string | null;
}

const reportEventEmitter = new EventEmitter();

reportEventEmitter.setMaxListeners(1000);

export function emitReportStatus(event: ReportStatusEvent): void {
  reportEventEmitter.emit(`report:${event.reportId}`, event);
}

export function subscribeToReport(
  reportId: string,
  listener: (event: ReportStatusEvent) => void,
): () => void {
  const eventName = `report:${reportId}`;

  reportEventEmitter.on(eventName, listener);

  return () => {
    reportEventEmitter.off(eventName, listener);
  };
}
