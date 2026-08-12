import { Schema, model, type InferSchemaType } from "mongoose";

const datasetSchema = new Schema(
  {
    label: {
      type: String,
      required: true,
    },

    data: {
      type: [Number],
      required: true,
    },

    color: {
      type: String,
    },
  },
  {
    _id: false,
  },
);

const chartSchema = new Schema(
  {
    id: {
      type: String,
      required: true,
    },

    title: {
      type: String,
      required: true,
    },

    type: {
      type: String,
      enum: ["line", "bar", "pie", "doughnut", "area"],
      required: true,
    },

    labels: {
      type: [String],
      required: true,
    },

    datasets: {
      type: [datasetSchema],
      required: true,
    },
  },
  {
    _id: false,
  },
);

const tableRowSchema = new Schema(
  {
    label: {
      type: String,
      required: true,
    },

    values: {
      type: [Schema.Types.Mixed],
      required: true,
    },
  },
  {
    _id: false,
  },
);

const tableColumnSchema = new Schema(
  {
    key: {
      type: String,
      required: true,
    },

    label: {
      type: String,
      required: true,
    },
  },
  {
    _id: false,
  },
);

const financialTableSchema = new Schema(
  {
    id: {
      type: String,
      required: true,
    },

    title: {
      type: String,
      required: true,
    },

    category: {
      type: String,
      enum: [
        "financial-highlights",
        "quarterly-results",
        "income-statement",
        "balance-sheet",
        "cash-flow",
        "ratios",
        "shareholding",
        "valuation",
        "price-performance",
        "segment-revenue",
        "estimate-changes",
        "custom",
      ],
      required: true,
    },

    columns: {
      type: [tableColumnSchema],
      required: true,
    },

    rows: {
      type: [tableRowSchema],
      required: true,
    },
  },
  {
    _id: false,
  },
);

const sectionSchema = new Schema(
  {
    id: {
      type: String,
      required: true,
    },

    title: {
      type: String,
      required: true,
    },

    type: {
      type: String,
      enum: [
        "executive-summary",
        "investment-thesis",
        "business-overview",
        "management-commentary",
        "outlook",
        "risk",
        "opportunity",
        "valuation",
        "custom",
      ],
      required: true,
    },

    content: {
      type: String,
      required: true,
    },

    order: {
      type: Number,
      required: true,
    },
  },
  {
    _id: false,
  },
);

const companySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },

    sector: String,

    industry: String,

    exchange: String,

    ticker: String,

    isin: String,

    currency: String,

    reportDate: String,

    reportType: String,
  },
  {
    _id: false,
  },
);

const recommendationSchema = new Schema(
  {
    rating: {
      type: String,
      enum: ["BUY", "HOLD", "SELL"],
    },

    targetPrice: Number,

    currentPrice: Number,

    expectedReturn: Number,

    timeframe: String,

    analyst: String,
  },
  {
    _id: false,
  },
);

const summarySchema = new Schema(
  {
    headline: {
      type: String,
      required: true,
    },

    overview: {
      type: String,
      required: true,
    },

    bulletPoints: {
      type: [String],
      required: true,
    },
  },
  {
    _id: false,
  },
);

const companyDataSchema = new Schema(
  {
    marketCap: Number,

    enterpriseValue: Number,

    outstandingShares: Number,

    freeFloat: Number,

    dividendYield: Number,

    beta: Number,

    faceValue: Number,

    fiftyTwoWeekHigh: Number,

    fiftyTwoWeekLow: Number,

    employees: Number,

    headquarters: String,

    website: String,
  },
  {
    _id: false,
  },
);

const reportMetadataSchema = new Schema(
  {
    sourceFile: {
      type: String,
      required: true,
    },

    sourceType: {
      type: String,
      enum: ["pdf", "csv", "txt"],
      required: true,
    },

    model: {
      type: String,
      required: true,
    },

    version: {
      type: String,
      required: true,
    },
  },
  {
    _id: false,
  },
);

const reportSchema = new Schema(
  {
    company: {
      type: companySchema,
      required: true,
    },

    recommendation: {
      type: recommendationSchema,
    },

    summary: {
      type: summarySchema,
      required: true,
    },

    companyData: {
      type: companyDataSchema,
    },

    sections: {
      type: [sectionSchema],
      default: [],
    },

    tables: {
      type: [financialTableSchema],
      default: [],
    },

    charts: {
      type: [chartSchema],
      default: [],
    },

    metadata: {
      type: reportMetadataSchema,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export type ReportDocument = InferSchemaType<typeof reportSchema>;

export const ReportModel = model("Report", reportSchema);