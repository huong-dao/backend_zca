# Zalo login sessions API

Persist Zalo QR sessions (`zca-js`) per CMS user. Session **id** is a UUID aligned with Next.js cookies (`zca_zalo_session` / `zca_zalo_sessions`). **Credentials** (cookies, imei, userAgent) are stored encrypted (AES-256-GCM); they are never included in the list endpoint.

**Auth:** JWT (cookie `access_token` or `Authorization: Bearer`) — same as other app routes. Only the **BFF / server** should call endpoints that return `credentials`.

**Env:** set `ZALO_SESSION_ENCRYPTION_KEY` to **64 hexadecimal characters** (32 bytes). If unset, a dev-only default key is used (not safe for production).

**Next.js hydration:** on cold start or when the browser cookie has a `sessionId` but in-memory store is empty, the BFF should call `GET /zalo-sessions/:sessionId` (or resolve via `GET /zalo-sessions/by-zalo-uid/:zaloUid`) and repopulate the local session store. Public/browser APIs should only expose `{ sessions: [...] }` without credentials.

Base URL in examples: `http://localhost:3000` (no global `/api/v1` prefix in this repo).

---

## `POST /zalo-sessions`

Upsert: create or update by `id` (if omitted, server generates a UUID).

**Request**

```http
POST /zalo-sessions
Content-Type: application/json
Cookie: access_token=...
```

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "user": {
    "uid": "zalo-user-id",
    "displayName": "Name",
    "zaloName": "",
    "username": "",
    "phoneNumber": "",
    "avatar": "",
    "cover": ""
  },
  "credentials": {
    "imei": "...",
    "userAgent": "...",
    "cookies": [{ "key": "...", "value": "..." }]
  },
  "createdAt": "2026-04-20T12:00:00.000Z",
  "updatedAt": "2026-04-20T12:00:00.000Z"
}
```

`id`, `createdAt`, `updatedAt` are optional. `user.uid` and `credentials` are required.

**Response** `200` — one public session (no credentials):

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "user": {
    "uid": "zalo-user-id",
    "displayName": "Name",
    "zaloName": "",
    "username": "",
    "phoneNumber": "",
    "avatar": "",
    "cover": ""
  },
  "createdAt": "2026-04-20T12:00:00.000Z",
  "updatedAt": "2026-04-20T12:00:00.000Z"
}
```

---

## `GET /zalo-sessions`

List sessions for the authenticated user (no credentials).

**Response** `200`:

```json
{
  "sessions": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "user": { "uid": "...", "displayName": "...", "zaloName": "", "username": "", "phoneNumber": "", "avatar": "", "cover": "" },
      "createdAt": "2026-04-20T12:00:00.000Z",
      "updatedAt": "2026-04-20T12:00:00.000Z"
    }
  ]
}
```

---

## `GET /zalo-sessions/:sessionId`

Full session **including** `credentials` for the owning user. Intended for **server-side / BFF** only.

**Response** `200`:

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "user": { "...": "..." },
  "credentials": {
    "imei": "...",
    "userAgent": "...",
    "cookies": []
  },
  "createdAt": "...",
  "updatedAt": "..."
}
```

---

## `GET /zalo-sessions/by-zalo-uid/:zaloUid`

Returns the **most recently updated** session for that Zalo uid and current user, **with credentials** (same shape as `GET /zalo-sessions/:sessionId`).

---

## `PATCH /zalo-sessions/:sessionId/touch`

Bumps `updatedAt` (and any Prisma `@updatedAt` behavior) after a successful Zalo API call.

**Response** `200` — public session object (no credentials).

---

## `DELETE /zalo-sessions/:sessionId`

Deletes one session (`404` if not found or not owned).

---

## `DELETE /zalo-sessions`

Deletes all sessions for the current user.

**Response** `200`:

```json
{ "deleted": 3 }
```

---

## OpenAPI fragment (paths)

```yaml
paths:
  /zalo-sessions:
    post:
      summary: Upsert Zalo login session
      security: [{ bearerAuth: [] }]
    get:
      summary: List sessions (no credentials)
      security: [{ bearerAuth: [] }]
    delete:
      summary: Delete all sessions for user
      security: [{ bearerAuth: [] }]
  /zalo-sessions/{sessionId}:
    get:
      summary: Get full session with credentials
      security: [{ bearerAuth: [] }]
    delete:
      summary: Delete one session
      security: [{ bearerAuth: [] }]
  /zalo-sessions/{sessionId}/touch:
    patch:
      summary: Touch updatedAt
      security: [{ bearerAuth: [] }]
  /zalo-sessions/by-zalo-uid/{zaloUid}:
    get:
      summary: Latest session by Zalo uid (includes credentials)
      security: [{ bearerAuth: [] }]
```
