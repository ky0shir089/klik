"use server";

import axiosInstance from "@/lib/axios";
import { journalInputSchema, journalInputSchemaType } from "@/lib/formSchema";
import { parseAxiosError } from "@/lib/parseAxiosError";

export async function journalInputStore(values: journalInputSchemaType) {
  const validation = journalInputSchema.safeParse(values);

  if (!validation.success) {
    return {
      success: false,
      message: "invalid form data",
    };
  }

  try {
    const { data } = await axiosInstance.post(`/accounting/v1/gl`, values);
    return data;
  } catch (error) {
    return parseAxiosError(error);
  }
}
