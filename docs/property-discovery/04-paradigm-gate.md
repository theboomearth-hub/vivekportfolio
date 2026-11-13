# 04 · Paradigm gate

Phase 4 of [PLAN.md](PLAN.md). Status: **complete** (13 Nov 2026).

Agentic-first was Vivekanand's starting decision. This gate doesn't re-open that decision. It tests it
honestly against the alternatives, so the case study can show *why* it holds and *where it doesn't*,
and it sets the boundaries where the agent hands control back to the person.

## 1. The four paradigms

| Paradigm | What it looks like here |
|---|---|
| **Traditional** | Filters, map and list, as on today's portals |
| **Hybrid** | The traditional interface plus an AI assistant in a side panel that answers questions |
| **Agentic-first** | The agent is the main way in: it builds the brief, does the legwork, and answers with views you can act on. Map and filters remain as a fallback |
| **Zero-UI** | Everything happens over WhatsApp or voice, with notifications and no app |

## 2. Criteria

The site's process names the paradigms but doesn't define scoring criteria, so these six come
straight from the Phase 1 evidence ([02-desk-research.md](02-desk-research.md)):

| # | Criterion | Why it matters (evidence) |
|---|---|---|
| 1 | **Trust you can check:** can the person see what happened, and on what basis? | 43% of searchers hit trust problems; paid managers fail on invisible work (H1, H6) |
| 2 | **Effort to a good shortlist** | 16,000–31,000 results with unexplained ranking (heuristic review) |
| 3 | **Control over commitments:** contact, money, data | Paywalls, spam and data sharing; the never list (H8) |
| 4 | **Vague needs:** commute, lifestyle, deal-breakers | Locality-only search; distance complaints (H3) |
| 5 | **Group fit:** co-deciders take part | Zillow says "more than 60% of buyers co-shop"; no Indian equivalent (H4) |
| 6 | **Failure cost and recovery:** when it's wrong, how bad is it and how easy to fix? | Wasted weekends; scam losses (M 13) |

## 3. Scores

Scored 1 (poor) to 5 (strong), with reasons. These are design judgements, not measurements.

| Criterion | Traditional | Hybrid | Agentic-first | Zero-UI |
|---|---|---|---|---|
| 1 Trust you can check | 3 · You did everything yourself, but listings themselves aren't checked | 3 · Answers rarely show sources | **4** · Strong *only if* every action and fact has a record (activity log, sources) | 2 · Chat history is the only record |
| 2 Effort to a good shortlist | 2 · You sift thousands of results | 3 · Helps you ask, but you still sift | **5** · The agent ranks against the brief and explains why | 4 · Low effort, but hard to compare |
| 3 Control over commitments | **5** · Nothing happens without you | 4 | 4 · Approval steps keep this high; a standing permission lowers it by choice | 2 · Easy to agree to things in passing |
| 4 Vague needs | 1 · Filters only | 3 · Can translate needs into filters | **5** · Needs live in the brief; commute is calculated | 4 · Natural, but no structure to edit |
| 5 Group fit | 2 · Screenshots on WhatsApp | 2 | 4 · Shared shortlist with votes, by link | **4** · Already where families talk |
| 6 Failure cost and recovery | 4 · Mistakes are yours, and visible | 3 | 3 · Agent errors can cost a wasted visit; the log and undo make recovery possible | 2 · Hard to see and undo what happened |
| **Total (of 30)** | 17 | 18 | **25** | 18 |

**Agentic-first wins on effort, vague needs and shortlisting, and holds on trust and control only
because of three commitments:**
1. Every fact comes from a tool and shows its source.
2. Every action is logged and reversible.
3. Anything that contacts a person, books time, shares data or spends money needs approval, or is on
   the never list.

Without these, it would score below traditional on trust and recovery. They are design requirements,
not features.

## 4. Where the agent hands over

Direct control beats conversation in these moments, so the agent hands over:

| Moment | Why direct control wins | Hand-over |
|---|---|---|
| Browsing photos and videos | Visual scanning is faster than description | Full-screen gallery from any listing |
| Exploring a neighbourhood | People think spatially about areas | Map view, with a list alternative for accessibility |
| Comparing finalists | Side-by-side scanning beats reading | Compare table, 2–4 columns |
| Editing the brief | Quicker to toggle than to explain | Brief chips: tap to edit, remove or reprioritise |
| Reviewing a message to an owner | The words go out in your name | Editable draft before approval |
| Adjusting a visit plan | Time is easier to drag than to describe | Draggable slots, then confirm |

Zero-UI ideas kept: co-deciders join through a **shared link** that works from WhatsApp, and
**digests** arrive as notifications.

## 5. Concepts

Three ways to structure an agentic-first product:

| Concept | Idea | Strength | Weakness |
|---|---|---|---|
| **A. Concierge chat** | One long conversation with cards inside it | Simple, familiar | Results scroll away; hard to see state |
| **B. Brief and board** | Conversation is the input; a board (brief, shortlist, tasks, activity) is the output | State is always visible; supports the group | Two areas to understand on a small screen |
| **C. Missions** | The agent runs named tasks (Find, Check, Ask, Visit, Decide), each a card with progress | Makes the work visible | Feels like project management |

**Chosen: B, with C's task cards inside the board.** The working name is **"conversation in, board
out."**
- **Phone:** the chat is home; the board is one tap away ("Board · 3 tasks running").
- **Tablet and desktop:** chat and board sit side by side.

This keeps the agent's state visible (criterion 1) without making people manage a project.

## 6. Storyboard (Rohan, renting)

1. **Brief.** "2BHK for me and a flatmate, under 40 minutes to Bellandur at 9 am, budget ₹45k, no
   brokers." The agent asks two questions as tap answers (furnished? pets?) and shows the brief as
   chips.
2. **Shortlist.** Six homes, ranked. Each has "matches 7 of 8" and one miss ("no balcony"). Two are
   flagged: "Photos may be old" and "Deposit 10 months, higher than nearby."
3. **Check.** He opens one. The verification record shows: owner confirmed (when, how), listed
   3 days ago, photos dated, price against nearby listings.
4. **Ask.** "Ask these 3 owners if pets are fine and if the deposit is negotiable?" He edits one
   question and approves. The board shows "Asking 3 owners · 0 of 3 replied."
5. **Replies.** Two reply. One says no pets, so it drops out with the reason shown.
6. **Visit.** Saturday is planned: two homes, 25 minutes apart, slots confirmed with the owners after
   his approval.
7. **Decide together.** He shares the finalists with his flatmate by link. She votes from WhatsApp;
   the board shows one agreement and one disagreement (commute versus rent).
8. **Next steps.** A checklist: agreement terms, the deposit receipt, and a reminder that the agent
   never pays and he shouldn't pay a token before visiting.

## 7. Gate

✅ Concept chosen with its rationale: **agentic-first, structured as "conversation in, board out"**,
with the six hand-over points above. Approved under the blanket approval of 13 Nov 2026.
