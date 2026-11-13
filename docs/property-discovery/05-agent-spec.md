# 05 · Agent architecture, IA and flows

Phase 5 of [PLAN.md](PLAN.md). Status: **complete** (13 Nov 2026). This spec is the contract for the
mockups (Phase 8) and the prototype (Phase 9). Where it says "enforced in code", the prototype must
implement it on the server, not just in the interface.

---

## 1. How it works

```
Person ──message──▶ Chat interface ──request + session memory──▶ /api/agent
   ▲                    │                                            │
   │              renders each tool                         model chooses tools
   │              result as a view                                   │
   └──approval taps────┘◀──streamed tool calls, results, text──── typed tools ──▶ data
```

- **One request, one stream:** the request carries the conversation plus session memory (the living
  brief, the shortlist, pending tasks). The stream returns tool calls, tool results and text, in that
  order, so the right view renders with real data before the explanation arrives. This is the same
  pattern as MW-Inventory.
- **Approval:** approval taps create a short-lived approval token **in the interface**. The model can
  ask for approval but can never create one.

## 2. Tools

Nineteen typed tools. Levels follow the autonomy ladder in [03-define.md](03-define.md) §7:
0 inform, 1 prepare, 2 act with approval, 3 standing permission.

| # | Tool | Does | Returns | Level |
|---|---|---|---|---|
| 1 | `update_brief` | Adds, changes or removes brief items from the conversation | The updated brief, each item noting its origin ("you said", "I assumed") | 0 |
| 2 | `search_listings` | Searches rent or sale listings against the brief | Ranked listings, each with matches, misses and a one-line reason | 0 |
| 3 | `get_listing` | Fetches one listing | Full details and the photo set | 0 |
| 4 | `verify_listing` | Runs every check on a listing | A verification record: each check with result, source, date and "couldn't check" where relevant (see §3) | 0 |
| 5 | `estimate_move_in_cost` | Rent: works out what it takes to move in | Rent, deposit, maintenance, advance, brokerage (if a broker is involved), likely exit deductions, **total** | 0 |
| 6 | `estimate_purchase_cost` | Buy: works out the all-in cost and EMI | Price, stamp duty, registration, cess, GST (if under construction), corpus or maintenance deposit, **total**, EMI at a stated rate and date | 0 |
| 7 | `check_project_registration` | Buy: checks the project's registration | Status, registration number, link to the official record, date checked | 0 |
| 8 | `get_commute` | Commute from a listing to each anchor at the stated time | Minutes by mode at that hour, source | 0 |
| 9 | `get_neighbourhood` | Facts about the area | Water source, flood history, metro distance, everyday amenities, each with source. **Never a safety score** | 0 |
| 10 | `compare_listings` | Compares 2–4 listings | A comparison table aligned to the brief | 0 |
| 11 | `draft_owner_message` | Drafts questions to owners | Editable drafts, one per owner | 1 |
| 12 | `send_owner_message` | Sends approved drafts through a masked relay | Delivery status per owner | 2 (3 for standard questions if the person grants it) |
| 13 | `plan_visit_route` | Proposes the order and timing for visits on a day | A route with travel times and suggested slots | 1 |
| 14 | `schedule_visits` | Requests the approved slots from owners | Confirmed, declined or pending per visit | 2 |
| 15 | `share_shortlist` | Creates a share link for chosen people | Link, expiry and what they can see | 2 |
| 16 | `collect_votes` | Gathers co-deciders' votes and comments | Tally plus a summary of agreements and disagreements | 0 |
| 17 | `watch_search` | Watches for new matches and price drops | A digest schedule | 3 (set up by the person) |
| 18 | `summarise_visit_notes` | Turns notes and voice memos into structure, and recommends | Per-listing notes, then a recommendation with reasons and trade-offs | 0 |
| 19 | `report_listing` | Reports a listing (fake, taken, broker posing, scam ask) | Report reference | 2 (one-tap confirm) |

**Tools that don't exist, on purpose:** payment, signing, uploading ID documents, revealing a phone
number, and bulk export. The never list is partly enforced by their absence.

## 3. The verification record (`verify_listing`)

| Check | Rent | Buy | Shown as |
|---|---|---|---|
| Owner or builder identity confirmed | ✓ | ✓ | "Owner confirmed by phone · 3 days ago" or "Not confirmed yet" |
| Listing freshness | ✓ | ✓ | "Listed 3 days ago · availability confirmed yesterday" |
| Photo age and duplicates | ✓ | ✓ | "Photos taken 2026" / "These photos appear on 2 other listings" |
| Price against nearby listings | ✓ | ✓ | "Rent is in the usual range for 2BHKs here" / "Deposit is higher than nearby" |
| Scam signals | ✓ | ✓ | "Asked for a payment before a visit" (a warning, with what to do) |
| Broker or owner | ✓ | ✓ | "Listed by a broker; brokerage would be about one month's rent" |
| Project registration | — | ✓ | Status and number, with a link to the official record |
| Khata status | — | ✓ | "A-khata, e-khata issued" with source and date, or "Not confirmed" |
| Possession timeline | — | ✓ | Builder's date against the registered completion date |

Every check carries **source, date, and who or what checked it**. Anything not checked says so.

## 4. Guardrails (enforced in code)

| Rule | How it's enforced |
|---|---|
| **Never pays or signs** | No such tools. Text asking for a payment triggers a warning card |
| **Never shares ID or phone number without consent** | Owner messages go through a masked relay; no tool accepts ID documents; revealing a number is a separate action the person takes, not the agent |
| **Never filters by religion, caste, diet or marital status** | The brief has no fields for them. A fairness check runs on the person's requests *and* the agent's replies, as Zillow's AI mode does [C 56]. Listings can't state such tenant preferences |
| **Facts only from tools** | The model's instructions forbid stating listing or area facts without a tool result; replies show source chips; tested in Phase 10 |
| **Approval before acting** | Level 2 tools require a valid approval token created by a tap in the interface; the server rejects calls without one |
| **No safety scores** | `get_neighbourhood` returns facts with sources (water, floods, metro, amenities), never "safe" or "unsafe" |
| **Anti-harvesting** | A limit on owner messages per person per day; numbers always masked; no exports |

**The nuance in the fairness rule.** A person may protect themselves without the agent discriminating.
The agent can ask every owner the same neutral question ("Are there any restrictions on cooking,
pets or guests?") and report the answers. It won't filter or rank homes by an owner's preference for a
tenant's religion, caste, diet or marital status, and it won't help find landlords of a particular group.

**How the agent refuses.** It names the rule, gives the reason in one line, and offers what it *can*
do. Example: "I can't filter by religion: it's a rule I keep to avoid discrimination. I can ask every
owner the same questions about house rules, if that helps."

## 5. Memory: the living brief

| Item | Example | Notes |
|---|---|---|
| Mode | Rent · Buy · Both | |
| Anchors | Office in Bellandur, 9 am, by car; flatmate in Koramangala | Commute is measured to each |
| Budget | Rent ₹45k a month; move-in cost under ₹3 lakh · or price ₹1.4 Cr with a ₹30 lakh down payment | Move-in and purchase caps are separate |
| Size and type | 2BHK, apartment | |
| Must-haves | Pets allowed, two bathrooms | Ranked first |
| Nice-to-haves | Balcony, gym | |
| Deal-breakers | Ground floor, more than 45 minutes' commute | Exclude, with the reason shown |
| Timeline | Move by 15 Dec | |
| People | Flatmate (votes), parents (view only) | Used by `share_shortlist` |
| Standard questions | Pets? Deposit negotiable? | For level-3 permission |

- **Visible:** shown as chips, each tagged with its origin ("you said · 2 min ago", "I assumed").
- **Editable:** tap a chip to change or remove it; the conversation updates to match.
- **Forgettable:** "forget my brief" clears it. The prototype keeps it in the browser session only.
- **Sent with every request** as session memory, so "ask these owners" always means *these*.

## 6. Conversation design

- **Questions before results:** at most two, offered as tap answers, before the first shortlist.
  Otherwise the agent assumes sensible defaults and shows them as editable "I assumed" chips.
- **Answer shape:** one sentence, then the view, then up to three next actions.
- **Unknowns said plainly:** "I couldn't confirm the owner yet. I've asked."
- **Sources:** every fact in text carries a source chip; views show sources per row.
- **Languages:** English in v1; Hindi and Kannada are "should" items.
- **Voice:** see [03-define.md](03-define.md) §6.

## 7. Background tasks

| State | Shown as | Example |
|---|---|---|
| Queued | Grey task card | "Ask 3 owners · waiting to send" |
| Running | Card with progress | "Asking 3 owners · 1 of 3 replied" |
| Needs you | Highlighted card plus a notification | "2 replies in · 1 owner asked for your move-in date" |
| Done | Card collapses into the activity log | "Asked 3 owners · 2 replied, 1 didn't" |
| Stopped | By the person at any time | "You stopped this task" |

Each task can be opened to see every step with timestamps, and stopped. Stopping a send that hasn't
happened yet cancels it; sent messages can't be unsent, and the interface says so before approval.

## 8. Flows, including failure paths

| Flow | Happy path | Failure paths |
|---|---|---|
| **F1 Brief to shortlist** | Message → up to 2 questions → shortlist of 5–8 with reasons | No matches → the agent names the constraint to relax ("2 more if the commute is 50 min") · Too vague → asks one question |
| **F2 Judge a listing** | Open → verification record → move-in or purchase cost → commute and area | Can't verify → says what's missing and offers to ask · Listing taken → removed with the reason, and an alternative offered |
| **F3 Ask owners** | Draft → edit → approve → replies collected → shortlist updated | Owner silent 48 h → offers alternatives · Answer rules a home out → drops it with the reason · Daily message limit → explains, queues for tomorrow |
| **F4 Plan visits** | Choose day → route and slots → approve → confirmations | Owner declines a slot → proposes another · Owner no-show reported → marked on the listing, and future visits with that owner need a confirmation 2 h before |
| **F5 Decide together** | Share link → co-deciders vote → summary of agreement and disagreement → finalist | Nobody votes in 48 h → reminder option · Tie → the agent lists the trade-off, not a winner |
| **F6 Buy checks** | Registration → khata → purchase cost and EMI → possession | Not registered or not found → warning with a link to check · Khata unknown → "Ask the builder for the e-khata" draft |
| **F7 Watch** | Set up from the brief → digest → open new matches | Nothing new → a quiet digest, or none if the person prefers |
| **F8 Scam warning** | Anyone asks for money before a visit → warning card, report option | Person proceeds anyway → the agent never pays, and logs the warning |

**Errors from the system** (a tool or model failure): the request retries once, keeps all state,
says what failed in one line, and offers to try again. Nothing is lost from the board.

## 9. Information architecture

**Places:**
- **Agent:** the conversation.
- **Board:** shortlist, tasks, visits, decisions.
- **Activity:** everything the agent did.
- **You:** the brief, permissions, people, data.

| Size | Navigation | Layout |
|---|---|---|
| Phone 390 | Bottom bar: Agent · Board · Activity · You | The Agent screen is home; the board is one tap away and shows a task badge |
| Tablet 834 | Icon rail with labels | Agent full width; the board opens as a side sheet |
| Tablet landscape 1194 | Icon rail | Agent and board side by side |
| Desktop 1440 | Sidebar with labels | Agent (centre) and board (right); listing detail opens over the board |

**Sitemap:**
- **Agent:** shortlist answer · listing detail (verification record, true cost, commute and area,
  gallery, map) · compare · approval sheets
- **Board:** shortlist · tasks · visits (planner, visit-day notes) · decide (shared shortlist, votes,
  recommendation) · next steps
- **Activity:** log · task detail
- **You:** brief · agent permissions · people · alerts · data and privacy · report history
- **Shared link** (co-deciders, no account): finalists · vote and comment

**Card sort (planned, and interactive in the case study):** 24 cards (for example "Verification
record", "Ask owners", "Standard questions", "Votes", "Alerts", "Agent permissions") sorted into the
four places. Run with people later; visitors can try it on the case-study page, as on HealthAI.

## 10. Service blueprint

| Stage | Searcher | Agent | Owner or builder | Verification team | Systems |
|---|---|---|---|---|---|
| Brief | Describes needs | Builds the brief, asks up to 2 questions | — | — | Session memory |
| Shortlist | Reviews reasons | Searches, ranks, explains | — | — | Listings index, commute service |
| Check | Opens the record | Runs checks, flags gaps | — | Confirms identity, availability, photos | Registration portal, khata records, price data |
| Ask | Edits and approves | Drafts, sends, collects | Replies through the relay | — | Masked relay, rate limits |
| Visit | Approves the plan | Plans the route, books slots | Confirms slots | — | Calendar, reminders |
| Decide | Shares, votes | Summarises votes | — | — | Share links |
| Commit | Follows the checklist | Warns about advance payments; never pays | Agreement or booking | — | Report pipeline |

Line of visibility: the searcher sees the first three lanes; verification and systems appear only as
receipts (source, date, who).

## 11. Task flows: steps today versus with the agent

These are design estimates for comparison, not measurements.

| Task | Today, on a portal (from the heuristic review) | With the agent |
|---|---|---|
| Ask 3 owners whether pets are allowed | Open 3 listings → reveal 3 numbers (often paid) → 3 calls or chats → note the answers: about **10 steps** | Ask → edit (optional) → approve: **2–3 steps**; answers land on the board |
| Know the move-in cost of a listing | Card, then a "charges" link, then the detail page, then add it up yourself: about **4 steps**, and brokerage is often missing | Open the listing: **1 step**, total first |
| Plan a Saturday of 3 visits | 3 calls to agree times, then work out a route: about **8 steps** | Choose the day → approve: **2 steps** |

---

**Gate:** every core task has a flow, including its failure path ✅ (§8). Approved under the blanket
approval of 13 Nov 2026.
