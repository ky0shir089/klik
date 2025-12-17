"use server";

import axiosInstance from "@/lib/axios";
import { memoPaymentSchema, memoPaymentSchemaType } from "@/lib/formSchema";
import { parseAxiosError } from "@/lib/parseAxiosError";
import { revalidatePath } from "next/cache";

export async function paymentStore(values: memoPaymentSchemaType) {
  const validation = memoPaymentSchema.safeParse(values);

  if (!validation.success) {
    return {
      success: false,
      message: "invalid form data",
    };
  }

  try {
    const { data } = await axiosInstance.post(`/klik/v1/payment`, validation.data);
    revalidatePath(`/klik/memo-payment`);
    return data;
  } catch (error) {
    return parseAxiosError(error);
  }
}