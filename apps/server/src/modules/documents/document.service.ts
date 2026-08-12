import fs from "node:fs/promises";
import path from "node:path";

import { parse } from "csv-parse/sync";

import { AppError } from "../../utils/app-error";
import { PDFParse } from "pdf-parse";


export type DocumentType = "pdf" | "csv" | "txt";

export interface ParsedDocument {
  fileName: string;
  fileType: DocumentType;
  text: string;
}

function getDocumentType(fileName: string): DocumentType {
  const extension = path.extname(fileName).toLowerCase();

  switch (extension) {
    case ".pdf":
      return "pdf";

    case ".csv":
      return "csv";

    case ".txt":
      return "txt";

    default:
      throw new AppError(
        `Unsupported file type: ${extension || "unknown"}`,
        400,
        "UNSUPPORTED_FILE_TYPE",
      );
  }
}

async function parsePdf(buffer: Buffer): Promise<string> {
  const parser = new PDFParse({
    data: buffer,
  });

  const result = await parser.getText();

  await parser.destroy();

  return result.text.trim();
}

function parseCsv(buffer: Buffer): string {
  const content = buffer.toString("utf-8");

  const records = parse(content, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
  }) as Record<string, string>[];

  return JSON.stringify(records, null, 2);
}

function parseTxt(buffer: Buffer): string {
  return buffer.toString("utf-8").trim();
}

export async function parseDocument(
  filePath: string,
  fileName: string,
): Promise<ParsedDocument> {
  const fileType = getDocumentType(fileName);
  const buffer = await fs.readFile(filePath);

  let text: string;

  switch (fileType) {
    case "pdf":
      text = await parsePdf(buffer);
      break;

    case "csv":
      text = parseCsv(buffer);
      break;

    case "txt":
      text = parseTxt(buffer);
      break;
  }

  if (!text) {
    throw new AppError(
      "The uploaded document contains no readable content",
      400,
      "EMPTY_DOCUMENT",
    );
  }

  return {
    fileName,
    fileType,
    text,
  };
}