-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'USER');

-- CreateEnum
CREATE TYPE "MessageStatus" AS ENUM ('SENT', 'FAILED', 'RECALL');

-- CreateEnum
CREATE TYPE "ZaloAccountFriendStatus" AS ENUM ('PENDING', 'APPROVE', 'CANCEL');

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
    "is_update_name" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "zalo_groups_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "zalo_account_relations" (
    "id" UUID NOT NULL,
    "master_id" UUID NOT NULL,
    "child_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "zalo_account_relations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "zalo_accounts" (
    "id" UUID NOT NULL,
    "zalo_id" VARCHAR(255),
    "phone" VARCHAR(50),
    "name" VARCHAR(255),
    "is_master" BOOLEAN NOT NULL DEFAULT false,
    "group_count" INTEGER NOT NULL DEFAULT 0,
    "group_data" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "zalo_accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "zalo_account_groups" (
    "id" UUID NOT NULL,
    "group_zalo_id" TEXT NOT NULL,
    "zalo_account_id" UUID NOT NULL,
    "group_id" UUID NOT NULL,
    "joined_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "zalo_account_groups_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "zalo_account_friends" (
    "id" UUID NOT NULL,
    "master_id" UUID NOT NULL,
    "friend_id" UUID NOT NULL,
    "status" "ZaloAccountFriendStatus" NOT NULL DEFAULT 'PENDING',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "zalo_account_friends_pkey" PRIMARY KEY ("id")
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
CREATE UNIQUE INDEX "zalo_account_relations_master_id_child_id_key" ON "zalo_account_relations"("master_id", "child_id");

-- CreateIndex
CREATE UNIQUE INDEX "zalo_accounts_zalo_id_key" ON "zalo_accounts"("zalo_id");

-- CreateIndex
CREATE UNIQUE INDEX "zalo_account_groups_group_zalo_id_key" ON "zalo_account_groups"("group_zalo_id");

-- CreateIndex
CREATE UNIQUE INDEX "zalo_account_friends_master_id_friend_id_key" ON "zalo_account_friends"("master_id", "friend_id");

-- CreateIndex
CREATE INDEX "messages_sender_id_group_id_idx" ON "messages"("sender_id", "group_id");

-- CreateIndex
CREATE UNIQUE INDEX "api_keys_secret_key_key" ON "api_keys"("secret_key");

-- CreateIndex
CREATE UNIQUE INDEX "configurations_key_key" ON "configurations"("key");

-- AddForeignKey
ALTER TABLE "zalo_account_relations" ADD CONSTRAINT "zalo_account_relations_master_id_fkey" FOREIGN KEY ("master_id") REFERENCES "zalo_accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "zalo_account_relations" ADD CONSTRAINT "zalo_account_relations_child_id_fkey" FOREIGN KEY ("child_id") REFERENCES "zalo_accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "zalo_account_groups" ADD CONSTRAINT "zalo_account_groups_zalo_account_id_fkey" FOREIGN KEY ("zalo_account_id") REFERENCES "zalo_accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "zalo_account_groups" ADD CONSTRAINT "zalo_account_groups_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "zalo_groups"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "zalo_account_friends" ADD CONSTRAINT "zalo_account_friends_master_id_fkey" FOREIGN KEY ("master_id") REFERENCES "zalo_accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "zalo_account_friends" ADD CONSTRAINT "zalo_account_friends_friend_id_fkey" FOREIGN KEY ("friend_id") REFERENCES "zalo_accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_sender_id_fkey" FOREIGN KEY ("sender_id") REFERENCES "zalo_accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "zalo_groups"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
