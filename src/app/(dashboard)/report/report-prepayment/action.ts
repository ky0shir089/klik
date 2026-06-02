"use server";

import axiosInstance from "@/lib/axios";
import { parseAxiosError } from "@/lib/parseAxiosError";

export async function reportPrepayment(values: { from: string; to: string }) {
  try {
    const res = await axiosInstance.post(`/report/v1/report-prepayment`, values, {
      responseType: "arraybuffer",
    });

    const fileName = `report-prepayment-${values.from}-to-${values.to}.xlsx`;
    const file = new File([res.data], fileName, {
      type: res.headers["content-type"] || "application/octet-stream",
    });

    return file;
  } catch (error) {
    return parseAxiosError(error);
  }
}
