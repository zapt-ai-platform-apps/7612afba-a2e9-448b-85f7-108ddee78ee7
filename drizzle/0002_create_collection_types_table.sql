CREATE TABLE IF NOT EXISTS "collection_types" (
  "id" SERIAL PRIMARY KEY,
  "name" TEXT NOT NULL,
  "slug" TEXT NOT NULL UNIQUE,
  "description" TEXT,
  "fields" JSONB NOT NULL,
  "icon" TEXT,
  "created_at" TIMESTAMP DEFAULT NOW(),
  "updated_at" TIMESTAMP DEFAULT NOW()
);

-- Insert default collection types
INSERT INTO "collection_types" ("name", "slug", "description", "fields", "icon")
VALUES 
('Model Cars', 'model-cars', 'Scale model cars, trucks, and vehicles', '{
  "required": ["make", "model", "year", "scale", "manufacturer"],
  "optional": ["color", "condition", "box_condition", "limited_edition", "series"]
}', 'car'),

('Pokemon Cards', 'pokemon-cards', 'Pokemon trading cards collection', '{
  "required": ["card_name", "set_name", "card_number", "rarity"],
  "optional": ["condition", "graded", "grade", "edition", "language", "holographic"]
}', 'gamepad'),

('LEGO Sets', 'lego-sets', 'LEGO building sets collection', '{
  "required": ["set_number", "name", "piece_count", "theme", "year"],
  "optional": ["condition", "box_condition", "complete", "minifigures", "instructions"]
}', 'cubes'),

('Coins', 'coins', 'Numismatic collection', '{
  "required": ["country", "denomination", "year", "mint_mark"],
  "optional": ["grade", "certification", "material", "weight", "diameter", "error_type", "commemorative"]
}', 'coins'),

('Stamps', 'stamps', 'Philatelic collection', '{
  "required": ["country", "denomination", "year", "issue"],
  "optional": ["condition", "perforated", "color", "errors", "certification", "series"]
}', 'envelope'),

('Comic Books', 'comics', 'Comic book collection', '{
  "required": ["title", "issue", "publisher", "year"],
  "optional": ["grade", "certification", "variant_cover", "artist", "writer", "first_appearance"]
}', 'book'),

('Vinyl Records', 'vinyl-records', 'Vinyl record collection', '{
  "required": ["artist", "album", "year", "label"],
  "optional": ["condition", "pressing", "speed", "variant", "limited_edition", "signed"]
}', 'music'),

('Action Figures', 'action-figures', 'Action figures collection', '{
  "required": ["character", "manufacturer", "line", "year"],
  "optional": ["condition", "packaging", "articulation", "scale", "accessories", "exclusive"]
}', 'person')
ON CONFLICT (slug) DO NOTHING;