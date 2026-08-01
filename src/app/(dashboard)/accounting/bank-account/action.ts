"use server";

import axiosInstance from "@/lib/axios";
import { bankAccountSchema, bankAccountSchemaType } from "@/lib/formSchema";
import { executeApiCall } from "@/lib/execute-api";

export async function bankAccountStore(values: bankAccountSchemaType) {
  const validation = bankAccountSchema.safeParse(values);

  if (!validation.success) return { success: false, message: "invalid form data" };
  return executeApiCall(() => axiosInstance.post(`/accounting/v1/bank-account`, values).then(r => r.data));
}

export async function bankAccountUpdate(id: number, values: bankAccountSchemaType) {
  const validation = bankAccountSchema.safeParse(values);
  if (!validation.success) return { success: false, message: "invalid form data" };
  return executeApiCall(() => axiosInstance.put(`/accounting/v1/bank-account/${id}`, values).then(r => r.data));
}
