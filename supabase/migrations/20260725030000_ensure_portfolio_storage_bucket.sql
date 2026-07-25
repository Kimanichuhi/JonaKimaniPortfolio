-- The original storage-bucket migration (20260617111749) used plain INSERT
-- and CREATE POLICY, which error out if run twice or if the bucket/policies
-- already exist from a prior partial run. This ensures the same end state
-- idempotently, so it's safe to run regardless of what's already live.

INSERT INTO storage.buckets (id, name, public)
VALUES ('portfolio-images', 'portfolio-images', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "read_portfolio_images" ON storage.objects;
CREATE POLICY "read_portfolio_images" ON storage.objects FOR SELECT
  TO public USING (bucket_id = 'portfolio-images');

DROP POLICY IF EXISTS "upload_portfolio_images" ON storage.objects;
CREATE POLICY "upload_portfolio_images" ON storage.objects FOR INSERT
  TO authenticated WITH CHECK (bucket_id = 'portfolio-images');

DROP POLICY IF EXISTS "update_portfolio_images" ON storage.objects;
CREATE POLICY "update_portfolio_images" ON storage.objects FOR UPDATE
  TO authenticated USING (bucket_id = 'portfolio-images') WITH CHECK (bucket_id = 'portfolio-images');

DROP POLICY IF EXISTS "delete_portfolio_images" ON storage.objects;
CREATE POLICY "delete_portfolio_images" ON storage.objects FOR DELETE
  TO authenticated USING (bucket_id = 'portfolio-images');
