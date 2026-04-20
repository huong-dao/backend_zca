import type { Credentials } from 'zca-js';
import type { ZcaPersistedCredentials } from './zca-persisted-credentials';

export function toZcaCredentials(
  creds: ZcaPersistedCredentials,
): Credentials {
  return {
    imei: creds.imei,
    userAgent: creds.userAgent,
    cookie: creds.cookies as Credentials['cookie'],
  };
}
