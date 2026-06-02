"use server";

import axiosInstance from "@/lib/axios";
import { parseAxiosError } from "@/lib/parseAxiosError";

export async function reportInvoice(values: { from: string; to: string }) {
  try {
    const res = await axiosInstance.post(`/report/v1/report-invoice`, values, {
      responseType: "arraybuffer",
    });

    const fileName = `report-invoice-${values.from}-to-${values.to}.xlsx`;
    const file = new File([res.data], fileName, {
      type: res.headers["content-type"] || "application/octet-stream",
    });

    return file;
  } catch (error) {
    return parseAxiosError(error);
  }
}
