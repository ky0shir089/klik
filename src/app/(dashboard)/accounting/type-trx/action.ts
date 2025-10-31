"use server";

import axiosInstance from "@/lib/axios";
import { typeTrxSchema, typeTrxSchemaType } from "@/lib/formSchema";
import { parseAxiosError } from "@/lib/parseAxiosError";

export async function typeTrxStore(values: typeTrxSchemaType) {
  const validation = typeTrxSchema.safeParse(values);

  if (!validation.success) {
    return {
      success: false,
      message: "invalid form data",
    };
  }

  try {
    const { data } = await axiosInstance.post(
      `/accounting/v1/type-trx`,
      values
    );
    return data;
  } catch (error) {
    return parseAxiosError(error);
  }
}

export async function typeTrxUpdate(id: number, values: typeTrxSchemaType) {
  const validation = typeTrxSchema.safeParse(values);

  if (!validation.success) {
    return {
      success: false,
      error: "invalid form data",
    };
  }

  try {
    const { data } = await axiosInstance.put(
      `/accounting/v1/type-trx/${id}`,
      values
    );
    return data;
  } catch (error) {
    return parseAxiosError(error);
  }
}
