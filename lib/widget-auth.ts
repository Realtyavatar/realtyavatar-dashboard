/**
 * Widget API key validation.
 *
 * Each org has a `widget_api_key` stored in settings (prefixed by org_id).
 * The embedded widget passes this key with every /api/widget/chat request.
 *
 * Key format: "ra_wk_<32-hex-chars>"  (ra = RealtyAvatar, wk = widget key)
 *
 * Usage in /api/widget/chat:
 *   const resolved = await resolveWidgetKey(req.headers.get("x-widget-key") ?? body.apiKey);
 *   if (!resolved) return 401;
 *   const orgId = resolved.orgId;
 */

import { supabaseAdmin } from "@/lib/supabase";
import { randomBytes } from "crypto";

const KEY_PREFIX = "ra_wk_";

export function generateWidgetKey(): string {
  return KEY_PREFIX + randomBytes(16).toString("hex");
}

/**
 * Look up which org owns a given widget API key.
 * Returns { orgId } on match, null if invalid.
 *
 * Resolution order:
 *  1. Env var REALTYAVATAR_WIDGET_API_KEY — single-tenant fast path (no DB)
 *  2. Supabase settings table — multi-tenant / rotated keys (when DB is live)
 */
export async function resolveWidgetKey(
  key: string | null | undefined
): Promise<{ orgId: string } | null> {
  if (!key || !key.startsWith(KEY_PREFIX)) return null;

  // 1. Env var fast-path (works even without Supabase)
  const envKey = process.env.REALTYAVATAR_WIDGET_API_KEY;
  if (envKey && key === envKey) {
    return { orgId: process.env.REALTYAVATAR_ORG_ID ?? "1" };
  }

  // 2. Supabase lookup (multi-tenant / rotated keys)
  try {
    const { data, error } = await supabaseAdmin
      .from("settings")
      .select("key, value")
      .like("key", "org_%_widget_api_key")
      .eq("value", key)
      .single();

    if (error || !data) return null;

    const match = data.key.match(/^org_(\d+)_widget_api_key$/);
    if (!match) return null;

    return { orgId: match[1] };
  } catch {
    return null;
  }
}

/**
 * Generate and store a new widget API key for an org.
 * Returns the new key.
 */
export async function rotateWidgetKey(orgId: string): Promise<string> {
  const newKey = generateWidgetKey();
  const settingsKey = `org_${orgId}_widget_api_key`;

  try {
    const { data: existing } = await supabaseAdmin
      .from("settings")
      .select("key")
      .eq("key", settingsKey)
      .single();

    if (existing) {
      await supabaseAdmin
        .from("settings")
        .update({ value: newKey })
        .eq("key", settingsKey);
    } else {
      await supabaseAdmin
        .from("settings")
        .insert({ key: settingsKey, value: newKey });
    }
  } catch {
    // Supabase not configured — swallow in dev
  }

  return newKey;
}

/**
 * Get the current widget API key for an org (masked for display).
 * Returns null if not set yet.
 */
export async function getWidgetKeyMasked(
  orgId: string
): Promise<{ masked: string; exists: boolean } | null> {
  try {
    const { data } = await supabaseAdmin
      .from("settings")
      .select("value")
      .eq("key", `org_${orgId}_widget_api_key`)
      .single();

    if (!data?.value) return { masked: "", exists: false };
    const v: string = data.value;
    return {
      masked: v.slice(0, 10) + "••••••••" + v.slice(-4),
      exists: true,
    };
  } catch {
    return { masked: "", exists: false };
  }
}
