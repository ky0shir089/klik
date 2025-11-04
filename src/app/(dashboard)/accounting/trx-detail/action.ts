"use server";

import axiosInstance from "@/lib/axios";
import { trxDtlSchema, trxDtlSchemaType } from "@/lib/formSchema";
import { parseAxiosError } from "@/lib/parseAxiosError";

export async function trxDtlStore(values: trxDtlSchemaType) {
  const validation = trxDtlSchema.safeParse(values);

  if (!validation.success) {
    return {
      success: false,
      message: "invalid form data",
    };
  }

  try {
    const { data } = await axiosInstance.post(`/accounting/v1/trx-dtl`, values);
    return data;
  } catch (error) {
    return parseAxiosError(error);
  }
}

export async function trxDtlUpdate(id: number, values: trxDtlSchemaType) {
  const validation = trxDtlSchema.safeParse(values);

  if (!validation.success) {
    return {
      success: false,
      message: "invalid form data",
    };
  }

  try {
    const { data } = await axiosInstance.put(
      `/accounting/v1/trx-dtl/${id}`,
      values
    );
    return data;
  } catch (error) {
    return parseAxiosError(error);
  }
}
