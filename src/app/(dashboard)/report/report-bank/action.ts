"use server";

import axiosInstance from "@/lib/axios";
import { parseAxiosError } from "@/lib/parseAxiosError";

/**
 * Requests a bank report for the given range and returns it as an Excel File.
 *
 * @param values - Request parameters for the report
 * @param values.from - Start date or identifier for the report range
 * @param values.to - End date or identifier for the report range
 * @param values.bank - Bank identifier
 * @param values.permission - Permission context used for the report
 * @returns A File named "export.xlsx" containing the report on success, or the parsed Axios error object on failure
 */
export async function reportBank(values: {
  from: string;
  to: string;
  bank: number;
  permission: string;
}) {
  try {
    const res = await axiosInstance.post(`/report/v1/report-bank`, values, {
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