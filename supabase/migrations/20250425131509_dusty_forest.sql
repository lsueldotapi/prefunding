/*
  # Initial Schema Setup for Prefunding System

  1. New Tables
    - `clients`
      - `id` (text, primary key, 3-4 digits)
      - `client_company_name` (text, not null)
      - `country_code` (text, not null)
      - `created_at` (timestamptz, default: now())
    
    - `prefunding`
      - `id` (uuid, primary key)
      - `client_id` (text, foreign key to clients.id)
      - `wallet_address` (text, not null)
      - `amount` (numeric, not null)
      - `reference_number` (text, not null)
      - `status` (text, default: 'pending')
      - `processed_at` (timestamptz, default: now())

  2. Security
    - Enable RLS on both tables
    - Add policies for public access (no auth required)
*/

-- Create clients table
CREATE TABLE IF NOT EXISTS clients (
  id text PRIMARY KEY CHECK (length(id) BETWEEN 3 AND 4),
  client_company_name text NOT NULL,
  country_code text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create prefunding table
CREATE TABLE IF NOT EXISTS prefunding (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id text REFERENCES clients(id) NOT NULL,
  wallet_address text NOT NULL,
  amount numeric NOT NULL,
  reference_number text NOT NULL,
  status text DEFAULT 'pending',
  processed_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE prefunding ENABLE ROW LEVEL SECURITY;

-- Create policies for public access
CREATE POLICY "Allow public read access on clients"
  ON clients
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public read access on prefunding"
  ON prefunding
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public insert on prefunding"
  ON prefunding
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Insert sample client
INSERT INTO clients (id, client_company_name, country_code)
VALUES ('999', 'Test Company', 'AR')
ON CONFLICT (id) DO NOTHING;