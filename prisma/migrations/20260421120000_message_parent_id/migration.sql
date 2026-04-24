-- Optional FK: attach file bubbles to the text bubble in the same Zalo send batch.
ALTER TABLE "messages" ADD COLUMN "parent_id" UUID;

ALTER TABLE "messages" ADD CONSTRAINT "messages_parent_id_fkey"
  FOREIGN KEY ("parent_id") REFERENCES "messages"("id") ON DELETE SET NULL ON UPDATE CASCADE;

CREATE INDEX "messages_parent_id_idx" ON "messages"("parent_id");
