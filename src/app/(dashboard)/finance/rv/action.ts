"use server";

import axiosInstance from "@/lib/axios";
import { rvSchema, rvSchemaType } from "@/lib/formSchema";
import { executeApiCall } from "@/lib/execute-api";

export async function rvStore(values: rvSchemaType) {
  const validation = rvSchema.safeParse(values);

  if (!validation.success) return { success: false, message: "invalid form data" };
  return executeApiCall(() => axiosInstance.post(`/finance/v1/rv`, values).then(r => r.data));
}
