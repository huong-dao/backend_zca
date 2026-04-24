/**
 * Mọi response HTTP 200: `{ code, message, data? }` — `message` luôn có (tiếng Việt mô tả theo mã + chi tiết nếu có). Xem `docs/Public_Zalo_Send_API.mdc`.
 */
export const PublicZaloSendCode = {
  OK: 0,
  INVALID_API_KEY: 1,
  VALIDATION: 2,
  TARGET_EMPTY: 3,
  CONTENT_OR_FILES_REQUIRED: 4,
  GROUP_NOT_FOUND: 5,
  MASTER_NOT_FOUND: 6,
  NO_CHILD_ACCOUNT: 7,
  CHILD_INACTIVE_OR_NO_ZALO: 8,
  NO_ZALO_SESSION: 9,
  FRIEND_SETUP_FAILED: 10,
  ADD_TO_GROUP_FAILED: 11,
  FIND_USER_FAILED: 12,
  SEND_FAILED: 13,
  /** Cùng logic `message_interval` với `POST /messages/send` (child + nhóm hoặc DM cùng số). */
  MESSAGE_INTERVAL_NOT_ELAPSED: 14,
  INTERNAL: 99,
} as const;

export type PublicZaloSendCodeValue =
  (typeof PublicZaloSendCode)[keyof typeof PublicZaloSendCode];
