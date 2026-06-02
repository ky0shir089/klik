"use server";

import axiosInstance from "@/lib/axios";
import { parseAxiosError } from "@/lib/parseAxiosError";

export async function byadPdf(id: number) {
  try {
    const response = await axiosInstance.get(`/klik/v1/byad-attachment/${id}`, {
      responseType: "arraybuffer",
    });

    const file = new File([response.data], "export.pdf", {
      type: response.headers["content-type"] || "application/octet-stream",
    });

    return file;
  } catch (error) {
    return parseAxiosError(error);
  }
}
