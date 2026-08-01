"use server";

import axiosInstance from "@/lib/axios";
import { workflowSchema, workflowSchemaType } from "@/lib/formSchema";
import { executeApiCall } from "@/lib/execute-api";

export async function workflowStore(values: workflowSchemaType) {
  const validation = workflowSchema.safeParse(values);

  if (!validation.success) return { success: false, message: "invalid form data" };
  return executeApiCall(() => axiosInstance.post(`/workflow/v1/workflow`, values).then(r => r.data));
}

export async function workflowUpdate(id: number, values: workflowSchemaType) {
  const validation = workflowSchema.safeParse(values);
  if (!validation.success) return { success: false, message: "invalid form data" };
  return executeApiCall(() => axiosInstance.put(`/workflow/v1/workflow/${id}`, values).then(r => r.data));
}
