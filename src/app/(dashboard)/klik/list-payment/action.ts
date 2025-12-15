"use server";

import axiosInstance from "@/lib/axios";
import { memoPaymentSchema, memoPaymentSchemaType } from "@/lib/formSchema";
import { parseAxiosError } from "@/lib/parseAxiosError";
import { revalidatePath } from "next/cache";

export async function sppStore(values: memoPaymentSchemaType) {
  const validation = memoPaymentSchema.safeParse(values);

  if (!validation.success) {
    return {
      success: false,
      message: "invalid form data",
    };
  }

  try {
    const { data } = await axiosInstance.post(`/klik/v1/spp`, values);
    revalidatePath("/klik/list-payment");
    return data;
  } catch (error) {
    return parseAxiosError(error);
  }
}

export async function pdf(id: number) {
  try {
    const response = await axiosInstance.get(`/klik/v1/memo-payment/${id}`, {
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
