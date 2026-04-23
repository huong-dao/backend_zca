export default () => ({
  app: {
    port: Number.parseInt(process.env.PORT ?? '3000', 10),
    frontendOrigin: process.env.FRONTEND_ORIGIN ?? 'http://localhost:3001',
  },
  database: {
    url:
      process.env.DATABASE_URL ??
      'postgresql://postgres:123456@localhost:5432/zca?schema=public',
  },
  auth: {
    jwtSecret: process.env.JWT_SECRET ?? 'change-me-in-production',
    jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? '7d',
    cookieName: process.env.AUTH_COOKIE_NAME ?? 'access_token',
    cookieSecure: process.env.AUTH_COOKIE_SECURE === 'true',
    cookieSameSite: process.env.AUTH_COOKIE_SAME_SITE ?? 'lax',
  },
  zaloSession: {
    /** 64 hex chars = 32-byte AES-256 key. Override in production via env. */
    encryptionKeyHex:
      process.env.ZALO_SESSION_ENCRYPTION_KEY ??
      '0000000000000000000000000000000000000000000000000000000000000000',
  },
  /**
   * Background sync of `ZaloGroup` name + `globalId` from Zalo (`getGroupInfo`) via BullMQ.
   * Opt-in: set GROUP_SYNC_ENABLED=true and run Redis. Cron only enqueues; worker runs the API calls.
   */
  groupSync: {
    enabled: process.env.GROUP_SYNC_ENABLED === 'true',
    /** 6-field cron (default: every 3 minutes at :00s). */
    cron: process.env.GROUP_SYNC_CRON?.trim() || '0 */3 * * * *',
    /** Optional IANA zone for the cron (e.g. Asia/Ho_Chi_Minh). */
    timezone: process.env.GROUP_SYNC_TZ?.trim() || undefined,
    batchSize: Math.max(
      1,
      Number.parseInt(process.env.GROUP_SYNC_BATCH_SIZE ?? '10', 10) || 10,
    ),
    redis: {
      url: process.env.BULL_REDIS_URL?.trim() || undefined,
      host: process.env.BULL_REDIS_HOST?.trim() || '127.0.0.1',
      port: (() => {
        const p = Number.parseInt(process.env.BULL_REDIS_PORT ?? '6379', 10);
        return Number.isFinite(p) ? p : 6379;
      })(),
      password: process.env.BULL_REDIS_PASSWORD || undefined,
      username: process.env.BULL_REDIS_USERNAME || undefined,
    },
  },
});
