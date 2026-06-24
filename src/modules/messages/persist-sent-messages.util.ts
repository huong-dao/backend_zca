import type { Express } from 'express';
import type { Prisma } from '@prisma/client';
import {
  buildAttachmentBubbleContents,
  buildAttachmentContentForDb,
} from '../../common/utils/attachment-files.util';
import type { SavedMediaFile } from '../../common/utils/media-storage.util';
import { PrismaService } from '../../database/prisma/prisma.service';
import {
  extractIdsFromZaloSendResult,
  listZaloSendBubbleIds,
} from '../../zalo/parse-zalo-send-message-result';

export const messageCreateSelect = {
  id: true,
  messageZaloId: true,
  cliMsgId: true,
  uidFrom: true,
  content: true,
  senderId: true,
  groupId: true,
  peerPhone: true,
  parentId: true,
  sentAt: true,
  status: true,
  failureReason: true,
  createdAt: true,
} as const;

export type PersistedMessageRow = Prisma.MessageGetPayload<{
  select: typeof messageCreateSelect;
}>;

export type PersistSentMessagesCtx = {
  senderId: string;
  groupId: string | null;
  peerPhone: string | null;
  zaloUid: string;
};

export async function persistSentMessagesWithMedia(
  prisma: PrismaService,
  result: unknown,
  ctx: PersistSentMessagesCtx,
  textPart: string,
  fileList: Express.Multer.File[],
  savedMedia: SavedMediaFile[],
): Promise<PersistedMessageRow[]> {
  const contentForDb = buildAttachmentContentForDb(textPart, fileList);
  const bubbles = listZaloSendBubbleIds(result);
  const sentAt = new Date();

  if (bubbles.length === 0) {
    const { messageZaloId, cliMsgId } = extractIdsFromZaloSendResult(result);
    return prisma.$transaction(async (tx) => {
      const messageRow = await tx.message.create({
        data: {
          content: contentForDb,
          senderId: ctx.senderId,
          groupId: ctx.groupId,
          peerPhone: ctx.peerPhone,
          messageZaloId,
          cliMsgId,
          uidFrom: ctx.zaloUid,
          sentAt,
          status: 'SENT',
        },
        select: messageCreateSelect,
      });
      await createMediaForMessageRows(tx, sentAt, [
        { messageId: messageRow.id, savedMedia },
      ]);
      return [messageRow];
    });
  }

  const contents = buildAttachmentBubbleContents(
    textPart,
    fileList,
    bubbles,
    contentForDb,
  );

  return prisma.$transaction(async (tx) => {
    const rows: PersistedMessageRow[] = [];
    const mediaLinks: Array<{
      messageId: string;
      savedMedia: SavedMediaFile[];
    }> = [];
    let parentRowId: string | null = null;

    for (let idx = 0; idx < bubbles.length; idx++) {
      const bubble = bubbles[idx]!;
      const content = contents[idx] ?? contentForDb;
      const row = await tx.message.create({
        data: {
          content,
          senderId: ctx.senderId,
          groupId: ctx.groupId,
          peerPhone: ctx.peerPhone,
          messageZaloId: bubble.messageZaloId,
          cliMsgId: bubble.cliMsgId,
          uidFrom: ctx.zaloUid,
          sentAt,
          status: 'SENT',
          parentId: idx === 0 ? null : parentRowId!,
        },
        select: messageCreateSelect,
      });
      if (idx === 0) {
        parentRowId = row.id;
      }
      if (bubble.source === 'attachment' && bubble.attachmentIndex != null) {
        const media = savedMedia.filter(
          (m) => m.attachmentIndex === bubble.attachmentIndex,
        );
        if (media.length) {
          mediaLinks.push({ messageId: row.id, savedMedia: media });
        }
      }
      rows.push(row);
    }

    await createMediaForMessageRows(tx, sentAt, mediaLinks);
    return rows;
  });
}

export async function linkMediaToFailedMessage(
  prisma: PrismaService,
  messageId: string,
  sentAt: Date,
  savedMedia: SavedMediaFile[],
): Promise<void> {
  if (!savedMedia.length) {
    return;
  }
  await prisma.$transaction(async (tx) => {
    await createMediaForMessageRows(tx, sentAt, [
      { messageId, savedMedia },
    ]);
  });
}

async function createMediaForMessageRows(
  tx: Prisma.TransactionClient,
  sentAt: Date,
  links: Array<{ messageId: string; savedMedia: SavedMediaFile[] }>,
): Promise<void> {
  for (const link of links) {
    for (const m of link.savedMedia) {
      await tx.media.create({
        data: {
          messageId: link.messageId,
          fileName: m.fileName,
          mimeType: m.mimeType,
          sizeBytes: m.sizeBytes,
          storagePath: m.storagePath,
          sentAt,
          attachmentIndex: m.attachmentIndex,
        },
      });
    }
  }
}
