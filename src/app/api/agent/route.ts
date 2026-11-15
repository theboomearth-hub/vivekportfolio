import { roles, type RoleKey } from "@/lib/home";
import { answerWithModel, MODEL, modelEnabled, type Turn } from "@/lib/agent/model";

/**
 * The homepage agent's model endpoint. POST { text, history, role } → { reply, next } or { fallback, why }.
 *
 * On a fallback the page answers with its script, so a visitor never sees an error: no key configured, a limit
 * reached, a refusal, a timeout, or anything unexpected. This is a public page, so model answers are limited per
 * visitor and per day; the counters live in memory (per server instance), so a spending limit on the key is the
 * hard cap.
 */
export const maxDuration = 30;

const PER_VISITOR_PER_HOUR = Number(process.env.PORTFOLIO_AGENT_PER_HOUR || 15);
const PER_DAY = Number(process.env.PORTFOLIO_AGENT_PER_DAY || 150);
const MAX_MESSAGE = 500;

const visitorTurns = new Map<string, number[]>();
const today = { date: "", turns: 0 };

function allowed(req: Request): { ok: true } | { ok: false; why: string } {
  const now = Date.now();
  const date = new Date(now).toISOString().slice(0, 10);
  if (today.date !== date) {
    today.date = date;
    today.turns = 0;
    visitorTurns.clear();
  }
  if (today.turns >= PER_DAY) return { ok: false, why: "daily-limit" };
  const ip = req.headers.get("x-nf-client-connection-ip") || req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const recent = (visitorTurns.get(ip) ?? []).filter((t) => now - t < 3_600_000);
  if (recent.length >= PER_VISITOR_PER_HOUR) return { ok: false, why: "visitor-limit" };
  recent.push(now);
  visitorTurns.set(ip, recent);
  today.turns++;
  return { ok: true };
}

const fallback = (why: string) => Response.json({ fallback: true, why }, { headers: { "Cache-Control": "no-store" } });

export async function POST(req: Request) {
  if (!modelEnabled()) return fallback("no-key");

  let body: { text?: unknown; history?: unknown; role?: unknown };
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Invalid request" }, { status: 400 });
  }
  const text = String(body.text ?? "").trim().slice(0, MAX_MESSAGE);
  if (!text) return Response.json({ error: "Empty message" }, { status: 400 });
  const role = typeof body.role === "string" && body.role in roles ? (body.role as RoleKey) : null;
  const history: Turn[] = Array.isArray(body.history)
    ? body.history.slice(-6).map((h: { role?: unknown; text?: unknown }): Turn => ({ role: h?.role === "user" ? "user" : "agent", text: String(h?.text ?? "").slice(0, 600) })).filter((h) => h.text)
    : [];

  const gate = allowed(req);
  if (!gate.ok) return fallback(gate.why);

  try {
    const result = await answerWithModel({ text, history, role });
    if (!result) return fallback("model-declined");
    return Response.json(result, { headers: { "Cache-Control": "no-store", "X-Portfolio-Agent": MODEL } });
  } catch (e) {
    console.error(JSON.stringify({ agent: "portfolio", error: e instanceof Error ? e.message.slice(0, 200) : "unknown" }));
    return fallback("error");
  }
}
