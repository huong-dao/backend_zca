-- CreateTable
CREATE TABLE "zalo_account_friends" (
    "id" UUID NOT NULL,
    "master_id" UUID NOT NULL,
    "friend_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "zalo_account_friends_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "zalo_account_friends_master_id_friend_id_key" ON "zalo_account_friends"("master_id", "friend_id");

-- AddForeignKey
ALTER TABLE "zalo_account_friends" ADD CONSTRAINT "zalo_account_friends_master_id_fkey" FOREIGN KEY ("master_id") REFERENCES "zalo_accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "zalo_account_friends" ADD CONSTRAINT "zalo_account_friends_friend_id_fkey" FOREIGN KEY ("friend_id") REFERENCES "zalo_accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
