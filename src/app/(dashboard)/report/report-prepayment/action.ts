"use server";

import { downloadReport } from "@/lib/download-report";

export async function reportPrepayment(values: { from: string; to: string }) {
  const fileName = `report-prepayment-${values.from}-to-${values.to}.xlsx`;
  return downloadReport(`/report/v1/report-prepayment`, values, fileName);
}
