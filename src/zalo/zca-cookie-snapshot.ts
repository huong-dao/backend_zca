import type { API } from 'zca-js';
import type { Cookie } from 'tough-cookie';

const DEFAULT_ZALO_DOMAINS = [
  '.zalo.me',
  'zalo.me',
  'chat.zalo.me',
  'id.zalo.me',
];

function domainToOrigin(domain: string): string {
  const host = domain.startsWith('.') ? domain.slice(1) : domain;
  return `https://${host}`;
}

/**
 * Serialize cookies from zca-js jar after API calls (for persisting refreshed session).
 */
export async function snapshotSerializedCookiesFromApi(
  api: API,
  hintCookies: Record<string, unknown>[],
): Promise<Record<string, unknown>[]> {
  const jar = api.getCookie();
  const domains = new Set<string>(DEFAULT_ZALO_DOMAINS);
  for (const c of hintCookies) {
    const d = c?.domain;
    if (typeof d === 'string' && d.length > 0) {
      domains.add(d);
    }
  }

  const merged = new Map<string, Record<string, unknown>>();

  for (const domain of domains) {
    const url = domainToOrigin(domain);
    const cookies: Cookie[] = await jar.getCookies(url, {
      allPaths: true,
      expire: false,
    });
    for (const cookie of cookies) {
      const row = cookie.toJSON() as Record<string, unknown>;
      const key = `${row.domain ?? ''}|${row.path ?? ''}|${row.key ?? ''}`;
      merged.set(key, row);
    }
  }

  return [...merged.values()];
}
