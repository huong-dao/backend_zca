-- CreateTable
CREATE TABLE "media" (
    "id" UUID NOT NULL,
    "message_id" UUID NOT NULL,
    "file_name" VARCHAR(255) NOT NULL,
    "mime_type" VARCHAR(127),
    "size_bytes" INTEGER NOT NULL,
    "storage_path" VARCHAR(512) NOT NULL,
    "sent_at" TIMESTAMP(3) NOT NULL,
    "attachment_index" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "media_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "media_message_id_idx" ON "media"("message_id");

-- CreateIndex
CREATE INDEX "media_sent_at_idx" ON "media"("sent_at");

-- CreateIndex
CREATE INDEX "media_file_name_idx" ON "media"("file_name");

-- AddForeignKey
ALTER TABLE "media" ADD CONSTRAINT "media_message_id_fkey" FOREIGN KEY ("message_id") REFERENCES "messages"("id") ON DELETE CASCADE ON UPDATE CASCADE;
