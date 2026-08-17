import type { Report } from "../report.schema";
import { reportPdfStyles } from "./report-pdf.styles";
import {
  escapeHtml,
  formatValue,
  formatPercentValue,
  formatCurrencyValue,
  normalizeLabel,
  isPercentColumnLabel,
  getLatestValueIndex,
  companySnapshotHasDisplayableData,
  SECTION_TYPE_TITLES,
} from "./report-pdf.formatters";



function renderSectionTitle(number: number, title: string): string {
  return `
    <div class="section-title">
      <span>
        ${String(number).padStart(2, "0")}
      </span>

      ${formatValue(title)}
    </div>
  `;
}

function renderHeader(report: Report): string {
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
            ${company.industry ? ` · ${formatValue(company.industry)}` : ""}
            ${company.exchange ? ` · ${formatValue(company.exchange)}` : ""}
            ${company.ticker ? ` · ${formatValue(company.ticker)}` : ""}
          </div>
        </div>
        <div class="report-info">
          <div>
            <span>Report Type</span>
            <strong>
              ${formatValue(company.reportType)}
            </strong>
          </div>
          <div>
            <span>Report Date</span>
            <strong>
              ${formatValue(company.reportDate)}
            </strong>
          </div>
        </div>
      </div>
    </header>
  `;
}

function renderRecommendation(report: Report): string {
  const recommendation = report.recommendation;
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
          ${formatValue(recommendation.rating)}
        </strong>
      </div>
      <div>
        <span>Current Price</span>
        <strong>
          ${formatValue(recommendation.currentPrice)}
        </strong>
      </div>
      <div>
        <span>Target Price</span>
        <strong>
          ${formatValue(recommendation.targetPrice)}
        </strong>
      </div>
      <div>
        <span>Expected Return</span>
        <strong>
          ${formatValue(recommendation.expectedReturn)}
        </strong>
      </div>
      <div>
        <span>Timeframe</span>
        <strong>
          ${formatValue(recommendation.timeframe)}
        </strong>
      </div>
    </section>
  `;
}


const DISPLAYED_COMPANY_DATA_KEYS = [
  "marketCap",
  "enterpriseValue",
  "outstandingShares",
  "freeFloat",
  "dividendYield",
  "beta",
  "faceValue",
  "fiftyTwoWeekHigh",
  "fiftyTwoWeekLow",
] as const;


function renderKpis(report: Report): string {
  const incomeStatement = report.tables.find(
    (table) => table.category === "income-statement",
  );
  if (!incomeStatement) {
    return "";
  }
  const findRow = (label: string) => {
    const target = normalizeLabel(label);
    return incomeStatement.rows.find(
      (row) => normalizeLabel(row.label) === target,
    );
  };

  const revenue = findRow("Revenue");
  const netIncome = findRow("Net Income");
  const ebitMargin = findRow("EBIT Margin (%)");
  const latestIndex = getLatestValueIndex(incomeStatement);
  const latestPeriod =
    incomeStatement.columns[latestIndex + 1]?.label ?? "Latest";

  return `
    <section class="kpi-grid">
      <div class="kpi-card">
        <span>
          Revenue
        </span>
        <strong>
          ${formatCurrencyValue(revenue?.values[latestIndex])}
        </strong>
        <small>
          ${formatValue(latestPeriod)}
          ${
            report.company.currency
              ? ` · ${formatValue(report.company.currency)}`
              : ""
          }
        </small>
      </div>
      <div class="kpi-card">
        <span>
          Net Income
        </span>
        <strong>
          ${formatCurrencyValue(netIncome?.values[latestIndex])}
        </strong>
        <small>
          ${formatValue(latestPeriod)}
        </small>
      </div>
      <div class="kpi-card">
        <span>
          EBIT Margin
        </span>
        <strong>
          ${formatPercentValue(ebitMargin?.values[latestIndex])}
        </strong>
        <small>
          ${formatValue(latestPeriod)}
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

function renderSummary(report: Report, sectionNumber: number): string {
  return `
    <section class="section">
      ${renderSectionTitle(sectionNumber, "Executive Summary")}
      <h2 class="summary-headline">
        ${formatValue(report.summary.headline)}
      </h2>
      <p class="lead">
        ${formatValue(report.summary.overview)}
      </p>
      ${
        report.summary.bulletPoints.length
          ? `
            <div class="highlights">
              ${report.summary.bulletPoints
                .map(
                  (point) => `
                    <div class="highlight">
                      <span class="highlight-marker"></span>
                      <span>
                        ${formatValue(point)}
                      </span>
                    </div>`,
                )
                .join("")}
            </div>`
          : ""
      }
    </section>
  `;
}

function renderCompanySnapshot(report: Report, sectionNumber: number): string {
  if (!report.companyData) {
    return "";
  }

  const data = report.companyData;

  const metrics = [
    ["Market Cap", data.marketCap],
    ["Enterprise Value", data.enterpriseValue],
    ["Outstanding Shares", data.outstandingShares],
    ["Free Float", data.freeFloat],
    ["Dividend Yield", data.dividendYield],
    ["Beta", data.beta],
    ["Face Value", data.faceValue],
    ["52W High", data.fiftyTwoWeekHigh],
    ["52W Low", data.fiftyTwoWeekLow],
  ];

  const hasAnyValue = companySnapshotHasDisplayableData(report.companyData);

  if (!hasAnyValue) {
    return "";
  }

  return `
    <section class="section">
      ${renderSectionTitle(sectionNumber, "Company Snapshot")}
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
function getDedupedSections(report: Report): Report["sections"] {
  const seenTypes = new Set<string>();

  return report.sections
    .slice()
    .sort((a, b) => a.order - b.order)
    .filter((section) => {
      if (section.type === "executive-summary") {
        return false;
      }

      if (section.type === "custom") {
        return true;
      }

      if (seenTypes.has(section.type)) {
        return false;
      }

      seenTypes.add(section.type);
      return true;
    });
}

function renderSections(report: Report, startSectionNumber: number): string {
  const deduped = getDedupedSections(report);

  if (!deduped.length) {
    return "";
  }

  return deduped
    .map((section, index) => {
      const title = SECTION_TYPE_TITLES[section.type] ?? section.title;
      return `
        <section
          class="section narrative-section"
        >
          ${renderSectionTitle(startSectionNumber + index, title)}
          <div class="narrative-content">
            ${formatValue(section.content)}
          </div>
        </section>
      `;
    })
    .join("");
}

function renderTable(
  table: Report["tables"][number],
  sectionNumber: number,
): string {
  if (!table.columns.length || !table.rows.length) {
    return "";
  }
  const valueColumnCount = table.columns.length - 1;
  const isPercentColumn = table.columns
    .slice(1)
    .map((column) => isPercentColumnLabel(column.label));

  return `
    <section
      class="section table-section"
    >
      ${renderSectionTitle(sectionNumber, table.title)}
      <div class="table-wrapper">
        <table class="financial-table">
          <thead>
            <tr>
              ${table.columns
                .map(
                  (column, index) => `
                    <th
                      class="${index === 0 ? "label-column" : "value-column"}"
                    >
                      ${formatValue(column.label)}
                    </th>
                  `,
                )
                .join("")}
            </tr>
          </thead>
          <tbody>
            ${table.rows
              .map((row) => {
                const values = Array.from(
                  {
                    length: valueColumnCount,
                  },
                  (_, index) => row.values[index] ?? null,
                );
                return `
                  <tr>
                    <td class="row-label">
                      ${formatValue(row.label)}
                    </td>
                    ${values
                      .map(
                        (value, index) => `
                          <td
                            class="numeric-cell"
                          >
                            ${
                              isPercentColumn[index]
                                ? formatPercentValue(value)
                                : formatValue(value)
                            }
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

function renderBarChart(chart: Report["charts"][number]): string {
  const dataset = chart.datasets[0];

  if (!dataset || !dataset.data.length) {
    return "";
  }

  const values = dataset.data.map((value) =>
    Number.isFinite(value) ? value : 0,
  );

  const max = Math.max(...values.map((value) => Math.abs(value)), 1);

  const width = 700;
  const height = 260;

  const left = 60;
  const right = 20;
  const top = 30;
  const bottom = 55;

  const chartWidth = width - left - right;
  const chartHeight = height - top - bottom;
  const slotWidth = chartWidth / values.length;
  const barWidth = Math.min(slotWidth * 0.55, 70);

  const bars = values
    .map((value, index) => {
      const barHeight = (Math.abs(value) / max) * chartHeight;
      const x = left + index * slotWidth + (slotWidth - barWidth) / 2;
      const y = top + chartHeight - barHeight;
      const label = chart.labels[index] ?? "";

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

function renderLineChart(chart: Report["charts"][number]): string {
  const dataset = chart.datasets[0];

  if (!dataset || dataset.data.length < 2) {
    return "";
  }

  const values = dataset.data.map((value) =>
    Number.isFinite(value) ? value : 0,
  );

  const width = 700;
  const height = 260;

  const left = 55;
  const right = 25;
  const top = 30;
  const bottom = 55;

  const chartWidth = width - left - right;
  const chartHeight = height - top - bottom;

  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;

  const points = values.map((value, index) => {
    const x = left + (index / (values.length - 1)) * chartWidth;
    const y = top + chartHeight - ((value - min) / range) * chartHeight;

    return {
      x,
      y,
      value,
      label: chart.labels[index] ?? "",
    };
  });

  const path = points
    .map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`)
    .join(" ");

  const pointsMarkup = points
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
            ${formatValue(point.value)}
          </text>
          <text
            x="${point.x}"
            y="${height - 20}"
            text-anchor="middle"
            class="chart-label"
          >
            ${formatValue(point.label)}
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

function renderPieChart(chart: Report["charts"][number]): string {
  const dataset = chart.datasets[0];

  if (!dataset || !dataset.data.length) {
    return "";
  }

  const values = dataset.data.map((value) =>
    Math.max(Number.isFinite(value) ? value : 0, 0),
  );

  const total = values.reduce((sum, value) => sum + value, 0);

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

  let currentAngle = -Math.PI / 2;

  const slices = values
    .map((value, index) => {
      const angle = (value / total) * Math.PI * 2;
      const startAngle = currentAngle;
      const endAngle = currentAngle + angle;

      currentAngle = endAngle;

      const x1 = cx + radius * Math.cos(startAngle);
      const y1 = cy + radius * Math.sin(startAngle);
      const x2 = cx + radius * Math.cos(endAngle);
      const y2 = cy + radius * Math.sin(endAngle);

      const largeArc = angle > Math.PI ? 1 : 0;

      const path = `
        M ${cx} ${cy}
        L ${x1} ${y1}
        A ${radius} ${radius}
          0 ${largeArc} 1
          ${x2} ${y2}
        Z
      `;

      const label = chart.labels[index] ?? "";
      const color = dataset.color ?? colors[index % colors.length];

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
    chart.type === "doughnut"
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

function renderChart(chart: Report["charts"][number]): string {
  switch (chart.type) {
    case "bar":
      return renderBarChart(chart);

    case "line":
      return renderLineChart(chart);

    case "pie":
    case "doughnut":
      return renderPieChart(chart);

    case "area":
      return renderLineChart(chart);

    default:
      return "";
  }
}

function renderCharts(report: Report, sectionNumber: number): string {
  const renderedCharts = report.charts
    .map(renderChart)
    .filter((chart) => chart.length > 0);

  if (!renderedCharts.length) {
    return "";
  }

  return `
    <section
      class="section chart-section"
    >
      ${renderSectionTitle(sectionNumber, "Financial Trends")}
      <div class="charts-grid">
        ${renderedCharts.join("")}
      </div>
    </section>
  `;
}

function renderFooter(report: Report): string {
  return `
    <footer class="report-footer">
      <span>
        Source:
        ${formatValue(report.metadata.sourceFile)}
      </span>

      <span>
        Generated:
        ${new Date().toISOString()}
      </span>

    </footer>
  `;
}

export function buildReportHtml(report: Report): string {
  let nextSectionNumber = 1;

  const summarySectionNumber = nextSectionNumber++;
 const companySnapshotHasData = companySnapshotHasDisplayableData(
  report.companyData,
);

  const companySnapshotSectionNumber = companySnapshotHasData
    ? nextSectionNumber++
    : null;

  const narrativeStartNumber = nextSectionNumber;
  nextSectionNumber += getDedupedSections(report).length; 

  const tableStartNumber = nextSectionNumber;
  nextSectionNumber += report.tables.length;

  const chartsSectionNumber = report.charts.length ? nextSectionNumber++ : null;

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
          ${formatValue(report.company.name)}
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
          ${renderSummary(report, summarySectionNumber)}
          ${
            companySnapshotSectionNumber
              ? renderCompanySnapshot(report, companySnapshotSectionNumber)
              : ""
          }
          ${renderSections(report, narrativeStartNumber)}
          ${report.tables
            .map((table, index) => renderTable(table, tableStartNumber + index))
            .join("")}
          ${
            chartsSectionNumber ? renderCharts(report, chartsSectionNumber) : ""
          }
          ${renderFooter(report)}
        </main>
      </body>
    </html>
  `;
}
