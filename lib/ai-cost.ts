/**
 * Per-org AI cost tracking.
 *
 * Stores monthly token + cost totals in the settings table.
 * When org_id multi-tenancy lands (#4), these keys will be scoped per org.
 *
 * Settings keys used:
 *   ai_cost_cap_usd      — monthly hard cap (default "10.00")
 *   ai_tokens_ytm        — tokens used this calendar month (YYYY-MM)
 *   ai_cost_usd_ytm      — estimated USD cost this calendar month
 *   ai_cost_month        — the YYYY-MM these counters belong to (reset on change)
 */

import { supabaseAdmin } from "@/lib/supabase";

export const DEFAULT_MONTHLY_CAP_USD = 10.0;

/** Anthropic claude-haiku-3 pricing ($ per 1 million tokens) as of mid-2025 */
const COST_PER_1M_INPUT = 0.25;
const COST_PER_1M_OUTPUT = 1.25;

export interface AiUsage {
  inputTokens: number;
  outputTokens: number;
}

function currentMonth(): string {
  return new Date().toISOString().slice(0, 7); // "YYYY-MM"
}

async function getSetting(key: string): Promise<string | null> {
  try {
    const { data } = await supabaseAdmin
      .from("settings")
      .select("value")
      .eq("key", key)
      .single();
    return data?.value ?? null;
  } catch {
    return null;
  }
}

async function setSetting(key: string, value: string): Promise<void> {
  try {
    const existing = await getSetting(key);
    if (existing !== null) {
      await supabaseAdmin.from("settings").update({ value }).eq("key", key);
    } else {
      await supabaseAdmin.from("settings").insert({ key, value });
    }
  } catch {
    // best-effort; don't break the chat response
  }
}

/**
 * Check whether the org is within its monthly AI cost cap.
 * Returns { allowed: true } or { allowed: false, capUsd: number, usedUsd: number }.
 */
export async function checkCostCap(
  orgId?: string
): Promise<{ allowed: boolean; capUsd: number; usedUsd: number }> {
  const prefix = orgId ? `org_${orgId}_` : "";

  const [capRaw, usedRaw, monthRaw] = await Promise.all([
    getSetting(`${prefix}ai_cost_cap_usd`),
    getSetting(`${prefix}ai_cost_usd_ytm`),
    getSetting(`${prefix}ai_cost_month`),
  ]);

  const capUsd = capRaw ? parseFloat(capRaw) : DEFAULT_MONTHLY_CAP_USD;
  const month = currentMonth();

  // Reset counters if we've rolled into a new month
  let usedUsd = usedRaw && monthRaw === month ? parseFloat(usedRaw) : 0;

  return {
    allowed: usedUsd < capUsd,
    capUsd,
    usedUsd,
  };
}

/**
 * Record token usage after a successful AI call.
 * Fire-and-forget — caller should not await critically.
 */
export async function recordUsage(usage: AiUsage, orgId?: string): Promise<void> {
  const prefix = orgId ? `org_${orgId}_` : "";
  const month = currentMonth();

  const [tokensRaw, costRaw, monthRaw] = await Promise.all([
    getSetting(`${prefix}ai_tokens_ytm`),
    getSetting(`${prefix}ai_cost_usd_ytm`),
    getSetting(`${prefix}ai_cost_month`),
  ]);

  const prevTokens = tokensRaw && monthRaw === month ? parseInt(tokensRaw, 10) : 0;
  const prevCost = costRaw && monthRaw === month ? parseFloat(costRaw) : 0;

  const addedCost =
    (usage.inputTokens / 1_000_000) * COST_PER_1M_INPUT +
    (usage.outputTokens / 1_000_000) * COST_PER_1M_OUTPUT;

  await Promise.all([
    setSetting(`${prefix}ai_tokens_ytm`, String(prevTokens + usage.inputTokens + usage.outputTokens)),
    setSetting(`${prefix}ai_cost_usd_ytm`, (prevCost + addedCost).toFixed(6)),
    setSetting(`${prefix}ai_cost_month`, month),
  ]);
}

/**
 * Read current usage stats for display in the dashboard.
 */
export async function getUsageStats(orgId?: string): Promise<{
  capUsd: number;
  usedUsd: number;
  usedTokens: number;
  month: string;
}> {
  const prefix = orgId ? `org_${orgId}_` : "";
  const month = currentMonth();

  const [capRaw, usedUsdRaw, usedTokensRaw, monthRaw] = await Promise.all([
    getSetting(`${prefix}ai_cost_cap_usd`),
    getSetting(`${prefix}ai_cost_usd_ytm`),
    getSetting(`${prefix}ai_tokens_ytm`),
    getSetting(`${prefix}ai_cost_month`),
  ]);

  const sameMonth = monthRaw === month;
  return {
    capUsd: capRaw ? parseFloat(capRaw) : DEFAULT_MONTHLY_CAP_USD,
    usedUsd: usedUsdRaw && sameMonth ? parseFloat(usedUsdRaw) : 0,
    usedTokens: usedTokensRaw && sameMonth ? parseInt(usedTokensRaw, 10) : 0,
    month,
  };
}
