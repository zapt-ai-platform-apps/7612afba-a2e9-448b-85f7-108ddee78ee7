CREATE TABLE IF NOT EXISTS "messages" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "sender_id" UUID NOT NULL REFERENCES "users"("id"),
  "recipient_id" UUID NOT NULL REFERENCES "users"("id"),
  "item_id" UUID REFERENCES "items"("id"),
  "content" TEXT NOT NULL,
  "created_at" TIMESTAMP DEFAULT NOW(),
  "read" BOOLEAN DEFAULT FALSE,
  "read_at" TIMESTAMP
);