CREATE TABLE contacts (
  id BIGINT PRIMARY KEY DEFAULT 1,
  address TEXT,
  phone TEXT,
  whatsapp TEXT,
  facebook TEXT,
  instagram TEXT,
  youtube TEXT,
  youtube_api_key TEXT,
  youtube_channel_id TEXT
);

ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
