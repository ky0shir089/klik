"use server";

import axiosInstance from "@/lib/axios";
import { workflowSchema, workflowSchemaType } from "@/lib/formSchema";
import { parseAxiosError } from "@/lib/parseAxiosError";

export async function workflowStore(values: workflowSchemaType) {
  const validation = workflowSchema.safeParse(values);

  if (!validation.success) {
    return {
      success: false,
      message: "invalid form data",
    };
  }

  try {
    const { data } = await axiosInstance.post(`/workflow/v1/workflow`, values);
    return data;
  } catch (error) {
    return parseAxiosError(error);
  }
}

export async function workflowUpdate(id: number, values: workflowSchemaType) {
  const validation = workflowSchema.safeParse(values);

  if (!validation.success) {
    return {
      success: false,
      message: "invalid form data",
    };
  }

  try {
    const { data } = await axiosInstance.put(
      `/workflow/v1/workflow/${id}`,
      values,
    );
    return data;
  } catch (error) {
    return parseAxiosError(error);
  }
}
