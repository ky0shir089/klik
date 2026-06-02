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

export async function unitCancel(customer_id: number, unit_id: number) {
  try {
    const { data } = await axiosInstance.put(`/klik/v1/unit/${unit_id}`);
    revalidatePath(`/klik/spp/${customer_id}`);
    return data;
  } catch (error) {
    return parseAxiosError(error);
  }
}
