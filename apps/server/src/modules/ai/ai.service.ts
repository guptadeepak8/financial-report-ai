import { GoogleGenAI } from "@google/genai";
import { z } from "zod";

import { env } from "../../config/env";
import { AppError } from "../../utils/app-error";
import { reportSchema, type Report } from "../report/report.schema";

const ai = new GoogleGenAI({
  apiKey: env.GEMINI_API_KEY,
});

const model = "gemini-3.6-flash";

export async function extractReport(
  documentText: string,
  sourceFile: string,
  sourceType: "pdf" | "csv" | "txt",
): Promise<Report> {
  const prompt = buildExtractionPrompt(documentText, sourceFile, sourceType);

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseJsonSchema: z.toJSONSchema(reportSchema),
      },
    });

    if (!response.text) {
      throw new AppError(
        "Gemini returned an empty response",
        502,
        "AI_EMPTY_RESPONSE",
      );
    }

    const rawData: unknown = JSON.parse(response.text);

    const result = reportSchema.safeParse(rawData);

    if (!result.success) {
      console.error("Gemini schema validation failed:", result.error);

      throw new AppError(
        "Gemini returned data that does not match the report schema",
        502,
        "AI_INVALID_RESPONSE",
      );
    }

    return result.data;
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }

    console.error("Gemini extraction failed:", error);

    throw new AppError(
      "Failed to extract financial report from the document",
      502,
      "AI_EXTRACTION_FAILED",
    );
  }
}

function buildExtractionPrompt(
  documentText: string,
  sourceFile: string,
  sourceType: "pdf" | "csv" | "txt",
): string {
  return `
You are a financial research data extraction system.

Your task is to analyze the supplied company financial document and
produce a structured research report.

SOURCE FILE:
${sourceFile}

SOURCE TYPE:
${sourceType}

IMPORTANT RULES:

1. Use ONLY information contained in the supplied document.
2. Do not use outside knowledge.
3. Never invent financial values.
4. Never estimate a value that is not present.
5. If information is unavailable, return null where the schema permits it.
6. Preserve the source's reporting periods.
7. Preserve financial units such as INR million, INR crore, USD million, etc.
8. Extract financial tables accurately.
9. Extract meaningful company highlights.
10. Summarize management commentary without changing its meaning.
11. Create concise investment-related observations only when supported by the document.
12. Do not create a BUY, HOLD, or SELL recommendation unless the document explicitly supports one.
13. Do not calculate a target price unless it is explicitly provided.
14. Do not invent charts.
15. Create a chart only when the document contains sufficient numerical data.
16. Every table must contain values directly supported by the document.
17. Keep narrative sections concise and suitable for an equity research report.
18. If the document contains different terminology for a section, preserve the original terminology where appropriate.

The report must represent the supplied document, not your general knowledge about the company.

SOURCE DOCUMENT:

${documentText}
`;
}
