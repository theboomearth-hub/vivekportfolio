/**
 * Scripted planner for the Hosamane prototype.
 *
 * It decides which tools to call from the message and the session memory, then writes replies only from
 * the tools' results. It stands in for a language model until an API key is configured: the tools,
 * approvals and guardrails are the same either way, because they live in lib/tools.ts and lib/approval.ts.
 */
import { anchorById, anchors, inr, inrShort, listingById, localities, localityById } from "./data";
import { checkMessage } from "./guard";
import * as T from "./tools";
import type { AgentEvent, ApprovalAction, Brief, Memory } from "./types";

export type AgentInput =
  | { kind: "message"; text: string; memory: Memory; revealAll?: boolean }
  | { kind: "answer"; field: string; value: string; memory: Memory }
  | { kind: "approved"; action: ApprovalAction; token: string; memory: Memory };

let seq = 0;
const now = () => Date.now();
/** "Mango Enclave, Bellandur": unambiguous when two shortlisted homes share an area. */
const home = (id: string) => { const l = listingById(id)!; return `${l.title.replace(/^\dBHK in /, "")}, ${localityById(l.localityId).name}`; };

export async function* runAgent(input: AgentInput): AsyncGenerator<AgentEvent> {
  const memory: Memory = structuredClone(input.memory);
  const out: AgentEvent[] = [];
  const emit = (e: AgentEvent) => out.push(e);
  const call = <R,>(name: string, args: unknown, fn: () => R): R => {
    const id = `call-${++seq}`;
    emit({ t: "tool", id, name, args });
    const data = fn();
    emit({ t: "result", id, name, data });
    return data;
  };
  const act = (action: string, detail: string, tool: string) => emit({ t: "activity", entry: { at: now(), action, detail, tool } });
  const say = (text: string) => emit({ t: "text", text });
  const suggest = (...options: string[]) => emit({ t: "suggest", options });

  try {
    if (input.kind === "approved") approved(input.action, input.token);
    else if (input.kind === "answer") {
      answer(input.field, input.value);
    } else message(input.text, !!input.revealAll);
  } catch (err) {
    say(`Something went wrong on my side (${(err as Error).message}). Your board is unchanged. Try again?`);
  }
  emit({ t: "memory", memory });
  emit({ t: "done" });
  for (const e of out) yield e;

  /* ── approvals ─────────────────────────────────────────────── */
  function approved(action: ApprovalAction, token: string) {
    if (action === "send_owner_message") {
      const r = call("send_owner_message", { approval: "signed" }, () => T.send_owner_message(token, memory));
      if (!r.ok) return say(r.reason);
      memory.tasks.unshift(r.task);
      memory.asked += r.task.listingIds.length;
      act("Sent questions", `${r.task.listingIds.length} owners, via the masked relay`, "send_owner_message");
      say(`Sent to ${r.task.listingIds.length} owners. Your name and number weren't shared. I'll tell you when they reply.`);
      return suggest("What did the owners say?", "Plan visits for Saturday");
    }
    if (action === "schedule_visits") {
      const r = call("schedule_visits", { approval: "signed" }, () => T.schedule_visits(token));
      if (!r.ok) return say(r.reason);
      memory.tasks.unshift(r.task);
      const ok = r.task.visits!.filter((v) => v.status === "confirmed");
      const no = r.task.visits!.filter((v) => v.status === "declined");
      act("Requested visit slots", `${r.task.visits!.length} visits`, "schedule_visits");
      say(`${ok.length} visit${ok.length === 1 ? "" : "s"} confirmed${no.length ? `. ${no.map((v) => `The owner of ${home(v.listingId)} can't do ${v.slot.split(" ")[1]}; they offered ${v.alternative?.split(" ")[1]}`).join(". ")}.` : "."}`);
      return suggest("Share the finalists with Priya", "I visited them, here are my notes");
    }
    if (action === "share_shortlist") {
      const r = call("share_shortlist", { approval: "signed" }, () => T.share_shortlist(token));
      if (!r.ok) return say(r.reason);
      memory.shareToken = r.token;
      act("Shared finalists", r.people.map((p) => `${p.name} (${p.role === "votes" ? "votes" : "view only"})`).join(", "), "share_shortlist");
      say(`Shared with ${r.people.map((p) => p.name).join(" and ")}. The link works from WhatsApp, needs no app, and expires in ${r.expiresDays} days.`);
      return suggest("Any votes yet?");
    }
    if (action === "report_listing") {
      const r = call("report_listing", { approval: "signed" }, () => T.report_listing(token));
      if (!r.ok) return say(r.reason);
      memory.shortlist = memory.shortlist.filter((id) => id !== r.id);
      memory.removed.push({ id: r.id, reason: "You reported it" });
      act("Reported a listing", `${r.reason} · ${r.reference}`, "report_listing");
      return say(`Reported (${r.reference}) and removed from your shortlist. The verification team reviews reports within a day.`);
    }
  }

  /* ── clarifying answers ────────────────────────────────────── */
  function answer(field: string, value: string) {
    const changes: Partial<Brief> = {};
    if (field === "mode") changes.mode = value as Brief["mode"];
    if (field === "furnishing") changes.furnishing = value as Brief["furnishing"];
    if (field === "budget") changes.budget = Number(value);
    if (field === "readiness") changes.readiness = value as Brief["readiness"];
    memory.brief = call("update_brief", changes, () => T.update_brief(memory.brief, changes, "you"));
    clarifyOrSearch();
  }

  /* ── messages ──────────────────────────────────────────────── */
  function message(text: string, revealAll: boolean) {
    const t = text.trim();
    const g = checkMessage(t);
    if (g?.kind === "protected") return emit({ t: "refusal", rule: `I can't filter by ${g.trait}.`, reason: "It's a rule I keep to avoid discrimination, and owners on Hosamane can't restrict tenants that way either.", instead: "I can ask every owner the same questions about house rules, if that helps." });
    if (g?.kind === "payment") {
      emit({ t: "refusal", rule: "I can't make payments, and I won't.", reason: "Paying before you've seen a home is how most rental scams work.", instead: "If an owner asks for money before a visit, don't pay. I can report the listing." });
      return suggest("Report this listing");
    }
    if (g?.kind === "id-docs") return emit({ t: "refusal", rule: "I don't handle ID documents.", reason: "Share them yourself, only with an owner you've met and an agreement in hand.", instead: "I can draft a checklist of what to ask for before sharing anything." });
    if (g?.kind === "number") return emit({ t: "refusal", rule: "I won't share your number.", reason: "Owners reach you through the masked chat.", instead: "You can share it yourself any time from a conversation." });
    if (g?.kind === "safety") {
      emit({ t: "refusal", rule: "I don't rate areas as safe or unsafe.", reason: "Those labels hide more than they show.", instead: "Here's what's on record, each with its source." });
      const id = memory.selectedId ?? memory.shortlist[0];
      if (id) call("get_neighbourhood", { listingId: id }, () => T.get_neighbourhood(id));
      return;
    }

    const lower = t.toLowerCase();
    if (/^(report|flag)\b|report (this|it|the listing)/.test(lower)) return report(lower);
    if (/\b(what did|did (the )?owners|any repl|replies|owners say)\b/.test(lower)) return replies(revealAll);
    if (/\bask\b/.test(lower) && /\b(owner|owners|them|these|top|landlord|builder)\b/.test(lower)) return askOwners(lower);
    if (/\b(plan|schedule|book)\b.*\bvisit|\bvisits? (on|for) (sat|sun)/.test(lower)) return planVisits(lower);
    if (/\bshare\b/.test(lower)) return share(t);
    if (/\bvotes?\b|what (does|did) \w+ think/.test(lower)) return votes();
    if (/\b(watch|alert|notify|digest)\b/.test(lower)) return watch();
    if (/\b(notes?|visited|recommend|which one|decide)\b/.test(lower)) return recommend(t);
    if (/\bcompare\b/.test(lower)) return compare(lower);
    if (/\b(cost|move-in|move in|how much|total|emi)\b/.test(lower) && (memory.selectedId || memory.shortlist.length)) return cost(lower);
    if (/\bcommute\b/.test(lower) && (memory.selectedId || memory.shortlist.length)) return commute(lower);
    if (/\b(open|show me|tell me about|details|the first|the second|the third)\b/.test(lower) && (memory.shortlist.length || /\b[rb]-\d{2}\b/.test(lower))) return open(lower);

    const relax: [RegExp, (m: RegExpMatchArray) => Partial<Brief>][] = [
      [/include under-construction/, () => ({ readiness: "any" })],
      [/allow a (\d+) min commute/, (m) => ({ maxCommuteMin: Number(m[1]) })],
      [/include nearby areas/, () => ({ localities: [] })],
      [/show (\d)bhks too/, () => ({ bhk: null })],
      [/stretch the budget/, () => ({ budget: memory.brief.budget ? Math.round(memory.brief.budget * 1.15) : null })],
    ];
    for (const [re, fn] of relax) {
      const m = lower.match(re);
      if (m) { const ch = fn(m); memory.brief = call("update_brief", ch, () => T.update_brief(memory.brief, ch, "you")); return search(); }
    }

    const changes = parseBrief(t);
    if (Object.keys(changes).length) {
      memory.brief = call("update_brief", changes, () => T.update_brief(memory.brief, changes, "you"));
      return clarifyOrSearch();
    }
    if (/\b(search|find|show|more|again|homes|flats)\b/.test(lower) && memory.brief.mode) return search();
    say("I can search, check listings, work out the real cost, ask owners your questions and plan visits. What are you looking for?");
    suggest("Rent a 2BHK near my office", "Buy my first home", "What will moving in really cost?");
  }

  /* ── brief and search ──────────────────────────────────────── */
  function clarifyOrSearch() {
    // Infer what's obvious instead of asking: a monthly-sized budget or a flatmate means renting.
    if (!memory.brief.mode && ((memory.brief.budget && memory.brief.budget <= 200000) || memory.brief.people.some((p) => p.name === "Flatmate"))) {
      memory.brief = call("update_brief", { mode: "rent" }, () => T.update_brief(memory.brief, { mode: "rent" }, "assumed"));
    } else if (!memory.brief.mode && memory.brief.budget && memory.brief.budget >= 2000000) {
      memory.brief = call("update_brief", { mode: "buy" }, () => T.update_brief(memory.brief, { mode: "buy" }, "assumed"));
    }
    const b = memory.brief;
    if (memory.questionsAsked < 2) {
      if (!b.mode) { memory.questionsAsked++; return emit({ t: "ask", field: "mode", question: "Are you renting or buying?", options: [{ label: "Renting", value: "rent" }, { label: "Buying", value: "buy" }] }); }
      if (!b.budget) { memory.questionsAsked++; return emit({ t: "ask", field: "budget", question: b.mode === "buy" ? "What's your budget?" : "What's your monthly budget?", options: b.mode === "buy" ? [{ label: "Up to ₹1 Cr", value: "10000000" }, { label: "Up to ₹1.4 Cr", value: "14000000" }, { label: "Up to ₹2 Cr", value: "20000000" }] : [{ label: "Up to ₹30k", value: "30000" }, { label: "Up to ₹45k", value: "45000" }, { label: "Up to ₹60k", value: "60000" }] }); }
      if (b.mode === "rent" && !b.furnishing) { memory.questionsAsked++; return emit({ t: "ask", field: "furnishing", question: "Furnished or unfurnished?", options: [{ label: "Furnished", value: "furnished" }, { label: "Semi", value: "semi" }, { label: "Either", value: "any" }] }); }
      if (b.mode === "buy" && !b.readiness) { memory.questionsAsked++; return emit({ t: "ask", field: "readiness", question: "Ready to move, or under construction?", options: [{ label: "Ready to move", value: "ready" }, { label: "Under construction", value: "under construction" }, { label: "Either", value: "any" }] }); }
    }
    const assumed: Partial<Brief> = {};
    if (!b.mode) assumed.mode = "rent";
    if (b.anchorId && !b.maxCommuteMin) assumed.maxCommuteMin = 45;
    if (b.mode === "rent" && !b.furnishing) assumed.furnishing = "any";
    if (Object.keys(assumed).length) memory.brief = call("update_brief", assumed, () => T.update_brief(memory.brief, assumed, "assumed"));
    search();
  }

  function search() {
    const r = call("search_listings", { brief: memory.brief }, () => T.search_listings(memory.brief));
    memory.shortlist = r.results.map((x) => x.id);
    memory.selectedId = null;
    act("Searched", `${r.considered} ${r.mode === "rent" ? "rentals" : "homes for sale"} checked, ${r.matched} fit`, "search_listings");
    if (!r.results.length) {
      say(`Nothing fits all of this yet.${r.relaxations.map((x) => ` ${x.matched} home${x.matched === 1 ? " fits" : "s fit"} if ${x.why}.`).join("")}`);
      return suggest(...r.relaxations.map((x) => x.label), "Keep watching instead");
    }
    const flagged = r.results.filter((x) => x.flags.length).length;
    say(`I found ${r.results.length} home${r.results.length === 1 ? " that fits" : "s that fit"}${flagged ? `. ${flagged} need${flagged === 1 ? "s" : ""} a closer look` : ""}.`);
    if (r.mode === "buy") suggest("Open the first one", "Ask the builders for the e-khata", "Compare the top 3");
    else suggest("Open the first one", memory.brief.mustHaves.includes("pets") ? "Ask the top 3 owners if pets are OK and if the deposit is negotiable" : "Ask the top 3 owners if the deposit is negotiable", "Compare the top 3");
  }

  /* ── one listing ───────────────────────────────────────────── */
  function target(lower: string): string | null {
    const idMatch = /\b([rb]-\d{2})\b/.exec(lower)?.[1];
    if (idMatch && listingById(idMatch)) return idMatch;
    const ord = /\b(first|1st|top one)\b/.test(lower) ? 0 : /\b(second|2nd)\b/.test(lower) ? 1 : /\b(third|3rd)\b/.test(lower) ? 2 : -1;
    if (ord >= 0 && memory.shortlist[ord]) return memory.shortlist[ord];
    const byLoc = memory.shortlist.find((id) => lower.includes(localityById(listingById(id)!.localityId).name.toLowerCase().split(" ")[0]));
    if (byLoc) return byLoc;
    const byId = memory.shortlist.find((id) => lower.includes(id));
    return byId ?? memory.selectedId ?? memory.shortlist[0] ?? null;
  }

  function open(lower: string) {
    const id = target(lower);
    if (!id) return say("Which one? Tap a home on your shortlist, or tell me the area.");
    memory.selectedId = id;
    const l = call("get_listing", { id }, () => T.get_listing(id));
    const v = call("verify_listing", { id }, () => T.verify_listing(id));
    const c = l.mode === "rent" ? call("estimate_move_in_cost", { id }, () => T.estimate_move_in_cost(id)) : call("estimate_purchase_cost", { id, downPayment: memory.brief.downPayment }, () => T.estimate_purchase_cost(id, memory.brief.downPayment));
    if (l.mode === "buy") call("check_project_registration", { id }, () => T.check_project_registration(id));
    const cm = memory.brief.anchorId ? call("get_commute", { id, anchorId: memory.brief.anchorId, time: memory.brief.time }, () => T.get_commute(id, memory.brief.anchorId!, memory.brief.time ?? "9 am")) : null;
    call("get_neighbourhood", { id }, () => T.get_neighbourhood(id));
    act("Checked a listing", `${l.title}, ${l.locality}`, "verify_listing");
    say(`${l.title}, ${l.locality}: ${inrShort(c.total)} ${l.mode === "rent" ? "to move in" : "all-in"}${cm ? `, ${cm.carMin} min to ${anchorById(memory.brief.anchorId!)!.name.split(" (")[0]} at ${cm.time}` : ""}. ${v.summary.pass} check${v.summary.pass === 1 ? "" : "s"} passed${v.summary.warn ? `, ${v.summary.warn} flagged` : ""}${v.summary.todo ? `, ${v.summary.todo} to do` : ""}.`);
    suggest(l.mode === "rent" ? "Ask this owner if pets are OK" : "Ask the builder for the e-khata", "Compare the top 3", "Report this listing");
  }

  function cost(lower: string) {
    const id = target(lower)!;
    const l = listingById(id)!;
    const c = l.mode === "rent" ? call("estimate_move_in_cost", { id }, () => T.estimate_move_in_cost(id)) : call("estimate_purchase_cost", { id, downPayment: memory.brief.downPayment }, () => T.estimate_purchase_cost(id, memory.brief.downPayment));
    say(`${inrShort(c.total)} ${l.mode === "rent" ? "to move in" : "all-in"}, itemised below.`);
  }

  function commute(lower: string) {
    const id = target(lower)!;
    if (!memory.brief.anchorId) return say("Where do you travel to most days? Tell me the office or area and I'll measure it.");
    const c = call("get_commute", { id, anchorId: memory.brief.anchorId }, () => T.get_commute(id, memory.brief.anchorId!, memory.brief.time ?? "9 am"));
    say(`${c.carMin} min by car at ${c.time}, ${c.busWalkMin} min by bus and walk.`);
  }

  function compare(lower: string) {
    const n = /\btop (\d)\b/.exec(lower)?.[1];
    const ids = memory.shortlist.slice(0, n ? Number(n) : 3);
    if (ids.length < 2) return say("I need at least two homes on your shortlist to compare.");
    call("compare_listings", { ids }, () => T.compare_listings(ids, memory.brief, memory));
    say(`Side by side, against your brief.`);
  }

  /* ── owners ────────────────────────────────────────────────── */
  function askOwners(lower: string) {
    const n = /\btop (\d)\b/.exec(lower)?.[1];
    const ids = /\b(this|the) (owner|builder)\b/.test(lower) && memory.selectedId ? [memory.selectedId] : memory.shortlist.slice(0, n ? Number(n) : 3);
    if (!ids.length) return say("Search first, and I'll ask the owners of your shortlist.");
    const qs: string[] = [];
    if (/\bpet/.test(lower)) qs.push("Are pets allowed?");
    if (/\bdeposit/.test(lower)) qs.push("Is the deposit negotiable?");
    if (/\b(cook|food|rules?|non-?veg|guests?)\b/.test(lower)) qs.push("Are there any house rules about cooking, pets or guests?");
    if (/\b(khata|e-khata)\b/.test(lower)) qs.push("Could you share the e-khata for this home?");
    if (!qs.length) qs.push("Is the home still available?");
    const d = call("draft_owner_message", { ids, questions: qs }, () => T.draft_owner_message(ids, qs));
    emit({ t: "approval", action: "send_owner_message", summary: `Send to ${ids.length} owner${ids.length === 1 ? "" : "s"}`, payload: { ids, questions: d.questions, drafts: d.drafts } });
    say(`Here's what I'd send. Review it before it goes: sent messages can't be unsent.`);
  }

  function replies(revealAll: boolean) {
    const task = memory.tasks.find((t) => t.kind === "ask");
    if (!task?.replies) return say("I haven't asked any owners yet.");
    const elapsed = (now() - task.createdAt) / 60000;
    if (revealAll) task.revealed = true;
    const arrived = task.replies.filter((r) => r.replyInMin !== null && (task.revealed || elapsed >= r.replyInMin));
    const waiting = task.replies.length - arrived.length;
    emit({ t: "result", id: `call-${++seq}`, name: "owner_replies", data: { taskId: task.id, arrived, waiting, revealAll } });
    if (!arrived.length) return say(`No replies yet from the ${task.replies.length} owners. I'll tell you when they come in.`);
    const lines: string[] = [];
    for (const r of arrived) {
      const l = listingById(r.listingId)!;
      const name = home(l.id);
      const pets = r.answers.find((a) => /pet/i.test(a.question));
      const gone = r.answers.find((a) => a.question === "available" && /rented/i.test(a.answer));
      if (gone) { memory.shortlist = memory.shortlist.filter((id) => id !== l.id); memory.removed.push({ id: l.id, reason: "Owner says it's been rented" }); lines.push(`${name} has been rented, so I've moved it out`); continue; }
      if (pets && /^no/i.test(pets.answer) && memory.brief.mustHaves.includes("pets")) { memory.shortlist = memory.shortlist.filter((id) => id !== l.id); memory.removed.push({ id: l.id, reason: "Owner says no pets" }); lines.push(`the owner of ${name} says no pets, so it's out`); }
      else lines.push(`${name}: ${r.answers.map((a) => a.answer).join("; ")}`);
    }
    act("Collected replies", `${arrived.length} of ${task.replies.length} owners`, "send_owner_message");
    say(`${arrived.length} of ${task.replies.length} replied. ${lines.map((x) => x[0].toUpperCase() + x.slice(1)).join(". ")}.${waiting ? ` ${waiting} hasn't replied yet.` : ""}`);
    suggest("Plan visits for Saturday", "Compare the top 3");
  }

  /* ── visits, sharing, deciding ─────────────────────────────── */
  function planVisits(lower: string) {
    const day = /\bsun/.test(lower) ? "Sun" : "Sat";
    const ids = memory.shortlist.slice(0, 3);
    if (!ids.length) return say("Search first, then I'll plan the visits.");
    const p = call("plan_visit_route", { ids, day }, () => T.plan_visit_route(ids, day));
    if (!p.legs.length) return say(`None of these owners have slots on ${p.day}. Try the other day?`);
    emit({ t: "approval", action: "schedule_visits", summary: `Request ${p.legs.length} visit${p.legs.length === 1 ? "" : "s"} on ${p.day}`, payload: { legs: p.legs, day: p.day, start: p.start, end: p.end } });
    say(`${p.day}: ${p.legs.length} visit${p.legs.length === 1 ? "" : "s"}, ${p.start} to ${p.end}, in an order that works with each owner's slots. Owners confirm after you approve.`);
  }

  function share(text: string) {
    const ids = memory.shortlist.slice(0, 3);
    if (!ids.length) return say("There's nothing on your shortlist to share yet.");
    const names = [...text.matchAll(/\b(?:with|and)\s+([A-Z][a-z]+|mum|mom|dad|amma|appa)\b/g)].map((m) => m[1]);
    const people = (names.length ? names : ["Priya"]).map((n) => ({ name: n[0].toUpperCase() + n.slice(1), role: /view only|just see/i.test(text) || /^(mum|mom|dad|amma|appa)$/i.test(n) ? "views" : "votes" }));
    emit({ t: "approval", action: "share_shortlist", summary: `Share ${ids.length} finalists`, payload: { ids, people, from: memory.name } });
    say(`Share these ${ids.length} with ${people.map((p) => `${p.name} (${p.role === "votes" ? "votes" : "view only"})`).join(" and ")}? The link expires in 7 days.`);
  }

  function votes() {
    const v = call("collect_votes", { share: !!memory.shareToken }, () => T.collect_votes(memory.shareToken));
    if (!v.votes.length) return say(memory.shareToken ? "No votes yet. I'll let you know." : "You haven't shared the shortlist yet.");
    const lines = Object.entries(v.tally).map(([id, who]) => `${who.join(" and ")} voted for ${home(id)}`);
    say(`${lines.join(". ")}.${v.agreed ? ` You agree on ${home(v.agreed)}.` : ""}`);
    suggest("I visited them, here are my notes");
  }

  function watch() {
    const w = call("watch_search", { brief: memory.brief }, () => T.watch_search(memory.brief, memory.shortlist));
    memory.tasks.unshift({ id: `task-${now().toString(36)}`, kind: "watch", title: "Watching for new matches", createdAt: now(), listingIds: [] });
    act("Set up a watch", w.schedule, "watch_search");
    if (w.firstMatch) {
      const l = listingById(w.firstMatch.id)!;
      say(`${w.schedule}. New since your search: a ${l.bhk}BHK in ${localityById(l.localityId).name}${w.firstMatch.commuteMin ? `, ${w.firstMatch.commuteMin} min from your office` : ""}, at ${l.mode === "rent" ? `${inr(l.rent!)}/month` : inrShort(l.price!)}.`);
    } else say(`${w.schedule}. Nothing new right now.`);
  }

  function recommend(text: string) {
    const ids = memory.shortlist.slice(0, 3);
    if (!ids.length) return say("Search first, and I'll help you decide.");
    memory.notes = [memory.notes, text].filter(Boolean).join("\n");
    const tally = memory.shareToken ? T.collect_votes(memory.shareToken).tally : {};
    const s = call("summarise_visit_notes", { notes: memory.notes, ids }, () => T.summarise_visit_notes(memory.notes, ids, memory.brief, tally));
    if (!s.recommendation) return say("I need a little more to go on. Tell me what you liked or didn't at each place.");
    const best = listingById(s.recommendation.listingId)!;
    act("Recommended", `${best.title}, ${localityById(best.localityId).name}`, "summarise_visit_notes");
    const petsKnown = memory.tasks.flatMap((t) => t.replies ?? []).find((r) => r.listingId === best.id)?.answers.find((a) => /pet/i.test(a.question))?.answer;
    const caveats = [...s.recommendation.caveats, ...(memory.brief.mustHaves.includes("pets") && !petsKnown ? ["pets not confirmed yet"] : [])];
    const disagree = s.recommendation.otherVotes.map((o) => `${o.voters.join(" and ")} voted for ${home(o.listingId)}`);
    say(`I'd pick ${home(best.id)}: it ${s.recommendation.why.join(", ")}.${s.recommendation.tradeOff ? ` Trade-off: ${s.recommendation.tradeOff}.` : ""}${caveats.length ? ` Before you decide: ${caveats.join("; ")}.` : ""}${disagree.length ? ` Note: ${disagree.join("; ")}.` : ""}`);
    suggest("What are the next steps?");
  }

  function report(lower: string) {
    const id = memory.selectedId ?? memory.shortlist[0];
    if (!id) return say("Open the listing you want to report first.");
    const reason = /broker/.test(lower) ? "Broker posing as owner" : /taken|rented|sold/.test(lower) ? "No longer available" : /fake|photo/.test(lower) ? "Fake or misleading" : "Asked for money before a visit";
    emit({ t: "approval", action: "report_listing", summary: "Report this listing", payload: { id, reason } });
    say(`Report ${home(id)} as "${reason}"?`);
  }
}

/* ── brief parsing ─────────────────────────────────────────── */
const ANCHOR_ALIASES: [RegExp, string][] = [
  [/\bbellandur|outer ring road|\borr\b/i, "bellandur-orr"],
  [/\bmanyata|hebbal office/i, "manyata"],
  [/\belectronic city office|e-?city office|electronic city phase/i, "ecity-p1"],
  [/\bitpl|whitefield office/i, "itpl"],
  [/\bkoramangala office/i, "koramangala"],
  [/\bmg road\b/i, "mg-road"],
];

export function parseBrief(text: string): Partial<Brief> {
  // "₹45,000" and Indian grouping such as "₹1,40,00,000" read as plain numbers.
  const t = text.toLowerCase().replace(/(?<=\d),(?=\d)/g, "");
  const c: Partial<Brief> = {};
  if (/\b(rent|renting|lease|on rent)\b/.test(t)) c.mode = "rent";
  if (/\b(buy|buying|purchase|my first home|own a)\b/.test(t)) c.mode = "buy";
  const bhk = /(\d)\s*-?\s*bhk/.exec(t)?.[1];
  if (bhk) c.bhk = Number(bhk);
  // The budget is the first amount that isn't a commute ("under 40 min") or a down payment.
  const withoutDown = t.replace(/down ?payment(?: of)?\s*(?:₹|rs\.?)?\s*\d+(?:\.\d+)?\s*(?:lakh|lakhs|l|cr)\b/g, " ");
  for (const money of withoutDown.matchAll(/(?:₹|rs\.?|inr|budget|under|upto|up to|around)\s*(\d+(?:\.\d+)?)\s*(k|thousand|lakh|lakhs|l|cr|crore)?\b/g)) {
    const after = withoutDown.slice(money.index! + money[0].length, money.index! + money[0].length + 5);
    if (/^\s*min/.test(after)) continue;
    const n = Number(money[1]); const u = money[2];
    const v = u === "k" || u === "thousand" ? n * 1e3 : u === "lakh" || u === "lakhs" || u === "l" ? n * 1e5 : u === "cr" || u === "crore" ? n * 1e7 : n;
    if (v >= 5000) { c.budget = v; break; }
  }
  const down = /down ?payment(?: of)?\s*(?:₹|rs\.?)?\s*(\d+(?:\.\d+)?)\s*(lakh|lakhs|l|cr)/.exec(t);
  if (down) c.downPayment = Number(down[1]) * (down[2].startsWith("c") ? 1e7 : 1e5);
  const mins = /(?:under|within|less than|<|max)\s*(\d{2})\s*(?:min|mins|minutes)/.exec(t);
  if (mins) c.maxCommuteMin = Number(mins[1]);
  for (const [re, id] of ANCHOR_ALIASES) if (re.test(t)) { c.anchorId = id; break; }
  const time = /\b(\d{1,2})\s*(am|pm)\b/.exec(t);
  if (time) c.time = `${time[1]} ${time[2]}`;
  if (/\bsemi\b/.test(t)) c.furnishing = "semi"; else if (/\bunfurnished\b/.test(t)) c.furnishing = "unfurnished"; else if (/\bfurnished\b/.test(t)) c.furnishing = "furnished";
  if (/\bready to move|\bready\b/.test(t)) c.readiness = "ready"; else if (/under construction/.test(t)) c.readiness = "under construction";
  const must: string[] = [];
  if (/\b(cat|dog|pet|pets)\b/.test(t)) must.push("pets");
  if (/\bbalcony\b/.test(t)) must.push("balcony");
  if (/\bparking\b/.test(t)) must.push("parking");
  if (/\bgym\b/.test(t)) must.push("gym");
  if (/\b(2|two) bath/.test(t)) must.push("2 bathrooms");
  if (must.length) c.mustHaves = must;
  const breakers: string[] = [];
  if (/\bno brokers?\b|without (a )?broker|no brokerage/.test(t)) breakers.push("brokers");
  if (/\bno ground floor\b/.test(t)) breakers.push("ground floor");
  if (breakers.length) c.dealBreakers = breakers;
  const locs = localities.filter((l) => new RegExp(`\\b(near|in|around)\\s+${l.name.toLowerCase().split(" ")[0]}`).test(t) && !ANCHOR_ALIASES.some(([re]) => re.test(l.name)));
  if (locs.length && c.mode === "buy") c.localities = locs.map((l) => l.id);
  if (/\bflatmate|roommate\b/.test(t)) c.people = [{ name: "Flatmate", role: "votes" }];
  if (/\b(wife|husband|partner)\b/.test(t)) c.people = [...(c.people ?? []), { name: "Partner", role: "votes" }];
  if (/\bparents|mum|mom|dad\b/.test(t)) c.people = [...(c.people ?? []), { name: "Parents", role: "views" }];
  return c;
}

export const knownAnchors = anchors.map((a) => a.name);
