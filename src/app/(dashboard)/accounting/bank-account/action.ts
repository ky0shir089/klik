"use server";

import axiosInstance from "@/lib/axios";
import { bankAccountSchema, bankAccountSchemaType } from "@/lib/formSchema";
import { parseAxiosError } from "@/lib/parseAxiosError";

export async function bankAccountStore(values: bankAccountSchemaType) {
  const validation = bankAccountSchema.safeParse(values);

  if (!validation.success) {
    return {
      success: false,
      message: "invalid form data",
    };
  }

  try {
    const { data } = await axiosInstance.post(
      `/accounting/v1/bank-account`,
      values
    );
    return data;
  } catch (error) {
    return parseAxiosError(error);
  }
}

export async function bankAccountUpdate(
  id: number,
  values: bankAccountSchemaType
) {
  const validation = bankAccountSchema.safeParse(values);

  if (!validation.success) {
    return {
      success: false,
      message: "invalid form data",
    };
  }

  try {
    const { data } = await axiosInstance.put(
      `/accounting/v1/bank-account/${id}`,
      values
    );
    return data;
  } catch (error) {
    return parseAxiosError(error);
  }
}
