"use server";

import axiosInstance from "@/lib/axios";
import { parseAxiosError } from "@/lib/parseAxiosError";

export async function reportCash(values: {
  from: string;
  to: string;
  cash: number;
  permission: string;
}) {
  try {
    const res = await axiosInstance.post(`/report/v1/report-kas`, values, {
      responseType: "arraybuffer",
    });

    const fileName = `kas-report-${values.from}-to-${values.to}.xlsx`;
    const file = new File([res.data], fileName, {
      type: res.headers["content-type"] || "application/octet-stream",
    });

    return file;
  } catch (error) {
    return parseAxiosError(error);
  }
}
