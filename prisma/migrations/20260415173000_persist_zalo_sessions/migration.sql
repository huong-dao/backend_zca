-- CreateEnum
CREATE TYPE "ZaloSessionStatus" AS ENUM ('ACTIVE', 'EXPIRED', 'INVALID', 'PENDING_RELOGIN');

-- CreateTable
CREATE TABLE "zalo_sessions" (
    "id" UUID NOT NULL,
    "zalo_account_id" UUID NOT NULL,
    "encrypted_credentials" TEXT NOT NULL,
    "status" "ZaloSessionStatus" NOT NULL DEFAULT 'ACTIVE',
    "last_validated_at" TIMESTAMP(3),
    "expires_at" TIMESTAMP(3),
    "invalid_reason" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "zalo_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "zalo_sessions_zalo_account_id_key" ON "zalo_sessions"("zalo_account_id");

-- CreateIndex
CREATE INDEX "zalo_sessions_status_idx" ON "zalo_sessions"("status");

-- AddForeignKey
ALTER TABLE "zalo_sessions" ADD CONSTRAINT "zalo_sessions_zalo_account_id_fkey" FOREIGN KEY ("zalo_account_id") REFERENCES "zalo_accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
