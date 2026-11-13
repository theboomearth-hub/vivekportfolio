/** Shared types for the Hosamane prototype. All data is fictional. */

export type Mode = "rent" | "buy";

export interface Photo {
  id: string;
  src: string;
  kind: string;
  year: number;
}

export interface Listing {
  id: string;
  mode: Mode;
  title: string;
  localityId: string;
  bhk: number;
  bathrooms: number;
  sqft: number;
  floor: number;
  floorsTotal: number;
  furnishing: "furnished" | "semi" | "unfurnished";
  balconies: number;
  amenities: string[];
  rent?: number;
  depositMonths?: number;
  maintenance?: number;
  brokerageMonths?: number;
  price?: number;
  perSqft?: number;
  readiness?: "ready" | "under construction";
  possession?: string;
  builder?: string;
  builderDelivered?: number;
  builderAvgDelayMonths?: number;
  registration?: { status: "registered" | "not found"; number: string | null; checkedDaysAgo: number };
  khata?: string;
  corpusPerSqft?: number;
  lister: "owner" | "broker" | "builder";
  listerName: string;
  listedDaysAgo: number;
  availabilityConfirmedDaysAgo: number | null;
  ownerConfirmed: { method: string; daysAgo: number } | null;
  photos: Photo[];
  scamAsk: boolean;
  status: "available" | "taken";
  ownerAnswers: { pets: string; depositNegotiable: string; houseRules: string };
  replyDelayMin: number | null;
  visitSlots: string[];
}

export interface Locality {
  id: string;
  name: string;
  x: number;
  y: number;
  rent2: [number, number];
  sqft: number;
  sourced: boolean;
  metroKm: number;
  water: string;
  flood: string | null;
}

export interface Anchor {
  id: string;
  name: string;
  x: number;
  y: number;
}

export type Origin = "you" | "assumed";

export interface Brief {
  mode: Mode | null;
  bhk: number | null;
  budget: number | null; // rent: per month; buy: total price
  downPayment: number | null;
  anchorId: string | null;
  time: string | null; // "9 am"
  maxCommuteMin: number | null;
  furnishing: "furnished" | "semi" | "unfurnished" | "any" | null;
  readiness: "ready" | "under construction" | "any" | null;
  mustHaves: string[]; // "pets", "balcony", "parking", "2 bathrooms"
  dealBreakers: string[]; // "brokers", "ground floor"
  localities: string[];
  people: { name: string; role: "votes" | "views" }[];
  origins: Record<string, Origin>;
}

export const emptyBrief = (): Brief => ({
  mode: null,
  bhk: null,
  budget: null,
  downPayment: null,
  anchorId: null,
  time: null,
  maxCommuteMin: null,
  furnishing: null,
  readiness: null,
  mustHaves: [],
  dealBreakers: [],
  localities: [],
  people: [],
  origins: {},
});

export interface Check {
  key: string;
  label: string;
  state: "pass" | "todo" | "warn";
  detail: string;
  source: string;
}

export interface OwnerReply {
  listingId: string;
  owner: string;
  replyInMin: number | null; // null = no reply
  answers: { question: string; answer: string }[];
}

export interface Task {
  id: string;
  kind: "ask" | "visits" | "watch";
  title: string;
  createdAt: number;
  listingIds: string[];
  replies?: OwnerReply[];
  visits?: { listingId: string; slot: string; status: "confirmed" | "declined"; alternative?: string }[];
  stopped?: boolean;
  revealed?: boolean; // prototype: simulated replies shown early
}

export interface ActivityEntry {
  at: number;
  action: string;
  detail: string;
  tool: string;
}

/** Session memory sent with every request; the server keeps no state between requests. */
export interface Memory {
  brief: Brief;
  shortlist: string[];
  removed: { id: string; reason: string }[];
  selectedId: string | null;
  tasks: Task[];
  asked: number; // messages sent to owners today (anti-harvesting limit)
  standing: { askStandardQuestions: boolean };
  shareToken: string | null;
  notes: string;
  questionsAsked: number; // clarifying questions before the first shortlist (max 2)
  name: string; // the searcher's first name, used on share links
}

export const emptyMemory = (): Memory => ({
  brief: emptyBrief(),
  shortlist: [],
  removed: [],
  selectedId: null,
  tasks: [],
  asked: 0,
  standing: { askStandardQuestions: false },
  shareToken: null,
  notes: "",
  questionsAsked: 0,
  name: "Rohan",
});

/** Events streamed from /api/agent, one JSON object per line. */
export type AgentEvent =
  | { t: "tool"; id: string; name: string; args: unknown }
  | { t: "result"; id: string; name: string; data: unknown }
  | { t: "text"; text: string }
  | { t: "ask"; question: string; field: string; options: { label: string; value: string }[] }
  | { t: "approval"; action: ApprovalAction; summary: string; payload: unknown }
  | { t: "refusal"; rule: string; reason: string; instead: string }
  | { t: "memory"; memory: Memory }
  | { t: "activity"; entry: ActivityEntry }
  | { t: "suggest"; options: string[] }
  | { t: "done" };

export type ApprovalAction = "send_owner_message" | "schedule_visits" | "share_shortlist" | "report_listing";
