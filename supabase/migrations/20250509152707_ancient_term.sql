/*
  # Update Schema for PIN Authentication

  1. Changes
    - Add PIN column to clients table
    - Remove reference_number from prefunding
    - Drop and recreate dependent view

  2. Security
    - Add constraint to ensure PIN is 8 digits
*/

-- Drop the dependent view first
DROP VIEW IF EXISTS prefondeos_view;

-- Add the PIN column
ALTER TABLE clients 
ADD COLUMN pin numeric(8) NOT NULL DEFAULT 12345678;

-- Add check constraint for PIN
ALTER TABLE clients
ADD CONSTRAINT pin_length_check 
CHECK (pin >= 10000000 AND pin <= 99999999);

-- Remove the default constraint
ALTER TABLE clients
ALTER COLUMN pin DROP DEFAULT;

-- Remove reference_number from prefunding table
ALTER TABLE prefunding
DROP COLUMN reference_number;

-- Recreate the view without the reference_number column
CREATE VIEW prefondeos_view AS
SELECT 
    p.id,
    p.client_id,
    p.wallet_address,
    p.amount,
    p.status,
    p.processed_at,
    c.client_company_name,
    c.country_code
FROM prefunding p
JOIN clients c ON c.id = p.client_id;