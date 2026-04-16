"use server";

import axiosInstance from "@/lib/axios";
import { sppKlikSchema, sppKlikSchemaType } from "@/lib/formSchema";
import { parseAxiosError } from "@/lib/parseAxiosError";

export async function syncStatus(values: sppKlikSchemaType) {
  const validation = sppKlikSchema.safeParse(values);

  if (!validation.success) {
    return {
      success: false,
      message: "invalid form data",
    };
  }

  try {
    const { data } = await axiosInstance.post(
      `/klik/v2/spp-v2/sync-status`,
      validation.data,
    );
    return data;
  } catch (error) {
    return parseAxiosError(error);
  }
}
