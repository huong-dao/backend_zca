-- Rename enum value (PostgreSQL 10+). Safe after 20260223120000_add_zalo_account_status.
ALTER TYPE "ZaloAccountStatus" RENAME VALUE 'UNACTIVE' TO 'INACTIVE';

ALTER TABLE "zalo_accounts" ALTER COLUMN "status" SET DEFAULT 'INACTIVE';
