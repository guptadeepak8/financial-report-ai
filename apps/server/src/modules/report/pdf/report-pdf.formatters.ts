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
    return `${value.toFixed(1)}%`;
  }

  const str = String(value).trim().replace(/%25/g, "%");

  if (str.endsWith("%")) {
    const parsed = Number(str.slice(0, -1).replaceAll(",", ""));

    return Number.isFinite(parsed) ? `${parsed.toFixed(1)}%` : escapeHtml(str);
  }

  return escapeHtml(str);
}

export function formatCurrencyValue(value: unknown): string {
  if (value === null || value === undefined || value === "") {
    return "—";
  }
  const num =
    typeof value === "number"
      ? value
      : Number(String(value).replaceAll(",", ""));

  return Number.isFinite(num)
    ? num.toLocaleString("en-IN")
    : formatValue(value);
}

export function isNumericValue(value: unknown): boolean {
  if (typeof value === "number") {
    return Number.isFinite(value);
  }

  if (typeof value !== "string") {
    return false;
  }

  const normalized = value.replaceAll(",", "").replace("%", "").trim();

  if (!normalized) {
    return false;
  }

  return Number.isFinite(Number(normalized));
}

export function toNumber(value: unknown): number | null {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : null;  }
  if (typeof value !== "string") {
    return null;
  }
  const parsed = Number(value.replaceAll(",", "").replace("%", "").trim());
  return Number.isFinite(parsed) ? parsed : null;
}

export function normalizeLabel(label: string): string {
  return label.toLowerCase().replace(/[^a-z0-9]/g, "");
}

export function isPercentColumnLabel(
  label: string,
): boolean {
  return /growth|qoq|yoy|change|margin|percentage|percent|%/i.test(
    label,
  );
}

export function isPercentRowLabel(
  label: string,
): boolean {
  return /margin|growth|qoq|yoy|change|attrition|percentage|percent|%/i.test(
    label,
  );
}

const PERCENT_TABLE_CATEGORIES = new Set([
  "ratios",
  "revenue-mix",
  "segment-revenue",
  "geography-mix",
  "client-mix",
  "project-type",
  "shareholding",
]);

export function isPercentTable(
  table: Report["tables"][number],
): boolean {
  if (PERCENT_TABLE_CATEGORIES.has(table.category)) {
    return true;
  }

  // Fallback: if every non-label column header reads as a percent
  // column (e.g. a custom-category table that is still % based),
  // treat the table as percent-based.
  const dataColumns = table.columns.slice(1);

  if (dataColumns.length === 0) {
    return false;
  }

  return dataColumns.every((column) => isPercentColumnLabel(column.label));
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
  if (!companyData) {
    return false;
  }

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

export function getTableValue(
  table: Report["tables"][number],
  rowLabel: string,
): unknown {
  const target = normalizeLabel(rowLabel);

  const row = table.rows.find((item) => normalizeLabel(item.label) === target);

  if (!row) {
    return null;
  }

  const index = getLatestValueIndex(table);

  return row.values[index] ?? null;
}

export interface KpiSlotDefinition {
  id: string;
  label: string;
  format: "currency" | "percent";
  preferredCategories: string[];
  aliases: string[];
}

export const KPI_SLOT_DEFINITIONS: KpiSlotDefinition[] = [
  {
    id: "revenue",
    label: "Revenue",
    format: "currency",
    preferredCategories: [
      "income-statement",
      "financial-highlights",
      "quarterly-results",
    ],
    aliases: [
      "revenue",
      "net revenue",
      "total revenue",
      "revenue from operations",
      "total income",
      "net interest income",
      "core operating income",
      "gross written premium",
    ],
  },
  {
    id: "netIncome",
    label: "Net Income",
    format: "currency",
    preferredCategories: [
      "income-statement",
      "financial-highlights",
      "quarterly-results",
    ],
    aliases: [
      "net income",
      "profit after tax",
      "net profit",
      "pat",
    ],
  },
  {
    id: "margin",
    label: "Margin",
    format: "percent",
    preferredCategories: [
      "income-statement",
      "ratios",
      "financial-highlights",
    ],
    aliases: [
      "ebit margin",
      "ebit margin (%)",
      "net income margin",
      "pat margin",
      "net interest margin",
      "core operating profit/average assets",
      "return on average assets",
      "return on equity",
      "standalone return on equity",
    ],
  },
];

export interface KpiMatch {
  slot: KpiSlotDefinition;
  matchedLabel: string;
  value: unknown;
  period: string;
}



export function findKpiMatch(
  report: Report,
  slot: KpiSlotDefinition,
): KpiMatch | null {
  // Search preferred-category tables first, then fall back to all tables.
  const preferredTables = report.tables.filter((table) =>
    slot.preferredCategories.includes(table.category),
  );
  const otherTables = report.tables.filter(
    (table) => !slot.preferredCategories.includes(table.category),
  );
  const searchOrder = [...preferredTables, ...otherTables];

  for (const alias of slot.aliases) {
    const target = normalizeLabel(alias);

    for (const table of searchOrder) {
      const row = table.rows.find(
        (item) => normalizeLabel(item.label) === target,
      );

      if (!row) {
        continue;
      }

      const latestIndex = getLatestValueIndex(table);
      const value = row.values[latestIndex];

      if (value === null || value === undefined || value === "") {
        continue;
      }

      const period = table.columns[latestIndex + 1]?.label ?? "Latest";

      return {
        slot,
        matchedLabel: row.label,
        value,
        period,
      };
    }
  }

  return null;
}

export function findAllKpiMatches(report: Report): KpiMatch[] {
  return KPI_SLOT_DEFINITIONS.map((slot) => findKpiMatch(report, slot)).filter(
    (match): match is KpiMatch => match !== null,
  );
}