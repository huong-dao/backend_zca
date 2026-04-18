/*
  Warnings:

  - You are about to drop the column `group_zalo_id` on the `zalo_groups` table. All the data in the column will be lost.
  - You are about to drop the `zalo_sessions` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "zalo_sessions" DROP CONSTRAINT "zalo_sessions_zalo_account_id_fkey";

-- DropIndex
DROP INDEX "zalo_groups_group_zalo_id_key";

-- AlterTable
ALTER TABLE "zalo_groups" DROP COLUMN "group_zalo_id";

-- DropTable
DROP TABLE "zalo_sessions";

-- DropEnum
DROP TYPE "ZaloSessionStatus";
