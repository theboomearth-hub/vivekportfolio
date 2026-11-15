"use client";

/**
 * A live tree test (in the style of Treejack). Five tasks from the night Line 3 stopped, on two navigation
 * structures: A, department-first; B, Takt's location spine. The order of A and B is random per run, to balance the
 * learning effect. Per task: success (chose a right node), directness (never collapsed a branch or jumped to another
 * one while going down), and time. Results stay in the browser.
 */
import { useMemo, useRef, useState } from "react";
import { Btn, LabFrame, LabNote, Readout, Stage, ms } from "@/components/craft/kit";
import { median } from "@/lib/craft/stats";
import { parents, tasks, treeA, treeB, type TNode } from "@/lib/work/takt-trees";

type V = "A" | "B";
type Result = { variant: V; task: number; correct: boolean; direct: boolean; ms: number; chosen: string | null };
const TREES: Record<V, TNode[]> = { A: treeA, B: treeB };
const NAMES: Record<V, string> = { A: "Structure A · by department", B: "Structure B · by location (Takt)" };
const PARENTS: Record<V, Map<string, string | null>> = { A: parents(treeA), B: parents(treeB) };
/** Event-time clock, only called from handlers. */
const clock = () => performance.now();

function labelOf(tree: TNode[], id: string | null): string {
  if (!id) return "Skipped";
  for (const nd of tree) {
    if (nd.id === id) return nd.label;
    if (nd.children) { const l = labelOf(nd.children, id); if (l !== "Skipped") return l; }
  }
  return "Skipped";
}

function Tree({ nodes, open, chosen, onNode, depth = 0 }: { nodes: TNode[]; open: Set<string>; chosen: string | null; onNode: (n: TNode) => void; depth?: number }) {
  return (
    <ul className={depth ? "ml-3 border-l border-border pl-2" : ""}>
      {nodes.map((nd) => (
        <li key={nd.id}>
          <button
            type="button"
            onClick={() => onNode(nd)}
            aria-expanded={nd.children ? open.has(nd.id) : undefined}
            aria-pressed={!nd.children ? chosen === nd.id : undefined}
            className={`flex min-h-10 w-full items-center gap-2 rounded-md px-2 text-left text-sm ${chosen === nd.id ? "bg-foreground text-background" : "hover:bg-background"}`}
          >
            {nd.children ? (
              <svg viewBox="0 0 24 24" className={`h-3.5 w-3.5 shrink-0 transition-transform ${open.has(nd.id) ? "rotate-90" : ""} ${chosen === nd.id ? "" : "text-muted"}`} fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true"><path d="M9 6l6 6-6 6" /></svg>
            ) : (
              <span aria-hidden="true" className="w-3.5 shrink-0 text-center">·</span>
            )}
            <span className="min-w-0 flex-1">{nd.label}</span>
          </button>
          {nd.children && open.has(nd.id) && <Tree nodes={nd.children} open={open} chosen={chosen} onNode={onNode} depth={depth + 1} />}
        </li>
      ))}
    </ul>
  );
}

export default function TreeTest() {
  const [order, setOrder] = useState<V[]>(["A", "B"]);
  const [phase, setPhase] = useState<"idle" | "run" | "between" | "done">("idle");
  const [vi, setVi] = useState(0);
  const [ti, setTi] = useState(0);
  const [open, setOpen] = useState<Set<string>>(new Set());
  const [chosen, setChosen] = useState<string | null>(null);
  const [results, setResults] = useState<Result[]>([]);
  const t0 = useRef(0);
  const lastExpanded = useRef<string | null>(null);
  const backtracked = useRef(false);
  const variant = order[vi];

  const resetTask = () => {
    setOpen(new Set());
    setChosen(null);
    lastExpanded.current = null;
    backtracked.current = false;
    t0.current = clock();
  };

  const start = () => {
    setOrder(Math.random() < 0.5 ? ["A", "B"] : ["B", "A"]);
    setVi(0);
    setTi(0);
    setResults([]);
    resetTask();
    setPhase("run");
  };

  const onNode = (nd: TNode) => {
    if (nd.children) {
      const isOpen = open.has(nd.id);
      if (isOpen) {
        backtracked.current = true; // collapsing is going back up
        const next = new Set(open);
        next.delete(nd.id);
        setOpen(next);
      } else {
        const parent = PARENTS[variant].get(nd.id) ?? null;
        if (lastExpanded.current !== parent) backtracked.current = true; // jumped to another branch
        lastExpanded.current = nd.id;
        setOpen(new Set([...open, nd.id]));
      }
      setChosen(nd.id);
    } else setChosen(nd.id);
  };

  const submit = (skip = false) => {
    const task = tasks[ti];
    const right = variant === "A" ? task.a : task.b;
    const pick = skip ? null : chosen;
    const r: Result = { variant, task: ti, chosen: pick, correct: !!pick && right.includes(pick), direct: !!pick && right.includes(pick) && !backtracked.current, ms: clock() - t0.current };
    setResults((rs) => [...rs, r]);
    if (ti + 1 < tasks.length) {
      setTi(ti + 1);
      resetTask();
    } else if (vi === 0) {
      setPhase("between");
    } else setPhase("done");
  };

  const summary = useMemo(
    () => (["A", "B"] as V[]).map((v) => {
      const rs = results.filter((r) => r.variant === v);
      return { v, n: rs.length, success: rs.filter((r) => r.correct).length, direct: rs.filter((r) => r.direct).length, med: median(rs.map((r) => r.ms)) };
    }),
    [results],
  );

  const status =
    phase === "idle" ? "Five tasks from the night Line 3 stopped, on two structures. About three minutes."
    : phase === "between" ? `${NAMES[order[0]]} done. Now the same five tasks on the other structure.`
    : phase === "done" ? "Done. Ten answers, your result below."
    : `${NAMES[variant]} · task ${ti + 1} of ${tasks.length}`;

  return (
    <LabFrame status={status} actions={results.length > 0 && <Btn kind="ghost" onClick={start}>Start again</Btn>}>
      <div className="grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <Stage className="grid min-h-[460px] content-start gap-4 border-b border-border p-4 sm:p-5 lg:border-r lg:border-b-0">
          {phase === "idle" && (
            <div className="grid max-w-[44ch] gap-4 self-center justify-self-center text-center">
              <p className="text-compact text-muted">For each task, open the menus and pick where you&apos;d expect to find the answer. There are no screens behind them: only the labels count, which is the point of a tree test.</p>
              <Btn onClick={start} className="justify-self-center">Start the tree test</Btn>
            </div>
          )}
          {phase === "between" && (
            <div className="grid max-w-[44ch] gap-4 self-center justify-self-center text-center">
              <p className="text-lg">Half way.</p>
              <p className="text-compact text-muted">Same five tasks, different structure. You know the answers now, so expect to be faster: that&apos;s why the order is random.</p>
              <Btn onClick={() => { setVi(1); setTi(0); resetTask(); setPhase("run"); }} className="justify-self-center">Continue</Btn>
            </div>
          )}
          {phase === "run" && (
            <>
              <div className="rounded-xl bg-background p-4 ring-1 ring-border">
                <p className="font-mono text-xs uppercase tracking-[0.06em] text-accent">Task {ti + 1}</p>
                <p className="mt-1.5 text-compact">{tasks[ti].text}</p>
              </div>
              <div className="max-h-[360px] overflow-auto rounded-xl bg-surface/60 p-1" tabIndex={0} role="region" aria-label={`${NAMES[variant]} menu`}>
                <Tree nodes={TREES[variant]} open={open} chosen={chosen} onNode={onNode} />
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Btn disabled={!chosen} onClick={() => submit()}>I&apos;d find it here</Btn>
                <Btn kind="ghost" onClick={() => submit(true)}>Skip</Btn>
                {chosen && <span className="text-caption text-muted">Chosen: {labelOf(TREES[variant], chosen)}</span>}
              </div>
            </>
          )}
          {phase === "done" && (
            <ol className="grid gap-2">
              {tasks.map((t, i) => {
                const a = results.find((r) => r.variant === "A" && r.task === i);
                const b = results.find((r) => r.variant === "B" && r.task === i);
                const mark = (r?: Result) => (r ? `${r.correct ? (r.direct ? "Direct" : "Found") : "Missed"} · ${ms(r.ms)}` : "–");
                return (
                  <li key={i} className="grid gap-1 rounded-xl bg-background p-3 ring-1 ring-border">
                    <p className="text-sm">{i + 1}. {t.text}</p>
                    <p className="text-caption text-muted">A: {mark(a)} · B: {mark(b)}</p>
                  </li>
                );
              })}
            </ol>
          )}
        </Stage>

        <div className="grid content-start gap-4 p-4 sm:p-5">
          <p className="font-mono text-xs uppercase tracking-[0.06em] text-muted">Your result</p>
          <div className="grid gap-3 sm:grid-cols-2">
            {summary.map((s) => (
              <div key={s.v} className={`grid gap-3 rounded-xl p-4 ring-1 ring-inset ${s.v === "B" ? "ring-accent/30" : "ring-border"}`}>
                <p className={`text-sm font-medium ${s.v === "B" ? "text-accent" : ""}`}>{NAMES[s.v]}</p>
                <Readout value={s.n ? `${s.success}/${s.n}` : "–"} label="tasks found" />
                <Readout value={s.n ? `${s.direct}/${s.n}` : "–"} label="found without backtracking" />
                <Readout value={s.n ? ms(s.med) : "–"} label="median time per task" />
              </div>
            ))}
          </div>
          <LabNote>
            One person is not a study: this shows how a tree test works and lets you feel the difference. The plan is 30 people across roles and plants,
            with a pass mark of 80% success and 60% direct. Task 4 keeps it fair: cross-plant reports are easy to find by department too.
          </LabNote>
        </div>
      </div>
    </LabFrame>
  );
}
