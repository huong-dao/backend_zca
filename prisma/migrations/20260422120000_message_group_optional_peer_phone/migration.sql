-- DM: allow messages without a zalo_groups row; store peer phone for context.
ALTER TABLE "messages" ADD COLUMN IF NOT EXISTS "peer_phone" VARCHAR(50);
ALTER TABLE "messages" ALTER COLUMN "group_id" DROP NOT NULL;
