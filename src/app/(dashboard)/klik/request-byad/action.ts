"use server";

import axiosInstance from "@/lib/axios";
import { byadPaymentSchema, byadPaymentSchemaType } from "@/lib/formSchema";
import { parseAxiosError } from "@/lib/parseAxiosError";

export async function byadPaymentStore(values: byadPaymentSchemaType) {
  const validation = byadPaymentSchema.safeParse(values);

  if (!validation.success) {
    return {
      success: false,
      message: "invalid form data",
    };
  }

  try {
    const { data } = await axiosInstance.post(`/klik/v1/byad-payment`, values);
    return data;
  } catch (error) {
    return parseAxiosError(error);
  }
}
