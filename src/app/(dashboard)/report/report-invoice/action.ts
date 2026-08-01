"use server";

import { downloadReport } from "@/lib/download-report";

export async function reportInvoice(values: { from: string; to: string }) {
  const fileName = `report-invoice-${values.from}-to-${values.to}.xlsx`;
  return downloadReport(`/report/v1/report-invoice`, values, fileName);
}
