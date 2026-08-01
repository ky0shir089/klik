"use server";

import axiosInstance from "@/lib/axios";
import { pvSchema, pvSchemaType } from "@/lib/formSchema";
import { executeApiCall } from "@/lib/execute-api";

export async function pvStore(values: pvSchemaType) {
  const validation = pvSchema.safeParse(values);

  if (!validation.success) return { success: false, message: "invalid form data" };
  return executeApiCall(() => axiosInstance.post(`/finance/v1/pv`, values).then(r => r.data));
}
