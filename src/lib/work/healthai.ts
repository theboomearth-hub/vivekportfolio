/**
 * End-to-end use case: HealthAI, an AI-first patient app for India, designed by Vivekanand
 * (self-initiated, no NDA). 50 screens: 17 phone, 11 tablet, 11 tablet landscape, 11 web.
 *
 * Source: the "Health AI Screen Export" (Nov 2026). Screens were rendered from the exported
 * HTML at 2x (1.5x for tablet and web) into /public/work/healthai/<slug>.jpg.
 *
 * Honesty rules for this page:
 * - Product facts (flows, copy, layouts, tokens) come from the screens themselves.
 * - Accessibility numbers come from axe-core 4.10 run on every exported screen, and tap
 *   targets were measured on the phone screens. Re-run if the screens change.
 * - The proto-persona, card sort and validation plan are design artefacts and a study plan.
 *   No participant research has been run yet, and the page says so. Don't add results here
 *   unless they come from real sessions.
 */

import type { CaseImage } from "@/components/case/CaseParts";

export const SLUG = "healthai";

export type Device = "phone" | "tablet" | "landscape" | "web";

export const devices: { id: Device; label: string; size: string }[] = [
  { id: "phone", label: "Phone", size: "390 × 844" },
  { id: "tablet", label: "Tablet", size: "834 × 1194" },
  { id: "landscape", label: "Tablet landscape", size: "1194 × 834" },
  { id: "web", label: "Web", size: "1440 wide" },
];

const deviceName: Record<Device, string> = { phone: "Phone", tablet: "Tablet", landscape: "Tablet landscape", web: "Web" };
const SIZE: Record<Exclude<Device, "web">, [number, number]> = { phone: [780, 1688], tablet: [1251, 1791], landscape: [1791, 1251] };
/** Web screens are full-page captures, so their heights differ. */
const WEB_H: Record<string, number> = {
  "w01-sign-in": 1350, "w02-dashboard": 1630, "w03-health-ai-chat": 1365, "w04-find-a-doctor": 1846,
  "w05-doctor-profile-and-booking": 1761, "w06-review-and-pay": 1350, "w07-appointments": 1350,
  "w08-video-consultation": 1350, "w09-consultation-summary": 1635, "w10-health-records": 1350, "w11-profile": 1747,
};

export interface Screen extends CaseImage {
  code: string;
  label: string;
}

const deviceOf = (slug: string): Device => ({ m: "phone", t: "tablet", l: "landscape", w: "web" } as const)[slug[0] as "m" | "t" | "l" | "w"];

function screen(slug: string, label: string, description: string): Screen {
  const device = deviceOf(slug);
  const [width, height] = device === "web" ? [2160, WEB_H[slug]] : SIZE[device];
  return {
    src: `/work/healthai/${slug}.jpg`,
    width,
    height,
    code: slug.slice(0, 3).toUpperCase(),
    label,
    alt: `${deviceName[device]}, ${label}: ${description}`,
  };
}

/* ── Screen descriptions shared across sizes ─────────────────── */
const D = {
  signIn: "sign in with a mobile number and a one-time code, or with email or Health ID, beside a welcome panel that previews a Health AI conversation.",
  home: "“How are you feeling today?” symptom box with common symptoms, the upcoming appointment with Join Call, a health snapshot of vitals, today’s medicines and top doctors.",
  chat: "Health AI chat with the notice “guidance, not a diagnosis; in an emergency, call 112”, a greeting, common-symptom chips, and a Live Assessment panel that fills in over three questions.",
  find: "Health AI’s suggested specialty (General Physician) above specialty filters and seven doctors, each with rating, experience, languages, availability, fee, View Profile and Book Now.",
  profileBooking: "doctor profile and booking on one screen: experience, ratings, registration, consultation type (video, chat or in-clinic), date, time slots with booked ones struck through, and the reason for visit with the AI assessment attached.",
  pay: "review and pay with a three-step tracker: the booking, an applied coupon, bill details, and UPI, card, net banking or Health AI wallet.",
  appointments: "upcoming, completed and cancelled tabs, with the selected booking’s details, Join Video Call, Reschedule and Cancel.",
  video: "the doctor speaking with live captions, call controls, and an AI Notes panel where Health AI lists symptoms and examination notes and can be paused.",
  summary: "a plain-language Health AI visit summary, the doctor’s provisional diagnosis, medicines with reminder toggles, doctor’s advice signed with a registration number, and actions to order medicines, book a test and book a follow-up.",
  records: "Health ID card, latest vitals with a mild-fever flag, and tabs for lab reports, prescriptions and AI checks, with blood-count values marked Normal.",
  profile: "personal details, emergency contact, and Health AI preferences for medicine reminders, appointment alerts, sharing AI checks with doctors, and reply language.",
};

export const S = {
  m01: screen("m01-welcome", "Welcome", "“Your AI health companion”, with a preview of Health AI and a doctor card, Get Started and I Already Have an Account."),
  m02: screen("m02-onboarding", "Onboarding", "“Describe symptoms, get instant guidance”, showing Health AI asking how high a fever is, with temperature ranges to tap."),
  m03: screen("m03-sign-in", "Sign in", "mobile number with +91, Send OTP, and Continue with Email or Health ID."),
  m04: screen("m04-verify-otp", "Verify OTP", "six-digit code entry with a number pad, a resend timer and Autofill from SMS."),
  m05: screen("m05-home", "Home", "“How are you feeling today?” symptom box, quick actions for symptom check, doctors, video consults and medicines, the upcoming appointment and a medicine reminder, above a bottom bar with Health AI in the centre."),
  m06: screen("m06-health-ai-chat", "Health AI chat", "the notice “guidance, not a diagnosis; in an emergency, call 112”, a greeting, and common symptoms to tap."),
  m07: screen("m07-ai-assessment", "AI assessment", "reported symptoms, recommended care on a self-care, doctor visit and emergency scale (“see a doctor within 24–48 hours”), possible causes rated strong match, possible and less likely, and Book Video Consult."),
  m08: screen("m08-find-a-doctor", "Find a doctor", "Health AI’s suggested specialty above specialty filters and doctor cards with rating, experience, availability and fee."),
  m09: screen("m09-doctor-profile", "Doctor profile", "Dr. Ananya Rao’s patients, experience, rating and reviews, and video, chat and in-clinic consultations with prices."),
  m10: screen("m10-book-appointment", "Book appointment", "a date strip, morning, afternoon and evening slots with booked ones struck through, and the consultation type."),
  m11: screen("m11-payment", "Review and pay", "the booking, an applied coupon, bill details, and UPI or card payment."),
  m12: screen("m12-booking-confirmed", "Booking confirmed", "date, time, consultation type, booking ID and amount paid, a reminder 15 minutes before, and Add to Calendar."),
  m13: screen("m13-appointments", "Appointments", "upcoming bookings with Reschedule, Join Call and Clinic Details."),
  m14: screen("m14-video-consultation", "Video consultation", "the doctor speaking, live captions, a “Health AI is taking notes” badge, and mute, video, captions and end-call controls."),
  m15: screen("m15-consultation-summary", "Consultation summary", D.summary),
  m16: screen("m16-health-records", "Health records", D.records),
  m17: screen("m17-profile", "Profile", "Health ID, age, blood group, height and weight, Health AI preferences, and the language Health AI replies in."),
  t01: screen("t01-sign-in", "Sign in", D.signIn),
  t02: screen("t02-home", "Home", D.home),
  t03: screen("t03-health-ai-chat", "Health AI chat", D.chat),
  t04: screen("t04-find-a-doctor", "Find a doctor", D.find),
  t05: screen("t05-doctor-profile-and-booking", "Doctor profile and booking", D.profileBooking),
  t06: screen("t06-review-and-pay", "Review and pay", D.pay),
  t07: screen("t07-appointments", "Appointments", D.appointments),
  t08: screen("t08-video-consultation", "Video consultation", D.video),
  t09: screen("t09-consultation-summary", "Consultation summary", D.summary),
  t10: screen("t10-health-records", "Health records", D.records),
  t11: screen("t11-profile", "Profile", D.profile),
  l01: screen("l01-sign-in", "Sign in", D.signIn),
  l02: screen("l02-home", "Home", D.home),
  l03: screen("l03-health-ai-chat", "Health AI chat", D.chat),
  l04: screen("l04-find-a-doctor", "Find a doctor", D.find),
  l05: screen("l05-doctor-profile-and-booking", "Doctor profile and booking", D.profileBooking),
  l06: screen("l06-review-and-pay", "Review and pay", D.pay),
  l07: screen("l07-appointments", "Appointments", D.appointments),
  l08: screen("l08-video-consultation", "Video consultation", D.video),
  l09: screen("l09-consultation-summary", "Consultation summary", D.summary),
  l10: screen("l10-health-records", "Health records", D.records),
  l11: screen("l11-profile", "Profile", D.profile),
  w01: screen("w01-sign-in", "Sign in", D.signIn),
  w02: screen("w02-dashboard", "Dashboard", D.home),
  w03: screen("w03-health-ai-chat", "Health AI chat", D.chat),
  w04: screen("w04-find-a-doctor", "Find a doctor", D.find),
  w05: screen("w05-doctor-profile-and-booking", "Doctor profile and booking", D.profileBooking),
  w06: screen("w06-review-and-pay", "Review and pay", D.pay),
  w07: screen("w07-appointments", "Appointments", D.appointments),
  w08: screen("w08-video-consultation", "Video consultation", D.video),
  w09: screen("w09-consultation-summary", "Consultation summary", D.summary),
  w10: screen("w10-health-records", "Health records", D.records),
  w11: screen("w11-profile", "Profile", D.profile),
};

export const phoneScreens: Screen[] = [S.m01, S.m02, S.m03, S.m04, S.m05, S.m06, S.m07, S.m08, S.m09, S.m10, S.m11, S.m12, S.m13, S.m14, S.m15, S.m16, S.m17];
export const screenCount = Object.keys(S).length;

export const hero: CaseImage = {
  src: "/work/healthai/hero.jpg",
  width: 2000,
  height: 1250,
  alt: "HealthAI on three screen sizes: the web dashboard with a symptom check, upcoming appointment and vitals; the tablet home screen; and the phone home screen asking “How are you feeling today?”.",
};

export const facts = [
  { term: "Role", detail: "Designer, end to end (self-initiated)" },
  { term: "Scope", detail: "Flows, information architecture, AI conversation and assessment, interface" },
  { term: "Screens", detail: `${screenCount} across phone, tablet (portrait and landscape) and web` },
  { term: "Status", detail: "Design concept" },
];

export const goals = [
  { title: "Right care, sooner", body: "Tell a patient what level of care they need and how soon, before they book anything." },
  { title: "The AI’s limits are visible", body: "Guidance, never a diagnosis, with the emergency route always one glance away." },
  { title: "One thread, one record", body: "The assessment carries into the booking, the booking into the call, and the call into a plan and a record." },
];

/* ── Users ─────────────────────────────────────────────────────── */
export const persona = {
  name: "Aarav, 32, Bengaluru",
  context: "Fever and body ache since yesterday. Pays for most things with UPI. Would rather not sit in a clinic queue for something that might be minor.",
  goals: ["Know whether to wait it out or see a doctor", "See the right doctor today, without a queue", "Remember what to take, and when"],
  worries: ["Wasting a visit on something minor", "Missing something serious", "An AI that sounds more certain than it is"],
};

export const jobs = [
  "When I feel unwell, help me decide whether I need a doctor, so I don’t waste a visit or miss something serious.",
  "When I need a doctor, let me see the right one today, without a clinic queue.",
  "After the visit, keep the plan in one place, so I take the right medicine at the right time.",
];

/* ── Journey map ───────────────────────────────────────────────── */
export type AiRole = "Leads" | "Assists" | "Steps back";
export const journeyMap: { stage: string; question: string; app: string; ai: AiRole; screens: string }[] = [
  { stage: "Notice", question: "Is this serious?", app: "Home opens on “How are you feeling today?”", ai: "Leads", screens: "M05 · W02" },
  { stage: "Describe", question: "What do I say?", app: "Three short questions, with answers to tap", ai: "Leads", screens: "M06 · W03" },
  { stage: "Decide", question: "Do I need a doctor?", app: "Care level and time frame, likely causes, red flags", ai: "Leads", screens: "M07 · W03" },
  { stage: "Choose", question: "Which doctor?", app: "Suggested specialty; the patient picks from a filtered list", ai: "Assists", screens: "M08–M09 · W04" },
  { stage: "Book", question: "When, and how much?", app: "Video, chat or in-clinic; slot; UPI first; assessment attached", ai: "Assists", screens: "M10–M12 · W05–W06" },
  { stage: "Consult", question: "Will the doctor understand me?", app: "Live captions; AI notes the patient can pause", ai: "Steps back", screens: "M13–M14 · W07–W08" },
  { stage: "Recover", question: "What do I take, and when?", app: "Plain-language summary, signed diagnosis, dose reminders", ai: "Assists", screens: "M15 · W09" },
  { stage: "Follow up", question: "What if it doesn’t get better?", app: "Book a test or follow-up; one record under the Health ID", ai: "Steps back", screens: "M16 · W10" },
];

/* ── Workflow: user flow with decision points ─────────────────── */
export interface FlowStep {
  label: string;
  code?: string;
  /** A decision point, with its branches. */
  decision?: { label: string; code?: string; designed: boolean; next?: string }[];
}
export const userFlow: { phase: string; steps: FlowStep[]; exit?: string }[] = [
  {
    phase: "Get in",
    steps: [
      { label: "Welcome", code: "M01", decision: [{ label: "New: three onboarding cards", code: "M02", designed: true }, { label: "Has an account: skip to sign-in", designed: true }] },
      { label: "Mobile number", code: "M03" },
      { label: "One-time code, autofilled from SMS", code: "M04" },
      { label: "Home", code: "M05" },
    ],
    exit: "Start a symptom check",
  },
  {
    phase: "Assess",
    steps: [
      { label: "Health AI chat: three questions", code: "M06" },
      { label: "AI assessment", code: "M07" },
      {
        label: "Recommended care?",
        decision: [
          { label: "Self-care: save, recheck temperature every 6 hours", code: "M07", designed: true },
          { label: "Emergency: call 112", designed: false },
          { label: "Doctor visit", designed: true, next: "Book" },
        ],
      },
    ],
    exit: "Book Video Consult",
  },
  {
    phase: "Book",
    steps: [
      { label: "Doctors, filtered to the suggested specialty", code: "M08" },
      { label: "Doctor profile", code: "M09" },
      { label: "Consultation type, date and slot", code: "M10" },
      { label: "Review and pay", code: "M11" },
      { label: "Payment?", decision: [{ label: "Paid: booking confirmed", code: "M12", designed: true }, { label: "Failed: retry or change method", designed: false }] },
    ],
    exit: "Join at the booked time",
  },
  {
    phase: "Consult and after",
    steps: [
      { label: "Appointments: Join Call", code: "M13" },
      { label: "Video call with captions and AI notes", code: "M14" },
      { label: "Consultation summary", code: "M15", decision: [{ label: "Order medicines", designed: false }, { label: "Book a test", designed: false }, { label: "Book a follow-up", designed: false }] },
      { label: "Health records", code: "M16" },
    ],
  },
];

/* ── Workflow: service blueprint ──────────────────────────────── */
export const blueprintStages = ["Sign in", "Describe and assess", "Choose and book", "Pay and confirm", "Consult", "After the visit"];
export const blueprint: { lane: string; note?: string; cells: string[] }[] = [
  {
    lane: "Patient",
    cells: ["Enters mobile number and code", "Describes symptoms, taps answers", "Picks a doctor, type and slot", "Pays, usually with UPI", "Joins the video call", "Reads the plan, sets reminders"],
  },
  {
    lane: "Health AI",
    cells: ["—", "Asks three questions; recommends a care level; lists causes and red flags", "Suggests a specialty; attaches the assessment", "—", "Takes notes the patient can pause", "Writes the plain-language summary"],
  },
  {
    lane: "Doctor",
    cells: ["—", "—", "Offers slots by type: video, chat, in-clinic", "—", "Consults and examines", "Signs a provisional diagnosis and prescription"],
  },
  {
    lane: "Behind the scenes",
    note: "Not visible to the patient",
    cells: ["Sends the code; links the Health ID", "Saves the check to AI Checks in records", "Holds availability per slot", "Applies the coupon; issues a booking ID; sets a reminder", "End-to-end encrypted call; live captions", "Files the report under the Health ID; dose reminders"],
  },
];

/* ── Card sort and information architecture ───────────────────── */
export const sortGroups = ["Health AI", "Doctors", "Visits", "Records", "Profile"] as const;
export type SortGroup = (typeof sortGroups)[number];
export const sortCards: { card: string; group: SortGroup }[] = [
  { card: "Describe symptoms", group: "Health AI" },
  { card: "AI assessment", group: "Health AI" },
  { card: "Possible causes", group: "Health AI" },
  { card: "When to get urgent care", group: "Health AI" },
  { card: "Start a new check", group: "Health AI" },
  { card: "Search by specialty", group: "Doctors" },
  { card: "Ratings and reviews", group: "Doctors" },
  { card: "Consultation fees", group: "Doctors" },
  { card: "Available slots", group: "Doctors" },
  { card: "Save a doctor", group: "Doctors" },
  { card: "Join a video call", group: "Visits" },
  { card: "Reschedule", group: "Visits" },
  { card: "Booking ID", group: "Visits" },
  { card: "Consultation summary", group: "Visits" },
  { card: "Book a follow-up", group: "Visits" },
  { card: "Lab reports", group: "Records" },
  { card: "Prescriptions", group: "Records" },
  { card: "Latest vitals", group: "Records" },
  { card: "Health ID", group: "Records" },
  { card: "Upload a report", group: "Records" },
  { card: "Medicine reminders", group: "Profile" },
  { card: "Share AI checks with doctors", group: "Profile" },
  { card: "Reply language", group: "Profile" },
  { card: "Emergency contact", group: "Profile" },
  { card: "Payment methods", group: "Profile" },
];

/** Where each destination lives on each size, read from the screens. */
export const navMap: { place: string; phone: string; tablet: string; web: string }[] = [
  { place: "Home", phone: "Home tab", tablet: "Home", web: "Dashboard" },
  { place: "Health AI", phone: "Centre button", tablet: "Health AI", web: "Health AI, plus “Ask Health AI” in the top bar" },
  { place: "Doctors", phone: "Home quick action", tablet: "Doctors", web: "Find a Doctor" },
  { place: "Visits", phone: "Visits tab", tablet: "Visits", web: "Appointments" },
  { place: "Records", phone: "Records tab", tablet: "Records", web: "Health Records" },
  { place: "Profile", phone: "Profile tab", tablet: "Profile", web: "Profile" },
];

/* ── Task flows (screen counts from the export) ───────────────── */
export const taskFlows = [
  { task: "From symptom to a paid booking", phone: "7 screens", larger: "5 screens", path: "Home → chat → assessment → doctors → profile → slot → pay", note: "Tablet and web merge the assessment into the chat and the slot into the profile." },
  { task: "Join a booked consultation", phone: "1 tap", larger: "1 click", path: "Home → Join Call", note: "The upcoming appointment card sits on Home at every size." },
  { task: "Act on the doctor’s plan", phone: "1 screen", larger: "1 screen", path: "Summary → reminders, medicines, test, follow-up", note: "Every next step is a button on the summary." },
];

/* ── Journey chapters (screens per size) ──────────────────────── */
export interface Chapter {
  n: string;
  title: string;
  body: string;
  decision: string;
  screens: Record<Device, Screen[]>;
}
export const chapters: Chapter[] = [
  {
    n: "01",
    title: "Get in",
    body: "Onboarding shows what Health AI does before it asks for anything. Sign-in is a mobile number and a one-time code with SMS autofill; email and Health ID are alternatives.",
    decision: "On tablet and web, the welcome message and sign-in share one screen.",
    screens: { phone: [S.m01, S.m02, S.m03, S.m04], tablet: [S.t01], landscape: [S.l01], web: [S.w01] },
  },
  {
    n: "02",
    title: "Describe what’s wrong",
    body: "Home opens on one question: how are you feeling today? Health AI asks three short questions and offers answers to tap, then recommends a level of care, how soon, and the likely causes.",
    decision: "On a phone the assessment is its own screen; on larger screens it builds beside the chat as the patient answers.",
    screens: { phone: [S.m05, S.m06, S.m07], tablet: [S.t02, S.t03], landscape: [S.l02, S.l03], web: [S.w02, S.w03] },
  },
  {
    n: "03",
    title: "Find the right doctor",
    body: "The assessment carries over. Health AI suggests a specialty and filters the list, but the patient chooses the doctor, comparing rating, experience, languages, availability and fee.",
    decision: "The suggestion is a filter the patient can clear, not a pre-selected doctor.",
    screens: { phone: [S.m08, S.m09], tablet: [S.t04], landscape: [S.l04], web: [S.w04] },
  },
  {
    n: "04",
    title: "Book and pay",
    body: "Pick video, chat or in-clinic, then a date and a slot. The reason for visit is filled in and the AI assessment is attached for the doctor. Payment leads with UPI, and the confirmation sets a reminder 15 minutes before.",
    decision: "Phone: four short steps. Tablet and web: profile and slot on one screen, then a three-step tracker.",
    screens: { phone: [S.m10, S.m11, S.m12], tablet: [S.t05, S.t06], landscape: [S.l05, S.l06], web: [S.w05, S.w06] },
  },
  {
    n: "05",
    title: "See the doctor",
    body: "Join from Home or Appointments. During the call, live captions run and Health AI takes notes that the patient can see and pause. Both get the notes after the call.",
    decision: "On a phone the video fills the screen; on larger screens the AI notes sit beside or below it.",
    screens: { phone: [S.m13, S.m14], tablet: [S.t07, S.t08], landscape: [S.l07, S.l08], web: [S.w07, S.w08] },
  },
  {
    n: "06",
    title: "After the visit",
    body: "The summary turns the consultation into a plan: a plain-language recap, the doctor’s provisional diagnosis signed with their registration number, medicines with reminders, a test to book if the fever lasts, and a follow-up. It all lands in one record under the Health ID.",
    decision: "Every next step is a button on the summary, not a separate search.",
    screens: { phone: [S.m15, S.m16], tablet: [S.t09, S.t10], landscape: [S.l09, S.l10], web: [S.w09, S.w10] },
  },
  {
    n: "07",
    title: "Stay in control",
    body: "Profile is where the patient sets how the AI behaves: medicine reminders, appointment alerts, whether AI checks are shared with doctors, and the language Health AI replies in.",
    decision: "Sharing AI checks with doctors is a setting the patient can switch off.",
    screens: { phone: [S.m17], tablet: [S.t11], landscape: [S.l11], web: [S.w11] },
  },
];

/* ── AI design decisions ──────────────────────────────────────── */
export const aiPrinciples = [
  {
    title: "Guidance, not a diagnosis",
    body: "“Health AI gives guidance, not a diagnosis. In an emergency, call 112.” The line stays in the chat header on phones and in the sidebar on larger screens, not just in the terms.",
  },
  {
    title: "Tap, don’t type",
    body: "Health AI asks three short questions and offers answers to tap: common symptoms, temperature ranges. Fewer typed answers means fewer ambiguous ones, and “Question 1 of 3” says how long it will take.",
  },
  {
    title: "Triage on a visible scale",
    body: "Recommended care sits on a three-step scale (self-care, doctor visit, emergency) with a time frame. Causes are rated in words (strong match, possible, less likely), not percentages that imply false precision.",
  },
  {
    title: "Red flags are never hidden",
    body: "Every assessment lists when to get urgent care, such as a fever above 103°F that won’t come down or difficulty breathing, whatever level of care it recommends.",
  },
  {
    title: "The AI suggests, the patient decides",
    body: "Health AI suggests a specialty and attaches its assessment to the booking. The patient picks the doctor, and a profile setting controls whether AI checks are shared at all.",
  },
  {
    title: "The AI takes notes, the doctor signs",
    body: "During the call, the AI’s notes are visible and can be paused. The diagnosis in the summary is the doctor’s, marked provisional and signed with a registration number.",
  },
];

/* ── Responsive rules ─────────────────────────────────────────── */
export const layoutCompare: Screen[] = [S.m06, S.t03, S.l03, S.w03];
export const layoutRules = [
  { title: "Navigation", body: "Phone: a bottom bar with Health AI in the centre. Tablet: an icon rail with labels. Web: a full sidebar, plus “Ask Health AI” in the top bar." },
  { title: "The emergency line", body: "In the chat header on phones; a permanent sidebar card on web." },
  { title: "Assessment", body: "Its own screen on phones; a live panel beside the chat on tablet and web." },
  { title: "Booking", body: "Four short screens on phones; on tablet and web, profile and slots share a screen, then a three-step tracker." },
  { title: "Video", body: "Full screen on phones; AI notes, chat and details below the video on tablet portrait and beside it in landscape and on web." },
  { title: "Built for India", body: "+91 sign-in with SMS autofill, UPI first, prices in ₹ per consultation type, 112 for emergencies, and replies in English, हिन्दी or ಕನ್ನಡ." },
];

/* ── Design system (read from the screens’ CSS) ───────────────── */
export const tokens: { name: string; hex: string; use: string; contrast?: string }[] = [
  { name: "Primary", hex: "#1D65AF", use: "Actions, links, active navigation", contrast: "5.9:1 with white" },
  { name: "Primary strong", hex: "#154A82", use: "Text on tinted chips", contrast: "7.8:1 on primary soft" },
  { name: "Primary soft", hex: "#E6EFFB", use: "Selected states, AI suggestions" },
  { name: "Text", hex: "#2F2F2F", use: "Headings and body", contrast: "13.4:1 on white" },
  { name: "Secondary text", hex: "#505050", use: "Descriptions", contrast: "8.1:1 on white" },
  { name: "Canvas", hex: "#F3F3F3", use: "App background" },
  { name: "Success", hex: "#1F5A24", use: "Normal values, confirmed", contrast: "7.3:1 on its tint" },
  { name: "Danger", hex: "#C52828", use: "End call, remove", contrast: "5.7:1 on white" },
];
export const systemFacts = [
  { term: "Type", detail: "Poppins throughout, with most interface text at 12–14 px" },
  { term: "Shape", detail: "12 px corners on cards and buttons; full pills for chips and badges" },
  { term: "Targets", detail: "127 of 165 phone controls are 44 px or taller" },
  { term: "Patterns", detail: "Symptom chips, care-level scale, slot picker, consultation-type switch, three-step tracker, vitals tiles, reminder toggles" },
];

/* ── Accessibility (axe-core 4.10, WCAG 2.2 AA rules, all 50 screens) ── */
export const a11y = {
  passed: 42,
  total: 50,
  issues: [
    { what: "The “Health AI” label on the blue card is white on #417EBC: 4.25:1, short of 4.5:1.", fix: "Use the primary blue (#1D65AF, 5.9:1).", screens: "M05, W02, T02, L02" },
    { what: "The chat’s date label is #717171 on #F3F3F3: 4.40:1.", fix: "Use the secondary text colour (#505050, 7.3:1).", screens: "M06" },
    { what: "The onboarding step dots have a label but no role, so screen readers skip it.", fix: "Give them role=\"img\", or add visually hidden text.", screens: "M02" },
    { what: "The tick that confirms a valid number has a label but no role.", fix: "Give it role=\"img\".", screens: "M03" },
    { what: "The vitals strip scrolls sideways but can’t be reached with a keyboard.", fix: "Make it focusable with a label, or wrap the tiles.", screens: "M16" },
  ],
  designedIn: [
    "Live captions during video consultations",
    "Health AI replies in English, Hindi or Kannada",
    "One-time codes autofill from SMS",
    "The emergency line is always on screen in the chat",
  ],
};

/* ── Validation plan (not yet run) ────────────────────────────── */
export const validation = [
  { method: "Open card sort", who: "15 patients, 25 cards", answers: "Do patients group features the way the navigation does? Which labels do they use: Visits or Appointments?" },
  { method: "Tree test", who: "30+ patients, 5 tasks", answers: "Can they find last month’s blood test, change the AI’s reply language, and find a dermatologist available today? Target: 80% success." },
  { method: "Triage comprehension", who: "20 patients, unmoderated", answers: "After reading an assessment, can they say what to do and how soon, and that it isn’t a diagnosis? Target: 90%." },
  { method: "Moderated usability test", who: "6–8 patients, phone prototype", answers: "Check a fever and decide what to do; book a video consult for today under ₹500; join the call and find the plan; set a medicine reminder." },
  { method: "Clinical review", who: "Two general physicians", answers: "Review the question sets, red flags and wording before any patient sees them." },
];

export const nextSteps = [
  "Fix the five accessibility issues above, and raise the quick-reply chips from 38 to 44 px: they’re the main way to answer the AI.",
  "Use one name per place: it’s “Visits” on phone and tablet but “Appointments” on web, and “Home” versus “Dashboard”.",
  "Design the paths that don’t exist yet: the emergency hand-off, a failed payment, a doctor running late, and a dropped call.",
  "Family profiles: pediatricians are in the doctor list, but every profile is for one person.",
  "Run the studies above and replace the proto-persona with what patients actually say.",
];
