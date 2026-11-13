# 01 · Design brief

Phase 0 of [PLAN.md](PLAN.md). Status: **approved** by Vivekanand, 13 Nov 2026.

## The problem (as we understand it before research)

Finding a home in Bengaluru, to rent or to buy, means piecing together listings that may be fake or
stale, costs that only surface late, and visits that take whole weekends, often while coordinating
with family or flatmates. Today's platforms are good at showing many listings and poor at helping
someone decide. The people who do help people decide are brokers, and they come with fees, pressure
and mixed trust.

**Design question:** how might an agent do the legwork of a good broker (understand the need, check
the listings, ask the questions, plan the visits, help the group decide) while the person stays in
control of every commitment?

## Who it's for (first cut, refined in Phase 3)

| Segment | Situation | Why they matter |
|---|---|---|
| Relocating renter | Moving to Bengaluru for work and doesn't know the city | Most exposed to fake listings, broker pressure and commute mistakes |
| Local mover (rent) | Already in the city, changing area or size | Knows what they want; short on time for visits |
| First-time buyer | Buying a ready or under-construction home | Highest stakes: project registration, total cost, loan |
| Co-decider | Family member or flatmate who isn't searching but has a vote | Often decides in the end, yet tools leave them out |

## Hypotheses

Each one is tested in Phase 1 (desk research and review mining) and kept, changed or dropped at the
Phase 1 gate.

| # | Hypothesis | Evidence that would support it | If it's false |
|---|---|---|---|
| H1 | Listings can't be trusted: fake, stale, or brokers posing as owners | A large share of review complaints about fake, unavailable or broker listings | Verification becomes a supporting feature, not a pillar |
| H2 | The true cost is hidden: deposit and move-in costs for rent; registration, taxes and loan for buying | Complaints and forum threads about surprise costs; platforms that don't show totals | Cost views get simpler |
| H3 | Filters can't express real needs (commute, quiet street, water supply, pets) | Forum requests for these needs; competitors' filters lack them | The agent's brief stays close to standard filters |
| H4 | Deciding is a group activity, but tools are built for one person | Threads about convincing family or flatmates; no shared shortlists on competitors | Group features move to "later" |
| H5 | Arranging visits is a mess: scheduling, no-shows, wasted trips | Complaints about owners not responding or listings gone at visit time | The visit planner is cut to a simple scheduler |
| H6 | People will hand legwork to an agent if they can see what it did | Positive reception of assisted search and concierge services; evidence of distrust where actions are hidden | The agent stays at level 0–1 (inform and prepare) |
| H7 | The broker is the mental model people bring to an agent | Descriptions of good and bad brokers that map onto agent jobs | The agent's voice and role are framed differently |

## Goals

**For the product**

1. Get someone from "I need a place" to a shortlist they trust, faster than browsing.
2. Show the real cost of every listing before anyone visits or pays.
3. Make every action the agent takes visible, explained and reversible.
4. Bring co-deciders into the decision without making them install anything.

**For the portfolio**

1. Show agentic product design end to end: from research to an agent architecture, an interface and
   a working prototype.
2. Show honest evidence: measured where measured, labelled where assumed.
3. Show the /process method applied to a real problem.

## Non-goals (for this version)

- Paying guest accommodation, hostels and co-living.
- Commercial property, plots and land.
- NRI-specific buying.
- Payments, escrow or deposits held by the platform (the agent never pays; see the never list).
- Arranging home loans or legal services: we estimate EMI and show checklists, not advice.
- Listing tools for owners and builders (owners only appear where the searcher meets them).

## Constraints

- **Fast track:** no sessions with participants. Evidence comes from public sources and review mining.
- **The never list:** the agent never pays or signs; never shares ID documents or a phone number
  without explicit consent; never filters by religion, caste, diet or marital status.
- **Facts come from tools:** the agent states nothing about a listing or area unless a tool returned
  it, and it shows the source.
- **Four screen sizes:** phone 390, tablet 834, tablet landscape 1194, desktop 1440.
- **Accessibility:** WCAG 2.2 AA; every map has a list alternative.
- **Data:** fictional listings and people in real Bengaluru localities; no real phone numbers or
  private addresses.
- **Original design:** competitors inform the analysis; nothing is copied.
- **Prototype:** a spending cap and rate limit; no real personal data stored.

## How we'll know it works

**If it shipped** (the measures we would track):

| Measure | Why |
|---|---|
| Time from first message to a shortlist the person saves | The core promise |
| Share of agent actions approved without edits | Is the agent preparing the right things? |
| Override and undo rate | Where the agent gets it wrong |
| Share of shown listings that are verified | Trust |
| Visits per decision | Is the shortlist good before people travel? |
| Co-deciders who vote | Is the group feature used? |

**For this project** (measured before publishing):

| Check | Target |
|---|---|
| Agent asks before every action that needs approval | 100% of test briefs |
| Agent refuses every request on the never list | 100% of test briefs |
| Agent states facts only from tool results | 100% of test briefs |
| Top-5 matches fit the brief (scored against a rubric) | At least 80% |
| Screens with no axe violations | All of them |

## Kill criteria for the concept

We stop and rethink if any of these turn out to be true:

1. Desk research shows the data needed for verification couldn't exist even in principle (for
   example, no way to confirm listing freshness or project registration).
2. Review mining shows trust and hidden costs are minor complaints compared with something the concept
   doesn't address.
3. In the flows (Phase 5), the core tasks take more steps with the agent than without it.
4. The never list makes a core job impossible.

## Open questions

1. Which signals can genuinely verify a listing (owner identity, photo freshness, cross-listing
   duplicates)? → Phase 1
2. Which buying costs can be calculated reliably for Bengaluru (stamp duty, registration, GST on
   under-construction homes)? → Phase 1, with sources
3. How do competitors handle brokers who pose as owners? → Phase 1
4. Which languages should the agent speak in the first version? → Phase 3

---

**Approval:** ☑ Vivekanand, 13 Nov 2026
