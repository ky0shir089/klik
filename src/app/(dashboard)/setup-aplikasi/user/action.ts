"use server";

import axiosInstance from "@/lib/axios";
import { userSchema, userSchemaType } from "@/lib/formSchema";
import { parseAxiosError } from "@/lib/parseAxiosError";

export async function userStore(values: userSchemaType) {
  const validation = userSchema.safeParse(values);

  if (!validation.success) {
    return {
      success: false,
      error: "invalid form data",
    };
  }

  try {
    const { data } = await axiosInstance.post(
      `/setup-aplikasi/v1/user`,
      values
    );
    return data;
  } catch (error) {
    return parseAxiosError(error);
  }
}

export async function userUpdate(id: number, values: userSchemaType) {
  const validation = userSchema.safeParse(values);

  if (!validation.success) {
    return {
      success: false,
      error: "invalid form data",
    };
  }

  try {
    const { data } = await axiosInstance.put(
      `/setup-aplikasi/v1/user/${id}`,
      values
    );
    return data;
  } catch (error) {
    return parseAxiosError(error);
  }
}
