-- Multi-tenancy: org_id on all data tables
-- #4 architecture pass
--
-- Strategy:
--   1. Create an `orgs` table to represent each agency/tenant.
--   2. Add `org_id` (FK → orgs.id) to all data tables.
--   3. Seed a default org for existing rows.
--   4. Tighten RLS: service_role can see all (server-side); auth.uid() based
--      policies can be added later when Supabase Auth is wired per-org.
--
-- NOTE: Run AFTER 20260620000001_add_password_hash.sql

-- ── 1. Orgs table ─────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS orgs (
  id           BIGSERIAL PRIMARY KEY,
  name         TEXT NOT NULL,
  slug         TEXT NOT NULL UNIQUE,       -- URL-safe identifier, e.g. "acme-realty"
  plan         TEXT NOT NULL DEFAULT 'starter',
  ai_cost_cap_usd  NUMERIC(10,2) NOT NULL DEFAULT 10.00,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE orgs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role only" ON orgs FOR ALL TO service_role USING (true) WITH CHECK (true);

-- ── 2. Seed default org for all existing single-tenant data ──────────────────

INSERT INTO orgs (id, name, slug, plan)
VALUES (1, 'Default Agency', 'default', 'starter')
ON CONFLICT (id) DO NOTHING;

-- Reset sequence so next INSERT auto-increments past 1
SELECT setval('orgs_id_seq', MAX(id)) FROM orgs;

-- ── 3. Add org_id to all data tables ─────────────────────────────────────────

ALTER TABLE leads          ADD COLUMN IF NOT EXISTS org_id BIGINT NOT NULL DEFAULT 1 REFERENCES orgs(id);
ALTER TABLE listings       ADD COLUMN IF NOT EXISTS org_id BIGINT NOT NULL DEFAULT 1 REFERENCES orgs(id);
ALTER TABLE rentals        ADD COLUMN IF NOT EXISTS org_id BIGINT NOT NULL DEFAULT 1 REFERENCES orgs(id);
ALTER TABLE documents      ADD COLUMN IF NOT EXISTS org_id BIGINT NOT NULL DEFAULT 1 REFERENCES orgs(id);
ALTER TABLE campaigns      ADD COLUMN IF NOT EXISTS org_id BIGINT NOT NULL DEFAULT 1 REFERENCES orgs(id);
ALTER TABLE team_members   ADD COLUMN IF NOT EXISTS org_id BIGINT NOT NULL DEFAULT 1 REFERENCES orgs(id);

-- settings stays key-value but we prefix keys with org_id where needed (handled in app layer)

-- ── 4. Indexes for org_id scoped queries ─────────────────────────────────────

CREATE INDEX IF NOT EXISTS leads_org_id_idx       ON leads       (org_id);
CREATE INDEX IF NOT EXISTS listings_org_id_idx    ON listings    (org_id);
CREATE INDEX IF NOT EXISTS rentals_org_id_idx     ON rentals     (org_id);
CREATE INDEX IF NOT EXISTS documents_org_id_idx   ON documents   (org_id);
CREATE INDEX IF NOT EXISTS campaigns_org_id_idx   ON campaigns   (org_id);
CREATE INDEX IF NOT EXISTS team_members_org_id_idx ON team_members (org_id);

-- ── 5. Update RLS policies to scope by org_id ─────────────────────────────────
-- service_role bypasses RLS, so these apply only to direct DB connections.
-- Add per-org policies here when you introduce Supabase Auth per org.

-- (Existing "Service role only" policies from migration 000001 are sufficient
--  for the server-side app layer. The org_id filtering is enforced in app code
--  via supabaseAdmin queries scoped with .eq("org_id", orgId).)

-- ── 6. Helper view: org usage summary ────────────────────────────────────────

CREATE OR REPLACE VIEW org_usage AS
SELECT
  o.id            AS org_id,
  o.name          AS org_name,
  o.ai_cost_cap_usd,
  COUNT(DISTINCT l.id)  AS lead_count,
  COUNT(DISTINCT li.id) AS listing_count,
  COUNT(DISTINCT r.id)  AS rental_count,
  COUNT(DISTINCT tm.id) AS team_size
FROM orgs o
LEFT JOIN leads         l  ON l.org_id  = o.id
LEFT JOIN listings      li ON li.org_id = o.id
LEFT JOIN rentals       r  ON r.org_id  = o.id
LEFT JOIN team_members  tm ON tm.org_id = o.id
GROUP BY o.id, o.name, o.ai_cost_cap_usd;
