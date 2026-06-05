"use server";

import axiosInstance from "@/lib/axios";
import {
  forgotPasswordSchema,
  ForgotPasswordSchemaType,
} from "@/lib/formSchema";
import { parseAxiosError } from "@/lib/parseAxiosError";

export async function forgotPassword(values: ForgotPasswordSchemaType) {
  const validation = forgotPasswordSchema.safeParse(values);

  if (!validation.success) {
    return {
      success: false,
      message: "invalid form data",
    };
  }

  try {
    const { data } = await axiosInstance.post(`/auth/forgot-password`, values);
    return data;
  } catch (error) {
    return parseAxiosError(error);
  }
}
