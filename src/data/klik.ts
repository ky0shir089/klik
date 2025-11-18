"use server";

import { parseAxiosError } from "@/lib/parseAxiosError";
import axios from "axios";

export async function getBidders(date: string) {
  try {
    const { data } = await axios.get(
      "https://api.kliklelang.co.id/api/report/v3/hasil_lelang",
      {
        headers: {
          Authorization:
            "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdXRob3JpemVkIjp0cnVlLCJjbGllbnRfaWQiOjE1NTM0LCJjbGllbnRfcGxhdGZvcm0iOiJtb2JpbGUiLCJjbGllbnRfcm9sZSI6ImJhbGFuZyIsImNsaWVudF90eXBlIjoiaGVhZG9mZmljZSIsImV4cCI6MTc2NDgzNTQ3NX0.dYhlMY77tx69kznw8fU4IF6FYPFceI_ZlvnOLOUVwxs",
        },
        params: {
          date_start: date,
          date_end: date,
        },
      }
    );
    return data;
  } catch (error) {
    return parseAxiosError(error);
  }
}
export type getBiddersType = Awaited<ReturnType<typeof getBidders>>[0];
