import { Zalo, type API } from 'zca-js';
import type { Options } from 'zca-js';
import { toZcaCredentials } from './map-to-zca-credentials';
import type { ZcaPersistedCredentials } from './zca-persisted-credentials';
import { ZcaApiHelper } from './zca-api.helper';

const defaultServerOptions: Partial<Options> = {
  selfListen: false,
  checkUpdate: false,
  logging: false,
};

/**
 * Restore a zca-js `API` from persisted credentials (after QR login on the client).
 * Do not use `loginQR` here — that stays on the frontend.
 */
export async function createZcaApiFromCredentials(
  credentials: ZcaPersistedCredentials,
  zaloOptions?: Partial<Options>,
): Promise<API> {
  const zalo = new Zalo({
    ...defaultServerOptions,
    ...zaloOptions,
  });
  return zalo.login(toZcaCredentials(credentials));
}

export async function createZcaApiHelperFromCredentials(
  credentials: ZcaPersistedCredentials,
  zaloOptions?: Partial<Options>,
): Promise<ZcaApiHelper> {
  const api = await createZcaApiFromCredentials(credentials, zaloOptions);
  return new ZcaApiHelper(api);
}
