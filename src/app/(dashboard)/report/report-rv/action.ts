"use server";

import { downloadReport } from "@/lib/download-report";

export async function reportRv(values: {
  from: string;
  to: string;
  type: string;
}) {
  const fileName = `report-rv-titipan-${values.from}-to-${values.to}.xlsx`;
  return downloadReport(`/report/v1/report-rv`, values, fileName);
}
