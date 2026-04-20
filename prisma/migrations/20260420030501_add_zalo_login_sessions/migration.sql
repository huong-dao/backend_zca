-- CreateTable
CREATE TABLE "zalo_login_sessions" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "zalo_uid" VARCHAR(255) NOT NULL,
    "user_profile" JSONB NOT NULL,
    "credentials_encrypted" BYTEA NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "zalo_login_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "zalo_login_sessions_user_id_idx" ON "zalo_login_sessions"("user_id");

-- CreateIndex
CREATE INDEX "zalo_login_sessions_zalo_uid_idx" ON "zalo_login_sessions"("zalo_uid");

-- CreateIndex
CREATE INDEX "zalo_login_sessions_user_id_zalo_uid_idx" ON "zalo_login_sessions"("user_id", "zalo_uid");

-- AddForeignKey
ALTER TABLE "zalo_login_sessions" ADD CONSTRAINT "zalo_login_sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
