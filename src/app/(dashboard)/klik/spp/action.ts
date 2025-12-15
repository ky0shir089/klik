"use server";

import axiosInstance from "@/lib/axios";
import { sppSchema, sppSchemaType } from "@/lib/formSchema";
import { parseAxiosError } from "@/lib/parseAxiosError";
import { revalidatePath } from "next/cache";

export async function sppStore(values: sppSchemaType) {
  const validation = sppSchema.safeParse(values);

  if (!validation.success) {
    return {
      success: false,
      message: "invalid form data",
    };
  }

  try {
    const { data } = await axiosInstance.post(`/klik/v1/spp`, validation.data);
    revalidatePath(`/klik/payment/${values.customer_id}`);
    return data;
  } catch (error) {
    return parseAxiosError(error);
  }
}
