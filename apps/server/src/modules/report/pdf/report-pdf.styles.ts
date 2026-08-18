export const reportPdfStyles = `
  @page {
    size: A4;
    margin: 12mm 11mm 14mm 11mm;
  }

  * {
    box-sizing: border-box;
  }

  html,
  body {
    margin: 0;
    padding: 0;
  }

  body {
    font-family:
      Arial,
      Helvetica,
      sans-serif;

    font-size: 9px;
    line-height: 1.45;

    color: #20242a;
    background: #ffffff;

    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }

  .report {
    width: 100%;
    max-width: 794px;
    margin: 0 auto;
  }

  /*
   * HEADER
   */

  .report-header {
    border-bottom: 2px solid #1f4e79;
    padding-bottom: 9px;
    margin-bottom: 12px;
  }

  .eyebrow {
    font-size: 7px;
    font-weight: 700;
    letter-spacing: 1.2px;
    color: #1f4e79;
    margin-bottom: 5px;
  }

  .header-main {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    gap: 20px;
  }

  .company-heading {
    min-width: 0;
    flex: 1;
  }

  .report-header h1 {
    margin: 0;
    font-size: 21px;
    line-height: 1.1;
    font-weight: 700;
    color: #1d2733;
  }

  .company-meta {
    margin-top: 5px;
    color: #68717c;
    font-size: 8px;
  }

  .report-info {
    display: flex;
    gap: 16px;
    text-align: right;
    flex-shrink: 0;
  }

  .report-info span,
  .metric span,
  .recommendation-card span,
  .kpi-card span {
    display: block;
    color: #727b85;
    font-size: 7px;
    text-transform: uppercase;
    letter-spacing: 0.3px;
  }

  .report-info strong {
    display: block;
    margin-top: 2px;
    font-size: 8px;
    color: #222;
  }

  /*
   * RECOMMENDATION
   */

  .recommendation-card {
    display: grid;

    grid-template-columns:
      1.25fr
      repeat(4, 1fr);

    border: 1px solid #c8ced5;
    background: #f6f8fa;

    margin-bottom: 14px;
  }

  .recommendation-card > div {
    min-height: 48px;

    padding: 8px;

    border-left: 1px solid #d6dbe0;

    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .recommendation-card > div:first-child {
    border-left: 0;
  }

  .recommendation-card strong {
    display: block;
    margin-top: 4px;
    font-size: 11px;
    color: #1d2733;
  }

  .recommendation-rating strong {
    color: #1f4e79;
  }

  /*
   * KPI CARDS
   */

  .kpi-grid {
    display: grid;

    grid-template-columns:
      repeat(4, 1fr);

    gap: 7px;

    margin-bottom: 14px;
  }

  .kpi-card {
    min-height: 58px;

    padding: 8px 9px;

    border: 1px solid #d1d7dd;
    border-top: 3px solid #1f4e79;

    background: #f8fafc;
  }

  .kpi-card strong {
    display: block;

    margin-top: 4px;

    font-size: 12px;

    color: #1d2733;
  }

  .kpi-card small {
    display: block;

    margin-top: 2px;

    color: #858d95;

    font-size: 6.5px;
  }

  /*
   * SECTIONS
   */

  .section {
    margin-top: 15px;
    break-inside: avoid;
  }

  .section-title {
    display: flex;
    align-items: center;
    gap: 7px;

    color: #1f4e79;

    font-size: 10.5px;
    font-weight: 700;

    border-bottom: 1.5px solid #1f4e79;

    padding-bottom: 4px;
    margin-bottom: 8px;
  }

  .section-number {
    display: inline-flex;

    align-items: center;
    justify-content: center;

    width: 19px;
    height: 17px;

    background: #1f4e79;
    color: #ffffff;

    font-size: 7px;
  }

  .summary-headline {
    margin: 0 0 6px;

    font-size: 13px;
    line-height: 1.25;

    color: #1d2733;
  }

  .lead {
    margin: 0;

    font-size: 9px;
    line-height: 1.55;

    color: #404850;
  }

  /*
   * SUMMARY HIGHLIGHTS
   */

  .highlights {
    display: grid;

    grid-template-columns:
      repeat(2, 1fr);

    gap: 5px 15px;

    margin-top: 9px;
  }

  .highlight {
    display: flex;
    gap: 6px;

    line-height: 1.4;
    color: #30363d;
  }

  .highlight-marker {
    flex: 0 0 4px;

    width: 4px;
    height: 4px;

    margin-top: 5px;

    background: #1f4e79;
    border-radius: 50%;
  }

  /*
   * COMPANY SNAPSHOT
   */

  .metrics-grid {
    display: grid;

    grid-template-columns:
      repeat(3, 1fr);

    border-top: 1px solid #d2d7dc;
    border-left: 1px solid #d2d7dc;
  }

  .metric {
    min-height: 43px;

    padding: 7px;

    border-right: 1px solid #d2d7dc;
    border-bottom: 1px solid #d2d7dc;

    background: #fafbfc;
  }

  .metric strong {
    display: block;

    margin-top: 3px;

    font-size: 9px;

    color: #252b32;
  }

  /*
   * NARRATIVE
   */

  .narrative-content {
    color: #3d454d;

    font-size: 8.7px;

    line-height: 1.55;

    white-space: pre-line;

    text-align: justify;
  }

  /*
   * TABLES
   */

  .table-section {
    break-inside: auto;
    page-break-inside: auto;
  }

  .table-wrapper {
    width: 100%;
    overflow: hidden;
  }

  .financial-table {
    width: 100%;

    table-layout: fixed;

    border-collapse: collapse;

    font-size: 7.3px;
  }

  .financial-table thead {
    display: table-header-group;
  }

  .financial-table tr {
    break-inside: avoid;
    page-break-inside: avoid;
  }

  .financial-table th {
    padding: 5px 4px;

    background: #e8edf3;

    border: 1px solid #b9c2cc;

    color: #29323b;

    font-size: 7px;
    font-weight: 700;

    text-align: center;
    vertical-align: middle;

    overflow: hidden;
    text-overflow: ellipsis;
  }

  .financial-table td {
    padding: 4px;

    border: 1px solid #cbd1d7;

    vertical-align: middle;

    text-align: right;

    overflow: hidden;
    text-overflow: ellipsis;
  }

  .financial-table .label-column {
    width: 28%;
    text-align: left;
  }

  .financial-table .value-column {
    width: auto;
    text-align: center;
  }

  .financial-table .row-label {
    width: 28%;

    text-align: left;

    font-weight: 600;

    color: #303840;

    white-space: normal;
  }

  .financial-table .numeric-cell {
    text-align: right;

    white-space: nowrap;
  }

  .financial-table tbody tr:nth-child(even) {
    background: #f7f9fb;
  }

  /*
   * CHARTS
   */

  .charts-grid {
    display: grid;

    grid-template-columns:
      repeat(2, minmax(0, 1fr));

    gap: 12px;
  }

  .chart-section {
    break-inside: auto;
    page-break-inside: auto;
  }

  .chart-card {
    border: 1px solid #d1d7dd;

    background: #ffffff;

    padding: 10px;

    break-inside: avoid;
    page-break-inside: avoid;
  }

  .chart-card-title {
    font-size: 9px;
    font-weight: 700;

    color: #1f2933;

    margin-bottom: 5px;
  }

  .chart-svg {
    display: block;

    width: 100%;
    height: auto;
  }

  .chart-axis {
    stroke: #9ca8b3;
    stroke-width: 1;
  }

  .chart-bar {
    fill: #2f638f;
  }

  .chart-line {
    stroke: #1f4e79;
    stroke-width: 3;

    fill: none;
  }

  .chart-point {
    fill: #1f4e79;
  }

  .chart-value {
    fill: #344454;

    font-size: 8px;
  }

  .chart-label {
    fill: #66727d;

    font-size: 7px;
  }

  .pie-slice {
    stroke: #ffffff;
    stroke-width: 2;
  }

  /*
   * FOOTER
   */

  .report-footer {
    display: flex;
    justify-content: space-between;

    gap: 20px;

    border-top: 1px solid #cfd4d9;

    margin-top: 18px;

    padding-top: 5px;

    color: #737c85;

    font-size: 6.5px;
  }

  /*
   * PRINT
   */

  @media print {
    .section {
      break-inside: avoid;
    }

    .table-section {
      break-inside: auto;
    }

    .financial-table tr {
      break-inside: avoid;
      page-break-inside: avoid;
    }

    .chart-card {
      break-inside: avoid;
      page-break-inside: avoid;
    }
  }
`;