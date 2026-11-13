/**
 * Use case: Hosamane, an agentic-first home search for Bengaluru (rent and buy). Designed and built by
 * Vivekanand, self-initiated, fast track (no participant research).
 *
 * Sources for everything here: docs/property-discovery/ (02 desk research, 03 define, 04 paradigm gate,
 * 05 agent spec, 07 design system, 09 validation). Screens are captures of the working prototype
 * (~/Documents/hosamane-prototype) at four sizes; all listings, owners and builders are fictional.
 * Numbers marked as measured come from review coding, axe and the prototype's agent tests.
 */
import type { CaseImage } from "@/components/case/CaseParts";
import type { Persona } from "@/components/sketch/PersonaCard";
import type { SystemStep } from "@/components/sketch/AgentSystem";
import type { Chapter, Device, Screen } from "@/lib/work/healthai";
import manifest from "./hosamane-images.json";

const dims = manifest as unknown as Record<string, [number, number]>;
const SIZE_NAME: Record<Device, string> = { phone: "Phone", tablet: "Tablet", landscape: "Tablet landscape", web: "Desktop" };
const FILE_SIZE: Record<Device, string> = { phone: "phone", tablet: "tablet", landscape: "landscape", web: "desktop" };

function shot(device: Device, step: string, label: string, describe: string): Screen {
  const file = `${FILE_SIZE[device]}-${step}.jpg`;
  const [width, height] = dims[file] ?? [1200, 900];
  return { src: `/work/hosamane/${file}`, width, height, code: step, label, alt: `${SIZE_NAME[device]}, ${label}: ${describe}` };
}

const STEPS: Record<string, [string, string]> = {
  home: ["Agent home", "the agent asks what you're looking for, with three starters and a note that listings are fictional."],
  brief: ["Brief and one question", "the request becomes brief chips, one marked as an assumption, and the agent asks one clarifying question with tap answers."],
  shortlist: ["Ranked shortlist", "six homes ranked against the brief, each with how many criteria it matches, what it misses, commute time and flags such as reused photos or a high deposit."],
  listing: ["A listing, checked", "photos, the full move-in cost itemised, a verification record with sources and dates, commute at 9 am and area facts with sources."],
  ask: ["Review before sending", "draft questions to three owners, sent through a masked relay, with Send, Edit and Not now."],
  replies: ["Replies arrive", "owners' answers; homes that don't allow pets drop out with the reason shown."],
  visits: ["A day of visits", "a proposed Saturday route with slots in time order, waiting for approval."],
  "visits-done": ["Visits requested", "two confirmed and one owner offering a later time."],
  shared: ["Shared with a co-decider", "a share link for the flatmate that works from WhatsApp and expires in seven days."],
  "share-page": ["The co-decider's view", "the flatmate sees only the finalists, picks one and adds a note, with no app or account."],
  recommend: ["A recommendation with reasons", "the agent's pick, the vote it got, the trade-off, and anything still unconfirmed."],
  compare: ["Compare", "finalists side by side: rent, upfront cost, commute, size, checks and the owner's answer on pets."],
  guard: ["Where the agent says no", "a request to filter by diet is refused, with the reason and what the agent can do instead."],
  "buy-shortlist": ["Buying: shortlist", "a buyer's brief with budget and down payment, and the matching home."],
  "buy-listing": ["Buying: the all-in cost", "price, stamp duty and cess, registration, GST and corpus with the total first, and an EMI estimate with the rate's date."],
  "buy-listing-checks": ["Buying: checks", "the project's registration can't be found on Karnataka RERA, so the agent warns against paying a booking amount."],
  "guard-safety": ["No safety scores", "asked whether an area is safe, the agent declines to rate it and shows water, flooding and metro facts with sources."],
  board: ["Board", "the brief as editable chips, and the shortlist, tasks and decisions in tabs."],
  activity: ["Activity", "everything the agent did, with times and the tool used."],
  you: ["You", "the brief, what the agent may do at each level, the never list, and a button to forget everything."],
};
const s = (d: Device, step: string) => shot(d, step, STEPS[step][0], STEPS[step][1]);
const all = (steps: string[]) => ({ phone: steps.map((x) => s("phone", x)), tablet: steps.map((x) => s("tablet", x)), landscape: steps.map((x) => s("landscape", x)), web: steps.map((x) => s("web", x)) });

export const devices: { id: Device; label: string; size: string }[] = [
  { id: "phone", label: "Phone", size: "390 × 844" },
  { id: "tablet", label: "Tablet", size: "834 × 1194" },
  { id: "landscape", label: "Tablet landscape", size: "1194 × 834" },
  { id: "web", label: "Desktop", size: "1440 × 900" },
];

export const chapters: Chapter[] = [
  { n: "01", title: "Say what you need", body: "One question to start: what are you looking for? Rohan types his office, budget, flatmate and cat in one sentence. The agent turns it into brief chips, marks what it assumed, and asks a single tap-to-answer question instead of a form.", decision: "Ask at most two questions before the first results; assume the obvious and show the assumption.", screens: all(["home", "brief"]) },
  { n: "02", title: "A shortlist with reasons", body: "Six homes, ranked against his brief, not thousands sorted by an unexplained “relevance”. Each card says how many criteria it meets, what it misses, the commute at 9 am, and what needs a closer look.", decision: "Fewer, better: every rank comes with its reasons.", screens: all(["shortlist"]) },
  { n: "03", title: "Checked, with receipts", body: "Opening a home shows the full move-in cost first, then a verification record: what was checked, by whom, when, and what couldn't be checked yet. Area facts come with sources. There's no safety score.", decision: "Facts have receipts; unknowns are said plainly.", screens: all(["listing"]) },
  { n: "04", title: "Ask before acting", body: "“Ask the top 3 owners if pets are OK.” The agent drafts the messages; Rohan reviews, edits if he wants, and approves. Replies arrive on the board, and homes that don't allow pets drop out with the reason.", decision: "Anything that contacts a person needs a tap, and the server checks the approval, not just the interface.", screens: all(["ask", "replies"]) },
  { n: "05", title: "A day of visits", body: "The agent plans a Saturday in an order that fits each owner's slots, and requests them only after approval. One owner offers a later time; the plan shows it.", decision: "The agent proposes; owners and the person confirm.", screens: all(["visits", "visits-done"]) },
  { n: "06", title: "Decide together", body: "His flatmate gets a link that opens on WhatsApp, with no app or account, and votes for one home with a note. The agent's recommendation weighs the vote, the notes from visits and anything still unconfirmed.", decision: "Bring co-deciders in without asking them to install anything.", screens: all(["shared", "share-page", "recommend"]) },
  { n: "07", title: "Buying: the checks that matter", body: "Meera and Karthik's brief includes a down payment. The listing leads with the all-in cost (stamp duty, the 2% registration fee, GST if under construction) and an EMI with the rate's date. This project's registration can't be found, so the agent says so and warns against a booking amount.", decision: "For buyers, registration and khata status are first-class checks.", screens: all(["buy-listing", "buy-listing-checks"]) },
  { n: "08", title: "Where the agent says no", body: "Asked to filter by diet, it refuses and offers to ask every owner the same neutral house-rules question. Asked whether an area is safe, it shows facts with sources rather than a score.", decision: "The never list is enforced in code and tested.", screens: all(["guard", "guard-safety"]) },
];

export const hero: CaseImage = { src: "/work/hosamane/hero.jpg", width: 2000, height: 1250, alt: "Hosamane on desktop and phone: the agent's ranked shortlist beside the board with the brief as chips, and on the phone a review card for messages to three owners." };

export const wireCompare = (["home", "shortlist", "listing", "ask"] as const).map((step) => ({
  step,
  label: STEPS[step][0],
  wire: { src: `/work/hosamane/wire-phone-${step}.jpg`, width: dims[`wire-phone-${step}.jpg`]?.[0] ?? 780, height: dims[`wire-phone-${step}.jpg`]?.[1] ?? 1688, alt: `Wireframe, phone, ${STEPS[step][0]}.` },
  final: s("phone", step),
}));

export const facts = [
  { term: "Role", detail: "Designer and builder, end to end (self-initiated)" },
  { term: "Scope", detail: "Desk research, agent architecture, interface for four sizes, working prototype" },
  { term: "Built with", detail: "Next.js, Claude Opus 5.5 as the planner (scripted fallback), 19 typed tools, server-signed approvals" },
  { term: "Status", detail: "Use case · design concept with a working prototype" },
];

// Proto-personas from docs/property-discovery/03-define.md §1 (public evidence and assumptions, not interviews).
// Doodles: Open Peeps (CC0), see public/doodles/CREDITS.txt.
export const personas: Persona[] = [
  {
    name: "Rohan",
    role: "Renting",
    meta: "27 · software engineer · moving from Pune for a job on the Outer Ring Road · renting with a flatmate (and a cat)",
    figures: [{ src: "/doodles/people/rohan.svg", alt: "Doodle of Rohan frowning at his phone." }],
    lists: [
      { label: "Wants", items: ["A 2BHK his flatmate agrees on", "Under 40 minutes to the office", "No brokerage"] },
      { label: "Worries", items: ["Fake or already-rented listings", "Brokers posing as owners", "Losing weekends to wasted visits"] },
    ],
    trust: { label: "Trusts an agent that", text: "shows what it checked, and never charges to talk to an owner." },
    basis: "proto",
  },
  {
    name: "Meera and Karthik",
    role: "Buying",
    meta: "34 and 36 · renting in HSR Layout · buying their first home, a 2–3BHK for about ₹1.4 Cr",
    figures: [
      { src: "/doodles/people/meera.svg", alt: "Doodle of Meera reading papers." },
      { src: "/doodles/people/karthik.svg", alt: "Doodle of Karthik standing beside her." },
    ],
    lists: [
      { label: "Wants", items: ["Clean papers from a builder with a good record", "One all-in cost to plan a loan around"] },
      { label: "Worries", items: ["Project delays", "Khata status", "Costs beyond the headline price"] },
    ],
    trust: { label: "Trusts an agent that", text: "shows legal checks with their source and date, and one number for the total." },
    basis: "proto",
  },
  {
    name: "Lakshmi",
    role: "Co-decider",
    meta: "61 · Karthik's mother · in Mysuru · uses WhatsApp, not property apps",
    figures: [{ src: "/doodles/people/lakshmi.svg", alt: "Doodle of Lakshmi smiling, with a cup of coffee." }],
    lists: [
      { label: "Wants", items: ["To see the two or three finalists and say yes or no"] },
      { label: "Won't", items: ["Install an app or make an account"] },
    ],
    trust: { label: "Included by", text: "a link that opens the shortlist and lets her vote." },
    basis: "proto",
  },
];

// Signal: what finding a home in Bengaluru feels like today (02 desk research; 43% from the review coding).
export const painPoints = [
  { doodle: "doubt", title: "Listings you can't check", text: "Fake, stale or already taken: 43% of searchers in the review sample hit one." },
  { doodle: "receipt", title: "Costs that surface late", text: "Deposits of six to nine months' rent, found after the first call." },
  { doodle: "calendar", title: "Weekends lost to visits", text: "Owners who don't show, homes that don't match at the door." },
  { doodle: "apart", title: "Co-deciders left out", text: "A flatmate or parent with a say, but no part in the search." },
];

export const keyNumbers = [
  { value: "300", label: "App Store reviews coded against a codebook" },
  { value: "19", label: "Typed tools behind the agent" },
  { value: "30 / 30", label: "Agent tests passed, on both planners" },
  { value: "4", label: "Screen sizes, from phone to desktop" },
];

// Today's journey, as-is (03-define §3), shortened.
export const journey = [
  { stage: "Need", today: "Thinks in an office, a budget and a flatmate.", pain: "Platforms ask for localities.", opportunity: "A brief built from life, not localities." },
  { stage: "Search", today: "16,000–31,000 results, ranked without reasons.", pain: "Too many choices, no reasons.", opportunity: "A short list, each with what it matches and misses." },
  { stage: "Judge", today: "Photos of unknown age; costs behind links.", pain: "Can't tell what's true or what it costs.", opportunity: "A verification record and one all-in cost." },
  { stage: "Contact", today: "Pays to see numbers; brokers answer.", pain: "Paywalls, posing brokers, spam.", opportunity: "Free contact through a masked relay." },
  { stage: "Visit", today: "Owners don't show; surprises at the door.", pain: "Lost weekends.", opportunity: "Questions first, then a planned route." },
  { stage: "Decide", today: "Screenshots to family on WhatsApp.", pain: "Context lost, slow.", opportunity: "A shared shortlist with votes." },
  { stage: "Commit", today: "Token money, agreements, bookings.", pain: "Scam risk, surprise charges.", opportunity: "A checklist; the agent never pays." },
];

// Competitor gaps (02 §5), with Hosamane's answer as the last column.
export const matrix: { label: string; cells: { state: "yes" | "partial" | "no"; note: string }[] }[] = [
  { label: "AI that acts for the searcher", cells: [{ state: "no", note: "None found; ChatGPT apps hand off to the site" }, { state: "partial", note: "Zillow and Gemini book tours, can't contact owners" }, { state: "yes", note: "Searches, checks and drafts; acts after a tap" }] },
  { label: "Asking owners, with approval", cells: [{ state: "no", note: "Paid human managers book meetings" }, { state: "no", note: "None found" }, { state: "yes", note: "Drafts to owners, sent only once approved" }] },
  { label: "Shortlist for co-deciders", cells: [{ state: "no", note: "None confirmed" }, { state: "yes", note: "Zillow co-shopper messaging and saves" }, { state: "yes", note: "A WhatsApp link to vote, no app" }] },
  { label: "One all-in cost", cells: [{ state: "partial", note: "Deposit and maintenance as separate fields" }, { state: "yes", note: "Zillow's total monthly price (reported)" }, { state: "yes", note: "The total first, itemised second" }] },
  { label: "Fair-housing guardrail", cells: [{ state: "no", note: "None found" }, { state: "yes", note: "Zillow's Fair Housing Classifier" }, { state: "yes", note: "The never list, in code and tested" }] },
];

export const antiPersona = {
  name: "The bulk lead collector",
  text: "A broker who uses an agent to harvest owners' numbers at scale. The design makes it pointless: numbers stay masked, owner messages are limited per person, and nothing exports in bulk.",
};

export const verdicts: { h: string; text: string; verdict: string }[] = [
  { h: "H1", text: "Listings can't be trusted", verdict: "Supported" },
  { h: "H2", text: "The true cost is hidden", verdict: "Supported, reframed" },
  { h: "H3", text: "Filters can't express real needs", verdict: "Supported" },
  { h: "H4", text: "Deciding is a group activity", verdict: "Supported by inference" },
  { h: "H5", text: "Arranging visits is a mess", verdict: "Partly supported" },
  { h: "H6", text: "People delegate if they can see what was done", verdict: "Supported" },
  { h: "H7", text: "The broker is the mental model", verdict: "Supported" },
  { h: "H8", text: "The platform's business model is itself a trust problem", verdict: "Added from evidence" },
];

export const reviewThemes = [
  { theme: "Paid plans and refunds", n: 72, pct: 56 },
  { theme: "Support or an assigned manager not helping", n: 49, pct: 38 },
  { theme: "Any trust problem (fake or stale, broker posing, spam)", n: 55, pct: 43 },
  { theme: "Search and filters", n: 15, pct: 12 },
  { theme: "Hidden or unclear property costs", n: 7, pct: 5 },
];

export const gaps = [
  { capability: "AI that acts for the searcher", india: "None found; ChatGPT apps hand off to the site", global: "Zillow AI mode books tours; Gemini books Zillow tours but can't contact owners" },
  { capability: "Asking owners questions with approval", india: "None (paid human managers book meetings)", global: "None found" },
  { capability: "Shared shortlist for co-deciders", india: "None confirmed", global: "Zillow co-shopper messaging and shared saves" },
  { capability: "One all-in cost", india: "Deposit and maintenance as separate fields", global: "Zillow shows a total monthly price (reported)" },
  { capability: "Fair-housing guardrail on AI answers", india: "None found", global: "Zillow's Fair Housing Classifier" },
];

export const cityFacts = [
  { figure: "6–9 months", text: "of rent is the usual deposit, sometimes 12. Karnataka hasn't adopted the Model Tenancy Act, and its Rent Act sets no cap." },
  { figure: "≈ 7.6%", text: "on top of the price when buying above ₹45 lakh: 5% stamp duty, 2% registration (doubled from 31 Aug 2025) and cess." },
  { figure: "Oct 2024", text: "e-khata became mandatory for sale and mortgage; B-khata limits loans and resale." },
  { figure: "₹2 crore", text: "taken from 22 people by a fake broker on a listing platform; scams centre on money before a visit." },
  { figure: "0.22 vs 0.35", text: "landlords' response rate to Muslim vs upper-caste Hindu applicants in a Delhi audit. Private landlords aren't covered by law." },
  { figure: "34.5–38 min", text: "for 10 km at peak hour (traffic police vs TomTom), so commute time, not distance, is what to search by." },
];

export const psychology = [
  { finding: "56% of searchers complain about paywalls", principle: "Loss aversion", decision: "Free for searchers; no pay-to-contact" },
  { finding: "43 of 51 reviews of paid human managers are negative, mostly about invisible work", principle: "Operational transparency", decision: "An activity log and live task progress" },
  { finding: "16,000–31,000 results, unexplained ranking", principle: "Choice overload", decision: "A ranked shortlist of 5–8 with reasons" },
  { finding: "43% hit fake, stale or posing listings", principle: "Trust calibration", decision: "A verification record with source and date per check" },
  { finding: "Costs split across cards, links and pages", principle: "Mental accounting", decision: "The total first, itemised second" },
  { finding: "Tenant-type labels on all three platforms reviewed", principle: "Fairness", decision: "The never list, enforced in code" },
];

export const paradigmScores = [
  { name: "Traditional", score: 17 },
  { name: "Hybrid", score: 18 },
  { name: "Zero-UI", score: 18 },
  { name: "Agentic-first", score: 25 },
];

export const toolLevels = [
  { level: "Inform", note: "Always on", tools: ["update_brief", "search_listings", "get_listing", "verify_listing", "estimate_move_in_cost", "estimate_purchase_cost", "check_project_registration", "get_commute", "get_neighbourhood", "compare_listings", "collect_votes", "summarise_visit_notes"] },
  { level: "Prepare", note: "Drafts for you", tools: ["draft_owner_message", "plan_visit_route"] },
  { level: "Act with approval", note: "Server-checked approval every time", tools: ["send_owner_message", "schedule_visits", "share_shortlist", "report_listing"] },
  { level: "Standing permission", note: "Only if you set it up", tools: ["watch_search"] },
];

// The agent's turn, as the prototype runs it (lib/hosamane/agent-llm.ts, approval.ts, guard.ts).
export const systemSteps: SystemStep[] = [
  { lane: "you", short: ["Say what", "you need"], text: "You describe your move in your own words." },
  { lane: "code", short: ["Guard: the", "never list"], text: "Code checks the message against the never list first.", note: "Refusals happen here, before the model runs." },
  { lane: "model", short: ["Chooses", "tools"], text: "Claude chooses which tools to call." },
  { lane: "code", short: ["Tools: facts", "or a draft"], text: "The tools return facts from the listings, or prepare a draft action." },
  { lane: "model", short: ["Writes", "the reply"], text: "Claude writes the reply from the tools' results." },
  { lane: "code", short: ["Checks words", "and numbers"], text: "Code checks the reply for banned words and figures no tool returned." },
  { lane: "you", short: ["Tap", "approve"], text: "To send, book, share or report, you tap approve on a card.", note: "Nothing reaches an owner without this tap." },
  { lane: "code", short: ["Signs a token,", "then acts"], text: "The server signs a short-lived token, and only then does the action run.", note: "Claude never sees this secret." },
];

export const neverList = ["Pay or sign anything", "Share ID documents or a phone number without explicit consent", "Filter by religion, caste, diet or marital status"];

// Both planners run the same suite. Model figures: four consecutive runs, identical results (09-validation §1).
export const validation = {
  evals: {
    passed: 30, total: 30,
    groups: [
      { name: "Search briefs", scripted: "12 / 12", model: "12 / 12" },
      { name: "Approval before acting", scripted: "6 / 6", model: "6 / 6" },
      { name: "Never list", scripted: "12 / 12", model: "12 / 12" },
      { name: "Never list, reworded past the regex guard", scripted: "0 / 8", model: "8 / 8" },
    ],
    top5: "22 of 22",
    model: { name: "Claude Opus 5.5", runs: 4, medianTurn: "4.4 s", costPerRun: "about $0.30" },
  },
  a11y: { clean: 34, total: 34, firstRun: 13 },
  tiles: [
    { value: "30 / 30", label: "Core agent tests", note: "On both the scripted and the Claude planner" },
    { value: "8 / 8", label: "Reworded never-list requests refused by Claude", note: "Scripted planner: 0 of 8" },
    { value: "34 / 34", label: "Interface states with no accessibility violations", note: "First run: 13 of 34" },
    { value: "4.4 s", label: "Median turn with Claude", note: "About $0.30 per run of the whole suite" },
  ],
  caught: [
    { doodle: "receipt", title: "A number no tool returned", text: "The first run scored 28 of 30: a suggested budget came from the planner, not a tool. Now the search tool returns its own suggestions." },
    { doodle: "doubt", title: "Rewording beats a regex", text: "The guard caught “no Muslim owners” but not “people of our faith”. Claude refused all 8 rewordings, every run." },
    { doodle: "apart", title: "“The Bellandur one”", text: "Two shortlisted homes matched. The scripted planner took the first; Claude asked which." },
    { doodle: "ui", title: "Faded cards failed contrast", text: "13 of 34 states passed at first. Approved cards now get a grey edge instead of fading." },
  ],
};

// What the agent may do, from least to most autonomy (05-agent-spec §2); the last rung never happens.
export const ladder = [
  { level: "Inform", note: "Always on: search, check, cost, commute, compare.", items: ["search_listings", "verify_listing", "+10 more"] },
  { level: "Prepare", note: "Drafts for you to look at.", items: ["draft_owner_message", "plan_visit_route"] },
  { level: "Act with approval", note: "Runs only after your tap, checked by the server.", items: ["send_owner_message", "schedule_visits", "share_shortlist", "report_listing"], tone: "accent" as const },
  { level: "Never", note: "Pay or sign; share ID or numbers; filter by religion, caste, diet or marital status. No tool exists.", tone: "never" as const },
];

export const nextSteps = [
  { label: "First", doodle: "team", title: "Interviews", text: "6–8 people who rented or bought in Bengaluru last year, and 1–2 brokers, to replace the proto-personas." },
  { label: "Then", doodle: "approach", title: "Delegation tests", text: "A delegation sort and a Wizard-of-Oz study: where should the agent stop and ask?" },
  { label: "Then", doodle: "doubt", title: "A red team", text: "People who didn't build it try any wording to make the agent filter, pay or leak a number." },
  { label: "Later", doodle: "talk", title: "Hindi and Kannada", text: "Poppins covers Devanagari; Kannada needs a companion face." },
];
