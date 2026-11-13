import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import type { ApprovalAction } from "./types";

/**
 * Approval tokens are signed on the server when the person taps "approve" in the interface.
 * The agent can request approval, but it never sees the secret, so it can't mint a token.
 * Level-2 tools refuse to run without a valid, unexpired token for exactly that action and payload.
 */
// APPROVAL_SECRET if it's set. Otherwise a random secret made once per build (next.config.ts), so every
// server instance of a deploy agrees on it; it isn't in the source code, so it can't be read from the repo.
const SECRET = process.env.APPROVAL_SECRET || process.env.HOSAMANE_BUILD_SECRET || randomBytes(32).toString("hex");
const TTL_MS = 10 * 60 * 1000;

const sign = (body: string) => createHmac("sha256", SECRET).update(body).digest("base64url");

export function issueApproval(action: ApprovalAction, payload: unknown): string {
  const body = Buffer.from(JSON.stringify({ action, payload, exp: Date.now() + TTL_MS })).toString("base64url");
  return `${body}.${sign(body)}`;
}

export function verifyApproval(token: string | undefined, action: ApprovalAction): { ok: true; payload: unknown } | { ok: false; reason: string } {
  if (!token) return { ok: false, reason: "No approval was given." };
  const [body, mac] = token.split(".");
  if (!body || !mac) return { ok: false, reason: "The approval is malformed." };
  const expected = Buffer.from(sign(body));
  const given = Buffer.from(mac);
  if (expected.length !== given.length || !timingSafeEqual(expected, given)) return { ok: false, reason: "The approval isn't valid." };
  const data = JSON.parse(Buffer.from(body, "base64url").toString());
  if (data.action !== action) return { ok: false, reason: "The approval was for a different action." };
  if (Date.now() > data.exp) return { ok: false, reason: "The approval expired. Please approve again." };
  return { ok: true, payload: data.payload };
}
