"use server";

import axiosInstance from "@/lib/axios";
import { coaSchema, coaSchemaType } from "@/lib/formSchema";
import { executeApiCall } from "@/lib/execute-api";
import { revalidatePath } from "next/cache";

export async function coaStore(values: coaSchemaType) {
  const validation = coaSchema.safeParse(values);

  if (!validation.success) return { success: false, message: "invalid form data" };
  return executeApiCall(async () => {
    const data = await axiosInstance.post(`/accounting/v1/coa`, values).then(r => r.data);
    revalidatePath("/accounting/chart-of-account");
    return data;
  });
}

export async function coaUpdate(id: number, values: coaSchemaType) {
  const validation = coaSchema.safeParse(values);
  if (!validation.success) return { success: false, message: "invalid form data" };
  return executeApiCall(async () => {
    const data = await axiosInstance.put(`/accounting/v1/coa/${id}`, values).then(r => r.data);
    revalidatePath("/accounting/chart-of-account");
    return data;
  });
}
