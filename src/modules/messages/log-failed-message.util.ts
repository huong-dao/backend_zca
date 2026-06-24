import { Logger } from '@nestjs/common';
import { PrismaService } from '../../database/prisma/prisma.service';

const logger = new Logger('FailedMessageLog');

export type LogFailedMessageInput = {
  senderId: string;
  content: string;
  failureReason: string;
  groupId?: string | null;
  peerPhone?: string | null;
  uidFrom?: string | null;
};

export async function logFailedMessage(
  prisma: PrismaService,
  input: LogFailedMessageInput,
): Promise<string | null> {
  const failureReason = input.failureReason.trim();
  if (!failureReason) {
    return null;
  }

  try {
    const row = await prisma.message.create({
      data: {
        content: input.content,
        senderId: input.senderId,
        groupId: input.groupId ?? null,
        peerPhone: input.peerPhone ?? null,
        uidFrom: input.uidFrom?.trim() || null,
        sentAt: null,
        status: 'FAILED',
        failureReason,
      },
      select: { id: true },
    });
    return row.id;
  } catch (e) {
    logger.warn(
      `Could not persist failed message log: ${e instanceof Error ? e.message : String(e)}`,
    );
    return null;
  }
}
