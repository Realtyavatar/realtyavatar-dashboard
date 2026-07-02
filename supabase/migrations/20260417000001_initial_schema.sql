-- Leads
CREATE TABLE IF NOT EXISTS leads (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  property TEXT,
  suburb TEXT,
  budget TEXT,
  price TEXT,
  requested TEXT,
  status TEXT DEFAULT 'New',
  notes TEXT DEFAULT '',
  captured TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Listings
CREATE TABLE IF NOT EXISTS listings (
  id BIGSERIAL PRIMARY KEY,
  address TEXT NOT NULL,
  suburb TEXT,
  price TEXT,
  type TEXT DEFAULT 'Sale',
  beds INTEGER DEFAULT 0,
  baths INTEGER DEFAULT 0,
  parking INTEGER DEFAULT 0,
  docs TEXT DEFAULT '0 Uploaded',
  status TEXT DEFAULT 'Active',
  img TEXT DEFAULT '#DBEAFE',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Rentals
CREATE TABLE IF NOT EXISTS rentals (
  id BIGSERIAL PRIMARY KEY,
  address TEXT NOT NULL,
  suburb TEXT,
  price TEXT,
  beds INTEGER DEFAULT 0,
  baths INTEGER DEFAULT 0,
  parking INTEGER DEFAULT 0,
  available TEXT DEFAULT 'Now',
  status TEXT DEFAULT 'Available',
  docs TEXT DEFAULT '0 Uploaded',
  img TEXT DEFAULT '#D1FAE5',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Documents
CREATE TABLE IF NOT EXISTS documents (
  id BIGSERIAL PRIMARY KEY,
  listing_id BIGINT,
  listing_address TEXT,
  doc_type TEXT,
  filename TEXT,
  status TEXT DEFAULT 'Uploaded',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Campaigns
CREATE TABLE IF NOT EXISTS campaigns (
  id BIGSERIAL PRIMARY KEY,
  suburb TEXT NOT NULL,
  radius TEXT DEFAULT '10 km',
  type TEXT DEFAULT 'Seller Outreach',
  message TEXT DEFAULT '',
  status TEXT DEFAULT 'Draft',
  leads_captured INTEGER DEFAULT 0,
  clicks INTEGER DEFAULT 0,
  last_sent TEXT DEFAULT 'Not started',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Team members
CREATE TABLE IF NOT EXISTS team_members (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT DEFAULT '',
  role TEXT DEFAULT 'Agent',
  department TEXT DEFAULT 'Sales',
  status TEXT DEFAULT 'Active',
  avatar_color TEXT DEFAULT '#2342B0',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Settings
CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY,
  value TEXT
);

-- Enable Row Level Security
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE rentals ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- Policies (temporary allow-all — locked down in migration 000001 and 000003)
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow all' AND tablename = 'leads') THEN
    CREATE POLICY "Allow all" ON leads FOR ALL USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow all' AND tablename = 'listings') THEN
    CREATE POLICY "Allow all" ON listings FOR ALL USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow all' AND tablename = 'rentals') THEN
    CREATE POLICY "Allow all" ON rentals FOR ALL USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow all' AND tablename = 'documents') THEN
    CREATE POLICY "Allow all" ON documents FOR ALL USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow all' AND tablename = 'campaigns') THEN
    CREATE POLICY "Allow all" ON campaigns FOR ALL USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow all' AND tablename = 'team_members') THEN
    CREATE POLICY "Allow all" ON team_members FOR ALL USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow all' AND tablename = 'settings') THEN
    CREATE POLICY "Allow all" ON settings FOR ALL USING (true);
  END IF;
END $$;
