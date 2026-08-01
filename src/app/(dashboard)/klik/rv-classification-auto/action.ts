"use server";

import axiosInstance from "@/lib/axios";
import { executeApiCall } from "@/lib/execute-api";
import {
  vaStoreSchema,
  vaStoreSchemaType,
  withdrawSchema,
  withdrawSchemaType,
} from "@/lib/formSchema";
import { parseAxiosError } from "@/lib/parseAxiosError";
import { revalidatePath } from "next/cache";

export async function vaStore(values: vaStoreSchemaType) {
  const validation = vaStoreSchema.safeParse(values);

  if (!validation.success) {
    return {
      success: false,
      message: "invalid form data",
    };
  }

  try {
    const { data } = await axiosInstance.post(
      `/finance/v1/va-instant`,
      validation.data,
    );
    revalidatePath(`/klik/rv-classification-auto`);
    return data;
  } catch (error) {
    return parseAxiosError(error);
  }
}

export async function withdraw(values: withdrawSchemaType) {
  const validation = withdrawSchema.safeParse(values);

  if (!validation.success) {
    return {
      success: false,
      message: "invalid form data",
    };
  }

  try {
    const { data } = await axiosInstance.post(
      `/finance/v1/xendit`,
      validation.data,
    );
    revalidatePath(`/finance/v1/xendit`);
    return data;
  } catch (error) {
    return parseAxiosError(error);
  }
}

export async function downloadVaAuto(fromDate: string, toDate: string) {
  return executeApiCall(async () => {
    const response = await axiosInstance.post(
      `/report/v1/report-classification-auto`,
      { from_date: fromDate, to_date: toDate },
      {
        responseType: "arraybuffer",
      },
    );

    const file = new File([response.data], "list-va-auto.xlsx", {
      type:
        typeof response.headers["content-type"] === "string"
          ? response.headers["content-type"]
          : "application/octet-stream",
    });

    return file;
  });
}
