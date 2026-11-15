/**
 * Takt's fictional plant: Kaveri Auto Parts, four plants, built deterministically so the server and the browser
 * agree. It follows the ISA-95 equipment hierarchy (enterprise → site → area → work centre/line → work unit/machine),
 * and every machine also belongs to a process step and an asset class: the same object, three hierarchies.
 * Signals (tags) are generated on demand from each component's template, so the full count never sits in memory.
 * Plain data; safe on the server and in the browser.
 */

export type Lens = "location" | "process" | "class";

export type Site = { code: string; name: string; city: string };
export type Area = { code: string; name: string; process: string };
export type Machine = {
  id: string; // PUN.BDY.L3.WR04
  code: string; // WR-04
  name: string; // Weld robot WR-04
  site: string;
  area: string;
  line: string; // L3
  lineName: string; // Line 3
  process: string;
  cls: string;
  components: { code: string; name: string; signals: string[] }[];
};

export const ENTERPRISE = "Kaveri Auto Parts";

export const SITES: Site[] = [
  { code: "PUN", name: "Pune", city: "Chakan, Pune" },
  { code: "CHN", name: "Chennai", city: "Oragadam, Chennai" },
  { code: "HSR", name: "Hosur", city: "Hosur" },
  { code: "MNS", name: "Manesar", city: "Manesar" },
];

/** Areas and the production step each one performs. */
const AREA_DEF: Record<string, Area> = {
  PRS: { code: "PRS", name: "Press shop", process: "Stamping" },
  BDY: { code: "BDY", name: "Body shop", process: "Welding" },
  MCH: { code: "MCH", name: "Machining", process: "Machining" },
  HTR: { code: "HTR", name: "Heat treatment", process: "Heat treatment" },
  PNT: { code: "PNT", name: "Paint shop", process: "Painting" },
  ASM: { code: "ASM", name: "Assembly", process: "Assembly" },
  UTL: { code: "UTL", name: "Utilities", process: "Utilities" },
};

/** Which areas each plant has, and how many lines in each. */
const LAYOUT: Record<string, [string, number][]> = {
  PUN: [["PRS", 2], ["BDY", 4], ["MCH", 4], ["PNT", 1], ["ASM", 2], ["UTL", 1]],
  CHN: [["PRS", 3], ["MCH", 4], ["ASM", 3], ["UTL", 1]],
  HSR: [["MCH", 3], ["HTR", 2], ["ASM", 2], ["UTL", 1]],
  MNS: [["PRS", 3], ["BDY", 2], ["PNT", 1], ["ASM", 2], ["UTL", 1]],
};

/** Machine types per area: prefix, class, how many per line, and its components with their signals. */
type MachineType = { prefix: string; label: string; cls: string; per: number; components: [string, string, string[]][] };
const MOTOR = ["VIB_RMS", "TEMP", "CURRENT", "TORQUE", "STATE"];
const TYPES: Record<string, MachineType[]> = {
  PRS: [
    { prefix: "P", label: "Servo press", cls: "Presses", per: 4, components: [["SLD", "Slide drive", MOTOR], ["HYD", "Hydraulic unit", ["PRESSURE", "OIL_TEMP", "LEVEL", "STATE"]], ["DIE", "Die cushion", ["PRESSURE", "POSITION"]]] },
    { prefix: "TF", label: "Transfer feeder", cls: "Conveyors and feeders", per: 1, components: [["AX1M", "Axis 1 motor", MOTOR], ["GRP", "Gripper", ["PRESSURE", "CYCLES"]]] },
  ],
  BDY: [
    { prefix: "WR", label: "Weld robot", cls: "Robots", per: 8, components: [["AX1M", "Axis 1 servo motor", MOTOR], ["AX2M", "Axis 2 servo motor", MOTOR], ["WCTL", "Weld controller", ["WELD_CURRENT", "VOLTAGE", "FAULT_CODE"]], ["CLU", "Cooling unit", ["FLOW", "TEMP"]]] },
    { prefix: "SR", label: "Sealer robot", cls: "Robots", per: 1, components: [["AX1M", "Axis 1 servo motor", MOTOR], ["DSP", "Dispenser", ["PRESSURE", "FLOW", "TEMP"]]] },
    { prefix: "CV", label: "Conveyor", cls: "Conveyors and feeders", per: 3, components: [["DRV", "Drive motor", MOTOR], ["SNS", "Position sensors", ["POSITION", "STATE"]]] },
  ],
  MCH: [
    { prefix: "VMC", label: "Vertical machining centre", cls: "CNC machines", per: 6, components: [["SPN", "Spindle", ["VIB_RMS", "TEMP", "SPEED", "LOAD"]], ["CLT", "Coolant system", ["FLOW", "TEMP", "LEVEL"]], ["ATC", "Tool changer", ["CYCLES", "FAULT_CODE"]]] },
    { prefix: "TL", label: "CNC lathe", cls: "CNC machines", per: 2, components: [["SPN", "Spindle", ["VIB_RMS", "TEMP", "SPEED", "LOAD"]], ["TUR", "Turret", ["POSITION", "FAULT_CODE"]]] },
    { prefix: "CMM", label: "Measuring machine", cls: "Test and measurement", per: 1, components: [["PRB", "Probe", ["DEVIATION", "STATE"]]] },
  ],
  HTR: [
    { prefix: "FN", label: "Furnace", cls: "Furnaces and ovens", per: 2, components: [["BRN", "Burner", ["TEMP", "GAS_FLOW", "STATE"]], ["ATM", "Atmosphere control", ["CARBON_POTENTIAL", "PRESSURE"]]] },
    { prefix: "QT", label: "Quench tank", cls: "Furnaces and ovens", per: 1, components: [["AGT", "Agitator", MOTOR], ["OIL", "Oil system", ["TEMP", "LEVEL"]]] },
  ],
  PNT: [
    { prefix: "PR", label: "Paint robot", cls: "Robots", per: 4, components: [["AX1M", "Axis 1 servo motor", MOTOR], ["BELL", "Rotary bell", ["SPEED", "FLOW", "VOLTAGE"]]] },
    { prefix: "OV", label: "Curing oven", cls: "Furnaces and ovens", per: 1, components: [["ZN1", "Zone 1 heater", ["TEMP", "STATE"]], ["FAN", "Circulation fan", MOTOR]] },
  ],
  ASM: [
    { prefix: "NR", label: "Nutrunner station", cls: "Tools", per: 6, components: [["SPN", "Spindle", ["TORQUE", "ANGLE", "RESULT"]]] },
    { prefix: "LT", label: "Leak tester", cls: "Test and measurement", per: 1, components: [["CHB", "Test chamber", ["PRESSURE", "LEAK_RATE", "RESULT"]]] },
    { prefix: "CV", label: "Conveyor", cls: "Conveyors and feeders", per: 2, components: [["DRV", "Drive motor", MOTOR]] },
  ],
  UTL: [
    { prefix: "AC", label: "Air compressor", cls: "Compressors and chillers", per: 3, components: [["MTR", "Main motor", MOTOR], ["AIR", "Air system", ["PRESSURE", "DEW_POINT", "FLOW"]]] },
    { prefix: "CH", label: "Chiller", cls: "Compressors and chillers", per: 2, components: [["CMP", "Compressor", MOTOR], ["WTR", "Chilled water", ["TEMP", "FLOW"]]] },
  ],
};

export const SIGNAL_LABEL: Record<string, string> = {
  VIB_RMS: "Vibration (RMS, mm/s)", TEMP: "Temperature (°C)", CURRENT: "Current (A)", TORQUE: "Torque (Nm)", STATE: "Running state",
  PRESSURE: "Pressure (bar)", OIL_TEMP: "Oil temperature (°C)", LEVEL: "Level (%)", POSITION: "Position (mm)", CYCLES: "Cycle count",
  WELD_CURRENT: "Weld current (kA)", VOLTAGE: "Voltage (V)", FAULT_CODE: "Fault code", FLOW: "Flow (l/min)", SPEED: "Speed (rpm)",
  LOAD: "Load (%)", DEVIATION: "Deviation (µm)", GAS_FLOW: "Gas flow (m³/h)", CARBON_POTENTIAL: "Carbon potential (%C)",
  DEW_POINT: "Dew point (°C)", ANGLE: "Angle (°)", RESULT: "Pass or fail", LEAK_RATE: "Leak rate (cc/min)",
};

export const areaOf = (code: string) => AREA_DEF[code];
export const siteOf = (code: string) => SITES.find((s) => s.code === code)!;
const pad = (n: number) => String(n).padStart(2, "0");
const plural = (t: string) => (t.endsWith("s") ? `${t}es` : `${t}s`);
/** "Weld robot WR-04" → "Weld robot" */
export const typeOf = (m: { name: string }) => m.name.split(" ").slice(0, -1).join(" ");

/** Every machine in the four plants. */
export const MACHINES: Machine[] = (() => {
  const out: Machine[] = [];
  for (const site of SITES) {
    for (const [areaCode, lines] of LAYOUT[site.code]) {
      const area = AREA_DEF[areaCode];
      for (let l = 1; l <= lines; l++) {
        const line = areaCode === "UTL" ? "U1" : `L${l}`;
        const lineName = areaCode === "UTL" ? "Utility block" : `Line ${l}`;
        for (const t of TYPES[areaCode]) {
          for (let k = 1; k <= t.per; k++) {
            const code = `${t.prefix}-${pad(k)}`;
            out.push({
              id: `${site.code}.${areaCode}.${line}.${t.prefix}${pad(k)}`,
              code,
              name: `${t.label} ${code}`,
              site: site.code,
              area: areaCode,
              line,
              lineName,
              process: area.process,
              cls: t.cls,
              components: t.components.map(([c, name, signals]) => ({ code: c, name, signals })),
            });
          }
        }
      }
    }
  }
  return out;
})();

export const SIGNAL_COUNT = MACHINES.reduce((n, m) => n + m.components.reduce((k, c) => k + c.signals.length, 0), 0);
export const LINE_COUNT = new Set(MACHINES.map((m) => `${m.site}.${m.area}.${m.line}`)).size;

/** The scenario's machine: the one that stops Line 3 at 02:14. */
export const SCENARIO_ID = "PUN.BDY.L3.WR04";
export const SCENARIO_SIGNAL = "PUN.BDY.L3.WR04.AX2M.VIB_RMS";

/** The naming standard: one dotted tag name and one path in the unified namespace. */
export function tagName(m: Machine, component: string, signal: string) {
  return `${m.id}.${component}.${signal}`;
}
const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
export function unsPath(m: Machine, component: string, signal: string) {
  const comp = m.components.find((c) => c.code === component);
  return ["kaveri", slug(siteOf(m.site).name), slug(areaOf(m.area).name), slug(m.lineName), slug(m.code), slug(comp?.name ?? component), slug(signal)].join("/");
}

/** Where a machine sits in each lens, as a breadcrumb. */
export function pathIn(lens: Lens, m: Machine): string[] {
  if (lens === "location") return [ENTERPRISE, `${siteOf(m.site).name} plant`, areaOf(m.area).name, m.lineName, m.name];
  if (lens === "process") return [ENTERPRISE, m.process, `${siteOf(m.site).name} plant`, m.lineName, m.name];
  return [ENTERPRISE, m.cls, plural(typeOf(m)), `${siteOf(m.site).name} plant`, m.name];
}

/* ── Tree for the explorer: built lazily per lens ───────────────────────── */

export type Node = { id: string; label: string; kind: "group" | "machine"; count: number; children?: Node[]; machine?: string };

const group = (id: string, label: string, children: Node[]): Node => ({ id, label, kind: "group", count: children.reduce((n, c) => n + (c.kind === "machine" ? 1 : c.count), 0), children });
const leaf = (m: Machine): Node => ({ id: m.id, label: m.name, kind: "machine", count: 1, machine: m.id });
const by = <T,>(xs: T[], key: (x: T) => string) => xs.reduce((acc, x) => acc.set(key(x), [...(acc.get(key(x)) ?? []), x]), new Map<string, T[]>());

export function tree(lens: Lens): Node[] {
  if (lens === "location") {
    return SITES.map((s) => {
      const inSite = MACHINES.filter((m) => m.site === s.code);
      return group(`loc:${s.code}`, `${s.name} plant`, [...by(inSite, (m) => m.area)].map(([a, ms]) =>
        group(`loc:${s.code}.${a}`, AREA_DEF[a].name, [...by(ms, (m) => m.line)].map(([l, lms]) => group(`loc:${s.code}.${a}.${l}`, lms[0].lineName, lms.map(leaf)))),
      ));
    });
  }
  if (lens === "process") {
    return [...by(MACHINES, (m) => m.process)].map(([p, ms]) =>
      group(`proc:${p}`, p, [...by(ms, (m) => m.site)].map(([s, sms]) => group(`proc:${p}.${s}`, `${siteOf(s).name} plant`, [...by(sms, (m) => m.line)].map(([l, lms]) => group(`proc:${p}.${s}.${l}`, lms[0].lineName, lms.map(leaf)))))),
    );
  }
  return [...by(MACHINES, (m) => m.cls)].map(([c, ms]) =>
    group(`cls:${c}`, c, [...by(ms, typeOf)].map(([type, tms]) =>
      group(`cls:${c}.${type}`, plural(type), [...by(tms, (m) => m.site)].map(([s, sms]) => group(`cls:${c}.${type}.${s}`, `${siteOf(s).name} plant`, sms.map(leaf)))),
    )),
  );
}

/** Ids of the groups to open so `machineId` is visible in `lens`. */
export function openPath(lens: Lens, machineId: string): string[] {
  const m = MACHINES.find((x) => x.id === machineId);
  if (!m) return [];
  if (lens === "location") return [`loc:${m.site}`, `loc:${m.site}.${m.area}`, `loc:${m.site}.${m.area}.${m.line}`];
  if (lens === "process") return [`proc:${m.process}`, `proc:${m.process}.${m.site}`, `proc:${m.process}.${m.site}.${m.line}`];
  const type = typeOf(m);
  return [`cls:${m.cls}`, `cls:${m.cls}.${type}`, `cls:${m.cls}.${type}.${m.site}`];
}

/** Search by code, name, line or tag fragment ("wr-04", "body shop line 3", "AX2M"). */
export function search(q: string, limit = 8): Machine[] {
  const terms = q.toLowerCase().split(/\s+/).filter(Boolean);
  if (!terms.length) return [];
  return MACHINES.filter((m) => {
    const hay = `${m.id} ${m.code} ${m.name} ${siteOf(m.site).name} ${areaOf(m.area).name} ${m.lineName} ${m.process} ${m.cls} ${m.components.map((c) => `${c.code} ${c.name}`).join(" ")}`.toLowerCase();
    return terms.every((t) => hay.includes(t.replace(/-/g, "")) || hay.includes(t));
  }).slice(0, limit);
}
