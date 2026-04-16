-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'USER');

-- CreateEnum
CREATE TYPE "MessageStatus" AS ENUM ('SENT', 'FAILED', 'RECALL');

-- CreateEnum
CREATE TYPE "ZaloSessionStatus" AS ENUM ('ACTIVE', 'EXPIRED', 'INVALID', 'PENDING_RELOGIN');

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "role" "UserRole" NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "zalo_groups" (
    "id" UUID NOT NULL,
    "group_name" VARCHAR(255) NOT NULL,
    "group_zalo_id" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "zalo_groups_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "zalo_accounts" (
    "id" UUID NOT NULL,
    "zalo_id" VARCHAR(255),
    "phone" VARCHAR(50),
    "name" VARCHAR(255),
    "is_master" BOOLEAN NOT NULL DEFAULT false,
    "master_id" UUID,
    "group_count" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "zalo_accounts_pkey" PRIMARY KEY ("id")
);

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

-- CreateTable
CREATE TABLE "zalo_account_groups" (
    "id" UUID NOT NULL,
    "zalo_account_id" UUID NOT NULL,
    "group_id" UUID NOT NULL,
    "joined_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "zalo_account_groups_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "messages" (
    "id" UUID NOT NULL,
    "message_zalo_id" VARCHAR(255),
    "cli_msg_id" VARCHAR(255),
    "uid_from" VARCHAR(255),
    "content" TEXT NOT NULL,
    "sender_id" UUID NOT NULL,
    "group_id" UUID NOT NULL,
    "sent_at" TIMESTAMP(3),
    "status" "MessageStatus" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "api_keys" (
    "id" UUID NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "secret_key" VARCHAR(255) NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "api_keys_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "configurations" (
    "id" UUID NOT NULL,
    "key" VARCHAR(255) NOT NULL,
    "value" VARCHAR(255) NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "configurations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "zalo_groups_group_zalo_id_key" ON "zalo_groups"("group_zalo_id");

-- CreateIndex
CREATE UNIQUE INDEX "zalo_accounts_zalo_id_key" ON "zalo_accounts"("zalo_id");

-- CreateIndex
CREATE UNIQUE INDEX "zalo_sessions_zalo_account_id_key" ON "zalo_sessions"("zalo_account_id");

-- CreateIndex
CREATE INDEX "zalo_sessions_status_idx" ON "zalo_sessions"("status");

-- CreateIndex
CREATE INDEX "messages_sender_id_group_id_idx" ON "messages"("sender_id", "group_id");

-- CreateIndex
CREATE UNIQUE INDEX "api_keys_secret_key_key" ON "api_keys"("secret_key");

-- CreateIndex
CREATE UNIQUE INDEX "configurations_key_key" ON "configurations"("key");

-- AddForeignKey
ALTER TABLE "zalo_accounts" ADD CONSTRAINT "zalo_accounts_master_id_fkey" FOREIGN KEY ("master_id") REFERENCES "zalo_accounts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "zalo_sessions" ADD CONSTRAINT "zalo_sessions_zalo_account_id_fkey" FOREIGN KEY ("zalo_account_id") REFERENCES "zalo_accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "zalo_account_groups" ADD CONSTRAINT "zalo_account_groups_zalo_account_id_fkey" FOREIGN KEY ("zalo_account_id") REFERENCES "zalo_accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "zalo_account_groups" ADD CONSTRAINT "zalo_account_groups_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "zalo_groups"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_sender_id_fkey" FOREIGN KEY ("sender_id") REFERENCES "zalo_accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "zalo_groups"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
