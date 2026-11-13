# 03 · Define

Phase 3 of [PLAN.md](PLAN.md). Status: **complete** (13 Nov 2026), with market figures from Phase 1.

Evidence key: **R** = review mining ([02-desk-research.md §2](02-desk-research.md)), **H** = heuristic
review (§3), **C** = competitor analysis ([competitors.md](competitors.md)), **M** = market research
([market-research.md](market-research.md)). Anything without a key is an
assumption.

---

## 1. Proto-personas

> **These are proto-personas.** They're built from public evidence and assumptions, not interviews,
> and will be replaced by real research (see the validation plan).

### Rohan, relocating renter
27 · software engineer · moving from Pune for a job on the Outer Ring Road · renting with one flatmate

- **Situation:** has three weekends before his joining date and doesn't know Bengaluru's localities.
- **Wants:** a 2BHK his flatmate agrees on, under 40 minutes from the office, with no brokerage.
  A 2BHK in Whitefield or on Sarjapur Road rents for about ₹30–46k a month (M 11.1). The deposit could
  be six to ten months' rent (M 1.1), so his real budget question is the move-in cost, not the rent.
- **Worries:** fake or already-rented listings (R: 22% of searchers), brokers posing as owners (R: 16%),
  paying for a plan that doesn't deliver (R: 56%), and losing weekends to wasted visits.
- **Today he would:** search by locality name, because that's all the filters allow (H2), and call
  numbers that turn out to be brokers.
- **What would make him trust an agent:** seeing what it checked, and never being charged to talk to
  an owner.

### Meera and Karthik, first-time buyers
34 and 36 · renting in HSR Layout · buying a ready or under-construction 2–3BHK · budget about ₹1.4 Cr
(about 1,200 sq ft on Sarjapur Road or in Whitefield at ₹10,850–11,560 per sq ft, M 12.2, plus about 7.6% in
stamp duty, registration and cess, M 5.2)

- **Situation:** they've saved a down payment, and Karthik's parents are contributing and want a say.
- **Wants:** a home with clean papers from a builder with a good record, and an all-in cost they can
  plan a loan around.
- **Worries:**
  - project delays
  - khata status: e-khata has been mandatory for sales and mortgages since Oct 2024, and B-khata limits
    loans and resale (M 8.2–8.3)
  - costs beyond the headline price: 2% registration since Aug 2025 (M 5.1), and 5% GST if the home is
    under construction (M 6.1)
  - listing prices that don't match reality (R)
- **What would make them trust an agent:** registration and legal checks shown with their source and
  date, and one number for the total cost.

### Lakshmi, co-decider
61 · Karthik's mother · in Mysuru · uses WhatsApp, not property apps

- **Situation:** isn't searching, but her view decides the outcome.
- **Wants:** to see the two or three finalists and the facts behind them, and to say yes or no.
- **Won't:** install an app or create an account.
- **What would include her:** a link that opens the shortlist, lets her vote and comment, and shows
  her nothing she has to manage.

### Anti-persona: the bulk lead collector
A broker who uses an agent to harvest owners' numbers at scale. The design must make this pointless:
numbers stay masked, owner messaging is rate-limited per person, and there are no bulk exports.

---

## 2. Jobs to be done

| # | When… | I want to… | So I can… |
|---|---|---|---|
| J1 | I'm moving to a city I don't know | describe my life (office, budget, must-haves) instead of localities | see places that actually fit |
| J2 | I see a listing | know whether it's real, available and what it truly costs | stop wasting calls and weekends |
| J3 | I'm interested in a place | get my deal-breaker questions answered before I go | only visit homes that could work |
| J4 | I have a weekend for visits | see them planned in a sensible order | see more in less time |
| J5 | I'm buying | check registration, legal status and the all-in cost | commit without surprises |
| J6 | others share the decision | show them the finalists and collect their views | decide together, quickly |
| J7 | an agent works for me | see everything it did and stop it at any time | trust it with the legwork |

---

## 3. Today's journey (as-is, from the evidence)

| Stage | What happens today | Pain | Evidence | Opportunity for the agent |
|---|---|---|---|---|
| Need | Thinks in terms of an office, a budget, a flatmate | Platforms ask for localities | H2, H20 | A brief built from life, not localities |
| Search | 16,000–31,000 results; unexplained ranking | Too many choices, no reasons | H3, H20 | A short ranked list, each with match and miss reasons |
| Judge | Photos of unknown age; dealer or owner unclear; costs behind links | Trust and cost uncertainty | R 43%, H4, H12, H17 | A verification record and one all-in cost |
| Contact | Pays to see numbers; brokers answer; spam follows | Paywalls, posing brokers, data shared | R 56%, R 16%, R 14% | Free contact, masked number, agent asks on your behalf |
| Visit | Owners no-show; mismatched expectations at the door | Lost weekends | R (visit quotes) | Screening questions first, then a planned route |
| Decide | Screenshots on WhatsApp to family | Context lost, slow | Assumption | A shared shortlist with votes |
| Commit | Token money, agreement or booking | Scam risk; surprise charges | H11, R | Next-step checklist; the agent never pays |

---

## 4. Psychology mapping

Each finding is mapped to a principle, the constraint it implies, and the design decision.

| Finding | Principle | Constraint | Decision |
|---|---|---|---|
| 56% of searchers complain about paywalls and refunds (R) | Loss aversion (Kahneman & Tversky, 1979): paying and getting nothing hurts more than not paying | Never charge to contact an owner | The agent's legwork is free for searchers; optional services have fixed prices shown up front |
| 43 of 51 reviews of paid human managers are negative, mostly about invisible work (R) | Operational transparency (Buell & Norton, 2011): people value effort they can see | Every agent action must be visible | An activity log, live task progress ("Asked 6 owners, 3 replied") and notifications with receipts |
| 16,000–31,000 results with unexplained ranking (H) | Choice overload (Iyengar & Lepper, 2000) | Show fewer results, with reasons | A ranked shortlist of 5–8, each with "matches" and "misses" against the brief |
| 43% meet fake, stale or posing listings (R) | Trust calibration: trust should match actual reliability | No unverifiable claims | A verification record per listing: what was checked, when, by whom, and what couldn't be checked |
| "2 people already contacted yesterday" and activity counts (H) | Scarcity pressure | No manufactured urgency | Only real time facts ("owner showing at 6 pm today"); no view or contact counts |
| Distance complaints; locality-only search (R, H) | Anchoring on the wrong reference | Start from the commute, not the map | The brief anchors on office and commute time; localities come out of the search |
| Expectations that only surface at the door (R) | Commitment and consistency: settle deal-breakers before investing time | Screen before travelling | The agent asks owners the person's deal-breakers before suggesting a visit |
| Costs split across cards, links and pages (H) | Mental accounting: the headline rent anchors the budget | One number first | The all-in move-in (rent) or purchase (buy) cost is shown first, itemised second |
| Tenant-type labels on all three platforms (H) | Fairness, with legal and ethical risk | The never list | No marital-status, religion, caste or diet preferences in listings, filters or ranking |

---

## 5. Design principles

1. **Show the work.** Every action the agent takes is visible, timestamped and reversible.
2. **Ask before acting.** Anything that contacts a person, books time or shares data needs approval
   (see the autonomy ladder).
3. **Facts have receipts.** Every fact shows its source and date, and unknowns are said plainly.
4. **One number for cost.** The all-in cost comes first and the breakdown second.
5. **Fewer, better.** A short list with reasons beats thousands of results.
6. **Fair by design.** The never list, no paid ranking, no fake urgency.
7. **Bring the group in.** Co-deciders join from a link, with no install.

## 6. The agent's personality and voice

**A calm, candid local who knows the city and works for you, not for owners or builders.**

| Trait | Sounds like | Never sounds like |
|---|---|---|
| Plain | "This one's 38 minutes from your office at 9 am." | "Experience seamless connectivity!" |
| Candid about gaps | "I couldn't confirm the owner yet. I've asked." | "Verified" with nothing behind it |
| On your side | "The deposit is higher than nearby listings. Want me to ask about it?" | "Hurry, high demand!" |
| Brief | One sentence, then the view | Paragraphs before the answer |
| Respectful of your call | "Ready to send these 3 questions? You can edit them." | Acting first and telling you after |

English first. Hindi and Kannada are "should" items for a later version (§9).

## 7. Autonomy ladder (default settings)

| Job | Default level | Can the user change it? |
|---|---|---|
| Understand needs, search, rank, verify, calculate cost and commute | 0 · Inform | No (always on) |
| Draft questions to owners; propose a visit plan | 1 · Prepare | No |
| Send messages to owners; book visits; share the shortlist | 2 · Act with approval | Yes, can grant a standing permission (level 3) per action type |
| Watch searches and send digests | 3 · Standing permission | Set up by the user, cancellable any time |
| Pay, sign, share ID documents or phone number, filter on protected traits | Never | No |

## 8. Business model stance

*Decided by Claude under Vivekanand's blanket approval (13 Nov 2026); can be changed.*

**Free for searchers, with no pay-to-contact.** Revenue comes from owners and builders paying for
verification (not for leads or ranking), and from optional services (rental agreements, movers) at
fixed prices shown before purchase. Sponsored placements, if any, are labelled and never enter the
agent's shortlist.

**Why:** paywalls and refunds are the top complaint (56% of searchers), and paid plans didn't stop
posing brokers or stale listings (R). An agent that works for the searcher can't also be selling the
searcher's attention.

## 9. MVP scope

| Priority | Rent | Buy |
|---|---|---|
| **Must** | Living brief · ranked shortlist with reasons · verification record · all-in move-in cost · commute · ask owners (with approval) · visit planner · compare · activity log · agent permissions · report a listing · map and list fallback | All rent musts, plus: project registration check · all-in purchase cost and EMI · possession timeline · khata status with its source (M 8) |
| **Should** | Shared shortlist with votes · watch and digest · voice notes after visits leading to a recommendation · Hindi and Kannada | Same, plus builder track record |
| **Could** | Drafting negotiation points · agreement checklist | Loan pre-eligibility |
| **Won't (this version)** | Payments or deposits · signing · paying guest accommodation · commercial · NRI buying · owner listing tools | Same |

---

**Gate:** scope fits the timeline. Approved in advance under the blanket approval of 13 Nov 2026;
reviewed again once the market facts are merged.
