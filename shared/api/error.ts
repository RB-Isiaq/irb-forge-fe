/**
 * Normalized error shape produced by the Axios response interceptor.
 * Every onError handler receives this — no raw Axios objects needed.
 *
 * - code     e.g. "BAD_REQUEST" | "UNAUTHORIZED" | "CONFLICT" …
 * - message  Human-readable summary, safe to show in a toast
 * - details  Field-level validation messages (empty for non-validation errors)
 */
export interface NormalizedApiError {
  code: string;
  message: string;
  details: Array<{ message: string }>;
}

/** Pull the human-readable toast message out of a caught mutation error. */
export function extractApiError(
  err: unknown,
  fallback = "Something went wrong. Try again."
): string {
  const e = err as Partial<NormalizedApiError>;
  return e?.message ?? fallback;
}

/**
 * Pull field-level validation messages out of a caught mutation error.
 * Returns an empty array for non-validation errors.
 *
 * @example
 * onError: (err) => {
 *   const msgs = extractApiDetails(err);
 *   if (msgs.length) setError("root", { message: msgs.join(" · ") });
 *   else toast.error(extractApiError(err));
 * }
 */
export function extractApiDetails(err: unknown): string[] {
  const e = err as Partial<NormalizedApiError>;
  return (e?.details ?? []).map((d) => d.message);
}
