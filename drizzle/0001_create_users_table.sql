CREATE TABLE IF NOT EXISTS "users" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "email" TEXT NOT NULL UNIQUE,
  "first_name" TEXT,
  "last_name" TEXT,
  "created_at" TIMESTAMP DEFAULT NOW(),
  "updated_at" TIMESTAMP DEFAULT NOW(),
  "role" TEXT DEFAULT 'user',
  "profile_picture" TEXT,
  "location" TEXT,
  "average_rating" DECIMAL(3,2),
  "rating_count" INTEGER DEFAULT 0
);