"use server";

import axiosInstance from "@/lib/axios";
import {
  rvClassificationSchema,
  rvClassificationSchemaType,
} from "@/lib/formSchema";
import { parseAxiosError } from "@/lib/parseAxiosError";
import { revalidatePath } from "next/cache";

export async function classificationStore(values: rvClassificationSchemaType) {
  const validation = rvClassificationSchema.safeParse(values);

  if (!validation.success) {
    return {
      success: false,
      message: "invalid form data",
    };
  }

  try {
    const { data } = await axiosInstance.post(`/finance/v1/rv-classification`, values);
    revalidatePath("/klik/rv-classification");
    return data;
  } catch (error) {
    return parseAxiosError(error);
  }
}
