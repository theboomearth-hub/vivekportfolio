# 02 · Desk research

Phase 1 of [PLAN.md](PLAN.md). Status: **complete** (13 Nov 2026). The gate is passed under
Vivekanand's blanket approval; the verdicts are in §7.

On the fast track there are no sessions with participants, so the seven hypotheses in
[01-brief.md](01-brief.md) were tested against four kinds of public evidence:

| Source | What it gives | File |
|---|---|---|
| Review mining | Real counts of what goes wrong, from 300 coded App Store reviews | [review-mining.csv](review-mining.csv) · [codebook](review-codebook.md) |
| Heuristic review | Where today's platforms help and hinder, observed first-hand | §3 below |
| Competitor analysis | 8 platforms, a feature matrix, AI in property search, brokers; 101 dated sources | [competitors.md](competitors.md) |
| Market and regulation | Bengaluru facts for renting and buying, each numbered and sourced | [market-research.md](market-research.md) |

References in square brackets point into those files: **[C n]** is source *n* in competitors.md and
**[M n.n]** is fact *n.n* in market-research.md.

---

## 1. Method and limits

**Review mining**
- **Collection:** Apple's public customer-reviews feed for the India App Store, collected 13 Nov
  2026. Reviewer names were dropped at collection.
- **Apps:** NoBroker, 99acres, Magicbricks, Housing, Square Yards.
- **Sample:** 1,395 unique reviews were collected. The 1,218 dated from 1 Jan 2024 onward are the
  population. A seeded random sample (seed 20261113) of 300, 60 per app, was coded.
- **Coding:** done against the written codebook with AI assistance, then checked by an independent
  second pass on 30 reviews (§2, caveats).
- **Limits:** reviews skew negative and towards iPhone users, and only 6 of the 300 mention Bengaluru.
  They show what goes wrong, not how often it goes wrong for everyone.
- **Publishing:** review text isn't republished. Short excerpts are quoted with the app and month only.

**Heuristic review**
- Public pages only, logged out, on desktop and phone, by one reviewer. See §3.

**Competitors and market**
- AI-assisted desk research using official sources, company pages, app listings, reputable news and
  industry reports. Every claim is dated and sourced, and anything unconfirmed is marked as such.
- Some pages refused automated access. Claims resting only on search summaries are marked "(ss)" or
  "snippet only" in the files and must be checked in a browser before publishing.
- 11 key claims were spot-checked against their sources (§6).

---

## 2. What 300 reviews say

300 reviews: 128 from people searching for a home, 50 from owners and sellers, 1 from an agent, and
121 where the role isn't clear. 198 of the 300 (66%) are 1–2★. Full data:
[review-mining.csv](review-mining.csv) · codebook: [review-codebook.md](review-codebook.md).

### Problems people searching for a home report (n = 128)

| Theme | Reviews | Share |
|---|---|---|
| Paid plans and refunds (pay to contact, premium plans, refunds refused) | 72 | 56% |
| Customer support or an assigned manager not helping | 49 | 38% |
| **Any trust problem** (fake or stale listing, broker posing as owner, spam or data sharing) | **55** | **43%** |
| · Fake or stale listings | 28 | 22% |
| · Brokers posing as owners | 20 | 16% |
| · Spam calls or data shared | 18 | 14% |
| Search and filters | 15 | 12% |
| Owner or agent didn't respond | 9 | 7% |
| Missing or wrong listing details | 8 | 6% |
| Hidden or unclear property costs | 7 | 5% |
| Visit problems | 6 | 5% |
| A good outcome (found a home, helpful service) | 18 | 14% |

A review can have several themes, so shares add up to more than 100%.

### Three findings that change the brief

**1. People already pay for a human agent, and it mostly disappoints.**
51 of the 300 reviews mention a paid "relationship manager" (a person assigned with a premium plan).
43 of the 51 are negative. The complaints are about the agent's work being invisible: unreachable,
nothing done for days, "5 other people calling u for the same properties without any linkage to each other",
"wasn't able to schedule even a single site visit". People will hand over the legwork (H6), but what
fails is accountability and visibility, which is exactly what an agent's activity log and approval
steps are for.

> "They assigned an RM, but the RM never responded to texts or calls!" (Housing, Jun 2025)

> "My manager not only helped me find a flat within my budget but also assisted in negotiating the
> rent." (NoBroker, Sep 2024)

**2. The biggest complaint is the business model, not the listings.**
56% of searchers complain about paywalls and refunds: paying to see an owner's number, contact
limits, partial refunds. Paying doesn't guarantee honesty either: people who paid still met brokers
posing as owners and listings that were already gone.

> "after taking the pro plan to get owner contacts, but most of the contacts available are of agents
> and brokers" (Magicbricks, Mar 2026)

**3. Trust problems hit 43% of searchers.**
Listings that were already taken, the same photos posted by different people, images that look
AI-generated, brokers listed as owners, and search data passed to local brokers.

> "MagicBricks immediately shares/sells you search data to the brokers in your area." (Magicbricks,
> Jun 2025)

### Smaller signals worth designing for
- **Wasted visits:** owners not turning up, slots cancelled 30–40 minutes before, and expectations
  that only surfaced at the door ("the owners' expectations did not match mine"). These are questions
  the agent could ask before anyone travels.
- **Distance:** "the flats were nearly 2 hours away from my preferred location", which is evidence for
  commute-based search.
- **Cost surprises are rare in reviews (5%) but large when they happen:** "15 days' rent as brokerage,
  even after charging around ₹2200 as a subscription fee"; "rent quoted on this app and actual rate has
  difference of 300%".
- **Scam asks:** 2 reviews mention being asked for a visiting fee, the pattern 99acres warns about on
  arrival.

### Caveats
- App Store reviews skew negative and towards iPhone users. Only 6 of the 300 mention Bengaluru, so
  these are national patterns.
- 81 of the 128 searchers don't say whether they're renting or buying, so the data can't separate the
  two journeys.
- **Square Yards' positive reviews look unusual:** 33 of its 60 are short 5★ reviews from Aug 2024 to
  Jan 2025 with near-identical wording, four sharing an unusual character. We report them but don't
  draw conclusions from them.
- **Coding check:** a second, independent pass on 30 reviews agreed on 95.6% of theme decisions (17 of
  30 fully identical). Most differences came from the check reading only the first 70 words; three
  codes were corrected after reading the full text.

---

## 3. Heuristic review

Public pages, logged out: the Bengaluru rental search and the first listing on NoBroker, 99acres and Magicbricks, captured 13 Nov 2026 at desktop 1440 px and phone 390 px. Rated against Nielsen's 10 heuristics on his severity scale (0 = not a problem, 4 = catastrophe) by one reviewer, so treat the ratings as indicative. Housing.com blocked automated browsing ("Security Alert") and isn't included. Screenshots are kept for internal reference only.

| # | Platform | Observation | Heuristic | Sev. | Hypothesis |
|---|---|---|---|---|---|
| 1 | NoBroker | Three to four overlays on arrival (search coach mark, metro tooltip, map tooltip, chat pop-up); on phone, plus an app banner, so no results show on the first screen | Aesthetic and minimalist design; user control | 3 | — |
| 2 | NoBroker | Search takes up to 3 localities or landmarks; needs can't be expressed beyond filters | Match with the real world; flexibility | 2 | H3 |
| 3 | NoBroker | Default sort "NoBroker Rank" with no explanation | Visibility of system status | 2 | H6 |
| 4 | NoBroker | First listing's photos carry a 2020 date stamp; listing "posted on" Nov 2026 | Trust (match with the real world) | 3 | H1 |
| 5 | NoBroker | Rent, maintenance (+₹6,500) and deposit (₹2,00,000) shown together at the top of the listing | — (good practice) | 0 | H2 |
| 6 | NoBroker | Report options include "Listed by Broker" and "Rented Out" | — (good practice; shows the problems are common) | 0 | H1 |
| 7 | NoBroker | Owner-hosted visits ("The owner will be showing this property at 06:30 PM today · Join Visit") and a "Verified Availability" badge | — (good practice) | 0 | H5 |
| 8 | NoBroker | Filter "Preferred Tenants: Family / Company / Bachelor Male / Bachelor Female" | Fairness (outside Nielsen) | 2 | Never list |
| 9 | NoBroker | Cross-sell on search and listing: tuition fees, rental-agreement ads, "Apply Loan" on a rental | Aesthetic and minimalist design | 2 | — |
| 10 | NoBroker | Activity counts ("525 views, 18 shortlists, 46 contacts") | Urgency; may pressure | 1 | — |
| 11 | 99acres | Blocking pop-up on arrival: "Never pay booking amount without visiting the property", listing what scammers ask for (visit charges, gate-pass booking, refundable booking amount) | Error prevention (good content, intrusive delivery) | 2 | H1 |
| 12 | 99acres | Deposit shown ("2 months rent"), but brokerage behind a "+brokerage" link | Visibility; recognition over recall | 2 | H2 |
| 13 | 99acres | Videos autoplay in results on phone and desktop (a pause control is present) | Aesthetic design; motion | 2 | — |
| 14 | 99acres | Listings labelled "Dealer" with age ("1mo ago"); "Verified Sqft" verifies area, not availability or owner | Visibility (partial) | 1 | H1 |
| 15 | 99acres | "2 people already contacted yesterday" | Urgency | 1 | — |
| 16 | 99acres | Voice search in the search bar | — (good practice) | 0 | H3 |
| 17 | Magicbricks | Price card hides the deposit and "other charges" behind links | Visibility; recognition over recall | 2 | H2 |
| 18 | Magicbricks | Freshness on every card ("Updated 4 hours ago", "Posted: Yesterday"); quick chips on phone: Owner, Most Recent, Verified Properties | — (good practice) | 0 | H1 |
| 19 | Magicbricks | "Tenant preferred: Bachelors/Family" on cards | Fairness (outside Nielsen) | 2 | Never list |
| 20 | Magicbricks | Sort "Relevance" with no explanation; "Add Budget for better results" nudge | Visibility; flexibility | 2 | H3, H6 |
| 21 | Magicbricks | Two app-install prompts on phone (top banner plus floating "Open App") | Aesthetic and minimalist design | 1 | — |


**Patterns across all three**
- **Search starts from locality, BHK and budget.** None of the logged-out experiences lets you search by
  commute, lifestyle or deal-breakers (H3).
- **Rankings are unexplained** ("NoBroker Rank", "Relevance") (H6).
- **No single move-in cost:** deposit, maintenance and brokerage are split across the card, links and
  detail pages (H2).
- **Tenant-type attributes appear on all three:** a filter on NoBroker, card labels on Magicbricks,
  "Available For" on 99acres listings. That makes the never list's fairness rule a real design decision,
  not a hypothetical one.
- **Trust signals exist but are partial:** freshness labels, dealer labels, report buttons, scam warnings.
  None explains what was verified, when, and by whom (H1).
- **Shortlists are single-person** (a heart icon). No shared shortlist is visible logged out (H4;
  the competitor analysis found no Indian platform with one, §4).

---

## 4. Competitors and AI in property search

Full analysis and matrix: [competitors.md](competitors.md).

| Capability | India (5 platforms) | Global (Zillow, Rightmove, Redfin) |
|---|---|---|
| AI that acts for the searcher | None found. Square Yards and Housing.com have ChatGPT apps (Jun 2026) that hand off to the site or an advisor [C 40, 48, 49] | Zillow AI mode schedules tours and connects an agent [C 56]. Gemini books Zillow rental tours only after you confirm contact details, and can't contact the owner or manager [C 57] |
| An agent that questions owners for you | None (NoBroker's paid human manager books owner meetings [C 1]) | None found |
| Shared shortlist or group decision | None confirmed | Zillow co-shopper messaging and shared saves [C 55]; Redfin Shared Favorites [C 81] |
| True cost | Deposit and maintenance as separate fields [C 3, 20] | Zillow's "Total price" with a fee breakdown [C 60] (ss) |
| Verification | Ranges from field visits (99acres, Housing.com [C 17, 31]) to a "100% Verified Owner" label with no stated method (NoBroker [C 3]) | Mostly from listing data feeds plus fraud teams |
| Phone-number masking | Confirmed only for Magicbricks chat [C 27] | Unverified |
| Pay-to-contact for searchers | NoBroker, Magicbricks and Housing.com sell plans [C 1, 25, 34]; NoBroker reports inconsistent uptake [C 5] | Advertiser-paid |
| Fair-housing guardrails | None found | Zillow's Fair Housing Classifier checks questions and AI answers in real time [C 56] |

**Brokers, the existing "agent."** Brokers find options, arrange visits, negotiate and handle
paperwork. Rentals typically cost a month's rent or more, sometimes from both sides [M 3.1–3.2]. They
are effectively unregulated for rentals: Karnataka RERA's agent registration covers sales of units in
registered projects only [M 3.3]. Sources describe brokers passing on owners' discriminatory
conditions [C 89, 90].

**What this leaves open (analysis):**
- No platform in India or abroad has an agent that asks owners the searcher's questions with their
  approval.
- No Indian platform offers a shared shortlist.
- No Indian platform shows one all-in cost.

---

## 5. Bengaluru facts that shape the design

| Area | Fact | Design consequence |
|---|---|---|
| **Deposits** | Landlords often ask 6–9 months' rent, sometimes 12 [M 1.1]. Karnataka hasn't adopted the Model Tenancy Act, and its Rent Act doesn't cap deposits [M 1.4] | The all-in move-in cost must lead; deposit size compared with nearby listings |
| **Exit deductions** | One month's rent deducted as "painting charges" is "increasingly common" [M 4.2] | Show likely deductions; checklist before moving in |
| **Agreements** | Usually 11 months, because leases over a year must be registered [M 2.1–2.2] | Renewal dates in the plan; agreement checklist |
| **Brokerage** | At least a month's rent, up to three in Bengaluru; no legal norm [M 3.1–3.2] | Show brokerage in the cost when a broker is involved; the agent's work is free |
| **Purchase costs** | About 7.6% on top of the price above ₹45 lakh: 5% stamp duty, 2% registration (doubled from 31 Aug 2025), about 0.6% cess [M 5.1–5.2]. GST of 5% (1% if affordable) on under-construction homes; none on ready ones [M 6.1–6.3] | The all-in purchase cost and EMI for buyers |
| **Khata** | e-khata is mandatory for sale and mortgage since Oct 2024; B-khata status limits loans and resale [M 8.1–8.3] | Khata status is a verification item for buyers, shown with its source |
| **Project registration** | Buyers can check any project on Karnataka RERA's portal [M 7.2] | Registration status with a link to the official record |
| **Loans** | RBI repo raised to 5.50% (7 Oct 2026) [M 9.1]; SBI raised its benchmark rates 25 bps from 15 Oct 2026 [M 9.3] | EMI estimates show the date and rate used |
| **Rents** | 2BHK, Q2 2026: Whitefield ₹30–46k, Sarjapur Road ₹33–46.5k, Electronic City ₹20–31k; growth slowed to about 0–1% a quarter [M 11.1–11.2] | Fictional dataset priced in these ranges; "price against nearby listings" check |
| **Prices** | Average quoted base ₹9,450/sq ft; Whitefield ₹10,850, Sarjapur Road ₹11,560 (Q2 2026) [M 12.2]. Growth figures conflict between firms (8% to 24%) | Use Anarock's figures consistently; note the conflict |
| **Scams** | A fake broker on NoBroker took over ₹2 crore from 22 people [M 13.3]; Telegram listing fraud [M 13.2]; a "give us your lease money" scheme with an estimated ₹200 crore+ lost [M 13.4]. 99acres warns about booking-amount scams [heuristic #11] | Scam-pattern checks; the agent never pays; a warning before any advance payment |
| **Discrimination** | Audit evidence: landlords respond to Muslim applicants 0.22 of the time vs 0.35 for upper-caste Hindu applicants (Delhi) [M 14.1]; documented Bengaluru cases [M 14.2–14.3] | The never list is essential, not cosmetic |
| **Commute** | A peak-hour 10 km takes 34.5 min (traffic police) to 38 min (TomTom) [M 15.1–15.2] | Commute time at the hour you travel, not distance |
| **Water and floods** | The 2024 water crisis and tanker dependence [M 15.3–15.4]; the 2022 floods on the Outer Ring Road and Bellandur [M 15.6] | Water source and flood history as neighbourhood facts, with sources; never "safe" or "risk-free" |

**Conflicts noted in the research:** rent growth (Anarock about 0–1% a quarter vs Magicbricks +8.6%),
price growth (8%, 9% and 24% from three firms), and metro deadlines. A Business Today claim that
Karnataka caps deposits at two months conflicts with the law and isn't used [M 1.4].

---

## 6. Spot-check of key claims

Each claim was checked by fetching the source and finding the stated fact.

| Claim | Result |
|---|---|
| RBI repo 5.50% (Oct 2026) [M 9.1] | ✓ RBI page |
| Registration fee doubled from 1% to 2% [M 5.1] | ✓ |
| Fake broker on NoBroker: 22 people, ₹2 crore [C 11] | ✓ |
| Fake owner on 99acres took a ₹10,000 token [M 13.1] | ✓ |
| Zillow AI mode schedules tours; Fair Housing Classifier [C 56] | ✓ (the release says "connecting with an agent", not "applications"; corrected) |
| Gemini books Zillow tours and can't contact the owner or manager [C 57] | ✓ (Google's page also lists "Provide neighborhood safety scores" as something it can't do) |
| Housing.com search inside ChatGPT [C 40] | ✓ |
| Zillow co-shopper messaging [C 55] | ✓ |
| Karnataka RERA project list is public [M 7.2] | ✓ |
| Delhi audit 0.35 vs 0.22 [M 14.1] | ✓ |
| Deposits 6–9 months, sometimes 12 [M 1.1] | ✓ |

**11 of 11 confirmed, 1 wording corrected.**

---

## 7. Verdicts on the hypotheses

| # | Hypothesis | Verdict | Evidence |
|---|---|---|---|
| H1 | Listings can't be trusted | **Supported** | 43% of searchers hit a trust problem (R); scam cases [M 13]; verification is uneven [C 3, 17, 31]; heuristic #4 |
| H2 | The true cost is hidden | **Supported, reframed** | Rarely the subject of reviews (5%), but deposits of 6–12 months, exit deductions and 7.6% purchase charges are structural [M 1, 4, 5]; no Indian platform shows one cost (§4). The reframe: people know costs are high but can't compare them until late |
| H3 | Filters can't express real needs | **Supported** | Locality-only search on all three (heuristic); distance complaints (R); commute search exists only partially in India [C matrix] |
| H4 | Deciding is a group activity | **Supported by inference** | No direct Indian evidence; Zillow says "more than 60%% of buyers co-shop" and built for it [C 55]; no Indian equivalent. Kept as a *should* |
| H5 | Arranging visits is a mess | **Partly supported** | Visit complaints are few (5% R), but expectations that only surface at the door point to screening; NoBroker already offers owner-hosted visits (heuristic #7). The planner stays; screening matters more |
| H6 | People will delegate if they can see what was done | **Supported** | People already pay for human managers, and 43 of 51 such reviews are negative about invisible work (R) |
| H7 | The broker is the mental model | **Supported** | Reviews compare the platforms with "your local broker" (R); what brokers do maps onto the agent's jobs [M 3, C brokers] |
| **H8 (new)** | The platform's business model is itself a trust problem | **Added** | Paywalls and refunds are the top complaint (56%); paying didn't stop posing brokers (R) → the business-model stance in 03 §8 |

**Kill criteria:** none triggered. Verification data exists in principle (registration portal,
e-khata, field visits). Trust and cost are central, not minor.

## 8. What changes downstream
- **03 Define:** budgets and costs filled from §5; H8 and the business-model stance confirmed; khata
  and registration added to the buyer must-haves.
- **05 Agent spec:** new checks for scam patterns (advance payments before a visit), price against
  nearby listings, khata status and registration. A fairness guardrail on questions *and* answers,
  following Zillow's precedent [C 56]. The agent never gives "safety scores" (Google's Gemini doesn't
  either [C 57]).
- **Prototype data:** fictional listings priced within the Anarock ranges in §5.
