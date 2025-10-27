-- EJECUTA ESTE SQL EN SUPABASE SQL EDITOR
-- Este código recrea las vistas incluyendo los campos de comprobantes

-- ===================================
-- PARTE 1: ELIMINAR VISTAS EXISTENTES
-- ===================================

DROP VIEW IF EXISTS prefondeos_v2_view;
DROP VIEW IF EXISTS prefondeos_v2_notifications_view;

-- ===================================
-- PARTE 2: RECREAR VISTAS CON RECEIPT
-- ===================================

-- Vista principal con información de comprobantes
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

-- Vista de notificaciones con información de comprobantes
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

-- ===================================
-- VERIFICACIÓN
-- ===================================

-- Verificar que las vistas tienen las columnas correctas
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'prefondeos_v2_view' 
ORDER BY ordinal_position;

