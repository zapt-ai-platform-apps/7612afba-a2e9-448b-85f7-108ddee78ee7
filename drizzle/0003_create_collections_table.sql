CREATE TABLE IF NOT EXISTS "collections" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "user_id" UUID NOT NULL REFERENCES "users"("id"),
  "name" TEXT NOT NULL,
  "description" TEXT,
  "type_id" INTEGER NOT NULL REFERENCES "collection_types"("id"),
  "cover_image" TEXT,
  "created_at" TIMESTAMP DEFAULT NOW(),
  "updated_at" TIMESTAMP DEFAULT NOW(),
  "is_private" BOOLEAN DEFAULT FALSE,
  "item_count" INTEGER DEFAULT 0,
  "total_value" DECIMAL(12,2) DEFAULT '0.00'
);