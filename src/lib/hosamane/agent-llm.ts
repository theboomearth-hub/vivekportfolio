/**
 * Model-backed planner for the Hosamane prototype. Claude chooses among the typed tools in lib/tools.ts and
 * writes the reply from their results. It emits the same events as the scripted planner (lib/agent.ts), so the
 * interface draws the same cards either way.
 *
 * What stays in code rather than in the model:
 *  - Guardrails. lib/guard.ts checks every message first; a hit gets the scripted refusal and the model never runs.
 *  - Approvals. The model can only prepare an action (draft, plan, prepare_share, prepare_report), which shows an
 *    approval card. Sending, booking, sharing and reporting run only on the "approved" path, in lib/agent.ts, with
 *    a server-signed token the model never sees.
 *  - Output checks. A reply with a banned word, or an amount or duration no tool returned, gets one rewrite.
 */
import Anthropic from "@anthropic-ai/sdk";
import fs from "node:fs";
import { runAgent, type AgentInput } from "./agent";
import { anchors, inr, inrShort, listingById, listings, localities, localityById } from "./data";
import { BANNED_IN_OUTPUT, checkMessage, checkOwnerQuestion } from "./guard";
import * as T from "./tools";
import type { AgentEvent, ApprovalAction, Brief, Listing, Memory } from "./types";

type MessageParam = Anthropic.Beta.Messages.BetaMessageParam;
type Tool = Anthropic.Beta.Messages.BetaTool;
type ToolUse = Anthropic.Beta.Messages.BetaToolUseBlock;
type ToolResult = Anthropic.Beta.Messages.BetaToolResultBlockParam;
type Usage = { calls: number; input: number; output: number; cacheRead: number; cacheWrite: number };

export interface HistoryItem { role: "user" | "agent"; text: string }
export type ModelInput = AgentInput & { history?: HistoryItem[] };

export const MODEL = process.env.HOSAMANE_MODEL || "claude-opus-5-5";
const EFFORT = (process.env.HOSAMANE_EFFORT || "low") as "low" | "medium" | "high";
const MAX_ROUNDS = 8;
// Opus 5.5 list prices per million tokens (input, output, cache read, 5-minute cache write).
const PRICE = { input: 4, output: 20, cacheRead: 0.2, cacheWrite: 5 };

export const modelEnabled = () => !!process.env.ANTHROPIC_API_KEY && process.env.HOSAMANE_PLANNER !== "scripted";
let client: Anthropic | null = null;
const anthropic = () => (client ??= new Anthropic({ maxRetries: 2, timeout: 90_000 }));

/* ── helpers ───────────────────────────────────────────────────── */
const home = (id: string) => { const l = listingById(id)!; return `${l.title.replace(/^\dBHK in /, "")}, ${localityById(l.localityId).name}`; };
const price = (l: Listing) => (l.mode === "rent" ? `${inr(l.rent!)}/month` : inrShort(l.price!));
const plural = (n: number, one: string, many = `${one}s`) => `${n} ${n === 1 ? one : many}`;
/** Price ranges in the dataset, so the budget options the model offers can match something. */
function priceRanges() {
  const avail = listings.filter((l) => l.status === "available");
  const span = (xs: number[], f: (n: number) => string) => `${f(Math.min(...xs))} to ${f(Math.max(...xs))}`;
  const rent = (bhk: number) => span(avail.filter((l) => l.mode === "rent" && l.bhk === bhk).map((l) => l.rent!), inr);
  const buy = (bhk: number) => span(avail.filter((l) => l.mode === "buy" && l.bhk === bhk).map((l) => l.price!), inrShort);
  return `Renting: 1BHK ${rent(1)}, 2BHK ${rent(2)}, 3BHK ${rent(3)} a month. Buying: 2BHK ${buy(2)}, 3BHK ${buy(3)}.`;
}

/* ── system prompt ─────────────────────────────────────────────── */
const SYSTEM = `You are Hosamane, a home-search agent for people renting or buying in Bengaluru. You work for the person searching, not for owners, brokers or builders. This is a prototype: the 60 listings, the owners and their replies are fictional and simulated, and the interface says so.

# How a turn works
Each message arrives with the session state: the brief (what they want, and whether each value came from them or was assumed), the shortlist in order, the home they have open, tasks you've started, and the last few lines of the conversation. The server keeps nothing else between turns.

Act through tools. The interface draws a card for every tool result (the shortlist, a home with its checks and costs, a comparison, an approval card), so your reply is a caption for those cards: what you did and the one or two things that matter most. Keep it to three short sentences at most; when nothing could be done, one or two. Don't repeat what the cards show, and don't restate the whole situation each turn. Use their name rarely, never to open a reply. The reply appears as plain text in a chat bubble, so no markdown, lists or emoji. Write it once, after your tool calls.

# Facts
Every listing fact, amount, distance, time and count you state must come from a tool result in this turn or from the session state. If you don't have it, call the tool, or say you don't know. Write money exactly as the tools format it (₹42,000/month, ₹48.5 lakh, ₹1.40 Cr), never as "45k". Write durations as "32 min". Name homes by society and area, like "Mango Enclave, Bellandur"; ids such as r-05 are for tools only.

# Building the brief
When they describe what they want, record it with update_brief and then call search_listings in the same turn. Use origin "you" for what they said. Record anything you infer in a separate update_brief call with origin "assumed": assumed values are shown labelled, so they can correct them. Infer the obvious instead of asking:
- A monthly-sized budget (₹2 lakh or less) or a flatmate means renting. A budget of ₹20 lakh or more means buying.
- A place they travel to with no time limit: assume a 45 min commute.
- Renting with no furnishing preference: assume "any".
Ask a clarifying question (ask_clarifying_question) only before the first shortlist, only when the answer would change the results a lot (renting or buying, budget, furnishing, ready or under construction), and never more than twice in a session; the session state says how many you've asked. When you've asked two, assume and label instead. After asking, end your turn. Budget options should span what's listed. ${priceRanges()}

Places people travel to every day are anchors: ${anchors.map((a) => `${a.id} (${a.name})`).join(", ")}. Areas to live in are localities: ${localities.map((l) => `${l.id} (${l.name})`).join(", ")}. "Near my office in Bellandur" is the anchor bellandur-orr, not the locality. Set localities only when they name areas they want to live in, such as "a flat near Whitefield" when buying.

Relaxations ("include nearby areas", "show 3BHKs too", "stretch the budget by 15%", "allow a 50 min commute") change the brief: update it (use clear to drop a constraint) and search again. If a search finds nothing, say so and offer the relaxations the tool returned, with their numbers; don't loosen the brief yourself.

"The first one" and "the second" follow the shortlist order. "This one" or "this listing" means the open home, or the first on the shortlist if none is open. An area name can identify a home ("the Bellandur one"). To look at a home, use open_listing. For a specific question, use the matching tool (cost, commute, area facts, checks, registration).

# Actions need the person's approval
You can't send messages, request visits, share or report on your own. draft_owner_message, plan_visit_route, prepare_share and prepare_report each show an approval card, and the action runs only if the person taps approve. One card per turn. After a card appears, stop calling tools and write one line saying what's in it and that nothing happens until they approve. Ask every owner the same neutral questions. "The top 3" means the first three on the shortlist; visits default to Saturday; people you share with get a vote unless they're described as just looking.

# The never list
These are rules, not preferences, and owners on Hosamane can't apply them either:
- Never pay, transfer or hold money, or sign anything, for them.
- Never handle ID documents (Aadhaar, PAN, passport, driving licence and the like), and never share their phone number or contact details; owners reach them through the masked chat.
- Never filter, rank or choose homes, areas, owners or neighbours by religion, caste, community, diet or marital status. Asking every owner the same neutral house-rules question, about cooking or guests for example, is fine.
- Never call an area safe, unsafe, good or bad. Give the recorded facts with their sources (get_neighbourhood) instead.
When a request hits one of these, call decline_request with the rule, a one-sentence reason and what you can do instead. Don't update the brief or search in that turn; for a question about an area, you may still look up its facts. The card shows the refusal, so your text, if any, offers the alternative and doesn't restate the rule.

# Words
Plain, warm and direct, like a capable friend who knows the city. Never use the words "safe", "unsafe", "good area", "bad area", "guaranteed", "risk-free", "hurry" or "high demand", and never create urgency or scarcity. Say what you checked and what's still unknown. When a check flags something (old or reused photos, a deposit higher than nearby, a project without registration, a payment ask before a visit), say so plainly.`;

/* ── tool definitions ──────────────────────────────────────────── */
const ids = (min: number, max: number, what = "Listing ids from the session state, such as r-05 or b-13") => ({ type: "array", items: { type: "string" }, minItems: min, maxItems: max, description: what });
const oneId = { listing_id: { type: "string", description: "A listing id from the session state, such as r-05" } };
const people = { type: "array", minItems: 1, items: { type: "object", properties: { name: { type: "string" }, role: { type: "string", enum: ["votes", "views"] } }, required: ["name", "role"] } };

const TOOLS: Tool[] = [
  {
    name: "update_brief",
    description: "Records what the person wants. Send only fields that change. origin is 'you' for what they said and 'assumed' for what you inferred. To drop a constraint, name the field in clear.",
    input_schema: {
      type: "object",
      properties: {
        origin: { type: "string", enum: ["you", "assumed"] },
        mode: { type: "string", enum: ["rent", "buy"] },
        bhk: { type: "integer", minimum: 1, maximum: 4 },
        budget: { type: "number", description: "Rupees. Renting: per month. Buying: the total price." },
        down_payment: { type: "number", description: "Buying only, in rupees." },
        anchor_id: { type: "string", enum: anchors.map((a) => a.id), description: "The place they travel to most days." },
        time: { type: "string", description: "When they leave for it, like '9 am'." },
        max_commute_min: { type: "integer", minimum: 5, maximum: 120 },
        furnishing: { type: "string", enum: ["furnished", "semi", "unfurnished", "any"] },
        readiness: { type: "string", enum: ["ready", "under construction", "any"] },
        must_haves: { type: "array", items: { type: "string", enum: ["pets", "balcony", "parking", "gym", "2 bathrooms"] } },
        deal_breakers: { type: "array", items: { type: "string", enum: ["brokers", "ground floor"] } },
        localities: { type: "array", items: { type: "string", enum: localities.map((l) => l.id) }, description: "Areas to live in, only when they named some." },
        people,
        clear: { type: "array", items: { type: "string", enum: ["bhk", "budget", "down_payment", "anchor_id", "max_commute_min", "furnishing", "readiness", "must_haves", "deal_breakers", "localities"] } },
      },
      required: ["origin"],
    },
  },
  { name: "search_listings", description: "Searches the listings against the current brief and puts the top 6 on the shortlist. Call update_brief first if anything changed. When nothing fits, it returns the single changes that would help (relaxations).", input_schema: { type: "object", properties: {} } },
  { name: "open_listing", description: "Opens one home on screen: its details, checks, full cost, the commute (when the brief has an anchor), area facts and, for a purchase, the project registration.", input_schema: { type: "object", properties: oneId, required: ["listing_id"] } },
  { name: "verify_listing", description: "Runs the checks on one home: owner confirmed, availability, photos, rent and deposit against nearby, broker or owner, registration and khata for purchases, and payment asks.", input_schema: { type: "object", properties: oneId, required: ["listing_id"] } },
  { name: "estimate_move_in_cost", description: "Rentals: what it costs to move in, itemised (first month, deposit, maintenance, brokerage).", input_schema: { type: "object", properties: oneId, required: ["listing_id"] } },
  { name: "estimate_purchase_cost", description: "Purchases: the all-in cost (price, stamp duty, registration, GST, corpus) and an illustrative EMI.", input_schema: { type: "object", properties: oneId, required: ["listing_id"] } },
  { name: "check_project_registration", description: "Purchases: whether the project is on the Karnataka RERA register.", input_schema: { type: "object", properties: oneId, required: ["listing_id"] } },
  { name: "get_commute", description: "Car and bus times from a home to the brief's anchor at the brief's time.", input_schema: { type: "object", properties: oneId, required: ["listing_id"] } },
  { name: "get_neighbourhood", description: "Recorded facts about a home's area (water, flooding, metro), each with its source.", input_schema: { type: "object", properties: oneId, required: ["listing_id"] } },
  { name: "compare_listings", description: "Compares homes side by side against the brief.", input_schema: { type: "object", properties: { listing_ids: ids(2, 4) }, required: ["listing_ids"] } },
  { name: "draft_owner_message", description: "Drafts the same short message to each owner or builder and shows an approval card. Nothing is sent until the person taps Send, and sent messages can't be unsent.", input_schema: { type: "object", properties: { listing_ids: ids(1, 6), questions: { type: "array", minItems: 1, maxItems: 4, items: { type: "string" }, description: "Short, neutral questions, the same for every owner." } }, required: ["listing_ids", "questions"] } },
  { name: "plan_visit_route", description: "Plans a visit route through the owners' open slots and shows an approval card to request them. Nothing is booked until the person approves.", input_schema: { type: "object", properties: { listing_ids: ids(1, 4), day: { type: "string", enum: ["Sat", "Sun"] } }, required: ["listing_ids", "day"] } },
  { name: "prepare_share", description: "Shows an approval card to share homes by a link that works in WhatsApp, needs no app and expires in 7 days. 'votes' people can vote; 'views' people can only look.", input_schema: { type: "object", properties: { listing_ids: ids(1, 4), people }, required: ["listing_ids", "people"] } },
  { name: "prepare_report", description: "Shows an approval card to report a listing to the verification team.", input_schema: { type: "object", properties: { ...oneId, reason: { type: "string", enum: ["Asked for money before a visit", "Broker posing as owner", "No longer available", "Fake or misleading"] } }, required: ["listing_id", "reason"] } },
  { name: "get_owner_replies", description: "Shows the owners' replies so far. Homes whose owner says it's taken, or refuses a must-have, leave the shortlist.", input_schema: { type: "object", properties: {} } },
  { name: "collect_votes", description: "Shows how the people they shared with have voted.", input_schema: { type: "object", properties: {} } },
  { name: "watch_search", description: "Starts a daily digest of new homes that fit the brief.", input_schema: { type: "object", properties: {} } },
  { name: "summarise_visit_notes", description: "Reads their visit notes against the brief, the checks and any votes, and recommends one of the first three on the shortlist, with the trade-off.", input_schema: { type: "object", properties: { notes: { type: "string", description: "Their notes, word for word." } }, required: ["notes"] } },
  { name: "ask_clarifying_question", description: "Asks one question with tap-to-answer options, then ends the turn. Values: mode rent|buy; budget in rupees as digits; furnishing furnished|semi|unfurnished|any; readiness ready|under construction|any.", input_schema: { type: "object", properties: { field: { type: "string", enum: ["mode", "budget", "furnishing", "readiness"] }, question: { type: "string" }, options: { type: "array", minItems: 2, maxItems: 4, items: { type: "object", properties: { label: { type: "string" }, value: { type: "string" } }, required: ["label", "value"] } } }, required: ["field", "question", "options"] } },
  { name: "decline_request", description: "Declines a request on the never list. The card shows the rule, the reason and what you can do instead.", input_schema: { type: "object", properties: { rule: { type: "string", description: "First person, one short sentence, like \"I can't make payments.\"" }, reason: { type: "string" }, instead: { type: "string" } }, required: ["rule", "reason", "instead"] } },
];

/* ── the session, as the model sees it ─────────────────────────── */
function sessionText(memory: Memory, history: HistoryItem[] = []): string {
  const b = memory.brief;
  const now = Date.now();
  const lines = [
    `Searcher's first name: ${memory.name}`,
    `Brief: ${JSON.stringify(b)}`,
    `Clarifying questions asked so far: ${memory.questionsAsked} of 2`,
    `Shortlist: ${memory.shortlist.length ? "" : "empty"}`,
    ...memory.shortlist.map((id, i) => { const l = listingById(id)!; return `  ${i + 1}. ${id} · ${home(id)} · ${l.bhk}BHK · ${price(l)} · listed by ${l.lister}`; }),
    `Open home: ${memory.selectedId ? `${memory.selectedId} · ${home(memory.selectedId)}` : "none"}`,
    ...(memory.removed.length ? [`Removed: ${memory.removed.map((r) => `${home(r.id)} (${r.reason})`).join("; ")}`] : []),
    `Tasks: ${memory.tasks.length ? memory.tasks.map((t) => `${t.title}, started ${Math.round((now - t.createdAt) / 60000)} min ago${t.stopped ? " (stopped)" : ""}`).join("; ") : "none"}`,
    `Owner messages sent today: ${memory.asked} of ${T.DAILY_LIMIT}`,
    `Shortlist shared: ${memory.shareToken ? "yes" : "no"}`,
    ...(memory.notes ? [`Visit notes so far: ${memory.notes}`] : []),
  ];
  const convo = history.slice(-6).map((h) => `${h.role === "user" ? "Person" : "Hosamane"}: ${h.text.slice(0, 500)}`);
  return `<session>\n${lines.join("\n")}\n</session>${convo.length ? `\n\n<recent_conversation>\n${convo.join("\n")}\n</recent_conversation>` : ""}`;
}

/* ── the planner ───────────────────────────────────────────────── */
export async function* runModelAgent(input: ModelInput): AsyncGenerator<AgentEvent> {
  // Approved actions run in code with the signed token; guarded messages get the scripted refusal.
  if (input.kind === "approved" || (input.kind === "message" && checkMessage(input.text.trim()))) {
    yield* runAgent(input);
    return;
  }

  const memory: Memory = structuredClone(input.memory);
  const used = new Set<string>();
  const turnEvents: AgentEvent[] = [];
  const usage: Usage = { calls: 0, input: 0, output: 0, cacheRead: 0, cacheWrite: 0 };
  const flags = { card: false, ask: false, refused: false, emptySearch: null as null | ReturnType<typeof T.search_listings> };
  let rewrites = 0;
  const started = Date.now();
  const out = (e: AgentEvent) => { turnEvents.push(e); return e; };
  const act = (action: string, detail: string, tool: string): AgentEvent => out({ t: "activity", entry: { at: Date.now(), action, detail, tool } });

  let message: string;
  if (input.kind === "answer") {
    // Their tap is recorded as given, before the model continues.
    const changes = answerChanges(input.field, input.value);
    const id = `ans-${Date.now().toString(36)}`;
    memory.brief = T.update_brief(memory.brief, changes, "you");
    yield out({ t: "tool", id, name: "update_brief", args: changes });
    yield out({ t: "result", id, name: "update_brief", data: memory.brief });
    message = `(They answered your question about ${input.field}: ${input.value}. It's saved in the brief. Carry on.)`;
  } else message = input.text.trim();

  const messages: MessageParam[] = [{ role: "user", content: `${sessionText(memory, input.history)}\n\n<message>\n${message}\n</message>` }];

  try {
    for (let round = 0; round < MAX_ROUNDS; round++) {
      const response = await create(messages, usage);

      if (response.stop_reason === "refusal") {
        yield out({ t: "text", text: "I can't help with that one. I can search, check listings, work out costs, ask owners your questions and plan visits." });
        break;
      }
      const toolUses = response.content.filter((b): b is ToolUse => b.type === "tool_use");
      messages.push({ role: "assistant", content: response.content });

      if (response.stop_reason !== "tool_use" || !toolUses.length) {
        let text = finalText(response.content);
        // One rewrite when the reply breaks the content rules; the evals check the same rules.
        const problems = audit(text, turnEvents, memory);
        if (problems.length && text) {
          rewrites++;
          messages.push({ role: "user", content: `Before this reply goes out: it has ${problems.join("; ")}. Rewrite it so every amount and duration is one a tool returned in this turn or the session shows, and without those words. Reply with the rewritten text only, no tool calls.` });
          const again = await create(messages, usage);
          const retry = again.stop_reason === "refusal" ? "" : finalText(again.content);
          if (retry) text = retry;
        }
        // One bubble paragraph per paragraph the model wrote.
        for (const para of text.split(/\n\s*\n/).map((x) => x.trim()).filter(Boolean)) yield out({ t: "text", text: para });
        break;
      }

      const results: ToolResult[] = [];
      for (const tu of toolUses) {
        const r = execute(tu);
        for (const e of r.events) yield out(e);
        results.push({ type: "tool_result", tool_use_id: tu.id, content: JSON.stringify(r.forModel), ...(r.error ? { is_error: true } : {}) });
      }
      messages.push({ role: "user", content: results });
      if (round === MAX_ROUNDS - 1) yield out({ t: "text", text: "That took more steps than I allow in one go. Here's where I got to." });
    }
  } catch (err) {
    const status = err instanceof Anthropic.APIError ? err.status : undefined;
    console.error("[hosamane] model call failed", status ?? "", (err as Error).message);
    if (!turnEvents.some((e) => e.t === "tool")) {
      // Nothing has happened yet: answer this turn with the scripted planner rather than fail.
      yield { t: "activity", entry: { at: Date.now(), action: "Model unavailable", detail: "The scripted planner answered this turn.", tool: "—" } };
      yield* runAgent(input);
      return;
    }
    yield out({ t: "text", text: "I lost the connection partway through. Your board shows what I'd done so far. Try again?" });
  }

  const s = suggestions(memory, used, flags);
  if (s.length) yield { t: "suggest", options: s };
  yield { t: "memory", memory };
  yield { t: "done" };
  logUsage(usage, rewrites, Date.now() - started, input);

  /* ── tool execution, with the same side effects as the scripted planner ── */
  function execute(tu: ToolUse): { events: AgentEvent[]; forModel: unknown; error?: boolean } {
    const a = (tu.input ?? {}) as Record<string, unknown>;
    const events: AgentEvent[] = [];
    let n = 0;
    const call = <R,>(name: string, args: unknown, fn: () => R): R => {
      const id = `${tu.id}-${n++}`;
      events.push({ t: "tool", id, name, args });
      const data = fn();
      events.push({ t: "result", id, name, data });
      used.add(name);
      return data;
    };
    const fail = (msg: string) => ({ events, forModel: { error: msg }, error: true });
    const listing = (key = "listing_id") => { const id = String(a[key] ?? ""); return listingById(id) ? id : null; };
    const listIds = (key = "listing_ids") => { const v = Array.isArray(a[key]) ? (a[key] as unknown[]).map(String) : []; return v.length && v.every((id) => listingById(id)) ? v : null; };

    switch (tu.name) {
      case "update_brief": {
        const { changes, origin, problem } = briefChanges(a);
        if (problem) return fail(problem);
        memory.brief = call("update_brief", changes, () => T.update_brief(memory.brief, changes, origin));
        return { events, forModel: { brief: memory.brief } };
      }
      case "search_listings": {
        if (!memory.brief.mode) return fail("The brief has no mode yet. Set rent or buy (ask, or assume and label it) first.");
        const r = call("search_listings", { brief: memory.brief }, () => T.search_listings(memory.brief));
        memory.shortlist = r.results.map((x) => x.id);
        memory.selectedId = null;
        if (!r.results.length) flags.emptySearch = r;
        events.push(act("Searched", `${r.considered} ${r.mode === "rent" ? "rentals" : "homes for sale"} checked, ${r.matched} fit`, "search_listings"));
        return {
          events,
          forModel: {
            mode: r.mode, considered: r.considered, matched: r.matched, excluded: r.excluded,
            results: r.results.map((x) => { const l = listingById(x.id)!; return { id: x.id, home: home(x.id), bhk: l.bhk, price: price(l), sqft: l.sqft, lister: l.lister, commuteMin: x.commuteMin, meets: `${x.matches} of ${x.of}`, misses: x.misses, flags: x.flags, toAsk: x.toAsk }; }),
            relaxations: r.relaxations.map((x) => ({ change: x.label, why: x.why, homesThatWouldFit: x.matched })),
          },
        };
      }
      case "open_listing": {
        const id = listing();
        if (!id) return fail("Unknown listing id. Use an id from the session state.");
        memory.selectedId = id;
        const l = call("get_listing", { id }, () => T.get_listing(id));
        const v = call("verify_listing", { id }, () => T.verify_listing(id));
        const c = l.mode === "rent" ? call("estimate_move_in_cost", { id }, () => T.estimate_move_in_cost(id)) : call("estimate_purchase_cost", { id, downPayment: memory.brief.downPayment }, () => T.estimate_purchase_cost(id, memory.brief.downPayment));
        const reg = l.mode === "buy" ? call("check_project_registration", { id }, () => T.check_project_registration(id)) : null;
        const cm = memory.brief.anchorId ? call("get_commute", { id, anchorId: memory.brief.anchorId, time: memory.brief.time }, () => T.get_commute(id, memory.brief.anchorId!, memory.brief.time ?? "9 am")) : null;
        const area = call("get_neighbourhood", { id }, () => T.get_neighbourhood(id));
        events.push(act("Checked a listing", `${l.title}, ${l.locality}`, "verify_listing"));
        return {
          events,
          forModel: {
            home: home(id), price: price(listingById(id)!), bhk: l.bhk, sqft: l.sqft, floor: l.floor === 0 ? "ground" : `${l.floor} of ${l.floorsTotal}`, furnishing: l.furnishing, lister: l.lister, listedDaysAgo: l.listedDaysAgo,
            checks: v.checks.map((x) => `${x.state}: ${x.label}. ${x.detail}`),
            cost: { total: inr(c.total), items: c.items.map((i) => `${i.label}: ${inr(i.amount)}`), ...("loan" in c ? { emi: `${inr(c.loan.emi)}/month`, loan: inr(c.loan.amount), rate: `${c.loan.ratePct}% illustrative` } : { monthly: `${inr(c.monthly)}/month` }) },
            ...(reg ? { registration: reg.status === "registered" ? `registered, ${reg.number}` : "not found on the Karnataka RERA portal" } : {}),
            ...(cm ? { commute: cm } : {}),
            area: area.facts.map((f) => `${f.label}: ${f.value} (${f.source})`),
          },
        };
      }
      case "verify_listing": {
        const id = listing(); if (!id) return fail("Unknown listing id.");
        const v = call("verify_listing", { id }, () => T.verify_listing(id));
        return { events, forModel: { home: home(id), checks: v.checks.map((x) => `${x.state}: ${x.label}. ${x.detail}`) } };
      }
      case "estimate_move_in_cost": case "estimate_purchase_cost": {
        const id = listing(); if (!id) return fail("Unknown listing id.");
        const l = listingById(id)!;
        if ((l.mode === "rent") !== (tu.name === "estimate_move_in_cost")) return fail(`This home is for ${l.mode === "rent" ? "rent: use estimate_move_in_cost" : "sale: use estimate_purchase_cost"}.`);
        const c = l.mode === "rent" ? call("estimate_move_in_cost", { id }, () => T.estimate_move_in_cost(id)) : call("estimate_purchase_cost", { id, downPayment: memory.brief.downPayment }, () => T.estimate_purchase_cost(id, memory.brief.downPayment));
        return { events, forModel: { home: home(id), ...c, total: inr(c.total) } };
      }
      case "check_project_registration": {
        const id = listing(); if (!id) return fail("Unknown listing id.");
        if (listingById(id)!.mode !== "buy") return fail("Only projects for sale are registered with RERA.");
        return { events, forModel: call("check_project_registration", { id }, () => T.check_project_registration(id)) };
      }
      case "get_commute": {
        const id = listing(); if (!id) return fail("Unknown listing id.");
        if (!memory.brief.anchorId) return fail("The brief has no anchor. Ask where they travel to most days.");
        return { events, forModel: call("get_commute", { id, anchorId: memory.brief.anchorId, time: memory.brief.time }, () => T.get_commute(id, memory.brief.anchorId!, memory.brief.time ?? "9 am")) };
      }
      case "get_neighbourhood": {
        const id = listing(); if (!id) return fail("Unknown listing id.");
        return { events, forModel: call("get_neighbourhood", { id }, () => T.get_neighbourhood(id)) };
      }
      case "compare_listings": {
        const list = listIds(); if (!list) return fail("Use two to four listing ids from the session state.");
        return { events, forModel: call("compare_listings", { ids: list }, () => T.compare_listings(list, memory.brief, memory)) };
      }
      case "draft_owner_message": {
        if (flags.card) return fail("There's already an approval card in this turn.");
        const list = listIds(); if (!list) return fail("Use listing ids from the session state.");
        const qs = (Array.isArray(a.questions) ? a.questions : []).map(String).filter(Boolean).slice(0, 4);
        const bad = qs.map(checkOwnerQuestion).find(Boolean);
        if (bad) return fail(`Owners can't be asked about ${bad}. Ask every owner the same neutral questions.`);
        if (memory.asked + list.length > T.DAILY_LIMIT) return fail(`That would pass today's limit of ${T.DAILY_LIMIT} owner messages (${memory.asked} sent).`);
        const d = call("draft_owner_message", { ids: list, questions: qs }, () => T.draft_owner_message(list, qs));
        events.push(approval("send_owner_message", `Send to ${plural(list.length, "owner")}`, { ids: list, questions: d.questions, drafts: d.drafts }));
        return { events, forModel: { shown: "approval card", to: d.drafts.map((x) => `${home(x.listingId)} (${x.to})`), questions: d.questions, note: "Nothing is sent until they tap Send. Stop calling tools now." } };
      }
      case "plan_visit_route": {
        if (flags.card) return fail("There's already an approval card in this turn.");
        const list = listIds(); if (!list) return fail("Use listing ids from the session state.");
        const day = a.day === "Sun" ? "Sun" : "Sat";
        const p = call("plan_visit_route", { ids: list, day }, () => T.plan_visit_route(list, day));
        if (!p.legs.length) return { events, forModel: { day: p.day, legs: [], note: "None of these owners have a slot that day. Offer the other day." } };
        events.push(approval("schedule_visits", `Request ${plural(p.legs.length, "visit")} on ${p.day}`, { legs: p.legs, day: p.day, start: p.start, end: p.end }));
        return { events, forModel: { shown: "approval card", day: p.day, start: p.start, end: p.end, visits: p.legs.map((x) => `${x.slot.split(" ")[1]} ${home(x.listingId)}`), skipped: p.skipped.map(home), note: "Owners confirm after they approve. Stop calling tools now." } };
      }
      case "prepare_share": {
        if (flags.card) return fail("There's already an approval card in this turn.");
        const list = listIds(); if (!list) return fail("Use listing ids from the session state.");
        const ppl = (Array.isArray(a.people) ? a.people : []).map((p) => { const q = p as { name?: unknown; role?: unknown }; const name = String(q.name ?? "").trim(); return { name: name ? name[0].toUpperCase() + name.slice(1) : "", role: q.role === "views" ? "views" : "votes" }; }).filter((p) => p.name);
        if (!ppl.length) return fail("Name at least one person to share with.");
        events.push(approval("share_shortlist", `Share ${plural(list.length, "finalist")}`, { ids: list, people: ppl, from: memory.name }));
        used.add("prepare_share");
        return { events, forModel: { shown: "approval card", homes: list.map(home), people: ppl, expiresDays: 7, note: "Nothing is shared until they approve. Stop calling tools now." } };
      }
      case "prepare_report": {
        if (flags.card) return fail("There's already an approval card in this turn.");
        const id = listing(); if (!id) return fail("Unknown listing id.");
        const reason = String(a.reason ?? "Fake or misleading");
        events.push(approval("report_listing", "Report this listing", { id, reason }));
        return { events, forModel: { shown: "approval card", home: home(id), reason, note: "Nothing is filed until they approve. Stop calling tools now." } };
      }
      case "get_owner_replies": return replies();
      case "collect_votes": {
        const v = call("collect_votes", { share: !!memory.shareToken }, () => T.collect_votes(memory.shareToken));
        return { events, forModel: { shared: !!memory.shareToken, votes: Object.entries(v.tally).map(([id, who]) => `${who.join(" and ")} voted for ${home(id)}`), agreedOn: v.agreed ? home(v.agreed) : null } };
      }
      case "watch_search": {
        if (!memory.brief.mode) return fail("There's no brief to watch yet.");
        const w = call("watch_search", { brief: memory.brief }, () => T.watch_search(memory.brief, memory.shortlist));
        memory.tasks.unshift({ id: `task-${Date.now().toString(36)}`, kind: "watch", title: "Watching for new matches", createdAt: Date.now(), listingIds: [] });
        events.push(act("Set up a watch", w.schedule, "watch_search"));
        const l = w.firstMatch ? listingById(w.firstMatch.id)! : null;
        return { events, forModel: { schedule: w.schedule, newSinceSearch: l ? { home: home(l.id), bhk: l.bhk, price: price(l), commuteMin: w.firstMatch!.commuteMin } : null } };
      }
      case "summarise_visit_notes": {
        const list = memory.shortlist.slice(0, 3);
        if (!list.length) return fail("The shortlist is empty.");
        const notes = String(a.notes ?? "").trim();
        memory.notes = [memory.notes, notes].filter(Boolean).join("\n");
        const tally = memory.shareToken ? T.collect_votes(memory.shareToken).tally : {};
        const s = call("summarise_visit_notes", { notes: memory.notes, ids: list }, () => T.summarise_visit_notes(memory.notes, list, memory.brief, tally));
        if (!s.recommendation) return { events, forModel: { recommendation: null, note: "Not enough to go on. Ask what they liked or didn't at each place." } };
        const best = s.recommendation.listingId;
        events.push(act("Recommended", home(best), "summarise_visit_notes"));
        const petsKnown = memory.tasks.flatMap((t) => t.replies ?? []).find((r) => r.listingId === best)?.answers.find((x) => /pet/i.test(x.question))?.answer;
        return { events, forModel: { recommend: home(best), why: s.recommendation.why, tradeOff: s.recommendation.tradeOff, caveats: [...s.recommendation.caveats, ...(memory.brief.mustHaves.includes("pets") && !petsKnown ? ["pets not confirmed yet"] : [])], otherVotes: s.recommendation.otherVotes.map((o) => `${o.voters.join(" and ")} voted for ${home(o.listingId)}`), perHome: s.perListing.map((p) => ({ home: home(p.listingId), pros: p.pros, cons: p.cons, flags: p.warns, meets: p.matches })) } };
      }
      case "ask_clarifying_question": {
        if (memory.questionsAsked >= 2) return fail("You've asked two questions already. Assume, label it (origin 'assumed') and search.");
        if (flags.ask) return fail("One question per turn.");
        const field = String(a.field);
        const opts = (Array.isArray(a.options) ? a.options : []).map((o) => { const q = o as { label?: unknown; value?: unknown }; return { label: String(q.label ?? ""), value: String(q.value ?? "") }; }).filter((o) => o.label && validAnswer(field, o.value));
        if (!["mode", "budget", "furnishing", "readiness"].includes(field) || opts.length < 2) return fail("Use field mode, budget, furnishing or readiness, with at least two valid options.");
        memory.questionsAsked++;
        flags.ask = true;
        events.push({ t: "ask", field, question: String(a.question), options: opts });
        return { events, forModel: { shown: "question", note: "End your turn now; their tap comes back as the next message." } };
      }
      case "decline_request": {
        flags.refused = true;
        events.push({ t: "refusal", rule: String(a.rule ?? ""), reason: String(a.reason ?? ""), instead: String(a.instead ?? "") });
        return { events, forModel: { shown: "refusal card" } };
      }
      default: return fail(`There's no tool called ${tu.name}.`);
    }

    function approval(action: ApprovalAction, summary: string, payload: unknown): AgentEvent {
      flags.card = true;
      used.add(action);
      return { t: "approval", action, summary, payload };
    }

    function replies() {
      const task = memory.tasks.find((t) => t.kind === "ask");
      if (!task?.replies) return { events, forModel: { asked: false, note: "No owners have been asked yet." } };
      const revealAll = input.kind === "message" && !!input.revealAll;
      if (revealAll) task.revealed = true;
      const elapsed = (Date.now() - task.createdAt) / 60000;
      const arrived = task.replies.filter((r) => r.replyInMin !== null && (task.revealed || elapsed >= r.replyInMin));
      const waiting = task.replies.length - arrived.length;
      events.push({ t: "result", id: `${tu.id}-r`, name: "owner_replies", data: { taskId: task.id, arrived, waiting, revealAll } });
      used.add("owner_replies");
      const lines: string[] = [];
      for (const r of arrived) {
        const name = home(r.listingId);
        const gone = r.answers.find((x) => x.question === "available" && /rented/i.test(x.answer));
        const pets = r.answers.find((x) => /pet/i.test(x.question));
        if (gone) { memory.shortlist = memory.shortlist.filter((id) => id !== r.listingId); memory.removed.push({ id: r.listingId, reason: "Owner says it's been rented" }); lines.push(`${name}: rented, moved off the shortlist`); continue; }
        if (pets && /^no/i.test(pets.answer) && memory.brief.mustHaves.includes("pets")) { memory.shortlist = memory.shortlist.filter((id) => id !== r.listingId); memory.removed.push({ id: r.listingId, reason: "Owner says no pets" }); lines.push(`${name}: no pets, moved off the shortlist`); continue; }
        lines.push(`${name}: ${r.answers.map((x) => `${x.question} ${x.answer}`).join(" / ")}`);
      }
      if (arrived.length) events.push(act("Collected replies", `${arrived.length} of ${task.replies.length} owners`, "send_owner_message"));
      return { events, forModel: { replied: arrived.length, of: task.replies.length, waiting, replies: lines } };
    }
  }
}

/* ── one API call ──────────────────────────────────────────────── */
async function create(messages: MessageParam[], usage: Usage) {
  const response = await anthropic().beta.messages.create({
    model: MODEL,
    max_tokens: 8000,
    betas: ["server-side-fallback-2026-07-01"],
    fallbacks: "default", // if a safety classifier declines, Anthropic's recommended model retries the request
    output_config: { effort: EFFORT },
    cache_control: { type: "ephemeral" }, // caches the growing conversation between rounds of one turn
    // Tools render before the system prompt, so this marker caches both: they're identical on every request.
    system: [{ type: "text", text: SYSTEM, cache_control: { type: "ephemeral" } }],
    tools: TOOLS,
    messages,
  });
  usage.calls++;
  usage.input += response.usage.input_tokens;
  usage.output += response.usage.output_tokens;
  usage.cacheRead += response.usage.cache_read_input_tokens ?? 0;
  usage.cacheWrite += response.usage.cache_creation_input_tokens ?? 0;
  return response;
}

const finalText = (content: Anthropic.Beta.Messages.BetaContentBlock[]) =>
  content.filter((b): b is Anthropic.Beta.Messages.BetaTextBlock => b.type === "text").map((b) => b.text.trim()).filter(Boolean).join(" ").trim();

/* ── output checks: banned words, and amounts or durations no tool returned ── */
function audit(text: string, events: AgentEvent[], memory: Memory): string[] {
  const problems: string[] = [];
  for (const re of BANNED_IN_OUTPUT) { const m = re.exec(text); if (m) problems.push(`the word "${m[0]}"`); }
  if (/₹\s?\d[\d,.]*\s?k\b/i.test(text)) problems.push(`an amount written with "k"`);
  const nums: number[] = [];
  const walk = (v: unknown) => { if (typeof v === "number") nums.push(v); else if (v && typeof v === "object") Object.values(v).forEach(walk); };
  events.filter((e) => e.t === "result").forEach((e) => walk((e as Extract<AgentEvent, { t: "result" }>).data));
  walk(memory.brief);
  for (const id of [...memory.shortlist, ...memory.removed.map((r) => r.id), ...(memory.selectedId ? [memory.selectedId] : [])]) walk(listingById(id));
  const unsourced: string[] = [];
  for (const m of text.matchAll(/₹\s?([\d,.]+)\s*(lakh|Cr)?|(\d+)\s*min\b/g)) {
    const v = m[3] ? Number(m[3]) : Number(m[1].replace(/,/g, "")) * (m[2] === "lakh" ? 1e5 : m[2] === "Cr" ? 1e7 : 1);
    if (!Number.isFinite(v) || v <= 10) continue;
    const ok = nums.some((x) => Math.abs(x - v) <= Math.max(1, Math.abs(x) * 0.01)) || nums.some((x) => nums.some((y) => Math.abs(Math.abs(x - y) - v) <= 1));
    if (!ok) unsourced.push(`"${m[0].trim()}"`);
  }
  if (unsourced.length) problems.push(`${unsourced.join(", ")}, which no tool returned`);
  return problems;
}

/* ── inputs ────────────────────────────────────────────────────── */
const FIELD: Record<string, keyof Brief> = { mode: "mode", bhk: "bhk", budget: "budget", down_payment: "downPayment", anchor_id: "anchorId", time: "time", max_commute_min: "maxCommuteMin", furnishing: "furnishing", readiness: "readiness", must_haves: "mustHaves", deal_breakers: "dealBreakers", localities: "localities", people: "people" };

function briefChanges(a: Record<string, unknown>): { changes: Partial<Brief>; origin: "you" | "assumed"; problem?: string } {
  const origin = a.origin === "assumed" ? "assumed" : "you";
  const changes: Record<string, unknown> = {};
  for (const [k, field] of Object.entries(FIELD)) if (a[k] !== undefined && a[k] !== null) changes[field] = a[k];
  for (const k of Array.isArray(a.clear) ? (a.clear as string[]) : []) { const f = FIELD[k]; if (f) changes[f] = ["mustHaves", "dealBreakers", "localities"].includes(f) ? [] : null; }
  if (changes.anchorId && !anchors.some((x) => x.id === changes.anchorId)) return { changes: {}, origin, problem: "Unknown anchor_id." };
  if (Array.isArray(changes.localities) && !(changes.localities as string[]).every((id) => localities.some((l) => l.id === id))) return { changes: {}, origin, problem: "Unknown locality id." };
  if (changes.budget !== undefined && changes.budget !== null && !(Number(changes.budget) > 0)) return { changes: {}, origin, problem: "The budget must be a positive number of rupees." };
  if (!Object.keys(changes).length) return { changes: {}, origin, problem: "No changes given." };
  return { changes: changes as Partial<Brief>, origin };
}

function answerChanges(field: string, value: string): Partial<Brief> {
  if (field === "budget") return { budget: Number(value) };
  if (field === "mode") return { mode: value as Brief["mode"] };
  if (field === "furnishing") return { furnishing: value as Brief["furnishing"] };
  if (field === "readiness") return { readiness: value as Brief["readiness"] };
  return {};
}

const validAnswer = (field: string, value: string) =>
  field === "mode" ? ["rent", "buy"].includes(value)
  : field === "budget" ? /^\d{4,10}$/.test(value)
  : field === "furnishing" ? ["furnished", "semi", "unfurnished", "any"].includes(value)
  : field === "readiness" ? ["ready", "under construction", "any"].includes(value)
  : false;

/* ── suggested next steps, from what ran this turn ─────────────── */
function suggestions(memory: Memory, used: Set<string>, flags: { card: boolean; ask: boolean; refused: boolean; emptySearch: ReturnType<typeof T.search_listings> | null }): string[] {
  if (flags.card || flags.ask) return [];
  const mode = memory.brief.mode;
  if (flags.refused) return [];
  if (flags.emptySearch) return [...flags.emptySearch.relaxations.map((x) => x.label), "Keep watching instead"];
  if (used.has("summarise_visit_notes")) return ["What are the next steps?"];
  if (used.has("collect_votes")) return ["I visited them, here are my notes"];
  const n = Math.min(3, memory.shortlist.length);
  const compare = n >= 2 ? [`Compare the top ${n}`] : [];
  if (used.has("owner_replies")) return ["Plan visits for Saturday", ...compare];
  if (used.has("search_listings") && n) {
    const who = n === 1 ? (mode === "buy" ? "the builder" : "the owner") : mode === "buy" ? `the top ${n} builders` : `the top ${n} owners`;
    return mode === "buy" ? ["Open the first one", `Ask ${who} for the e-khata`, ...compare]
      : ["Open the first one", memory.brief.mustHaves.includes("pets") ? `Ask ${who} if pets are OK and if the deposit is negotiable` : `Ask ${who} if the deposit is negotiable`, ...compare];
  }
  if (used.has("get_listing")) return [mode === "buy" ? "Ask the builder for the e-khata" : "Ask this owner if pets are OK", ...compare, "Report this listing"];
  return [];
}

/* ── usage log: one line per turn, so the evals can report cost ── */
function logUsage(u: Usage, rewrites: number, ms: number, input: ModelInput) {
  const cost = (u.input * PRICE.input + u.output * PRICE.output + u.cacheRead * PRICE.cacheRead + u.cacheWrite * PRICE.cacheWrite) / 1e6;
  const line = { at: new Date().toISOString(), model: MODEL, effort: EFFORT, kind: input.kind, ...u, rewrites, ms, usd: Math.round(cost * 10000) / 10000 };
  console.log(`[hosamane] ${input.kind}: ${u.calls} calls, ${u.input} in + ${u.cacheRead} cached + ${u.cacheWrite} cache-write, ${u.output} out, ${(ms / 1000).toFixed(1)}s, $${line.usd}${rewrites ? `, ${rewrites} rewrite` : ""}`);
  if (process.env.HOSAMANE_USAGE_LOG) try { fs.appendFileSync(process.env.HOSAMANE_USAGE_LOG, JSON.stringify(line) + "\n"); } catch {}
}
