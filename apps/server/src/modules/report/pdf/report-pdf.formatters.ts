// report-pdf.formatters.ts
import type { Report } from "../report.schema";

export function escapeHtml(value: unknown): string {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export function formatValue(value: unknown): string {
  if (value === null || value === undefined || value === "") {
    return "—";
  }
  return escapeHtml(value);
}

export function formatPercentValue(value: unknown): string {
  if (value === null || value === undefined || value === "") {
    return "—";
  }

  if (typeof value === "number") {
    const isFraction = Math.abs(value) < 1;
    const pct = isFraction ? value * 100 : value;
    return `${pct.toFixed(1)}%`;
  }

  // Defensive: repair URL-encoded percent signs that occasionally
  // leak through from the LLM's raw JSON output (e.g. "29.0%25").
  const str = String(value).trim().replace(/%25/g, "%");

  if (str.endsWith("%")) {
    const parsed = Number(str.slice(0, -1).replaceAll(",", ""));
    return Number.isFinite(parsed) ? `${parsed.toFixed(1)}%` : str;
  }

  const parsed = Number(str.replaceAll(",", ""));

  if (Number.isFinite(parsed)) {
    const isFraction = Math.abs(parsed) < 1;
    const pct = isFraction ? parsed * 100 : parsed;
    return `${pct.toFixed(1)}%`;
  }

  return formatValue(value);
}



export function formatCurrencyValue(value: unknown): string {
  if (value === null || value === undefined || value === "") {
    return "—";
  }
  const num =
    typeof value === "number" ? value : Number(String(value).replaceAll(",", ""));
  return Number.isFinite(num) ? num.toLocaleString("en-IN") : formatValue(value);
}

export function isNumericValue(value: unknown): boolean {
  if (typeof value === "number") return Number.isFinite(value);
  if (typeof value !== "string") return false;
  const normalized = value.replaceAll(",", "").replace("%", "").trim();
  if (!normalized) return false;
  return Number.isFinite(Number(normalized));
}

export function toNumber(value: unknown): number | null {
  if (typeof value === "number") return Number.isFinite(value) ? value : null;
  if (typeof value !== "string") return null;
  const normalized = value.replaceAll(",", "").replace("%", "").trim();
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : null;
}

export function normalizeLabel(label: string): string {
  return label.toLowerCase().replace(/[^a-z0-9]/g, "");
}

export function isPercentColumnLabel(label: string): boolean {
  return /growth|qoq|yoy|change|margin|share|%/i.test(label);
}

export function getLatestValueIndex(table: Report["tables"][number]): number {
  const columns = table.columns.slice(1);
  for (let index = columns.length - 1; index >= 0; index--) {
    const label = columns[index]?.label.toLowerCase().trim() ?? "";
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

export const DISPLAYED_COMPANY_DATA_KEYS = [
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

export function companySnapshotHasDisplayableData(
  companyData: Report["companyData"],
): boolean {
  if (!companyData) return false;
  return DISPLAYED_COMPANY_DATA_KEYS.some(
    (key) => companyData[key] !== null && companyData[key] !== undefined,
  );
}

export const SECTION_TYPE_TITLES: Record<string, string> = {
  "executive-summary": "Executive Summary",
  "investment-thesis": "Investment Thesis",
  "business-overview": "Business Overview",
  "management-commentary": "Management Commentary",
  outlook: "Outlook",
  risk: "Risk Factors",
  opportunity: "Opportunities",
  valuation: "Valuation",
};