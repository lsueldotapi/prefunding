/*
  # Setup Storage Policies for Receipt Uploads
  
  1. Policies
    - Allow public INSERT (upload) to prefunding-receipts bucket
    - Allow public SELECT (read) from prefunding-receipts bucket
    
  2. Important: Run this AFTER creating the 'prefunding-receipts' bucket
     in Supabase Dashboard as a PUBLIC bucket
*/

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow public uploads to prefunding-receipts" ON storage.objects;
DROP POLICY IF EXISTS "Allow public read access to prefunding-receipts" ON storage.objects;

-- Create policy for allowing public uploads to prefunding-receipts bucket
CREATE POLICY "Allow public uploads to prefunding-receipts"
ON storage.objects FOR INSERT
TO public
WITH CHECK (bucket_id = 'prefunding-receipts');

-- Create policy for allowing public reads from prefunding-receipts bucket
CREATE POLICY "Allow public read access to prefunding-receipts"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'prefunding-receipts');

