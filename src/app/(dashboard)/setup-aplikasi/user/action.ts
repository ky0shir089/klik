"use server";

import axiosInstance from "@/lib/axios";
import { userSchema, userSchemaType } from "@/lib/formSchema";
import { executeApiCall } from "@/lib/execute-api";

export async function userStore(values: userSchemaType) {
  const validation = userSchema.safeParse(values);

  if (!validation.success) return { success: false, message: "invalid form data" };
  return executeApiCall(() => axiosInstance.post(`/setup-aplikasi/v1/user`, values).then(r => r.data));
}

export async function userUpdate(id: number, values: userSchemaType) {
  const validation = userSchema.safeParse(values);
  if (!validation.success) return { success: false, message: "invalid form data" };
  return executeApiCall(() => axiosInstance.put(`/setup-aplikasi/v1/user/${id}`, values).then(r => r.data));
}
