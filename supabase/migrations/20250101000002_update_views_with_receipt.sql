/*
  # Update Views to Include Receipt Fields
  
  1. Drop existing views
  2. Recreate views with receipt_url and receipt_file_name columns
  
  This will make the receipt information available in Retool and other integrations
*/

-- Drop existing views
DROP VIEW IF EXISTS prefondeos_v2_view;
DROP VIEW IF EXISTS prefondeos_v2_notifications_view;

-- Recreate main view with receipt information
CREATE VIEW prefondeos_v2_view AS
SELECT 
  p.id,
  p.client_id,
  p.wallet_address,
  p.amount,
  p.status,
  p.processed_at,
  p.receipt_url,
  p.receipt_file_name,
  c.client_company_name,
  c.country_code,
  c.client_username,
  c.vertical
FROM prefunding_v2 p
JOIN clients_duplicate c ON p.client_id = c.id;

-- Recreate notifications view with receipt information
CREATE VIEW prefondeos_v2_notifications_view AS
SELECT 
  p.id,
  p.client_id,
  p.wallet_address,
  p.amount,
  p.status,
  p.processed_at,
  p.receipt_url,
  p.receipt_file_name,
  c.client_company_name,
  c.country_code,
  c.client_username,
  c.vertical
FROM prefunding_v2 p
JOIN clients_duplicate c ON p.client_id = c.id
JOIN "Workflow_Control" w ON p.processed_at > w.last_checked_at;

