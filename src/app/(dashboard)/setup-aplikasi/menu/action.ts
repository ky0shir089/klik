"use server";

import axiosInstance from "@/lib/axios";
import { menuSchema, menuSchemaType } from "@/lib/formSchema";
import { parseAxiosError } from "@/lib/parseAxiosError";

export async function menuStore(values: menuSchemaType) {
  const validation = menuSchema.safeParse(values);

  if (!validation.success) {
    return {
      success: false,
      message: "invalid form data",
    };
  }

  try {
    const { data } = await axiosInstance.post(
      `/setup-aplikasi/v1/menu`,
      values
    );
    return data;
  } catch (error) {
    return parseAxiosError(error);
  }
}

export async function menuUpdate(id: number, values: menuSchemaType) {
  const validation = menuSchema.safeParse(values);

  if (!validation.success) {
    return {
      success: false,
      error: "invalid form data",
    };
  }

  try {
    const { data } = await axiosInstance.put(
      `/setup-aplikasi/v1/menu/${id}`,
      values
    );
    return data;
  } catch (error) {
    return parseAxiosError(error);
  }
}
