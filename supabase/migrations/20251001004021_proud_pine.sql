/*
  # Fix RLS policies for clients_duplicate table

  1. Security
    - Enable RLS on clients_duplicate table
    - Add policy for public read access on clients_duplicate
    - This matches the policy structure from the original clients table

  2. Changes
    - Enable Row Level Security
    - Add public read policy to allow the application to fetch client data
*/

-- Enable RLS on clients_duplicate table
ALTER TABLE clients_duplicate ENABLE ROW LEVEL SECURITY;

-- Add policy for public read access (same as original clients table)
CREATE POLICY "Allow public read access on clients_duplicate"
  ON clients_duplicate
  FOR SELECT
  TO public
  USING (true);