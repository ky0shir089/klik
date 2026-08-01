"use server";

import axiosInstance from "@/lib/axios";
import { roleSchema, roleSchemaType } from "@/lib/formSchema";
import { executeApiCall } from "@/lib/execute-api";

export async function roleStore(values: roleSchemaType) {
  const validation = roleSchema.safeParse(values);

  if (!validation.success) return { success: false, message: "invalid form data" };
  return executeApiCall(() => axiosInstance.post(`/setup-aplikasi/v1/role`, values).then(r => r.data));
}

export async function roleUpdate(id: number, values: roleSchemaType) {
  const validation = roleSchema.safeParse(values);
  if (!validation.success) return { success: false, message: "invalid form data" };
  return executeApiCall(() => axiosInstance.put(`/setup-aplikasi/v1/role/${id}`, values).then(r => r.data));
}
