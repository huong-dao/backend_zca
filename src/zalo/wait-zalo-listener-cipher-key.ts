import { BadRequestException } from '@nestjs/common';
import { once } from 'node:events';
import type { API } from 'zca-js';

/** Same as `ZaloActionsService` — zca-js chat WebSocket must yield `cipher_key` before some operations. */
export const ZALO_LISTENER_CIPHER_TIMEOUT_MS = 30_000;

export async function waitForZaloListenerCipherKey(
  api: API,
  timeoutMs: number = ZALO_LISTENER_CIPHER_TIMEOUT_MS,
): Promise<void> {
  const timeout = new Promise<never>((_, reject) => {
    setTimeout(() => {
      reject(
        new BadRequestException(
          `Kết nối WebSocket Zalo (nhận khóa mã hóa) vượt quá ${Math.round(
            timeoutMs / 1000,
          )} giây. Hãy kiểm tra mạng, firewall, hoặc thử lại sau.`,
        ),
      );
    }, timeoutMs);
  });
  await Promise.race([once(api.listener, 'cipher_key'), timeout]);
}
