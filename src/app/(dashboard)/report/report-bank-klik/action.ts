"use server";

import axiosInstance from "@/lib/axios";
import { parseAxiosError } from "@/lib/parseAxiosError";

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

    const fileName = `bank-report-${values.from}-to-${values.to}.xlsx`;
    const file = new File([res.data], fileName, {
      type: res.headers["content-type"] || "application/octet-stream",
    });

    return file;
  } catch (error) {
    return parseAxiosError(error);
  }
}
