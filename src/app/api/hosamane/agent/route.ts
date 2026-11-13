import { runAgent } from "@/lib/hosamane/agent";
import { MODEL, modelEnabled, runModelAgent, type ModelInput } from "@/lib/hosamane/agent-llm";
import type { AgentEvent } from "@/lib/hosamane/types";

/**
 * Hosamane's agent endpoint. Streams events as newline-delimited JSON.
 *
 * With ANTHROPIC_API_KEY set, Claude plans the turn (lib/hosamane/agent-llm.ts); without it, the scripted
 * planner does (lib/hosamane/agent.ts). Tools, approvals and guardrails are the same code either way.
 *
 * This runs on a public site, so model turns are limited per visitor and per day, and anything over a
 * limit is answered by the scripted planner instead. These counters live in memory, so they're per
 * server instance: a spending limit on the API key is the hard cap.
 */
export const maxDuration = 60;

const PER_VISITOR_PER_HOUR = Number(process.env.HOSAMANE_TURNS_PER_HOUR || 30);
const PER_DAY = Number(process.env.HOSAMANE_TURNS_PER_DAY || 400);
const MAX_MESSAGE = 800;

const visitorTurns = new Map<string, number[]>();
const today = { date: "", turns: 0 };

function modelAllowed(req: Request): { ok: true } | { ok: false; why: string } {
  const now = Date.now();
  const date = new Date(now).toISOString().slice(0, 10);
  if (today.date !== date) { today.date = date; today.turns = 0; visitorTurns.clear(); }
  if (today.turns >= PER_DAY) return { ok: false, why: "Today's model budget for the demo is used up" };
  const ip = req.headers.get("x-nf-client-connection-ip") || req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const recent = (visitorTurns.get(ip) ?? []).filter((t) => now - t < 3_600_000);
  if (recent.length >= PER_VISITOR_PER_HOUR) return { ok: false, why: "You've reached this hour's limit for model turns" };
  recent.push(now);
  visitorTurns.set(ip, recent);
  today.turns++;
  return { ok: true };
}

export async function POST(req: Request) {
  let input: ModelInput;
  try { input = (await req.json()) as ModelInput; } catch { return Response.json({ error: "Invalid request" }, { status: 400 }); }
  if (input.kind === "message" && typeof input.text === "string") input.text = input.text.slice(0, MAX_MESSAGE);
  if (Array.isArray(input.history)) input.history = input.history.slice(-6).map((h) => ({ role: h.role === "user" ? "user" : "agent", text: String(h.text ?? "").slice(0, 500) }));

  // Approved actions always run in code, so they never count against the model limits.
  const gate = modelEnabled() && input.kind !== "approved" ? modelAllowed(req) : null;
  const useModel = modelEnabled() && (gate === null || gate.ok);
  const events = useModel ? runModelAgent(input) : runAgent(input);
  const notice: AgentEvent | null = gate && !gate.ok
    ? { t: "activity", entry: { at: Date.now(), action: "Scripted planner", detail: `${gate.why}, so the scripted planner answered.`, tool: "—" } }
    : null;

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      if (notice) controller.enqueue(encoder.encode(JSON.stringify(notice) + "\n"));
      for await (const event of events) {
        controller.enqueue(encoder.encode(JSON.stringify(event) + "\n"));
        // The scripted planner answers instantly; a short pause lets the interface show each tool running.
        if (!useModel && event.t === "tool") await new Promise((r) => setTimeout(r, 180));
      }
      controller.close();
    },
  });
  return new Response(stream, {
    headers: { "Content-Type": "application/x-ndjson; charset=utf-8", "Cache-Control": "no-store", "X-Hosamane-Planner": useModel ? MODEL : "scripted" },
  });
}
