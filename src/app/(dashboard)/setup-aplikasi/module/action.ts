"use server";

import axiosInstance from "@/lib/axios";
import { moduleSchema, moduleSchemaType } from "@/lib/formSchema";
import { executeApiCall } from "@/lib/execute-api";

export async function moduleStore(values: moduleSchemaType) {
  const validation = moduleSchema.safeParse(values);

  if (!validation.success) return { success: false, message: "invalid form data" };
  return executeApiCall(() => axiosInstance.post(`/setup-aplikasi/v1/module`, values).then(r => r.data));
}

export async function moduleUpdate(id: number, values: moduleSchemaType) {
  const validation = moduleSchema.safeParse(values);
  if (!validation.success) return { success: false, message: "invalid form data" };
  return executeApiCall(() => axiosInstance.put(`/setup-aplikasi/v1/module/${id}`, values).then(r => r.data));
}
