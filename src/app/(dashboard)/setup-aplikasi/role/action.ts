"use server";

import axiosInstance from "@/lib/axios";
import { roleSchema, roleSchemaType } from "@/lib/formSchema";
import { parseAxiosError } from "@/lib/parseAxiosError";

export async function roleStore(values: roleSchemaType) {
  const validation = roleSchema.safeParse(values);

  if (!validation.success) {
    return {
      success: false,
      error: "invalid form data",
    };
  }

  try {
    const { data } = await axiosInstance.post(
      `/setup-aplikasi/v1/role`,
      values
    );
    return data;
  } catch (error) {
    return parseAxiosError(error);
  }
}

export async function roleUpdate(id: number, values: roleSchemaType) {
  const validation = roleSchema.safeParse(values);

  if (!validation.success) {
    return {
      success: false,
      error: "invalid form data",
    };
  }

  try {
    const { data } = await axiosInstance.put(
      `/setup-aplikasi/v1/role/${id}`,
      values
    );
    return data;
  } catch (error) {
    return parseAxiosError(error);
  }
}
