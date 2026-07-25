-- Generic content blocks so recurring hardcoded sections (bottom CTAs,
-- the About page's bio badge/heading) become admin-editable without a
-- bespoke table per block. Each row is (page_key, block_key) -> text
-- fields. Safe to re-run: IF NOT EXISTS / DROP POLICY IF EXISTS / seed
-- only inserts rows that don't already exist.

CREATE TABLE IF NOT EXISTS page_blocks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  page_key TEXT NOT NULL,
  block_key TEXT NOT NULL,
  badge_text TEXT NOT NULL DEFAULT '',
  title TEXT NOT NULL DEFAULT '',
  subtitle TEXT NOT NULL DEFAULT '',
  link_label TEXT NOT NULL DEFAULT '',
  UNIQUE (page_key, block_key)
);

ALTER TABLE page_blocks ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "read_page_blocks" ON page_blocks;
CREATE POLICY "read_page_blocks" ON page_blocks FOR SELECT
  TO public USING (true);

DROP POLICY IF EXISTS "insert_page_blocks" ON page_blocks;
CREATE POLICY "insert_page_blocks" ON page_blocks FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "update_page_blocks" ON page_blocks;
CREATE POLICY "update_page_blocks" ON page_blocks FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "delete_page_blocks" ON page_blocks;
CREATE POLICY "delete_page_blocks" ON page_blocks FOR DELETE
  TO authenticated USING (true);

INSERT INTO page_blocks (page_key, block_key, badge_text, title, subtitle, link_label) VALUES
  ('home', 'cta1', 'Now Accepting New Clients', 'Let''s Build Something Amazing', 'Book a free consultation to discuss your project, get strategic advice, or explore partnership opportunities.', 'Book a Consultation'),
  ('home', 'cta2', '', 'Stay in the Loop', 'Get insights on technology, leadership, and Africa''s digital transformation delivered to your inbox.', 'Subscribe to Newsletter'),
  ('about', 'bio', 'CEO & Founder', 'The Man Behind the Mission', 'Qeem Labs Ltd', ''),
  ('about', 'cta', '', 'Let''s Connect', 'Whether you have a project in mind, want to explore partnership opportunities, or just want to chat about tech in Africa — I''d love to hear from you.', ''),
  ('projects', 'cta', '', 'Interested in working together?', 'Let''s build something amazing together. Whether you need a full-stack application, AI integration, or digital transformation consulting.', ''),
  ('project_detail', 'cta', '', 'Like what you see?', 'Let''s collaborate on your next project and build something amazing together.', 'Get in Touch')
ON CONFLICT (page_key, block_key) DO NOTHING;
