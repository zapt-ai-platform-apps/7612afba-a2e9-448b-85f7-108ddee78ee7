CREATE TABLE IF NOT EXISTS "advertisements" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "merchant_id" UUID NOT NULL REFERENCES "users"("id"),
  "title" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "image_url" TEXT,
  "link_url" TEXT,
  "target_collection_types" JSONB,
  "active" BOOLEAN DEFAULT TRUE,
  "start_date" TIMESTAMP,
  "end_date" TIMESTAMP,
  "impressions" INTEGER DEFAULT 0,
  "clicks" INTEGER DEFAULT 0,
  "created_at" TIMESTAMP DEFAULT NOW(),
  "updated_at" TIMESTAMP DEFAULT NOW()
);