/**
 * Ambient Memory: an always-available AI memory layer, designed end to end as a concept. Everything here comes from the
 * Figma file "Ambient Memory App — End-to-end Case Study" (19 steps on 15 boards: discover, define, design, validate,
 * deliver), exported on 18 Nov 2026. Screens are the file's own frames, cropped.
 *
 * Labelling rules on this page: research steps that need people (interviews, diary study, card sort, usability tests)
 * are prepared instruments, not results; personas, journeys, metric targets and scores are hypotheses; the numbers
 * marked "measured" were computed from the layouts in the file (word counts, text sizes, contrast, target sizes).
 * Competitor figures come from press and aggregators and are not audited. No quotes or user data are invented.
 */
import type { CaseImage } from "@/components/case/CaseParts";
import type { Persona } from "@/components/sketch/PersonaCard";
import manifest from "./ambient-memory-images.json";

const dims = manifest as unknown as Record<string, [number, number]>;
const img = (file: string, alt: string): CaseImage => {
  const [width, height] = dims[file] ?? [780, 1688];
  return { src: `/work/ambient-memory/${file}`, width, height, alt };
};

export const SLUG = "ambient-memory";

/* ── Header ─────────────────────────────────────────────────────────────── */

export const facts = [
  { term: "Role", detail: "Product designer and strategist, end to end (self-initiated concept)" },
  { term: "Scope", detail: "Research plan, personas, card-sort kit, information architecture, wireframes, visual design, design system with light and dark modes, prototype, validation plan, handoff and launch plan" },
  { term: "Built with", detail: "Figma: 59 components bound to 49 variables, 245 frames, a 261-link prototype, Watch, Chrome, tablet and desktop layouts" },
  { term: "Status", detail: "Concept track. Every study is prepared as an instrument and marked as not yet run." },
];

export const keyNumbers = [
  { value: "19", label: "Steps, discover to deliver", note: "Each with a deliverable and its evidence" },
  { value: "59", label: "Components, one token set", note: "Two themes, four text sizes, right-to-left" },
  { value: "245", label: "Frames, built only from library instances", note: "0 loose elements, measured in the file" },
  { value: "261", label: "Prototype links", note: "218 on the phone, 29 on other surfaces" },
];

export const hero = img("hero-light.jpg", "Six phone screens in the light theme: Today with the next meeting and what needs you, live capture with a commitment spotted, a meeting summary with sources, an answer with three cited sources, the Memory list of people, and Privacy with AI tools scoped per tool.");
export const heroDark = img("hero-dark.jpg", "The same six screens in the dark theme, sharing one set of variables.");
export const cover = img("cover.jpg", "Three phone screens in the light theme: Today, live capture and an answer with its sources.");

/* ── 00 · Signal ────────────────────────────────────────────────────────── */

export const problem = "People talk through their day and lose what mattered: promises, decisions and context. Meeting-only note-takers miss the rest of the day, and always-on tools raise a trust problem. Nobody has made capture, memory and consent feel calm.";

export const successLooksLike = [
  "A promise spoken aloud is tracked by the end of the day",
  "Every answer shows its source",
  "Capture is private by default, and visibly so",
];

export const painPoints = [
  { doodle: "clock", title: "Promises made out loud vanish", text: "The hallway and the car park are where commitments happen, and nothing writes them down." },
  { doodle: "calendar", title: "Note-takers only know meetings", text: "Bots join the call and miss the rest of the day. The market is converging on notes." },
  { doodle: "doubt", title: "Always-on means always watched", text: "Whole-day capture raises a trust problem for the person recording and for everyone near them." },
  { doodle: "tangle", title: "Summaries nobody can check", text: "An answer with no source is a guess. People stop trusting the memory the first time it is wrong." },
];

export const jobs = [
  ["Arjun · founder", "When I walk into a meeting, I want to recall what I promised last time, so I can show up prepared and keep trust.", "Commitments closed on time"],
  ["Meera · student", "When a lecture ends, I want structured notes in my own language, so I can study without re-listening.", "Review sessions started from notes"],
  ["Neha · operations", "When a vendor call ends, I want key figures captured as fields, so I can update records without retyping.", "Records pushed without edits"],
  ["Karan · field sales", "When I leave a client visit, I want my promises captured while I drive, so I can follow up within the hour.", "Time from visit to follow-up"],
  ["Sunita · personal", "When I tell family stories, I want them captured and organised, so they become something we can keep.", "Stories captured and shared"],
  ["Anika · compliance", "When my team uses recording tools, I want proof of control over what is stored and shared, so I can approve them.", "Approval time, zero scope violations"],
];

export const howMightWe = [
  "capture a whole day without making people feel watched?",
  "let people verify what the AI remembers in one glance?",
  "turn a spoken promise into a tracked commitment with no typing?",
  "keep one memory useful across Claude, ChatGPT and Gemini without leaking context?",
  "make consent visible to the people being recorded?",
  "keep capture reliable when phones stop background apps?",
  "make corrections so cheap that people actually do them?",
  "reduce the app to one job per screen?",
];

export const opportunityTree = {
  outcome: "Never drop a promise",
  opportunities: ["Forgot what I promised", "Cannot find what was said", "Do not trust what the AI says", "Afraid of being recorded"],
  solutions: ["Commitments ledger with due dates", "Cited answers and source moments", "Corrections that propagate", "Consent prompt, sensitive zones, private by default"],
};

/* ── 01 · Market ────────────────────────────────────────────────────────── */

export const competitors = [
  ["TwinMind", "Bot-free ambient capture on phone, Chrome, Mac, Windows and Watch", "Whole-day capture; memory shared to other AI tools through MCP", "Interface not translated; retrieval needs detail; trust story is mixed"],
  ["Granola", "Bot-free notes on desktop", "Notes-first workflow that reads like a person wrote it", "No saved audio, so transcripts cannot be re-checked; desktop-first"],
  ["Otter", "Visible bot, plus a bot-free desktop mode", "Mature team and admin tooling; live transcripts", "Visible bot changes the room"],
  ["Fireflies", "Visible bot", "CRM sync for sales teams", "Bot-based; meeting-centric"],
  ["Plaud", "Dedicated hardware recorder plus AI workspace", "In-person capture without the phone", "Extra device to carry and charge"],
  ["Limitless", "Wearable pendant", "Ambient capture as a product", "Acquired by Meta in Dec 2025; pendant sales stopped"],
  ["Claude Meetings", "Visible participant in video calls", "Real-time plans and whiteboards from a meeting", "Team and Enterprise beta; Google Meet at launch (Nov 2026)"],
];

/** Positioning map: x from meetings-only (0) to whole-day capture (1); y from implicit trust (0) to explicit, controllable trust (1). Our judgement, to validate. */
export const positioning: { name: string; x: number; y: number; kind: "us" | "ref" | "gap" }[] = [
  { name: "Opportunity", x: 0.84, y: 0.9, kind: "gap" },
  { name: "Claude Meetings", x: 0.2, y: 0.76, kind: "ref" },
  { name: "TwinMind", x: 0.78, y: 0.65, kind: "ref" },
  { name: "Granola", x: 0.31, y: 0.44, kind: "ref" },
  { name: "Plaud", x: 0.63, y: 0.35, kind: "ref" },
  { name: "Otter", x: 0.23, y: 0.28, kind: "ref" },
  { name: "Fireflies", x: 0.15, y: 0.2, kind: "ref" },
];

export const gapsWeCanOwn = [
  "Trust is a feature, not a footer: consent, gaps and approvals visible in the main flow.",
  "Mobile, in-person capture that continues on desktop.",
  "Provenance and cheap corrections, so people can verify the memory.",
  "An interface that is localised, not only the transcript.",
  "A neutral memory layer with scoped permissions per AI tool.",
];

/* ── 02 · Research plan ─────────────────────────────────────────────────── */

export const researchQuestions = [
  "When do people actually lose promises and context: in meetings or in unscheduled talk?",
  "What makes people comfortable (or not) with always-available capture?",
  "How do people check whether an AI memory is right, and what makes them stop trusting it?",
  "Which moments need action (follow-up, prep) and which only need recall?",
  "How do students, ops staff and field workers differ in what they need from the same capture?",
  "What do bystanders expect when someone records near them?",
];

export const hypotheses = [
  { h: "H1", text: "People lose more promises in unscheduled talk than in scheduled meetings." },
  { h: "H2", text: "A visible consent cue raises comfort for bystanders." },
  { h: "H3", text: "A source moment attached to each answer raises trust and willingness to act." },
  { h: "H4", text: "One-tap correction increases correction rate over typed editing." },
  { h: "H5", text: "Two roots with an Ask field beat five tabs on first-task success." },
  { h: "H6", text: "Private-by-default messaging increases opt-in to capture." },
];

/** Weeks 1 to 6; start and end are week numbers. */
export const methods = [
  { method: "Interviews", sample: "n = 8 to 12, across the first three personas", start: 1, end: 3 },
  { method: "Diary study", sample: "n = 8 to 10, 7 to 14 days, three prompts a day", start: 2, end: 5 },
  { method: "Survey", sample: "n = 100 to 200, sizing and priorities", start: 3, end: 4 },
  { method: "Competitor teardown", sample: "3 products by 5 tasks, screen recorded", start: 1, end: 2 },
  { method: "Bystander interviews", sample: "n = 5 to 6, about consent norms", start: 4, end: 5 },
];

export const diaryPrompts = [
  "What did you promise or decide today that you were afraid of forgetting?",
  "Did anything slip? What was it, and how did you notice?",
  "Did you feel watched, or watch someone else, at any point?",
];

export const ethics = ["Informed consent before recording any session", "No audio kept beyond transcription unless the participant opts in", "Anonymise participants; store notes without names", "Compensate participants fairly"];

/* ── 03 · Science ───────────────────────────────────────────────────────── */

export const science = [
  { strand: "Memory and commitments", strength: "Moderate to strong", finding: "Promises to do things later are forgotten without cues; specific plans help follow-through; offloading frees capacity but can weaken internal memory.", evidence: "Prospective memory (Einstein and McDaniel); implementation intentions (Gollwitzer 1999); cognitive offloading (Risko and Gilbert 2016).", implication: "Surface commitments with due times and a prep card before the event; turn a spoken promise into a dated commitment with one tap; keep a short review step so people stay in the loop." },
  { strand: "Learning and recall", strength: "Strong", finding: "Retrieving information strengthens memory more than rereading; spacing improves retention.", evidence: "Test-enhanced learning (Roediger and Karpicke 2006); distributed practice review (Cepeda et al. 2006).", implication: "Offer flashcards and gap checks from lecture notes; schedule revisits instead of one cram." },
  { strand: "Speech and retrieval", strength: "Moderate", finding: "Word and diarisation error rates describe transcript quality; retrieval fails when queries lack detail.", evidence: "Vendor figures (5.26% WER, 3.8% DER) are self-reported; app reviews describe needing detail to find past projects.", implication: "Mark low-confidence words and let people verify; hybrid search over a structured entity graph plus text." },
  { strand: "Trust, AI and privacy", strength: "Moderate to strong", finding: "People rely on automation appropriately when it shows its basis; good human-AI products let people correct and control; recording norms depend on context.", evidence: "Trust in automation (Lee and See 2004); guidelines for human-AI interaction (Amershi et al. 2019); contextual integrity (Nissenbaum 2004).", implication: "Cite a source moment for every answer; approve before send and one-tap corrections; sensitive zones, a visible start cue and consent prompts." },
  { strand: "Perception and interface", strength: "Strong to moderate", finding: "More choices slow decisions; distinct items are noticed; target size and distance affect speed; dark text on light backgrounds reads better at small sizes.", evidence: "Hick-Hyman law; Cowan 2001; von Restorff 1933; Fitts 1954; Piepenbrock et al. 2013.", implication: "Two roots and one action per screen; one marigold action per screen; capture at centre bottom with 44 px targets; ship both themes and keep text at 12 px or larger." },
];

/* ── 04 · People ────────────────────────────────────────────────────────── */

const basisNote = "A hypothesis persona (Cooper), built from the workflows and public testimonials, not interviews. Names and details are invented for the concept; Step 3 interviews replace them.";

export const personas: Persona[] = [
  { name: "Arjun Choudhary", role: "P1 · Founder", meta: "38 · founder or executive · six to eight meetings a day on calls and in person, mostly on the phone · iPhone, Mac, Watch", figures: [{ src: "/doodles/people/takt-arjun.svg", alt: "Doodle of Arjun, phone in hand." }], lists: [{ label: "Goals", items: ["Never drop a commitment", "Send follow-ups within hours"] }, { label: "Pains", items: ["Promises made in hallway talk vanish", "Summaries he cannot verify"] }], trust: { label: "Job to be done", text: "recall promises, arrive prepared, follow up the same day." }, basis: "proto", basisNote },
  { name: "Meera Iyer", role: "P1 · Student", meta: "21 · university student · five courses, lectures in English with some Hindi and Kannada, patchy campus Wi-Fi · Android phone, laptop", figures: [{ src: "/doodles/people/meera.svg", alt: "Doodle of Meera reading." }], lists: [{ label: "Goals", items: ["Notes by topic in her language", "Exam-week gap checks"] }, { label: "Pains", items: ["Poor audio from the back row", "Offline transcripts"] }], trust: { label: "Job to be done", text: "capture lectures without typing and study efficiently." }, basis: "proto", basisNote },
  { name: "Karan Shah", role: "P1 · Field sales", meta: "34 · field sales · client visits with the laptop closed, noisy venues, follows up on WhatsApp · phone, Watch, car audio", figures: [{ src: "/doodles/people/lokul-arun.svg", alt: "Doodle of Karan on the move." }], lists: [{ label: "Goals", items: ["Hands-free capture", "Follow-up drafted in his voice"] }, { label: "Pains", items: ["Battery and background limits", "Asking clients for consent"] }], trust: { label: "Job to be done", text: "capture promises on the move and follow up within the hour." }, basis: "proto", basisNote },
  { name: "Neha Reddy", role: "P2 · Operations", meta: "29 · operations coordinator · vendor calls, schedules and long PDFs for several managers, mostly on a laptop · Windows laptop, Chrome", figures: [{ src: "/doodles/people/lokul-ananya.svg", alt: "Doodle of Neha at a laptop." }], lists: [{ label: "Goals", items: ["Fields extracted from calls", "Cross-check quotes against PDFs"] }, { label: "Pains", items: ["Retyping into sheets", "Low-confidence numbers"] }], trust: { label: "Job to be done", text: "turn calls and documents into accurate structured records." }, basis: "proto", basisNote },
  { name: "Sunita Rao", role: "P2 · Personal", meta: "62 · retired teacher · writing a family history in Hindi, comfortable with simple apps only · Android phone", figures: [{ src: "/doodles/people/lakshmi.svg", alt: "Doodle of Sunita smiling, cup in hand." }], lists: [{ label: "Goals", items: ["Stories in native script", "Share chapters with relatives"] }, { label: "Pains", items: ["Complex menus", "Recording relatives without asking"] }], trust: { label: "Job to be done", text: "turn spoken stories into something the family can keep." }, basis: "proto", basisNote },
  { name: "Anika Mehta", role: "P2 · Compliance", meta: "41 · corporate counsel and IT approver · her team must approve any recording tool; handles confidential client data · managed laptop and phone", figures: [{ src: "/doodles/people/forma-priya.svg", alt: "Doodle of Anika, arms folded." }], lists: [{ label: "Goals", items: ["On-device only mode", "Audit log and scoped AI access"] }, { label: "Pains", items: ["Opaque data flows", "Unclear retention"] }], trust: { label: "Job to be done", text: "prove control over what is stored and shared." }, basis: "proto", basisNote },
];

/** Arjun's journey, five stages (Step 5). Emotion curves are hypotheses and are not drawn. */
export const journey = [
  { stage: "Prepare", today: "Checks the next meeting. “Did I promise anything last time?”", pain: "Digging through notes", opportunity: "Prep card with owed items" },
  { stage: "Capture", today: "Taps once to capture. “Is it capturing without annoying them?”", pain: "Forgetting to start capture", opportunity: "Calendar prompt and Watch start" },
  { stage: "Review", today: "Skims summary and follow-ups. “Is this right?”", pain: "Unverifiable summaries", opportunity: "Cited summary, one-tap correct" },
  { stage: "Follow up", today: "Approves a drafted email. “I want this sent today.”", pain: "Retyping the same promise", opportunity: "Draft in his voice, approve to send" },
  { stage: "Recall", today: "Asks what Priya said. “Where did that number come from?”", pain: "Answers without a source", opportunity: "Cited answer with source moment" },
];

type Fit = "yes" | "partial" | "no";
const fit = (s: string): { state: Fit; note: string } => (s === "3" ? { state: "yes", note: "Critical" } : s === "2" ? { state: "partial", note: "Important" } : { state: "no", note: "Nice to have" });
const feature = (label: string, scores: string) => ({ label, cells: scores.split("").map(fit) });
export const featurePersonas = ["Arjun", "Meera", "Karan", "Neha", "Sunita", "Anika"];
export const featureMatrix = [
  feature("Capture with visible consent", "333233"),
  feature("Commitments ledger", "313211"),
  feature("Prep card before meetings", "313111"),
  feature("Cited answers (Ask)", "332322"),
  feature("One-tap corrections", "222331"),
  feature("Draft follow-up, approve to send", "313211"),
  feature("Memory: people, projects, places", "212231"),
  feature("Private by default and sensitive zones", "213233"),
  feature("Scoped AI access (MCP)", "211113"),
  feature("Offline capture and upgrade", "132121"),
  feature("Flashcards and gap check", "131111"),
  feature("Field extraction to sheets", "111311"),
];
export const matrixSays = [
  "Capture with visible consent is critical for everyone, so it is in the first release.",
  "Commitments, prep and follow-up serve the two highest-value personas (Arjun and Karan).",
  "Learning features matter to one persona only; they come later.",
  "Scoped AI access is critical for one persona but unlocks the approval route, so it ships in the first release in a basic form.",
];

/* ── 05 · Define ────────────────────────────────────────────────────────── */

export const northStar = { metric: "Commitments closed on time, per weekly active user", why: "It joins capture, review and follow-through. If the number rises, people are keeping promises because of the product." };

export const inputMetrics = [
  ["Capture reliability", "Sessions without an unplanned gap", "95% or more"],
  ["Review rate", "Meetings reviewed within 24 hours", "60% or more"],
  ["Approval rate", "Drafts approved and sent", "50% or more"],
  ["Recall quality", "Answers marked Right", "85% or more"],
];

export const heart = [
  ["Happiness", "System Usability Scale; 4-item trust score", "SUS 80 or more; trust 4 of 5"],
  ["Engagement", "Capture days per week", "4 or more"],
  ["Adoption", "First capture within 24 hours of install", "70% or more"],
  ["Retention", "Active in week 5 after install", "40% or more"],
  ["Task success", "Tree-test and first-click success on key tasks", "80% or more"],
];

export const rice = [
  { feature: "Private by default and sensitive zones", kano: "Basic", reach: 9, impact: 2, confidence: 80, effort: 4, score: 3.6 },
  { feature: "Capture with consent and gap recovery", kano: "Basic", reach: 10, impact: 3, confidence: 90, effort: 8, score: 3.4 },
  { feature: "Commitments ledger and prep card", kano: "Performance", reach: 8, impact: 3, confidence: 80, effort: 6, score: 3.2 },
  { feature: "Draft follow-up, approve to send", kano: "Delighter", reach: 7, impact: 2, confidence: 70, effort: 5, score: 2.0 },
  { feature: "Cited answers (Ask)", kano: "Performance", reach: 9, impact: 2, confidence: 70, effort: 7, score: 1.8 },
  { feature: "Offline capture and upgrade", kano: "Basic", reach: 6, impact: 2, confidence: 70, effort: 5, score: 1.7 },
  { feature: "Memory: people list and detail", kano: "Performance", reach: 7, impact: 1, confidence: 80, effort: 4, score: 1.4 },
  { feature: "Scoped AI access (MCP)", kano: "Delighter", reach: 5, impact: 2, confidence: 60, effort: 6, score: 1.0 },
  { feature: "Flashcards and gap check", kano: "Delighter", reach: 3, impact: 1, confidence: 60, effort: 4, score: 0.4 },
  { feature: "Mac and Windows capture", kano: "Performance", reach: 5, impact: 1, confidence: 70, effort: 9, score: 0.4 },
  { feature: "Wearable and Watch capture", kano: "Delighter", reach: 3, impact: 1, confidence: 50, effort: 8, score: 0.2 },
  { feature: "Field extraction to sheets", kano: "Delighter", reach: 2, impact: 1, confidence: 50, effort: 6, score: 0.2 },
];

export const releases = {
  first: ["Today, Live capture, Meeting detail", "Ask with sources", "Consent, gap recovery, sensitive zones", "Memory: people", "Privacy and AI access (basic)"],
  later: ["Offline upgrade polish", "Places and projects", "Mac and Windows", "Flashcards and gap check", "Field extraction"],
  notNow: ["Own hardware", "Team sharing", "Enterprise controls", "Public API"],
};

export const preMortem = [
  ["OS stops background capture", "High · High", "Native audio services, capture-health view, recovery and tests per OS version"],
  ["Consent or recording-law exposure", "Medium · High", "Consent prompts, sensitive zones, counsel review"],
  ["Battery drain", "High · Medium", "Speech-only capture, power saver at 20%, battery budgets"],
  ["Transcript errors erode trust", "High · High", "Low-confidence markers, source moments, cheap corrections"],
  ["Cloud transcription cost", "Medium · Medium", "On-device first pass; cloud only on opt-in or low confidence"],
  ["Model labs bundle meeting notes", "High · Medium", "Own the personal, ambient and neutral layer; scoped AI access"],
  ["Passive value, weak retention", "Medium · High", "Morning brief and prep cards give a reason to open daily"],
  ["Privacy backlash", "Medium · High", "Private by default, audit log, visible start cue, plain language"],
];

/* ── 06 · Architecture ──────────────────────────────────────────────────── */

export const sitemap = [
  { name: "Today", kind: "Root", note: "What is happening and what needs me.", items: ["Up next card → Prep, Start capture", "Needs you (commitments) → Commitment detail", "Ask field → Ask conversation → Sources, Correct a fact", "Meeting detail → Summary, Transcript, Follow-ups, Review follow-up email"] },
  { name: "Memory", kind: "Root", note: "Everything the app knows.", items: ["Ask or search field", "People → Person detail → Timeline, Open commitments, Shared meetings", "Projects", "Places"] },
  { name: "Capture", kind: "Action", note: "Centre button. Always one tap away.", items: ["Consent prompt (if required)", "Live capture → Mark moment, Pause, Commitment spotted, Stop → Meeting detail"] },
  { name: "Privacy and AI access", kind: "Avatar", note: "Reached from the avatar, through Settings.", items: ["Private by default", "AI tools → Per-tool memory spaces", "Protect → Sensitive places, Keep memories for, Activity log", "Forget the last hour"] },
];

export const navRules = [
  "Two roots and one action: Today, Memory and Capture",
  "Ask is a field at the top of both roots, not a tab",
  "Focus screens hide the tab bar: capture, meeting detail, Ask",
  "Privacy sits under Settings, reached from the avatar, in plain language",
  "Details open on tap, not on the page",
  "Back always returns to where you were",
];

export const labels = [
  ["Memory", "The place for people, projects and places", "Brain, Library, Know"],
  ["Ask", "Question first, search second", "Search, Chat"],
  ["Capture", "The action, always one tap away", "Record, Listen"],
  ["Needs you", "Commitments due today", "To do, Follow-ups"],
  ["Follow-ups", "Direction of the promise is in the label", "Commitments, Actions"],
  ["Private by default", "The promise, in plain words", "Local only, Secure"],
];

export const entities = [
  ["Person", "Name, role, organisation, first and last spoken", "Meetings, commitments, projects", "Entity extraction, user merge"],
  ["Meeting", "Title, time, participants, summary, source audio flag", "Person, commitments, drafts", "Calendar or capture"],
  ["Commitment", "Text, direction (you owe or they owe), due, status, source moment", "Person, meeting", "Detected and confirmed"],
  ["Moment", "Timestamp, speaker, text, confidence", "Meeting", "Transcription"],
  ["Project", "Name, people, open commitments", "Person, meeting", "User or inferred"],
  ["Place", "Name, type, capture rule (allow or skip)", "Meeting", "User"],
  ["Draft", "Subject, body, state (draft, approved, sent)", "Meeting, commitments", "Generated, approved by user"],
];

export const treeTasks = [
  ["T1", "Find what you promised Priya", "Today → Needs you, or Ask", "Reaches the commitment in 2 taps"],
  ["T2", "Start recording a meeting", "Capture button", "First tap on Capture"],
  ["T3", "Stop AI tools reading your Personal memories", "Avatar → Privacy → AI tools", "Reaches the toggle"],
  ["T4", "Check what Dev said about SSO", "Ask field", "First click on the Ask field"],
  ["T5", "Add a place where capture is always off", "Avatar → Privacy → Sensitive places", "Reaches the list"],
  ["T6", "See everyone you spoke to this week", "Memory → People", "Reaches the list"],
  ["T7", "Fix a wrong name in a summary", "Meeting detail → tap name", "Finds the edit action"],
  ["T8", "Delete the last hour of capture", "Avatar → Privacy → Forget", "Finds the action"],
  ["T9", "Send the follow-up email", "Meeting detail → Review follow-up", "Reaches approve"],
  ["T10", "Check why a capture has a gap", "Today → capture health", "Finds the gap explanation"],
];

/** The closed-sort categories (draft) and the file's expected homes for 20 of the 48 cards. The remaining 28 are listed by group below. */
export const sortGroups = ["Today", "Memory", "Ask", "Capture", "Privacy and AI", "Settings"] as const;
export type SortGroup = (typeof sortGroups)[number];
export const sortCards: { card: string; group: SortGroup }[] = [
  { card: "Commitment", group: "Today" },
  { card: "Daily brief", group: "Today" },
  { card: "Promise I made", group: "Today" },
  { card: "Draft follow-up", group: "Today" },
  { card: "Person", group: "Memory" },
  { card: "Project", group: "Memory" },
  { card: "Place", group: "Memory" },
  { card: "Topic note", group: "Memory" },
  { card: "Ask a question", group: "Ask" },
  { card: "Correct a fact", group: "Ask" },
  { card: "Source moment", group: "Ask" },
  { card: "Answer confidence", group: "Ask" },
  { card: "Start capture", group: "Capture" },
  { card: "Mark a moment", group: "Capture" },
  { card: "Low battery mode", group: "Capture" },
  { card: "Gap in capture", group: "Capture" },
  { card: "AI tool access", group: "Privacy and AI" },
  { card: "Forget the last hour", group: "Privacy and AI" },
  { card: "Cloud enhance", group: "Privacy and AI" },
  { card: "Sensitive places", group: "Privacy and AI" },
  { card: "Subscription", group: "Settings" },
  { card: "Languages", group: "Settings" },
  { card: "Notifications", group: "Settings" },
  { card: "Export my data", group: "Settings" },
];
export const cardKit = [
  { group: "Objects", cards: ["Meeting", "Conversation", "Commitment", "Promise I made", "Promise owed to me", "Decision", "Person", "Project", "Place", "Daily brief", "Draft follow-up", "Topic note"] },
  { group: "Actions", cards: ["Start capture", "Pause capture", "Mark a moment", "Ask a question", "Correct a fact", "Merge two people", "Approve a draft", "Connect Gmail", "Connect calendar", "Share a memory space", "Export my data", "Forget the last hour"] },
  { group: "Trust and settings", cards: ["Private mode", "Sensitive places", "Consent prompt", "Keep memories for", "AI tool access", "Activity log", "Cloud enhance", "Languages", "Notifications", "Memory spaces", "Delete account", "Subscription"] },
  { group: "System states", cards: ["Capture health", "Gap in capture", "Low battery mode", "Offline mode", "Transcript enhancing", "Low-confidence words", "Sync status", "Storage used", "Mic in use by another app", "Capture paused", "Source moment", "Answer confidence"] },
];
export const sortRounds = [
  ["Round 1 · Open sort", "Moderated, think aloud (n = 8 to 12) plus unmoderated (n = 20 to 30)", "Mental models, groupings, language", "Weeks 3 to 4"],
  ["Round 2 · Hybrid or closed sort", "Draft categories plus “add your own” (n = 25 to 40 hybrid, 15 to 20 closed)", "Do people accept the structure?", "Week 6"],
  ["Round 3 · Tree test", "Text-only navigation, 10 tasks (n = 50 or more per task)", "Findability of labels and paths", "Week 7"],
  ["Round 4 · First-click on wireframes", "Clickable wireframes, 5 tasks", "Is the first move right?", "Week 8"],
];
export const sortRules = ["Place a card where 60% or more of participants put it", "Under 40% agreement: rename or split the card", "Dendrogram clusters that cannot coexist in a menu are resolved by design judgement", "Re-run the sort in Hindi before fixing labels"];

/* ── 07 · Workflows ─────────────────────────────────────────────────────── */

export const workflows = [
  { who: "Arjun · prepare and follow up", steps: ["Prep card", "Capture (consent)", "Commitment spotted", "Review", "Approve email", "Ask later"] },
  { who: "Karan · capture on the move", steps: ["Client card", "Watch start", "Consent cue", "Voice debrief", "WhatsApp draft", "Approve"] },
  { who: "Meera · lecture to study", steps: ["Timetable prompt", "Offline capture", "Upgrade transcript", "Topic notes", "Flashcards", "Gap check"] },
  { who: "Neha · call to record", steps: ["Call capture", "Template fields", "Cross-check PDF", "Flag low confidence", "Approve push", "Sheet updated"] },
  { who: "Sunita · story to keepsake", steps: ["Tell a story", "Native script", "Merge relatives", "Share chapter", "Export book"] },
  { who: "Anika · approve the tool", steps: ["Review data flow", "On-device mode", "Set retention", "Scope AI access", "Check audit log"] },
];

export const useCases = [
  ["UC-01", "Start capture from a calendar prompt", "Calendar event nearby", "Capture running", "Must"],
  ["UC-02", "Start capture with consent", "Tap Capture", "Consent logged, capture on", "Must"],
  ["UC-03", "Recover from an interruption", "Mic taken or app stopped", "Gap marked, capture resumes", "Must"],
  ["UC-04", "Review a meeting", "Meeting ends", "Summary and follow-ups confirmed", "Must"],
  ["UC-05", "Approve a follow-up email", "Tap Review follow-up", "Email sent after approval", "Must"],
  ["UC-06", "Ask with sources", "Type or speak a question", "Cited answer", "Must"],
  ["UC-07", "Correct a fact", "Tap Fix a fact", "Fix propagates everywhere", "Should"],
  ["UC-08", "Grant or revoke AI tool access", "Toggle in Privacy", "Scoped access, logged", "Must"],
  ["UC-09", "Forget the last hour", "Tap Forget", "Data removed, confirmed", "Should"],
  ["UC-10", "Capture offline and upgrade", "No network", "Transcript upgraded later", "Should"],
  ["UC-11", "Skip capture in a sensitive place", "Enter a zone", "Capture blocked, user told", "Must"],
  ["UC-12", "Prep for the next meeting", "Event within 30 minutes", "Prep card read", "Should"],
];

export const uc02 = {
  title: "UC-02 · Start capture with consent",
  actor: "User (primary), bystander (secondary)",
  preconditions: "Microphone permission granted; battery above 5%",
  trigger: "User taps Capture or accepts a calendar prompt",
  main: ["System checks the sensitive-zone list", "System checks whether consent is required here", "If required, system shows the consent prompt", "User confirms", "System plays the start tone and shows the indicator", "System selects the engine from privacy mode and network", "System captures speech only"],
  exceptions: ["Inside a sensitive zone: do not capture, tell the user", "Consent declined: cancel", "Mic taken by a call: mark a gap and resume"],
  rules: ["BR-1 Never capture in a sensitive zone without an explicit override", "BR-2 The indicator is always visible while capturing", "BR-3 Audio is deleted after transcription unless the user opts in"],
  gherkin: `Scenario: Capture starts after consent
  Given the user is outside every sensitive zone
  And consent is required for this contact
  When the user taps Capture
  Then a consent prompt is shown
  And capture starts only after the user confirms

Scenario: Blocked in a sensitive zone
  Given the user is inside the zone "Clinic"
  When the user taps Capture
  Then capture does not start
  And the user is told why

Scenario: Interruption recovery
  Given capture is running
  When the microphone is taken by a call
  Then a gap is marked in the transcript
  And capture resumes when the call ends`,
};

/* ── 08 · Wireframes and words ──────────────────────────────────────────── */

export const wireCompare = [
  { label: "Today", wire: img("wire-01.jpg", "Wireframe of Today: greeting, Ask field, one hero card for the next meeting, three rows that need you, two tabs and Capture."), final: img("phone-01-light.jpg", "Final Today screen in the light theme.") },
  { label: "Live capture", wire: img("wire-02.jpg", "Wireframe of live capture: timer, calm waveform, the current exchange, a commitment card with one action, hold to stop."), final: img("phone-02-light.jpg", "Final live capture screen.") },
  { label: "Meeting detail", wire: img("wire-03.jpg", "Wireframe of meeting detail: Summary and Transcript, follow-ups with direction, one primary action."), final: img("phone-03-light.jpg", "Final meeting detail screen.") },
  { label: "Ask", wire: img("wire-04.jpg", "Wireframe of Ask: the question, an answer, three source cards, Right and Fix a fact."), final: img("phone-04-light.jpg", "Final Ask screen.") },
];

export const edgeStates = [
  { title: "Capture gap banner", text: "Today tells you the mic was in a call from 12:04 to 12:19, and that capture resumed." },
  { title: "Offline and enhancing", text: "Live capture runs on the on-device model and says it will upgrade the transcript when online." },
  { title: "Empty Memory", text: "Nothing here yet: capture your first conversation and people appear here. One action." },
  { title: "Microphone permission", text: "Capture works on this phone only; audio is deleted after it becomes text. Open settings." },
];
export const whyTheseFour = ["Gap and offline are the product's most likely failures; both must be honest and calm.", "Empty and permission states are the first thing every new user sees.", "Every state has one explanation and at most one action."];

export const voice = [
  ["Calm", "No exclamation marks, no urgency, no alarmism."],
  ["Plain", "Short words. Say what happens, in the order it happens."],
  ["Specific", "Name the person, the amount, the day."],
  ["Respectful", "Never blame. Always say what the user can do next."],
];
export const rulesOfThumb = ["Label buttons with the result, not the step: “Review follow-up email”.", "Use direction words: “You owe Priya”, not “Commitment”.", "Keep one idea per sentence; 12 words or fewer for alerts.", "Never hide a limit in a link; say it on the screen.", "Write the Hindi and English strings together; do not translate afterwards."];
export const microcopy = [
  ["Consent prompt", "By continuing you agree to the recording terms.", "Tell people nearby that you are capturing. Audio is deleted after it becomes text."],
  ["Capture gap", "Error: recording failed.", "Gap 12:04 to 12:19. Your mic was in a call. Capture resumed."],
  ["Empty state", "No data found.", "Nothing here yet. Capture your first conversation and people appear here."],
  ["AI answer", "I think the answer is…", "Priya said procurement can sign this quarter. 1 source."],
  ["Approval", "Message sent successfully!", "Sent to Priya. Follow-ups marked."],
  ["Forget", "Are you sure? This cannot be undone.", "Forget the last hour? Audio and text from 2:12 to 3:12 will be removed."],
  ["Low confidence", "Possible inaccuracy detected.", "Check “SOC 2”. I heard “sock too”."],
];

/* ── 09 · Visual design ─────────────────────────────────────────────────── */

export const directions = [
  { id: "A", name: "Voice to text", idea: "Sound becomes writing. Typography and waveform shapes lead the brand.", signature: "A waveform that resolves into a line of text", risk: "Can feel generic without a strong typeface", sample: "I'll send it by Friday.", bg: "#1A1A1A", fg: "#F5F2EA", action: "#FF4A2A", actionText: "#FFFFFF", dots: ["#F5F2EA", "#FF4A2A", "#1A1A1A"], chosen: false },
  { id: "B", name: "Strata of time", idea: "Memory as layered planes where depth means recency.", signature: "Scrubbing down through layers of the day", risk: "Depth effects cost battery and clarity", sample: "Today, in layers.", bg: "#1B2A4A", fg: "#E6EEF7", action: "#6FD6C2", actionText: "#0E1A2B", dots: ["#D8E6F5", "#6FD6C2", "#1B2A4A"], chosen: false },
  { id: "C", name: "Quiet instrument", idea: "Analogue-recorder craft: tactile controls, haptics and sound. Highlighter on paper.", signature: "A ring that closes into a recording dot, with a start tone", risk: "Skeuomorphism can age badly", sample: "Send the revised quote.", bg: "#F5F2EA", fg: "#15171C", action: "#F6C85F", actionText: "#1A1405", dots: ["#15171C", "#F6C85F", "#F5F2EA"], chosen: true },
];
export const directionScores = [
  ["A Voice to text", 3, 3, 4, 4, 3, 17],
  ["B Strata of time", 3, 5, 2, 2, 3, 15],
  ["C Quiet instrument", 5, 4, 5, 4, 4, 22],
];

export const designDecisions = [
  ["Two tabs and one Capture", "Hick-Hyman law; working memory holds about 4 chunks (Cowan 2001)", "Fewer choices lower decision time and load"],
  ["One marigold action per screen", "Isolation effect (von Restorff 1933)", "A single distinct item is noticed and remembered"],
  ["Capture at centre bottom, targets of 44 px", "Fitts's law (1954); one-handed reach", "Larger, nearer targets are faster to hit"],
  ["Sources under every answer", "Trust in automation (Lee and See 2004)", "Showing basis supports calibrated reliance"],
  ["Approve before send", "Guidelines for human-AI interaction (Amershi et al. 2019)", "Keep the person in control of consequential actions"],
  ["Text 16 px, minimum 12 px, both themes", "Positive display polarity (Piepenbrock et al. 2013)", "Dark-on-light reads better at small sizes; dark helps some users"],
  ["Grouping by cards, spacing and one list style", "Gestalt proximity and common region", "Related items read as a unit with less effort"],
  ["Record red only for recording", "Convention plus Gestalt similarity", "Colour carries one meaning, so it is trusted"],
  ["Peak moment at summary", "Peak-end rule (Kahneman et al. 1993)", "Make the end of capture and the first summary feel good"],
  ["Prep card and morning brief", "Prospective memory cues (Einstein and McDaniel)", "Cue promises at the moment they matter"],
];

export const measuredChange = [
  { value: "123 → 67", label: "Words per screen", note: "Average of 5 screens, v1 to v2. Measured in the file" },
  { value: "5 → 3", label: "Navigation slots", note: "Ask and Privacy left the tab bar" },
  { value: "8 → 12 px", label: "Smallest text on screen", note: "Nothing below 12 px" },
  { value: "12.7 → 15.9 px", label: "Typical text size", note: "Median by characters" },
];
export const removedInV2 = ["The Ask and Privacy tabs", "Status chips and metadata on every card", "Second and third colours per screen"];
export const keptInV2 = ["Commitments, because they close the loop", "Sources under every answer, because they build trust", "The consent cue, because bystanders matter"];
export const v1Today = img("v1-today.jpg", "The first draft of Today, dark and dense: a capture timeline with a gap, a prep-ready card with highlighted quotes, owed and owing chips, due today, and five tabs.");
export const v2Today = img("phone-01-light.jpg", "Version 2 of Today in the light theme: greeting, Ask field, one Up next card with two owed items, Needs you with two rows, two tabs and Capture.");

/* ── 10 · Design system ─────────────────────────────────────────────────── */

export const tokens: { name: string; light: string; dark: string }[] = [
  { name: "surface/page", light: "#F5F2EA", dark: "#0D0E12" },
  { name: "surface/card", light: "#FFFFFF", dark: "#15171C" },
  { name: "surface/raised", light: "#EFEADC", dark: "#1B1E25" },
  { name: "border/subtle", light: "#E6E0D2", dark: "#22252D" },
  { name: "text/primary", light: "#15171C", dark: "#F4F1E8" },
  { name: "text/secondary", light: "#4B4F58", dark: "#B9B6AD" },
  { name: "text/tertiary", light: "#666A73", dark: "#8A8D96" },
  { name: "text/hint", light: "#858993", dark: "#5C606A" },
  { name: "action/fill", light: "#F6C85F", dark: "#F6C85F" },
  { name: "action/on", light: "#1A1405", dark: "#1A1405" },
  { name: "accent/text", light: "#8A5A00", dark: "#F6C85F" },
  { name: "highlight/text", light: "#3B2A00", dark: "#FFE7A6" },
  { name: "record/fill", light: "#E8452A", dark: "#FF5A3C" },
  { name: "record/text", light: "#C7311A", dark: "#FF5A3C" },
  { name: "private/fill", light: "#14A874", dark: "#4FE3B1" },
  { name: "private/text", light: "#0B7A57", dark: "#4FE3B1" },
  { name: "alert/text", light: "#C2354A", dark: "#FF6F7D" },
];
export const scales = {
  spacing: [4, 8, 12, 16, 20, 24, 32, 40],
  radius: ["8", "12", "16", "22", "26", "pill"],
  type: [12, 14, 16, 18, 22, 30, 64],
};
export const components = ["Button · primary", "Button · secondary", "Button · destructive text", "Icon button", "Chip", "Citation chip", "Highlight", "Tab bar", "Capture button", "Ask field", "Segmented control", "List row", "Task row", "Person row", "Section header", "Card", "Hero card", "Source card", "Commitment card", "Status line", "Waveform", "Timer", "Toggle", "Avatar", "Top bar", "Bottom action bar", "Consent sheet", "Banner · gap", "Empty state", "Toast", "Sidebar", "Window title bar", "Watch button", "Watch card", "Watch timer"];
export const coverage = [
  { value: "59", label: "Components built", note: "69 variants; 59 of 59 used by at least one frame" },
  { value: "49", label: "Variables, 28 of them colour", note: "None with unrestricted scope" },
  { value: "35 + 13", label: "Phone screens plus other-surface layouts", note: "Watch, Chrome, tablet, landscape, desktop" },
  { value: "4", label: "Type-size modes", note: "Default, Large, XL, AX5" },
];
export const usageRules = ["One primary (marigold) action per screen", "Use the text variant of a status colour for text and the fill variant for shapes", "Highlights are for source moments only", "Cards on paper use a soft shadow; in dark mode they use a lighter fill", "Targets are 44 px; the Capture button is 66 px"];
export const governance = ["Tokens in the W3C Design Tokens format (stable v2025.10)", "Figma variables are the source; export to JSON, build with Style Dictionary", "Changes by pull request; designer and engineer review", "Semantic versioning; deprecate for two releases before removal"];

/* ── 11 · Screens ───────────────────────────────────────────────────────── */

export type Theme = "light" | "dark";
export interface Screen extends CaseImage { code: string; label: string }
export interface ThemeChapter { n: string; title: string; body: string; decision: string; screens: Record<Theme, Screen[]> }

const SCREENS: Record<string, [string, string]> = {
  "01": ["Today", "greeting, one line of capture status, the Ask field, the next meeting with the two owed items, and what needs you."],
  "02": ["Live capture", "a timer, a calm waveform, the current exchange in large text, a commitment spotted with one Add button, and hold to stop."],
  "03": ["Meeting detail", "Summary and Transcript, every line with a timestamp that plays its source, follow-ups with direction, and one action: Review follow-up email."],
  "04": ["Ask", "a question, the answer with three numbered highlights, three source cards, Right or Fix a fact, and a follow-up field."],
  "05": ["Memory", "the Ask field, People, Projects and Places, and a list of people with open commitments."],
  "06": ["Privacy", "Private by default in plain words, AI tools with a switch each, sensitive places, keep memories for, activity log, forget the last hour."],
  "07": ["Capture gap on Today", "a banner that says the mic was in a call from 12:04 to 12:19 and capture resumed."],
  "08": ["Offline capture", "live capture on the on-device model, with a note that the transcript will upgrade when online."],
  "09": ["Empty Memory", "nothing here yet; capture your first conversation and people appear here."],
  "10": ["Consent sheet", "tell people nearby: you are about to capture this conversation; audio is deleted after it becomes text. Start capture or Not now."],
  "11": ["Review follow-up", "a draft in the user's voice, two words to check, Approve and send. Nothing is sent until you approve."],
  "12": ["Transcript", "the exchange by speaker, with the promise highlighted and a low-confidence term to check."],
  "13": ["Person detail", "Priya Nair: timeline, open commitments and shared meetings."],
  "14": ["Prep", "what was said last time with source timestamps, what you owe and what they owe, Start capture."],
  "15": ["Sensitive places", "home, the clinic and the bank, each with capture off."],
  "16": ["Activity log", "seven days of AI requests, each allowed or blocked with the tool, the space and the time."],
  "17": ["Onboarding · Welcome", "a memory you can trust: never drop a promise, private by default, every answer shows its source."],
  "18": ["Microphone permission", "capture works on this phone only; audio is deleted after it becomes text. Open settings."],
  "19": ["Commitment added", "the live capture screen a moment after Add: a toast confirms the commitment."],
  "20": ["Commitment detail", "send revised quote: who it is owed to, the due date, the source moment, change due date, mark done."],
  "21": ["Memory · Projects", "enterprise pricing, security review and Q4 planning with their people and open commitments."],
  "22": ["Memory · Places", "the office, home and the clinic, with capture on or off per place."],
  "23": ["Fix a fact", "a sheet over Ask: which part was wrong, apply everywhere, save fix."],
  "24": ["Keep memories for", "7 days, 30 days, a year or forever; older items are removed from this phone and any backup."],
  "25": ["AI tool · Claude", "what Claude may read, by memory space: Work on, Personal and Family off, and its recent requests."],
  "26": ["Forget the last hour", "a sheet over Privacy: audio and text from 2:12 to 3:12 will be removed; also remove commitments from this hour."],
  "27": ["Person · Meetings", "Priya Nair's meetings: pricing review, quote walkthrough, intro call."],
  "28": ["Connect your day", "Google Calendar for prep cards and capture prompts, Gmail for follow-ups in your voice. Nothing is sent without approval."],
  "29": ["Your data", "export, delete a range, language, and delete account and everything."],
  "30": ["Memory spaces", "Work, Personal and Family, kept apart; create a space."],
  "31": ["Share · Family", "what relatives can see, who has joined, invite someone."],
  "32": ["Join invite", "Arjun invited you to Family: what you will see, and that your own memory stays private."],
  "33": ["Notifications", "before meetings, after meetings, commitments due, capture problems, quiet hours."],
  "34": ["Plan", "Free, Plus and Pro with test prices, to be validated with users."],
  "35": ["Settings", "account, privacy and AI access, memory spaces, notifications, plan, your data, language."],
};
const screen = (theme: Theme, n: string): Screen => {
  const [label, describe] = SCREENS[n];
  return { ...img(`phone-${n}-${theme}.jpg`, `Phone, ${theme} theme, ${label}: ${describe}`), code: n, label };
};
const both = (ns: string[]): Record<Theme, Screen[]> => ({ light: ns.map((n) => screen("light", n)), dark: ns.map((n) => screen("dark", n)) });

export const chapters: ThemeChapter[] = [
  { n: "01", title: "Prepare", body: "Eighteen minutes before the pricing review, Today shows one card: the meeting, the two things owed, and two buttons. Prep opens what Priya said last time, with the timestamp that plays it.", decision: "Today answers “what is next and what needs me?” in one glance. One hero, three rows at most.", screens: both(["01", "14"]) },
  { n: "02", title: "Capture, with consent", body: "Capture is the centre button on every root. Where consent is required the sheet says, in plain words, what is captured and what happens to the audio. During capture the screen has one job: a timer, the current exchange, and a commitment spotted with one action.", decision: "Capture is visible to everyone nearby. A spoken promise becomes a dated commitment with one tap.", screens: both(["10", "02", "19"]) },
  { n: "03", title: "When things are not perfect", body: "A gap in capture, no network, an empty Memory and a missing microphone permission are the states most people meet first or most often. Each says what happened and offers one thing to do.", decision: "Every state has one explanation and at most one action. Gap and offline must be honest and calm.", screens: both(["07", "08", "09", "18"]) },
  { n: "04", title: "Review, then approve", body: "The summary is three lines, each with a timestamp that plays its source moment. Follow-ups carry direction: you owe, they owe. The draft email is in the user's voice, with two low-confidence words to check before it goes.", decision: "Nothing is sent until you approve, and the screen says so under the button.", screens: both(["03", "12", "11"]) },
  { n: "05", title: "Ask, with sources", body: "A question gets an answer with numbered highlights and the three moments it came from, each playable. Was this right? Right, or Fix a fact, and the fix updates every answer and summary that used it.", decision: "Every answer shows its sources, because trust is calibrated by seeing the basis.", screens: both(["04", "23", "20"]) },
  { n: "06", title: "Memory: people, projects, places", body: "The second root is everything the app knows, with the same Ask field at the top. A person has a timeline, open commitments and shared meetings; a place has a capture rule.", decision: "Two roots and one action. Everything else is one tap away.", screens: both(["05", "13", "27", "21", "22"]) },
  { n: "07", title: "Private by default", body: "Privacy is one tap from the avatar and written in plain language. Each AI tool has a switch and a scope by memory space, every request is logged, and the last hour can be forgotten with the exact time range shown.", decision: "Consent, gaps and approvals live in the main flow. Trust is a feature, not a footer.", screens: both(["06", "25", "15", "16", "26", "24", "29"]) },
  { n: "08", title: "First run, spaces and plans", body: "Onboarding makes three promises and asks for one permission. Spaces keep work, personal and family apart; a relative joins from an invite with their own memory left private. Plan prices are marked as test prices.", decision: "Say the limit on the screen, never in a link.", screens: both(["17", "28", "30", "31", "32", "33", "34", "35"]) },
];

export const surfaces = [
  { title: "Apple Watch", text: "Always dark. Up next, capture with Mark moment and Stop, and a commitment spotted with Add.", image: img("watch.jpg", "Three Apple Watch faces: Up next with the capture ring, capturing at 42:18 with Mark moment and Stop, and a commitment spotted with Add and Dismiss."), wide: true },
  { title: "Chrome extension", text: "The same Today card in a popover, plus capture of this tab's audio.", image: img("extension-idle.jpg", "The Chrome extension popover, idle: Memory, capture status, the Ask field, the Up next card and Capture this tab's audio."), wide: false },
  { title: "Tablet", text: "Today beside the meeting detail, in one view.", image: img("tablet-today.jpg", "Tablet layout: Today on the left, the pricing review summary and follow-ups on the right."), wide: false },
  { title: "Desktop", text: "A sidebar with Today, Ask, Memory and Settings; Start capture always in reach.", image: img("desktop-today.jpg", "Desktop layout for Mac: sidebar, Today and the meeting detail side by side."), wide: true },
];

export const largeText = img("large-text-today.jpg", "Today at three text sizes: Large (about 1.25 times), XL (about 1.6 times) and AX5 (about 3 times) with stacked layouts.");
export const rtl = img("rtl-01-03.jpg", "Today, live capture and meeting detail mirrored for Arabic, right to left; the waveform and the timer stay unmirrored.");

export const motionSpec = [
  ["Tap feedback", "100 ms", "ease-out", "Scale to 0.97 and back"],
  ["Screen push", "280 ms", "cubic-bezier(.2,0,0,1)", "Slide from the right; tab bar fades out"],
  ["Sheet", "320 ms", "cubic-bezier(.2,0,0,1)", "Slides up with a dimmed backdrop"],
  ["Capture start", "400 ms", "ease-in-out", "Ring closes into the recording dot"],
  ["Commitment spotted", "240 ms", "ease-out", "Card rises and holds for 8 seconds"],
  ["Summary arrival", "600 ms", "ease-out", "Lines fade in one by one"],
];
export const haptics = [
  ["Capture starts", "Medium impact", "Start tone: two rising notes, 180 ms", "Indicator appears"],
  ["Capture stops", "Heavy impact (hold to stop)", "Stop tone: one falling note", "Summary opens"],
  ["Commitment added", "Success notification", "None", "Toast: Added"],
  ["Gap detected", "Warning notification", "None", "Banner on Today"],
  ["Approve and send", "Light impact", "None", "Sent confirmation"],
];
export const performance = ["No continuous animation during capture, apart from the waveform", "Waveform draws at 20 frames a second and pauses when the screen is off", "Cold start under 2 seconds on a mid-range phone (target)", "Power saver mode at 20% battery: speech-only capture, no waveform", "Motion respects the reduced-motion setting; every cue has a non-motion equivalent"];

/* ── 12 · Validate ──────────────────────────────────────────────────────── */

export const testObjectives = ["Can first-time users start capture, understand consent and find what they owe?", "Do two roots and an Ask field beat five tabs on first-task success?", "Do people trust cited answers enough to act, and do they notice the approval step?", "Where do corrections and privacy controls get lost?"];
export const testRounds = [
  ["1", "Low-fi wireframes (first-click)", "5 per persona, P1 only"],
  ["2", "Hi-fi clickable prototype", "5 per persona, P1 and P2"],
  ["3", "Beta build", "5 per persona plus 15 remote unmoderated"],
];
export const testTasks = [
  ["T1", "You have a meeting in 18 minutes. Find out what you owe Priya.", "Reaches the prep card or Needs you in 2 taps"],
  ["T2", "Start recording this conversation.", "Taps Capture first time; understands the consent cue"],
  ["T3", "The call is over. Check the summary and send a follow-up.", "Reaches Approve and send; notices the approval step"],
  ["T4", "Find what Dev said about SSO last week.", "Uses the Ask field; reads sources"],
  ["T5", "A name in the summary is wrong. Fix it.", "Finds the correction; sees it propagate"],
  ["T6", "Stop ChatGPT reading your Personal memories.", "Reaches the switch under Privacy"],
  ["T7", "Make sure capture never runs at the clinic.", "Adds a sensitive place"],
  ["T8", "You think the app missed part of the call. Check.", "Finds the gap and its explanation"],
];
export const abTest = { question: "Ask as a field or a tab?", a: "Ask field (current): higher first-click success on T4", b: "Ask tab: higher discoverability for new users", measure: "T4 first-click success", guardrail: "Memory visits (A) and capture starts (B) do not drop", sample: "25 per arm" };

/** WCAG relative luminance and contrast, so the table below is computed from the tokens rather than typed in. */
function luminance(hex: string) {
  const c = hex.replace("#", "");
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(c.slice(i, i + 2), 16) / 255).map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
export function contrast(fg: string, bg: string) {
  const [l1, l2] = [luminance(fg), luminance(bg)].sort((a, b) => b - a);
  return (l1 + 0.05) / (l2 + 0.05);
}
const tok = (name: string) => tokens.find((t) => t.name === name)!;
const PAIRS: [string, string, string, number][] = [
  ["Primary text on page", "text/primary", "surface/page", 4.5],
  ["Secondary text on page", "text/secondary", "surface/page", 4.5],
  ["Tertiary text on page", "text/tertiary", "surface/page", 4.5],
  ["Hint on page (icons only)", "text/hint", "surface/page", 3],
  ["Accent text on page", "accent/text", "surface/page", 4.5],
  ["Record text on page", "record/text", "surface/page", 4.5],
  ["Private text on page", "private/text", "surface/page", 4.5],
  ["Alert text on page", "alert/text", "surface/page", 4.5],
  ["Text on primary button", "action/on", "action/fill", 4.5],
  ["Primary text on card", "text/primary", "surface/card", 4.5],
  ["Tertiary text on card", "text/tertiary", "surface/card", 4.5],
];
export const contrastRows = PAIRS.map(([pair, fg, bg, need]) => ({
  pair, need,
  light: { fg: tok(fg).light, bg: tok(bg).light, ratio: contrast(tok(fg).light, tok(bg).light) },
  dark: { fg: tok(fg).dark, bg: tok(bg).dark, ratio: contrast(tok(fg).dark, tok(bg).dark) },
}));

export const a11yFindings = ["The first Alert red measured 4.48:1 in light mode, just under 4.5:1. It was darkened to #C2354A (4.8:1) and the light screens were regenerated.", "Every other text pair passes 4.5:1; Hint is restricted to icons.", "Touch targets were raised to 44 px in the component library (chips, toggle, segmented control, timestamps and banner actions). The citation chip is 24 px inline, which meets the WCAG 2.2 minimum, and each answer also carries source cards that are much larger targets.", "Screen-reader labels are specified but untested. Dynamic type and reduced motion are specified, not yet tested."];
export const targetAudit = [
  ["Icon buttons (back, more, collapse)", "40 × 40", "Pass", "Raise to 44 × 44"],
  ["Header avatar", "40 × 40", "Pass", "Raise to 44 × 44"],
  ["Scope pill, feedback chips", "36 high", "Pass", "Raise to 44 or enlarge the touch area"],
  ["Suggestion chips (Ask)", "38 high", "Pass", "Raise to 44 high"],
  ["Add button (commitment)", "40 high", "Pass", "Raise to 44 high"],
  ["Toggle", "50 × 30", "Pass", "Keep the visual; extend the touch area to 44 high"],
  ["Primary buttons", "52 to 54 high", "Pass", "None"],
  ["Capture button", "66 × 66", "Pass", "None"],
  ["List rows", "52 or more high", "Pass", "None"],
];
export const localisation = [
  ["Scripts", "Devanagari, Tamil, Arabic, CJK; fall back to the Noto family; test line height per script"],
  ["Text expansion", "Allow 30% growth; no fixed-width labels; test Hindi and German strings"],
  ["Direction", "Mirror layouts for right-to-left; keep waveform and timer unmirrored"],
  ["Numbers and money", "Use locale formats, including lakh and crore grouping for rupees"],
  ["Strings", "Externalise from day one; pseudo-localise in CI; write Hindi and English together"],
];

/* ── 13 · Privacy ───────────────────────────────────────────────────────── */

export const dataInventory = [
  ["Audio", "Phone; cloud only with Cloud enhance on", "Not stored by default (deleted after transcription)", "Optional short local snippets, auto-expire", "User only"],
  ["Transcript text", "On device; optional encrypted backup", "Until the user deletes or the retention period ends", "30 days default (to confirm)", "User; AI tools in granted scope"],
  ["Entities (people, places)", "On device and backup", "With transcripts", "Same as transcripts", "User"],
  ["Commitments", "On device and backup", "Until done plus retention", "Same as transcripts", "User"],
  ["Calendar and email metadata", "Read through connectors", "Not copied beyond what a feature needs", "Minimum needed", "User"],
  ["Activity log", "On device and backup", "Request time, tool, scope, result", "90 days (to confirm)", "User"],
];
export const regulation = [
  ["India: DPDP Act 2023 and Rules 2025", "Consent-based processing, notice, ways to withdraw and exercise rights, security safeguards. Rules notified 13 Nov 2025; main obligations from 13 May 2027.", "Map data; design consent and withdrawal flows; plan for May 2027"],
  ["EU and UK GDPR", "Lawful basis, transparency, minimisation, rights, likely a data protection impact assessment for systematic recording", "Counsel review; DPIA before launch in the region"],
  ["US state recording laws", "Roughly a dozen states require all-party consent for recording conversations", "Region-aware consent prompt; counsel review"],
  ["App store policies", "Privacy labels, background audio justification, user-visible recording indicator", "Prepare labels and review notes"],
];
export const darkPatterns = [
  ["Pre-ticked consent", "Consent is never pre-ticked; remembering a person is opt-in", "Pass by design"],
  ["Hidden privacy controls", "Privacy is one tap from the avatar and in plain language", "Pass by design"],
  ["Guilt wording on opt-out", "Decline button reads “Not now”", "Pass by design"],
  ["Hard to delete", "Forget the last hour is on the privacy screen; full export and delete planned", "Partial"],
  ["Defaults that favour collection", "Cloud enhance is off by default", "Pass by design"],
  ["Confusing toggles", "Switch states and subtitles show scope", "To test"],
];
export const riskRegister = [
  ["A bystander is recorded without knowing", "High", "Start tone, visible indicator, consent prompt, sensitive zones"],
  ["An employer requires recording by staff", "Medium", "Policy: personal capture is user-controlled; no covert mode; enterprise review"],
  ["AI tool reads memory it should not", "High", "Scoped access, default Work only, activity log, block and log"],
  ["Transcript errors cause harm", "High", "Low-confidence marks, sources, approval before send"],
  ["Data breach of backups", "High", "End-to-end encryption plan, minimum retention, security review"],
  ["Use by or with minors", "Medium", "Age gate; parental consent flow under DPDP and local law (counsel)"],
];
export const privacyPrinciples = ["Private by default; capture is visible to everyone nearby", "Memory is never used to train models without explicit opt-in (proposal)", "People can see, correct, export and delete everything", "No hidden or covert recording mode", "Plain language over legal language"];
export const openLegal = ["Default retention and activity-log period", "Region-by-region consent defaults", "Backup encryption model", "Handling of minors", "What the bystander cue must be (tone, light, both)"];

/* ── 14 · Deliver ───────────────────────────────────────────────────────── */

export const pipeline = [
  { name: "Figma variables", items: ["49 variables", "Light and Dark modes"] },
  { name: "DTCG JSON", items: ["W3C Design Tokens, stable v2025.10"] },
  { name: "Style Dictionary", items: ["Fail CI on contrast pairs below target"] },
  { name: "Swift · Kotlin · CSS", items: ["Per-platform builds"] },
];
export const definitionOfDone = ["Matches the design in both modes", "Meets the acceptance criteria for its use case", "Passes contrast and 44 px target checks", "Screen-reader labels set and read in order", "Events fire with the documented properties", "Within battery and start-up budgets"];
export const events = [
  ["capture_started", "source, engine, consent_shown", "Capture reliability"],
  ["gap_detected", "reason, duration_s", "Capture reliability"],
  ["commitment_detected", "direction, has_due_date", "North Star funnel"],
  ["commitment_closed", "on_time, days_to_close", "North Star"],
  ["followup_sent", "edited, low_confidence_confirmed", "Approval rate"],
  ["answer_shown", "sources_count, latency_ms", "Recall quality"],
  ["fact_corrected", "entity_type, propagated_count", "Trust"],
  ["ai_request_blocked", "tool, space", "Trust"],
  ["forget_executed", "range", "Trust"],
  ["onboarding_completed", "minutes_to_first_value", "Adoption"],
];
export const budgets = ["Cold start under 2 seconds (mid-range phone)", "Capture adds no more than 8% battery per hour (target, to be measured)", "Answer latency under 3 seconds for 90% of questions", "Frame rate 60 fps on scroll; waveform at 20 fps"];
export const positioningStatement = "For people who talk through their day and lose what mattered, this is the memory app that captures privately, shows its sources, and helps you keep your promises. Unlike meeting-only note-takers, it works across the whole day, and unlike always-on tools, it is private by default.";
export const pillars = ["Private by default, visibly", "Every answer shows its source", "Keeps your promises, not just your notes"];
export const taglines = ["Remember what you promised.", "A day you can trust.", "Private by default. Useful by evening.", "Say it once."];
export const experiments = [
  ["E1", "Consent prompt wording", "Plain wording increases comfort without lowering capture starts", "Comfort score, capture start rate"],
  ["E2", "Ask field vs tab", "Field wins first-click success", "First-click success on T4"],
  ["E3", "Prep card timing (30 vs 10 minutes)", "Earlier prep raises prep opens", "Prep opens, commitments closed"],
  ["E4", "Draft in user voice vs neutral", "Own voice raises approval rate", "Approval rate, edit rate"],
  ["E5", "Morning brief on or off by default", "Brief raises week-5 retention", "Week-5 retention"],
  ["E6", "Free plan limits", "More free capture raises conversion later", "Conversion at day 60"],
];
export const rollout = [
  { name: "Alpha · 4 weeks", text: "Internal, 30 people.", items: ["Gate: capture reliability at 90% or more across devices"] },
  { name: "Closed beta · 6 weeks", text: "300 invited users, two regions.", items: ["Gate: reliability 95%, SUS 75 or more, no severity-4 issues"] },
  { name: "Staged public", text: "Region by region.", items: ["Gate: privacy review signed off; support load under target"] },
];

/* ── 15 · Next ──────────────────────────────────────────────────────────── */

export const nextSteps = [
  { label: "First", doodle: "team", title: "Run the studies", text: "8 to 12 interviews and a diary study, to replace the hypothesis personas and journeys with evidence." },
  { label: "Then", doodle: "approach", title: "Open card sort, then tree test", text: "48 cards, four rounds, in English and Hindi. The labels on this page are candidates until then." },
  { label: "Then", doodle: "flask", title: "Three usability rounds", text: "Eight tasks on wireframes, the clickable prototype and a beta build, five people per persona each round." },
  { label: "Before launch", doodle: "shield", title: "Close the open decisions", text: "Retention defaults, the bystander cue and region consent wording, with counsel." },
];
export const honestLimits = ["No users were interviewed or tested. Personas, journeys, metrics and scores are hypotheses.", "Funding and revenue figures for competitors come from press and aggregators and may be wrong.", "Consent wording needs legal review before use; the regulatory map is not legal advice.", "The density figures, contrast ratios and target sizes were measured in the Figma file, not on a device."];
export const lessons = ["Density is a design problem you can measure: cutting the first draft in half made it clearer.", "Audits find failures even in your own system: one red was 0.02 short of the ratio.", "Trust has to be designed, not announced: consent, gaps and approvals belong in the main flow."];
export const sources = [
  { label: "Einstein and McDaniel, prospective memory; Gollwitzer 1999, implementation intentions; Risko and Gilbert 2016, cognitive offloading", href: "https://doi.org/10.1016/j.tics.2016.07.002" },
  { label: "Roediger and Karpicke 2006, test-enhanced learning; Cepeda et al. 2006, distributed practice", href: "https://doi.org/10.1111/j.1467-9280.2006.01693.x" },
  { label: "Lee and See 2004, trust in automation; Amershi et al. 2019, guidelines for human-AI interaction; Nissenbaum 2004, contextual integrity", href: "https://doi.org/10.1145/3290605.3300233" },
  { label: "Piepenbrock et al. 2013, positive display polarity; Fitts 1954; von Restorff 1933; Cowan 2001", href: "https://doi.org/10.1080/00140139.2013.790485" },
  { label: "WCAG 2.2: contrast minimum and target size minimum", href: "https://www.w3.org/TR/WCAG22/" },
  { label: "W3C Design Tokens Community Group format", href: "https://www.designtokens.org/tr/drafts/format/" },
  { label: "India DPDP Act 2023 and the Rules notified 13 Nov 2025 (public legal summaries)", href: "https://www.meity.gov.in/" },
  { label: "TechCrunch on TwinMind's seed round (Sept 2025); Sacra on Plaud; TechCrunch on Claude Meetings (Nov 2026). Not audited.", href: "https://techcrunch.com/" },
];
