import { env } from "./env";

export function getImage(path: string) {
  return `${env.NEXT_PUBLIC_BASE_URL}/storage/${path}`;
}
