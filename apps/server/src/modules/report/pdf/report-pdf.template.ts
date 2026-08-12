import type { Report } from "../report.schema";
import { reportPdfStyles } from "./report-pdf.styles";

/* -------------------------------------------------------------------------- */
/* Utilities                                                                  */
/* -------------------------------------------------------------------------- */

function escapeHtml(value: unknown): string {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function formatValue(value: unknown): string {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return "—";
  }

  return escapeHtml(value);
}

function isNumericValue(value: unknown): boolean {
  if (typeof value === "number") {
    return Number.isFinite(value);
  }

  if (typeof value !== "string") {
    return false;
  }

  const normalized = value
    .replaceAll(",", "")
    .replace("%", "")
    .trim();

  if (!normalized) {
    return false;
  }

  return Number.isFinite(Number(normalized));
}

function toNumber(value: unknown): number | null {
  if (typeof value === "number") {
    return Number.isFinite(value)
      ? value
      : null;
  }

  if (typeof value !== "string") {
    return null;
  }

  const normalized = value
    .replaceAll(",", "")
    .replace("%", "")
    .trim();

  const parsed = Number(normalized);

  return Number.isFinite(parsed)
    ? parsed
    : null;
}

/**
 * Finds the latest actual reporting-period column.
 *
 * Example:
 *
 * Q2 FY25
 * Q1 FY26
 * Q2 FY26
 * QoQ Growth
 * YoY Growth
 *
 * We don't want the growth columns.
 */
function getLatestValueIndex(
  table: Report["tables"][number],
): number {
  const columns = table.columns.slice(1);

  for (
    let index = columns.length - 1;
    index >= 0;
    index--
  ) {
    const label =
      columns[index]?.label
        .toLowerCase()
        .trim() ?? "";

    if (
      label.includes("growth") ||
      label.includes("qoq") ||
      label.includes("yoy") ||
      label.includes("change")
    ) {
      continue;
    }

    return index;
  }

  return Math.max(columns.length - 1, 0);
}

/* -------------------------------------------------------------------------- */
/* Section title                                                              */
/* -------------------------------------------------------------------------- */

function renderSectionTitle(
  number: number,
  title: string,
): string {
  return `
    <div class="section-title">
      <span>
        ${String(number).padStart(2, "0")}
      </span>

      ${formatValue(title)}
    </div>
  `;
}

/* -------------------------------------------------------------------------- */
/* Header                                                                     */
/* -------------------------------------------------------------------------- */

function renderHeader(
  report: Report,
): string {
  const { company } = report;

  return `
    <header class="report-header">

      <div class="eyebrow">
        EQUITY RESEARCH
      </div>

      <div class="header-main">

        <div>

          <h1>
            ${formatValue(company.name)}
          </h1>

          <div class="company-meta">

            ${formatValue(company.sector)}

            ${
              company.industry
                ? ` · ${formatValue(company.industry)}`
                : ""
            }

            ${
              company.exchange
                ? ` · ${formatValue(company.exchange)}`
                : ""
            }

            ${
              company.ticker
                ? ` · ${formatValue(company.ticker)}`
                : ""
            }

          </div>

        </div>

        <div class="report-info">

          <div>
            <span>Report Type</span>

            <strong>
              ${formatValue(
                company.reportType,
              )}
            </strong>
          </div>

          <div>
            <span>Report Date</span>

            <strong>
              ${formatValue(
                company.reportDate,
              )}
            </strong>
          </div>

        </div>

      </div>

    </header>
  `;
}

/* -------------------------------------------------------------------------- */
/* Recommendation                                                             */
/* -------------------------------------------------------------------------- */

function renderRecommendation(
  report: Report,
): string {
  const recommendation =
    report.recommendation;

  if (!recommendation) {
    return "";
  }

  return `
    <section class="recommendation-card">

      <div class="recommendation-rating">

        <span>
          Recommendation
        </span>

        <strong>
          ${formatValue(
            recommendation.rating,
          )}
        </strong>

      </div>

      <div>
        <span>Current Price</span>

        <strong>
          ${formatValue(
            recommendation.currentPrice,
          )}
        </strong>
      </div>

      <div>
        <span>Target Price</span>

        <strong>
          ${formatValue(
            recommendation.targetPrice,
          )}
        </strong>
      </div>

      <div>
        <span>Expected Return</span>

        <strong>
          ${formatValue(
            recommendation.expectedReturn,
          )}
        </strong>
      </div>

      <div>
        <span>Timeframe</span>

        <strong>
          ${formatValue(
            recommendation.timeframe,
          )}
        </strong>
      </div>

    </section>
  `;
}

/* -------------------------------------------------------------------------- */
/* KPI cards                                                                  */
/* -------------------------------------------------------------------------- */

function renderKpis(
  report: Report,
): string {
  const incomeStatement =
    report.tables.find(
      (table) =>
        table.category ===
        "income-statement",
    );

  if (!incomeStatement) {
    return "";
  }

  const findRow = (
    label: string,
  ) =>
    incomeStatement.rows.find(
      (row) =>
        row.label
          .toLowerCase()
          .trim() ===
        label.toLowerCase(),
    );

  const revenue =
    findRow("Revenue");

  const netIncome =
    findRow("Net Income");

  const ebitMargin =
    findRow("EBIT Margin (%)");

  const latestIndex =
    getLatestValueIndex(
      incomeStatement,
    );

  const latestPeriod =
    incomeStatement.columns[
      latestIndex + 1
    ]?.label ?? "Latest";

  return `
    <section class="kpi-grid">

      <div class="kpi-card">

        <span>
          Revenue
        </span>

        <strong>
          ${formatValue(
            revenue?.values[
              latestIndex
            ],
          )}
        </strong>

        <small>
          ${formatValue(
            latestPeriod,
          )}
          ${
            report.company.currency
              ? ` · ${formatValue(
                  report.company.currency,
                )}`
              : ""
          }
        </small>

      </div>

      <div class="kpi-card">

        <span>
          Net Income
        </span>

        <strong>
          ${formatValue(
            netIncome?.values[
              latestIndex
            ],
          )}
        </strong>

        <small>
          ${formatValue(
            latestPeriod,
          )}
        </small>

      </div>

      <div class="kpi-card">

        <span>
          EBIT Margin
        </span>

        <strong>
          ${formatValue(
            ebitMargin?.values[
              latestIndex
            ],
          )}
        </strong>

        <small>
          ${formatValue(
            latestPeriod,
          )}
        </small>

      </div>

      <div class="kpi-card">

        <span>
          Financial Tables
        </span>

        <strong>
          ${report.tables.length}
        </strong>

        <small>
          Extracted
        </small>

      </div>

    </section>
  `;
}

/* -------------------------------------------------------------------------- */
/* Executive summary                                                          */
/* -------------------------------------------------------------------------- */

function renderSummary(
  report: Report,
  sectionNumber: number,
): string {
  return `
    <section class="section">

      ${renderSectionTitle(
        sectionNumber,
        "Executive Summary",
      )}

      <h2 class="summary-headline">
        ${formatValue(
          report.summary.headline,
        )}
      </h2>

      <p class="lead">
        ${formatValue(
          report.summary.overview,
        )}
      </p>

      ${
        report.summary
          .bulletPoints.length
          ? `
            <div class="highlights">

              ${report.summary.bulletPoints
                .map(
                  (point) => `
                    <div class="highlight">

                      <span
                        class="highlight-marker"
                      ></span>

                      <span>
                        ${formatValue(
                          point,
                        )}
                      </span>

                    </div>
                  `,
                )
                .join("")}

            </div>
          `
          : ""
      }

    </section>
  `;
}

/* -------------------------------------------------------------------------- */
/* Company snapshot                                                           */
/* -------------------------------------------------------------------------- */

function renderCompanySnapshot(
  report: Report,
  sectionNumber: number,
): string {
  if (!report.companyData) {
    return "";
  }

  const data =
    report.companyData;

  const metrics = [
    ["Market Cap", data.marketCap],
    [
      "Enterprise Value",
      data.enterpriseValue,
    ],
    [
      "Outstanding Shares",
      data.outstandingShares,
    ],
    ["Free Float", data.freeFloat],
    [
      "Dividend Yield",
      data.dividendYield,
    ],
    ["Beta", data.beta],
    ["Face Value", data.faceValue],
    [
      "52W High",
      data.fiftyTwoWeekHigh,
    ],
    [
      "52W Low",
      data.fiftyTwoWeekLow,
    ],
  ];

  return `
    <section class="section">

      ${renderSectionTitle(
        sectionNumber,
        "Company Snapshot",
      )}

      <div class="metrics-grid">

        ${metrics
          .map(
            ([label, value]) => `
              <div class="metric">

                <span>
                  ${escapeHtml(label)}
                </span>

                <strong>
                  ${formatValue(value)}
                </strong>

              </div>
            `,
          )
          .join("")}

      </div>

    </section>
  `;
}

/* -------------------------------------------------------------------------- */
/* Narrative sections                                                         */
/* -------------------------------------------------------------------------- */

function renderSections(
  report: Report,
  startSectionNumber: number,
): string {
  if (!report.sections.length) {
    return "";
  }

  return report.sections
    .slice()
    .sort(
      (a, b) =>
        a.order - b.order,
    )
    .map(
      (section, index) => `
        <section
          class="section narrative-section"
        >

          ${renderSectionTitle(
            startSectionNumber + index,
            section.title,
          )}

          <div class="narrative-content">
            ${formatValue(
              section.content,
            )}
          </div>

        </section>
      `,
    )
    .join("");
}

/* -------------------------------------------------------------------------- */
/* Tables                                                                     */
/* -------------------------------------------------------------------------- */

function renderTable(
  table: Report["tables"][number],
  sectionNumber: number,
): string {
  if (
    !table.columns.length ||
    !table.rows.length
  ) {
    return "";
  }

  const valueColumnCount =
    table.columns.length - 1;

  return `
    <section
      class="section table-section"
    >

      ${renderSectionTitle(
        sectionNumber,
        table.title,
      )}

      <div class="table-wrapper">

        <table class="financial-table">

          <thead>

            <tr>

              ${table.columns
                .map(
                  (column, index) => `
                    <th
                      class="${
                        index === 0
                          ? "label-column"
                          : "value-column"
                      }"
                    >
                      ${formatValue(
                        column.label,
                      )}
                    </th>
                  `,
                )
                .join("")}

            </tr>

          </thead>

          <tbody>

            ${table.rows
              .map((row) => {
                const values =
                  Array.from(
                    {
                      length:
                        valueColumnCount,
                    },
                    (_, index) =>
                      row.values[
                        index
                      ] ?? null,
                  );

                return `
                  <tr>

                    <td class="row-label">
                      ${formatValue(
                        row.label,
                      )}
                    </td>

                    ${values
                      .map(
                        (value) => `
                          <td
                            class="numeric-cell"
                          >
                            ${formatValue(
                              value,
                            )}
                          </td>
                        `,
                      )
                      .join("")}

                  </tr>
                `;
              })
              .join("")}

          </tbody>

        </table>

      </div>

    </section>
  `;
}

/* -------------------------------------------------------------------------- */
/* Bar chart                                                                  */
/* -------------------------------------------------------------------------- */

function renderBarChart(
  chart: Report["charts"][number],
): string {
  const dataset =
    chart.datasets[0];

  if (
    !dataset ||
    !dataset.data.length
  ) {
    return "";
  }

  const values =
    dataset.data.map(
      (value) =>
        Number.isFinite(value)
          ? value
          : 0,
    );

  const max = Math.max(
    ...values.map((value) =>
      Math.abs(value),
    ),
    1,
  );

  const width = 700;
  const height = 260;

  const left = 60;
  const right = 20;
  const top = 30;
  const bottom = 55;

  const chartWidth =
    width - left - right;

  const chartHeight =
    height - top - bottom;

  const slotWidth =
    chartWidth / values.length;

  const barWidth = Math.min(
    slotWidth * 0.55,
    70,
  );

  const bars = values
    .map((value, index) => {
      const barHeight =
        (Math.abs(value) / max) *
        chartHeight;

      const x =
        left +
        index * slotWidth +
        (slotWidth -
          barWidth) /
          2;

      const y =
        top +
        chartHeight -
        barHeight;

      const label =
        chart.labels[index] ??
        "";

      return `
        <rect
          x="${x}"
          y="${y}"
          width="${barWidth}"
          height="${barHeight}"
          rx="3"
          class="chart-bar"
        />

        <text
          x="${x + barWidth / 2}"
          y="${Math.max(y - 8, 12)}"
          text-anchor="middle"
          class="chart-value"
        >
          ${formatValue(value)}
        </text>

        <text
          x="${x + barWidth / 2}"
          y="${height - 20}"
          text-anchor="middle"
          class="chart-label"
        >
          ${formatValue(label)}
        </text>
      `;
    })
    .join("");

  return `
    <div class="chart-card">

      <div class="chart-card-title">
        ${formatValue(chart.title)}
      </div>

      <svg
        viewBox="0 0 ${width} ${height}"
        class="chart-svg"
      >

        <line
          x1="${left}"
          y1="${top}"
          x2="${left}"
          y2="${height - bottom}"
          class="chart-axis"
        />

        <line
          x1="${left}"
          y1="${height - bottom}"
          x2="${width - right}"
          y2="${height - bottom}"
          class="chart-axis"
        />

        ${bars}

      </svg>

    </div>
  `;
}

/* -------------------------------------------------------------------------- */
/* Line chart                                                                 */
/* -------------------------------------------------------------------------- */

function renderLineChart(
  chart: Report["charts"][number],
): string {
  const dataset =
    chart.datasets[0];

  if (
    !dataset ||
    dataset.data.length < 2
  ) {
    return "";
  }

  const values =
    dataset.data.map(
      (value) =>
        Number.isFinite(value)
          ? value
          : 0,
    );

  const width = 700;
  const height = 260;

  const left = 55;
  const right = 25;
  const top = 30;
  const bottom = 55;

  const chartWidth =
    width - left - right;

  const chartHeight =
    height - top - bottom;

  const min = Math.min(
    ...values,
  );

  const max = Math.max(
    ...values,
  );

  const range =
    max - min || 1;

  const points = values
    .map((value, index) => {
      const x =
        left +
        (index /
          (values.length - 1)) *
          chartWidth;

      const y =
        top +
        chartHeight -
        ((value - min) /
          range) *
          chartHeight;

      return {
        x,
        y,
        value,
        label:
          chart.labels[index] ??
          "",
      };
    });

  const path = points
    .map(
      (point, index) =>
        `${
          index === 0
            ? "M"
            : "L"
        } ${point.x} ${point.y}`,
    )
    .join(" ");

  const pointsMarkup =
    points
      .map(
        (point) => `
          <circle
            cx="${point.x}"
            cy="${point.y}"
            r="4"
            class="chart-point"
          />

          <text
            x="${point.x}"
            y="${point.y - 10}"
            text-anchor="middle"
            class="chart-value"
          >
            ${formatValue(
              point.value,
            )}
          </text>

          <text
            x="${point.x}"
            y="${height - 20}"
            text-anchor="middle"
            class="chart-label"
          >
            ${formatValue(
              point.label,
            )}
          </text>
        `,
      )
      .join("");

  return `
    <div class="chart-card">

      <div class="chart-card-title">
        ${formatValue(chart.title)}
      </div>

      <svg
        viewBox="0 0 ${width} ${height}"
        class="chart-svg"
      >

        <line
          x1="${left}"
          y1="${top}"
          x2="${left}"
          y2="${height - bottom}"
          class="chart-axis"
        />

        <line
          x1="${left}"
          y1="${height - bottom}"
          x2="${width - right}"
          y2="${height - bottom}"
          class="chart-axis"
        />

        <path
          d="${path}"
          fill="none"
          class="chart-line"
        />

        ${pointsMarkup}

      </svg>

    </div>
  `;
}

/* -------------------------------------------------------------------------- */
/* Pie / Doughnut chart                                                       */
/* -------------------------------------------------------------------------- */

function renderPieChart(
  chart: Report["charts"][number],
): string {
  const dataset =
    chart.datasets[0];

  if (
    !dataset ||
    !dataset.data.length
  ) {
    return "";
  }

  const values =
    dataset.data.map(
      (value) =>
        Math.max(
          Number.isFinite(value)
            ? value
            : 0,
          0,
        ),
    );

  const total =
    values.reduce(
      (sum, value) =>
        sum + value,
      0,
    );

  if (total <= 0) {
    return "";
  }

  const cx = 140;
  const cy = 130;
  const radius = 90;

  const colors = [
    "#1f4e79",
    "#2f638f",
    "#5d86a8",
    "#8aa8bd",
    "#b5c7d3",
    "#d8e2e8",
  ];

  let currentAngle =
    -Math.PI / 2;

  const slices = values
    .map((value, index) => {
      const angle =
        (value / total) *
        Math.PI *
        2;

      const startAngle =
        currentAngle;

      const endAngle =
        currentAngle + angle;

      currentAngle =
        endAngle;

      const x1 =
        cx +
        radius *
          Math.cos(
            startAngle,
          );

      const y1 =
        cy +
        radius *
          Math.sin(
            startAngle,
          );

      const x2 =
        cx +
        radius *
          Math.cos(
            endAngle,
          );

      const y2 =
        cy +
        radius *
          Math.sin(
            endAngle,
          );

      const largeArc =
        angle > Math.PI
          ? 1
          : 0;

      const path = `
        M ${cx} ${cy}
        L ${x1} ${y1}
        A ${radius} ${radius}
          0 ${largeArc} 1
          ${x2} ${y2}
        Z
      `;

      const label =
        chart.labels[index] ??
        "";

      const color =
        dataset.color ??
        colors[
          index %
            colors.length
        ];

      return `
        <path
          d="${path}"
          fill="${color}"
          class="pie-slice"
        />

        <text
          x="300"
          y="${45 + index * 25}"
          class="chart-label"
        >
          ${formatValue(label)}
          —
          ${formatValue(value)}
        </text>
      `;
    })
    .join("");

  const center =
    chart.type ===
    "doughnut"
      ? `
        <circle
          cx="${cx}"
          cy="${cy}"
          r="48"
          fill="white"
        />
      `
      : "";

  return `
    <div class="chart-card">

      <div class="chart-card-title">
        ${formatValue(chart.title)}
      </div>

      <svg
        viewBox="0 0 620 260"
        class="chart-svg"
      >

        ${slices}

        ${center}

      </svg>

    </div>
  `;
}

/* -------------------------------------------------------------------------- */
/* Generic chart dispatcher                                                   */
/* -------------------------------------------------------------------------- */

function renderChart(
  chart: Report["charts"][number],
): string {
  switch (chart.type) {
    case "bar":
      return renderBarChart(
        chart,
      );

    case "line":
      return renderLineChart(
        chart,
      );

    case "pie":
    case "doughnut":
      return renderPieChart(
        chart,
      );

    case "area":
      return renderLineChart(
        chart,
      );

    default:
      return "";
  }
}

/* -------------------------------------------------------------------------- */
/* Charts section                                                             */
/* -------------------------------------------------------------------------- */

function renderCharts(
  report: Report,
  sectionNumber: number,
): string {
  const renderedCharts =
    report.charts
      .map(renderChart)
      .filter(
        (chart) =>
          chart.length > 0,
      );

  if (!renderedCharts.length) {
    return "";
  }

  return `
    <section
      class="section chart-section"
    >

      ${renderSectionTitle(
        sectionNumber,
        "Financial Trends",
      )}

      <div class="charts-grid">

        ${renderedCharts.join("")}

      </div>

    </section>
  `;
}

/* -------------------------------------------------------------------------- */
/* Footer                                                                     */
/* -------------------------------------------------------------------------- */

function renderFooter(
  report: Report,
): string {
  return `
    <footer class="report-footer">

      <span>
        Source:
        ${formatValue(
          report.metadata.sourceFile,
        )}
      </span>

      <span>
        Generated:
        ${new Date().toISOString()}
      </span>

    </footer>
  `;
}

/* -------------------------------------------------------------------------- */
/* Main document renderer                                                     */
/* -------------------------------------------------------------------------- */

export function buildReportHtml(
  report: Report,
): string {
  /*
   * We calculate section numbers here.
   *
   * This prevents:
   *
   * 01 Executive Summary
   * 02 Company Snapshot
   * 04 Executive Summary
   * 05 Investment Thesis
   * 05 Income Statement
   *
   * from happening.
   */

  let nextSectionNumber = 1;

  const summarySectionNumber =
    nextSectionNumber++;

  const companySnapshotSectionNumber =
    report.companyData
      ? nextSectionNumber++
      : null;

  const narrativeStartNumber =
    nextSectionNumber;

  nextSectionNumber +=
    report.sections.length;

  const tableStartNumber =
    nextSectionNumber;

  nextSectionNumber +=
    report.tables.length;

  const chartsSectionNumber =
    report.charts.length
      ? nextSectionNumber++
      : null;

  return `
    <!DOCTYPE html>

    <html lang="en">

      <head>

        <meta charset="UTF-8" />

        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0"
        />

        <title>
          ${formatValue(
            report.company.name,
          )}
          Research Report
        </title>

        <style>
          ${reportPdfStyles}
        </style>

      </head>

      <body>

        <main class="report">

          ${renderHeader(report)}

          ${renderRecommendation(report)}

          ${renderKpis(report)}

          ${renderSummary(
            report,
            summarySectionNumber,
          )}

          ${
            companySnapshotSectionNumber
              ? renderCompanySnapshot(
                  report,
                  companySnapshotSectionNumber,
                )
              : ""
          }

          ${renderSections(
            report,
            narrativeStartNumber,
          )}

          ${report.tables
            .map(
              (table, index) =>
                renderTable(
                  table,
                  tableStartNumber +
                    index,
                ),
            )
            .join("")}

          ${
            chartsSectionNumber
              ? renderCharts(
                  report,
                  chartsSectionNumber,
                )
              : ""
          }

          ${renderFooter(report)}

        </main>

      </body>

    </html>
  `;
}