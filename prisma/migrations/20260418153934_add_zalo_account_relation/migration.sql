/*
  Warnings:

  - You are about to drop the column `master_id` on the `zalo_accounts` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "zalo_accounts" DROP CONSTRAINT "zalo_accounts_master_id_fkey";

-- AlterTable
ALTER TABLE "zalo_accounts" DROP COLUMN "master_id";

-- CreateTable
CREATE TABLE "zalo_account_relations" (
    "id" UUID NOT NULL,
    "master_id" UUID NOT NULL,
    "child_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "zalo_account_relations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "zalo_account_relations_master_id_child_id_key" ON "zalo_account_relations"("master_id", "child_id");

-- AddForeignKey
ALTER TABLE "zalo_account_relations" ADD CONSTRAINT "zalo_account_relations_master_id_fkey" FOREIGN KEY ("master_id") REFERENCES "zalo_accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "zalo_account_relations" ADD CONSTRAINT "zalo_account_relations_child_id_fkey" FOREIGN KEY ("child_id") REFERENCES "zalo_accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
