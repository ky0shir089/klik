"use server";

import axiosInstance from "@/lib/axios";
import { pphSchema, pphSchemaType } from "@/lib/formSchema";
import { executeApiCall } from "@/lib/execute-api";

export async function pphStore(values: pphSchemaType) {
  const validation = pphSchema.safeParse(values);

  if (!validation.success) return { success: false, message: "invalid form data" };
  return executeApiCall(() => axiosInstance.post(`/accounting/v1/pph`, values).then(r => r.data));
}

export async function pphUpdate(id: number, values: pphSchemaType) {
  const validation = pphSchema.safeParse(values);
  if (!validation.success) return { success: false, message: "invalid form data" };
  return executeApiCall(() => axiosInstance.put(`/accounting/v1/pph/${id}`, values).then(r => r.data));
}
