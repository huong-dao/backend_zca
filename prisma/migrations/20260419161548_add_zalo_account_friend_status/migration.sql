-- CreateEnum
CREATE TYPE "ZaloAccountFriendStatus" AS ENUM ('PENDING', 'APPROVE', 'CANCEL');

-- AlterTable
ALTER TABLE "zalo_account_friends" ADD COLUMN     "status" "ZaloAccountFriendStatus" NOT NULL DEFAULT 'PENDING';
