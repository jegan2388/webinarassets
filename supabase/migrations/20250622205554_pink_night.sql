/*
  # Add subscription fields to profiles table

  1. Schema Updates
    - Add subscription-related fields to profiles table
    - Add monthly usage tracking fields
    - Add Stripe integration fields

  2. Security
    - Maintain existing RLS policies
    - Add indexes for better performance
*/

-- Add subscription fields to profiles table
DO $$
BEGIN
  -- Add subscription_status column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'subscription_status'
  ) THEN
    ALTER TABLE profiles ADD COLUMN subscription_status text DEFAULT 'free' CHECK (subscription_status IN ('free', 'pro', 'canceled', 'past_due'));
  END IF;

  -- Add stripe_customer_id column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'stripe_customer_id'
  ) THEN
    ALTER TABLE profiles ADD COLUMN stripe_customer_id text UNIQUE;
  END IF;

  -- Add stripe_subscription_id column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'stripe_subscription_id'
  ) THEN
    ALTER TABLE profiles ADD COLUMN stripe_subscription_id text UNIQUE;
  END IF;

  -- Add current_plan_id column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'current_plan_id'
  ) THEN
    ALTER TABLE profiles ADD COLUMN current_plan_id text;
  END IF;

  -- Add monthly_content_limit column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'monthly_content_limit'
  ) THEN
    ALTER TABLE profiles ADD COLUMN monthly_content_limit integer DEFAULT 1;
  END IF;

  -- Add content_processed_this_month column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'content_processed_this_month'
  ) THEN
    ALTER TABLE profiles ADD COLUMN content_processed_this_month integer DEFAULT 0;
  END IF;

  -- Add subscription_ends_at column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'subscription_ends_at'
  ) THEN
    ALTER TABLE profiles ADD COLUMN subscription_ends_at timestamptz;
  END IF;

  -- Add last_billed_at column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'last_billed_at'
  ) THEN
    ALTER TABLE profiles ADD COLUMN last_billed_at timestamptz;
  END IF;
END $$;

-- Update existing profiles to have proper subscription status
UPDATE profiles 
SET subscription_status = CASE 
  WHEN is_pro_user = true THEN 'pro'
  ELSE 'free'
END,
monthly_content_limit = CASE 
  WHEN is_pro_user = true THEN 10
  ELSE 1
END
WHERE subscription_status IS NULL;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_profiles_subscription_status ON profiles(subscription_status);
CREATE INDEX IF NOT EXISTS idx_profiles_stripe_customer_id ON profiles(stripe_customer_id);
CREATE INDEX IF NOT EXISTS idx_profiles_stripe_subscription_id ON profiles(stripe_subscription_id);

-- Update the handle_new_user function to set default subscription values
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (
    id, 
    email, 
    subscription_status, 
    monthly_content_limit, 
    content_processed_this_month
  )
  VALUES (
    new.id, 
    new.email, 
    'free', 
    1, 
    0
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;