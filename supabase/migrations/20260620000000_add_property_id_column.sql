-- Add property_id as a NOT NULL varchar column to properties table
-- Step 1: Create a sequence for auto-numbering
CREATE SEQUENCE IF NOT EXISTS property_id_seq START 1001;

-- Step 2: Add the column initially allowing NULL (needed for existing rows)
ALTER TABLE properties ADD COLUMN IF NOT EXISTS property_id VARCHAR(50);

-- Step 3: Fill existing rows with auto-generated IDs from the sequence
UPDATE properties SET property_id = nextval('property_id_seq')::text WHERE property_id IS NULL;

-- Step 4: Now enforce NOT NULL constraint
ALTER TABLE properties ALTER COLUMN property_id SET NOT NULL;

-- Step 5: Add a UNIQUE constraint so no two properties share the same ID
ALTER TABLE properties ADD CONSTRAINT properties_property_id_unique UNIQUE (property_id);

-- Step 6: Index for fast lookups
CREATE INDEX IF NOT EXISTS idx_properties_property_id ON properties(property_id);
