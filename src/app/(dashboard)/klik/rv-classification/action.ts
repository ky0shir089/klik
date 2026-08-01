"use server";

import axiosInstance from "@/lib/axios";
import {
  rvClassificationSchema,
  rvClassificationSchemaType,
} from "@/lib/formSchema";
import { executeApiCall } from "@/lib/execute-api";
import { revalidatePath } from "next/cache";

export async function classificationStore(values: rvClassificationSchemaType) {
  const validation = rvClassificationSchema.safeParse(values);

  if (!validation.success) return { success: false, message: "invalid form data" };
  return executeApiCall(async () => {
    const data = await axiosInstance.post(`/finance/v1/rv-classification`, values).then(r => r.data);
    revalidatePath("/klik/rv-classification");
    return data;
  });
}
