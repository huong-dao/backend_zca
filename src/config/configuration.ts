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
});
