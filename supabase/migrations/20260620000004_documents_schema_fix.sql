-- Documents table: align schema with application column names.
--
-- The initial schema used listing_address / filename (no underscored variant).
-- The application code uses property_address / file_name / file_url / uploaded_by.
-- This migration adds the missing columns and backfills from the old ones.

ALTER TABLE documents
  ADD COLUMN IF NOT EXISTS property_address TEXT,
  ADD COLUMN IF NOT EXISTS suburb           TEXT DEFAULT '',
  ADD COLUMN IF NOT EXISTS file_name        TEXT,
  ADD COLUMN IF NOT EXISTS file_url         TEXT DEFAULT '',
  ADD COLUMN IF NOT EXISTS uploaded_by      TEXT DEFAULT '';

-- Backfill: copy existing data from old columns to new ones
UPDATE documents
SET
  property_address = COALESCE(property_address, listing_address),
  file_name        = COALESCE(file_name, filename)
WHERE property_address IS NULL OR file_name IS NULL;

-- Add a search index on the column used for filtering
CREATE INDEX IF NOT EXISTS documents_property_address_idx ON documents (property_address);
