"use server";

import axiosInstance from "@/lib/axios";
import { supplierSchema, supplierSchemaType } from "@/lib/formSchema";
import { parseAxiosError } from "@/lib/parseAxiosError";

export async function supplierStore(values: supplierSchemaType) {
  const validation = supplierSchema.safeParse(values);

  if (!validation.success) {
    return {
      success: false,
      message: "invalid form data",
    };
  }

  try {
    const { data } = await axiosInstance.post(`/finance/v1/supplier`, values);
    return data;
  } catch (error) {
    return parseAxiosError(error);
  }
}

export async function supplierUpdate(id: number, values: supplierSchemaType) {
  const validation = supplierSchema.safeParse(values);

  if (!validation.success) {
    return {
      success: false,
      message: "invalid form data",
    };
  }

  try {
    const { data } = await axiosInstance.put(
      `/finance/v1/supplier/${id}`,
      values
    );
    return data;
  } catch (error) {
    return parseAxiosError(error);
  }
}
