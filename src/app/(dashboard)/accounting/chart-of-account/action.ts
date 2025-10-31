"use server";

import axiosInstance from "@/lib/axios";
import { coaSchema, coaSchemaType } from "@/lib/formSchema";
import { parseAxiosError } from "@/lib/parseAxiosError";

export async function coaStore(values: coaSchemaType) {
  const validation = coaSchema.safeParse(values);

  if (!validation.success) {
    return {
      success: false,
      message: "invalid form data",
    };
  }

  try {
    const { data } = await axiosInstance.post(
      `/accounting/v1/coa`,
      values
    );
    return data;
  } catch (error) {
    return parseAxiosError(error);
  }
}

export async function coaUpdate(id: number, values: coaSchemaType) {
  const validation = coaSchema.safeParse(values);

  if (!validation.success) {
    return {
      success: false,
      error: "invalid form data",
    };
  }

  try {
    const { data } = await axiosInstance.put(
      `/accounting/v1/coa/${id}`,
      values
    );
    return data;
  } catch (error) {
    return parseAxiosError(error);
  }
}
