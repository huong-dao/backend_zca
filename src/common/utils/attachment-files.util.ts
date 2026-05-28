import { randomUUID } from 'node:crypto';
import { mkdir, rm, unlink, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { basename, dirname, join } from 'node:path';
import type { Express } from 'express';
import type { ZaloSendBubbleIds } from '../../zalo/parse-zalo-send-message-result';

/** Display name shared by DB content and Zalo attachment basename. */
export function resolveAttachmentFileName(
  originalname: string | undefined,
): string {
  const base = basename((originalname || 'file').trim() || 'file');
  return base.replace(/[<>:"/\\|?*\x00-\x1f]/g, '_').slice(0, 255);
}

export function attachmentDisplayNames(
  files: Express.Multer.File[],
): string[] {
  return files.map((f) => resolveAttachmentFileName(f.originalname));
}

export function buildAttachmentContentForDb(
  textPart: string,
  files: Express.Multer.File[],
): string {
  const names = attachmentDisplayNames(files).join(', ');
  if (textPart && files.length) {
    return `${textPart}\n\n(Đính kèm: ${names})`;
  }
  if (textPart) {
    return textPart;
  }
  return `Đính kèm: ${names}`;
}

export function buildAttachmentBubbleContents(
  textPart: string,
  files: Express.Multer.File[],
  bubbles: ZaloSendBubbleIds[],
  fallbackSingle: string,
): string[] {
  if (bubbles.length === 0) {
    return [fallbackSingle];
  }
  const names = attachmentDisplayNames(files);
  return bubbles.map((b) => {
    if (b.source === 'message') {
      return textPart.length > 0 ? textPart : '(tin nhắn)';
    }
    const i = b.attachmentIndex ?? 0;
    const name = names[i] || `file_${i + 1}`;
    return `Đính kèm: ${name}`;
  });
}

/**
 * zca-js uses the local path basename as the attachment name on Zalo.
 * Each file is written in its own temp subdir so the basename stays the original
 * file name without adding UUID prefixes to the visible name.
 */
export async function writeMulterAttachmentsToTemp(
  files: Express.Multer.File[],
): Promise<string[]> {
  const paths: string[] = [];
  for (const f of files) {
    const name = resolveAttachmentFileName(f.originalname);
    const dir = join(tmpdir(), `zca-attach-${randomUUID()}`);
    await mkdir(dir, { recursive: true });
    const p = join(dir, name);
    await writeFile(p, f.buffer);
    paths.push(p);
  }
  return paths;
}

export async function cleanupAttachmentTempPaths(
  paths: string[],
): Promise<void> {
  if (!paths.length) {
    return;
  }
  const dirs = [...new Set(paths.map((p) => dirname(p)))];
  await Promise.all([
    ...paths.map((p) => unlink(p).catch(() => undefined)),
    ...dirs.map((d) =>
      rm(d, { recursive: true, force: true }).catch(() => undefined),
    ),
  ]);
}
