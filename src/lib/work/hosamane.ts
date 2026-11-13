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
  caught: [
    "The first test run scored 28 of 30: when nothing matched, the agent suggested a budget figure it had worked out itself. The suggestions now come from the search tool, and the test wasn't relaxed.",
    "The regex guard catches “no Muslim owners” but not “people of our faith”. The scripted planner missed all 8 reworded requests; with Claude planning, all 8 were refused, in every run.",
    "After visits, “the Bellandur one” matched two shortlisted homes. The scripted planner took the first; Claude asked which one was meant.",
    "The first accessibility run passed 13 of 34 states: approved cards were faded below contrast requirements. They now get a grey edge instead.",
    "The visit planner booked a 10:00 slot after an 11:30 one. Slots are now assigned in time order, with travel.",
  ],
};

export const nextSteps = [
  "Interviews with 6–8 people who rented or bought in Bengaluru in the last year, and 1–2 brokers, to replace the proto-personas.",
  "A delegation sort and a Wizard-of-Oz test, to check where people want the agent to stop and ask.",
  "A red team of people who didn't build it, trying any wording to make the agent filter, pay, share contact details or state an unsourced number.",
  "Hindi and Kannada: Anek already has matching Devanagari and Kannada designs.",
];
