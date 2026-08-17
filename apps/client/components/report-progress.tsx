import type { ReportStatus } from "@/lib/reports-api";

interface ReportProgressProps {
  status: ReportStatus;
  currentStep: string;
  isConnected: boolean;
}

const steps: Array<{ status: ReportStatus; label: string }> = [
  { status: "queued", label: "Queued" },
  { status: "extracting", label: "Extracting document" },
  { status: "analyzing", label: "Analyzing financials" },
  { status: "report_generated", label: "Report generated" },
  { status: "pdf_generating", label: "Rendering PDF" },
  { status: "completed", label: "Ready" },
];

export function ReportProgress({
  status,
  currentStep,
  isConnected,
}: ReportProgressProps) {
  const currentIndex = steps.findIndex((step) => step.status === status);

  return (
    <section className="mt-5 rounded-2xl border border-[#e2e5ea] bg-white p-7 shadow-[0_1px_2px_rgba(20,23,28,0.04)] sm:p-9">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-mono-label text-[11px] font-semibold uppercase tracking-[0.1em] text-[#5b6470]">
            Generating
          </p>
          <h2 className="font-display mt-1.5 text-xl text-[#14171c]">
            {currentStep}
          </h2>
        </div>

        <span
          className={[
            "font-mono-label flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide",
            isConnected
              ? "bg-emerald-50 text-emerald-700"
              : "bg-[#f2f3f5] text-[#9aa2ac]",
          ].join(" ")}
        >
          <span
            className={[
              "h-1.5 w-1.5 rounded-full",
              isConnected ? "bg-emerald-500" : "bg-[#c3c9d1]",
            ].join(" ")}
          />
          {isConnected ? "Live" : "Connecting"}
        </span>
      </div>

      <div className="mt-7 space-y-0">
        {steps.map((step, index) => {
          const completed = currentIndex > index;
          const current = currentIndex === index;

          return (
            <div key={step.status} className="flex gap-3">
              <div className="flex flex-col items-center">
                <div
                  className={[
                    "flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-[10px] font-bold transition",
                    completed
                      ? "border-[#1f4e79] bg-[#1f4e79] text-white"
                      : current
                        ? "border-[#1f4e79] text-[#1f4e79]"
                        : "border-[#dde1e6] text-[#c3c9d1]",
                  ].join(" ")}
                >
                  {completed ? "✓" : index + 1}
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={[
                      "my-0.5 w-px flex-1",
                      completed ? "bg-[#1f4e79]" : "bg-[#e2e5ea]",
                    ].join(" ")}
                    style={{ minHeight: "18px" }}
                  />
                )}
              </div>

              <span
                className={[
                  "pb-4 text-sm",
                  completed
                    ? "text-[#5b6470]"
                    : current
                      ? "font-semibold text-[#14171c]"
                      : "text-[#c3c9d1]",
                ].join(" ")}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
}