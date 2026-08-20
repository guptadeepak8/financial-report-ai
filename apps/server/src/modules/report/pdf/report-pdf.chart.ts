import type { Chart, FinancialTable, Report } from "../report.schema";
import { toNumber } from "./report-pdf.formatters";


export function createRevenueChart(table: FinancialTable): Chart | null {
  const revenueRow = table.rows.find(
    (row) => row.label.toLowerCase().trim() === "revenue",
  );

  if (!revenueRow) {
    return null;
  }

  const labels = table.columns.slice(1).map((column) => column.label);

  const data = revenueRow.values.slice(0, labels.length).map(toNumber);

  if (data.length < 2 || data.some((value) => value === null)) {
    return null;
  }

  return {
    id: "revenue-trend",
    title: "Revenue Trend",
    type: "bar",
    labels,
    datasets: [
      {
        label: "Revenue",
        data: data as number[],
        color: "#2f638f",
      },
    ],
  };
}

export function createNetIncomeChart(table: FinancialTable): Chart | null {
  const row = table.rows.find(
    (item) => item.label.toLowerCase().trim() === "net income",
  );

  if (!row) {
    return null;
  }

  const labels = table.columns.slice(1).map((column) => column.label);

  const data = row.values.slice(0, labels.length).map(toNumber);

  if (data.length < 2 || data.some((value) => value === null)) {
    return null;
  }

  return {
    id: "net-income-trend",
    title: "Net Income Trend",
    type: "line",
    labels,
    datasets: [
      {
        label: "Net Income",
        data: data as number[],
        color: "#1f4e79",
      },
    ],
  };
}

export function createFallbackCharts(report: Report): Chart[] {
  const charts: Chart[] = [];

  const incomeStatement = report.tables.find(
    (table) => table.category === "income-statement",
  );

  if (!incomeStatement) {
    return charts;
  }

  const revenueChart = createRevenueChart(incomeStatement);

  if (revenueChart) {
    charts.push(revenueChart);
  }

  const netIncomeChart = createNetIncomeChart(incomeStatement);

  if (netIncomeChart) {
    charts.push(netIncomeChart);
  }

  return charts;
}

export function getReportCharts(report: Report): Chart[] {
  if (report.charts.length > 0) {
    return report.charts;
  }

  return createFallbackCharts(report);
}
