# Property discovery platform: project plan

An agentic-first platform for finding a home to rent or buy in Bengaluru, taken from research to
high-fidelity mockups and a working prototype, then published as a use case on the portfolio.

- **Working title:** to be decided in Phase 7 (checked against existing products and trademarks)
- **Owner:** Vivekanand Choudhari (sole designer and builder)
- **Started:** 13 Nov 2026
- **Status:** **Complete** (13 Nov 2026) · fast track, Claude Opus 5.5 planner with scripted fallback · prototype not yet deployed

---

## 1. Decisions (locked 13 Nov 2026)

| Decision | Choice | What it means |
|---|---|---|
| Approach | **Agentic-first** | The agent is the main way in; map and filters are a fallback, never the main path |
| City | **Bengaluru** | Real localities, fictional listings |
| Segment | **Rent and buy** | Both journeys share one agent and one brief; buying adds project, legal and loan checks |
| Platforms | **All: phone, tablet portrait, tablet landscape, desktop web** | Same four sizes as HealthAI: 390, 834, 1194 and 1440 px |
| Track | **Fast** | Desk research and review mining; no participant sessions. Personas and studies are labelled as assumptions or plans |
| Prototype | **Working live demo** | A real model calling typed tools over a fictional listings dataset, deployed with a public link |
| Agent limits | **The "never" list below, confirmed** | Built into the agent spec, the UI and the agent tests |

### The agent never

1. Pays or signs anything.
2. Shares your ID documents or phone number without your explicit consent.
3. Filters by religion, caste, diet or marital status.

---

## 2. The idea in one paragraph

You tell the agent what you need once. It builds a living brief, then does the legwork a good broker
would: it searches, ranks and explains matches; checks listings for staleness, duplicates and scam
patterns; works out the true cost; asks owners your questions; plans a day of visits; and helps your
family or flatmates decide together. Every answer arrives as something you can act on (listing cards,
a cost breakdown, a visit route), and every action taken on your behalf is visible, explained and
reversible. Brokers are today's "agent", so the research studies what people value in a good one and
fear in a bad one.

### What the agent does (hypothesis, tested in Phases 1 to 3)

| Job | Agent does | Asks first? |
|---|---|---|
| Understand needs | Builds a living brief: budget, commute anchors, must-haves, deal-breakers, who decides. Visible and editable | No |
| Search and rank | Ranks listings against the brief and explains what each matches and misses | No |
| Check listings | Freshness, duplicates, owner or builder verification, price against nearby listings, scam patterns, and for buying, project registration status | No |
| True cost | Rent: move-in cost (deposit, advance, maintenance, brokerage). Buy: all-in cost (registration, taxes, loan EMI) | No |
| Ask owners | Drafts your questions and sends them, with your number masked | Yes, before the first message |
| Plan visits | Books slots and builds a route for one day | Yes |
| Decide together | Shares the shortlist, collects votes, summarises disagreements | Yes, for who it's shared with |
| Keep watching | New matches, price drops, a daily digest | You set it up |
| After visits | Turns voice notes into a comparison and a recommendation with reasons | No |

### Autonomy ladder

| Level | The agent may | Example |
|---|---|---|
| 0. Inform | Answer, rank, explain, calculate | "These 6 match; 2 miss your balcony must-have" |
| 1. Prepare | Draft messages and plans for you to approve | A visit route for Saturday, waiting for your OK |
| 2. Act with approval | Send, book or share after you approve each time | Sends your questions to 4 owners |
| 3. Standing permission | Repeat an approved action until you revoke it | "Always ask owners about pets and parking" |
| Never | See the list above | — |

---

## 3. Honesty rules (they apply to every file in this project)

- **No invented research.** On the fast track there are no interviews or tests with people. Personas
  are proto-personas, built from desk research and review mining, and say so. Any card sort, tree test
  or usability study appears as a plan, not a result.
- **Real numbers only where they're measured:** review-mining counts, accessibility results, agent test
  results, screen counts and task step counts.
- **Every market claim has a source** (link and date checked) in `02-desk-research.md`. Stamp duty,
  registration fees, deposit norms and similar figures are checked, not remembered.
- **Fictional data, safely:** fictional listings, owners and people in real Bengaluru localities;
  phone numbers clearly fake or masked; no real addresses of private homes.
- **Licensing:** competitor screenshots stay in internal analysis and are never published; listing
  photos are properly licensed (for example Unsplash); maps are a custom illustration, not map tiles.
- **Original design:** competitors inform the analysis; the product, brand and UI are our own.

---

## 4. Phases

Each phase ends with a gate. The output files live in `docs/property-discovery/`.

### Phase 0: Frame (days 1–2)
- [x] Problem hypotheses:
  1. Listings can't be trusted (fake, stale, brokers posing as owners).
  2. The true cost is hidden (rent: deposit and move-in costs; buy: registration, taxes and loan).
  3. Filters can't express real needs (commute, quiet street, water supply, pets).
  4. Deciding is a group activity, but tools are built for one person.
  5. Arranging visits is a mess.
  6. People will hand legwork to an agent if they can see what it did.
  7. The broker is the mental model people bring to an agent.
- [x] Goals, non-goals and constraints.
- [x] Measures: time to a good shortlist; how often people delegate, approve and override; share of
  verified listings shown; visits per decision.
- [x] Kill criteria for the concept.
- **Output:** [`01-brief.md`](01-brief.md) · **Gate:** brief approved by Vivekanand. ☑ *(13 Nov 2026)*

### Phase 1: Desk research (days 3–7)
- [x] Bengaluru context, for renting and buying: how people search today, deposit and agreement
  norms, brokerage, project registration (RERA), purchase costs. Every claim sourced.
- [x] Competitive analysis of 5 Indian platforms and 3 global references: a feature matrix (search,
  filters, map, alerts, verification, cost transparency, AI features, group features, visit booking)
  and how each business model shapes the experience.
- [x] Audit of AI features in property search, in India and abroad.
- [x] Brokers as the existing "agent": what they do, what they charge, how they fail (public sources).
- [x] Heuristic evaluation of the top 3 competitors, with severity ratings.
- [x] Review mining: about 300 public app-store reviews plus forum threads, anonymised, coded into pain
  themes and ranked by frequency.
- **Output:** [`02-desk-research.md`](02-desk-research.md), [`competitors.md`](competitors.md), [`market-research.md`](market-research.md), [`review-mining.csv`](review-mining.csv), [`review-codebook.md`](review-codebook.md) ·
  **Gate:** each hypothesis has evidence or is dropped. ☑ *(verdicts in 02 §7; H8 added)*

### Phase 2: Primary research (skipped on the fast track)
- Replaced by the review mining in Phase 1.
- The interviews, survey, delegation sort and Wizard-of-Oz test are written up as a plan in
  `09-validation.md`, so the case study can show what would come next.

### Phase 3: Define (days 8–10)
- [x] Three proto-personas, labelled as such: someone relocating to rent, a first-time buyer, and a
  family member who shares in the decision. Plus one anti-persona.
- [x] Jobs to be done for renting and for buying.
- [x] A map of today's journey, built from the review evidence, with pain hotspots.
- [x] Psychology mapping: each finding mapped to a principle, a constraint and a decision (too many
  choices, fear of losing a deposit, fake social proof, anchoring on price, trust signals, how a visit
  ends).
- [x] Design principles, the agent's personality and voice, and the autonomy ladder.
- [x] MVP scope for rent and for buy, with must-haves separated from later.
- **Output:** [`03-define.md`](03-define.md) · **Gate:** scope fits the timeline. ☑

### Phase 4: Paradigm gate (day 11)
- [x] Score agentic, hybrid, traditional and zero-UI on 6 criteria drawn from the Phase 1 evidence (defined in
  04; the homepage process names the four paradigms, but no scoring criteria exist on the site), and record why agentic-first wins.
- [x] Hand-over points, where direct control beats the agent: browsing photos, exploring the map,
  side-by-side comparison.
- [x] Three concept sketches, then storyboard the chosen one.
- **Output:** [`04-paradigm-gate.md`](04-paradigm-gate.md) · **Gate:** concept chosen, with its rationale. ☑ *(agentic-first, "conversation in, board out")*

### Phase 5: Agent architecture, IA and flows (days 12–16)
- [x] Tool inventory, about 18 typed tools. Steps marked [approval] need the user's OK:
  1. Update the living brief.
  2. Search listings.
  3. Get a listing.
  4. Verify a listing.
  5. Estimate move-in cost (rent).
  6. Estimate purchase cost and EMI (buy).
  7. Check project registration (buy).
  8. Get commute times.
  9. Get neighbourhood information.
  10. Compare listings.
  11. Draft an owner message.
  12. Send an owner message [approval].
  13. Schedule visits [approval].
  14. Plan a visit route.
  15. Share the shortlist [approval].
  16. Collect votes.
  17. Watch a search.
  18. Summarise visit notes and recommend.
  19. Report a listing.
- [x] Memory model for the living brief: what the agent remembers, and how you see, edit and delete it.
- [x] Conversation design: when it asks clarifying questions, its tone, its languages (English first),
  and how it cites a source for each fact.
- [x] Flows for approvals, background tasks ("Asked 6 owners, 3 replied"), take-over, and failures
  (no results, listing taken, owner silent, can't verify, model error).
- [x] Information architecture and sitemap for the screens outside the chat (brief, shortlist,
  activity, settings), plus navigation for each screen size.
- [x] Service blueprint with lanes for the searcher, the agent, the owner or builder, the verification
  team and the systems.
- [x] Task flows with step counts.
- [x] A closed card sort visitors can try themselves (as on the HealthAI page), labelled as a plan.
- **Output:** [`05-agent-spec.md`](05-agent-spec.md) · **Gate:** every core task has a flow, including its failure path. ☑

### Phase 6: Wireframes and content (days 17–19)
- [x] Wireframes for the core screens on phone and desktop.
- [x] Agent states: working (showing each tool call), answer arriving as interactive views, approval
  sheet, background progress, activity log, brief editor, take over, errors.
- [x] Microcopy and the agent's voice; empty, error and loading states.
- **Output:** [`06-content.md`](06-content.md) and wireframe screens (rendered from the Phase 8 screens in a greyscale "wire" theme) · **Gate:** walkthrough approved.

### Phase 7: Identity and design system (days 20–22)
- [x] Working name (checked against existing products and trademarks), logo mark, moodboard, and
  2–3 style options.
- [x] Tokens: colour with measured contrast, type scale, spacing, corner radius, shadows, icons and map
  style.
- [x] Components: agent answer views, source chips ("From owner, 2 days ago"), confidence, approval
  card, task progress, activity entry, brief chips, listing card (rent and buy variants), verification
  badge, cost breakdown, commute panel, compare table, visit planner, map pins and clusters, list view
  as an alternative to the map.
- [x] Accessibility rules: WCAG 2.2 AA, 44 px targets, a list for every map, visible focus, reduced
  motion, text resize.
- **Output:** [`07-design-system.md`](07-design-system.md) · **Gate:** style chosen. ☑ *(Hosamane · calm ledger · Anek)*

### Phase 8: High-fidelity mockups (days 23–28) · *merged with Phase 9: screens are captures of the working prototype*
- [x] About 60 screens, built as coded HTML screens (axe-testable, clickable, importable into Figma):

| Group | Phone (27) | Tablet, tablet landscape, desktop (about 11 each) |
|---|---|---|
| Get started | Welcome · sign in · verify code · rent, buy or both | Sign in |
| Agent and brief | Agent home · brief conversation · living brief | Agent home · living brief |
| Discover | Ranked matches · map fallback · listing (rent) · listing (buy) · verification report · true cost (rent) · true cost (buy) · commute and neighbourhood · compare | Matches with map · listing detail · verification · true cost · compare |
| Act | Ask owner (approval) · owner replies · visit planner · visit day notes · shared shortlist · recommendation · next steps | Ask owner (approval) · visit planner · shared shortlist |
| Control | Activity log · watch and alerts · agent permissions · report a listing | Activity log and permissions |

  Plus key states: no results, owner silent, listing taken, can't verify, error.
- [x] Device composites for the hero and gallery.
- **Gate:** every screen passes axe with no violations; the clickable flow covers the core tasks.

### Phase 9: Working prototype (days 29–35)
- [x] Next.js with streamed tool calls. The model planner uses the Anthropic SDK directly, in a manual
  tool-use loop, rather than the Vercel AI SDK: the loop needs approvals, input validation and output
  checks between steps.
- [x] A fictional dataset of 60 listings (40 for rent, 20 for sale) across 10 Bengaluru localities,
  with fictional owners and builders. Owner replies are simulated.
- [x] The tools from Phase 5, with approval steps enforced in code, not just the UI.
- [x] The "never" list enforced in code (guard before the model, checks on owner questions) and in the
  model's instructions.
- [x] Claude Opus 5.5 as the planner (effort low, prompt caching, server-side fallbacks), with the
  scripted planner as a fallback and as the baseline for the tests.
- [x] No real personal data stored. A daily limit of 20 owner messages.
- [ ] A spending cap on the model API: set a monthly limit in the Anthropic Console before deploying.
- [ ] Deployed separately, with a public link: needs hosting (Vercel or Netlify).
- **Decided:** Anthropic, Claude Opus 5.5; the key lives only in the prototype's git-ignored `.env.local`.

### Phase 10: Validate (days 36–38)
- [x] Agent tests: 30 sample briefs (rent and buy) checking match quality, asking before acting,
  refusing the "never" list, and never inventing facts. Results are published as measured.
- [x] Accessibility: axe on every screen, keyboard pass, screen-reader spot check.
- [x] A self-review against the heuristics used in Phase 1.
- [x] Validation plan for later: interviews, survey, delegation sort, Wizard-of-Oz, card sort, tree
  test, moderated usability test.
- **Output:** [`09-validation.md`](09-validation.md) · 30 of 30 agent tests, 34 of 34 accessible states ☑

### Phase 11: Portfolio case study (days 39–42)
- [x] Case study at `/work/<slug>`, built from the shared case-study components and structured by the
  7 stages of the /process method (00–06). /process links to it as "the method, applied".
- [x] Sections: problem → desk research (real numbers) → proto-personas → journey map → psychology
  mapping → paradigm gate → agent architecture (tools, autonomy ladder, never list) → flows and IA →
  screens (with the screen-size switch) → AI decisions → design system → accessibility → agent test
  results → live prototype → what's next.
- [x] Across the site: a /work entry, a Design gallery set, a homepage "Also" link, an answer in the
  homepage agent, the sitemap, llms.txt and a social sharing image.
- [x] Every assumption labelled; fictional data noted.

---

## 5. Timeline (fast track plus working prototype: about 6 weeks)

| Week | Phases |
|---|---|
| 1 | 0 Frame · 1 Desk research |
| 2 | 3 Define · 4 Paradigm gate · start 5 Agent architecture |
| 3 | 5 Agent architecture · 6 Wireframes and content |
| 4 | 7 Identity and design system · 8 Mockups (phone) |
| 5 | 8 Mockups (tablet and desktop) · 9 Prototype |
| 6 | 9 Prototype · 10 Validate · 11 Case study |

## 6. Who does what

| Vivekanand | Claude |
|---|---|
| Approves each gate | Writes each phase's documents |
| Picks the name and style option | Desk research, competitor matrix, review mining (with sources) |
| Provides the model API key and budget for the prototype | Agent spec, flows, IA, wireframes |
| Reviews the copy so it sounds like him | Coded mockups, the prototype, agent tests, accessibility checks |
| Approves publishing | Builds the case study into the portfolio |

## 7. Files

```
docs/property-discovery/
  PLAN.md               this plan and the tracker
  01-brief.md
  02-desk-research.md   with competitors.md, market-research.md, review-mining.csv, review-codebook.md
  03-define.md
  04-paradigm-gate.md
  05-agent-spec.md
  06-content.md
  07-design-system.md
  09-validation.md
public/work/<slug>/      published images
src/lib/work/<slug>.ts   case-study data
src/app/work/<slug>/     case-study page
```

## 8. Risks

| Risk | Plan |
|---|---|
| Rent and buy together widen the scope | One shared agent and brief; buying-only parts kept to listing detail, true cost and project checks |
| Four screen sizes multiply the screens | Phone gets every screen; the other sizes get the 11 most important |
| Fast track means no user evidence | Review mining gives real numbers; everything else is labelled, and the validation plan shows the next step |
| The agent invents facts | Every fact comes from a tool and cites its source; tested in Phase 10 |
| Discriminatory filters | The never list is enforced in the tools and tested |
| Prototype costs | Spending cap, rate limit and a small model for routine steps |
| Licensing | No published competitor screenshots; licensed photos; a custom map |

## 9. Decision log

| Date | Decision | By |
|---|---|---|
| 13 Nov 2026 | Approach, city, segment, platforms, track, prototype and never list (§1) | Vivekanand |
| 13 Nov 2026 | Brief approved | Vivekanand |
| 13 Nov 2026 | Blanket approval: proceed through the gates without stopping; Claude logs its own decisions here | Vivekanand |
| 13 Nov 2026 | Business model stance: free for searchers, no pay-to-contact; owners and builders pay for verification, not leads or ranking (03 §8) | Claude, under blanket approval |
| 13 Nov 2026 | H8 added: the platform's business model is itself a trust problem (02 §7) | Claude, under blanket approval |
| 13 Nov 2026 | Working name **Hosamane**; direction "calm ledger" (teal and sand); type Anek Latin with Anek Kannada and Devanagari (07) | Claude, under blanket approval |
| 13 Nov 2026 | Phases 8 and 9 merged: the mockups are captures of the working prototype at four sizes, and the wireframes are the same screens in a wire theme | Claude, under blanket approval |
| 13 Nov 2026 | No API key yet, so the prototype runs a **scripted planner**. The tools, approvals, guardrails and data are real code; a model would replace only the planner | Claude, under blanket approval |
| 13 Nov 2026 | The prototype lives in its own repo at `~/Documents/hosamane-prototype` | Claude, under blanket approval |
| 13 Nov 2026 | API key provided. Claude Opus 5.5 becomes the planner; the scripted planner stays as the fallback and the test baseline. The model only prepares actions (approval cards); approved actions run in code. Guard first, one output rewrite for banned words or unsourced figures. Effort `low` for 4–5 s turns | Vivekanand (key); Claude, under blanket approval (design) |
| 13 Nov 2026 | Tests: 8 reworded never-list requests added, to test the model rather than the regex guard. Each search brief now has an expected brief; an empty shortlist passes only when nothing in the data fits | Claude, under blanket approval |

Still needs Vivekanand: (1) a spending limit on the API key in the Anthropic Console (and rotate the key, since it was pasted in chat); (2) hosting, to deploy the prototype publicly (Vercel or Netlify); (3) any git commit, in both repos.

## 10. Change log

- 13 Nov 2026: Claude planner added (`lib/agent-llm.ts`). Core suite 30 of 30 on both planners; reworded never-list requests 8 of 8 with Claude (0 of 8 scripted); four consecutive model runs gave the same results; median turn 4.4 s; about $0.30 per suite run. Two bugs fixed in the tests themselves. Case study validation section, 09-validation and the prototype README updated.

- 13 Nov 2026: Phase 11 complete: case study at /work/hosamane (structured by the 7 process stages, screens from the prototype at four sizes with a size switch, wireframe-vs-final pairs, validation results). It's also a featured /work entry, the first Design gallery set, in the homepage "Also" row, in an answer from the homepage agent, and in the sitemap and llms.txt. axe: 0 violations on desktop and phone; no overflow at 390 px.
- 13 Nov 2026: Phase 10 complete: 30 of 30 agent tests (first run 28: two unsourced figures, fixed in the tool), top-5 results meet every hard constraint (20 of 20), axe 34 of 34 states clean (first run 13: faded cards, list markup, a table that couldn't take keyboard focus).
- 13 Nov 2026: Phases 8–9 complete: about 80 captures at four sizes plus 8 wire-theme screens.
- 13 Nov 2026: Prototype built at ~/Documents/hosamane-prototype: Next.js 16, 19 typed tools, signed approvals, guardrails, 60 fictional listings, a responsive interface for four sizes with a wire theme, a co-decider share page, a capture script and 30 agent tests.
- 13 Nov 2026: Phase 7 complete: Hosamane, calm ledger tokens with measured contrast, Anek type.
- 13 Nov 2026: Phase 6 content complete (copy for every agent state, approvals, refusals, errors, notifications). Wireframes will be rendered from the Phase 8 screens in a wire theme.
- 13 Nov 2026: Phase 5 complete: 19 typed tools, verification record, guardrails enforced in code, living-brief memory, conversation rules, background tasks, 8 flows with failure paths, IA for four sizes, service blueprint, step comparisons.
- 13 Nov 2026: Phase 4 complete: agentic-first scored 25/30 (traditional 17, hybrid 18, zero-UI 18) on six evidence-based criteria; concept "conversation in, board out"; six hand-over points.
- 13 Nov 2026: Phase 3 complete: proto-personas, jobs to be done, today's journey, psychology mapping, principles, voice, autonomy defaults, business model stance, MVP scope.
- 13 Nov 2026: Phase 1 complete: 300 reviews coded (checked by a second pass on 30), heuristic review, competitor analysis (8 platforms, 101 sources), market research (15 questions); 11 key claims spot-checked. Hypotheses H1–H7 have verdicts; H8 added.
- 13 Nov 2026: brief approved by Vivekanand (Phase 0 gate passed).
- 13 Nov 2026: brief drafted (Phase 0). Phase 1 started: 1,395 App Store reviews collected (1,218 from 2024 on; a seeded random sample of 300, 60 per app, is being coded); heuristic review of NoBroker, 99acres and Magicbricks done (Housing.com blocks automated browsing).
- 13 Nov 2026: plan created. Agentic-first; Bengaluru; rent and buy; all screen sizes; fast track;
  working prototype; never list confirmed.
