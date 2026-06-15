import type { Prisma } from '@prisma/client';
import type { FindMessagesDto } from './dto/find-messages.dto';

const UUID_V4 =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function buildMessagesWhereInput(
  query: FindMessagesDto,
): Prisma.MessageWhereInput {
  const parts: Prisma.MessageWhereInput[] = [];

  if (query.status) {
    parts.push({ status: query.status });
  }

  const content = query.content?.trim();
  if (content) {
    parts.push({
      content: { contains: content, mode: 'insensitive' },
    });
  }

  const target = query.target?.trim();
  if (target) {
    parts.push({
      OR: [
        {
          group: {
            groupName: { contains: target, mode: 'insensitive' },
          },
        },
        {
          group: {
            originName: { contains: target, mode: 'insensitive' },
          },
        },
        { peerPhone: { contains: target, mode: 'insensitive' } },
      ],
    });
  }

  const sender = query.sender?.trim();
  if (sender) {
    if (UUID_V4.test(sender)) {
      parts.push({ senderId: sender });
    } else {
      parts.push({
        sender: {
          OR: [
            { name: { contains: sender, mode: 'insensitive' } },
            { phone: { contains: sender, mode: 'insensitive' } },
            { zaloId: { contains: sender, mode: 'insensitive' } },
          ],
        },
      });
    }
  }

  const phone = query.phone?.trim();
  if (phone) {
    parts.push({
      OR: [
        { peerPhone: { contains: phone, mode: 'insensitive' } },
        { sender: { phone: { contains: phone, mode: 'insensitive' } } },
      ],
    });
  }

  const sentFrom = query.sentFrom ? new Date(query.sentFrom) : undefined;
  const sentTo = query.sentTo ? new Date(query.sentTo) : undefined;
  if (sentFrom || sentTo) {
    const range: Prisma.DateTimeFilter = {
      ...(sentFrom && { gte: sentFrom }),
      ...(sentTo && { lte: sentTo }),
    };
    parts.push({
      OR: [{ sentAt: range }, { sentAt: null, createdAt: range }],
    });
  }

  if (parts.length === 0) {
    return {};
  }
  return { AND: parts };
}
