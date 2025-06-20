/*
  # Add webinar requests table for payment tracking

  1. New Tables
    - `webinar_requests`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to profiles)
      - `stripe_session_id` (text, unique)
      - `payment_status` (text, enum: pending, completed, failed)
      - `form_data` (jsonb, stores webinar form data)
      - `amount_paid` (integer, amount in cents)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
      - `processed_at` (timestamp, when assets were generated)

  2. Updates to profiles table
    - Add `webinars_processed_count` (integer, default 0)

  3. Security
    - Enable RLS on `webinar_requests` table
    - Add policies for users to read/update their own requests
*/

-- Add webinars_processed_count to profiles table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'webinars_processed_count'
  ) THEN
    ALTER TABLE profiles ADD COLUMN webinars_processed_count integer DEFAULT 0;
  END IF;
END $$;

-- Create webinar_requests table
CREATE TABLE IF NOT EXISTS webinar_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  stripe_session_id text UNIQUE,
  payment_status text DEFAULT 'pending' CHECK (payment_status IN ('pending', 'completed', 'failed')),
  form_data jsonb NOT NULL,
  amount_paid integer DEFAULT 499, -- $4.99 in cents
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  processed_at timestamptz
);

-- Enable RLS
ALTER TABLE webinar_requests ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can read own webinar requests"
  ON webinar_requests
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own webinar requests"
  ON webinar_requests
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own webinar requests"
  ON webinar_requests
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION update_webinar_requests_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_webinar_requests_updated_at
  BEFORE UPDATE ON webinar_requests
  FOR EACH ROW
  EXECUTE FUNCTION update_webinar_requests_updated_at();

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_webinar_requests_user_id ON webinar_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_webinar_requests_stripe_session_id ON webinar_requests(stripe_session_id);
CREATE INDEX IF NOT EXISTS idx_webinar_requests_payment_status ON webinar_requests(payment_status);