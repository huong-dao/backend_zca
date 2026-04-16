export const APP_ROLES = ['ADMIN', 'USER'] as const;

export type AppRole = (typeof APP_ROLES)[number];
