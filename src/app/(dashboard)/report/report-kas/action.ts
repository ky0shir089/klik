"use server";

import { downloadReport } from "@/lib/download-report";

export async function reportCash(values: {
  from: string;
  to: string;
  cash: number;
  permission: string;
}) {
  const fileName = `kas-report-${values.from}-to-${values.to}.xlsx`;
  return downloadReport(`/report/v1/report-kas`, values, fileName);
}
