"use server";

import axiosInstance from "@/lib/axios";
import { auctionSchema, auctionSchemaType } from "@/lib/formSchema";
import { parseAxiosError } from "@/lib/parseAxiosError";

export async function auctionStore(values: auctionSchemaType) {
  const validation = auctionSchema.safeParse(values);

  if (!validation.success) {
    return {
      success: false,
      message: "invalid form data",
    };
  }

  try {
    const { data } = await axiosInstance.post(`/klik/v1/auction`, values);
    return data;
  } catch (error) {
    return parseAxiosError(error);
  }
}
