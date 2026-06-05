"use server";

import axiosInstance from "@/lib/axios";
import { resetPasswordSchema, resetPasswordSchemaType } from "@/lib/formSchema";
import { parseAxiosError } from "@/lib/parseAxiosError";

export async function resetPassword(values: resetPasswordSchemaType) {
  const validation = resetPasswordSchema.safeParse(values);

  if (!validation.success) {
    return {
      success: false,
      message: "invalid form data",
    };
  }

  try {
    const { data } = await axiosInstance.post(`/auth/reset-password`, values);
    return data;
  } catch (error) {
    return parseAxiosError(error);
  }
}
