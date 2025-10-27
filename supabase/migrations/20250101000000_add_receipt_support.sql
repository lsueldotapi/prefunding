/*
  # Add Receipt Support for Prefunding V2
  
  1. Changes
    - Add receipt_url column to prefunding_v2 for storing file URLs
    - Add receipt_file_name column to prefunding_v2 for storing original filename
    
  2. Security
    - Maintain existing RLS policies
    - Keep same access controls
    
  IMPORTANT: After running this migration, you need to create the storage bucket
  'prefunding-receipts' in the Supabase dashboard with public read access.
  
  To create the bucket:
  1. Go to Supabase Dashboard > Storage
  2. Click "New Bucket"
  3. Name: prefunding-receipts
  4. Public bucket: Yes (for reading receipts)
  5. File size limit: 5242880 (5MB)
  6. Allowed MIME types: application/pdf, image/jpeg, image/png, image/jpg
  
  Storage policies will be created automatically with public access.
*/

-- Add receipt storage fields to prefunding_v2
ALTER TABLE prefunding_v2
ADD COLUMN IF NOT EXISTS receipt_url text,
ADD COLUMN IF NOT EXISTS receipt_file_name text;

