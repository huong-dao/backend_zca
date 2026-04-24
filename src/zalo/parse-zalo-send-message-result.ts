/**
 * `sendMessage` HTTP response is not the same as WebSocket `TMessage`; it may omit
 * `cliMsgId` or use `clientId`. After enabling `selfListen` (see `ZaloActionsService`),
 * a group self-echo may carry full `TMessage` fields, which we merge in when needed.
 *
 * zca-js may produce **several** Zalo “bubbles” in one `sendMessage` call (e.g. one text
 * `responses.message` plus one entry per file in `responses.attachment[]`), each with its
 * own `msgId` / `clientId` — see `listZaloSendBubbleIds`.
 */
export function parseMsgBlock(block: unknown): {
  messageZaloId: string | null;
  cliMsgId: string | null;
} {
  if (!block || typeof block !== 'object') {
    return { messageZaloId: null, cliMsgId: null };
  }
  const m = block as Record<string, unknown>;
  const messageZaloId =
    m.msgId != null
      ? String(m.msgId)
      : m.messageId != null
        ? String(m.messageId)
        : m.globalMsgId != null
          ? String(m.globalMsgId)
          : m.realMsgId != null
            ? String(m.realMsgId)
            : null;
  const cliMsgId =
    m.cliMsgId != null
      ? String(m.cliMsgId)
      : m.cli_msg_id != null
        ? String(m.cli_msg_id)
        : m.clientId != null
          ? String(m.clientId)
          : m.client_id != null
            ? String(m.client_id)
            : null;

  let out = { messageZaloId, cliMsgId };
  const nested = m.data;
  if (nested && typeof nested === 'object') {
    const inner = parseMsgBlock(nested);
    out = {
      messageZaloId: out.messageZaloId ?? inner.messageZaloId,
      cliMsgId: out.cliMsgId ?? inner.cliMsgId,
    };
  }
  return out;
}

/** One Zalo chat bubble: either the text `message` block or one `attachment` element. */
export type ZaloSendBubbleIds = {
  messageZaloId: string | null;
  cliMsgId: string | null;
  source: 'message' | 'attachment';
  /** Index into the zca `attachment` array / uploaded `files` order. */
  attachmentIndex?: number;
};

/**
 * Ordered list of per-bubble ids from `sendMessage` result (`message` first, then each
 * `attachment[]` item). Use this to persist one DB row per Zalo bubble.
 */
export function listZaloSendBubbleIds(res: unknown): ZaloSendBubbleIds[] {
  if (!res || typeof res !== 'object') {
    return [];
  }
  const r = res as Record<string, unknown>;
  const out: ZaloSendBubbleIds[] = [];
  if (r.message != null && typeof r.message === 'object') {
    out.push({
      ...parseMsgBlock(r.message),
      source: 'message',
    });
  }
  const atts = r.attachment;
  if (Array.isArray(atts)) {
    atts.forEach((a, i) => {
      out.push({
        ...parseMsgBlock(a),
        source: 'attachment',
        attachmentIndex: i,
      });
    });
  }
  return out;
}

/**
 * Merged “primary” id pair (any non-null from any bubble) — legacy single-row use.
 */
export function extractIdsFromZaloSendResult(res: unknown): {
  messageZaloId: string | null;
  cliMsgId: string | null;
} {
  const parts = listZaloSendBubbleIds(res);
  if (parts.length === 0) {
    if (!res || typeof res !== 'object') {
      return { messageZaloId: null, cliMsgId: null };
    }
    const r = res as Record<string, unknown>;
    const merge = (
      a: { messageZaloId: string | null; cliMsgId: string | null },
      b: { messageZaloId: string | null; cliMsgId: string | null },
    ) => ({
      messageZaloId: a.messageZaloId ?? b.messageZaloId,
      cliMsgId: a.cliMsgId ?? b.cliMsgId,
    });
    let acc = { messageZaloId: null as string | null, cliMsgId: null as string | null };
    acc = merge(acc, parseMsgBlock(r.message));
    const atts = r.attachment;
    if (Array.isArray(atts)) {
      for (const a of atts) {
        acc = merge(acc, parseMsgBlock(a));
      }
    }
    acc = merge(acc, parseMsgBlock(r));
    return { messageZaloId: acc.messageZaloId, cliMsgId: acc.cliMsgId };
  }
  let messageZaloId: string | null = null;
  let cliMsgId: string | null = null;
  for (const p of parts) {
    messageZaloId = messageZaloId ?? p.messageZaloId;
    cliMsgId = cliMsgId ?? p.cliMsgId;
  }
  return { messageZaloId, cliMsgId };
}

/** Shallow-merge `cliMsgId` into a copy of the zca `sendMessage` return value for re-parsing. */
export function mergeCliMsgIdIntoZaloSendResult(
  res: unknown,
  cliMsgId: string,
  fallbackMsgId: string | null,
): unknown {
  if (!res || typeof res !== 'object') {
    return res;
  }
  const r = { ...(res as Record<string, unknown>) };
  const msg = r.message;
  if (msg && typeof msg === 'object') {
    r.message = { ...(msg as Record<string, unknown>), cliMsgId };
    return r;
  }
  const atts = r.attachment;
  if (Array.isArray(atts) && atts[0] && typeof atts[0] === 'object') {
    const first = { ...(atts[0] as Record<string, unknown>), cliMsgId };
    r.attachment = [first, ...atts.slice(1)];
    return r;
  }
  r.message = {
    msgId: fallbackMsgId ?? undefined,
    cliMsgId,
  };
  return r;
}
