import { randomUUID } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import type { Express } from 'express';
import { resolveAttachmentFileName } from './attachment-files.util';

let storageRootOverride: string | null = null;

export function getMediaStorageRoot(): string {
  if (storageRootOverride) {
    return storageRootOverride;
  }
  const fromEnv = process.env.MEDIA_STORAGE_PATH?.trim();
  return fromEnv || join(process.cwd(), 'storage', 'media');
}

/** Test hook: override persistent media root for a single process. */
export function setMediaStorageRootForTests(root: string | null): void {
  storageRootOverride = root;
}

export type SavedMediaFile = {
  fileName: string;
  mimeType: string | null;
  sizeBytes: number;
  storagePath: string;
  attachmentIndex: number;
};

export async function saveMulterFilesToStorage(
  files: Express.Multer.File[],
): Promise<SavedMediaFile[]> {
  if (!files.length) {
    return [];
  }
  const root = getMediaStorageRoot();
  const now = new Date();
  const year = String(now.getUTCFullYear());
  const month = String(now.getUTCMonth() + 1).padStart(2, '0');
  const batchDir = join(root, year, month, randomUUID());
  await mkdir(batchDir, { recursive: true });

  const out: SavedMediaFile[] = [];
  for (let i = 0; i < files.length; i++) {
    const f = files[i]!;
    const fileName = resolveAttachmentFileName(f.originalname);
    const storagePath = join(batchDir, fileName);
    await writeFile(storagePath, f.buffer);
    out.push({
      fileName,
      mimeType: f.mimetype?.trim() || null,
      sizeBytes: f.size,
      storagePath,
      attachmentIndex: i,
    });
  }
  return out;
}

export async function copyStorageFileForResend(
  sourceStoragePath: string,
  fileName: string,
): Promise<SavedMediaFile> {
  const root = getMediaStorageRoot();
  const now = new Date();
  const year = String(now.getUTCFullYear());
  const month = String(now.getUTCMonth() + 1).padStart(2, '0');
  const batchDir = join(root, year, month, randomUUID());
  await mkdir(batchDir, { recursive: true });
  const safeName = resolveAttachmentFileName(fileName);
  const storagePath = join(batchDir, safeName);
  const buffer = await readFile(sourceStoragePath);
  await writeFile(storagePath, buffer);
  return {
    fileName: safeName,
    mimeType: null,
    sizeBytes: buffer.byteLength,
    storagePath,
    attachmentIndex: 0,
  };
}

export async function readStorageFileAsMulter(
  saved: Pick<SavedMediaFile, 'storagePath' | 'fileName' | 'mimeType' | 'sizeBytes'>,
): Promise<Express.Multer.File> {
  const buffer = await readFile(saved.storagePath);
  const fileName = saved.fileName;
  const mimeType = saved.mimeType?.trim() || 'application/octet-stream';
  return {
    fieldname: 'files',
    originalname: fileName,
    encoding: '7bit',
    mimetype: mimeType,
    size: saved.sizeBytes || buffer.byteLength,
    buffer,
    destination: '',
    filename: fileName,
    path: saved.storagePath,
    stream: null as unknown as Express.Multer.File['stream'],
  };
}

export function savedMediaToAttachmentPaths(saved: SavedMediaFile[]): string[] {
  return saved.map((s) => s.storagePath);
}
