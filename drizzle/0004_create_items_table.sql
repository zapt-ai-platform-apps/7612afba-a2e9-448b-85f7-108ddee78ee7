CREATE TABLE IF NOT EXISTS "items" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "collection_id" UUID NOT NULL REFERENCES "collections"("id"),
  "user_id" UUID NOT NULL REFERENCES "users"("id"),
  "name" TEXT NOT NULL,
  "description" TEXT,
  "purchase_price" DECIMAL(12,2),
  "current_value" DECIMAL(12,2),
  "purchase_date" TIMESTAMP,
  "purchase_place" TEXT,
  "condition" TEXT,
  "attributes" JSONB,
  "images" JSONB,
  "for_sale" BOOLEAN DEFAULT FALSE,
  "asking_price" DECIMAL(12,2),
  "created_at" TIMESTAMP DEFAULT NOW(),
  "updated_at" TIMESTAMP DEFAULT NOW()
);