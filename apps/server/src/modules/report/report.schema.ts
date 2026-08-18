import { z } from "zod";

export const companySchema = z.object({
  name: z.string(),
  sector: z.string().nullable(),
  industry: z.string().nullable(),
  exchange: z.string().nullable(),
  ticker: z.string().nullable(),
  isin: z.string().nullable(),
  currency: z.string().nullable(),
  reportDate: z.string().nullable(),
  reportType: z.string().nullable(),
});

export const recommendationSchema = z.object({
  rating: z.enum(["BUY", "HOLD", "SELL"]).nullable(),
  targetPrice: z.number().nullable(),
  currentPrice: z.number().nullable(),
  expectedReturn: z.number().nullable(),
  timeframe: z.string().nullable(),
  analyst: z.string().nullable(),
});

export const summarySchema = z.object({
  headline: z.string(),
  overview: z.string(),
  bulletPoints: z.array(z.string()),
});

export const companyDataSchema = z.object({
  marketCap: z.number().nullable(),
  enterpriseValue: z.number().nullable(),
  outstandingShares: z.number().nullable(),
  freeFloat: z.number().nullable(),
  dividendYield: z.number().nullable(),
  beta: z.number().nullable(),
  faceValue: z.number().nullable(),
  fiftyTwoWeekHigh: z.number().nullable(),
  fiftyTwoWeekLow: z.number().nullable(),
  employees: z.number().nullable(),
  headquarters: z.string().nullable(),
  website: z.string().nullable(),
});

export const sectionSchema = z.object({
  id: z.string(),
  title: z.string(),
  type: z.enum([
    "executive-summary",
    "investment-thesis",
    "business-overview",
    "management-commentary",
    "outlook",
    "risk",
    "opportunity",
    "valuation",
    "custom",
  ]),
  content: z.string(),
  order: z.number().int(),
});

export const tableColumnSchema = z.object({
  key: z.string(),
  label: z.string(),
});

export const tableRowSchema = z.object({
  label: z.string(),
  values: z.array(z.union([z.string(), z.number(), z.null()])),
});

export const financialTableSchema = z.object({
  id: z.string(),
  title: z.string(),
  category: z.string(),
  columns: z.array(tableColumnSchema),
  rows: z.array(tableRowSchema),
});

export const datasetSchema = z.object({
  label: z.string(),
  data: z.array(z.number()),
  color: z.string().nullable(),
});

export const chartSchema = z.object({
  id: z.string(),
  title: z.string(),
  type: z.enum(["line", "bar", "pie", "doughnut", "area"]),
  labels: z.array(z.string()),
  datasets: z.array(datasetSchema),
});

export const reportMetadataSchema = z.object({
  sourceFile: z.string(),
  sourceType: z.enum(["pdf", "csv", "txt"]),
  model: z.string(),
  version: z.string(),
});

export const aiReportSchema = z.object({
  company: companySchema,
  recommendation: recommendationSchema.nullable(),
  summary: summarySchema,
  companyData: companyDataSchema.nullable(),
  sections: z.array(sectionSchema),
  tables: z.array(financialTableSchema),
  charts: z.array(chartSchema),
});

export const reportSchema = z.object({
  company: companySchema,
  recommendation: recommendationSchema.nullable(),
  summary: summarySchema,
  companyData: companyDataSchema.nullable(),
  sections: z.array(sectionSchema),
  tables: z.array(financialTableSchema),
  charts: z.array(chartSchema),
  metadata: reportMetadataSchema,
});

export const reportStatusSchema = z.enum([
  "extracting",
  "analyzing",
  "report_generated",
  "pdf_generating",
  "completed",
  "failed",
]);

export type Company = z.infer<typeof companySchema>;
export type Recommendation = z.infer<typeof recommendationSchema>;
export type Summary = z.infer<typeof summarySchema>;
export type CompanyData = z.infer<typeof companyDataSchema>;
export type Section = z.infer<typeof sectionSchema>;
export type FinancialTable = z.infer<typeof financialTableSchema>;
export type TableRow = z.infer<typeof tableRowSchema>;
export type Chart = z.infer<typeof chartSchema>;
export type Dataset = z.infer<typeof datasetSchema>;
export type ReportMetadata = z.infer<typeof reportMetadataSchema>;
export type Report = z.infer<typeof reportSchema>;
export type AIReport = z.infer<typeof aiReportSchema>;
export type ReportStatus = z.infer<typeof reportStatusSchema>;
