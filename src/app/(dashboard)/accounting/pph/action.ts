"use server";

import axiosInstance from "@/lib/axios";
import { pphSchema, pphSchemaType } from "@/lib/formSchema";
import { parseAxiosError } from "@/lib/parseAxiosError";

export async function pphStore(values: pphSchemaType) {
  const validation = pphSchema.safeParse(values);

  if (!validation.success) {
    return {
      success: false,
      message: "invalid form data",
    };
  }

  try {
    const { data } = await axiosInstance.post(`/accounting/v1/pph`, values);
    return data;
  } catch (error) {
    return parseAxiosError(error);
  }
}

export async function pphUpdate(id: number, values: pphSchemaType) {
  const validation = pphSchema.safeParse(values);

  if (!validation.success) {
    return {
      success: false,
      message: "invalid form data",
    };
  }

  try {
    const { data } = await axiosInstance.put(
      `/accounting/v1/pph/${id}`,
      values
    );
    return data;
  } catch (error) {
    return parseAxiosError(error);
  }
}
