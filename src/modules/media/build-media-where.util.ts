import type { Prisma } from '@prisma/client';
import { FindMediaDto } from './dto/find-media.dto';

export function buildMediaWhereInput(
  query: FindMediaDto,
): Prisma.MediaWhereInput {
  const where: Prisma.MediaWhereInput = {};

  const fileName = query.fileName?.trim();
  if (fileName) {
    where.fileName = { contains: fileName, mode: 'insensitive' };
  }

  const sentFrom = query.sentFrom?.trim();
  const sentTo = query.sentTo?.trim();
  if (sentFrom || sentTo) {
    where.sentAt = {};
    if (sentFrom) {
      where.sentAt.gte = new Date(sentFrom);
    }
    if (sentTo) {
      where.sentAt.lte = new Date(sentTo);
    }
  }

  return where;
}
