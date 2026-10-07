"use server";

import { downloadReport } from "@/lib/download-report";

export async function reportTitipanBidder(values: {
  from: string;
  to: string;
}) {
  const fileName = `report-titipan-bidder-${values.from}-to-${values.to}.xlsx`;
  return downloadReport(`/report/v1/report-titipan-bidder`, values, fileName);
}
