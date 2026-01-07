"use server";

import axiosInstance from "@/lib/axios";
import { parseAxiosError } from "@/lib/parseAxiosError";

export async function reportBank(values: { from: string; to: string }) {
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
