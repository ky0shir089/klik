export interface UnauthorizedResult {
  isUnauthorized: true;
  message?: string;
}

export function isUnauthorizedResult(
  value: unknown,
): value is UnauthorizedResult {
  return (
    typeof value === "object" &&
    value !== null &&
    "isUnauthorized" in value &&
    value.isUnauthorized === true
  );
}
