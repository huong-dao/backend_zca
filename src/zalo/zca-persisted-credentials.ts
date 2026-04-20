/**
 * Shape persisted by `ZaloLoginSession` / frontend (matches encrypted payload).
 * zca-js `Credentials` uses `cookie` (singular); use `toZcaCredentials` to convert.
 */
export type ZcaPersistedCredentials = {
  imei: string;
  userAgent: string;
  cookies: Record<string, unknown>[];
};
