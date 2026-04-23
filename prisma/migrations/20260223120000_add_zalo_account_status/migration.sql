-- CreateEnum
CREATE TYPE "ZaloAccountStatus" AS ENUM ('ACTIVE', 'UNACTIVE');

-- AlterTable
ALTER TABLE "zalo_accounts" ADD COLUMN "status" "ZaloAccountStatus" NOT NULL DEFAULT 'UNACTIVE';

-- Grandfather: existing rows were already in use; keep them able to send/recall until you opt them out.
UPDATE "zalo_accounts" SET "status" = 'ACTIVE';

-- CreateIndex
CREATE INDEX "zalo_accounts_status_idx" ON "zalo_accounts"("status");
