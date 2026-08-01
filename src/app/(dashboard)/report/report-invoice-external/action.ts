"use server";

import { downloadReport } from "@/lib/download-report";

export async function reportExternal(values: { from: string; to: string }) {
  const fileName = `report-invoice-external-${values.from}-to-${values.to}.xlsx`;
  return downloadReport(`/report/v1/report-invoice-external`, values, fileName);
}
