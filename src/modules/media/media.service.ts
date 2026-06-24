import {
  Injectable,
  NotFoundException,
  StreamableFile,
} from '@nestjs/common';
import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import { basename } from 'node:path';
import { deletePersistentMediaFile } from '../../common/utils/media-storage.util';
import { PrismaService } from '../../database/prisma/prisma.service';
import { buildMediaWhereInput } from './build-media-where.util';
import { FindMediaDto } from './dto/find-media.dto';

const mediaSelect = {
  id: true,
  messageId: true,
  fileName: true,
  mimeType: true,
  sizeBytes: true,
  sentAt: true,
  attachmentIndex: true,
  createdAt: true,
  message: {
    select: {
      id: true,
      senderId: true,
      groupId: true,
      peerPhone: true,
      status: true,
    },
  },
} as const;

const mediaStorageSelect = {
  id: true,
  fileName: true,
  storagePath: true,
} as const;

@Injectable()
export class MediaService {
  constructor(private readonly prismaService: PrismaService) {}

  async findAll(query: FindMediaDto) {
    const { page = 1, limit = 20 } = query;
    const skip = (page - 1) * limit;
    const where = buildMediaWhereInput(query);

    const [total, data] = await this.prismaService.$transaction([
      this.prismaService.media.count({ where }),
      this.prismaService.media.findMany({
        where,
        skip,
        take: limit,
        select: mediaSelect,
        orderBy: [{ sentAt: 'desc' }, { id: 'desc' }],
      }),
    ]);

    return {
      data,
      meta: {
        page,
        limit,
        total,
        totalPages: total === 0 ? 0 : Math.ceil(total / limit),
      },
    };
  }

  async streamFile(id: string): Promise<StreamableFile> {
    const row = await this.prismaService.media.findUnique({
      where: { id },
      select: {
        id: true,
        fileName: true,
        mimeType: true,
        storagePath: true,
      },
    });
    if (!row) {
      throw new NotFoundException('Media not found.');
    }

    try {
      await stat(row.storagePath);
    } catch {
      throw new NotFoundException('Media file is missing on storage.');
    }

    const stream = createReadStream(row.storagePath);
    const mimeType = row.mimeType?.trim() || 'application/octet-stream';
    return new StreamableFile(stream, {
      type: mimeType,
      disposition: `inline; filename="${basename(row.fileName)}"`,
    });
  }

  async remove(id: string) {
    const row = await this.prismaService.media.findUnique({
      where: { id },
      select: mediaStorageSelect,
    });
    if (!row) {
      throw new NotFoundException('Media not found.');
    }

    await deletePersistentMediaFile(row.storagePath);
    await this.prismaService.media.delete({ where: { id: row.id } });

    return {
      message: 'Media deleted.',
      id: row.id,
      fileName: row.fileName,
    };
  }

  async removeMany(ids: string[]) {
    const uniqueIds = [...new Set(ids)];
    const rows = await this.prismaService.media.findMany({
      where: { id: { in: uniqueIds } },
      select: mediaStorageSelect,
    });

    if (rows.length !== uniqueIds.length) {
      const found = new Set(rows.map((r) => r.id));
      const missing = uniqueIds.filter((id) => !found.has(id));
      throw new NotFoundException(
        `Media not found: ${missing.join(', ')}`,
      );
    }

    for (const row of rows) {
      await deletePersistentMediaFile(row.storagePath);
    }

    await this.prismaService.media.deleteMany({
      where: { id: { in: uniqueIds } },
    });

    return {
      message: 'Media deleted.',
      deletedCount: rows.length,
      ids: uniqueIds,
    };
  }
}
