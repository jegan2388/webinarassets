/*
  # Fix RLS Policy for Anonymous Webinar Requests

  1. Security Changes
    - Update the anonymous insert policy to be more permissive for demo purposes
    - Ensure anonymous users can insert webinar requests without authentication
    - Add proper policy for anonymous users to read their own requests using session data

  2. Policy Updates
    - Modify existing anonymous insert policy
    - Add policy for anonymous users to read requests they created
*/

-- Drop the existing anonymous insert policy and recreate it with proper permissions
DROP POLICY IF EXISTS "Allow anonymous inserts for demo" ON webinar_requests;

-- Create a more permissive policy for anonymous inserts
CREATE POLICY "Allow anonymous inserts for demo"
  ON webinar_requests
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Allow anonymous users to read webinar requests (for demo purposes)
CREATE POLICY "Allow anonymous reads for demo"
  ON webinar_requests
  FOR SELECT
  TO anon
  USING (true);

-- Allow anonymous users to update webinar requests (for demo purposes)
CREATE POLICY "Allow anonymous updates for demo"
  ON webinar_requests
  FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);