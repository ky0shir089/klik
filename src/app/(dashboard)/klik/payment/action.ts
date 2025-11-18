"use server";

import axiosInstance from "@/lib/axios";
import { paymentSchema, paymentSchemaType } from "@/lib/formSchema";
import { parseAxiosError } from "@/lib/parseAxiosError";

export async function paymentStore(values: paymentSchemaType) {
  const validation = paymentSchema.safeParse(values);

  if (!validation.success) {
    return {
      success: false,
      message: "invalid form data",
    };
  }

  try {
    const { data } = await axiosInstance.post(`/klik/v1/payment`, values);
    return data;
  } catch (error) {
    return parseAxiosError(error);
  }
}
