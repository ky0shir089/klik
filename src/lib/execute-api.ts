import { parseAxiosError } from "./parseAxiosError";

export async function executeApiCall<T>(fn: () => Promise<T>) {
  try {
    return await fn();
  } catch (error) {
    return parseAxiosError(error);
  }
}
