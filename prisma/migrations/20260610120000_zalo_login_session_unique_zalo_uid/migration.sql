-- Deduplicate: keep one row per zalo_uid (latest updated_at, then id).
DELETE FROM "zalo_login_sessions" AS dup
WHERE dup."id" NOT IN (
  SELECT DISTINCT ON ("zalo_uid") "id"
  FROM "zalo_login_sessions"
  ORDER BY "zalo_uid", "updated_at" DESC, "id" DESC
);

-- Drop non-unique index superseded by unique constraint.
DROP INDEX IF EXISTS "zalo_login_sessions_zalo_uid_idx";

CREATE UNIQUE INDEX "zalo_login_sessions_zalo_uid_key" ON "zalo_login_sessions"("zalo_uid");
