# 07 · Identity and design system

Phase 7 of [PLAN.md](PLAN.md). Status: **complete** (13 Nov 2026). Choices here were made by Claude
under Vivekanand's blanket approval and are logged in the plan.

## 1. Working name: **Hosamane**

Kannada for "new home" (*hosa* = new, *mane* = home). It's rooted in Bengaluru, short, and says what
the product is for.

**Check:** a web search on 13 Nov 2026 found no app or property product with this name. This was a
web search, not a trademark search; a search of the Indian trademark registry is needed before any real
use. It is a working title for a design concept.

## 2. Direction

Three directions were considered:

| Direction | Feel | Why not / why |
|---|---|---|
| A. **Calm ledger** (chosen) | Deep teal and warm sand, generous space, numbers in tabular figures | Reads as trustworthy and unhurried, the opposite of urgency-driven portals. Teal is distinct from competitors (NoBroker and Magicbricks use red, 99acres blue, Housing.com purple) |
| B. Night market | Dark, high-contrast, neon accents | Energetic, but feels like a trading app, wrong for a high-stakes, family decision |
| C. Paper map | Cream, ink and terracotta, illustrated | Warm and local, but illustrations compete with listing photos and slow the build |

## 3. Colour tokens (contrast measured)

| Token | Hex | Use | Contrast |
|---|---|---|---|
| `ink` | #15181B | Text | 17.1:1 on canvas |
| `muted` | #596068 | Secondary text | 6.1:1 on canvas · 5.6:1 on surface |
| `canvas` | #FBFAF7 | App background (warm white) | — |
| `surface` | #F3F0EA | Cards in the board, chips | — |
| `card` | #FFFFFF | Listing cards, sheets | — |
| `border` | #E3DED5 | Hairlines (decorative only) | — |
| `control` | #857E74 | Input and control borders | 4.0:1 on white (≥ 3:1 required) |
| `primary` | #0F5F6B | Actions, the agent's mark, links | 7.3:1 with white |
| `primary-strong` | #0B4A54 | Text on primary-soft | 8.4:1 |
| `primary-soft` | #E2EFF0 | Agent bubbles, selected states | — |
| `success` / `success-soft` | #1D6F45 / #E4F2EA | ✓ checks passed | 5.3:1 |
| `warning` / `warning-soft` | #8F5205 / #FBEFD9 | ! flags | 5.5:1 |
| `danger` / `danger-soft` | #B42318 / #FCE8E6 | Scam warnings, stop | 5.6:1 |

Status is never shown by colour alone: ✓ ○ ! always carry words.

**Wire theme** (wireframes): canvas #F2F2F2, boxes #FFFFFF, lines #9A9A9A (decorative only), text
#3A3A3A, secondary text #6E6E6E (4.6:1). Photos become grey boxes with a label, and colour is removed.
The type and layout stay the same.

## 4. Type

**Poppins** by Indian Type Foundry (Ahmedabad), from 14 Nov 2026, at the owner's request. It covers
Latin and Devanagari, so Hindi (a "should" in 03 §9) can share the family; Kannada will need a
companion face. Regular, medium and semibold. The sizes below are unchanged.

*Before 14 Nov 2026:* **Anek Latin** by Ek Type (Mumbai). The same family has matching **Anek Kannada** and **Anek
Devanagari** designs, so Kannada and Hindi (a "should" in 03 §9) will look native rather than
bolted on. All three are on Google Fonts. Numbers use tabular figures.

| Role | Size / line height | Weight |
|---|---|---|
| Display (home question) | 30 / 1.15 (phone 26) | 500 |
| Title | 22 / 1.25 | 500 |
| Section | 17 / 1.35 | 500 |
| Body | 16 / 1.55 | 400 |
| Compact | 15 / 1.5 | 400 |
| UI | 14 / 1.4 | 400–500 |
| Caption | 13 / 1.4 | 400 |
| Label (never smaller) | 12 / 1.35 | 500 |
| Big number (cost totals) | 28 / 1.1, tabular | 500 |

Weights: 400 for text and 500 for headings and emphasis. The one exception is the big cost total, at 600.

## 5. Space, shape and depth
- **Spacing:** a 4 px base: 4, 8, 12, 16, 20, 24, 32, 40.
- **Radius:** 10 for controls, 14 for cards, 20 for sheets, full pills for chips.
- **Depth:** one shadow for floating sheets (0 12px 32px −12px, ink at 25%). Cards use a hairline,
  not a shadow.
- **Targets:** 44 px minimum for anything you tap; chips are 36 px tall with 44 px hit areas.

## 6. Icons and imagery
- **Icons:** Lucide (ISC licence), 1.75 px stroke, 20 px in the interface and 16 px in chips.
- **The agent's mark:** a small house outline with a spark, in primary. Used only where the agent
  speaks or acts.
- **Photos:** licensed interior photos (Unsplash licence), with a credit list kept in the prototype
  repo. One photo is deliberately reused across two listings, so the duplicate-photo check has
  something real to find.
- **Map:** a custom schematic of the Bengaluru localities in the dataset (Outer Ring Road, metro
  lines, lakes). No map tiles. Always paired with a list.

## 7. Components

| Component | States |
|---|---|
| Agent message | Thinking (with the tool being called) · streaming · done · error |
| Tool call row | Running · done (with a result summary) · failed |
| Brief chips | You said · I assumed · editing · removed |
| Listing card (rent / buy) | Default · flagged · removed (with reason) · shortlisted |
| Match line | Matches *n* of *m* · Misses: … |
| Verification record | ✓ passed · ○ not done · ! warning, each with source and date |
| Cost total | Rent move-in · buy all-in with EMI · breakdown expanded |
| Commute panel | Per anchor, at the stated time, by mode |
| Area facts | Each fact with source; never a safety score |
| Approval sheet | Review · editing · sending · sent (can't be unsent) |
| Task card | Queued · running (progress) · needs you · done · stopped |
| Visit planner | Proposed route · requested · confirmed · declined (with alternative) |
| Shared shortlist (co-decider) | Vote · comment · voted |
| Activity entry | Action, time, what changed, undo where possible |
| Refusal card | Rule · reason · what I can do instead |
| Scam warning | Warning · reported |
| Map with list | Map, list and selected |

## 8. Layout by size

| Size | Layout |
|---|---|
| Phone 390 | Agent home; the board in a bottom-sheet tab with a task badge; bottom bar: Agent · Board · Activity · You |
| Tablet 834 | Icon rail; agent full width; the board as a side sheet |
| Tablet landscape 1194 | Icon rail; agent and board side by side |
| Desktop 1440 | Sidebar; agent in the centre and the board on the right; listing detail opens over the board |

These are one responsive build, not four designs.
