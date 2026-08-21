import type {
  Chart,
  FinancialTable,
  Report,
  TableUnit,
} from "../report.schema";
import { toNumber } from "./report-pdf.formatters";

const UNIT_TO_ABSOLUTE: Record<TableUnit, number> = {
  absolute: 1,
  thousand: 1e3,
  lakh: 1e5,
  million: 1e6,
  crore: 1e7,
};

function scaleToCrores(
  value: number,
  unit: TableUnit | null | undefined,
): number {
  const factor = (unit ? UNIT_TO_ABSOLUTE[unit] : 1) / 1e7;
  return Math.round(value * factor * 100) / 100;
}

export function createRevenueChart(table: FinancialTable): Chart | null {
  const revenueRow = table.rows.find(
    (row) => row.label.toLowerCase().trim() === "revenue",
  );

  if (!revenueRow) {
    return null;
  }

  const labels = table.columns.slice(1).map((column) => column.label);

  const rawData = revenueRow.values.slice(0, labels.length).map(toNumber);

  if (rawData.length < 2 || rawData.some((value) => value === null)) {
    return null;
  }

  const data = (rawData as number[]).map((value) =>
    scaleToCrores(value, table.unit),
  );

  return {
    id: "revenue-trend",
    title: "Revenue Trend",
    unit: "₹ Cr",
    type: "bar",
    labels,
    datasets: [
      {
        label: "Revenue",
        data,
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

  const rawData = row.values.slice(0, labels.length).map(toNumber);

  if (rawData.length < 2 || rawData.some((value) => value === null)) {
    return null;
  }

  const data = (rawData as number[]).map((value) =>
    scaleToCrores(value, table.unit),
  );

  return {
    id: "net-income-trend",
    title: "Net Income Trend",
    unit: "₹ Cr",
    type: "line",
    labels,
    datasets: [
      {
        label: "Net Income",
        data,
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
