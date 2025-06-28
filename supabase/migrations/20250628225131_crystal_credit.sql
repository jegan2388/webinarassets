/*
  # Add demo insert policy for webinar_requests

  1. Security Changes
    - Add policy to allow anonymous users to insert webinar requests for demo purposes
    - This enables the demo to work without requiring user authentication
    
  Note: This policy is for demo purposes only. In production, proper authentication 
  should be implemented and this policy should be removed.
*/

-- Add policy to allow anonymous users to insert webinar requests for demo
CREATE POLICY "Allow anonymous inserts for demo"
  ON webinar_requests
  FOR INSERT
  TO anon
  WITH CHECK (true);