import fs from "node:fs/promises";
import path from "node:path";
import { chromium } from "playwright";

import type { Report } from "../report.schema";
import { buildReportHtml } from "./report-pdf.template";

export async function generateReportPdf(
  report: Report,
  reportId: string,
): Promise<string> {
  const outputDirectory = path.resolve("generated-reports");

  await fs.mkdir(outputDirectory, {
    recursive: true,
  });

  const outputPath = path.join(outputDirectory, `${reportId}.pdf`);

  const browser = await chromium.launch({
    headless: true,
  });

  try {
    const page = await browser.newPage({
      viewport: {
        width: 1200,
        height: 1600,
      },
      deviceScaleFactor: 1,
    });

    const html = buildReportHtml(report);

    await page.setContent(html, {
      waitUntil: "load",
    });

    await page.emulateMedia({
      media: "print",
    });

    await page.pdf({
      path: outputPath,
      format: "A4",
      printBackground: true,
      preferCSSPageSize: true,
      displayHeaderFooter: false,
      margin: {
        top: "10mm",
        right: "11mm",
        bottom: "12mm",
        left: "11mm",
      },
    });

    return outputPath;
  } finally {
    await browser.close();
  }
}
