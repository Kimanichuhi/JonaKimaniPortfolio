INSERT INTO storage.buckets (id, name, public) VALUES ('portfolio-images', 'portfolio-images', true);

CREATE POLICY "read_portfolio_images" ON storage.objects FOR SELECT TO public USING (bucket_id = 'portfolio-images');
CREATE POLICY "upload_portfolio_images" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'portfolio-images');
CREATE POLICY "update_portfolio_images" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'portfolio-images') WITH CHECK (bucket_id = 'portfolio-images');
CREATE POLICY "delete_portfolio_images" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'portfolio-images');