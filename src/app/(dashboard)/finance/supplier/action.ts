"use server";

import axiosInstance from "@/lib/axios";
import { supplierSchema, supplierSchemaType } from "@/lib/formSchema";
import { executeApiCall } from "@/lib/execute-api";

export async function supplierStore(values: supplierSchemaType) {
  const validation = supplierSchema.safeParse(values);

  if (!validation.success) return { success: false, message: "invalid form data" };
  return executeApiCall(() => axiosInstance.post(`/finance/v1/supplier`, values).then(r => r.data));
}

export async function supplierUpdate(id: number, values: supplierSchemaType) {
  const validation = supplierSchema.safeParse(values);
  if (!validation.success) return { success: false, message: "invalid form data" };
  return executeApiCall(() => axiosInstance.put(`/finance/v1/supplier/${id}`, values).then(r => r.data));
}
