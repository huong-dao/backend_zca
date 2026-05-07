-- CreateEnum
CREATE TYPE "BackgroundJobType" AS ENUM ('GROUP_METADATA_SYNC', 'CHILD_GROUP_SCAN');

-- CreateEnum
CREATE TYPE "BackgroundJobStatus" AS ENUM ('IDLE', 'RUNNING');

-- CreateTable
CREATE TABLE "background_job_states" (
    "job_key" VARCHAR(160) NOT NULL,
    "job_type" "BackgroundJobType" NOT NULL,
    "zalo_account_id" UUID,
    "status" "BackgroundJobStatus" NOT NULL,
    "started_at" TIMESTAMP(3),
    "finished_at" TIMESTAMP(3),
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "background_job_states_pkey" PRIMARY KEY ("job_key")
);

-- CreateIndex
CREATE INDEX "background_job_states_job_type_idx" ON "background_job_states"("job_type");

-- CreateIndex
CREATE INDEX "background_job_states_zalo_account_id_idx" ON "background_job_states"("zalo_account_id");

-- CreateIndex
CREATE INDEX "background_job_states_job_type_status_idx" ON "background_job_states"("job_type", "status");

-- AddForeignKey
ALTER TABLE "background_job_states" ADD CONSTRAINT "background_job_states_zalo_account_id_fkey" FOREIGN KEY ("zalo_account_id") REFERENCES "zalo_accounts"("id") ON DELETE CASCADE ON UPDATE CASCADE;
