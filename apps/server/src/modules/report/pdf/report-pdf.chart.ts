import type { Chart, FinancialTable } from "../report.schema";

export function createRevenueChart(table: FinancialTable): Chart | null {
  const revenueRow = table.rows.find(
    (row) => row.label.toLowerCase().trim() === "revenue",
  );

  if (!revenueRow) {
    return null;
  }

  const labels = table.columns.slice(1).map((column) => column.label);

  const data = revenueRow.values
    .slice(0, labels.length)
    .map((value) => (typeof value === "number" ? value : Number(value)));

  if (data.length < 2 || data.some((value) => !Number.isFinite(value))) {
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
        data,
        color: "#2f638f",
      },
    ],
  };
}
