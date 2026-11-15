/**
 * Tree-test material for Takt: two navigation structures over the same content, and five tasks from the scenario.
 * A is department-first, the way plant software is usually split today. B is the location spine Takt proposes.
 * A is not a straw man: cross-plant reporting is genuinely easy to find there, and task 4 tests exactly that.
 */

export type TNode = { id: string; label: string; children?: TNode[] };

const n = (id: string, label: string, children?: TNode[]): TNode => ({ id, label, children });
const plants = (prefix: string) => ["Pune", "Chennai", "Hosur", "Manesar"].map((p) => n(`${prefix}-${p.toLowerCase()}`, p));

export const treeA: TNode[] = [
  n("a-prod", "Production", [
    n("a-status", "Live status", plants("a-status")),
    n("a-alarms", "Alarms", [n("a-alarms-active", "Active alarms"), n("a-alarms-history", "Alarm history")]),
    n("a-orders", "Production orders"),
    n("a-downtime", "Downtime log"),
  ]),
  n("a-maint", "Maintenance", [
    n("a-wo", "Work orders", [n("a-wo-open", "Open"), n("a-wo-done", "Completed")]),
    n("a-pm", "Preventive schedule"),
    n("a-spares", "Spare parts", [n("a-spares-stock", "Stock levels"), n("a-spares-req", "Requisitions")]),
    n("a-equip", "Equipment register"),
  ]),
  n("a-quality", "Quality", [n("a-insp", "Inspections"), n("a-spc", "SPC charts"), n("a-ncr", "Non-conformances")]),
  n("a-reports", "Reports", [
    n("a-oee", "OEE", [n("a-oee-plant", "By plant"), n("a-oee-line", "By line")]),
    n("a-rep-downtime", "Downtime analysis"),
    n("a-energy", "Energy"),
    n("a-trends", "Trends and historian"),
  ]),
  n("a-settings", "Settings"),
];

const machine = (id: string, label: string) =>
  n(id, label, [
    n(`${id}-overview`, "Overview"),
    n(`${id}-ax2`, "Axis 2 servo motor", [n(`${id}-ax2-signals`, "Live signals and trends"), n(`${id}-ax2-spares`, "Spare parts")]),
    n(`${id}-ax1`, "Axis 1 servo motor", [n(`${id}-ax1-signals`, "Live signals and trends"), n(`${id}-ax1-spares`, "Spare parts")]),
    n(`${id}-wo`, "Work orders and history"),
    n(`${id}-docs`, "Manuals and drawings"),
  ]);

const line = (id: string, label: string, robots: string[]) =>
  n(id, label, [
    n(`${id}-overview`, "Line overview"),
    n(`${id}-incidents`, "Incidents and alarms"),
    ...robots.map((r) => machine(`${id}-${r.toLowerCase()}`, `Weld robot ${r}`)),
    n(`${id}-cv`, "Conveyors"),
  ]);

export const treeB: TNode[] = [
  n("b-all", "All plants", [n("b-all-oee", "OEE by plant"), n("b-all-incidents", "Incidents across plants"), n("b-all-downtime", "Downtime across plants")]),
  n("b-pune", "Pune plant", [
    n("b-pune-press", "Press shop"),
    n("b-pune-body", "Body shop", [
      line("b-l1", "Line 1", ["WR-01", "WR-02"]),
      line("b-l2", "Line 2", ["WR-01", "WR-02"]),
      line("b-l3", "Line 3", ["WR-01", "WR-02", "WR-03", "WR-04"]),
    ]),
    n("b-pune-mch", "Machining"),
    n("b-pune-asm", "Assembly"),
  ]),
  n("b-chennai", "Chennai plant"),
  n("b-hosur", "Hosur plant"),
  n("b-manesar", "Manesar plant"),
  n("b-types", "Machine types", [
    n("b-types-robots", "Weld robots"),
    n("b-types-motors", "Servo motors", [n("b-types-motors-spares", "Spare parts"), n("b-types-motors-failures", "Failure history")]),
    n("b-types-presses", "Presses"),
  ]),
];

/** Five tasks from the night Line 3 stopped. Each lists the right answers in A and in B. */
export const tasks = [
  {
    text: "It's 02:20 and Line 3 in Pune's body shop has stopped. Find the alarms that fired.",
    a: ["a-alarms-history", "a-alarms-active"],
    b: ["b-l3-incidents"],
  },
  {
    text: "Find the vibration trend for the axis-2 servo motor on weld robot WR-04 (Pune, Line 3).",
    a: ["a-trends"],
    b: ["b-l3-wr-04-ax2-signals"],
  },
  {
    text: "When was weld robot WR-04 on Pune's Line 3 last serviced, and by whom?",
    a: ["a-wo-done"],
    b: ["b-l3-wr-04-wo"],
  },
  {
    text: "Compare this week's OEE across all four plants.",
    a: ["a-oee-plant"],
    b: ["b-all-oee"],
  },
  {
    text: "Is a spare axis-2 servo motor, like WR-04's, in stock?",
    a: ["a-spares-stock"],
    b: ["b-l3-wr-04-ax2-spares", "b-types-motors-spares"],
  },
];

/** Parent of every node, for directness: a path is direct if it never leaves the branch it is going down. */
export function parents(tree: TNode[]) {
  const map = new Map<string, string | null>();
  const walk = (nodes: TNode[], parent: string | null) => nodes.forEach((x) => { map.set(x.id, parent); if (x.children) walk(x.children, x.id); });
  walk(tree, null);
  return map;
}
