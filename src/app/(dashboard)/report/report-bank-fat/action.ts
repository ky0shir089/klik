"use server";

import { downloadReport } from "@/lib/download-report";

export async function reportBank(values: {
  from: string;
  to: string;
  bank: number;
  permission: string;
}) {
  const fileName = `bank-report-${values.from}-to-${values.to}.xlsx`;
  return downloadReport(`/report/v1/report-bank`, values, fileName);
}
