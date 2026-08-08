export interface Report {
  company: Company;

  recommendation?: Recommendation;

  summary: Summary;

  companyData?: CompanyData;

  sections: Section[];

  tables: FinancialTable[];

  charts: Chart[];

  metadata: ReportMetadata;
}


export interface Company {
  name: string;

  sector?: string;

  industry?: string;

  exchange?: string;

  ticker?: string;

  isin?: string;

  currency?: string;

  reportDate?: string;

  reportType?: string;
}



export interface Recommendation {
  rating?: "BUY" | "HOLD" | "SELL";

  targetPrice?: number;

  currentPrice?: number;

  expectedReturn?: number;

  timeframe?: string;

  analyst?: string;
}


export interface Summary {
  headline: string;

  overview: string;

  bulletPoints: string[];
}


export interface CompanyData {
  marketCap?: number;

  enterpriseValue?: number;

  outstandingShares?: number;

  freeFloat?: number;

  dividendYield?: number;

  beta?: number;

  faceValue?: number;

  fiftyTwoWeekHigh?: number;

  fiftyTwoWeekLow?: number;

  employees?: number;

  headquarters?: string;

  website?: string;
}



export interface Section {
  id: string;

  title: string;

  type: SectionType;

  content: string;

  order: number;
}

export type SectionType =
  | "executive-summary"
  | "investment-thesis"
  | "business-overview"
  | "management-commentary"
  | "outlook"
  | "risk"
  | "opportunity"
  | "valuation"
  | "custom";


export interface FinancialTable {
  id: string;

  title: string;

  category: TableCategory;

  columns: TableColumn[];

  rows: TableRow[];
}

export type TableCategory =
  | "financial-highlights"
  | "quarterly-results"
  | "income-statement"
  | "balance-sheet"
  | "cash-flow"
  | "ratios"
  | "shareholding"
  | "valuation"
  | "price-performance"
  | "segment-revenue"
  | "estimate-changes"
  | "custom";

export interface TableColumn {
  key: string;

  label: string;
}

export interface TableRow {
  label: string;

  values: TableValue[];
}

export type TableValue = string | number | null;


export interface Chart {
  id: string;

  title: string;

  type: ChartType;

  labels: string[];

  datasets: Dataset[];
}

export type ChartType =
  | "line"
  | "bar"
  | "pie"
  | "doughnut"
  | "area";

export interface Dataset {
  label: string;

  data: number[];

  color?: string;
}

export interface ReportMetadata {
  sourceFile: string;

  sourceType: SourceType;

  generatedAt: string;

  model: string;

  version: string;
}

export type SourceType = "pdf" | "csv" | "txt";