-- Script to set up storage bucket policies for receipt uploads
-- Run this after creating the 'prefunding-receipts' bucket in Supabase Dashboard
-- This can be executed in the Supabase SQL Editor

-- Create policy for allowing public uploads to prefunding-receipts bucket
-- Note: This allows anyone to upload, which is required for the public prefunding flow
CREATE POLICY "Allow public uploads to prefunding-receipts"
ON storage.objects FOR INSERT
TO public
WITH CHECK (bucket_id = 'prefunding-receipts');

-- Create policy for allowing public reads from prefunding-receipts bucket
-- This allows viewing/downloading the receipts
CREATE POLICY "Allow public read access to prefunding-receipts"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'prefunding-receipts');

-- Optional: Create policy to allow users to update/delete their own files
-- CREATE POLICY "Allow public update own receipts"
-- ON storage.objects FOR UPDATE
-- TO public
-- USING (bucket_id = 'prefunding-receipts');

-- CREATE POLICY "Allow public delete own receipts"
-- ON storage.objects FOR DELETE
-- TO public
-- USING (bucket_id = 'prefunding-receipts');

