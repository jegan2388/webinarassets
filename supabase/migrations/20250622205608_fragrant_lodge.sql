/*
  # Update webinar_requests table for content requests

  1. Schema Updates
    - Add subscription_tier column to track which tier the request was processed under
    - Add content_type column to track the type of content (file, link, text)
    - Update existing data to reflect new structure

  2. Indexes
    - Add indexes for better query performance
*/

-- Add new columns to webinar_requests table
DO $$
BEGIN
  -- Add subscription_tier column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'webinar_requests' AND column_name = 'subscription_tier'
  ) THEN
    ALTER TABLE webinar_requests ADD COLUMN subscription_tier text DEFAULT 'free' CHECK (subscription_tier IN ('free', 'pro'));
  END IF;

  -- Add content_type column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'webinar_requests' AND column_name = 'content_type'
  ) THEN
    ALTER TABLE webinar_requests ADD COLUMN content_type text DEFAULT 'file' CHECK (content_type IN ('file', 'link', 'text'));
  END IF;
END $$;

-- Update existing records to have proper subscription tier based on amount paid
UPDATE webinar_requests 
SET subscription_tier = CASE 
  WHEN amount_paid > 0 THEN 'pro'
  ELSE 'free'
END
WHERE subscription_tier IS NULL;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_webinar_requests_subscription_tier ON webinar_requests(subscription_tier);
CREATE INDEX IF NOT EXISTS idx_webinar_requests_content_type ON webinar_requests(content_type);

-- Create function to increment monthly content usage
CREATE OR REPLACE FUNCTION increment_monthly_content_usage(user_id uuid)
RETURNS void AS $$
BEGIN
  UPDATE profiles 
  SET content_processed_this_month = content_processed_this_month + 1
  WHERE id = user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to reset monthly usage (to be called monthly)
CREATE OR REPLACE FUNCTION reset_monthly_usage()
RETURNS void AS $$
BEGIN
  UPDATE profiles 
  SET content_processed_this_month = 0;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;