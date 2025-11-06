"use server";

import axiosInstance from "@/lib/axios";
import { rvSchema, rvSchemaType } from "@/lib/formSchema";
import { parseAxiosError } from "@/lib/parseAxiosError";

export async function rvStore(values: rvSchemaType) {
  const validation = rvSchema.safeParse(values);

  if (!validation.success) {
    return {
      success: false,
      message: "invalid form data",
    };
  }

  try {
    const { data } = await axiosInstance.post(`/finance/v1/rv`, values);
    return data;
  } catch (error) {
    console.log(error);
    return parseAxiosError(error);
  }
}
