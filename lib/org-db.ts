/**
 * Org-scoped Supabase helpers.
 *
 * All queries against multi-tenant tables MUST include `.eq("org_id", orgId)`
 * to prevent cross-tenant data leakage. Use `withOrg` to stamp inserts.
 *
 * Usage (SELECT/UPDATE/DELETE — add .eq manually after .select/.update/.delete):
 *   const { data } = await supabaseAdmin
 *     .from("leads")
 *     .select("*")
 *     .eq("org_id", Number(session.orgId));   // ← always add this
 *
 * Usage (INSERT — use withOrg to stamp the payload):
 *   await supabaseAdmin.from("leads").insert(withOrg(body, session.orgId));
 */

/** Tables that carry an org_id column (added in migration 000003). */
export const MULTI_TENANT_TABLES = [
  "leads",
  "listings",
  "rentals",
  "documents",
  "campaigns",
  "team_members",
] as const;

export type MultiTenantTable = (typeof MULTI_TENANT_TABLES)[number];

/**
 * Merges org_id into an insert/update payload so you never forget it.
 */
export function withOrg<T extends object>(
  payload: T,
  orgId: string | number
): T & { org_id: number } {
  return { ...payload, org_id: Number(orgId) };
}
