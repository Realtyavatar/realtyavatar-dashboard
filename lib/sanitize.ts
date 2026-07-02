/**
 * Chat message sanitisation helpers.
 *
 * Defends against prompt-injection attacks embedded in user messages
 * before they are forwarded to an LLM.
 */

export const MAX_MESSAGE_CHARS = 600;
export const MAX_HISTORY_MESSAGES = 12; // kept pairs = 6 turns

/** Patterns that are characteristic of prompt-injection attempts */
const INJECTION_PATTERNS: RegExp[] = [
  // Role-switch directives
  /\byou\s+are\s+now\b/gi,
  /\bignore\s+(all\s+)?(previous|prior|above)\s+(instructions?|prompts?|context)\b/gi,
  /\bdisregard\s+(all\s+)?(previous|prior|above)\s+(instructions?|prompts?)\b/gi,
  /\bforget\s+(everything|all\s+instructions?|your\s+instructions?)\b/gi,
  /\bact\s+as\s+(if\s+you\s+(are|were)\s+)?(a\s+)?/gi,
  /\bpretend\s+(you\s+are|to\s+be)\b/gi,
  // Delimiter injection
  /\[INST\]/gi,
  /\[\/INST\]/gi,
  /<\|system\|>/gi,
  /<\|user\|>/gi,
  /<\|assistant\|>/gi,
  /###\s*(System|Instruction|Prompt)\s*:/gi,
  /SYSTEM\s*:/gi,
  // Jailbreak openers
  /\bDAN\b/g,
  /do\s+anything\s+now/gi,
  // Exfiltration attempts
  /reveal\s+(your|the)\s+(system\s+)?(prompt|instructions?|context)/gi,
  /print\s+(your|the)\s+(system\s+)?(prompt|instructions?)/gi,
  /what\s+(are|is)\s+your\s+(system\s+)?(prompt|instructions?)/gi,
];

/**
 * Sanitise a single user message string.
 * - Strips null bytes and non-printable control chars (keep \n \r \t)
 * - Neutralises known injection patterns by replacing them with [REDACTED]
 * - Truncates to MAX_MESSAGE_CHARS
 */
export function sanitiseMessage(text: string): string {
  // Strip null bytes + control chars (except \n \r \t)
  // eslint-disable-next-line no-control-regex
  let clean = text.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "");

  // Neutralise injection patterns
  for (const pattern of INJECTION_PATTERNS) {
    clean = clean.replace(pattern, "[REDACTED]");
  }

  // Truncate
  if (clean.length > MAX_MESSAGE_CHARS) {
    clean = clean.slice(0, MAX_MESSAGE_CHARS) + " [...]";
  }

  return clean.trim();
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

/**
 * Sanitise a full conversation history before forwarding to an LLM.
 * - Applies sanitiseMessage to all user turns
 * - Trims history to at most MAX_HISTORY_MESSAGES entries (keeps the most recent)
 * - Ensures the first message is from the user (assistant priming is stripped)
 */
export function sanitiseHistory(messages: ChatMessage[]): ChatMessage[] {
  // Ensure valid structure
  const valid = messages.filter(
    (m) =>
      m &&
      typeof m === "object" &&
      (m.role === "user" || m.role === "assistant") &&
      typeof m.content === "string"
  );

  // Sanitise user messages
  const sanitised: ChatMessage[] = valid.map((m) =>
    m.role === "user"
      ? { role: "user", content: sanitiseMessage(m.content) }
      : { role: "assistant", content: m.content.slice(0, 2000) } // cap assistant too
  );

  // Keep only recent messages
  const trimmed =
    sanitised.length > MAX_HISTORY_MESSAGES
      ? sanitised.slice(sanitised.length - MAX_HISTORY_MESSAGES)
      : sanitised;

  // Strip leading assistant turns (widget greeting) — LLM APIs require the
  // conversation to start with a user message.
  const firstUser = trimmed.findIndex((m) => m.role === "user");
  return firstUser === -1 ? [] : trimmed.slice(firstUser);
}
