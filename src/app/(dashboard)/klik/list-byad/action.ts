"use server";

import axiosInstance from "@/lib/axios";
import { executeApiCall } from "@/lib/execute-api";

export async function byadAttachment(id: number) {
  return executeApiCall(async () => {
    const response = await axiosInstance.get(`/klik/v1/byad-attachment/${id}`, {
      responseType: "arraybuffer",
    });

    const file = new File([response.data], "export.xlsx", {
      type:
        typeof response.headers["content-type"] === "string"
          ? response.headers["content-type"]
          : "application/octet-stream",
    });

    return file;
  });
}
