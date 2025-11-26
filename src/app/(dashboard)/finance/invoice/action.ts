"use server";

import axiosInstance from "@/lib/axios";
import { invoiceSchema, invoiceSchemaType } from "@/lib/formSchema";
import { parseAxiosError } from "@/lib/parseAxiosError";

export async function invoiceStore(values: invoiceSchemaType) {
  const validation = invoiceSchema.safeParse(values);

  if (!validation.success) {
    return {
      success: false,
      message: "invalid form data",
    };
  }

  try {
    const { data } = await axiosInstance.post(`/finance/v1/invoice`, values);
    return data;
  } catch (error) {
    return parseAxiosError(error);
  }
}
