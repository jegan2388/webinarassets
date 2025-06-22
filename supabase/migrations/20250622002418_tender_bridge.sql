/*
  # Add assets storage to webinar requests

  1. Schema Updates
    - Add `assets_json` column to store generated assets
    - Add `transcript` column to store webinar transcript
    - Add `brand_data` column to store extracted brand information

  2. Indexes
    - Add index for better query performance

  3. Functions
    - Update trigger function to handle new columns
*/

-- Add new columns to webinar_requests table
DO $$
BEGIN
  -- Add assets_json column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'webinar_requests' AND column_name = 'assets_json'
  ) THEN
    ALTER TABLE webinar_requests ADD COLUMN assets_json jsonb;
  END IF;

  -- Add transcript column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'webinar_requests' AND column_name = 'transcript'
  ) THEN
    ALTER TABLE webinar_requests ADD COLUMN transcript text;
  END IF;

  -- Add brand_data column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'webinar_requests' AND column_name = 'brand_data'
  ) THEN
    ALTER TABLE webinar_requests ADD COLUMN brand_data jsonb;
  END IF;
END $$;

-- Create index for assets queries
CREATE INDEX IF NOT EXISTS idx_webinar_requests_processed_at ON webinar_requests(processed_at) WHERE processed_at IS NOT NULL;

-- Create function to increment webinar count
CREATE OR REPLACE FUNCTION increment_webinars_count(user_id uuid)
RETURNS void AS $$
BEGIN
  UPDATE profiles 
  SET webinars_processed_count = webinars_processed_count + 1
  WHERE id = user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;