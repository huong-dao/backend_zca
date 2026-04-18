/*
  Warnings:

  - A unique constraint covering the columns `[group_zalo_id]` on the table `zalo_account_groups` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `group_zalo_id` to the `zalo_account_groups` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "zalo_account_groups" ADD COLUMN     "group_zalo_id" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "zalo_account_groups_group_zalo_id_key" ON "zalo_account_groups"("group_zalo_id");
