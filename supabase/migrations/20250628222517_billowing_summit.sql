/*
  # Add delivery email to webinar requests

  1. Schema Updates
    - Add `delivery_email` column to store user's email for asset delivery
    - Add index for better query performance

  2. Security
    - Maintain existing RLS policies
    - Email is associated with the user's webinar request
*/

-- Add delivery_email column to webinar_requests table
DO $$
BEGIN
  -- Add delivery_email column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'webinar_requests' AND column_name = 'delivery_email'
  ) THEN
    ALTER TABLE webinar_requests ADD COLUMN delivery_email text;
  END IF;
END $$;

-- Create index for delivery email queries
CREATE INDEX IF NOT EXISTS idx_webinar_requests_delivery_email ON webinar_requests(delivery_email);