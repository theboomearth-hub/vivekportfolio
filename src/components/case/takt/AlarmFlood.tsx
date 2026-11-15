"use client";

/**
 * The 38-alarm flood at 02:14, replayed. Left: the operator's panel as it fills, one alarm at a time, against
 * ISA-18.2's limits (about 1 per 10 minutes is acceptable, 2 is the most manageable, over 10 is a flood). Right: the
 * same alarms as Takt shows them, one incident with the first cause on top and the rest grouped by why they fired.
 * Scenario data; the grouping logic is the design, the numbers are the night's.
 */
import { useEffect, useRef, useState } from "react";
import { Btn, LabFrame, useReducedMotion } from "@/components/craft/kit";

type Group = "cause" | "same machine" | "upstream blocked" | "downstream starved" | "repeats" | "other";
type Alarm = { t: number; tag: string; text: string; prio: "High" | "Medium" | "Low"; group: Group };

const base: Omit<Alarm, "t">[] = [
  { tag: "WR04.AX2M", text: "Axis 2 motor overcurrent", prio: "High", group: "cause" },
  { tag: "WR04", text: "Robot fault stop", prio: "High", group: "same machine" },
  { tag: "WR04.WCTL", text: "Weld controller interlock", prio: "Medium", group: "same machine" },
  { tag: "CV01", text: "Conveyor stopped: station 4 blocked", prio: "Medium", group: "downstream starved" },
  { tag: "WR03", text: "Waiting for part transfer", prio: "Low", group: "upstream blocked" },
  { tag: "BUF3", text: "Buffer B3 full", prio: "Medium", group: "upstream blocked" },
  { tag: "SR01", text: "Sealer starved: no part", prio: "Low", group: "downstream starved" },
  { tag: "CV02", text: "Conveyor idle: no part", prio: "Low", group: "downstream starved" },
  { tag: "WR02", text: "Waiting for part transfer", prio: "Low", group: "upstream blocked" },
  { tag: "WR04.CLU", text: "Cooling flow low (robot idle)", prio: "Low", group: "same machine" },
  { tag: "L3", text: "Line rate below target", prio: "Medium", group: "other" },
  { tag: "WR01", text: "Waiting for part transfer", prio: "Low", group: "upstream blocked" },
  { tag: "ASM.L1", text: "Assembly starved: body supply", prio: "Medium", group: "downstream starved" },
  { tag: "QA.L3", text: "Weld count mismatch on body 2231", prio: "Medium", group: "other" },
];

/** 38 alarms over about nine minutes: the cascade, then chattering repeats of the noisiest ones. */
const ALARMS: Alarm[] = (() => {
  const out: Alarm[] = base.map((a, i) => ({ ...a, t: [3, 4, 6, 9, 21, 28, 33, 40, 52, 70, 95, 110, 150, 190][i] }));
  const chatter = [base[5], base[3], base[7], base[6], base[10]];
  let t = 205;
  for (let k = 0; out.length < 38; k++) {
    const a = chatter[k % chatter.length];
    out.push({ ...a, group: a.group === "cause" ? "cause" : "repeats", t });
    t += 10 + ((k * 3) % 8);
  }
  return out.sort((a, b) => a.t - b.t);
})();

const clock = (s: number) => `02:${String(14 + Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
const GROUP_LABEL: Record<Group, string> = { cause: "First cause", "same machine": "Same machine, after the fault", "upstream blocked": "Upstream, blocked", "downstream starved": "Downstream, starved", repeats: "Repeats of the same alarm", other: "Knock-on effects" };

function Prio({ p }: { p: Alarm["prio"] }) {
  return (
    <>
      <span aria-hidden="true" className={`inline-block h-2.5 w-2.5 shrink-0 rounded-full ${p === "High" ? "bg-foreground" : p === "Medium" ? "ring-2 ring-foreground ring-inset" : "bg-border-strong"}`} />
      <span className="sr-only">{p} priority</span>
    </>
  );
}

export default function AlarmFlood() {
  const reduce = useReducedMotion();
  const [shown, setShown] = useState(ALARMS.length);
  const [playing, setPlaying] = useState(false);
  const listRef = useRef<HTMLOListElement>(null);

  useEffect(() => {
    if (!playing) return;
    const id = window.setTimeout(() => {
      if (shown + 1 >= ALARMS.length) setPlaying(false);
      setShown(shown + 1);
    }, 140);
    return () => clearTimeout(id);
  }, [playing, shown]);

  useEffect(() => {
    const el = listRef.current;
    if (el && playing) el.scrollTop = el.scrollHeight;
  }, [shown, playing]);

  const replay = () => {
    if (reduce) { setShown(ALARMS.length); return; }
    setShown(0);
    setPlaying(true);
  };

  const visible = ALARMS.slice(0, shown);
  const minutes = visible.length ? Math.max(1, Math.ceil((visible.at(-1)!.t + 1) / 60)) : 0;
  const groups = (["same machine", "upstream blocked", "downstream starved", "repeats", "other"] as Group[]).map((g) => ({ g, n: ALARMS.filter((a) => a.group === g).length }));

  return (
    <LabFrame
      status={playing ? `Replaying the flood · ${visible.length} alarms` : "The 38 alarms the night operator saw, and the one incident Takt would show instead."}
      actions={<Btn onClick={replay} disabled={playing}>{playing ? "Replaying…" : "Replay 02:14"}</Btn>}
    >
      <div className="grid lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
        <div className="grid content-start gap-3 border-b border-border bg-foreground p-4 text-background sm:p-5 lg:border-r lg:border-b-0">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <p className="font-mono text-xs uppercase tracking-[0.06em] opacity-70">Operator panel · Line 3 · today</p>
            <p className="font-mono text-xs tabular-nums opacity-70">{visible.length} alarms in {minutes} min</p>
          </div>
          <ol ref={listRef} className="grid max-h-[340px] content-start gap-1 overflow-auto pr-1" tabIndex={0} aria-label="Raw alarms, in the order they fired">
            {visible.map((a, i) => (
              <li key={i} className={`grid grid-cols-[4.8rem_auto_minmax(0,1fr)] items-center gap-2.5 rounded-md px-2 py-1.5 text-sm ${a.group === "cause" ? "bg-background/15" : "bg-background/5"}`}>
                <span className="font-mono text-[12px] tabular-nums opacity-70">{clock(a.t)}</span>
                <span className="rounded-full bg-background p-[3px]"><Prio p={a.prio} /></span>
                <span className="min-w-0 truncate">{a.text} <span className="font-mono text-[12px] opacity-60">{a.tag}</span></span>
              </li>
            ))}
          </ol>
          <div className="grid gap-1.5 border-t border-background/20 pt-3">
            <p className="text-caption opacity-80">Against ISA-18.2, per operator per 10 minutes</p>
            <div className="relative h-3 overflow-hidden rounded-full bg-background/15" aria-hidden="true">
              <div className="h-full rounded-full bg-background transition-[width] duration-150" style={{ width: `${Math.min(100, (visible.length / 40) * 100)}%` }} />
              {[1, 2, 10].map((v) => <span key={v} className="absolute top-0 h-full w-px bg-accent" style={{ left: `${(v / 40) * 100}%` }} />)}
            </div>
            <p className="font-mono text-[11px] opacity-70">Marks: 1 acceptable · 2 most manageable · 10 a flood. Tonight: {visible.length}, {Math.round(visible.length / 2)}× the manageable rate.</p>
          </div>
        </div>

        <div className="grid content-start gap-4 p-4 sm:p-5">
          <p className="font-mono text-xs uppercase tracking-[0.06em] text-muted">With Takt · the same nine minutes</p>
          <article className="grid gap-4 rounded-2xl bg-background p-5 shadow-[0_0_0_1px_var(--color-border),0_20px_50px_-30px_rgb(15_15_16/0.35)]" aria-label="Incident 4471">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <p className="font-mono text-xs uppercase tracking-[0.06em] text-accent">Incident #4471 · 02:14</p>
              <span className="rounded-full bg-foreground px-2.5 py-0.5 text-caption text-background">Line 3 stopped</span>
            </div>
            <div className="grid gap-1 rounded-xl bg-accent-light/40 p-3.5">
              <p className="text-caption text-accent">{GROUP_LABEL.cause} · 02:14:03</p>
              <p className="text-lg leading-snug">Weld robot WR-04: axis 2 motor overcurrent</p>
              <p className="font-mono text-[12px] text-muted">PUN.BDY.L3.WR04.AX2M</p>
            </div>
            <div className="grid gap-2">
              <p className="text-sm">{ALARMS.length - 1} more alarms, grouped by why they fired</p>
              <ul className="grid gap-1.5">
                {groups.map(({ g, n }) => (
                  <li key={g} className="flex items-center justify-between gap-3 rounded-lg bg-surface px-3 py-2 text-sm">
                    <span>{GROUP_LABEL[g]}</span>
                    <span className="font-mono tabular-nums text-muted">{n}</span>
                  </li>
                ))}
              </ul>
            </div>
            <p className="text-caption text-muted">The operator reads one card. Each group still opens to its alarms, so nothing is hidden; it&apos;s ordered by cause.</p>
          </article>
        </div>
      </div>
    </LabFrame>
  );
}
