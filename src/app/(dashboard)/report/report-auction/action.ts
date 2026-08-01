"use server";

import { downloadReport } from "@/lib/download-report";

export async function reportAuction(values: { from: string; to: string }) {
  return downloadReport(`/report/v1/report-auction`, values, "export.xlsx");
}
