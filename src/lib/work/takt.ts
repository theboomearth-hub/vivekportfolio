/**
 * Takt: an Industry 4.0 data platform for a multi-plant auto-parts maker. A self-initiated concept, taken end to end
 * as product manager and designer: problem and business case, desk research, information architecture, flows,
 * metrics, prioritisation and roadmap. One scenario, the night Line 3 stopped, runs through every section.
 *
 * Labelling rules on this page: industry facts carry a source; the company, plants, people and incident are
 * fictional; scenario timings and RICE inputs are estimates; metric targets are hypotheses to test in a pilot.
 */
import type { Persona } from "@/components/sketch/PersonaCard";
import { LINE_COUNT, MACHINES, SIGNAL_COUNT, SITES } from "@/lib/work/takt-plant";

export const SLUG = "takt";

export const facts = [
  { term: "Role", detail: "Product manager and product designer, end to end (self-initiated)" },
  { term: "Scope", detail: "Business case, desk research, information architecture, flows, metrics, prioritisation and roadmap" },
  { term: "Built with", detail: "An interactive asset explorer and a live tree test, on a fictional four-plant dataset" },
  { term: "Status", detail: "Design concept, informed by two years designing IIoT and big-data products (2018–20)" },
];

export const keyNumbers = [
  { value: String(SITES.length), label: "Plants in one model", note: "Fictional maker, real-world structure" },
  { value: String(MACHINES.length), label: "Machines on " + LINE_COUNT + " lines", note: "In the explorer below" },
  { value: SIGNAL_COUNT.toLocaleString("en-IN"), label: "Sensor signals, one naming rule", note: "Every one findable by name" },
  { value: "3", label: "Hierarchies for each machine", note: "Location, process, machine type" },
];

/* ── 00 · The night Line 3 stopped ─────────────────────────────────────── */

/** The same incident, today and with Takt. Times are a scenario, not a measurement. */
export const scenario: string[][] = [
  ["01:40", "Vibration on weld robot WR-04's axis-2 motor starts creeping up. Nobody sees it: the trend lives in a historian nobody opens at night.", "Takt flags the drift against the motor's normal band and puts a 'watch' on WR-04 for the maintenance planner. No alarm, no noise."],
  ["02:14", "Line 3 stops. The operator's panel fills with 38 alarms in 9 minutes: the robot fault, then everything downstream starving and upstream blocking.", "Takt groups the 38 into one incident and puts the first cause on top: WR-04 axis-2 overcurrent. The operator sees one card, not a flood."],
  ["02:20", "The operator phones the shift supervisor, who phones maintenance. Everyone asks the same three questions.", "The supervisor opens the incident link from the operator's message. The technician gets the same link, with the machine, its history and the spare's bin."],
  ["02:35", "The technician walks to the cell, checks a paper logbook, then the stores for a spare motor.", "Asked 'why did Line 3 stop?', Takt's copilot shows the vibration trend, the bearing replaced 41 days ago and a similar incident on Line 1 in March."],
  ["03:40", "Root cause found: a failing bearing on the axis-2 motor. Motor swapped.", "The technician approves a work order the copilot drafted; the motor is swapped by 02:58."],
  ["04:05", "Line restarts. Downtime: 1 hour 51 minutes. The cause goes in a shift diary, in pen.", "Line restarts at 03:10. Downtime: 56 minutes. The incident closes with its cause, parts and work order attached."],
  ["08:30", "The plant head learns about it from an Excel report, and asks for the root cause by email.", "The plant head's morning view shows the OEE dip, the cause, the fix and the open action: check the other WR robots' bearings."],
];

/* ── 01 · Problem and opportunity (product lens) ───────────────────────── */

export const painPoints = [
  { doodle: "layers", title: "One plant, six systems", text: "Control panels per line, a historian, MES, ERP, a maintenance tool and spreadsheets. None of them agree on what a machine is called." },
  { doodle: "tangle", title: "Every plant names things its own way", text: "'WR4', 'Robot-04' and 'BDY_L3_R04' are the same robot in three systems. Cross-plant comparison is a week of Excel." },
  { doodle: "ban", title: "Alarms arrive as a flood", text: "One fault cascades into dozens of alarms. The first cause is buried, and operators learn to acknowledge without reading." },
  { doodle: "talk", title: "Knowledge lives in people", text: "Why a machine fails, and what fixed it last time, sits with the senior technician on the day shift." },
];

/** Sourced industry facts. */
export const marketFacts = [
  { value: "₹6.14 lakh cr", label: "Indian auto-component industry turnover, FY24", note: "Up 9.8%. ACMA, via Business Standard" },
  { value: "$2.3M", label: "Cost of an hour's downtime in a large car plant", note: "Siemens, True Cost of Downtime 2024" },
  { value: "11%", label: "Of revenue lost to unplanned downtime by the Fortune Global 500", note: "About $1.4 trillion a year. Siemens, 2024" },
  { value: ">10", label: "Alarms in 10 minutes for one operator counts as a flood", note: "ISA-18.2 guidance; 1 per 10 min is the acceptable rate" },
];

export const customer = [
  { term: "Beachhead", detail: "Tier-1 and tier-2 auto-component makers with two to six plants" },
  { term: "Buyer", detail: "Head of manufacturing or COO; the digital-transformation lead is the champion" },
  { term: "Users", detail: "Operators, supervisors, maintenance, quality, plant heads and reliability analysts" },
  { term: "Pricing hypothesis", detail: "Per plant, per year, with a one-plant pilot credited on rollout" },
];

/* ── 02 · Product framing ─────────────────────────────────────────────── */

export const goals = [
  "Every machine, signal and event has one name, findable in seconds by anyone on any shift.",
  "A stoppage becomes one incident with its likely cause, not a flood of alarms.",
  "The history of a machine travels with it: work orders, parts, past incidents.",
  "Plant heads compare plants on the same definitions, without Excel.",
];
export const nonGoals = [
  "Controlling machines. Takt reads; the control system stays the only thing that writes.",
  "Replacing the historian, MES or ERP. Takt sits on top and links them.",
  "Predicting everything on day one. Prediction comes after the model and the naming are trusted.",
];

/** North star, inputs and guardrails. Targets are hypotheses for a one-plant pilot. */
export const metrics = [
  { kind: "North star", name: "Unplanned downtime minutes per 1,000 production hours", target: "−20% at the pilot plant in two quarters", why: "The cost the business feels, and the one OEE availability hides in an average." },
  { kind: "Input", name: "Median time from stop to known cause", target: "−40%", why: "Where the scenario's 55 minutes came from." },
  { kind: "Input", name: "Share of stoppages opened as one incident", target: "≥ 80%", why: "Tells us grouping works on real cascades, not just the demo." },
  { kind: "Input", name: "Weekly active people per role, per shift", target: "Night shift ≥ day shift", why: "Night shift is where knowledge is thinnest." },
  { kind: "Guardrail", name: "Alarms per operator per 10 minutes", target: "≤ 1 average, floods < 1% of time", why: "ISA-18.2's own benchmarks; Takt must not add noise." },
  { kind: "Guardrail", name: "False 'watch' flags per line per week", target: "≤ 2", why: "Past that, people stop reading them." },
];

export type MatrixState = "yes" | "partial" | "no";
/** My reading of each category, not a review of any vendor. */
export const landscape = {
  columns: ["Historians", "Platform suites", "MES", "No-code apps", "Takt"],
  rows: [
    { label: "One model across plants", cells: [{ state: "partial", note: "Tag-centric, not asset-centric" }, { state: "yes", note: "After a long rollout" }, { state: "partial", note: "Per plant, often" }, { state: "no", note: "App by app" }, { state: "yes", note: "The core of the product" }] },
    { label: "Alarm cascades as one incident", cells: [{ state: "no", note: "Raw events" }, { state: "partial", note: "Rules to configure" }, { state: "partial", note: "Downtime codes" }, { state: "no", note: "" }, { state: "yes", note: "First cause on top" }] },
    { label: "A home for each role", cells: [{ state: "no", note: "Engineers' tool" }, { state: "partial", note: "Dashboards to build" }, { state: "yes", note: "Operator-centric" }, { state: "yes", note: "If someone builds it" }, { state: "yes", note: "Six, out of the box" }] },
    { label: "Plain-language questions", cells: [{ state: "no", note: "" }, { state: "partial", note: "Emerging" }, { state: "no", note: "" }, { state: "no", note: "" }, { state: "yes", note: "Answers with evidence" }] },
    { label: "Works with what's already there", cells: [{ state: "yes", note: "It is what's there" }, { state: "partial", note: "Prefers its own stack" }, { state: "partial", note: "Heavy integration" }, { state: "yes", note: "Connectors" }, { state: "yes", note: "Reads OPC UA and MQTT" }] },
  ] as { label: string; cells: { state: MatrixState; note: string }[] }[],
};

/* ── 03 · People (design lens) ────────────────────────────────────────── */

const fig = (n: string, alt: string) => [{ src: `/doodles/people/takt-${n}.svg`, alt }];
export const personas: Persona[] = [
  {
    name: "Ravi", role: "Line operator", meta: "28 · night shift, body shop Line 3 · eight years on the line", basis: "proto",
    figures: fig("ravi", "Drawing of Ravi, a tired night-shift operator"),
    lists: [{ label: "Needs", items: ["Know in one glance whether the line is healthy", "When it stops, what to do first"] }, { label: "Fears", items: ["Being blamed for a stop he didn't cause"] }],
    trust: { label: "Trusts", text: "His own panel, and the senior technician's word." },
  },
  {
    name: "Meena", role: "Maintenance technician", meta: "34 · robotics specialist · covers three lines on nights", basis: "proto",
    figures: fig("meena", "Drawing of Meena, a maintenance technician with glasses"),
    lists: [{ label: "Needs", items: ["The machine's history before she walks to it", "Which spare, which bin"] }, { label: "Fears", items: ["Fixing the symptom while the cause comes back"] }],
    trust: { label: "Trusts", text: "Trends she can read herself, not a black-box score." },
  },
  {
    name: "Sandeep", role: "Shift supervisor", meta: "41 · runs the night shift in the body shop", basis: "proto",
    figures: fig("sandeep", "Drawing of Sandeep, a shift supervisor with arms crossed"),
    lists: [{ label: "Needs", items: ["Who is on what, right now", "A handover note that writes itself"] }, { label: "Fears", items: ["The morning meeting without answers"] }],
  },
  {
    name: "Farah", role: "Quality engineer", meta: "31 · owns weld quality across two plants", basis: "proto",
    figures: fig("farah", "Drawing of Farah, a quality engineer reading a report"),
    lists: [{ label: "Needs", items: ["Which parts were welded during the drift", "Process data next to inspection results"] }, { label: "Fears", items: ["A field failure traced back to a night like this"] }],
  },
  {
    name: "Arjun", role: "Plant head", meta: "52 · runs the Pune plant · reports to the COO", basis: "proto",
    figures: fig("arjun", "Drawing of Arjun, a plant head in a blazer"),
    lists: [{ label: "Needs", items: ["OEE he can compare with Chennai's on the same terms", "What happened overnight, before the 9 o'clock meeting"] }, { label: "Fears", items: ["Numbers that change depending on who made the report"] }],
  },
  {
    name: "Divya", role: "Reliability analyst", meta: "29 · central team · builds failure models", basis: "proto",
    figures: fig("divya", "Drawing of Divya, a reliability analyst with a tablet"),
    lists: [{ label: "Needs", items: ["Clean, named data across plants", "Incidents labelled with real causes, to learn from"] }, { label: "Fears", items: ["A model trained on tags nobody can identify"] }],
  },
];

export const conditions = [
  { doodle: "shield", title: "Gloves and grime", text: "Touch targets of 44 px and more on shared panels; no hover-only controls." },
  { doodle: "clock", title: "Shifts", text: "Night shift has the fewest experts and the most to lose; it is the design target." },
  { doodle: "talk", title: "Noise and languages", text: "No sound-only cues. Labels work in English, Hindi, Marathi and Tamil." },
  { doodle: "layers", title: "Glare and distance", text: "Grey-first screens where colour means abnormal, readable from two metres (ISA-101)." },
];

/* ── 04 · Research: what the standards change ──────────────────────────── */

export const standards: string[][] = [
  ["ISA-95 (IEC 62264)", "Equipment sits in a role-based hierarchy: enterprise, site, area, work centre (such as a line), work unit (such as a cell or machine).", "The location spine of Takt's navigation, and the first segments of every name."],
  ["ISA-18.2 (IEC 62682)", "About one alarm per operator every 10 minutes is acceptable, two is the most manageable, more than ten is a flood; floods should take under 1% of the time.", "Grouping into incidents, and the guardrail metric. Takt has to lower this number, never raise it."],
  ["ISA-101", "Operator screens in four levels: overview, unit, detail, diagnostics. Grey by default; colour reserved for what's abnormal.", "Takt's screen hierarchy maps to the four levels, and its palette follows the same rule."],
  ["OEE", "Availability × performance × quality: one definition for every line.", "Cross-plant comparison only means something when every plant counts losses the same way."],
];

/* ── 05 · Information architecture ─────────────────────────────────────── */

/** The object model: what exists, grouped by the question it answers. */
export const objectModel = [
  { group: "Where", objects: ["Enterprise", "Plant", "Area", "Line", "Cell"] },
  { group: "What", objects: ["Machine", "Component", "Signal"] },
  { group: "What happened", objects: ["Alarm", "Incident", "Shift"] },
  { group: "What we did", objects: ["Work order", "Spare part", "Person"] },
  { group: "How it went", objects: ["Production order", "OEE", "Report"] },
];
export const relations = [
  ["Line", "contains", "Machine"], ["Machine", "has", "Component"], ["Component", "emits", "Signal"], ["Signal", "raises", "Alarm"],
  ["Alarms", "group into", "Incident"], ["Incident", "happens on", "Line, Shift"], ["Incident", "leads to", "Work order"], ["Work order", "uses", "Spare part"],
  ["Work order", "is done by", "Person"], ["Line, Shift", "produce", "OEE"],
];

export const lenses = [
  { name: "Location", who: "Operators, supervisors, plant heads", path: "Pune plant › Body shop › Line 3 › WR-04", why: "How a plant is walked and run. The spine." },
  { name: "Process", who: "Quality, process engineers", path: "Welding › Pune plant › Line 3 › WR-04", why: "Weld quality is a process question across lines and plants." },
  { name: "Machine type", who: "Maintenance, reliability", path: "Robots › Weld robots › Pune plant › WR-04", why: "Spares, failure patterns and fixes are shared by type." },
  { name: "Data", who: "Analysts, integrators", path: "PUN.\u200bBDY.\u200bL3.\u200bWR04.\u200bAX2M.\u200bVIB_RMS", why: "One name per signal, readable by people and machines." },
  { name: "Time", who: "Everyone, after something happens", path: "Night shift, 14 Nov › 02:14 › Incident #4471", why: "Incidents, shifts and batches are entry points too." },
];

export const decision = {
  context: "The same robot lives in five hierarchies, and every role thinks in a different one. A single tree would force four of the five roles to translate.",
  options: [
    {
      title: "Department-first",
      text: "Production, Maintenance, Quality, Reports: the way the systems are split today.",
      why: "Mirrors the org chart, not the plant. Most tasks at 2 a.m. cross departments, so each one starts with a guess.",
      chosen: false,
    },
    {
      title: "Five equal trees",
      text: "One tree per lens, picked at the top before anything else.",
      why: "Every visit starts with 'which view?', and each machine gets five homes and five URLs to keep in step.",
      chosen: false,
    },
    {
      title: "One spine, switchable views",
      text: "Location as the spine; process and machine type as views; data and time as entry points.",
      why: "Matches how the plant is walked and how ISA-95 names it. The other lenses re-sort the same objects instead of copying them.",
      chosen: true,
    },
  ],
  choice: "One location spine with switchable views. Location matches how the plant is walked and how ISA-95 names it; the other lenses re-sort the same objects instead of copying them.",
  result: "Every machine has one home and one URL, and three ways to arrive at it. The live tree test below compares this against department-first.",
};

export const naming = [
  { part: "PUN", means: "Plant", rule: "Three letters" },
  { part: "BDY", means: "Area", rule: "Three letters, shared by every plant" },
  { part: "L3", means: "Line", rule: "L + number; U1 for utilities" },
  { part: "WR04", means: "Machine", rule: "Type prefix + two digits" },
  { part: "AX2M", means: "Component", rule: "Up to four letters, from the type's template" },
  { part: "VIB_RMS", means: "Signal", rule: "From a fixed list of 23 signals" },
];

export const navModel = [
  { level: "Global", text: "Always there: plant switcher, search by name or code, incidents, the copilot.", items: ["Plant switcher", "Search", "Incidents", "Copilot"] },
  { level: "Local", text: "Where you are: breadcrumb on the location spine, siblings one tap away, and the view switch.", items: ["Breadcrumb", "Siblings", "Location · Process · Type"] },
  { level: "Contextual", text: "What's related: from an alarm to its machine, its history, its spares, its people.", items: ["Machine", "Work orders", "Spares", "Similar incidents"] },
];

/** ISA-101's four display levels, mapped to Takt's screens. */
export const displayLevels = [
  { name: "Level 1 · Overview", text: "All plants or one plant: what is abnormal, nothing else.", items: ["All plants", "Plant"] },
  { name: "Level 2 · Unit", text: "One line: status, OEE, open incidents, the shift.", items: ["Line"] },
  { name: "Level 3 · Detail", text: "One machine: components, history, work orders.", items: ["Machine"] },
  { name: "Level 4 · Diagnostic", text: "One component: live signals and trends against their normal band.", items: ["Component", "Signal"] },
];

export const roleHomes = [
  ["Operator", "My line, now", "Is the line healthy, and if not, what do I do first?"],
  ["Technician", "My queue", "What's waiting for me, where, and what will I need?"],
  ["Supervisor", "My shift", "What happened, who's on it, what goes in the handover?"],
  ["Quality", "My process", "Which parts were made while something drifted?"],
  ["Plant head", "My plant, against the others", "Where are we losing, and is it getting better?"],
  ["Analyst", "The catalogue", "Which data exists, how clean is it, and what does it mean?"],
];

/* ── 07 · End to end ──────────────────────────────────────────────────── */

export const flow = [
  { name: "Notice", text: "01:52 · planner", items: ["Drift against normal band", "'Watch' on WR-04"] },
  { name: "Group", text: "02:14 · operator", items: ["38 alarms → 1 incident", "First cause on top"] },
  { name: "Explain", text: "02:35 · technician", items: ["Copilot: why it stopped", "Trend, history, similar incident"] },
  { name: "Act", text: "02:40 · technician", items: ["Drafted work order", "Approved by a person"] },
  { name: "Fix", text: "02:58 · technician", items: ["Spare from bin B-14", "Restart 03:10"] },
  { name: "Hand over", text: "06:00 · supervisor", items: ["Note written from the incident", "Open action listed"] },
  { name: "Review", text: "08:30 · plant head", items: ["OEE dip with its cause", "Check sister robots"] },
];

export const ladder = [
  { level: "Notice and explain", note: "Takt flags drift and explains a stop, with evidence. Always on.", items: ["Watch flags", "Incident summary", "Copilot answers"], tone: "plain" as const },
  { level: "Draft", note: "Takt drafts a work order, a handover note or a report. A person edits and sends.", items: ["Work orders", "Handover notes"], tone: "plain" as const },
  { level: "Ask, then do", note: "Takt can book a technician or reserve a spare, only after a named person approves.", items: ["Reserve spare", "Assign technician"], tone: "accent" as const },
  { level: "Never", note: "Takt never writes to a machine, changes a setpoint or silences an alarm.", items: ["Control", "Setpoints", "Alarm suppression"], tone: "never" as const },
];

/* ── 08 · Prioritisation and roadmap ───────────────────────────────────── */

/** RICE for a one-plant pilot. Reach = people per quarter; impact 0.25–3; confidence %; effort in person-months. */
export const rice = [
  { feature: "Asset model, naming and search", reach: 300, impact: 2, confidence: 80, effort: 3 },
  { feature: "Shift handover from incidents", reach: 150, impact: 1, confidence: 70, effort: 1.5 },
  { feature: "Line and plant overview (ISA-101 levels)", reach: 250, impact: 1, confidence: 80, effort: 3 },
  { feature: "Alarm grouping into incidents", reach: 120, impact: 3, confidence: 70, effort: 4 },
  { feature: "Work-order link to the maintenance tool", reach: 80, impact: 2, confidence: 60, effort: 2 },
  { feature: "Cross-plant OEE on one definition", reach: 40, impact: 2, confidence: 80, effort: 2 },
  { feature: "Copilot answers with evidence", reach: 200, impact: 2, confidence: 40, effort: 5 },
  { feature: "Predictive 'watch' flags", reach: 80, impact: 3, confidence: 30, effort: 6 },
].map((r) => ({ ...r, score: Math.round((r.reach * r.impact * (r.confidence / 100)) / r.effort) }))
  .sort((a, b) => b.score - a.score);

export const roadmap = [
  { name: "Now · pilot", text: "One plant, read-only, 3 months", items: ["Asset model and naming for Pune", "Search and overview", "Incidents from alarms", "Shift handover", "Work-order link"] },
  { name: "Next · four plants", text: "3 to 6 months", items: ["Cross-plant OEE", "Copilot with evidence", "Homes for quality and plant heads"] },
  { name: "Later · learn", text: "Once the data is trusted", items: ["Predictive watch flags", "Analyst workbench", "Energy per part"] },
];

export const gates = [
  "Pilot to four plants: tree-test success of 80% or more for the core tasks, and 70% of night-shift stoppages opened in Takt.",
  "Copilot to everyone: its stated cause matches the engineer's root cause in 85% of a month's incidents.",
  "Kill or rethink: if after eight weeks operators still reach for the phone first in most stoppages, the incident model is wrong, not the training.",
];

export const risks = [
  ["Names are a mess on day one", "A mapping tool and the naming standard before any screen; plant by plant."],
  ["Security of the plant network", "Read-only from the control layer through a gateway, following IEC 62443 zones."],
  ["Another screen nobody opens", "Start where the pain is sharpest (night shift, stoppages), with supervisors as champions."],
  ["Flags people learn to ignore", "The ISA-18.2 guardrail and the false-flag budget, reviewed weekly."],
];

/* ── 09 · Validation ──────────────────────────────────────────────────── */

export const validationPlan = [
  { title: "Tree test", body: "Five core tasks, department-first against location spine, 30 people across roles and plants. Pass: 80% success, 60% direct." },
  { title: "First-click test", body: "On the line and machine screens: does the first tap go to the right place? Pass: 80%." },
  { title: "Night-shift shadowing", body: "Two nights per plant with operators and technicians, before and after the pilot, timing stops from fault to cause." },
  { title: "Pilot metrics", body: "The north star, inputs and guardrails above, read weekly with the plant head and supervisors." },
];

export const nextSteps = [
  { label: "01 · Interface", title: "Screens for each level", text: "Plant, line, machine and incident, grey-first, at panel, tablet and desk sizes." },
  { label: "02 · Alarms", title: "The flood, replayed", text: "The 38-alarm cascade, raw and grouped, against ISA-18.2's limits." },
  { label: "03 · Copilot", title: "Why did Line 3 stop?", text: "An agent that answers by walking the object model, and asks before it acts." },
  { label: "04 · Evidence", title: "Run the tree test with people", text: "Operators and technicians, not visitors, across two plants." },
];

export const sources = [
  { label: "Siemens, The True Cost of Downtime 2024", href: "https://assets.new.siemens.com/siemens/assets/api/uuid:1b43afb5-2d07-47f7-9eb7-893fe7d0bc59/TCOD-2024_original.pdf" },
  { label: "ACMA FY24 results, via Business Standard", href: "https://business-standard.com/industry/auto/auto-component-industry-turnover-up-10-at-rs-6-14-trn-in-fy24-acma-124072500923_1.html" },
  { label: "OPC Foundation, ISA-95 information model", href: "https://reference.opcfoundation.org/specs/OPC-10030/7" },
  { label: "Alarm management by the numbers (ISA-18.2), Chemical Engineering", href: "https://www.chemengonline.com/alarm-management-numbers/" },
  { label: "Going Gray: a new HMI standard (ISA-101), Control.com", href: "https://control.com/technical-articles/going-gray/" },
];
