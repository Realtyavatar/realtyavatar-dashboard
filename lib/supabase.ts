import { createClient } from "@supabase/supabase-js";

// Fall back to inert placeholders when env vars are absent (e.g. CI builds).
// API routes already catch failed queries and serve demo data, so a client
// pointed at the placeholder URL degrades gracefully instead of crashing
// module evaluation at build time.
const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
const supabaseServiceKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY || "placeholder-service-role-key";
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-anon-key";

// Server-side client (full access) - uses secret key
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { persistSession: false }
});

// Client-side client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
