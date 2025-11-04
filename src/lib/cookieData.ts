import { cookies } from "next/headers";

export async function getCookieData(data: string) {
  const cookieStore = await cookies();
  const tokenData = cookieStore.get(data)?.value;
  return new Promise((resolve) =>
    setTimeout(() => {
      resolve(tokenData);
    }, 1000)
  );
}
