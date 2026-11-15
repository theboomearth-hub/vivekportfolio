"use client";

/**
 * Takt's asset explorer: one plant model, three ways to walk it. Switch the view (location, process, machine type),
 * search by name or code, open a machine, and see that it is the same object at the end of three different paths,
 * with one name per signal. Runs on the fictional Kaveri dataset (lib/work/takt-plant.ts).
 */
import { useMemo, useState } from "react";
import { Btn, LabFrame, Stage } from "@/components/craft/kit";
import {
  MACHINES, SCENARIO_ID, SIGNAL_LABEL, openPath, pathIn, search, tagName, tree, unsPath,
  type Lens, type Machine, type Node,
} from "@/lib/work/takt-plant";

const LENSES: { id: Lens; label: string; hint: string }[] = [
  { id: "location", label: "Location", hint: "Plant › area › line" },
  { id: "process", label: "Process", hint: "Step › plant › line" },
  { id: "class", label: "Machine type", hint: "Class › type › plant" },
];

const byId = new Map(MACHINES.map((m) => [m.id, m]));

function TreeView({ nodes, open, toggle, selected, select, depth = 0 }: { nodes: Node[]; open: Set<string>; toggle: (id: string) => void; selected: string; select: (id: string) => void; depth?: number }) {
  return (
    <ul className={depth ? "ml-3 border-l border-border pl-2" : ""}>
      {nodes.map((node) =>
        node.kind === "group" ? (
          <li key={node.id}>
            <button
              type="button"
              aria-expanded={open.has(node.id)}
              onClick={() => toggle(node.id)}
              className="flex min-h-9 w-full items-center gap-2 rounded-md px-2 text-left text-sm hover:bg-background"
            >
              <svg viewBox="0 0 24 24" className={`h-3.5 w-3.5 shrink-0 text-muted transition-transform ${open.has(node.id) ? "rotate-90" : ""}`} fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true"><path d="M9 6l6 6-6 6" /></svg>
              <span className="min-w-0 flex-1 truncate">{node.label}</span>
              <span className="shrink-0 font-mono text-[11px] tabular-nums text-muted">{node.count}</span>
            </button>
            {open.has(node.id) && node.children && <TreeView nodes={node.children} open={open} toggle={toggle} selected={selected} select={select} depth={depth + 1} />}
          </li>
        ) : (
          <li key={node.id}>
            <button
              type="button"
              aria-current={selected === node.machine ? "true" : undefined}
              onClick={() => select(node.machine!)}
              className={`flex min-h-9 w-full items-center gap-2 rounded-md px-2 text-left text-sm ${selected === node.machine ? "bg-foreground text-background" : "hover:bg-background"}`}
            >
              <span aria-hidden="true" className={`h-1.5 w-1.5 shrink-0 rounded-full ${node.machine === SCENARIO_ID ? "bg-accent" : selected === node.machine ? "bg-background" : "bg-border-strong"}`} />
              <span className="min-w-0 flex-1 truncate">{node.label}</span>
            </button>
          </li>
        ),
      )}
    </ul>
  );
}

function Crumbs({ parts, active }: { parts: string[]; active: boolean }) {
  return (
    <ol className="flex flex-wrap items-center gap-x-1.5 gap-y-1 text-sm">
      {parts.slice(1).map((p, i, all) => (
        <li key={i} className="flex items-center gap-1.5">
          <span className={i === all.length - 1 ? "font-medium" : active ? "" : "text-muted"}>{p}</span>
          {i < all.length - 1 && <span aria-hidden="true" className="text-muted">›</span>}
        </li>
      ))}
    </ol>
  );
}

function Details({ m, lens }: { m: Machine; lens: Lens }) {
  const [comp, setComp] = useState(m.components.find((c) => c.code === "AX2M")?.code ?? m.components[0].code);
  const component = m.components.find((c) => c.code === comp) ?? m.components[0];
  const isScenario = m.id === SCENARIO_ID;
  return (
    <div className="grid content-start gap-6 p-4 sm:p-5">
      <div>
        <p className="font-mono text-xs uppercase tracking-[0.06em] text-muted">Machine · {m.code}</p>
        <h3 className="mt-1.5 text-xl">{m.name}</h3>
        <p className="mt-1 font-mono text-[12px] text-muted">/plants/{m.id.toLowerCase().replaceAll(".", "/")}</p>
      </div>

      <div className="grid gap-2.5">
        <p className="font-mono text-xs uppercase tracking-[0.06em] text-muted">One machine, three paths</p>
        {LENSES.map((l) => (
          <div key={l.id} className={`grid gap-1 rounded-xl p-3 ring-1 ring-inset ${lens === l.id ? "bg-accent-light/40 ring-accent/30" : "ring-border"}`}>
            <span className={`text-caption ${lens === l.id ? "text-accent" : "text-muted"}`}>{l.label}{lens === l.id ? " · current view" : ""}</span>
            <Crumbs parts={pathIn(l.id, m)} active={lens === l.id} />
          </div>
        ))}
      </div>

      <div className="grid gap-2.5">
        <p className="font-mono text-xs uppercase tracking-[0.06em] text-muted">Components</p>
        <div className="flex flex-wrap gap-1.5">
          {m.components.map((c) => (
            <button key={c.code} type="button" aria-pressed={c.code === component.code} onClick={() => setComp(c.code)} className={`min-h-9 rounded-full px-3 text-sm ring-1 ring-inset ${c.code === component.code ? "bg-foreground text-background ring-foreground" : "ring-border-strong hover:bg-surface"}`}>
              {c.name}
            </button>
          ))}
        </div>
        <div className="overflow-x-auto rounded-xl ring-1 ring-border" tabIndex={0} role="region" aria-label={`Signals of ${component.name}, scrolls sideways`}>
          <table className="w-full min-w-[520px] border-collapse text-left text-caption">
            <caption className="sr-only">Signals of {component.name}, with their standard names</caption>
            <thead className="bg-surface">
              <tr>
                <th scope="col" className="px-3 py-2 font-medium">Signal</th>
                <th scope="col" className="px-3 py-2 font-medium">Tag name</th>
                <th scope="col" className="px-3 py-2 font-medium">Namespace path</th>
              </tr>
            </thead>
            <tbody>
              {component.signals.map((s) => (
                <tr key={s} className="border-t border-border">
                  <td className="px-3 py-2">{SIGNAL_LABEL[s] ?? s}</td>
                  <td className={`px-3 py-2 font-mono ${isScenario && component.code === "AX2M" && s === "VIB_RMS" ? "text-accent" : ""}`}>{tagName(m, component.code, s)}</td>
                  <td className="px-3 py-2 font-mono text-muted">{unsPath(m, component.code, s)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid gap-2.5">
        <p className="font-mono text-xs uppercase tracking-[0.06em] text-muted">Related</p>
        {isScenario ? (
          <ul className="grid gap-2">
            {[
              ["Incident #4471", "02:14 · Line 3 stopped · first cause: axis-2 overcurrent"],
              ["Work order WO-2291", "Axis-2 bearing replaced, 41 days ago · Meena"],
              ["Similar incident", "Line 1, WR-02 · March · same motor, same drift"],
              ["Spare", "Axis-2 servo motor · bin B-14 · 2 in stock"],
            ].map(([k, v]) => (
              <li key={k} className="grid gap-0.5 rounded-xl bg-surface px-3 py-2.5">
                <span className="text-sm font-medium">{k}</span>
                <span className="text-caption text-muted">{v}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-compact text-muted">No open incidents. In the product, this is where the machine&apos;s incidents, work orders, spares and documents sit, one tap from the machine.</p>
        )}
      </div>
    </div>
  );
}

export default function AssetExplorer() {
  const [lens, setLens] = useState<Lens>("location");
  const [selected, setSelected] = useState(SCENARIO_ID);
  const [open, setOpen] = useState<Set<string>>(() => new Set(openPath("location", SCENARIO_ID)));
  const [q, setQ] = useState("");
  const nodes = useMemo(() => tree(lens), [lens]);
  const results = useMemo(() => search(q), [q]);
  const m = byId.get(selected)!;

  const switchLens = (l: Lens) => {
    setLens(l);
    setOpen(new Set(openPath(l, selected)));
  };
  const select = (id: string) => {
    setSelected(id);
    setOpen((o) => new Set([...o, ...openPath(lens, id)]));
  };
  const toggle = (id: string) => setOpen((o) => { const n = new Set(o); if (n.has(id)) n.delete(id); else n.add(id); return n; });

  return (
    <LabFrame
      status={<>Switch the view, search, or open any of {MACHINES.length} machines. The <span className="text-accent">blue dot</span> is the night&apos;s robot.</>}
      actions={selected !== SCENARIO_ID && <Btn kind="ghost" onClick={() => { setSelected(SCENARIO_ID); setOpen(new Set(openPath(lens, SCENARIO_ID))); }}>Back to WR-04</Btn>}
    >
      <div className="grid lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
        <Stage className="grid content-start gap-3 border-b border-border p-3 sm:p-4 lg:border-r lg:border-b-0">
          <div className="grid grid-cols-3 gap-1 rounded-xl bg-background p-1 ring-1 ring-border" role="group" aria-label="View">
            {LENSES.map((l) => (
              <button key={l.id} type="button" aria-pressed={lens === l.id} onClick={() => switchLens(l.id)} className={`grid min-h-11 content-center rounded-lg px-2 text-center ${lens === l.id ? "bg-foreground text-background" : "hover:bg-surface"}`}>
                <span className="text-sm font-medium">{l.label}</span>
                <span className={`hidden text-[11px] sm:block ${lens === l.id ? "opacity-75" : "text-muted"}`}>{l.hint}</span>
              </button>
            ))}
          </div>
          <div className="relative">
            <label htmlFor="takt-search" className="sr-only">Search machines by name, code or line</label>
            <input
              id="takt-search"
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search: wr-04 line 3, spindle, compressor…"
              autoComplete="off"
              className="min-h-11 w-full rounded-xl bg-background px-3.5 text-sm ring-1 ring-border-strong ring-inset placeholder:text-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            />
            {q && (
              <ul className="mt-1.5 grid gap-1 rounded-xl bg-background p-1.5 ring-1 ring-border" aria-label="Search results">
                {results.length ? results.map((r) => (
                  <li key={r.id}>
                    <button type="button" onClick={() => { select(r.id); setQ(""); }} className="grid w-full gap-0.5 rounded-lg px-2.5 py-2 text-left hover:bg-surface">
                      <span className="text-sm">{r.name}</span>
                      <span className="text-[12px] text-muted">{pathIn("location", r).slice(1, 4).join(" › ")}</span>
                    </button>
                  </li>
                )) : <li className="px-2.5 py-2 text-sm text-muted">No machine matches. Try a code like vmc-03.</li>}
              </ul>
            )}
          </div>
          <div className="max-h-[440px] overflow-auto pr-1" tabIndex={0} role="region" aria-label={`Plant model by ${LENSES.find((l) => l.id === lens)!.label.toLowerCase()}`}>
            <TreeView nodes={nodes} open={open} toggle={toggle} selected={selected} select={select} />
          </div>
        </Stage>
        <Details key={m.id} m={m} lens={lens} />
      </div>
    </LabFrame>
  );
}
