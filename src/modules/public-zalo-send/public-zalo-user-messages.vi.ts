import { PublicZaloSendCode, type PublicZaloSendCodeValue } from './public-zalo-send-codes';

const LABEL_VI: Record<PublicZaloSendCodeValue, string> = {
  [PublicZaloSendCode.OK]:
    'Thành công: đã gửi tin qua Zalo và lưu bản ghi tin nhắn trong hệ thống.',
  [PublicZaloSendCode.INVALID_API_KEY]:
    'Lỗi xác thực API: thiếu, sai hoặc API key đã tắt.',
  [PublicZaloSendCode.VALIDATION]:
    'Dữ liệu không hợp lệ hoặc cấu hình hệ thống message_interval thiếu/sai.',
  [PublicZaloSendCode.TARGET_EMPTY]: 'Thiếu mục tiêu gửi (target).',
  [PublicZaloSendCode.CONTENT_OR_FILES_REQUIRED]:
    'Cần ít nhất nội dung chữ hoặc file đính kèm.',
  [PublicZaloSendCode.GROUP_NOT_FOUND]:
    'Không tìm thấy nhóm trong hệ thống theo tên (groupName) đã cung cấp.',
  [PublicZaloSendCode.MASTER_NOT_FOUND]:
    'Chưa có tài khoản master cấu hình đúng cho nhóm này, hoặc thiếu group_zalo_id trên bản ghi liên kết.',
  [PublicZaloSendCode.NO_CHILD_ACCOUNT]:
    'Không có tài khoản child dùng để gửi (tự động chọn từ cấu hình).',
  [PublicZaloSendCode.CHILD_INACTIVE_OR_NO_ZALO]:
    'Tài khoản child chưa active, thiếu zalo_id hoặc thiếu số điện thoại cần cho quy trình.',
  [PublicZaloSendCode.NO_ZALO_SESSION]:
    'Chưa có phiên Zalo hợp lệ (QR) cho tài khoản child; cần đăng nhập lại bằng mã QR.',
  [PublicZaloSendCode.FRIEND_SETUP_FAILED]:
    'Không thiết lập được kết bạn master — child tự động.',
  [PublicZaloSendCode.ADD_TO_GROUP_FAILED]:
    'Không thể thêm tài khoản child vào nhóm trên Zalo (theo tài khoản master).',
  [PublicZaloSendCode.FIND_USER_FAILED]:
    'Không tìm thấy tài khoản Zalo theo số điện thoại (findUser) hoặc tìm thất bại.',
  [PublicZaloSendCode.SEND_FAILED]: 'Gửi tin qua giao thức Zalo thất bại.',
  [PublicZaloSendCode.MESSAGE_INTERVAL_NOT_ELAPSED]:
    'Gửi quá sớm: cần chờ theo cấu hình message_interval (cùng child + cùng nhóm, hoặc cùng số khi gửi DM; peerPhone dùng để đếm lần gửi).',
  [PublicZaloSendCode.INTERNAL]: 'Lỗi hệ thống chưa xử lý được.',
};

/**
 * Luôn trả nội dung tiếng Việt rõ nghĩa: nhãn theo mã + chi tiết (kỹ thuật) nếu có.
 */
export function formatPublicZaloUserMessage(
  code: PublicZaloSendCodeValue,
  detail?: string,
): string {
  const base = LABEL_VI[code] ?? 'Lỗi không xác định.';
  if (!detail?.trim()) {
    return base;
  }
  return `${base} — ${detail.trim()}`;
}
