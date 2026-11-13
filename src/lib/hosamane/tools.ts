/**
 * The agent's 19 typed tools (spec: docs/property-discovery/05-agent-spec.md §2 in the portfolio repo).
 * Pure functions over the fictional dataset. Every fact the agent states comes from one of these.
 * Tools that pay, sign, take ID documents, reveal phone numbers or export in bulk don't exist.
 */
import { anchorById, inr, inrShort, listingById, listings, localityById } from "./data";
import { verifyApproval } from "./approval";
import type { Brief, Check, Listing, Memory, OwnerReply, Task } from "./types";

const RERA_PORTAL = "https://rera.karnataka.gov.in/viewAllProjects";
const COMMUTE_SOURCE = "Prototype estimate: road distance at ~16.7 km/h peak speed (Bengaluru Traffic Police and TomTom 2025 figures)";
export const LOAN_RATE = 8.5; // % p.a., illustrative, within SBI's 7.50–8.80% range from 15 Oct 2026
export const RATE_CHECKED = "13 Nov 2026";

/* ── 1 · update_brief ───────────────────────────────────────────── */
export function update_brief(brief: Brief, changes: Partial<Brief>, origin: "you" | "assumed"): Brief {
  const next: Brief = { ...brief, origins: { ...brief.origins } };
  for (const [k, v] of Object.entries(changes) as [keyof Brief, never][]) {
    if (k === "origins" || v === undefined) continue;
    if (Array.isArray(v) && (v as unknown[]).length === 0) (next as unknown as Record<string, unknown>)[k] = [];
    else if (Array.isArray(v)) {
      const merged = Array.from(new Set([...(next[k] as unknown[]), ...(v as unknown[])].map((x) => JSON.stringify(x)))).map((x) => JSON.parse(x));
      (next as unknown as Record<string, unknown>)[k] = merged;
    } else (next as unknown as Record<string, unknown>)[k] = v;
    next.origins[k] = origin;
  }
  return next;
}

/* ── 8 · get_commute ────────────────────────────────────────────── */
export function get_commute(listingId: string, anchorId: string, time = "9 am") {
  const l = listingById(listingId)!;
  const loc = localityById(l.localityId);
  const a = anchorById(anchorId)!;
  const roadKm = Math.hypot(loc.x - a.x, loc.y - a.y) * 1.3;
  const car = Math.round(roadKm * 3.6 + 4);
  const bus = Math.round(car * 1.45 + 10);
  return { listingId, anchor: a.name, time, roadKm: Math.round(roadKm * 10) / 10, carMin: car, busWalkMin: bus, source: COMMUTE_SOURCE };
}

/* ── helpers for ranking and checks ─────────────────────────────── */
const median = (xs: number[]) => { const s = [...xs].sort((a, b) => a - b); return s.length ? s[Math.floor(s.length / 2)] : 0; };
function nearbyRentMedian(l: Listing) {
  return median(listings.filter((x) => x.mode === "rent" && x.localityId === l.localityId && x.bhk === l.bhk && x.id !== l.id).map((x) => x.rent!));
}
function photoDuplicates(l: Listing) {
  const ids = new Set(l.photos.map((p) => p.id));
  return listings.filter((x) => x.id !== l.id && x.photos.some((p) => ids.has(p.id))).map((x) => x.id);
}

/* ── 4 · verify_listing ─────────────────────────────────────────── */
export function verify_listing(id: string): { listingId: string; checks: Check[]; summary: { pass: number; todo: number; warn: number } } {
  const l = listingById(id)!;
  const checks: Check[] = [];
  const who = l.mode === "buy" ? "Builder" : "Owner";
  checks.push(l.ownerConfirmed
    ? { key: "identity", label: `${who} confirmed`, state: "pass", detail: `by ${l.ownerConfirmed.method}, ${l.ownerConfirmed.daysAgo} day${l.ownerConfirmed.daysAgo === 1 ? "" : "s"} ago`, source: "Hosamane verification team (simulated)" }
    : { key: "identity", label: `${who} not confirmed yet`, state: "todo", detail: "I can ask before you visit.", source: "Hosamane verification team (simulated)" });
  checks.push(l.status === "taken"
    ? { key: "fresh", label: "No longer available", state: "warn", detail: "Marked taken by the lister.", source: "Lister update" }
    : { key: "fresh", label: l.availabilityConfirmedDaysAgo !== null ? "Availability confirmed" : "Availability not confirmed", state: l.availabilityConfirmedDaysAgo !== null ? "pass" : "todo", detail: `Listed ${l.listedDaysAgo} day${l.listedDaysAgo === 1 ? "" : "s"} ago${l.availabilityConfirmedDaysAgo !== null ? ` · confirmed ${l.availabilityConfirmedDaysAgo === 0 ? "today" : `${l.availabilityConfirmedDaysAgo} day${l.availabilityConfirmedDaysAgo === 1 ? "" : "s"} ago`}` : ""}`, source: "Listing record" });
  const oldest = Math.min(...l.photos.map((p) => p.year));
  const dups = photoDuplicates(l);
  if (dups.length) checks.push({ key: "photos", label: `These photos appear on ${dups.length} other listing${dups.length === 1 ? "" : "s"}`, state: "warn", detail: "Ask the lister for a recent photo before visiting.", source: "Photo fingerprint check" });
  else if (oldest <= 2022) checks.push({ key: "photos", label: "Photos may be old", state: "warn", detail: `Some photos were taken in ${oldest}.`, source: "Photo metadata" });
  else checks.push({ key: "photos", label: "Photos are recent", state: "pass", detail: `Taken ${oldest}–${Math.max(...l.photos.map((p) => p.year))}; no duplicates found.`, source: "Photo metadata and fingerprint check" });
  if (l.mode === "rent") {
    const med = nearbyRentMedian(l);
    const diff = med ? (l.rent! - med) / med : 0;
    checks.push({ key: "price", label: Math.abs(diff) <= 0.15 ? "Rent is in the usual range" : diff > 0 ? "Rent is higher than nearby" : "Rent is lower than nearby", state: diff > 0.15 ? "warn" : "pass", detail: med ? `Similar ${l.bhk}BHKs here: around ${inr(med)}/month.` : "Not enough nearby listings to compare.", source: "Hosamane listings in this locality" });
    const depMed = median(listings.filter((x) => x.mode === "rent" && x.localityId === l.localityId).map((x) => x.depositMonths!));
    checks.push({ key: "deposit", label: l.depositMonths! > depMed + 1 ? "Deposit is higher than nearby" : "Deposit is typical here", state: l.depositMonths! > depMed + 1 ? "warn" : "pass", detail: `${l.depositMonths} months' rent; nearby listings ask about ${depMed}. Karnataka law doesn't cap deposits.`, source: "Hosamane listings; Karnataka Rent Act 1999" });
    checks.push({ key: "lister", label: l.lister === "broker" ? "Listed by a broker" : "Listed by the owner", state: l.lister === "broker" ? "todo" : "pass", detail: l.lister === "broker" ? "Brokerage would be about one month's rent." : "No brokerage.", source: "Listing record" });
  } else {
    checks.push(l.registration!.status === "registered"
      ? { key: "rera", label: "Project registered", state: "pass", detail: `Karnataka RERA · ${l.registration!.number} · checked ${l.registration!.checkedDaysAgo} day${l.registration!.checkedDaysAgo === 1 ? "" : "s"} ago`, source: RERA_PORTAL }
      : { key: "rera", label: "Registration not found", state: "warn", detail: "I couldn't find this project on the Karnataka RERA portal. Don't pay a booking amount until the builder shows the registration.", source: RERA_PORTAL });
    const kh = l.khata ?? "";
    checks.push({ key: "khata", label: kh.startsWith("B-khata") ? "B-khata property" : kh.includes("issued") ? "A-khata, e-khata issued" : "Khata not confirmed", state: kh.startsWith("B-khata") ? "warn" : kh.includes("issued") ? "pass" : "todo", detail: kh.startsWith("B-khata") ? "B-khata can limit home loans and resale; e-khata doesn't regularise it." : kh.includes("issued") ? "Needed for sale and mortgage since Oct 2024." : "Ask the builder for the e-khata.", source: "Builder documents (simulated); BBMP e-khata rules" });
    checks.push({ key: "possession", label: l.readiness === "ready" ? "Ready to move" : `Possession ${l.possession}`, state: (l.builderAvgDelayMonths ?? 0) > 6 && l.readiness !== "ready" ? "warn" : "pass", detail: `${l.builder} has delivered ${l.builderDelivered} projects, on average ${l.builderAvgDelayMonths} months late.`, source: "Builder record (simulated)" });
  }
  if (l.scamAsk) checks.push({ key: "scam", label: "Asked for a payment before a visit", state: "warn", detail: "Don't pay anything before seeing the home. I never pay on your behalf.", source: "Messages on this listing" });
  const summary = { pass: checks.filter((c) => c.state === "pass").length, todo: checks.filter((c) => c.state === "todo").length, warn: checks.filter((c) => c.state === "warn").length };
  return { listingId: id, checks, summary };
}

/* ── 2 · search_listings ────────────────────────────────────────── */
export function search_listings(brief: Brief, limit = 6, withRelaxations = true): { mode: "rent" | "buy"; considered: number; matched: number; excluded: Record<string, number>; results: { id: string; score: number; matches: number; of: number; misses: string[]; flags: string[]; toAsk: string[]; commuteMin: number | null }[]; relaxations: { why: string; label: string; matched: number; value: number | null }[] } {
  const mode = brief.mode ?? "rent";
  const pool = listings.filter((l) => l.mode === mode);
  const considered = pool.length;
  const excluded: Record<string, number> = {};
  const ex = (why: string) => { excluded[why] = (excluded[why] || 0) + 1; return false; };
  const results = pool.filter((l) => {
    if (l.status === "taken") return ex("already taken");
    if (brief.bhk && l.bhk !== brief.bhk) return ex("size");
    const cost = mode === "rent" ? l.rent! : l.price!;
    if (brief.budget && cost > brief.budget) return ex("over budget");
    if (brief.dealBreakers.includes("brokers") && l.lister === "broker") return ex("broker listing");
    if (brief.dealBreakers.includes("ground floor") && l.floor === 0) return ex("ground floor");
    if (brief.localities.length && !brief.localities.includes(l.localityId)) return ex("outside your areas");
    if (brief.readiness && brief.readiness !== "any" && mode === "buy" && l.readiness !== brief.readiness) return ex("readiness");
    if (brief.anchorId && brief.maxCommuteMin && get_commute(l.id, brief.anchorId).carMin > brief.maxCommuteMin) return ex("commute too long");
    return true;
  }).map((l) => {
    const criteria: { label: string; met: boolean }[] = [];
    const cost = mode === "rent" ? l.rent! : l.price!;
    if (brief.budget) criteria.push({ label: "within budget", met: cost <= brief.budget });
    if (brief.bhk) criteria.push({ label: `${brief.bhk}BHK`, met: l.bhk === brief.bhk });
    if (brief.anchorId) { const c = get_commute(l.id, brief.anchorId); criteria.push({ label: `${c.carMin} min commute`, met: !brief.maxCommuteMin || c.carMin <= brief.maxCommuteMin }); }
    if (brief.furnishing && brief.furnishing !== "any") criteria.push({ label: brief.furnishing === "semi" ? "semi-furnished" : brief.furnishing, met: l.furnishing === brief.furnishing || (brief.furnishing === "semi" && l.furnishing === "furnished") });
    for (const m of brief.mustHaves) {
      if (m === "balcony") criteria.push({ label: "balcony", met: l.balconies > 0 });
      if (m === "parking") criteria.push({ label: "parking", met: l.amenities.includes("Covered parking") });
      if (m === "2 bathrooms") criteria.push({ label: "2 bathrooms", met: l.bathrooms >= 2 });
      if (m === "gym") criteria.push({ label: "gym", met: l.amenities.includes("Gym") });
    }
    if (brief.dealBreakers.includes("brokers")) criteria.push({ label: "owner listing", met: l.lister !== "broker" });
    const v = verify_listing(l.id);
    const commute = brief.anchorId ? get_commute(l.id, brief.anchorId).carMin : 30;
    const score = criteria.filter((c) => c.met).length * 10 - v.summary.warn * 6 + v.summary.pass * 2 - commute / 5 - (brief.budget ? cost / brief.budget : 0) * 3;
    const flags = v.checks.filter((c) => c.state === "warn").map((c) => c.label);
    const toAsk = brief.mustHaves.includes("pets") ? ["pets allowed?"] : [];
    return { id: l.id, score, matches: criteria.filter((c) => c.met).length, of: criteria.length, misses: criteria.filter((c) => !c.met).map((c) => c.label), flags, toAsk, commuteMin: brief.anchorId ? commute : null };
  }).sort((a, b) => b.score - a.score);
  // When nothing fits, find the single changes that would help, so the agent can offer them.
  const relaxations: { why: string; label: string; matched: number; value: number | null }[] = [];
  if (!results.length && withRelaxations) {
    const b = brief;
    const tries: [boolean, string, Partial<Brief>, string, number | null][] = [
      [!!b.readiness && b.readiness !== "any" && mode === "buy", "under construction is OK", { readiness: "any" }, "Include under-construction homes", null],
      [!!b.maxCommuteMin, `the commute can be ${(b.maxCommuteMin ?? 0) + 10} min`, { maxCommuteMin: (b.maxCommuteMin ?? 0) + 10 }, `Allow a ${(b.maxCommuteMin ?? 0) + 10} min commute`, (b.maxCommuteMin ?? 0) + 10],
      [b.localities.length > 0, "nearby areas are OK", { localities: [] }, "Include nearby areas", null],
      [!!b.bhk, `you'd consider a ${b.bhk === 3 ? 2 : 3}BHK`, { bhk: null }, `Show ${b.bhk === 3 ? 2 : 3}BHKs too`, b.bhk === 3 ? 2 : 3],
      [!!b.budget, `the budget can stretch to ${b.budget ? inrShort(Math.round(b.budget * 1.15)) : ""}`, { budget: b.budget ? Math.round(b.budget * 1.15) : null }, "Stretch the budget by 15%", b.budget ? Math.round(b.budget * 1.15) : null],
    ];
    for (const [applies, why, change, label, value] of tries) {
      if (!applies) continue;
      const n = search_listings({ ...b, ...change }, limit, false).matched;
      if (n > 0) relaxations.push({ why, label, matched: n, value });
      if (relaxations.length === 2) break;
    }
  }
  return { mode, considered, matched: results.length, excluded, results: results.slice(0, limit), relaxations };
}

/* ── 3 · get_listing ────────────────────────────────────────────── */
export function get_listing(id: string) {
  const l = listingById(id)!;
  const loc = localityById(l.localityId);
  const { ownerAnswers, replyDelayMin, visitSlots, scamAsk, ...shown } = l;
  void ownerAnswers; void replyDelayMin; void visitSlots; void scamAsk;
  return { ...shown, locality: loc.name };
}

/* ── 5 · estimate_move_in_cost (rent) ───────────────────────────── */
export function estimate_move_in_cost(id: string) {
  const l = listingById(id)!;
  const rent = l.rent!, deposit = rent * l.depositMonths!, maintenance = l.maintenance!, brokerage = rent * (l.brokerageMonths ?? 0);
  const items = [
    { label: "First month's rent", amount: rent },
    { label: `Deposit (${l.depositMonths} months)`, amount: deposit },
    { label: "Maintenance (first month)", amount: maintenance },
    { label: brokerage ? "Brokerage (about 1 month)" : "Brokerage", amount: brokerage, note: brokerage ? undefined : "none, owner listing" },
  ];
  return { listingId: id, total: rent + deposit + maintenance + brokerage, items, monthly: rent + maintenance, exitNote: "Landlords increasingly deduct about one month's rent from the deposit as painting charges at exit; agree this in writing.", source: "Listing record; deduction practice per Bengaluru reporting (market research 4.2)" };
}

/* ── 6 · estimate_purchase_cost (buy) ───────────────────────────── */
export function estimate_purchase_cost(id: string, downPayment?: number | null) {
  const l = listingById(id)!;
  const price = l.price!;
  const stamp = Math.round(price * 0.056); // 5% stamp duty + ~0.6% cess and surcharge, for > ₹45 lakh
  const registration = Math.round(price * 0.02); // doubled to 2% from 31 Aug 2025
  const gst = l.readiness === "under construction" ? Math.round(price * 0.05) : 0;
  const corpus = (l.corpusPerSqft ?? 0) * l.sqft;
  const total = price + stamp + registration + gst + corpus;
  const down = downPayment ?? Math.round(price * 0.2);
  const loan = Math.max(0, price - down);
  const r = LOAN_RATE / 1200, n = 240, f = Math.pow(1 + r, n);
  const emi = Math.round((loan * r * f) / (f - 1));
  return {
    listingId: id, total, price,
    items: [
      { label: "Price", amount: price },
      { label: "Stamp duty and cess (about 5.6%)", amount: stamp },
      { label: "Registration (2%)", amount: registration },
      { label: gst ? "GST (5%, under construction)" : "GST", amount: gst, note: gst ? undefined : "none, ready home" },
      { label: "Corpus and maintenance deposit", amount: corpus },
    ],
    loan: { downPayment: down, amount: loan, ratePct: LOAN_RATE, years: 20, emi, rateChecked: RATE_CHECKED },
    source: "Karnataka stamp duty 5% and registration 2% (from 31 Aug 2025); GST 5% on under-construction homes; rate illustrative within SBI's 7.50–8.80% (market research 5.1–5.2, 6.1, 9.3)",
  };
}

/* ── 7 · check_project_registration (buy) ───────────────────────── */
export function check_project_registration(id: string) {
  const l = listingById(id)!;
  return { listingId: id, project: l.title.replace(/^\dBHK in /, ""), builder: l.builder, ...l.registration!, officialRecord: RERA_PORTAL };
}

/* ── 9 · get_neighbourhood ──────────────────────────────────────── */
export function get_neighbourhood(id: string) {
  const loc = localityById(listingById(id)!.localityId);
  return {
    listingId: id, locality: loc.name,
    facts: [
      { label: "Water", value: loc.water, source: "Society and BWSSB connection records (simulated)" },
      { label: "Flooding", value: loc.flood ?? "None recorded in our data since 2022", source: "News archive and BBMP flood-prone list (simulated)" },
      { label: "Metro", value: `${loc.metroKm} km to the nearest station`, source: "Namma Metro station list (simulated)" },
    ],
    note: "I don't rate areas as safe or unsafe.",
  };
}

/* ── 10 · compare_listings ──────────────────────────────────────── */
export function compare_listings(ids: string[], brief: Brief, memory?: Memory) {
  const replies = (memory?.tasks ?? []).flatMap((t) => t.replies ?? []);
  return {
    columns: ids.map((id) => {
      const l = listingById(id)!;
      const v = verify_listing(id);
      const cost = l.mode === "rent" ? estimate_move_in_cost(id).total : estimate_purchase_cost(id, brief.downPayment).total;
      const reply = replies.find((r) => r.listingId === id);
      return {
        id, title: l.title, locality: localityById(l.localityId).name,
        price: l.mode === "rent" ? `${inr(l.rent!)}/month` : inr(l.price!),
        upfront: inr(cost),
        commute: brief.anchorId ? `${get_commute(id, brief.anchorId).carMin} min` : "—",
        size: `${l.sqft} sq ft · ${l.bhk}BHK`,
        floor: l.floor === 0 ? "Ground" : `${l.floor} of ${l.floorsTotal}`,
        checks: `${v.summary.pass} passed · ${v.summary.warn} flagged · ${v.summary.todo} to do`,
        pets: reply?.answers.find((a) => a.question.includes("pets"))?.answer ?? "not asked",
      };
    }),
  };
}

/* ── 11 · draft_owner_message ───────────────────────────────────── */
export function draft_owner_message(ids: string[], questions: string[]) {
  const qs = questions.length ? questions : ["Is the home still available?"];
  return {
    drafts: ids.map((id) => {
      const l = listingById(id)!;
      return { listingId: id, to: l.lister === "broker" ? "the broker" : l.mode === "buy" ? l.builder : l.listerName, text: `Hi, I'm interested in your ${l.bhk}BHK in ${localityById(l.localityId).name}. ${qs.map((q, i) => `${i + 1}) ${q}`).join(" ")} Thanks.` };
    }),
    questions: qs,
    via: "masked relay: your name and number aren't shared",
  };
}

/* ── 12 · send_owner_message [approval] ─────────────────────────── */
export const DAILY_LIMIT = 20;
export function send_owner_message(token: string | undefined, memory: Memory): { ok: false; reason: string } | { ok: true; task: Task } {
  const v = verifyApproval(token, "send_owner_message");
  if (!v.ok) return v;
  const { ids, questions } = v.payload as { ids: string[]; questions: string[] };
  if (memory.asked + ids.length > DAILY_LIMIT) return { ok: false, reason: `That would pass today's limit of ${DAILY_LIMIT} owner messages. I'll queue the rest for tomorrow.` };
  const replies: OwnerReply[] = ids.map((id) => {
    const l = listingById(id)!;
    return {
      listingId: id, owner: l.lister === "broker" ? "Broker" : l.mode === "buy" ? (l.builder ?? "Builder") : l.listerName,
      replyInMin: l.status === "taken" ? 1 : l.replyDelayMin,
      answers: l.status === "taken"
        ? [{ question: "available", answer: "Sorry, it's been rented." }]
        : questions.map((q) => ({ question: q, answer: /pet/i.test(q) ? l.ownerAnswers.pets : /deposit/i.test(q) ? l.ownerAnswers.depositNegotiable : /rule/i.test(q) ? l.ownerAnswers.houseRules : "Yes, it's available." })),
    };
  });
  return { ok: true, task: { id: `task-${Date.now().toString(36)}`, kind: "ask", title: `Ask ${ids.length} owner${ids.length === 1 ? "" : "s"}`, createdAt: Date.now(), listingIds: ids, replies } };
}

/* ── 13 · plan_visit_route ──────────────────────────────────────── */
export function plan_visit_route(ids: string[], day = "Sat") {
  const toMin = (slot: string) => { const [h, m] = slot.split(" ")[1].split(":").map(Number); return h * 60 + m; };
  const fmt = (min: number) => `${day} ${String(Math.floor(min / 60)).padStart(2, "0")}:${String(min % 60).padStart(2, "0")}`;
  const stops = ids.map((id) => listingById(id)!).filter((l) => l.visitSlots.some((s) => s.startsWith(day)));
  // Visit in order of each home's earliest slot, then take the first slot that's reachable in time.
  const ordered = [...stops].sort((a, b) => Math.min(...a.visitSlots.filter((s) => s.startsWith(day)).map(toMin)) - Math.min(...b.visitSlots.filter((s) => s.startsWith(day)).map(toMin)));
  const legs: { listingId: string; slot: string; travelFromPrevMin: number }[] = [];
  let free = 0, prevLoc: ReturnType<typeof localityById> | null = null, first = 0;
  for (const l of ordered) {
    const loc = localityById(l.localityId);
    const travel = prevLoc ? Math.round(Math.hypot(loc.x - prevLoc.x, loc.y - prevLoc.y) * 1.3 * 3.0 + 6) : 0;
    const slot = l.visitSlots.filter((s) => s.startsWith(day)).map(toMin).sort((a, b) => a - b).find((m) => m >= free + travel);
    if (slot === undefined) continue;
    if (!legs.length) first = slot;
    legs.push({ listingId: l.id, slot: fmt(slot), travelFromPrevMin: travel });
    free = slot + 30; prevLoc = loc;
  }
  const skipped = ids.filter((id) => !legs.find((x) => x.listingId === id));
  const hhmm = (m: number) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
  return { day: day === "Sat" ? "Saturday" : "Sunday", legs, totalMin: legs.length ? free - first : 0, start: legs.length ? hhmm(first) : null, end: legs.length ? hhmm(free) : null, skipped, note: skipped.length ? "Some owners have no slot that fits the route that day." : undefined };
}

/* ── 14 · schedule_visits [approval] ────────────────────────────── */
export function schedule_visits(token: string | undefined): { ok: false; reason: string } | { ok: true; task: Task } {
  const v = verifyApproval(token, "schedule_visits");
  if (!v.ok) return v;
  const { legs } = v.payload as { legs: { listingId: string; slot: string }[] };
  const visits = legs.map((leg, i) => {
    const l = listingById(leg.listingId)!;
    const later = l.visitSlots.filter((s) => s.split(" ")[0] === leg.slot.split(" ")[0] && s.split(" ")[1] > leg.slot.split(" ")[1])[0];
    const declined = i === 1 && !!later; // the second owner offers a later time, to show the flow
    return declined ? { listingId: leg.listingId, slot: leg.slot, status: "declined" as const, alternative: later } : { listingId: leg.listingId, slot: leg.slot, status: "confirmed" as const };
  });
  return { ok: true, task: { id: `task-${Date.now().toString(36)}`, kind: "visits", title: `Visits on ${legs[0]?.slot.split(" ")[0] === "Sat" ? "Saturday" : "Sunday"}`, createdAt: Date.now(), listingIds: legs.map((l) => l.listingId), visits } };
}

/* ── 15 · share_shortlist [approval] ────────────────────────────── */
export function share_shortlist(token: string | undefined): { ok: false; reason: string } | { ok: true; token: string; people: { name: string; role: string }[]; ids: string[]; expiresDays: number } {
  const v = verifyApproval(token, "share_shortlist");
  if (!v.ok) return v;
  const { ids, people, from } = v.payload as { ids: string[]; people: { name: string; role: string }[]; from: string };
  const shareToken = Buffer.from(JSON.stringify({ ids, people, from })).toString("base64url");
  return { ok: true, token: shareToken, people, ids, expiresDays: 7 };
}

/* ── 16 · collect_votes ─────────────────────────────────────────── */
const votes = new Map<string, { voter: string; listingId: string; note?: string }[]>();
export function record_vote(shareToken: string, voter: string, listingId: string, note?: string) {
  const list = (votes.get(shareToken) ?? []).filter((v) => v.voter !== voter);
  list.push({ voter, listingId, note });
  votes.set(shareToken, list);
}
export function collect_votes(shareToken: string | null, self?: { voter: string; listingId: string }) {
  const list = [...(shareToken ? votes.get(shareToken) ?? [] : [])];
  if (self) list.push({ ...self });
  const tally: Record<string, string[]> = {};
  for (const v of list) (tally[v.listingId] ??= []).push(v.voter);
  const top = Object.entries(tally).sort((a, b) => b[1].length - a[1].length);
  return { votes: list, tally, agreed: top[0] && top[0][1].length > 1 ? top[0][0] : null };
}

/* ── 17 · watch_search ──────────────────────────────────────────── */
export function watch_search(brief: Brief, shortlist: string[]) {
  const fresh = search_listings(brief, 20).results.find((r) => !shortlist.includes(r.id));
  return { schedule: "Daily digest at 8 am", firstMatch: fresh ? { id: fresh.id, commuteMin: fresh.commuteMin } : null };
}

/* ── 18 · summarise_visit_notes ─────────────────────────────────── */
export function summarise_visit_notes(notes: string, ids: string[], brief: Brief, voteTally: Record<string, string[]> = {}) {
  const perListing = ids.map((id) => {
    const l = listingById(id)!;
    const name = localityById(l.localityId).name.toLowerCase();
    const sentence = notes.split(/[.;\n]/).filter((s) => s.toLowerCase().includes(name.split(" ")[0])).join(". ").trim();
    const pros = [/light|bright|sunny/i.test(sentence) && "good light", /quiet/i.test(sentence) && "quiet", /spacious|big/i.test(sentence) && "spacious", /water.*(ok|fine|good)/i.test(sentence) && "water supply fine"].filter(Boolean) as string[];
    const cons = [/noisy|noise|traffic/i.test(sentence) && "noise", /damp|leak|seepage/i.test(sentence) && "damp", /small|cramped/i.test(sentence) && "small rooms", /dark/i.test(sentence) && "little light"].filter(Boolean) as string[];
    const s = search_listings({ ...brief, maxCommuteMin: null }, 60).results.find((r) => r.id === id);
    const warns = verify_listing(id).checks.filter((c) => c.state === "warn").map((c) => c.label.toLowerCase());
    const score = (s ? s.matches - s.misses.length : 0) * 2 + pros.length - cons.length * 2 + (voteTally[id]?.length ?? 0) * 2 - warns.length * 3;
    return { listingId: id, note: sentence || "No notes for this one.", pros, cons, warns, matches: s ? `${s.matches} of ${s.of}` : "—", votes: voteTally[id]?.length ?? 0, voters: voteTally[id] ?? [], score };
  }).sort((a, b) => b.score - a.score);
  const best = perListing[0];
  const runner = perListing[1];
  const tradeOff = best && runner ? (() => { const a = listingById(best.listingId)!, b = listingById(runner.listingId)!; const d = (a.rent ?? a.price!) - (b.rent ?? b.price!); return d > 0 ? `${inr(d)} more ${a.mode === "rent" ? "a month" : "in price"} than the next option` : d < 0 ? `${inr(-d)} less ${a.mode === "rent" ? "a month" : "in price"} than the next option` : "same price as the next option"; })() : null;
  const otherVotes = perListing.filter((p) => p !== best && p.votes).map((p) => ({ listingId: p.listingId, voters: p.voters }));
  return { perListing, recommendation: best ? { listingId: best.listingId, why: [`meets ${best.matches} of your criteria`, ...(best.votes ? [`${best.votes} vote${best.votes === 1 ? "" : "s"}`] : []), ...best.pros], tradeOff, caveats: best.warns, otherVotes } : null };
}

/* ── 19 · report_listing [approval] ─────────────────────────────── */
export function report_listing(token: string | undefined) {
  const v = verifyApproval(token, "report_listing");
  if (!v.ok) return v;
  const { id, reason } = v.payload as { id: string; reason: string };
  return { ok: true as const, reference: `HM-RPT-${id.toUpperCase()}-${Date.now().toString(36).slice(-4).toUpperCase()}`, id, reason };
}

export const TOOL_NAMES = [
  "update_brief", "search_listings", "get_listing", "verify_listing", "estimate_move_in_cost", "estimate_purchase_cost",
  "check_project_registration", "get_commute", "get_neighbourhood", "compare_listings", "draft_owner_message",
  "send_owner_message", "plan_visit_route", "schedule_visits", "share_shortlist", "collect_votes", "watch_search",
  "summarise_visit_notes", "report_listing",
] as const;
