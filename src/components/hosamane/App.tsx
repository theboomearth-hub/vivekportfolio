"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Bell, BookOpen, History, Info, LayoutGrid, Lock, MessageSquareText, Send, Trash2, UserRound, X } from "lucide-react";
import { listingById, localityById } from "@/lib/hosamane/data";
import type { AgentEvent, Memory, Task } from "@/lib/hosamane/types";
import { useAgent, type Turn } from "./useAgent";
import { AgentMark, Button, Card, Chip, Label, Logo } from "./ui";
import * as V from "./views";

type View = "agent" | "board" | "activity" | "you";
const NAV: { id: View; label: string; Icon: typeof LayoutGrid }[] = [
  { id: "agent", label: "Agent", Icon: MessageSquareText },
  { id: "board", label: "Board", Icon: LayoutGrid },
  { id: "activity", label: "Activity", Icon: History },
  { id: "you", label: "You", Icon: UserRound },
];
const STARTERS = ["Rent a 2BHK near my office", "Buy my first home", "What will moving in really cost?"];

export default function App() {
  const a = useAgent();
  const [view, setView] = useState<View>("agent");
  const [sheet, setSheet] = useState(false); // tablet: board as a side sheet

  useEffect(() => {
    const theme = new URLSearchParams(location.search).get("theme");
    if (theme === "wire") document.documentElement.dataset.theme = "wire";
  }, []);

  const active = a.memory.tasks.filter((t) => !t.stopped && t.kind === "ask" && V.arrivedReplies(t, a.now).length < (t.replies?.length ?? 0)).length;
  const latest = useMemo(() => latestResults(a.turns), [a.turns]);
  const openListing = (id: string) => {
    const l = listingById(id)!;
    setView("agent"); setSheet(false);
    a.send(`Open ${id}`, { shown: `Open the ${localityById(l.localityId).name} home` });
  };
  const reveal = () => { setView("agent"); setSheet(false); a.send("What did the owners say?", { revealAll: true }); };

  const board = <Board memory={a.memory} latest={latest} now={a.now} onOpen={openListing} onReveal={reveal} onStop={a.stopTask} onRemove={a.removeBriefItem} />;

  return (
    <div className="flex h-dvh overflow-hidden">
      {/* Rail (tablet) and sidebar (desktop) */}
      <nav aria-label="Main" className="hidden shrink-0 flex-col border-r border-hm-line bg-hm-card md:flex md:w-[84px] xl:w-[232px]">
        <div className="flex h-16 items-center px-5 xl:px-5"><span className="xl:hidden"><Logo compact /></span><span className="hidden xl:inline"><Logo /></span></div>
        <ul className="grid gap-1 px-3">
          {NAV.map(({ id, label, Icon }) => {
            const isBoard = id === "board";
            const current = isBoard ? sheet : view === id;
            return (
              <li key={id} className={isBoard ? "lg:hidden" : ""}>
                <button type="button" aria-current={current ? "page" : undefined} onClick={() => (isBoard ? setSheet((s) => !s) : (setView(id), setSheet(false)))} className={`relative flex min-h-12 w-full flex-col items-center justify-center gap-0.5 rounded-hm-control text-hm-label xl:flex-row xl:justify-start xl:gap-3 xl:px-3 xl:text-hm-compact ${current ? "bg-hm-primary-soft font-medium text-hm-primary-strong" : "text-hm-muted hover:bg-hm-surface"}`}>
                  <Icon size={20} />{label}
                  {isBoard && active > 0 && <span className="absolute top-1.5 right-3 grid h-4 min-w-4 place-items-center rounded-full bg-hm-primary px-1 text-[10px] font-semibold text-white xl:static">{active}</span>}
                </button>
              </li>
            );
          })}
        </ul>
        <div className="mt-auto grid gap-3 p-3 xl:p-5">
          <p className="hidden text-hm-label leading-relaxed text-hm-muted xl:block">Prototype. Listings, owners and builders are fictional; owners&apos; replies are simulated.</p>
          <Link href="/work/hosamane" className="flex min-h-12 flex-col items-center justify-center gap-0.5 rounded-hm-control text-hm-label text-hm-muted hover:bg-hm-surface hover:text-hm-ink xl:min-h-10 xl:flex-row xl:justify-start xl:gap-2 xl:px-3 xl:text-hm-caption">
            <BookOpen size={18} aria-hidden="true" />Case study
          </Link>
        </div>
      </nav>

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Phone and tablet header */}
        <header className="flex h-14 shrink-0 items-center justify-between border-b border-hm-line bg-hm-card px-4 lg:hidden">
          <span className="md:hidden"><Logo /></span>
          <span className="hidden text-hm-compact font-medium md:inline">{NAV.find((n) => n.id === view)!.label}</span>
          {view === "agent" && (
            <button type="button" onClick={() => (window.matchMedia("(min-width: 768px)").matches ? setSheet(true) : setView("board"))} className="inline-flex min-h-10 items-center gap-2 rounded-full bg-hm-surface px-3 text-hm-caption ring-1 ring-hm-line">
              <LayoutGrid size={16} />Board{active ? ` · ${active} running` : a.memory.shortlist.length ? ` · ${a.memory.shortlist.length}` : ""}
            </button>
          )}
        </header>

        <div id="main" className="flex min-h-0 flex-1">
          <section aria-label={NAV.find((n) => n.id === view)!.label} className="flex min-w-0 flex-1 flex-col">
            {view === "agent" && <Chat a={a} onOpen={openListing} />}
            {view === "board" && <div className="min-h-0 flex-1 overflow-y-auto">{board}</div>}
            {view === "activity" && <Activity entries={a.activity} />}
            {view === "you" && <You memory={a.memory} onRemove={a.removeBriefItem} onReset={a.reset} />}
          </section>
          {/* Landscape tablet and desktop: board beside the chat */}
          <aside aria-label="Board" className="hidden min-h-0 shrink-0 overflow-y-auto border-l border-hm-line bg-hm-card lg:block lg:w-[380px] xl:w-[420px]">{board}</aside>
        </div>

        {/* Phone bottom bar */}
        <nav aria-label="Main" className="grid shrink-0 grid-cols-4 border-t border-hm-line bg-hm-card md:hidden">
          {NAV.map(({ id, label, Icon }) => (
            <button key={id} type="button" aria-current={view === id ? "page" : undefined} onClick={() => setView(id)} className={`relative flex min-h-14 flex-col items-center justify-center gap-0.5 text-hm-label ${view === id ? "font-medium text-hm-primary" : "text-hm-muted"}`}>
              <Icon size={20} />{label}
              {id === "board" && active > 0 && <span className="absolute top-2 right-[calc(50%-18px)] grid h-4 min-w-4 place-items-center rounded-full bg-hm-primary px-1 text-[10px] font-semibold text-white">{active}</span>}
            </button>
          ))}
        </nav>
      </div>

      {/* Tablet side sheet */}
      {sheet && (
        <div className="fixed inset-0 z-40 hidden md:block lg:hidden" role="dialog" aria-modal="true" aria-label="Board">
          <button type="button" aria-label="Close board" className="absolute inset-0 bg-hm-ink/30" onClick={() => setSheet(false)} />
          <div className="absolute inset-y-0 right-0 w-[400px] overflow-y-auto bg-hm-card shadow-[0_12px_32px_-12px_rgb(21_24_27/0.25)]">
            <div className="flex items-center justify-between border-b border-hm-line p-3"><span className="text-hm-compact font-medium">Board</span><button type="button" aria-label="Close board" onClick={() => setSheet(false)} className="grid h-10 w-10 place-items-center rounded-hm-control hover:bg-hm-surface"><X size={18} /></button></div>
            {board}
          </div>
        </div>
      )}
    </div>
  );
}

function latestResults(turns: Turn[]) {
  const out: Record<string, unknown> = {};
  for (const t of turns) for (const e of t.events) if (e.t === "result") out[e.name] = e.data;
  return out;
}

/* ── chat ─────────────────────────────────────────────────────── */
function Chat({ a, onOpen }: { a: ReturnType<typeof useAgent>; onOpen: (id: string) => void }) {
  const [text, setText] = useState("");
  const end = useRef<HTMLDivElement>(null);
  useEffect(() => { end.current?.scrollIntoView({ block: "end" }); }, [a.turns]);
  const submit = (t: string) => { if (!t.trim() || a.busy) return; a.send(t.trim()); setText(""); };
  const last = a.turns[a.turns.length - 1];

  return (
    <>
      <div className="min-h-0 flex-1 overflow-y-auto scroll-thin" aria-live="polite" data-scroll="chat">
        <div className="mx-auto grid max-w-[760px] gap-5 px-4 py-6 md:px-8">
          {!a.turns.length && (
            <div className="grid gap-4 pt-[6vh]">
              <span className="text-hm-primary"><AgentMark size={36} /></span>
              <h1 className="text-[26px] leading-[1.15] font-medium tracking-[-0.02em] md:text-[30px]">What are you looking for?</h1>
              <p className="max-w-[52ch] text-hm-muted">Tell me about your move: where you&apos;ll travel to, your budget, and what you can&apos;t live without. I&apos;ll do the searching and checking, and ask before I contact anyone.</p>
              <ul className="flex flex-wrap gap-2">{STARTERS.map((s) => <li key={s}><Chip onClick={() => setText(s === STARTERS[0] ? "2BHK for me and a flatmate, under 40 min to Bellandur at 9 am, budget ₹45k, we have a cat, no brokers" : s === STARTERS[1] ? "We want to buy a ready 3BHK near Sarjapur Road under ₹2.4 Cr, down payment ₹40 lakh" : s)}>{s}</Chip></li>)}</ul>
              <p className="flex items-start gap-2 text-hm-caption text-hm-muted"><Info size={14} className="mt-0.5 shrink-0" />Prototype: listings, owners and builders are fictional, and owners&apos; replies are simulated.</p>
            </div>
          )}
          {a.turns.map((t) => <TurnView key={t.id} t={t} a={a} isLast={t === last} onOpen={onOpen} />)}
          <div ref={end} />
        </div>
      </div>
      <form onSubmit={(e) => { e.preventDefault(); submit(text); }} className="shrink-0 border-t border-hm-line bg-hm-canvas px-4 py-3 md:px-8">
        <div className="mx-auto flex max-w-[760px] items-end gap-2 rounded-[16px] bg-hm-card p-1.5 ring-1 ring-hm-control focus-within:ring-2 focus-within:ring-hm-primary">
          <label htmlFor="composer" className="sr-only">Message the agent</label>
          <textarea id="composer" value={text} onChange={(e) => setText(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); submit(text); } }} rows={1} placeholder="Ask me anything about your move…" className="max-h-40 min-h-11 flex-1 resize-none bg-transparent px-3 py-2.5 text-hm-compact outline-none" />
          <Button type="submit" disabled={!text.trim() || a.busy} ariaLabel="Send" className="h-11 w-11 shrink-0 px-0"><Send size={18} /></Button>
        </div>
      </form>
    </>
  );
}

function TurnView({ t, a, isLast, onOpen }: { t: Turn; a: ReturnType<typeof useAgent>; isLast: boolean; onOpen: (id: string) => void }) {
  if (t.role === "user") return <p className="ml-auto max-w-[85%] rounded-[16px] rounded-br-[6px] bg-hm-primary px-4 py-2.5 text-hm-compact text-white">{t.text}</p>;
  const results: Record<string, unknown> = {};
  for (const e of t.events) if (e.t === "result") results[e.name] = e.data;
  const texts = t.events.filter((e): e is Extract<AgentEvent, { t: "text" }> => e.t === "text");
  const ask = t.events.find((e): e is Extract<AgentEvent, { t: "ask" }> => e.t === "ask");
  const approval = t.events.find((e): e is Extract<AgentEvent, { t: "approval" }> => e.t === "approval");
  const refusal = t.events.find((e): e is Extract<AgentEvent, { t: "refusal" }> => e.t === "refusal");
  const suggest = t.events.find((e): e is Extract<AgentEvent, { t: "suggest" }> => e.t === "suggest");
  const task = (r: unknown) => { const id = (r as { task?: Task })?.task?.id; return a.memory.tasks.find((x) => x.id === id) ?? (r as { task?: Task })?.task; };

  return (
    <div className="grid grid-cols-[28px_minmax(0,1fr)] gap-3" data-turn="agent">
      <span className="mt-0.5 grid h-7 w-7 place-items-center rounded-full bg-hm-primary-soft text-hm-primary"><AgentMark size={17} /></span>
      <div className="grid min-w-0 gap-3">
        <V.ToolSteps events={t.events} pending={t.pending} />
        {refusal && <V.RefusalCard event={refusal} />}
        {texts.map((x, i) => <p key={i} className="text-[16px] leading-relaxed">{x.text}</p>)}
        {results.get_listing ? <V.ListingView results={results} /> : (
          <>
            {!!results.search_listings && <V.ShortlistView data={results.search_listings as never} memory={a.memory} onOpen={onOpen} />}
            {!!results.estimate_move_in_cost && <Card className="p-4"><V.CostCard data={results.estimate_move_in_cost as never} mode="rent" /></Card>}
            {!!results.estimate_purchase_cost && <Card className="p-4"><V.CostCard data={results.estimate_purchase_cost as never} mode="buy" /></Card>}
            {!!results.get_commute && <Card className="p-4"><V.CommuteCard data={results.get_commute as never} /></Card>}
            {!!results.get_neighbourhood && <Card className="p-4"><V.AreaFacts data={results.get_neighbourhood as never} /></Card>}
          </>
        )}
        {!!results.update_brief && !results.search_listings && !ask && <V.BriefChips brief={results.update_brief as never} />}
        {!!results.compare_listings && <V.CompareView data={results.compare_listings as never} />}
        {!!results.owner_replies && <V.RepliesView data={results.owner_replies as never} />}
        {(results.send_owner_message as { ok?: boolean })?.ok && <V.TaskCard task={task(results.send_owner_message)!} now={a.now} onReveal={() => a.send("What did the owners say?", { revealAll: true })} onStop={() => a.stopTask(task(results.send_owner_message)!.id)} />}
        {(results.schedule_visits as { ok?: boolean })?.ok && <V.TaskCard task={task(results.schedule_visits)!} now={a.now} />}
        {(results.share_shortlist as { ok?: boolean })?.ok && <V.ShareResult data={results.share_shortlist as never} origin={typeof location !== "undefined" ? location.origin : ""} />}
        {!!results.collect_votes && <V.VotesView data={results.collect_votes as never} />}
        {!!results.watch_search && <V.WatchView data={results.watch_search as never} onOpen={onOpen} />}
        {!!results.summarise_visit_notes && <V.RecommendationView data={results.summarise_visit_notes as never} />}
        {ask && (
          <div className="grid gap-2">
            <p className="text-[16px]">{ask.question}</p>
            <div className="flex flex-wrap gap-2">{ask.options.map((o) => <Chip key={o.value} tone="primary" onClick={isLast && !a.busy ? () => a.answer(ask.field, o.value, o.label) : undefined}>{o.label}</Chip>)}</div>
          </div>
        )}
        {approval && <V.ApprovalCard event={approval} state={t.approvalState} onApprove={(action, payload, label) => a.approve(t.id, action, payload, label)} onDismiss={() => a.dismiss(t.id)} />}
        {isLast && !t.pending && suggest && <div className="flex flex-wrap gap-2">{suggest.options.map((s) => <Chip key={s} onClick={() => a.send(s)}>{s}</Chip>)}</div>}
      </div>
    </div>
  );
}

/* ── board ────────────────────────────────────────────────────── */
function Board({ memory, latest, now, onOpen, onReveal, onStop, onRemove }: { memory: Memory; latest: Record<string, unknown>; now: number; onOpen: (id: string) => void; onReveal: () => void; onStop: (id: string) => void; onRemove: (f: string, v?: string) => void }) {
  const [tab, setTab] = useState<"shortlist" | "tasks" | "decide">("shortlist");
  const search = latest.search_listings as { results: { id: string; matches: number; of: number; misses: string[]; flags: string[]; toAsk: string[]; commuteMin: number | null }[] } | undefined;
  const cards = memory.shortlist.map((id) => search?.results.find((r) => r.id === id) ?? { id, matches: 0, of: 0, misses: [], flags: [], toAsk: [], commuteMin: null });
  const tasks = memory.tasks;
  const votes = latest.collect_votes as { tally: Record<string, string[]>; agreed: string | null } | undefined;
  const rec = latest.summarise_visit_notes as Parameters<typeof V.RecommendationView>[0]["data"] | undefined;
  return (
    <div className="grid gap-4 p-4">
      <div>
        <Label className="mb-2">Your brief</Label>
        {V.briefItems(memory.brief).length ? <V.BriefChips brief={memory.brief} onRemove={onRemove} /> : <p className="text-hm-caption text-hm-muted">Your brief fills in as you talk to the agent.</p>}
      </div>
      <div role="tablist" aria-label="Board" className="grid grid-cols-3 rounded-hm-control bg-hm-surface p-0.5 ring-1 ring-hm-line">
        {([["shortlist", `Shortlist${memory.shortlist.length ? ` · ${memory.shortlist.length}` : ""}`], ["tasks", `Tasks${tasks.length ? ` · ${tasks.length}` : ""}`], ["decide", "Decide"]] as const).map(([id, label]) => (
          <button key={id} role="tab" type="button" aria-selected={tab === id} onClick={() => setTab(id)} className={`min-h-10 rounded-[8px] text-hm-caption ${tab === id ? "bg-hm-card font-medium shadow-[0_0_0_1px_var(--color-hm-line)]" : "text-hm-muted"}`}>{label}</button>
        ))}
      </div>
      {tab === "shortlist" && (
        <div className="grid gap-2.5" role="tabpanel">
          {!cards.length && <p className="text-hm-caption text-hm-muted">Nothing on your board yet. Start with the agent, and your shortlist and tasks will collect here.</p>}
          {cards.map((r) => <V.ListingCard key={r.id} r={r} onOpen={onOpen} />)}
          {memory.removed.length > 0 && (<><Label className="mt-2">Out of the running</Label>{memory.removed.map((x) => <V.ListingCard key={x.id} r={{ id: x.id, matches: 0, of: 0, misses: [], flags: [], toAsk: [], commuteMin: null }} removed={x.reason} />)}</>)}
        </div>
      )}
      {tab === "tasks" && (
        <div className="grid gap-2.5" role="tabpanel">
          {!tasks.length && <p className="text-hm-caption text-hm-muted">When the agent works for you (asking owners, booking visits, watching for new homes), the tasks show here with their progress.</p>}
          {tasks.map((t) => <V.TaskCard key={t.id} task={t} now={now} onReveal={t.kind === "ask" ? onReveal : undefined} onStop={t.kind === "ask" ? () => onStop(t.id) : undefined} />)}
        </div>
      )}
      {tab === "decide" && (
        <div className="grid gap-3" role="tabpanel">
          {memory.shareToken ? <Card className="p-3"><p className="text-hm-compact font-medium">Shared with your people</p><a href={`/hosamane/share/${memory.shareToken}`} target="_blank" rel="noopener noreferrer" className="text-hm-caption text-hm-primary underline">Open the co-decider view</a></Card> : <p className="text-hm-caption text-hm-muted">Share your finalists to collect votes. Ask the agent: “Share the finalists with Priya”.</p>}
          {votes && Object.keys(votes.tally).length > 0 && <><Label>Votes</Label><V.VotesView data={votes} /></>}
          {rec && <><Label>Recommendation</Label><V.RecommendationView data={rec} /></>}
        </div>
      )}
    </div>
  );
}

/* ── activity ─────────────────────────────────────────────────── */
function Activity({ entries }: { entries: { at: number; action: string; detail: string; tool: string }[] }) {
  return (
    <div className="min-h-0 flex-1 overflow-y-auto">
      <div className="mx-auto grid max-w-[760px] gap-3 px-4 py-6 md:px-8">
        <h1 className="text-[22px] font-medium">Everything I did for you</h1>
        <p className="text-hm-compact text-hm-muted">Each action shows when it happened and what changed. Nothing here contacted anyone without your approval.</p>
        {!entries.length && <p className="text-hm-caption text-hm-muted">When I do something for you, it shows here with the time and what changed.</p>}
        <ol className="grid gap-2">
          {entries.map((e, i) => (
            <li key={i}><Card className="grid grid-cols-[64px_minmax(0,1fr)] gap-3 p-3">
              <time className="text-hm-caption text-hm-muted tabular-nums">{new Date(e.at).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}</time>
              <span><span className="block text-hm-compact font-medium">{e.action}</span><span className="block text-hm-caption text-hm-muted">{e.detail}</span>{e.tool !== "—" && <code className="mt-1 inline-block rounded bg-hm-surface px-1.5 text-hm-label text-hm-muted">{e.tool}</code>}</span>
            </Card></li>
          ))}
        </ol>
      </div>
    </div>
  );
}

/* ── you: brief, permissions, data ────────────────────────────── */
function You({ memory, onRemove, onReset }: { memory: Memory; onRemove: (f: string, v?: string) => void; onReset: () => void }) {
  const ladder = [
    ["Search, rank, check, work out costs and commutes", "Always on", "Inform"],
    ["Draft questions to owners; propose visit plans", "Always on", "Prepare"],
    ["Send messages, book visits, share your shortlist", "Asks you every time", "Act with approval"],
    ["Watch for new homes and send a digest", "Only if you set it up", "Standing permission"],
  ];
  return (
    <div className="min-h-0 flex-1 overflow-y-auto">
      <div className="mx-auto grid max-w-[760px] gap-6 px-4 py-6 md:px-8">
        <section className="grid gap-2"><h1 className="text-[22px] font-medium">Your brief</h1><p className="text-hm-compact text-hm-muted">I use this for every search. Tap anything to remove it; dashed ones are my assumptions.</p>{V.briefItems(memory.brief).length ? <V.BriefChips brief={memory.brief} onRemove={onRemove} /> : <p className="text-hm-caption text-hm-muted">Empty for now.</p>}</section>
        <section className="grid gap-2">
          <h2 className="text-[17px] font-medium">What the agent may do</h2>
          <Card className="divide-y divide-hm-line">{ladder.map(([what, when, level]) => <div key={what} className="flex items-start justify-between gap-3 p-3"><span className="text-hm-compact">{what}<span className="block text-hm-label text-hm-muted">{level}</span></span><Chip tone={when.startsWith("Asks") ? "primary" : "plain"}>{when}</Chip></div>)}</Card>
          <Card className="p-3"><p className="flex items-center gap-2 text-hm-compact font-medium"><Lock size={16} className="text-hm-danger" />Never, whatever you say</p><ul className="mt-1 grid gap-1 text-hm-compact text-hm-muted"><li>Pay or sign anything</li><li>Share your ID documents or phone number without your explicit consent</li><li>Filter by religion, caste, diet or marital status</li></ul></Card>
        </section>
        <section className="grid gap-2"><h2 className="text-[17px] font-medium">Alerts</h2><p className="flex items-center gap-2 text-hm-compact text-hm-muted"><Bell size={16} />{memory.tasks.some((t) => t.kind === "watch") ? "Daily digest at 8 am is on." : "No alerts set. Ask the agent to watch your search."}</p></section>
        <section className="grid gap-2"><h2 className="text-[17px] font-medium">Your data</h2><p className="text-hm-compact text-hm-muted">This prototype keeps your session in this browser tab only. Owners never see your name or number.</p><div><Button kind="danger" onClick={onReset}><Trash2 size={16} />Forget everything</Button></div></section>
        <section className="grid gap-2">
          <h2 className="text-[17px] font-medium">About Hosamane</h2>
          <p className="text-hm-compact text-hm-muted">A design prototype by Vivekanand Choudhari: the research, agent design and tests behind it are in the case study.</p>
          <div className="flex flex-wrap gap-2">
            <Link href="/work/hosamane" className="inline-flex min-h-11 items-center gap-2 rounded-hm-control bg-hm-card px-4 text-hm-compact font-medium text-hm-ink ring-1 ring-hm-control ring-inset hover:bg-hm-surface"><BookOpen size={16} aria-hidden="true" />Read the case study</Link>
            <Link href="/" className="inline-flex min-h-11 items-center gap-1.5 rounded-hm-control px-3 text-hm-compact font-medium text-hm-primary hover:bg-hm-primary-soft">Portfolio<ArrowUpRight size={16} aria-hidden="true" /></Link>
          </div>
        </section>
        <p className="text-hm-label text-hm-muted">Photos: Unsplash licence, credits in /hosamane/photos/credits.json. All listings, owners and builders are fictional; prices follow Anarock&apos;s Q2 2026 ranges where published.</p>
      </div>
    </div>
  );
}
