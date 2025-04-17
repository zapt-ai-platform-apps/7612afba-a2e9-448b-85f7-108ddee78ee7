CREATE TABLE IF NOT EXISTS "transactions" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "seller_id" UUID NOT NULL REFERENCES "users"("id"),
  "buyer_id" UUID NOT NULL REFERENCES "users"("id"),
  "item_id" UUID NOT NULL REFERENCES "items"("id"),
  "amount" DECIMAL(12,2) NOT NULL,
  "status" TEXT NOT NULL,
  "payment_method" TEXT,
  "payment_id" TEXT,
  "shipping_address" JSONB,
  "created_at" TIMESTAMP DEFAULT NOW(),
  "updated_at" TIMESTAMP DEFAULT NOW(),
  "completed_at" TIMESTAMP
);