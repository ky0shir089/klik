"use server";

import axiosInstance from "@/lib/axios";
import { memoPaymentSchema, memoPaymentSchemaType } from "@/lib/formSchema";
import { executeApiCall } from "@/lib/execute-api";
import { revalidatePath } from "next/cache";

export async function paymentStore(values: memoPaymentSchemaType) {
  const validation = memoPaymentSchema.safeParse(values);

  if (!validation.success) return { success: false, message: "invalid form data" };
  return executeApiCall(async () => {
    const data = await axiosInstance.post(`/klik/v1/payment`, validation.data).then(r => r.data);
    revalidatePath(`/klik/memo-payment`);
    return data;
  });
}