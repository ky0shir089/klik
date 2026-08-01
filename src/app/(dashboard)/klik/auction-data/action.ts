"use server";

import axiosInstance from "@/lib/axios";
import { auctionSchema, auctionSchemaType } from "@/lib/formSchema";
import { executeApiCall } from "@/lib/execute-api";

export async function auctionStore(values: auctionSchemaType) {
  const validation = auctionSchema.safeParse(values);

  if (!validation.success) return { success: false, message: "invalid form data" };
  return executeApiCall(() => axiosInstance.post(`/klik/v1/auction`, values).then(r => r.data));
}
