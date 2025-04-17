CREATE TABLE IF NOT EXISTS "feedback" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "from_user_id" UUID NOT NULL REFERENCES "users"("id"),
  "to_user_id" UUID NOT NULL REFERENCES "users"("id"),
  "transaction_id" UUID REFERENCES "transactions"("id"),
  "rating" INTEGER NOT NULL,
  "comment" TEXT,
  "created_at" TIMESTAMP DEFAULT NOW()
);