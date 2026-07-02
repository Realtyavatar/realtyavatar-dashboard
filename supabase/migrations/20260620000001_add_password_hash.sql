-- Phase 2: Real password hashing
-- Add password_hash column to team_members.
-- Until passwords are migrated, the server falls back to the temporary scheme.
-- To set a real password: UPDATE team_members SET password_hash = crypt('newpass', gen_salt('bf')) WHERE email = '...';

ALTER TABLE team_members ADD COLUMN IF NOT EXISTS password_hash TEXT;

-- Tighten RLS: restrict to authenticated users only (service_role bypasses RLS).
-- Remove the blanket "allow all" policies and replace with proper ones.

DROP POLICY IF EXISTS "Allow all" ON leads;
DROP POLICY IF EXISTS "Allow all" ON listings;
DROP POLICY IF EXISTS "Allow all" ON rentals;
DROP POLICY IF EXISTS "Allow all" ON documents;
DROP POLICY IF EXISTS "Allow all" ON campaigns;
DROP POLICY IF EXISTS "Allow all" ON team_members;
DROP POLICY IF EXISTS "Allow all" ON settings;

-- Only allow access via service_role (our server-side client).
-- Anon/authenticated roles get no direct access — all queries go through authenticated API routes.
CREATE POLICY "Service role only" ON leads FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Service role only" ON listings FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Service role only" ON rentals FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Service role only" ON documents FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Service role only" ON campaigns FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Service role only" ON team_members FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Service role only" ON settings FOR ALL TO service_role USING (true) WITH CHECK (true);
