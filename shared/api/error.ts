/**
 * Extracts a human-readable message from an Axios error shaped like
 * the IRB Forge API error envelope.
 *
 * Every mutation's onError handler calls this instead of duplicating
 * the ugly type-cast chain in every file.
 */

interface ApiErrorShape {
  response?: {
    data?: {
      error?: { message?: string };
      message?: string;
    };
  };
  message?: string;
}

export function extractApiError(
  err: unknown,
  fallback = "Something went wrong. Try again."
): string {
  const e = err as ApiErrorShape;
  return (
    e?.response?.data?.error?.message ??
    e?.response?.data?.message ??
    e?.message ??
    fallback
  );
}
