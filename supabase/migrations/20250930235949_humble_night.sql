/*
  # Create Prefunding V2 System

  1. New Tables
    - `prefunding_v2`
      - `id` (uuid, primary key)
      - `client_id` (text, foreign key to clients)
      - `wallet_address` (text)
      - `amount` (numeric)
      - `status` (text, default 'pending')
      - `processed_at` (timestamp)

  2. Security
    - Enable RLS on `prefunding_v2` table
    - Add policies for public access (insert, select, update)

  3. Views
    - Create `prefondeos_v2_view` joining prefunding_v2 with clients
    - Create `prefondeos_v2_notifications_view` for workflow control
*/

CREATE TABLE IF NOT EXISTS prefunding_v2 (
  id text PRIMARY KEY DEFAULT gen_random_uuid()::text,
  client_id text NOT NULL,
  wallet_address text NOT NULL,
  amount numeric NOT NULL,
  status text DEFAULT 'pending',
  processed_at timestamptz DEFAULT now(),
  CONSTRAINT prefunding_v2_client_id_fkey FOREIGN KEY (client_id) REFERENCES clients(id)
);

ALTER TABLE prefunding_v2 ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public insert on prefunding_v2"
  ON prefunding_v2
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Allow public read access on prefunding_v2"
  ON prefunding_v2
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Update prefunding_v2 table"
  ON prefunding_v2
  FOR UPDATE
  TO public
  USING (true);

-- Create view for prefunding_v2 with client information
CREATE OR REPLACE VIEW prefondeos_v2_view AS
SELECT 
  p.id,
  p.client_id,
  p.wallet_address,
  p.amount,
  p.status,
  p.processed_at,
  c.client_company_name,
  c.country_code,
  c.client_username
FROM prefunding_v2 p
JOIN clients c ON p.client_id = c.id;

-- Create notifications view for prefunding_v2
CREATE OR REPLACE VIEW prefondeos_v2_notifications_view AS
SELECT 
  p.id,
  p.client_id,
  p.wallet_address,
  p.amount,
  p.status,
  p.processed_at,
  c.client_company_name,
  c.country_code,
  c.client_username
FROM prefunding_v2 p
JOIN clients c ON p.client_id = c.id
CROSS JOIN "Workflow_Control" w
WHERE p.processed_at > w.last_checked_at;