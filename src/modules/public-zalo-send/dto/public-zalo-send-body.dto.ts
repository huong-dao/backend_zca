import { Allow } from 'class-validator';

/**
 * Chỉ `@Allow()`: tránh 400 từ global `ValidationPipe` (whitelist) nhưng không ràng buộc kiểu/độ dài ở đây
 * — `PublicZaloSendService` trả `code: VALIDATION` (HTTP 200) khi cần.
 */
export class PublicZaloSendBodyDto {
  @Allow()
  target?: string;

  @Allow()
  content?: string;
}
