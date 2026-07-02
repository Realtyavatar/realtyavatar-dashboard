/**
 * Origin allowlist for widget-API-key authenticated requests.
 *
 * The widget API key ships in client-side code by design, so possession of
 * the key proves nothing. The backend therefore only honours the key when
 * the browser's Origin header matches an allowed site
 * (realestatesales.com.au by default, configurable via WIDGET_ALLOWED_ORIGINS).
 *
 * Requests without an Origin header cannot originate from a browser page
 * (browsers always attach Origin to cross-origin and same-origin POSTs),
 * so they are treated as server-to-server calls and allowed through —
 * the same trust level as before this check existed.
 */

import { NextRequest } from "next/server";

const DEFAULT_ALLOWED_ORIGINS = [
  "https://realestatesales.com.au",
  "https://www.realestatesales.com.au",
];

function normalise(origin: string): string {
  return origin.trim().replace(/\/+$/, "").toLowerCase();
}

export function allowedWidgetOrigins(req: NextRequest): string[] {
  const fromEnv = (process.env.WIDGET_ALLOWED_ORIGINS ?? "")
    .split(",")
    .map(normalise)
    .filter(Boolean);

  const origins = fromEnv.length > 0 ? fromEnv : [...DEFAULT_ALLOWED_ORIGINS];

  // The dashboard's own origin is always allowed (widget-demo page,
  // dashboard preview) — same-origin POSTs also carry an Origin header.
  const host = req.headers.get("host");
  if (host) {
    const proto = req.headers.get("x-forwarded-proto") ?? "https";
    origins.push(normalise(`${proto}://${host}`));
  }
  const dashboardUrl = process.env.NEXT_PUBLIC_DASHBOARD_URL;
  if (dashboardUrl) origins.push(normalise(dashboardUrl));

  if (process.env.NODE_ENV !== "production") {
    origins.push("http://localhost:3000", "http://127.0.0.1:3000");
  }

  return origins;
}

/** True when the request either has no Origin header (server-to-server) or
 *  its Origin is on the allowlist. */
export function isWidgetOriginAllowed(req: NextRequest): boolean {
  const origin = req.headers.get("origin");
  if (!origin) return true;
  return allowedWidgetOrigins(req).includes(normalise(origin));
}

/** CORS headers that reflect the request Origin only when it is allowed. */
export function widgetCorsHeaders(req: NextRequest): Record<string, string> {
  const origin = req.headers.get("origin");
  const allowed =
    origin && allowedWidgetOrigins(req).includes(normalise(origin));
  return {
    ...(allowed ? { "Access-Control-Allow-Origin": origin } : {}),
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, X-Widget-Key",
    Vary: "Origin",
  };
}
