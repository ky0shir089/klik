"use server";

import axiosInstance from "@/lib/axios";
import { invoiceStatusSchema, invoiceStatusSchemaType } from "@/lib/formSchema";
import { parseAxiosError } from "@/lib/parseAxiosError";

export async function invoiceUpdate(
  id: number,
  values: invoiceStatusSchemaType
) {
  const validation = invoiceStatusSchema.safeParse(values);

  if (!validation.success) {
    return {
      success: false,
      message: "invalid form data",
    };
  }

  try {
    const { data } = await axiosInstance.put(
      `/finance/v1/invoice/${id}`,
      values
    );
    return data;
  } catch (error) {
    return parseAxiosError(error);
  }
}
