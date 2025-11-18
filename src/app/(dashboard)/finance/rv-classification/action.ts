"use server";

import axiosInstance from "@/lib/axios";
import {
  rvClassificationSchema,
  rvClassificationSchemaType,
} from "@/lib/formSchema";
import { parseAxiosError } from "@/lib/parseAxiosError";

interface joinData extends rvClassificationSchemaType {
  klik_bidder_id: number;
  ktp: string;
  name: string;
  branch_id: number;
  branch_name: string;
}

export async function rvUpdate(id: number, values: joinData) {
  const validation = rvClassificationSchema.safeParse(values);

  if (!validation.success) {
    return {
      success: false,
      message: "invalid form data",
    };
  }

  try {
    const { data } = await axiosInstance.put(`/finance/v1/rv/${id}`, values);
    return data;
  } catch (error) {
    return parseAxiosError(error);
  }
}
