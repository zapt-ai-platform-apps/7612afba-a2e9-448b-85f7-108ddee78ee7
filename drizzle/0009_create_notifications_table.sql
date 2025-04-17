CREATE TABLE IF NOT EXISTS "notifications" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "user_id" UUID NOT NULL REFERENCES "users"("id"),
  "type" TEXT NOT NULL,
  "content" TEXT NOT NULL,
  "related_id" TEXT,
  "read" BOOLEAN DEFAULT FALSE,
  "created_at" TIMESTAMP DEFAULT NOW(),
  "read_at" TIMESTAMP
);