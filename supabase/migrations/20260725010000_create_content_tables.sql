-- Creates and seeds every content table the admin dashboard editors expect
-- (stats, pillars, testimonials, timeline, ventures, blog, speaking, media,
-- faq, resume x6, values, logo partners). Safe to re-run: tables use
-- IF NOT EXISTS, policies are dropped/recreated, and seed data only inserts
-- when a table is currently empty (so it never overwrites content you've
-- already edited in the admin dashboard).

CREATE TABLE IF NOT EXISTS stats (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  value INTEGER NOT NULL DEFAULT 0,
  suffix TEXT NOT NULL DEFAULT '',
  label TEXT NOT NULL DEFAULT '',
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS pillars (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL DEFAULT '',
  description TEXT NOT NULL DEFAULT '',
  icon TEXT NOT NULL DEFAULT '',
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS testimonials (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL DEFAULT '',
  title TEXT NOT NULL DEFAULT '',
  quote TEXT NOT NULL DEFAULT '',
  rating INTEGER NOT NULL DEFAULT 5,
  avatar TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS timeline_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  year TEXT NOT NULL DEFAULT '',
  title TEXT NOT NULL DEFAULT '',
  description TEXT NOT NULL DEFAULT '',
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS ventures (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL DEFAULT '',
  role TEXT NOT NULL DEFAULT '',
  type TEXT NOT NULL DEFAULT '',
  duration TEXT NOT NULL DEFAULT '',
  description TEXT NOT NULL DEFAULT '',
  revenue TEXT NOT NULL DEFAULT '',
  users TEXT NOT NULL DEFAULT '',
  team TEXT NOT NULL DEFAULT '',
  achievements TEXT[] NOT NULL DEFAULT '{}',
  link TEXT NOT NULL DEFAULT '',
  image TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS blog_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL DEFAULT '',
  excerpt TEXT NOT NULL DEFAULT '',
  category TEXT NOT NULL DEFAULT '',
  read_time TEXT NOT NULL DEFAULT '',
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  image TEXT,
  featured BOOLEAN NOT NULL DEFAULT false,
  content TEXT NOT NULL DEFAULT '',
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS speaking_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL DEFAULT '',
  date TEXT NOT NULL DEFAULT '',
  location TEXT NOT NULL DEFAULT '',
  type TEXT NOT NULL DEFAULT '',
  description TEXT NOT NULL DEFAULT '',
  video_url TEXT NOT NULL DEFAULT '',
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS media_appearances (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL DEFAULT '',
  publication TEXT NOT NULL DEFAULT '',
  date TEXT NOT NULL DEFAULT '',
  type TEXT NOT NULL DEFAULT '',
  link TEXT NOT NULL DEFAULT '',
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS faq_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  question TEXT NOT NULL DEFAULT '',
  answer TEXT NOT NULL DEFAULT '',
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS resume_data (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  summary TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS resume_experience (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL DEFAULT '',
  company TEXT NOT NULL DEFAULT '',
  duration TEXT NOT NULL DEFAULT '',
  achievements TEXT[] NOT NULL DEFAULT '{}',
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS resume_education (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  degree TEXT NOT NULL DEFAULT '',
  institution TEXT NOT NULL DEFAULT '',
  year TEXT NOT NULL DEFAULT '',
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS resume_certifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL DEFAULT '',
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS resume_skills (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL DEFAULT '',
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS resume_awards (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL DEFAULT '',
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- "values" is a reserved SQL keyword, so it must stay quoted everywhere below.
CREATE TABLE IF NOT EXISTS "values" (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL DEFAULT '',
  description TEXT NOT NULL DEFAULT '',
  icon TEXT NOT NULL DEFAULT '',
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS logo_partners (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL DEFAULT '',
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

DO $$
DECLARE
  t TEXT;
BEGIN
  FOREACH t IN ARRAY ARRAY[
    'stats', 'pillars', 'testimonials', 'timeline_events', 'ventures',
    'blog_posts', 'speaking_events', 'media_appearances', 'faq_items',
    'resume_data', 'resume_experience', 'resume_education',
    'resume_certifications', 'resume_skills', 'resume_awards',
    'values', 'logo_partners'
  ]
  LOOP
    EXECUTE format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY', t);

    EXECUTE format('DROP POLICY IF EXISTS "read_%s" ON %I', t, t);
    EXECUTE format('CREATE POLICY "read_%s" ON %I FOR SELECT TO public USING (true)', t, t);

    EXECUTE format('DROP POLICY IF EXISTS "insert_%s" ON %I', t, t);
    EXECUTE format('CREATE POLICY "insert_%s" ON %I FOR INSERT TO authenticated WITH CHECK (true)', t, t);

    EXECUTE format('DROP POLICY IF EXISTS "update_%s" ON %I', t, t);
    EXECUTE format('CREATE POLICY "update_%s" ON %I FOR UPDATE TO authenticated USING (true) WITH CHECK (true)', t, t);

    EXECUTE format('DROP POLICY IF EXISTS "delete_%s" ON %I', t, t);
    EXECUTE format('CREATE POLICY "delete_%s" ON %I FOR DELETE TO authenticated USING (true)', t, t);
  END LOOP;
END $$;

-- Backfill: seed each table with the content previously hardcoded in
-- src/data/content.ts (and the "values" fallback from src/lib/dataCache.ts),
-- generated programmatically to avoid transcription errors. Each block only
-- inserts if the table is currently empty.
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM stats) THEN
    INSERT INTO stats (value, suffix, label, sort_order) VALUES
  (15, '+', 'Years in Tech', 1),
  (3, '+', 'Companies Founded', 2),
  (50, '+', 'Team Members Managed', 3),
  (25, '+', 'Articles Published', 4),
  (40, '+', 'Speaking Engagements', 5),
  (10, '+', 'Awards', 6);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pillars) THEN
    INSERT INTO pillars (title, description, icon, sort_order) VALUES
  ('Vision', 'Leading digital transformation across Africa', 'Eye', 1),
  ('Leadership', 'Driving innovation in AI, SaaS, and emerging tech', 'Crown', 2),
  ('Impact', 'Building companies that create real-world value', 'Target', 3);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM testimonials) THEN
    INSERT INTO testimonials (name, title, quote, rating, avatar, sort_order) VALUES
  ('Grace Mwangi', 'CTO, TechVentures Africa', 'Jonah''s vision for technology in Africa is unmatched. His leadership at Qeem Labs has set a new standard for innovation on the continent.', 5, 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150', 1),
  ('David Ochieng', 'Partner, Savannah Capital', 'Working with Jonah showed me what true entrepreneurial drive looks like. He doesn''t just predict the future — he builds it.', 5, 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150', 2),
  ('Amara Diallo', 'Director, AfriTech Summit', 'Jonah''s keynote at our summit was the most impactful session we''ve ever had. He articulates complex ideas with clarity and passion.', 5, 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150', 3),
  ('Michael Njoroge', 'VP Engineering, CloudPesa', 'The tech infrastructure Jonah has built is world-class. His understanding of both business and technology is rare and invaluable.', 5, 'https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=150', 4);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM timeline_events) THEN
    INSERT INTO timeline_events (year, title, description, sort_order) VALUES
  ('2010', 'Started Career in Tech', 'Began as a software developer at a leading Nairobi tech firm, building enterprise solutions for East African markets.', 1),
  ('2012', 'First Startup Venture', 'Co-founded a mobile payments platform that processed over $2M in transactions within the first year.', 2),
  ('2014', 'Technical Leadership Role', 'Joined a Series B startup as VP of Engineering, growing the team from 5 to 30 engineers.', 3),
  ('2016', 'Founded Qeem Labs', 'Launched Qeem Labs with a mission to build world-class digital products from Africa for the global market.', 4),
  ('2018', 'Series A Funding', 'Secured $5M in Series A funding, scaling operations across Kenya, Nigeria, and South Africa.', 5),
  ('2020', 'Pandemic Pivot & Growth', 'Navigated COVID-19 by accelerating digital transformation services, tripling annual revenue.', 6),
  ('2022', 'Continental Expansion', 'Expanded to 8 African countries, launched AI-powered product suite serving 100K+ users.', 7),
  ('2024', 'Industry Recognition', 'Named among Africa''s Top 50 Tech Leaders by Forbes Africa. Keynote at Africa Tech Summit.', 8),
  ('2026', 'Next Chapter', 'Scaling Qeem Labs to serve global markets while deepening impact across Africa''s tech ecosystem.', 9);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM ventures) THEN
    INSERT INTO ventures (name, role, type, duration, description, revenue, users, team, achievements, link, image, sort_order) VALUES
  ('Qeem Labs Ltd', 'CEO & Founder', 'Founder', '2016 - Present', 'Full-stack digital agency building world-class products from Africa. Specializing in AI, SaaS, and custom enterprise solutions.', '$10M+ ARR', '100K+', '50+', ARRAY['Expanded to 8 African countries', 'Launched AI-powered product suite', 'Secured Series A funding', 'Named Top 50 Tech Leaders']::text[], 'https://qeemlabs.co.ke', 'https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=800', 1),
  ('PayFlow Africa', 'Co-Founder', 'Founder', '2012 - 2015', 'Mobile payments platform enabling seamless transactions across East Africa. Processed over $50M before acquisition.', '$2M+ (at exit)', '30K+', '15', ARRAY['First mobile payment integration in rural Kenya', 'Processed $50M+ in transactions', 'Acquired by regional fintech']::text[], '', 'https://images.pexels.com/photos/838644/pexels-photo-838644.jpeg?auto=compress&cs=tinysrgb&w=800', 2),
  ('AfriCloud', 'Advisor', 'Advisor', '2019 - Present', 'Cloud infrastructure provider making enterprise-grade hosting accessible to African businesses.', '$3M ARR', '500+', '20', ARRAY['Reduced cloud costs by 60% for SMEs', 'Data centers in 3 African regions', 'Partnered with major cloud providers']::text[], '', 'https://images.pexels.com/photos/1148820/pexels-photo-1148820.jpeg?auto=compress&cs=tinysrgb&w=800', 3),
  ('NairobiAI', 'Investor', 'Investor', '2021 - Present', 'AI research lab focused on building language models and computer vision solutions for African contexts.', 'Pre-revenue', 'N/A', '12', ARRAY['Published 5 research papers', 'Built Swahili NLP model', 'Raised $2M seed round']::text[], '', 'https://images.pexels.com/photos/838644/pexels-photo-838644.jpeg?auto=compress&cs=tinysrgb&w=800', 4);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM blog_posts) THEN
    INSERT INTO blog_posts (title, excerpt, category, read_time, date, image, featured, content, sort_order) VALUES
  ('The Future of AI in Africa: Opportunities and Challenges', 'As Africa leaps into the AI era, we must address infrastructure gaps while leveraging our unique advantages in mobile-first innovation.', 'Technology & Innovation', '8 min', '2026-05-20', 'https://images.pexels.com/photos/838644/pexels-photo-838644.jpeg?auto=compress&cs=tinysrgb&w=800', true, '', 1),
  ('Building World-Class Teams from Nairobi', 'How we built a 50-person team that competes globally, and what African tech leaders can learn from our hiring philosophy.', 'Leadership', '6 min', '2026-04-15', 'https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=800', false, '', 2),
  ('Why Africa Needs Its Own SaaS Ecosystem', 'The continent can''t rely on imported software forever. Here''s why building local SaaS is both an economic imperative and a massive opportunity.', 'African Tech', '10 min', '2026-03-28', 'https://images.pexels.com/photos/1181263/pexels-photo-1181263.jpeg?auto=compress&cs=tinysrgb&w=800', false, '', 3),
  ('From Side Project to Series A: My Entrepreneurial Journey', 'The honest, unvarnished story of how Qeem Labs went from a weekend project to a funded company serving the continent.', 'Entrepreneurship', '12 min', '2026-02-14', 'https://images.pexels.com/photos/905163/pexels-photo-905163.jpeg?auto=compress&cs=tinysrgb&w=800', false, '', 4),
  ('The Case for Optimism in African Tech', 'Despite challenges, the fundamentals of African tech have never been stronger. Here''s why I''m more bullish than ever.', 'Opinion', '7 min', '2026-01-30', 'https://images.pexels.com/photos/1181298/pexels-photo-1181298.jpeg?auto=compress&cs=tinysrgb&w=800', false, '', 5),
  ('Lessons from Scaling Across 8 African Markets', 'Each African market is unique. Here are the hard-won lessons from expanding Qeem Labs across the continent.', 'African Tech', '9 min', '2025-12-18', 'https://images.pexels.com/photos/1148820/pexels-photo-1148820.jpeg?auto=compress&cs=tinysrgb&w=800', false, '', 6);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM speaking_events) THEN
    INSERT INTO speaking_events (title, date, location, type, description, video_url, sort_order) VALUES
  ('Africa Tech Summit 2026', 'March 15, 2026', 'Nairobi, Kenya', 'Keynote', 'Delivered the opening keynote on "AI-First Africa: Building the Continent''s Digital Backbone"', '#', 1),
  ('Web Summit 2025', 'November 14, 2025', 'Lisbon, Portugal', 'Panel', 'Panel discussion on emerging markets and the next wave of global tech innovation.', '#', 2),
  ('TEDx Nairobi', 'September 8, 2025', 'Nairobi, Kenya', 'Talk', '"Why Africa''s Digital Future Matters for Everyone" — exploring the global implications of Africa''s tech rise.', '#', 3),
  ('Google for Africa 2025', 'June 22, 2025', 'Lagos, Nigeria', 'Keynote', 'Spoke on building scalable infrastructure for Africa''s next billion users.', '#', 4),
  ('Disrupt Africa Conference', 'April 5, 2025', 'Cape Town, South Africa', 'Workshop', 'Led a workshop on "From MVP to Scale: Product Strategy for African Markets"', '#', 5),
  ('Microsoft Africa Developer Conference', 'February 18, 2025', 'Virtual', 'Fireside Chat', 'Fireside chat on cloud computing adoption and developer tools for Africa.', '#', 6);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM media_appearances) THEN
    INSERT INTO media_appearances (title, publication, date, type, link, sort_order) VALUES
  ('Africa''s Next Tech Giants', 'Forbes Africa', 'May 2026', 'Article', '#', 1),
  ('Building Qeem Labs: A Conversation with Jonah Kimani', 'TechCrunch', 'March 2026', 'Interview', '#', 2),
  ('The African SaaS Revolution', 'a16z Podcast', 'January 2026', 'Podcast', '#', 3),
  ('Founder Stories: From Nairobi to the World', 'Product Hunt', 'November 2025', 'Podcast', '#', 4),
  ('Tech Leaders Shaping Africa''s Future', 'CNN Africa', 'September 2025', 'Video', '#', 5),
  ('The Rise of African Cloud Infrastructure', 'MIT Technology Review', 'July 2025', 'Article', '#', 6);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM faq_items) THEN
    INSERT INTO faq_items (question, answer, sort_order) VALUES
  ('What is Qeem Labs?', 'Qeem Labs is a full-stack digital agency based in Nairobi, Kenya, specializing in AI, SaaS, and custom enterprise solutions. We build world-class digital products from Africa for the global market, serving clients across 8 African countries.', 1),
  ('What industries does Jonah focus on?', 'Jonah focuses primarily on AI and machine learning, SaaS platforms, cloud infrastructure, fintech, and emerging technologies. His work spans healthcare, agriculture, logistics, and enterprise digital transformation.', 2),
  ('Is Jonah available for speaking engagements?', 'Yes, Jonah regularly speaks at tech conferences, corporate events, and universities. Topics include AI in Africa, entrepreneurship, digital transformation, and leadership. You can reach out through the contact form to discuss speaking opportunities.', 3),
  ('How can I invest in or partner with Qeem Labs?', 'Qeem Labs is always open to strategic partnerships and investment discussions. Please use the contact form with the "Investment" inquiry type, and our team will follow up with relevant information.', 4),
  ('Does Jonah offer mentorship or advisory services?', 'Jonah serves as an advisor to several startups and is selective about mentorship commitments. For advisory inquiries, please use the contact form with the "Advisory" inquiry type.', 5);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM resume_data) THEN
    INSERT INTO resume_data (summary) VALUES
  ('Visionary tech entrepreneur with 15+ years of experience building and scaling digital products across Africa. Founder & CEO of Qeem Labs, leading a 50+ person team serving clients in 8 countries. Passionate about leveraging AI, SaaS, and emerging technology to drive digital transformation across the continent.');
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM resume_experience) THEN
    INSERT INTO resume_experience (title, company, duration, achievements, sort_order) VALUES
  ('CEO & Founder', 'Qeem Labs', '2016 - Present', ARRAY['Built $10M+ ARR business from scratch', 'Scaled team to 50+ across 8 countries', 'Launched AI-powered product suite serving 100K+ users', 'Secured Series A funding of $5M']::text[], 1),
  ('VP of Engineering', 'TechScale Africa', '2014 - 2016', ARRAY['Grew engineering team from 5 to 30', 'Delivered 3 major product launches', 'Reduced infrastructure costs by 40%']::text[], 2),
  ('Co-Founder', 'PayFlow Africa', '2012 - 2015', ARRAY['Built mobile payments platform processing $50M+', 'Secured 30K+ active users', 'Successfully exited via acquisition']::text[], 3),
  ('Software Developer', 'NairobiTech Solutions', '2010 - 2012', ARRAY['Built enterprise solutions for East African markets', 'Led development of core banking module', 'Promoted to senior developer within 18 months']::text[], 4);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM resume_education) THEN
    INSERT INTO resume_education (degree, institution, year, sort_order) VALUES
  ('MSc Computer Science', 'University of Nairobi', '2013', 1),
  ('BSc Computer Science', 'Jomo Kenyatta University', '2010', 2);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM resume_certifications) THEN
    INSERT INTO resume_certifications (name, sort_order) VALUES
  ('AWS Solutions Architect Professional', 1),
  ('Google Cloud Professional Architect', 2),
  ('Stanford Graduate School of Business — Executive Program', 3);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM resume_skills) THEN
    INSERT INTO resume_skills (name, sort_order) VALUES
  ('Strategic Leadership', 1),
  ('Product Strategy', 2),
  ('AI & Machine Learning', 3),
  ('Cloud Architecture', 4),
  ('SaaS Development', 5),
  ('Team Building', 6),
  ('Fundraising', 7),
  ('Go-to-Market Strategy', 8),
  ('Business Development', 9),
  ('Technical Architecture', 10),
  ('Agile Methodologies', 11),
  ('Public Speaking', 12);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM resume_awards) THEN
    INSERT INTO resume_awards (name, sort_order) VALUES
  ('Forbes Africa Top 50 Tech Leaders (2024)', 1),
  ('Africa Tech Summit Innovation Award (2023)', 2),
  ('Kenya ICT Excellence Award (2022)', 3),
  ('Global Entrepreneurship Week — Top 10 African Founders (2021)', 4);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM "values") THEN
    INSERT INTO "values" (title, description, icon, sort_order) VALUES
  ('Innovation', 'Pushing boundaries and embracing new technologies to solve real problems.', 'Lightbulb', 1),
  ('Integrity', 'Operating with transparency, honesty, and accountability in everything.', 'Heart', 2),
  ('Impact', 'Creating solutions that make a measurable difference in people''s lives.', 'Globe', 3),
  ('Community', 'Building ecosystems that uplift teams, partners, and the broader tech community.', 'Users', 4),
  ('Learning', 'Committed to continuous growth and sharing knowledge with the next generation.', 'BookOpen', 5),
  ('Excellence', 'Delivering world-class quality that competes on the global stage.', 'Award', 6);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM logo_partners) THEN
    INSERT INTO logo_partners (name, sort_order) VALUES
  ('Google', 1),
  ('Microsoft', 2),
  ('AWS', 3),
  ('Stripe', 4),
  ('Shopify', 5),
  ('Salesforce', 6),
  ('HubSpot', 7),
  ('Slack', 8);
  END IF;
END $$;
