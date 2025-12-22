"use server";

import axiosInstance from "@/lib/axios";
import { parseAxiosError } from "@/lib/parseAxiosError";

export async function reportRv() {
  try {
    const res = await axiosInstance.get(`/report/v1/report-rv`, {
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
