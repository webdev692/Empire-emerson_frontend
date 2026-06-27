CREATE TABLE IF NOT EXISTS leads (
  id              UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  first_name      TEXT,
  last_name       TEXT,
  full_name       TEXT,
  email           TEXT        NOT NULL,
  phone           TEXT,
  message         TEXT,
  service_interest TEXT,
  urgency         TEXT,
  intent_description TEXT,
  track_interest  TEXT,
  division        TEXT,
  division_label  TEXT,
  status          TEXT        NOT NULL DEFAULT 'new',
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Row-level security
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Anyone can insert (contact form submissions)
CREATE POLICY "allow_insert" ON leads
  FOR INSERT TO anon WITH CHECK (true);

-- Only authenticated users can read (admin dashboard)
CREATE POLICY "allow_authenticated_read" ON leads
  FOR SELECT TO authenticated USING (true);
