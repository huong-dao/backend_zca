/** Extract user text from stored `Message.content` when attachments were merged into one row. */
export function extractTextFromStoredContent(
  content: string,
  hasAttachments: boolean,
): string {
  const trimmed = content.trim();
  if (!hasAttachments) {
    return trimmed;
  }
  const marker = '\n\n(Đính kèm:';
  const idx = trimmed.indexOf(marker);
  if (idx >= 0) {
    return trimmed.slice(0, idx).trim();
  }
  if (trimmed.startsWith('Đính kèm:')) {
    return '';
  }
  return trimmed;
}
