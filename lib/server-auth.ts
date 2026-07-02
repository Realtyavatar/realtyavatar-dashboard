import { SignJWT, jwtVerify } from "jose";
import { resolveWidgetKey } from "@/lib/widget-auth";
import { isWidgetOriginAllowed } from "@/lib/widget-origin";
import { NextRequest, NextResponse } from "next/server";

const SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "dev-jwt-secret-DO-NOT-USE-IN-PRODUCTION"
);

export const SESSION_COOKIE = "ra_session";

export interface SessionPayload {
  id: string;
  name: string;
  email: string;
  role: string;
  orgId: string;  // #4 multi-tenancy
}

export async function signSession(payload: SessionPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("8h")
    .sign(SECRET);
}

export async function verifySession(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, SECRET);
    return payload as unknown as SessionPayload;
  } catch {
    return null;
  }
}

/**
 * Use in server components / route handlers.
 * Returns SessionPayload on success, or a 401 NextResponse to return immediately.
 */
export async function requireAuth(
  req: NextRequest
): Promise<SessionPayload | NextResponse> {
  const token = req.cookies.get(SESSION_COOKIE)?.value;
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const session = await verifySession(token);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return session;
}

/**
 * Like requireAuth but also accepts a valid widget API key.
 * Widget-key callers get a synthetic read-only session scoped to their org.
 *
 * Use on dashboard GET routes that realestatesales needs to read
 * (listings, rentals, documents). Mutations should still use requireAuth.
 */
export async function requireAuthOrWidgetKey(
  req: NextRequest
): Promise<SessionPayload | NextResponse> {
  // 1. Try session cookie first (dashboard users)
  const token = req.cookies.get(SESSION_COOKIE)?.value;
  if (token) {
    const session = await verifySession(token);
    if (session) return session;
  }

  // 2. Try widget API key (server-to-server from realestatesales etc.)
  // The key is public by design — only honour it when the browser Origin
  // (if any) is on the widget allowlist.
  const key = req.headers.get("x-widget-key");
  const resolved = isWidgetOriginAllowed(req) ? await resolveWidgetKey(key) : null;
  if (resolved) {
    // Synthetic read-only session — role "widget" so callers can gate mutations
    return {
      id: "widget",
      name: "Widget",
      email: "",
      role: "widget",
      orgId: resolved.orgId,
    };
  }

  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}
