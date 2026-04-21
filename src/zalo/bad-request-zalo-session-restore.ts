import { BadRequestException } from '@nestjs/common';

/**
 * `createZcaApiFromCredentials` failed — almost always expired/invalid cookies after `zalo.login(...)`.
 * Use 400 (not 500) so clients can prompt re-QR without treating it as a server bug.
 */
export function badRequestForZaloSessionRestoreFailure(
  detail: string,
): BadRequestException {
  return new BadRequestException(
    `Zalo session could not be restored from stored credentials (cookies may be expired or revoked). Log in with QR again for this Zalo account and upsert zalo_login_sessions. Zalo: ${detail}`,
  );
}
