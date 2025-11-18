"use server";

import { env } from "@/lib/env";
import { parseAxiosError } from "@/lib/parseAxiosError";
import axios from "axios";

export async function getBidders(date: string) {
  try {
    const { data } = await axios.get(
      "https://api.kliklelang.co.id/api/report/v3/hasil_lelang",
      {
        headers: {
          Authorization: `Bearer ${env.KLIK_API_TOKEN}`,
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
