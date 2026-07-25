-- Makes the remaining hardcoded images/content editable:
--  1. A background image option for each page header (page_headers already
--     exists; PageHero already accepts a background prop nothing was setting).
--  2. An optional site logo image for Header/Footer (currently a fixed "JK"
--     text badge with no image at all).
--  3. HomePage's "About Qeem Labs Ltd" card (image, badge, title,
--     description, link, 4 stat tiles) -- previously fully hardcoded in
--     HomePage.tsx with no admin access whatsoever.
-- Safe to re-run: ADD COLUMN IF NOT EXISTS / CREATE TABLE IF NOT EXISTS /
-- DROP POLICY IF EXISTS / seed only if empty throughout.

ALTER TABLE page_headers ADD COLUMN IF NOT EXISTS background_image TEXT;
ALTER TABLE site_config ADD COLUMN IF NOT EXISTS logo_url TEXT;

CREATE TABLE IF NOT EXISTS home_about_card (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  image TEXT,
  badge_text TEXT NOT NULL DEFAULT '',
  section_title TEXT NOT NULL DEFAULT '',
  section_subtitle TEXT NOT NULL DEFAULT '',
  card_title TEXT NOT NULL DEFAULT '',
  description TEXT NOT NULL DEFAULT '',
  link_url TEXT NOT NULL DEFAULT '',
  link_label TEXT NOT NULL DEFAULT '',
  stat1_value TEXT NOT NULL DEFAULT '',
  stat1_label TEXT NOT NULL DEFAULT '',
  stat2_value TEXT NOT NULL DEFAULT '',
  stat2_label TEXT NOT NULL DEFAULT '',
  stat3_value TEXT NOT NULL DEFAULT '',
  stat3_label TEXT NOT NULL DEFAULT '',
  stat4_value TEXT NOT NULL DEFAULT '',
  stat4_label TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE home_about_card ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "read_home_about_card" ON home_about_card;
CREATE POLICY "read_home_about_card" ON home_about_card FOR SELECT
  TO public USING (true);

DROP POLICY IF EXISTS "insert_home_about_card" ON home_about_card;
CREATE POLICY "insert_home_about_card" ON home_about_card FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "update_home_about_card" ON home_about_card;
CREATE POLICY "update_home_about_card" ON home_about_card FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "delete_home_about_card" ON home_about_card;
CREATE POLICY "delete_home_about_card" ON home_about_card FOR DELETE
  TO authenticated USING (true);

-- Seeded from the content that was hardcoded in HomePage.tsx (including your
-- recent hand-edits: Nakuru, "Est. 2026", and the updated stat tiles) so
-- nothing is lost when the page switches to reading from this table.
INSERT INTO home_about_card (
  image, badge_text, section_title, section_subtitle, card_title, description, link_url, link_label,
  stat1_value, stat1_label, stat2_value, stat2_label, stat3_value, stat3_label, stat4_value, stat4_label
)
SELECT
  'https://images.pexels.com/photos/3182811/pexels-photo-3182811.jpeg?auto=compress&cs=tinysrgb&w=800',
  'Est. 2026',
  'Qeem Labs Ltd',
  'A world-class digital agency building innovative solutions from Africa for the global market.',
  'Building Africa''s Digital Future',
  'Qeem Labs Ltd is a premier digital agency headquartered in Nakuru, Kenya. We specialize in AI-powered solutions, SaaS platforms, and enterprise digital transformation. Our team of experts serves clients across the country, delivering world-class products that compete Nationwide.',
  'https://qeemlabs.co.ke',
  'Visit qeemlabs.co.ke',
  '10+', 'clients Served',
  '2+', 'Companies Founded',
  '1', 'Years Of Operations',
  '20+', 'Solutions'
WHERE NOT EXISTS (SELECT 1 FROM home_about_card);
