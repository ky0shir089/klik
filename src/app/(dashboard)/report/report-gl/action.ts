"use server";

import axiosInstance from "@/lib/axios";
import { parseAxiosError } from "@/lib/parseAxiosError";

/**
 * Request a general ledger report for the given date range and return it as an XLSX file.
 *
 * @param values - Object with `from` and `to` date strings specifying the report range
 * @returns The XLSX `File` named "export.xlsx" containing the report data, or the parsed Axios error result if the request fails
 */
export async function reportGl(values: { from: string; to: string }) {
  try {
    const res = await axiosInstance.post(`/report/v1/report-gl`, values, {
      responseType: "arraybuffer",
    });

    const file = new File([res.data], "export.xlsx", {
      type: res.headers["content-type"] || "application/octet-stream",
    });

    return file;
  } catch (error) {
    return parseAxiosError(error);
  }
}