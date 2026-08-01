"use server";

import axiosInstance from "@/lib/axios";
import { journalInputSchema, journalInputSchemaType } from "@/lib/formSchema";
import { executeApiCall } from "@/lib/execute-api";

export async function journalInputStore(values: journalInputSchemaType) {
  const validation = journalInputSchema.safeParse(values);

  if (!validation.success) return { success: false, message: "invalid form data" };
  return executeApiCall(() => axiosInstance.post(`/accounting/v1/gl`, values).then(r => r.data));
}
