import {
  BadRequestException,
  HttpException,
  InternalServerErrorException,
} from '@nestjs/common';
import { ZaloApiError } from 'zca-js';

/**
 * Map errors from zca-js / Zalo HTTP layer to Nest HTTP exceptions.
 * Many Zalo rejections arrive as plain `Error` with Vietnamese text, not `ZaloApiError`.
 */
export function throwHttpForZaloOperationFailure(
  err: unknown,
  fallbackServerMessage = 'Zalo API error.',
): never {
  if (err instanceof HttpException) {
    throw err;
  }

  if (err instanceof ZaloApiError) {
    const code = err.code != null ? `[${err.code}] ` : '';
    throw new BadRequestException(
      `${code}${err.message || 'Zalo API rejected the operation.'}`,
    );
  }

  const message = err instanceof Error ? err.message : String(err);

  if (isLikelyZaloClientSideRejection(message)) {
    throw new BadRequestException(message);
  }

  throw new InternalServerErrorException(
    message && message.length > 0 ? message : fallbackServerMessage,
  );
}

function isLikelyZaloClientSideRejection(message: string): boolean {
  if (!message || message.length > 800) {
    return false;
  }
  return /Tham số|không hợp lệ|Không thể|từ chối|hết hạn|sai|Invalid param|invalid parameter|not in group|not a member|permission|blocked/i.test(
    message,
  );
}
