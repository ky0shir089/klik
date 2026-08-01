"use server";

import axiosInstance from "@/lib/axios";
import { trxDtlSchema, trxDtlSchemaType } from "@/lib/formSchema";
import { executeApiCall } from "@/lib/execute-api";

export async function trxDtlStore(values: trxDtlSchemaType) {
  const validation = trxDtlSchema.safeParse(values);

  if (!validation.success) return { success: false, message: "invalid form data" };
  return executeApiCall(() => axiosInstance.post(`/accounting/v1/trx-dtl`, values).then(r => r.data));
}

export async function trxDtlUpdate(id: number, values: trxDtlSchemaType) {
  const validation = trxDtlSchema.safeParse(values);
  if (!validation.success) return { success: false, message: "invalid form data" };
  return executeApiCall(() => axiosInstance.put(`/accounting/v1/trx-dtl/${id}`, values).then(r => r.data));
}
