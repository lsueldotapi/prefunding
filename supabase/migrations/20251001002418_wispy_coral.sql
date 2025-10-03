/*
  # Update prefunding_v2 system for Regalii

  1. Changes
    - Update foreign key constraint to reference clients_duplicate instead of clients
    - Update views to use clients_duplicate table
    - Add comments to identify this as the Regalii system

  2. Security
    - Maintain existing RLS policies
    - Keep same access controls
*/

-- Drop existing foreign key constraint
ALTER TABLE prefunding_v2 DROP CONSTRAINT IF EXISTS prefunding_v2_client_id_fkey;

-- Add new foreign key constraint to clients_duplicate
ALTER TABLE prefunding_v2 ADD CONSTRAINT prefunding_v2_client_id_fkey 
  FOREIGN KEY (client_id) REFERENCES clients_duplicate(id);

-- Update the main view to use clients_duplicate
DROP VIEW IF EXISTS prefondeos_v2_view;
CREATE VIEW prefondeos_v2_view AS
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
JOIN clients_duplicate c ON p.client_id = c.id;

-- Update the notifications view to use clients_duplicate
DROP VIEW IF EXISTS prefondeos_v2_notifications_view;
CREATE VIEW prefondeos_v2_notifications_view AS
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
JOIN clients_duplicate c ON p.client_id = c.id
JOIN "Workflow_Control" w ON p.processed_at > w.last_checked_at;