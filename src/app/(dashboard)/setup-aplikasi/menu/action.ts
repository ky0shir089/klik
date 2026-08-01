"use server";

import axiosInstance from "@/lib/axios";
import { menuSchema, menuSchemaType } from "@/lib/formSchema";
import { executeApiCall } from "@/lib/execute-api";

export async function menuStore(values: menuSchemaType) {
  const validation = menuSchema.safeParse(values);

  if (!validation.success) return { success: false, message: "invalid form data" };
  return executeApiCall(() => axiosInstance.post(`/setup-aplikasi/v1/menu`, values).then(r => r.data));
}

export async function menuUpdate(id: number, values: menuSchemaType) {
  const validation = menuSchema.safeParse(values);
  if (!validation.success) return { success: false, message: "invalid form data" };
  return executeApiCall(() => axiosInstance.put(`/setup-aplikasi/v1/menu/${id}`, values).then(r => r.data));
}
