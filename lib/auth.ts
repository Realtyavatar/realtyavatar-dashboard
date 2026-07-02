"use client";

// Client-side session management.
// Auth is enforced server-side (httpOnly JWT cookie).
// localStorage stores display-only session info (name, role) for the UI.

export interface AgentSession {
  id: string;
  name: string;
  email: string;
  role: string;
}

const SESSION_KEY = "ra_agent";

export function getSession(): AgentSession | null {
  if (typeof window === "undefined") return null;
  try {
    const s = localStorage.getItem(SESSION_KEY);
    return s ? JSON.parse(s) : null;
  } catch { return null; }
}

export function setSession(agent: AgentSession) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(agent));
}

export function clearSession() {
  localStorage.removeItem(SESSION_KEY);
}

/** Sends credentials to the server. On success, an httpOnly JWT cookie is set. */
export async function verifyAgent(email: string, password: string): Promise<AgentSession | null> {
  try {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.user as AgentSession;
  } catch { return null; }
}

/** Clears localStorage and the server-side cookie. */
export async function logout() {
  try {
    await fetch("/api/auth/logout", { method: "POST" });
  } catch {}
  clearSession();
}
