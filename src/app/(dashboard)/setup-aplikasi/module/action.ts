"use server";

import axiosInstance from "@/lib/axios";
import { moduleSchema, moduleSchemaType } from "@/lib/formSchema";
import { parseAxiosError } from "@/lib/parseAxiosError";

export async function moduleStore(values: moduleSchemaType) {
  const validation = moduleSchema.safeParse(values);

  if (!validation.success) {
    return {
      success: false,
      message: "invalid form data",
    };
  }

  try {
    const { data } = await axiosInstance.post(
      `/setup-aplikasi/v1/module`,
      values
    );
    return data;
  } catch (error) {
    return parseAxiosError(error);
  }
}

export async function moduleUpdate(id: number, values: moduleSchemaType) {
  const validation = moduleSchema.safeParse(values);

  if (!validation.success) {
    return {
      success: false,
      message: "invalid form data",
    };
  }

  try {
    const { data } = await axiosInstance.put(
      `/setup-aplikasi/v1/module/${id}`,
      values
    );
    return data;
  } catch (error) {
    return parseAxiosError(error);
  }
}
