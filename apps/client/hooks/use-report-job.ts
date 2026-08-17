"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import {
  createReport,
  getReport,
  getReportEventsUrl,
  type ReportStatus,
  type ReportStatusEvent,
} from "@/lib/reports-api";

interface ReportJobState {
  reportId: string | null;
  status: ReportStatus | null;
  currentStep: string;
  errorMessage: string | null;
  isSubmitting: boolean;
  isConnected: boolean;
}

const initialState: ReportJobState = {
  reportId: null,
  status: null,
  currentStep: "",
  errorMessage: null,
  isSubmitting: false,
  isConnected: false,
};

export function useReportJob() {
  const [state, setState] =
    useState(initialState);

  const eventSourceRef =
    useRef<EventSource | null>(
      null,
    );

  const closeConnection =
    useCallback(() => {
      eventSourceRef.current?.close();

      eventSourceRef.current = null;

      setState((current) => ({
        ...current,
        isConnected: false,
      }));
    }, []);

  const applyStatus =
    useCallback(
      (event: ReportStatusEvent) => {
        setState((current) => ({
          ...current,

          reportId:
            event.reportId,

          status:
            event.status,

          currentStep:
            event.currentStep,

          errorMessage:
            event.errorMessage ??
            null,

          isSubmitting: false,
        }));
      },
      [],
    );

  const connectToReport =
    useCallback(
      async (reportId: string) => {
        closeConnection();

        /*
         * Recover the persisted state first.
         *
         * This protects us if:
         *
         * - the browser reloads
         * - SSE connects late
         * - network temporarily disappears
         * - report processing already started
         */

        try {
          const response =
            await getReport(
              reportId,
            );

          applyStatus({
            reportId,
            status:
              response.data.status
                .status,
            currentStep:
              response.data.status
                .currentStep,
            errorMessage:
              response.data.status
                .errorMessage,
          });

          if (
            response.data.status
              .status ===
              "completed" ||
            response.data.status
              .status ===
              "failed"
          ) {
            return;
          }
        } catch (error) {
          setState((current) => ({
            ...current,

            errorMessage:
              error instanceof Error
                ? error.message
                : "Failed to retrieve report",
          }));

          return;
        }

        const source =
          new EventSource(
            getReportEventsUrl(
              reportId,
            ),
          );

        eventSourceRef.current =
          source;

        source.onopen = () => {
          setState((current) => ({
            ...current,
            isConnected: true,
          }));
        };

        source.addEventListener(
          "progress",
          (event) => {
            const data =
              JSON.parse(
                event.data,
              ) as ReportStatusEvent;

            applyStatus(data);
          },
        );

        source.addEventListener(
          "completed",
          (event) => {
            const data =
              JSON.parse(
                event.data,
              ) as ReportStatusEvent;

            applyStatus(data);

            source.close();

            eventSourceRef.current =
              null;

            setState((current) => ({
              ...current,
              isConnected: false,
            }));
          },
        );

        source.addEventListener(
          "failed",
          (event) => {
            const data =
              JSON.parse(
                event.data,
              ) as ReportStatusEvent;

            applyStatus(data);

            source.close();

            eventSourceRef.current =
              null;

            setState((current) => ({
              ...current,
              isConnected: false,
            }));
          },
        );

        source.onerror = () => {
          /*
           * Do NOT mark the report as failed.
           *
           * EventSource will try to reconnect.
           */
          setState((current) => ({
            ...current,
            isConnected: false,
          }));
        };
      },
      [
        applyStatus,
        closeConnection,
      ],
    );

  const startReport =
    useCallback(
      async (
        companyName: string,
        file: File,
      ) => {
        closeConnection();

        setState({
          ...initialState,
          isSubmitting: true,
        });

        try {
          const response =
            await createReport(
              companyName,
              file,
            );

          const reportId =
            response.data.reportId;

          setState((current) => ({
            ...current,

            reportId,

            status:
              response.data.status,

            currentStep:
              "Queued",

            isSubmitting: false,
          }));

          await connectToReport(
            reportId,
          );

          return reportId;
        } catch (error) {
          setState((current) => ({
            ...current,

            isSubmitting: false,

            errorMessage:
              error instanceof Error
                ? error.message
                : "Failed to create report",
          }));

          return null;
        }
      },
      [
        closeConnection,
        connectToReport,
      ],
    );

  useEffect(() => {
    return () => {
      eventSourceRef.current?.close();
    };
  }, []);

  return {
    ...state,
    startReport,
    connectToReport,
    closeConnection,
  };
}