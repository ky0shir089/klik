"use server";

import axiosInstance from "@/lib/axios";
import { invoiceStatusSchema, invoiceStatusSchemaType } from "@/lib/formSchema";
import { parseAxiosError } from "@/lib/parseAxiosError";

export async function memo(id: number) {
  try {
    const response = await axiosInstance.get(`/finance/v1/memo-invoice/${id}`, {
      responseType: "arraybuffer",
    });

    const file = new File([response.data], "export.pdf", {
      type: response.headers["content-type"] || "application/octet-stream",
    });

    return file;
  } catch (error) {
    return parseAxiosError(error);
  }
}

export async function invoiceUpdate(
  id: number,
  values: invoiceStatusSchemaType
) {
  const validation = invoiceStatusSchema.safeParse(values);

  if (!validation.success) {
    return {
      success: false,
      message: "invalid form data",
    };
  }

  try {
    const { data } = await axiosInstance.put(
      `/finance/v1/invoice/${id}`,
      values
    );
    return data;
  } catch (error) {
    return parseAxiosError(error);
  }
}
