-- site_config was referenced by SiteConfigEditor, dataCache.ts, and (as of
-- the previous migration) an ALTER TABLE -- but no migration ever actually
-- created it. This is the gap behind "relation site_config does not exist".
-- Safe to re-run: IF NOT EXISTS / DROP POLICY IF EXISTS / seed only if empty.

CREATE TABLE IF NOT EXISTS site_config (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL DEFAULT '',
  title TEXT NOT NULL DEFAULT '',
  tagline TEXT NOT NULL DEFAULT '',
  roles TEXT NOT NULL DEFAULT '',
  email TEXT NOT NULL DEFAULT '',
  phone TEXT NOT NULL DEFAULT '',
  whatsapp TEXT NOT NULL DEFAULT '',
  calendly TEXT NOT NULL DEFAULT '',
  address TEXT NOT NULL DEFAULT '',
  twitter TEXT NOT NULL DEFAULT '',
  linkedin TEXT NOT NULL DEFAULT '',
  github TEXT NOT NULL DEFAULT '',
  hero_image TEXT,
  about_image TEXT,
  logo_url TEXT,
  philosophy_quote TEXT NOT NULL DEFAULT '',
  bio TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE site_config ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "read_site_config" ON site_config;
CREATE POLICY "read_site_config" ON site_config FOR SELECT
  TO public USING (true);

DROP POLICY IF EXISTS "insert_site_config" ON site_config;
CREATE POLICY "insert_site_config" ON site_config FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "update_site_config" ON site_config;
CREATE POLICY "update_site_config" ON site_config FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "delete_site_config" ON site_config;
CREATE POLICY "delete_site_config" ON site_config FOR DELETE
  TO authenticated USING (true);

INSERT INTO site_config (
  name, title, tagline, roles, email, phone, whatsapp, calendly, address,
  twitter, linkedin, github, hero_image, about_image, logo_url, philosophy_quote, bio
)
SELECT
  'Jonah Kimani',
  'CEO of Qeem Labs',
  'Innovating Africa''s Digital Future',
  'CEO • Founder • Innovator • Thought Leader',
  'jonah@qeemlabs.com',
  '+254 700 000 000',
  'https://wa.me/254700000000',
  'https://calendly.com/jonahkimani',
  'Nairobi, Kenya',
  'https://twitter.com/jonahkimani',
  'https://linkedin.com/in/jonahkimani',
  'https://github.com/jonahkimani',
  'https://images.pexels.com/photos/1181298/pexels-photo-1181298.jpeg?auto=compress&cs=tinysrgb&w=1920',
  'https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=800',
  NULL,
  'Africa doesn''t just need technology — it needs technology built for its reality. When we design from the continent, for the continent, we create solutions that the world learns from.',
  'Jonah Kimani is a Kenyan tech entrepreneur and the CEO of Qeem Labs, one of Africa''s fastest-growing digital agencies. With over 15 years in the technology sector, he has built and scaled multiple ventures that are shaping the continent''s digital landscape.'
WHERE NOT EXISTS (SELECT 1 FROM site_config);
