"use server";

import axiosInstance from "@/lib/axios";
import { sppSchema, sppSchemaType } from "@/lib/formSchema";
import { executeApiCall } from "@/lib/execute-api";
import { revalidatePath } from "next/cache";

export async function sppStore(values: sppSchemaType) {
  const validation = sppSchema.safeParse(values);

  if (!validation.success) return { success: false, message: "invalid form data" };
  return executeApiCall(async () => {
    const data = await axiosInstance.post(`/klik/v1/spp`, validation.data).then(r => r.data);
    revalidatePath(`/klik/payment/${values.customer_id}`);
    return data;
  });
}

export async function unitCancel(customer_id: number, unit_id: number) {
  return executeApiCall(async () => {
    const data = await axiosInstance.put(`/klik/v1/unit/${unit_id}`).then(r => r.data);
    revalidatePath(`/klik/spp/${customer_id}`);
    return data;
  });
}
