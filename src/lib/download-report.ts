"use server";

import axiosInstance from "@/lib/axios";
import { parseAxiosError } from "@/lib/parseAxiosError";

export async function downloadReport<T>(
  url: string,
  values: T,
  fileName = "export.xlsx",
) {
  try {
    const res = await axiosInstance.post(url, values, {
      responseType: "arraybuffer",
    });
    const type =
      typeof res.headers["content-type"] === "string"
        ? res.headers["content-type"]
        : "application/octet-stream";
    return new File([res.data], fileName, { type });
  } catch (error) {
    return parseAxiosError(error);
  }
}
