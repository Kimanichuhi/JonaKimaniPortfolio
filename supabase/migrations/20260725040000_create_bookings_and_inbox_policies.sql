-- Adds a real bookings table (BookingPage's submit handler previously
-- didn't persist anything at all) and lets authenticated admins read/manage
-- contact_submissions and newsletter_subscribers, which so far only had
-- anon INSERT policies -- an admin UI couldn't have read them. Safe to
-- re-run: IF NOT EXISTS / DROP POLICY IF EXISTS / ADD COLUMN IF NOT EXISTS
-- throughout.

CREATE TABLE IF NOT EXISTS bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  consultation_type TEXT NOT NULL DEFAULT '',
  name TEXT NOT NULL DEFAULT '',
  email TEXT NOT NULL DEFAULT '',
  company TEXT NOT NULL DEFAULT '',
  phone TEXT NOT NULL DEFAULT '',
  date TEXT NOT NULL DEFAULT '',
  time TEXT NOT NULL DEFAULT '',
  message TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Bookings contain PII (email/phone) so, unlike content tables, there is no
-- public SELECT policy -- only the person submitting can insert, only an
-- authenticated admin can read/manage.
DROP POLICY IF EXISTS "insert_bookings" ON bookings;
CREATE POLICY "insert_bookings" ON bookings FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "read_bookings" ON bookings;
CREATE POLICY "read_bookings" ON bookings FOR SELECT
  TO authenticated USING (true);

DROP POLICY IF EXISTS "update_bookings" ON bookings;
CREATE POLICY "update_bookings" ON bookings FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "delete_bookings" ON bookings;
CREATE POLICY "delete_bookings" ON bookings FOR DELETE
  TO authenticated USING (true);

-- contact_submissions: add a read/unread flag for basic inbox triage, plus
-- the missing authenticated read/manage policies.
ALTER TABLE contact_submissions ADD COLUMN IF NOT EXISTS read BOOLEAN NOT NULL DEFAULT false;

DROP POLICY IF EXISTS "read_contact_submissions" ON contact_submissions;
CREATE POLICY "read_contact_submissions" ON contact_submissions FOR SELECT
  TO authenticated USING (true);

DROP POLICY IF EXISTS "update_contact_submissions" ON contact_submissions;
CREATE POLICY "update_contact_submissions" ON contact_submissions FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "delete_contact_submissions" ON contact_submissions;
CREATE POLICY "delete_contact_submissions" ON contact_submissions FOR DELETE
  TO authenticated USING (true);

-- newsletter_subscribers: missing authenticated read/manage policies.
DROP POLICY IF EXISTS "read_newsletter_subscribers" ON newsletter_subscribers;
CREATE POLICY "read_newsletter_subscribers" ON newsletter_subscribers FOR SELECT
  TO authenticated USING (true);

DROP POLICY IF EXISTS "delete_newsletter_subscribers" ON newsletter_subscribers;
CREATE POLICY "delete_newsletter_subscribers" ON newsletter_subscribers FOR DELETE
  TO authenticated USING (true);
