import { cookies } from "next/headers";

export async function getCookieData(data: string) {
  const cookieStore = await cookies();
  const cookieData = cookieStore.get(data)?.value;
  return new Promise((resolve) =>
    setTimeout(() => {
      resolve(cookieData);
    }, 1000)
  );
}
