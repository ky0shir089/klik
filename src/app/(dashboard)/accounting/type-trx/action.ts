"use server";

import axiosInstance from "@/lib/axios";
import { typeTrxSchema, typeTrxSchemaType } from "@/lib/formSchema";
import { executeApiCall } from "@/lib/execute-api";

export async function typeTrxStore(values: typeTrxSchemaType) {
  const validation = typeTrxSchema.safeParse(values);
  if (!validation.success) return { success: false, message: "invalid form data" };
  return executeApiCall(() => axiosInstance.post(`/accounting/v1/type-trx`, values).then(r => r.data));
}

export async function typeTrxUpdate(id: number, values: typeTrxSchemaType) {
  const validation = typeTrxSchema.safeParse(values);
  if (!validation.success) return { success: false, message: "invalid form data" };
  return executeApiCall(() => axiosInstance.put(`/accounting/v1/type-trx/${id}`, values).then(r => r.data));
}
