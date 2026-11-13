# 06 · Content design and wireframes

Phase 6 of [PLAN.md](PLAN.md). Status: **content complete; wireframes are rendered with the mockups**
(13 Nov 2026).

**Wireframes.** The screens are built once, as coded HTML, with two themes: **wire** (greyscale boxes,
system font, no photos or colour) and **final**. The wireframes are the wire-theme render of the same
screens, so the case study's "wireframe → final" comparison is honest: the same layout at two levels of
finish. They're produced in Phase 8.

This document is the copy source for the mockups and the prototype. The voice rules are in
[03-define.md](03-define.md) §6.

---

## 1. Rules for every string
- **One idea per sentence.** Answers start with one sentence, then the view.
- **Numbers over adjectives.** "38 min at 9 am", not "great connectivity".
- **Say what you don't know.** "Not confirmed yet" beats silence or a vague badge.
- **Name the person's control.** "You can edit these", "You can stop this any time".
- **No urgency or pressure words:** hurry, only a few left, high demand, don't miss.
- **Banned in agent output:** safe, unsafe, good area, bad area, guaranteed, verified (unless a named
  check passed), risk-free.

## 2. Agent home and the brief

| Moment | Copy |
|---|---|
| Empty home (first visit) | **What are you looking for?** Tell me about your move: where you'll travel to, your budget, and what you can't live without. I'll do the searching and checking. |
| Starter chips | Rent a 2BHK near my office · Buy my first home · Compare two places I've found · What will moving in really cost? |
| Clarifying question (tap answers) | Furnished or unfurnished? · Furnished · Semi · Either |
| Assumption chip | I assumed: semi-furnished is fine · Change |
| Brief chip origin | You said · 2 min ago · I assumed · from your answer |
| Brief header | **Your brief** · I use this for every search. Tap anything to change it. |

## 3. Results and the listing

| Moment | Copy |
|---|---|
| Shortlist answer | I found **6 homes** that fit. 2 need a closer look. |
| Match line | Matches 7 of 8 · Misses: balcony |
| Flag | Photos may be old · Deposit is higher than nearby |
| No results | Nothing fits all of this yet. **2 homes** fit if the commute can be 50 min. **1** fits at ₹48k. · Show those · Keep watching instead |
| Total first | **₹2.98 lakh to move in** · First month’s rent ₹42,000 · Deposit ₹2,52,000 (6 months) · Maintenance ₹3,500 · Brokerage none (owner listing) |
| Buy total | **₹1.51 Cr all-in** · Price ₹1.40 Cr · Stamp duty and cess ₹7.8 lakh · Registration ₹2.8 lakh · GST none (ready home) · EMI about ₹95,500 on a ₹1.10 Cr loan over 20 years at 8.5% (rate checked 13 Nov 2026) |
| Commute | **38 min** to Bellandur at 9 am by car · 52 min by bus and walk |
| Area facts | Water: Cauvery connection (society says) · Flooding: none recorded for this street since 2022 (source) · Metro: 1.4 km |

## 4. The verification record

| State | Copy |
|---|---|
| Passed | ✓ **Owner confirmed** · by phone, 3 days ago |
| Not done | ○ **Owner not confirmed yet** · I've asked. You'll see it here. |
| Warning | ! **These photos appear on 2 other listings** · Ask the owner for a recent photo before visiting. |
| Scam signal | ! **Asked for a payment before a visit** · Don't pay anything before seeing the home. I never pay on your behalf. · Report |
| Buy: registration | ✓ **Project registered** · Karnataka RERA, number shown · View the official record |
| Buy: khata | ○ **Khata not confirmed** · Ask the builder for the e-khata. · Draft the question |
| Footer | Checks show who did them and when. Anything I couldn't check is marked ○. |

## 5. Asking owners (approval)

| Moment | Copy |
|---|---|
| Proposal | Want me to ask these **3 owners** 2 questions? |
| Sheet title | **Review before sending** |
| Sheet body | Each owner gets this message from a masked number. Your name and number aren't shared. |
| Draft | Hi, I'm interested in your 2BHK. 1) Are pets allowed? 2) Is the deposit negotiable? Thanks. |
| Buttons | **Send to 3 owners** · Edit · Not now |
| Irreversible note | Sent messages can't be unsent. |
| Standing permission offer | Next time, ask owners these standard questions without checking with you? · Yes, for pets and deposit · No, always ask me |
| Task running | **Asking 3 owners** · 1 of 3 replied · Stop |
| Reply summary | 2 of 3 replied. **Pets OK** at 1. **Deposit** negotiable at 1. 1 owner hasn't replied in 48 h. · Find similar homes |

## 6. Visits and deciding together

| Moment | Copy |
|---|---|
| Visit plan | **Saturday 16 Nov** · 3 visits · 1 h 40 min including travel |
| Approve visits | **Request these slots** · Owners confirm; I'll tell you when they do. |
| Owner declined | The owner can't do 11 am. They offered 4 pm. · Accept · Pick another |
| Share | Share these 3 finalists with **Priya** (votes) and **Mum** (view only)? The link expires in 7 days. |
| Co-decider view | **Rohan wants your view** on 3 homes. Tap the one you like, or leave a note. No app needed. |
| Vote summary | **You agree** on the Kadubeesanahalli flat. **You differ** on commute versus rent for the HSR one. |
| Recommendation | I'd pick **the Kadubeesanahalli flat**: it's the only one that meets all your must-haves, and both of you voted for it. Trade-off: ₹4k more a month. |

## 7. Refusals and guardrails

| Situation | Copy |
|---|---|
| Protected-trait filter | I can't filter by religion. That's a rule I keep to avoid discrimination. I can ask every owner the same questions about house rules, if that helps. |
| Payment request | I can't make payments, and I won't. If an owner asks for money before a visit, don't pay. Want me to report the listing? |
| Number sharing | I won't share your number. Owners reach you through the masked chat. You can share it yourself any time. |
| Safety question | I don't rate areas as safe or unsafe. I can show you what's on record: street lighting, police station distance, and flood history, each with its source. |
| Unknown fact | I couldn't find that. I can ask the owner. |

## 8. Errors and empty states

| Situation | Copy |
|---|---|
| Tool failure | I couldn't check commute times just now. Everything else is up to date. · Try again |
| Listing taken | This home was rented yesterday, so I've moved it out of your shortlist. 2 similar homes are listed. |
| Daily message limit | You've asked 20 owners today. I'll send the rest tomorrow morning, so owners aren't flooded. |
| Empty board | Nothing on your board yet. Start with the agent, and your shortlist and tasks will collect here. |
| Empty activity | When I do something for you, it shows here with the time and what changed. |

## 9. Notifications

| Event | Copy |
|---|---|
| Owner replied | 2 owners replied about pets. One says yes. |
| Visit confirmed | Saturday 11 am confirmed at the HSR flat. |
| New match | New: a 2BHK 32 min from your office at ₹41k. |
| Price drop | The Whitefield flat dropped to ₹39k. |
| Co-decider voted | Priya voted for the Kadubeesanahalli flat. |

## 10. Accessibility in content
- Every icon-only control has a label ("Stop task", "Close").
- Status is never shown by colour alone (✓ ○ ! plus words).
- The map always has a list alternative with the same facts.
- Times are written out ("38 min"), not shown only as bars.
- Approval buttons name the action and the count ("Send to 3 owners").
