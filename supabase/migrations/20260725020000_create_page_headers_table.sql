-- Makes each page's header (title + subtitle shown at the top, via the
-- shared PageHero component) editable from the admin dashboard. Safe to
-- re-run: IF NOT EXISTS table, policies dropped/recreated, seed only
-- inserts rows that don't already exist (keyed by page_key) so it never
-- overwrites content already edited in the admin dashboard.

CREATE TABLE IF NOT EXISTS page_headers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  page_key TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL DEFAULT '',
  subtitle TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE page_headers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "read_page_headers" ON page_headers;
CREATE POLICY "read_page_headers" ON page_headers FOR SELECT
  TO public USING (true);

DROP POLICY IF EXISTS "insert_page_headers" ON page_headers;
CREATE POLICY "insert_page_headers" ON page_headers FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "update_page_headers" ON page_headers;
CREATE POLICY "update_page_headers" ON page_headers FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "delete_page_headers" ON page_headers;
CREATE POLICY "delete_page_headers" ON page_headers FOR DELETE
  TO authenticated USING (true);

INSERT INTO page_headers (page_key, title, subtitle) VALUES
  ('about', 'About Jonah Kimani', 'A journey of innovation, leadership, and relentless pursuit of Africa''s digital potential.'),
  ('work', 'Work & Portfolio', 'Ventures built, teams led, and impact created across Africa''s tech ecosystem.'),
  ('projects', 'My Projects', 'Building intelligent digital solutions that solve real-world challenges across Agriculture, Government, Education, Real Estate, Finance, Healthcare, AI, and Enterprise Operations.'),
  ('blog', 'Blog & Thought Leadership', 'Insights on technology, leadership, and building Africa''s digital future.'),
  ('speaking', 'Speaking & Media', 'Sharing insights on stages and in publications across the globe.'),
  ('contact', 'Get in Touch', 'Whether it''s speaking, advisory, investment, or just a conversation — reach out.'),
  ('resume', 'Resume / CV', 'Professional background, experience, and credentials.'),
  ('booking', 'Book a Consultation', 'Schedule a one-on-one session with Jonah Kimani to discuss your project, get strategic advice, or explore partnership opportunities.')
ON CONFLICT (page_key) DO NOTHING;
