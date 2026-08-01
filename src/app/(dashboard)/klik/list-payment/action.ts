"use server";

import axiosInstance from "@/lib/axios";
import { memoPaymentSchema, memoPaymentSchemaType } from "@/lib/formSchema";
import { executeApiCall } from "@/lib/execute-api";
import { revalidatePath } from "next/cache";

export async function sppStore(values: memoPaymentSchemaType) {
  const validation = memoPaymentSchema.safeParse(values);

  if (!validation.success) return { success: false, message: "invalid form data" };
  return executeApiCall(async () => {
    const data = await axiosInstance.post(`/klik/v1/spp`, values).then(r => r.data);
    revalidatePath("/klik/list-payment");
    return data;
  });
}

export async function pdf(id: number) {
  return executeApiCall(async () => {
    const response = await axiosInstance.get(`/klik/v1/memo-payment/${id}`, {
      responseType: "arraybuffer",
    });

    const file = new File([response.data], "export.pdf", {
      type:
        typeof response.headers["content-type"] === "string"
          ? response.headers["content-type"]
          : "application/octet-stream",
    });

    return file;
  });
}

export async function sppAttachment(id: number) {
  return executeApiCall(async () => {
    const response = await axiosInstance.get(`/klik/v1/spp-attachment/${id}`, {
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
