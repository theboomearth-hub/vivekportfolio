import type { Sketch as SketchKind } from "@/lib/home";
import s from "./home.module.css";

/**
 * Stylised recreations of each project's main screen, for client work that can't be shown as screenshots (NDA).
 * Built from the site's own tokens so they sit with the rest of the page. The labels describe the kind of screen,
 * not real client data. Decorative: the card text carries the content.
 */

const mono = "font-mono tracking-[0.04em]";
const kicker = `${mono} text-[8.5px] uppercase text-muted`;

function Chrome({ title, children }: { title: string; children?: React.ReactNode }) {
  return (
    <div className="flex h-8 shrink-0 items-center gap-1 border-b border-border px-3">
      <i className="h-[7px] w-[7px] rounded-full bg-border-strong" />
      <i className="h-[7px] w-[7px] rounded-full bg-border-strong" />
      <i className="h-[7px] w-[7px] rounded-full bg-border-strong" />
      <span className={`ml-2 truncate text-[10px] text-muted ${mono}`}>{title}</span>
      <span className="ml-auto flex items-center gap-1.5">{children}</span>
    </div>
  );
}

const pill = `rounded-[5px] px-1.5 py-[3px] text-[9px] leading-none ${mono}`;

function Builder() {
  return (
    <>
      <Chrome title="App builder">
        <span className={`${pill} text-muted ring-1 ring-border ring-inset`}>Preview</span>
        <span className={`${pill} bg-foreground text-background`}>Publish</span>
      </Chrome>
      <div className="grid min-h-0 flex-1 grid-cols-[22%_minmax(0,1fr)_26%]">
        <div className="grid content-start gap-1.5 border-r border-border p-2.5">
          <span className={kicker}>Components</span>
          {["Form", "Table", "Chart", "Button", "Image"].map((c, i) => (
            <span key={c} className={`flex items-center gap-1.5 rounded-[5px] px-1.5 py-1 text-[10px] ${i === 0 ? "bg-accent-light text-accent" : "text-muted"}`}>
              <i className={`h-2.5 w-2.5 shrink-0 rounded-[3px] ring-1 ring-inset ${i === 0 ? "ring-accent" : "ring-border-strong"}`} />
              {c}
            </span>
          ))}
        </div>
        <div className="grid content-start gap-2.5 p-3 [background-image:radial-gradient(var(--color-border)_1px,transparent_1px)] [background-size:14px_14px]">
          <div className="rounded-md bg-background p-2.5 ring-1 ring-border">
            <p className="text-[11px] font-medium leading-tight">Customer onboarding</p>
            <p className="mt-1 text-[9px] text-muted">Step 2 of 3</p>
          </div>
          <div className="relative rounded-md bg-background p-2.5 ring-[1.5px] ring-accent">
            <span className={`absolute -top-2 left-2 rounded-[4px] bg-accent px-1 py-0.5 text-[8px] leading-none text-white ${mono}`}>Form</span>
            <p className="text-[9px] text-muted">Company name</p>
            <i className="mt-1 block h-5 rounded-[4px] ring-1 ring-border ring-inset" />
            <p className="mt-2 text-[9px] text-muted">Plan</p>
            <i className="mt-1 flex h-5 items-center justify-end rounded-[4px] pr-1.5 text-[8px] text-muted ring-1 ring-border ring-inset">▾</i>
          </div>
          <span className="w-fit rounded-[5px] bg-foreground px-3 py-1.5 text-[10px] leading-none text-background">Continue</span>
        </div>
        <div className="grid content-start gap-2 border-l border-border p-2.5">
          <span className={kicker}>Properties</span>
          {[["Width", "Fill"], ["Data", "customers"], ["Rule", "Required"]].map(([k, v]) => (
            <span key={k} className="grid gap-1">
              <span className="text-[9px] text-muted">{k}</span>
              <span className={`${pill} w-fit text-foreground ring-1 ring-border ring-inset`}>{v}</span>
            </span>
          ))}
          <span className="flex items-center justify-between text-[9px] text-muted">
            Visible
            <i className="flex h-3 w-5 items-center justify-end rounded-full bg-accent px-[2px]"><i className="h-2 w-2 rounded-full bg-white" /></i>
          </span>
        </div>
      </div>
    </>
  );
}

function Timeline() {
  const rows: [string, string, string, "done" | "now" | "next"][] = [
    ["07:00", "Pre-op check-in", "Done", "done"],
    ["08:30", "Cataract · OT 2", "In theatre", "now"],
    ["09:30", "Recovery · Bay 3", "Waiting", "next"],
    ["11:00", "Hernia repair · OT 1", "Ready", "next"],
    ["12:30", "Endoscopy · OT 3", "Ready", "next"],
    ["14:00", "Discharge review", "Later", "next"],
  ];
  return (
    <>
      <Chrome title="Daycare · theatre list">
        <span className={`${pill} bg-accent-light text-accent`}>Today</span>
      </Chrome>
      <div className="grid content-start gap-1.5 p-3">
        {rows.map(([t, what, status, state]) => (
          <div key={t} className="grid grid-cols-[34px_minmax(0,1fr)] items-center gap-2">
            <span className={`text-[9px] ${mono} ${state === "now" ? "text-accent" : "text-muted"}`}>{t}</span>
            <span className={`flex items-center justify-between gap-2 rounded-[6px] px-2.5 py-1.5 ring-1 ring-inset ${state === "now" ? "bg-accent-light/60 ring-accent/40 shadow-[inset_3px_0_0_var(--color-accent)]" : "ring-border"}`}>
              <span className={`truncate text-[10px] ${state === "done" ? "text-muted line-through decoration-border-strong" : ""}`}>{what}</span>
              <span className={`shrink-0 ${pill} ${state === "now" ? "bg-accent text-white" : "bg-surface text-muted"}`}>{status}</span>
            </span>
          </div>
        ))}
      </div>
    </>
  );
}

function Gantt() {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
  const rows: [string, number, number, boolean][] = [
    ["Survey", 0, 14, false],
    ["Foundations", 10, 26, true],
    ["Structure", 30, 34, true],
    ["MEP", 44, 30, false],
    ["Facade", 58, 24, false],
    ["Fit-out", 66, 28, true],
  ];
  return (
    <>
      <Chrome title="Programme · Tower B">
        <span className="flex items-center gap-1 text-[9px] text-muted"><i className="h-1.5 w-3 rounded-full bg-accent" />Critical path</span>
      </Chrome>
      <div className="grid content-start gap-1.5 p-3">
        <div className="grid grid-cols-[26%_minmax(0,1fr)] gap-2">
          <span />
          <span className="grid grid-cols-6">{months.map((m) => <span key={m} className={`text-[8.5px] text-muted ${mono}`}>{m}</span>)}</span>
        </div>
        <div className="relative grid gap-1.5">
          {/* Month gridlines, behind the bars. */}
          <div className="pointer-events-none absolute inset-y-0 right-0 left-[calc(26%+0.5rem)] grid grid-cols-6">
            {months.map((m) => <i key={m} className="border-l border-border" />)}
          </div>
          {rows.map(([name, start, width, critical]) => (
            <div key={name} className="grid grid-cols-[26%_minmax(0,1fr)] items-center gap-2">
              <span className="truncate text-[10px] text-muted">{name}</span>
              <span className="relative h-5">
                <i className={`absolute top-1 bottom-1 rounded-[3px] ${critical ? "bg-accent" : "bg-border-strong"}`} style={{ left: `${start}%`, width: `${width}%` }} />
              </span>
            </div>
          ))}
          <div className="grid grid-cols-[26%_minmax(0,1fr)] items-center gap-2">
            <span className="truncate text-[10px] font-medium">Handover</span>
            <span className="relative h-5"><i className="absolute top-1/2 left-[94%] h-2.5 w-2.5 -translate-y-1/2 rotate-45 bg-foreground" /></span>
          </div>
          {/* Today */}
          <i className="pointer-events-none absolute -top-1 bottom-0 left-[calc(26%+0.5rem+(74%-0.5rem)*0.48)] w-[2px] bg-[repeating-linear-gradient(180deg,var(--color-accent)_0_5px,transparent_5px_8px)]" />
        </div>
      </div>
    </>
  );
}

function Tokens() {
  const steps = [100, 70, 45, 25, 12, 5];
  return (
    <>
      <Chrome title="tokens.json">
        <span className={`${pill} text-muted ring-1 ring-border ring-inset`}>v3.2</span>
      </Chrome>
      <div className="grid content-start gap-2.5 p-3">
        {(["foreground", "accent"] as const).map((name) => (
          <div key={name} className="grid grid-cols-[48px_minmax(0,1fr)] items-center gap-2">
            <span className={`text-[9px] text-muted ${mono}`}>{name === "foreground" ? "neutral" : "accent"}</span>
            <span className="grid grid-cols-6 gap-1">
              {steps.map((p) => (
                <i key={p} className="aspect-[4/3] rounded-[4px] ring-1 ring-border ring-inset" style={{ background: `color-mix(in srgb, var(--color-${name}) ${p}%, var(--color-background))` }} />
              ))}
            </span>
          </div>
        ))}
        <div className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-3 border-t border-border pt-2.5">
          <span className="text-[30px] font-medium leading-none tracking-[-0.03em]">Aa</span>
          <span className={`grid gap-0.5 text-[9px] text-muted ${mono}`}>
            <span>display / 48 / 500</span>
            <span>heading / 24 / 500</span>
            <span>body / 16 / 400</span>
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-1.5 border-t border-border pt-2.5">
          <span className="rounded-[5px] bg-accent px-2.5 py-1.5 text-[9.5px] leading-none text-white">Primary</span>
          <span className="rounded-[5px] px-2.5 py-1.5 text-[9.5px] leading-none ring-1 ring-border-strong ring-inset">Secondary</span>
          <span className="rounded-full bg-accent-light px-2 py-1 text-[9px] leading-none text-accent">Chip</span>
          <i className="flex h-3.5 w-6 items-center justify-end rounded-full bg-accent px-[2px]"><i className="h-2.5 w-2.5 rounded-full bg-white" /></i>
        </div>
      </div>
    </>
  );
}

export default function Sketch({ kind }: { kind: SketchKind }) {
  const body = kind === "builder" ? <Builder /> : kind === "timeline" ? <Timeline /> : kind === "gantt" ? <Gantt /> : kind === "tokens" ? <Tokens /> : null;
  if (!body) return null;
  return (
    <>
      <span className={`absolute top-1.5 right-3 z-10 rounded-full bg-background/90 px-2 py-0.5 text-[10px] leading-[14px] text-muted ring-1 ring-border sm:top-3 ${mono}`}>Stylized</span>
      <div className={`${s.mock} flex flex-col overflow-hidden`}>{body}</div>
    </>
  );
}
