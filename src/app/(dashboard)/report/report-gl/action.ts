"use server";

import { downloadReport } from "@/lib/download-report";

export async function reportGl(values: { from: string; to: string }) {
  return downloadReport(`/report/v1/report-gl`, values, "export.xlsx");
}
