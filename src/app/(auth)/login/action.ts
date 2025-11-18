"use server";

import axiosInstance from "@/lib/axios";
import { signInSchema, signInSchemaType } from "@/lib/formSchema";
import { parseAxiosError } from "@/lib/parseAxiosError";
import { cookies } from "next/headers";

export async function signIn(values: signInSchemaType) {
  const validation = signInSchema.safeParse(values);

  if (!validation.success) {
    return {
      success: false,
      message: "invalid form data",
    };
  }

  const today = new Date();
  const endOfDay = today.setHours(23, 59, 59, 999);

  try {
    const { data } = await axiosInstance.post(`/auth/sign-in`, values);

    const cookieStore = await cookies();

    const isProd = process.env.NODE_ENV === "production" && !process.env.LOCAL_DEV;

    cookieStore.set("user", JSON.stringify(data.data), {
      path: "/",
      expires: endOfDay,
      httpOnly: true,
      secure: isProd,
      sameSite: "lax",
    });

    cookieStore.set("access_token", data.access_token, {
      path: "/",
      expires: endOfDay,
      httpOnly: true,
      secure: isProd,
      sameSite: "lax",
    });

    return data;
  } catch (error) {
    return parseAxiosError(error);
  }
}
