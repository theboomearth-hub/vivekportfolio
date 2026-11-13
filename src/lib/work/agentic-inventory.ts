/**
 * End-to-end use case: MW-Inventory, a conversational agent for DOOH inventory,
 * designed and built solo by Vivekanand (live prototype: mwagent.netlify.app).
 *
 * Every product claim here was verified against the live build (Nov 2026):
 * tool names from its client bundle, the stream format and session memory from
 * its /api/chat traffic, exports and input modes from the UI. Screens were captured
 * from the real interface with an illustrative SAMPLE inventory, because the live
 * deployment's inventory feed was offline — the page says so.
 */

export const LIVE_URL = "https://mwagent.netlify.app/";

const img = (file: string, width: number, height: number, alt: string) => ({
  src: `/work/agentic-inventory/${file}`,
  width,
  height,
  alt,
});

export const hero = img(
  "product-frame.jpg",
  2000,
  1250,
  "MW-Inventory desktop app: conversation history on the left, and an AI-built media plan for $5,000 a day across six screens and three cities, with exports and a Build Proposal action.",
);

export const facts = [
  { term: "Role", detail: "Sole designer and engineer" },
  { term: "Scope", detail: "Product, conversation and interface design; front end; agent tooling" },
  { term: "Built with", detail: "Next.js, React, Vercel AI SDK streaming, Recharts, Excel and PowerPoint export" },
  { term: "Status", detail: "Use case · live prototype" },
];

/** The agent's user-facing tools, grouped by campaign stage (18, plus one context tool). */
export const stages = [
  { name: "Discover", question: "Which screens fit?", tools: ["search_screens", "get_screen_detail", "compare_screens", "get_audience_profile", "get_route_plan", "get_weather_context"] },
  { name: "Plan", question: "What’s the best mix for my budget?", tools: ["build_media_plan", "build_optimized_plan", "get_shortlist", "save_named_plan"] },
  { name: "Propose", question: "Can I share it?", tools: ["build_proposal"] },
  { name: "Book", question: "Lock it in.", tools: ["confirm_booking", "get_campaign_timeline"] },
  { name: "Monitor", question: "Is it delivering?", tools: ["get_live_pacing", "get_anomalies", "get_campaign_confidence", "get_inventory_stats"] },
  { name: "Learn", question: "What should the next flight do?", tools: ["get_campaign_debrief"] },
];

export const toolCount = stages.reduce((n, s) => n + s.tools.length, 0);

export const principles = [
  {
    title: "Answers are interfaces",
    body: "Every tool has its own view, with lenses to switch between: screens as cards, a map, by city, cost against reach or a table; a plan as a list, city allocation or cost bars; pacing as a chart or KPIs.",
  },
  {
    title: "Never a blank box",
    body: "The empty state offers a starter for each job (explore, plan, analyse, monitor), and every answer ends with three numbered next steps plus suggested follow-ups.",
  },
  {
    title: "The planner commits, not the agent",
    body: "The agent proposes. Booking is a separate step the planner asks for, and the confirmation lists the order ID, dates and every screen. Plans export to Excel and PowerPoint for review outside the agent.",
  },
  {
    title: "Memory that scopes the conversation",
    body: "Each request carries the last plan’s screens, saved plans and pinned queries, so “book this plan” means this plan.",
  },
  {
    title: "Many ways in",
    body: "Type, use slash commands, attach a brief, or speak. Answers can be read aloud.",
  },
  {
    title: "Problems arrive with a fix",
    body: "Anomalies are ranked by severity, each naming the affected screen and a suggested action. Pacing carries a plain status: on track.",
  },
];

export interface JourneyStep {
  n: string;
  stage: string;
  prompt: string;
  tool: string;
  body: string;
  images: ReturnType<typeof img>[];
}

export const journey: JourneyStep[] = [
  {
    n: "01",
    stage: "Discover",
    prompt: "Show me all available screens",
    tool: "search_screens",
    body: "The agent searches live inventory and ranks screens by reach. The same answer switches between cards, a map, a by-city view, cost against reach, and a sortable table, without a follow-up question.",
    images: [
      img("discover-cards.jpg", 1510, 2328, "Answer listing 10 available screens as cards, each with venue, city, daily impressions, CPM and a save button, with view tabs for List, Map, By City, CPM vs Reach and Table."),
      img("discover-cpm-reach.jpg", 1510, 1372, "The same answer as a scatter chart of CPM against daily reach for each screen."),
      img("discover-table.jpg", 1510, 1596, "The same answer as a sortable table of screens with city, venue, impressions per day, CPM and status."),
    ],
  },
  {
    n: "02",
    stage: "Understand",
    prompt: "Show the audience profile for Mumbai airport screens",
    tool: "get_audience_profile",
    body: "Before spending, the planner checks who the screens reach. The profile scores each audience segment and names the primary audience in one line.",
    images: [img("audience.jpg", 1510, 1694, "Audience profile for Mumbai airport screens: a radar chart and segment scores, with Traveller as the primary audience at a 92 index.")],
  },
  {
    n: "03",
    stage: "Plan",
    prompt: "Build a media plan for $5,000 a day over 14 days",
    tool: "build_media_plan",
    body: "A budget and a flight length become a plan: screens, allocation, impressions, reach, frequency and CPM, plus what’s left unspent. Excel and PowerPoint exports are one click away.",
    images: [
      img("plan.jpg", 1510, 1652, "Media plan card: $5,000 a day, six screens in three cities, 540K impressions a day, 2.4M reach over 14 days, a by-venue donut, allocation per screen and Excel, PPT, Shortlist and Build Proposal actions."),
      img("plan-city-allocation.jpg", 1510, 1332, "The same plan viewed as a city allocation chart."),
    ],
  },
  {
    n: "04",
    stage: "Propose",
    prompt: "Create a proposal for this plan",
    tool: "build_proposal",
    body: "A client-ready deck is generated from the plan (cover, campaign overview, investment summary and next steps) to review before it’s shared.",
    images: [img("proposal.jpg", 1510, 1372, "Proposal deck preview generated from the plan, with slide navigation and an export button.")],
  },
  {
    n: "05",
    stage: "Book",
    prompt: "Confirm booking for this plan",
    tool: "confirm_booking",
    body: "Booking is a step the planner takes on purpose. The confirmation lists the order ID, flight dates, cost and every reserved screen, with a CSV to download.",
    images: [img("booking.jpg", 1510, 1594, "Booking confirmed card: order ID, 14-day duration, impressions per day, estimated reach, total cost, go-live and end dates, and each reserved screen with its daily cost.")],
  },
  {
    n: "06",
    stage: "Schedule",
    prompt: "Show the campaign timeline",
    tool: "get_campaign_timeline",
    body: "Artwork deadlines and go-live dates for every screen, so nothing slips between booking and launch.",
    images: [img("timeline.jpg", 1510, 1602, "Campaign timeline with a bar per screen showing the artwork deadline and the live period.")],
  },
  {
    n: "07",
    stage: "Monitor",
    prompt: "Show live pacing for my campaign · Check anomalies",
    tool: "get_live_pacing · get_anomalies",
    body: "Mid-flight, pacing compares planned and actual spend and impressions day by day under a plain status. Anomalies arrive ranked by severity, each with the affected screen and a suggested action.",
    images: [
      img("pacing.jpg", 1510, 1688, "Live pacing card on day 7 of 14 marked On Track, with budget and impression delivery bars, sparklines and a daily spend versus impressions chart."),
      img("anomalies.jpg", 1510, 1694, "Anomaly monitor with five alerts, two critical, including an under-delivering screen and a CPM spike on metro screens, each with a suggested action."),
    ],
  },
  {
    n: "08",
    stage: "Learn",
    prompt: "Generate a campaign debrief",
    tool: "get_campaign_debrief",
    body: "After the flight, the debrief compares delivery, reach and cost with the plan, names the top screens, and turns insights into recommendations for the next flight.",
    images: [img("debrief.jpg", 1510, 2574, "Campaign debrief with KPIs against plan, top performing screens, key insights, recommendations and a next-flight suggestion.")],
  },
];

export const phone = [
  img("mobile-home.jpg", 900, 1948, "Phone: the empty state with suggested prompts to explore, plan, analyse and monitor."),
  img("mobile-discover.jpg", 900, 1948, "Phone: screens as cards."),
  img("mobile-plan.jpg", 900, 1948, "Phone: the media plan with venue split and actions."),
  img("mobile-pacing.jpg", 900, 1948, "Phone: live pacing."),
];

export const nextSteps = [
  "One currency everywhere: answers, cards and exports should share the market’s currency and number format.",
  "Natural-language amounts: “₹2 lakh” or “50k” should become the budget the planner meant.",
  "Model-based intent routing that asks a clarifying question when a request is ambiguous, instead of matching keywords.",
  "Graceful states when a data feed is down: say what’s unavailable rather than showing zeros.",
];
