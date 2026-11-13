/**
 * Design gallery — real screens and case-study boards imported from Vivekanand's
 * Notion portfolio (Nov 2026) and the Shemaroo design archive linked from it.
 *
 * Images live in /public/work/gallery/<set>/. Width/height are the real pixel
 * sizes (used by next/image). Captions describe what each screen shows; summaries
 * use the Notion page's own wording where it exists.
 *
 * Privacy: the Deep Data Analysis screens were cropped above their ticket table,
 * which listed real people's names and employee IDs.
 *
 * HealthAI's phone screens are shared with its case study (/work/healthai) and live in
 * /public/work/healthai/.
 */

import { phoneScreens } from "@/lib/work/healthai";
import hosamaneImages from "@/lib/work/hosamane-images.json";

const hosamaneDims = hosamaneImages as unknown as Record<string, [number, number]>;
const hosamaneShot = (step: string, caption: string, alt: string): GalleryImage => {
  const [width, height] = hosamaneDims[`phone-${step}.jpg`] ?? [780, 1688];
  return { src: `/work/hosamane/phone-${step}.jpg`, width, height, caption, alt };
};

export interface GalleryImage {
  src: string;
  width: number;
  height: number;
  caption: string;
  alt: string;
}

export interface GallerySet {
  slug: string;
  title: string;
  /** e.g. "Enterprise SaaS · Product UI" */
  kind: string;
  /** Year(s) for shipped work, duration for concept studies. */
  when: string;
  platforms: string;
  summary: string;
  highlights: string[];
  facts?: string;
  links?: { label: string; href: string }[];
  note?: string;
  /** How thumbnails are cropped: desktop screens, phone screens, or one large board. */
  layout: "screen" | "phone" | "board";
  images: GalleryImage[];
}

const img = (set: string, file: string, width: number, height: number, caption: string, alt: string): GalleryImage => ({
  src: `/work/gallery/${set}/${file}`,
  width,
  height,
  caption,
  alt,
});

export const gallerySets: GallerySet[] = [
  {
    slug: "hosamane",
    title: "Hosamane, an agentic home search",
    kind: "PropTech · Agentic AI",
    when: "Use case",
    platforms: "Phone, tablet and desktop (working prototype)",
    summary:
      "An agent for finding a home to rent or buy in Bengaluru. It ranks homes against your brief with reasons, shows what it checked and when, works out the real move-in or all-in cost, and asks before it contacts anyone. These are phone captures of the working prototype; all listings are fictional.",
    highlights: [
      "Every result says how many of your criteria it meets and what it misses.",
      "A verification record per listing: what was checked, by whom, when, and what couldn't be checked yet.",
      "Messages to owners, visit bookings and sharing all need a tap, and the server checks the approval.",
      "A never list enforced in code: no payments, no ID documents, no filtering by religion, caste, diet or marital status.",
    ],
    facts: "Working prototype · 19 typed tools · 30 of 30 agent tests",
    links: [{ label: "Read the full case study", href: "/work/hosamane" }],
    layout: "phone",
    images: [
      hosamaneShot("home", "Agent home", "Phone: the agent asks what you're looking for, with starters."),
      hosamaneShot("shortlist", "Ranked shortlist", "Phone: homes ranked against the brief, each with matches, misses and flags."),
      hosamaneShot("listing", "A listing, checked", "Phone: a listing with its move-in cost and the start of the verification record."),
      hosamaneShot("ask", "Review before sending", "Phone: draft questions to three owners, waiting for approval."),
      hosamaneShot("replies", "Replies", "Phone: owners' answers; homes that don't allow pets drop out."),
      hosamaneShot("visits", "A day of visits", "Phone: a Saturday route waiting for approval."),
      hosamaneShot("share-page", "Co-decider view", "Phone: the flatmate votes from a link, with no app."),
      hosamaneShot("guard", "Where it says no", "Phone: a request to filter by diet is refused, with an alternative."),
    ],
  },
  {
    slug: "healthai",
    title: "HealthAI, an AI-first patient app",
    kind: "Healthcare · AI product design",
    when: "Use case",
    platforms: "Phone, tablet and web",
    summary:
      "A patient app for India that starts with the question most apps skip: do I need a doctor? Health AI asks three short questions, recommends a level of care and how soon, then hands off to booking, UPI payment, a video consultation, and a plan with reminders and records. These are the 17 phone screens; the case study has all 50, across four screen sizes.",
    highlights: [
      "Triage on a visible scale (self-care, doctor visit, emergency), with likely causes rated in words rather than percentages.",
      "“Guidance, not a diagnosis. In an emergency, call 112” stays on screen throughout the chat.",
      "The assessment carries into the booking, and the patient controls whether doctors see it.",
      "During the call, Health AI takes notes the patient can see and pause; the doctor signs the diagnosis.",
    ],
    facts: "50 screens · phone, tablet, tablet landscape and web",
    links: [{ label: "Read the full case study", href: "/work/healthai" }],
    layout: "phone",
    images: phoneScreens.map((sc) => ({ src: sc.src, width: sc.width, height: sc.height, caption: `${sc.code} · ${sc.label}`, alt: sc.alt })),
  },
  {
    slug: "aiops-platform",
    title: "Quinnox AIOps and integration intelligence platform",
    kind: "Enterprise SaaS · Product UI",
    when: "2020–21",
    platforms: "Web app",
    summary:
      "Three modules of Quinnox’s AIOps product for enterprise IT teams, designed while leading global UI/UX at Quinnox. Deep Data Analysis profiles a year of service tickets for quality, sentiment and trends. The Enterprise Knowledge Graph maps servers, applications and incidents as connected resources. Recommendations Overview audits an integration landscape for complexity and risk.",
    highlights: [
      "One header pattern across every module: a KPI, its change since last week, and an “Add a metric” slot.",
      "Progressive disclosure: “Show more” opens each summary card in place instead of sending people to another page.",
      "Six lenses on the same dataset (summary, forecast, field, correlation, trend and closure), so analysts switch questions, not tools.",
      "Early AI patterns: an in-product assistant, and a bar to chat with or speak to the knowledge graph.",
    ],
    note: "Client ticket data has been removed from the Deep Data Analysis screens.",
    layout: "screen",
    images: [
      img("aiops", "knowledge-graph.jpg", 1800, 2022, "Enterprise Knowledge Graph", "Quinnox AIOps platform: a machine, its network interface and machine type drawn as a graph, with resource filters and a bar to chat with or speak to the knowledge graph."),
      img("aiops", "summary-analysis.jpg", 1800, 2710, "Deep Data Analysis: summary", "Ticket-data profile with record count, languages, sentiment, missing values and observations, above an actual-versus-predicted ticket trend and a missing-values chart."),
      img("aiops", "forecast-analysis.jpg", 1800, 2099, "Forecast analysis", "The forecast lens of the ticket dataset, charting predicted ticket volumes."),
      img("aiops", "correlation-analysis.jpg", 1800, 2099, "Correlation analysis", "A correlation heatmap across ticket fields, with plain-language notes on the strongest relationships."),
      img("aiops", "closure-analysis.jpg", 1800, 2236, "Closure analysis", "Ticket closure trends over time, compared across categories."),
      img("aiops", "knowledge-graph-table.jpg", 1800, 1541, "Knowledge graph: table view", "The knowledge graph's resources listed as a table."),
      img("aiops", "knowledge-graph-network.jpg", 1800, 1541, "Knowledge graph: network view", "A clustered network of related resources."),
      img("aiops", "add-resource.jpg", 1800, 1541, "Add a resource item", "A dialog for adding a resource item to the graph."),
      img("aiops", "recommendations.jpg", 1800, 2569, "Integration recommendations", "Integration landscape overview (endpoints, patterns, platforms, systems of record, deployment models) with complexity analysis for WSO2 and MuleSoft interfaces."),
    ],
  },
  {
    slug: "flexehr",
    title: "FlexEHR patient site and booking",
    kind: "Healthcare · Web",
    when: "2024",
    platforms: "Responsive web",
    summary:
      "The patient-facing side of FlexEHR, an Indian healthcare SaaS covering all specialties. A hospital’s landing page leads straight into booking: choose an in-clinic or tele-consultation, pick a doctor, then a date and time slot.",
    highlights: [
      "Booking sits in the first scroll, not behind a menu.",
      "Doctor, date and slot on one screen, with the chosen slot always next to “Book now”.",
      "A single-doctor variant of the landing page for small clinics.",
    ],
    links: [{ label: "flexehr.in", href: "https://flexehr.in/" }],
    layout: "screen",
    images: [
      img("flexehr", "booking-slots.jpg", 1600, 1287, "Book an appointment", "Booking view: in-clinic or tele-consultation tabs, a list of doctors, a calendar and available time slots, and a Book now button."),
      img("flexehr", "landing.jpg", 1500, 5436, "Hospital landing page", "Hospital landing page with a booking widget, the medical team, how booking works, branches and hospital statistics."),
      img("flexehr", "single-doctor-landing.jpg", 1500, 3946, "Single-doctor landing page", "A landing page variant for a clinic with one doctor."),
    ],
  },
  {
    slug: "saasworld",
    title: "SaaSworld.club marketplace",
    kind: "Marketplace · Web",
    when: "2023",
    platforms: "Responsive web",
    summary:
      "A marketplace where small and medium businesses discover, compare and buy SaaS apps, and where vendors list their own products.",
    highlights: [
      "A landing page built around search, with category shortcuts and top-performing products.",
      "Listing and detail pages designed for comparing products.",
      "A step-by-step “List your application” flow for vendors.",
    ],
    layout: "screen",
    images: [
      img("saasworld", "landing.jpg", 1500, 8283, "Landing page", "Marketplace landing page: search, top-performing products, services, how it works, integrations, testimonials, statistics and FAQs."),
      img("saasworld", "product-list.jpg", 1500, 4737, "Product listing", "Trending and recently listed products with category filters."),
      img("saasworld", "product-detail.jpg", 1500, 7701, "Product detail", "A product page with overview, media and details."),
      img("saasworld", "list-your-app.jpg", 1500, 5396, "List your application", "A step-by-step form for vendors listing a product on the marketplace."),
    ],
  },
  {
    slug: "shemaroome",
    title: "ShemarooMe streaming apps",
    kind: "Entertainment · OTT",
    when: "2019",
    platforms: "Android, iOS, Android TV, responsive web",
    summary:
      "Consumer streaming apps for ShemarooMe, covering Bollywood, regional (Marathi, Gujarati, Punjabi), devotional (Bhakti, Ibaadat) and kids catalogues. The work covered browsing and playback, live TV, subscriptions by catalogue, household profiles and device limits.",
    highlights: [
      "A colour system for the catalogues: each one gets its own gradient, so viewers always know which world they’re in.",
      "Subscribe to just the catalogues you want, monthly or yearly, or take one plan for everything.",
      "Limits explained with a way out: the concurrent-stream and device-limit screens each offer the next step.",
      "Profiles for shared screens, including a Kids profile.",
    ],
    links: [{ label: "Shemaroo Entertainment", href: "https://www.shemarooent.com/" }],
    layout: "phone",
    images: [
      img("shemaroo", "store-banner-us.jpg", 1200, 2598, "App store banner", "App store banner reading “India’s favourite entertainment destination”, with the app on a phone."),
      img("shemaroo", "journey-01.jpg", 360, 640, "Home", "Home screen with catalogue tabs, a featured title, and Continue Watching and Bollywood Classic rows."),
      img("shemaroo", "ibaadat-landing.jpg", 360, 1145, "Catalogue landing", "Marathi catalogue landing with a featured film, Continue Watching and Marathi Movies rows."),
      img("shemaroo", "color-theme.jpg", 360, 1197, "Catalogue colour system", "Colour palette and a gradient for each catalogue, such as All, Bollywood Classic, Bollywood Plus and Gujarati."),
      img("shemaroo", "movie-detail-subscribed.jpg", 360, 719, "Movie detail", "Film detail for a subscriber, with synopsis, preview, watch later, share and a More in Drama row."),
      img("shemaroo", "android-tv-rows.jpg", 360, 2084, "Live TV", "Live TV channels (Bollywood TV, Kids TV, Gujarati TV, Bhakti TV) with what’s playing now."),
      img("shemaroo", "subscription-landing.jpg", 360, 1561, "Choose your plan", "Plan picker: ShemarooMe Premium for everything, or individual catalogue plans, monthly or yearly."),
      img("shemaroo", "modify-plans.jpg", 360, 643, "Modify plans", "Selecting several catalogue plans with a running total."),
      img("shemaroo", "view-plans.jpg", 360, 640, "Current plan", "Current plan view showing an expired free trial and an Add new plan button."),
      img("shemaroo", "whos-watching.jpg", 360, 640, "Who’s watching", "Profile picker with a Kids profile and a New profile option."),
      img("shemaroo", "manage-profiles.jpg", 360, 640, "Manage profiles", "Household profile management on iOS."),
      img("shemaroo", "concurrent-streaming.jpg", 360, 640, "Concurrent streaming limit", "Dialog explaining the account is streaming on too many devices, with Cancel and Retry."),
      img("shemaroo", "device-management.jpg", 360, 640, "Device limit reached", "Dialog explaining the device limit, with a Manage devices action."),
      img("shemaroo", "responsive-marathi-home.jpg", 320, 1240, "Responsive web: home", "Mobile web home for the Marathi catalogue."),
      img("shemaroo", "bollywood-landing.jpg", 1200, 712, "Web landing", "Desktop web landing page for Bollywood titles."),
    ],
  },
  {
    slug: "petzmates",
    title: "PetzMates, a community for pet owners",
    kind: "Concept · UX case study",
    when: "14 weeks",
    platforms: "Mobile app",
    summary:
      "A community app that connects pet owners with people who’ve faced the same situations, with privacy controls and links to local animal-welfare organisations.",
    highlights: [
      "Four problems framed first: finding health advice, privacy when sharing, safety from pet theft and online predators, and balancing work with care.",
      "A full research loop: competitive analysis, quantitative and qualitative research, affinity mapping, persona, empathy map and journey map.",
      "Structure before screens: task flow, user flow, card sorting and information architecture, then wireframes.",
      "Usability testing with set tasks and success criteria.",
    ],
    facts: "40+ screens · Figma, Photoshop",
    layout: "board",
    images: [
      img("petzmates", "case-study-board.jpg", 2400, 3393, "Full case-study board", "Case-study board covering the introduction, problem statement, solution, role, design process and strategy, competitive analysis, user research, affinity mapping, persona, empathy map, journey map, task flow, user flow, card sorting, information architecture, wireframes and usability testing."),
    ],
  },
  {
    slug: "pettrove",
    title: "PetTrove, a marketplace for pets and supplies",
    kind: "Concept · UX case study",
    when: "8 weeks",
    platforms: "iOS app",
    summary:
      "A mobile app that simplifies buying and selling pets, with a dedicated shop for pet supplies. It connects pet lovers, breeders and sellers in one marketplace.",
    highlights: [
      "Discover with the 4W + H method and a user journey, then define with personas, empathy mapping and a scope document.",
      "Feature analysis against existing pet apps before deciding what to build.",
      "A complete style guide: type, colour, iconography, grid and components.",
      "Planned in three phases: discover (2 weeks), define (3 weeks), prototype and test (3 weeks).",
    ],
    layout: "board",
    images: [
      img("pettrove", "case-study-board.jpg", 2400, 2083, "Full case-study board", "Case-study board covering the project overview, breakdown and timeline, the UX process (discover, define, empathise), a style guide and the UI design."),
    ],
  },
];

export const galleryScreenCount = gallerySets.reduce((n, set) => n + set.images.length, 0);
