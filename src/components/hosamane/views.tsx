"use client";

import { useState } from "react";
import { ArrowUpRight, Ban, Bus, CalendarCheck, Car, ChevronRight, Droplets, FastForward, Flag, List, LoaderCircle, Map as MapIcon, MapPin, Pencil, Share2, Square, TrainFront, Waves } from "lucide-react";
import { anchorById, inr, inrShort, listingById, localities, localityById } from "@/lib/hosamane/data";
import type { AgentEvent, ApprovalAction, Brief, Check, Memory, OwnerReply, Task } from "@/lib/hosamane/types";
import { Button, Card, Chip, Label, Photo, StatusIcon } from "./ui";

/* ── tool steps ───────────────────────────────────────────────── */
const TOOL_LABELS: Record<string, string> = {
  update_brief: "Updated your brief", search_listings: "Searched listings", get_listing: "Opened the listing", verify_listing: "Ran the checks",
  estimate_move_in_cost: "Worked out the move-in cost", estimate_purchase_cost: "Worked out the all-in cost", check_project_registration: "Checked the project registration",
  get_commute: "Measured the commute", get_neighbourhood: "Looked up the area", compare_listings: "Compared homes", draft_owner_message: "Drafted messages",
  send_owner_message: "Sent messages", plan_visit_route: "Planned the route", schedule_visits: "Requested visit slots", share_shortlist: "Created a share link",
  collect_votes: "Collected votes", watch_search: "Set up a watch", summarise_visit_notes: "Read your notes", report_listing: "Filed a report",
};

export function ToolSteps({ events, pending }: { events: AgentEvent[]; pending?: boolean }) {
  const [open, setOpen] = useState(false);
  const calls = events.filter((e): e is Extract<AgentEvent, { t: "tool" }> => e.t === "tool");
  if (!calls.length) return null;
  const done = new Set(events.filter((e) => e.t === "result").map((e) => (e as { id: string }).id));
  const running = calls.find((c) => !done.has(c.id));
  return (
    <div className="text-hm-caption text-hm-muted">
      <button type="button" onClick={() => setOpen((o) => !o)} aria-expanded={open} className="inline-flex min-h-8 items-center gap-1.5 rounded-full px-2 hover:bg-hm-surface">
        {pending && running ? <LoaderCircle size={14} className="animate-spin" /> : <ChevronRight size={14} className={`transition-transform ${open ? "rotate-90" : ""}`} />}
        {pending && running ? `${TOOL_LABELS[running.name] ?? running.name}…` : `${calls.length} step${calls.length === 1 ? "" : "s"}`}
      </button>
      {open && (
        <ol className="mt-1 ml-2 grid gap-1 border-l border-hm-line pl-3">
          {calls.map((c) => (
            <li key={c.id} className="flex items-center gap-2">
              <StatusIcon state={done.has(c.id) ? "pass" : "todo"} size={13} />
              <span>{TOOL_LABELS[c.name] ?? c.name}</span>
              <code className="rounded bg-hm-surface px-1.5 text-hm-label text-hm-muted">{c.name}</code>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}

/* ── brief ────────────────────────────────────────────────────── */
export function briefItems(b: Brief) {
  const items: { field: string; value?: string; label: string; origin: "you" | "assumed" }[] = [];
  const o = (f: string) => b.origins[f] ?? "you";
  if (b.mode) items.push({ field: "mode", label: b.mode === "rent" ? "Renting" : "Buying", origin: o("mode") });
  if (b.bhk) items.push({ field: "bhk", label: `${b.bhk}BHK`, origin: o("bhk") });
  if (b.budget) items.push({ field: "budget", label: b.mode === "buy" ? `Up to ${inrShort(b.budget)}` : `Up to ${inr(b.budget)}/month`, origin: o("budget") });
  if (b.downPayment) items.push({ field: "downPayment", label: `${inrShort(b.downPayment)} down`, origin: o("downPayment") });
  if (b.anchorId) items.push({ field: "anchorId", label: `${anchorById(b.anchorId)!.name.split(" (")[0]}${b.time ? ` at ${b.time}` : ""}`, origin: o("anchorId") });
  if (b.maxCommuteMin) items.push({ field: "maxCommuteMin", label: `≤ ${b.maxCommuteMin} min commute`, origin: o("maxCommuteMin") });
  if (b.furnishing) items.push({ field: "furnishing", label: b.furnishing === "any" ? "Any furnishing" : b.furnishing === "semi" ? "Semi-furnished" : b.furnishing[0].toUpperCase() + b.furnishing.slice(1), origin: o("furnishing") });
  if (b.readiness) items.push({ field: "readiness", label: b.readiness === "any" ? "Ready or under construction" : b.readiness === "ready" ? "Ready to move" : "Under construction", origin: o("readiness") });
  for (const m of b.mustHaves) items.push({ field: "mustHaves", value: m, label: m === "pets" ? "Pets allowed" : m[0].toUpperCase() + m.slice(1), origin: o("mustHaves") });
  for (const d of b.dealBreakers) items.push({ field: "dealBreakers", value: d, label: d === "brokers" ? "No brokers" : `No ${d}`, origin: o("dealBreakers") });
  if (b.localities.length) items.push({ field: "localities", label: b.localities.map((id) => localityById(id).name).join(", "), origin: o("localities") });
  for (const p of b.people) items.push({ field: "people", value: p.name, label: `${p.name} (${p.role === "votes" ? "votes" : "views"})`, origin: o("people") });
  return items;
}

export function BriefChips({ brief, onRemove }: { brief: Brief; onRemove?: (field: string, value?: string) => void }) {
  const items = briefItems(brief);
  if (!items.length) return null;
  return (
    <ul className="flex flex-wrap gap-1.5" aria-label="Your brief">
      {items.map((it) => (
        <li key={it.field + (it.value ?? "") + it.label}>
          <Chip tone={it.origin === "assumed" ? "assumed" : "plain"} title={it.origin === "assumed" ? "I assumed this. Tap to remove." : "You said this. Tap to remove."} onClick={onRemove ? () => onRemove(it.field, it.value) : undefined}>
            {it.origin === "assumed" && <span className="text-hm-label">I assumed:</span>}
            {it.label}
          </Chip>
        </li>
      ))}
    </ul>
  );
}

/* ── shortlist and map ────────────────────────────────────────── */
type SearchResult = { mode: "rent" | "buy"; considered: number; matched: number; results: { id: string; matches: number; of: number; misses: string[]; flags: string[]; toAsk: string[]; commuteMin: number | null }[] };

export function ListingCard({ r, onOpen, removed }: { r: SearchResult["results"][number]; onOpen?: (id: string) => void; removed?: string }) {
  const l = listingById(r.id)!;
  const loc = localityById(l.localityId);
  return (
    <Card className={`overflow-hidden ${removed ? "opacity-60" : ""}`}>
      <button type="button" onClick={() => onOpen?.(r.id)} disabled={!onOpen} className="grid w-full grid-cols-[112px_minmax(0,1fr)] text-left sm:grid-cols-[140px_minmax(0,1fr)]">
        <Photo src={l.photos[0].src} ratio="h-full min-h-[112px]" />
        <span className="grid gap-1 p-3">
          <span className="flex items-baseline justify-between gap-2">
            <span className="text-[17px] font-semibold tabular-nums">{l.mode === "rent" ? `${inr(l.rent!)}` : inrShort(l.price!)}<span className="text-hm-caption font-normal text-hm-muted">{l.mode === "rent" ? "/month" : ""}</span></span>
            {r.commuteMin !== null && <span className="inline-flex items-center gap-1 text-hm-caption text-hm-muted"><Car size={13} />{r.commuteMin} min</span>}
          </span>
          <span className="text-hm-compact font-medium leading-snug">{l.title}</span>
          <span className="inline-flex items-center gap-1 text-hm-caption text-hm-muted"><MapPin size={13} />{loc.name} · {l.sqft} sq ft · {l.lister === "owner" ? "Owner" : l.lister === "broker" ? "Broker" : "Builder"}</span>
          {removed ? <span className="text-hm-caption text-hm-danger">Out: {removed}</span> : (
            <span className="mt-1 flex flex-wrap gap-1">
              <Chip tone="ok">Matches {r.matches} of {r.of}</Chip>
              {r.misses.slice(0, 1).map((m) => <Chip key={m}>Misses: {m}</Chip>)}
              {r.flags.slice(0, 2).map((f) => <Chip key={f} tone="warn">{f}</Chip>)}
            </span>
          )}
        </span>
      </button>
    </Card>
  );
}

export function ShortlistView({ data, memory, onOpen }: { data: SearchResult; memory?: Memory; onOpen?: (id: string) => void }) {
  const [view, setView] = useState<"list" | "map">("list");
  return (
    <div className="grid gap-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-hm-caption text-hm-muted">{data.considered} {data.mode === "rent" ? "rentals" : "homes for sale"} checked · {data.matched} fit · ranked against your brief</p>
        <div role="group" aria-label="View" className="inline-flex rounded-hm-control bg-hm-surface p-0.5 ring-1 ring-hm-line">
          {(["list", "map"] as const).map((v) => (
            <button key={v} type="button" aria-pressed={view === v} onClick={() => setView(v)} className={`inline-flex min-h-9 items-center gap-1.5 rounded-[8px] px-3 text-hm-caption ${view === v ? "bg-hm-card font-medium shadow-[0_0_0_1px_var(--color-hm-line)]" : "text-hm-muted"}`}>
              {v === "list" ? <List size={14} /> : <MapIcon size={14} />}{v === "list" ? "List" : "Map"}
            </button>
          ))}
        </div>
      </div>
      {view === "map" && <MapView ids={data.results.map((r) => r.id)} anchorId={memory?.brief.anchorId ?? null} onOpen={onOpen} />}
      <ul className={`grid gap-2.5 ${view === "map" ? "sr-only" : ""}`}>
        {data.results.map((r) => <li key={r.id}><ListingCard r={r} onOpen={onOpen} removed={memory?.removed.find((x) => x.id === r.id)?.reason} /></li>)}
      </ul>
    </div>
  );
}

/** A schematic of the dataset's localities. Not to scale; the list is the accessible alternative. */
export function MapView({ ids, anchorId, onOpen }: { ids: string[]; anchorId: string | null; onOpen?: (id: string) => void }) {
  const W = 360, H = 320, sx = (x: number) => 40 + (x + 3) * 15, sy = (y: number) => 30 + (13 - y) * 9.5;
  const a = anchorId ? anchorById(anchorId) : null;
  return (
    <Card className="overflow-hidden">
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`Map of ${ids.length} homes. The list below has the same homes.`} className="block w-full bg-[#f6f3ec]">
        <ellipse cx={sx(6)} cy={sy(-3)} rx={150} ry={128} fill="none" stroke="#d9d2c4" strokeWidth="6" />
        <text x={sx(14)} y={sy(-14.5)} fontSize="9" fill="#8a8378">Outer Ring Road</text>
        <path d={`M${sx(-2)} ${sy(0)} H${sx(17)}`} stroke="#cfe0e2" strokeWidth="3" strokeDasharray="1 0" />
        <text x={sx(-2)} y={sy(0) - 5} fontSize="9" fill="#5b8a91">Metro (Purple Line)</text>
        <ellipse cx={sx(8.5)} cy={sy(-7.6)} rx="14" ry="7" fill="#d7e8ea" />
        {localities.map((l) => <text key={l.id} x={sx(l.x)} y={sy(l.y) + 16} fontSize="9" textAnchor="middle" fill="#596068">{l.name}</text>)}
        {a && (<g><rect x={sx(a.x) - 5} y={sy(a.y) - 5} width="10" height="10" fill="#15181b" rx="2" /><text x={sx(a.x) + 8} y={sy(a.y) + 3} fontSize="9" fontWeight="600" fill="#15181b">Office</text></g>)}
        {ids.map((id, i) => {
          const l = listingById(id)!, loc = localityById(l.localityId);
          const dx = (i % 3) * 7 - 7;
          return (
            <g key={id} transform={`translate(${sx(loc.x) + dx} ${sy(loc.y)})`} onClick={() => onOpen?.(id)} className={onOpen ? "cursor-pointer" : ""}>
              <circle r="9" fill="#0f5f6b" stroke="#fff" strokeWidth="2" />
              <text y="3.5" fontSize="9" textAnchor="middle" fill="#fff" fontWeight="600">{i + 1}</text>
            </g>
          );
        })}
      </svg>
      <p className="border-t border-hm-line px-3 py-2 text-hm-label text-hm-muted">Schematic, not to scale. Numbers match the list.</p>
    </Card>
  );
}

/* ── one listing ──────────────────────────────────────────────── */
type CostData = { total: number; items: { label: string; amount: number; note?: string }[]; monthly?: number; exitNote?: string; loan?: { downPayment: number; amount: number; ratePct: number; years: number; emi: number; rateChecked: string }; source: string };

export function VerificationRecord({ checks }: { checks: Check[] }) {
  return (
    <div>
      <Label className="mb-2">What I checked</Label>
      <ul className="grid gap-2">
        {checks.map((c) => (
          <li key={c.key} className={`flex gap-2.5 rounded-hm-control p-2.5 ${c.state === "warn" ? "bg-hm-warn-soft" : ""}`}>
            <StatusIcon state={c.state} />
            <span className="grid gap-0.5">
              <span className="text-hm-compact font-medium">{c.label}</span>
              <span className="text-hm-caption text-hm-muted">{c.detail}</span>
              <span className="text-hm-label text-hm-muted">Source: {c.source.startsWith("http") ? <a href={c.source} target="_blank" rel="noopener noreferrer" className="text-hm-primary underline">official record<ArrowUpRight size={11} className="inline" /></a> : c.source}</span>
            </span>
          </li>
        ))}
      </ul>
      <p className="mt-2 text-hm-label text-hm-muted">✓ passed · ! flagged · ○ not done yet. Checks show who did them and when.</p>
    </div>
  );
}

export function CostCard({ data, mode }: { data: CostData; mode: "rent" | "buy" }) {
  return (
    <div>
      <Label className="mb-1">{mode === "rent" ? "To move in" : "All-in cost"}</Label>
      <p className="text-[28px] font-semibold leading-tight tabular-nums">{inrShort(data.total)}</p>
      <dl className="mt-2 grid gap-1 text-hm-compact">
        {data.items.map((it) => (
          <div key={it.label} className="flex justify-between gap-3 border-b border-hm-line/70 py-1">
            <dt className="text-hm-muted">{it.label}</dt>
            <dd className="tabular-nums">{it.amount ? inr(it.amount) : <span className="text-hm-muted">{it.note ?? "—"}</span>}</dd>
          </div>
        ))}
      </dl>
      {data.loan && (
        <p className="mt-2 text-hm-compact">EMI about <strong className="font-medium">{inr(data.loan.emi)}</strong> on a {inrShort(data.loan.amount)} loan over {data.loan.years} years at {data.loan.ratePct}% <span className="text-hm-caption text-hm-muted">(rate checked {data.loan.rateChecked})</span></p>
      )}
      {data.monthly && <p className="mt-2 text-hm-caption text-hm-muted">Then {inr(data.monthly)} a month with maintenance.</p>}
      {data.exitNote && <p className="mt-2 rounded-hm-control bg-hm-surface p-2 text-hm-caption text-hm-muted">{data.exitNote}</p>}
    </div>
  );
}

export function CommuteCard({ data }: { data: { anchor: string; time: string; carMin: number; busWalkMin: number; source: string } }) {
  return (
    <div>
      <Label className="mb-1">Commute at {data.time}</Label>
      <p className="text-hm-compact">to {data.anchor}</p>
      <div className="mt-1 flex gap-4 text-hm-compact">
        <span className="inline-flex items-center gap-1.5"><Car size={16} className="text-hm-muted" /><strong className="font-semibold tabular-nums">{data.carMin} min</strong> by car</span>
        <span className="inline-flex items-center gap-1.5"><Bus size={16} className="text-hm-muted" />{data.busWalkMin} min by bus and walk</span>
      </div>
      <p className="mt-1 text-hm-label text-hm-muted">{data.source}</p>
    </div>
  );
}

export function AreaFacts({ data }: { data: { locality: string; facts: { label: string; value: string; source: string }[]; note: string } }) {
  const icon = (l: string) => (l === "Water" ? <Droplets size={16} /> : l === "Flooding" ? <Waves size={16} /> : <TrainFront size={16} />);
  return (
    <div>
      <Label className="mb-1">{data.locality}: on record</Label>
      <ul className="grid gap-1.5">
        {data.facts.map((f) => (
          <li key={f.label} className="flex gap-2 text-hm-compact"><span className="mt-0.5 text-hm-muted">{icon(f.label)}</span><span><strong className="font-medium">{f.label}:</strong> {f.value} <span className="block text-hm-label text-hm-muted">{f.source}</span></span></li>
        ))}
      </ul>
      <p className="mt-1 text-hm-label text-hm-muted">{data.note}</p>
    </div>
  );
}

export function ListingView({ results }: { results: Record<string, unknown> }) {
  const l = results.get_listing as ReturnType<typeof listingById> & { locality: string };
  const v = results.verify_listing as { checks: Check[] } | undefined;
  const cost = (results.estimate_move_in_cost ?? results.estimate_purchase_cost) as CostData | undefined;
  const commute = results.get_commute as Parameters<typeof CommuteCard>[0]["data"] | undefined;
  const area = results.get_neighbourhood as Parameters<typeof AreaFacts>[0]["data"] | undefined;
  return (
    <Card className="overflow-hidden">
      <div className="grid grid-cols-4 gap-0.5">
        <Photo src={l!.photos[0].src} className="col-span-4 sm:col-span-2 sm:row-span-2" ratio="aspect-[4/3] sm:aspect-auto sm:h-full" />
        {l!.photos.slice(1, 4).map((p) => <Photo key={p.id} src={p.src} className="sm:col-span-1" />)}
      </div>
      <div className="grid gap-5 p-4">
        <div>
          <p className="text-[20px] font-medium leading-tight">{l!.title}</p>
          <p className="mt-1 text-hm-compact text-hm-muted">{l!.locality} · {l!.sqft} sq ft · {l!.bathrooms} bath · floor {l!.floor === 0 ? "ground" : `${l!.floor} of ${l!.floorsTotal}`} · {l!.furnishing === "semi" ? "semi-furnished" : l!.furnishing}{l!.mode === "buy" ? ` · ${l!.readiness}` : ""}</p>
          <p className="mt-1 text-hm-caption text-hm-muted">{l!.lister === "broker" ? "Listed by a broker" : l!.mode === "buy" ? `Builder: ${l!.builder}` : `Owner: ${l!.listerName}`} · listed {l!.listedDaysAgo} days ago</p>
        </div>
        <div className="grid gap-5 lg:grid-cols-2">
          {cost && <CostCard data={cost} mode={l!.mode} />}
          {v && <VerificationRecord checks={v.checks} />}
        </div>
        <div className="grid gap-5 lg:grid-cols-2">
          {commute && <CommuteCard data={commute} />}
          {area && <AreaFacts data={area} />}
        </div>
      </div>
    </Card>
  );
}

/* ── compare ──────────────────────────────────────────────────── */
export function CompareView({ data }: { data: { columns: Record<string, string>[] } }) {
  const rows: [string, string][] = [["price", "Rent or price"], ["upfront", "Upfront"], ["commute", "Commute"], ["size", "Size"], ["floor", "Floor"], ["checks", "Checks"], ["pets", "Pets (owner says)"]];
  return (
    <Card className="overflow-x-auto"><div tabIndex={0} role="region" aria-label="Comparison table, scrolls sideways" className="overflow-x-auto">
      <table className="w-full min-w-[480px] text-left text-hm-compact">
        <caption className="sr-only">Comparison of shortlisted homes</caption>
        <thead><tr className="border-b border-hm-line"><th scope="col" className="p-3 text-hm-label font-medium uppercase tracking-[0.06em] text-hm-muted"> </th>{data.columns.map((c) => <th key={c.id} scope="col" className="p-3 align-bottom font-medium">{c.locality}<span className="block text-hm-caption font-normal text-hm-muted">{c.title}</span></th>)}</tr></thead>
        <tbody>{rows.map(([k, label]) => <tr key={k} className="border-b border-hm-line/70 last:border-0"><th scope="row" className="p-3 font-normal text-hm-muted">{label}</th>{data.columns.map((c) => <td key={c.id} className="p-3 tabular-nums">{c[k]}</td>)}</tr>)}</tbody>
      </table>
    </div></Card>
  );
}

/* ── approvals ────────────────────────────────────────────────── */
export function ApprovalCard({ event, state, onApprove, onDismiss }: { event: Extract<AgentEvent, { t: "approval" }>; state?: "open" | "approved" | "dismissed"; onApprove: (action: ApprovalAction, payload: unknown, label: string) => void; onDismiss: () => void }) {
  const p = event.payload as Record<string, unknown>;
  const [drafts, setDrafts] = useState(() => (p.drafts as { listingId: string; to: string; text: string }[] | undefined) ?? []);
  const [editing, setEditing] = useState(false);
  const closed = state && state !== "open";
  return (
    <Card className={`border-l-4 p-4 ${closed ? "border-l-hm-line" : "border-l-hm-primary"}`}>
      <Label className="mb-2">Review before {event.action === "send_owner_message" ? "sending" : event.action === "share_shortlist" ? "sharing" : event.action === "report_listing" ? "reporting" : "requesting"}</Label>
      {event.action === "send_owner_message" && (
        <div className="grid gap-2">
          <p className="text-hm-caption text-hm-muted">Each owner gets this from a masked number. Your name and number aren't shared.</p>
          {drafts.map((d, i) => (
            <div key={d.listingId} className="rounded-hm-control bg-hm-surface p-3">
              <p className="text-hm-label text-hm-muted">To {d.to} · {localityById(listingById(d.listingId)!.localityId).name}</p>
              {editing && !closed ? (
                <textarea aria-label={`Message to ${d.to}`} value={d.text} onChange={(e) => setDrafts((all) => all.map((x, j) => (j === i ? { ...x, text: e.target.value } : x)))} className="mt-1 w-full rounded-hm-control bg-hm-card p-2 text-hm-compact ring-1 ring-hm-control" rows={3} />
              ) : <p className="mt-1 text-hm-compact">{d.text}</p>}
            </div>
          ))}
          <p className="text-hm-caption text-hm-muted">Sent messages can&apos;t be unsent.</p>
        </div>
      )}
      {event.action === "schedule_visits" && (
        <ol className="grid gap-2">
          {(p.legs as { listingId: string; slot: string; travelFromPrevMin: number }[]).map((leg, i) => {
            const l = listingById(leg.listingId)!;
            return (
              <li key={leg.listingId} className="flex items-center gap-3 rounded-hm-control bg-hm-surface p-2.5">
                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-hm-primary text-hm-caption font-semibold text-white">{i + 1}</span>
                <span className="grid"><span className="text-hm-compact font-medium">{leg.slot.replace("Sat", "Sat").replace(/^(\w+) /, "$1 · ")} · {localityById(l.localityId).name}</span><span className="text-hm-caption text-hm-muted">{l.title}{leg.travelFromPrevMin ? ` · ${leg.travelFromPrevMin} min from the last stop` : ""}</span></span>
              </li>
            );
          })}
        </ol>
      )}
      {event.action === "schedule_visits" && (
        <p className="mt-2 text-hm-caption text-hm-muted">{p.day as string}, {p.start as string} to {p.end as string}, travel included. Owners confirm after you approve.</p>
      )}
      {event.action === "share_shortlist" && (
        <div className="grid gap-2 text-hm-compact">
          <p>{(p.ids as string[]).length} finalists, shared with {(p.people as { name: string; role: string }[]).map((x) => `${x.name} (${x.role === "votes" ? "votes" : "view only"})`).join(" and ")}.</p>
          <p className="text-hm-caption text-hm-muted">They open a link (works from WhatsApp, no app needed). It expires in 7 days and shows only these homes, not your brief or messages.</p>
        </div>
      )}
      {event.action === "report_listing" && <p className="text-hm-compact">Report as <strong className="font-medium">{p.reason as string}</strong>. The verification team reviews it within a day, and it leaves your shortlist.</p>}
      <div className="mt-3 flex flex-wrap gap-2">
        {state === "approved" ? <Chip tone="ok">Approved</Chip> : state === "dismissed" ? <Chip>Not sent</Chip> : (
          <>
            <Button onClick={() => onApprove(event.action, event.action === "send_owner_message" ? { ...p, drafts } : p, event.summary)}>
              {event.action === "share_shortlist" ? <Share2 size={16} /> : event.action === "schedule_visits" ? <CalendarCheck size={16} /> : event.action === "report_listing" ? <Flag size={16} /> : null}{event.summary}
            </Button>
            {event.action === "send_owner_message" && <Button kind="secondary" onClick={() => setEditing((e) => !e)}><Pencil size={15} />{editing ? "Done editing" : "Edit"}</Button>}
            <Button kind="quiet" onClick={onDismiss}>Not now</Button>
          </>
        )}
      </div>
    </Card>
  );
}

/* ── tasks, replies, visits, sharing, votes ───────────────────── */
export function arrivedReplies(task: Task, now: number) {
  return (task.replies ?? []).filter((r) => r.replyInMin !== null && (task.revealed || (now - task.createdAt) / 60000 >= r.replyInMin));
}

export function TaskCard({ task, now, onReveal, onStop }: { task: Task; now: number; onReveal?: () => void; onStop?: () => void }) {
  if (task.kind === "ask") {
    const total = task.replies?.length ?? 0, got = arrivedReplies(task, now).length;
    const done = got === total || task.stopped;
    return (
      <Card className="p-3">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-hm-compact font-medium">{task.stopped ? "Stopped: " : ""}{task.title}</p>
            <p className="text-hm-caption text-hm-muted">{got} of {total} replied{!done ? " · waiting" : ""}</p>
          </div>
          {!done && onStop && <Button kind="quiet" onClick={onStop} ariaLabel="Stop task" className="min-h-9 px-2"><Square size={14} />Stop</Button>}
        </div>
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-hm-surface" role="progressbar" aria-valuemin={0} aria-valuemax={total} aria-valuenow={got} aria-label="Replies received"><div className="h-full rounded-full bg-hm-primary" style={{ width: `${total ? (got / total) * 100 : 0}%` }} /></div>
        {!done && onReveal && <button type="button" onClick={onReveal} className="mt-2 inline-flex min-h-8 items-center gap-1 text-hm-caption text-hm-primary underline-offset-2 hover:underline"><FastForward size={13} />Prototype: simulate replies now</button>}
      </Card>
    );
  }
  if (task.kind === "visits") {
    return (
      <Card className="p-3">
        <p className="text-hm-compact font-medium">{task.title}</p>
        <ul className="mt-1 grid gap-1">
          {task.visits!.map((v) => (
            <li key={v.listingId} className="flex items-center gap-2 text-hm-caption">
              <StatusIcon state={v.status === "confirmed" ? "pass" : "warn"} size={14} />
              {localityById(listingById(v.listingId)!.localityId).name} · {v.status === "confirmed" ? v.slot : `${v.slot} declined; owner offered ${v.alternative}`}
            </li>
          ))}
        </ul>
      </Card>
    );
  }
  return <Card className="p-3"><p className="text-hm-compact font-medium">{task.title}</p><p className="text-hm-caption text-hm-muted">Daily digest at 8 am · cancel any time</p></Card>;
}

export function RepliesView({ data }: { data: { arrived: OwnerReply[]; waiting: number } }) {
  return (
    <ul className="grid gap-2">
      {data.arrived.map((r) => {
        const l = listingById(r.listingId)!;
        return (
          <li key={r.listingId}><Card className="p-3">
            <p className="text-hm-compact font-medium">{localityById(l.localityId).name} · {r.owner}</p>
            <ul className="mt-1 grid gap-0.5 text-hm-caption">{r.answers.map((a) => <li key={a.question}><span className="text-hm-muted">{a.question === "available" ? "Available?" : a.question}</span> {a.answer}</li>)}</ul>
          </Card></li>
        );
      })}
      {data.waiting > 0 && <li className="text-hm-caption text-hm-muted">{data.waiting} still waiting</li>}
    </ul>
  );
}

export function ShareResult({ data, origin }: { data: { token: string; people: { name: string }[]; expiresDays: number }; origin: string }) {
  const href = `/hosamane/share/${data.token}`;
  return (
    <Card className="p-3">
      <Label className="mb-1">Share link</Label>
      <a href={href} target="_blank" rel="noopener noreferrer" className="break-all text-hm-compact text-hm-primary underline">{origin}{href.slice(0, 32)}…</a>
      <p className="mt-1 text-hm-caption text-hm-muted">For {data.people.map((p) => p.name).join(", ")} · expires in {data.expiresDays} days · opens without an app</p>
    </Card>
  );
}

export function VotesView({ data }: { data: { tally: Record<string, string[]>; agreed: string | null } }) {
  return (
    <ul className="grid gap-1.5">
      {Object.entries(data.tally).map(([id, who]) => (
        <li key={id}><Card className="flex items-center justify-between gap-2 p-3"><span className="text-hm-compact">{localityById(listingById(id)!.localityId).name} · {listingById(id)!.title}</span><Chip tone={id === data.agreed ? "ok" : "plain"}>{who.join(", ")}</Chip></Card></li>
      ))}
    </ul>
  );
}

export function RecommendationView({ data }: { data: { perListing: { listingId: string; pros: string[]; cons: string[]; warns: string[]; matches: string; votes: number }[]; recommendation: { listingId: string } | null } }) {
  return (
    <div className="grid gap-2">
      {data.perListing.map((p) => {
        const l = listingById(p.listingId)!;
        const best = data.recommendation?.listingId === p.listingId;
        return (
          <Card key={p.listingId} className={`p-3 ${best ? "ring-2 ring-hm-primary" : ""}`}>
            <div className="flex items-center justify-between gap-2"><p className="text-hm-compact font-medium">{localityById(l.localityId).name} · {l.title}</p>{best && <Chip tone="primary">My pick</Chip>}</div>
            <p className="mt-1 text-hm-caption text-hm-muted">Matches {p.matches} · {p.votes} vote{p.votes === 1 ? "" : "s"}</p>
            <div className="mt-1 flex flex-wrap gap-1">{p.pros.map((x) => <Chip key={x} tone="ok">{x}</Chip>)}{p.cons.map((x) => <Chip key={x}>{x}</Chip>)}{p.warns.map((x) => <Chip key={x} tone="warn">{x[0].toUpperCase() + x.slice(1)}</Chip>)}</div>
          </Card>
        );
      })}
    </div>
  );
}

export function RefusalCard({ event }: { event: Extract<AgentEvent, { t: "refusal" }> }) {
  return (
    <Card className="flex gap-3 border-l-4 border-l-hm-danger p-4">
      <Ban size={18} className="mt-0.5 shrink-0 text-hm-danger" aria-hidden="true" />
      <div className="grid gap-1">
        <p className="text-hm-compact font-medium">{event.rule}</p>
        <p className="text-hm-compact text-hm-muted">{event.reason}</p>
        <p className="text-hm-compact">{event.instead}</p>
      </div>
    </Card>
  );
}

export function WatchView({ data, onOpen }: { data: { schedule: string; firstMatch: { id: string; commuteMin: number | null } | null }; onOpen?: (id: string) => void }) {
  if (!data.firstMatch) return null;
  const r = { id: data.firstMatch.id, matches: 0, of: 0, misses: [], flags: [], toAsk: [], commuteMin: data.firstMatch.commuteMin };
  return <div className="grid gap-1"><Label>New match</Label><ListingCard r={{ ...r, matches: 1, of: 1 }} onOpen={onOpen} /></div>;
}
