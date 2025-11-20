"use server";

import axiosInstance from "@/lib/axios";
import { pvSchema, pvSchemaType } from "@/lib/formSchema";
import { parseAxiosError } from "@/lib/parseAxiosError";

export async function pvStore(values: pvSchemaType) {
  const validation = pvSchema.safeParse(values);

  if (!validation.success) {
    return {
      success: false,
      message: "invalid form data",
    };
  }

  try {
    const { data } = await axiosInstance.post(`/finance/v1/pv`, values);
    return data;
  } catch (error) {
    return parseAxiosError(error);
  }
}
