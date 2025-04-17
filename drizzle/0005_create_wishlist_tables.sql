CREATE TABLE IF NOT EXISTS "wishlist_items" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "user_id" UUID NOT NULL REFERENCES "users"("id"),
  "name" TEXT NOT NULL,
  "description" TEXT,
  "type_id" INTEGER REFERENCES "collection_types"("id"),
  "max_price" DECIMAL(12,2),
  "attributes" JSONB,
  "created_at" TIMESTAMP DEFAULT NOW(),
  "updated_at" TIMESTAMP DEFAULT NOW(),
  "notifications_enabled" BOOLEAN DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS "wishlist_matches" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "wishlist_item_id" UUID NOT NULL REFERENCES "wishlist_items"("id"),
  "item_id" UUID NOT NULL REFERENCES "items"("id"),
  "created_at" TIMESTAMP DEFAULT NOW(),
  "notified" BOOLEAN DEFAULT FALSE,
  "notification_sent_at" TIMESTAMP
);