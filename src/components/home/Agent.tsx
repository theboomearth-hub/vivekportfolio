"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useEffectEvent,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { useReducedMotion } from "framer-motion";
import { anchors, roles, type RoleKey } from "@/lib/home";
import { CONTACT_EMAIL } from "@/lib/site";
import {
  GREETING,
  SUGGESTIONS,
  nextOptions,
  replyFor,
  routeIntent,
  slotEmailReply,
  tailorReply,
  type AgentAction,
  type AgentCard,
  type Reply,
  type Source,
} from "@/lib/agent/script";
import s from "./home.module.css";

/* ───────────────────────── context ───────────────────────── */

type Message =
  | { id: number; from: "user"; text: string }
  /** `settled` turns (the greeting) render at once and don't hold the busy lock. */
  | { id: number; from: "agent"; reply: Reply; settled?: boolean };

const greeting = (id: number): Message => ({
  id,
  from: "agent",
  reply: { steps: [], text: GREETING },
  settled: true,
});

interface AgentState {
  open: boolean;
  openAgent: () => void;
  closeAgent: () => void;
  /** Open the panel and ask (used by the hero prompt, chips and inline buttons). */
  ask: (text: string) => void;
  busy: boolean;
  role: RoleKey | null;
  clearRole: () => void;
}

const AgentContext = createContext<AgentState | null>(null);

const noopSubscribe = () => () => {};

export function useAgent() {
  const ctx = useContext(AgentContext);
  if (!ctx) throw new Error("useAgent must be used inside <AgentProvider>");
  return ctx;
}

const TOUR = [
  {
    id: anchors.heroTitle,
    text: "Start here: the one-line thesis. Everything below backs it up.",
  },
  {
    id: anchors.flagship,
    text: "The flagship: MW-Inventory, an agent he designed and built that runs a DOOH campaign from search to debrief.",
  },
  {
    id: anchors.processSteps,
    text: "How he works: four phases, each with a gate before moving on.",
  },
  {
    id: anchors.contactTitle,
    text: "If it’s a fit, email him or copy the address. He replies within 24 hours.",
  },
];

/* ───────────────────────── provider ───────────────────────── */

export function AgentProvider({ children }: { children: ReactNode }) {
  const reduce = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [busy, setBusy] = useState(false);
  const [role, setRole] = useState<RoleKey | null>(null);
  const [tourStop, setTourStop] = useState<number | null>(null);
  const [notice, setNotice] = useState("");
  const [heroOut, setHeroOut] = useState(false);
  const [footerIn, setFooterIn] = useState(false);
  const nextId = useRef(0);
  const lastFocus = useRef<HTMLElement | null>(null);
  const tourNextRef = useRef<HTMLButtonElement>(null);
  const noticeTimer = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );
  // A copy of the conversation for building the model's history; read in handlers, never during render.
  const messagesRef = useRef<Message[]>([]);
  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  const notify = useCallback((msg: string) => {
    setNotice(msg);
    clearTimeout(noticeTimer.current);
    noticeTimer.current = setTimeout(() => setNotice(""), 2000);
  }, []);

  const openAgent = useCallback(() => {
    if (!open) lastFocus.current = document.activeElement as HTMLElement | null;
    setOpen(true);
    setMessages((ms) => (ms.length ? ms : [greeting(++nextId.current)]));
  }, [open]);

  const closeAgent = useCallback((restoreFocus = true) => {
    setOpen(false);
    // After the re-render, so a trigger that was hidden while open (the dock) is focusable again.
    setTimeout(() => {
      const el = lastFocus.current;
      if (restoreFocus && el && document.contains(el))
        el.focus({ preventScroll: true });
    }, 0);
  }, []);

  // One turn at a time: the visitor's message, then the agent's reply.
  const converse = useCallback(
    (userText: string | null, reply: Reply) => {
      if (busy) return;
      setBusy(true);
      setMessages((ms) => {
        const out = ms.length ? [...ms] : [greeting(++nextId.current)];
        if (userText)
          out.push({ id: ++nextId.current, from: "user", text: userText });
        out.push({ id: ++nextId.current, from: "agent", reply });
        return out;
      });
    },
    [busy],
  );

  // Questions go to Claude (/api/agent), grounded in this site, with the script as the fallback: no key, a limit,
  // an error or a refusal all end in the scripted reply. Anything that acts on the page (tour, tailoring, drafts,
  // time slots) stays scripted, so the model never drives the page.
  const respond = useCallback(
    async (userText: string) => {
      if (busy) return;
      const routed = routeIntent(userText, role);
      if (routed?.act) {
        converse(userText, routed.reply);
        return;
      }
      setBusy(true);
      const pendingId = ++nextId.current;
      const history = messagesRef.current
        .filter((m) => m.from === "user" || (!m.settled && !m.reply.pending))
        .slice(-6)
        .map((m) =>
          m.from === "user"
            ? { role: "user", text: m.text }
            : { role: "agent", text: [m.reply.text, ...(m.reply.list ?? [])].filter(Boolean).join("\n") },
        );
      setMessages((ms) => {
        const out = ms.length ? [...ms] : [greeting(++nextId.current)];
        out.push({ id: ++nextId.current, from: "user", text: userText });
        out.push({ id: pendingId, from: "agent", reply: { steps: ["Reading this site"], pending: true } });
        return out;
      });
      let reply: Reply | null = null;
      try {
        const res = await fetch("/api/agent", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: userText, history, role }),
        });
        if (res.ok) {
          const data = (await res.json()) as { reply?: Reply; next?: string[] };
          if (data.reply) reply = { ...data.reply, ...(data.next?.length ? { options: nextOptions(data.next) } : {}) };
        }
      } catch {
        // Network trouble: the script answers below.
      }
      const final = reply ?? routed?.reply ?? replyFor(userText, role);
      setMessages((ms) => ms.map((m) => (m.id === pendingId ? { id: ++nextId.current, from: "agent", reply: final } : m)));
    },
    [busy, role, converse],
  );

  const ask = useCallback(
    (text: string) => {
      openAgent();
      respond(text);
    },
    [openAgent, respond],
  );

  const runAction = useCallback(
    (action: AgentAction) => {
      if (action.type === "ask") respond(action.text);
      else converse(roles[action.role].who, tailorReply(action.role));
    },
    [converse, respond],
  );

  const clearRole = useCallback(() => {
    setRole((r) => {
      if (r) notify("Page restored");
      return null;
    });
  }, [notify]);

  const startTour = useCallback(() => {
    closeAgent(false);
    setTourStop(0);
    setTimeout(() => tourNextRef.current?.focus({ preventScroll: true }), 80);
  }, [closeAgent]);

  const endTour = useCallback(() => {
    setTourStop(null);
    notify("Tour finished");
  }, [notify]);

  const pickSlot = useCallback(
    (mine: string, ist: string) =>
      converse(`${mine} works`, slotEmailReply(role, mine, ist)),
    [converse, role],
  );

  // Tour: scroll to the stop and outline it.
  useEffect(() => {
    if (tourStop === null) return;
    const el = document.getElementById(TOUR[tourStop].id);
    if (!el) return;
    el.classList.add(s.spot);
    const tall = el.offsetHeight > window.innerHeight * 0.55;
    el.scrollIntoView({
      behavior: reduce ? "auto" : "smooth",
      block: tall ? "start" : "center",
    });
    return () => el.classList.remove(s.spot);
  }, [tourStop, reduce]);

  // The dock shows between the hero prompt and the footer, never over either.
  useEffect(() => {
    const hero = document.getElementById(anchors.heroAsk);
    const footer = document.querySelector("footer");
    const observers: IntersectionObserver[] = [];
    if (hero) {
      const o = new IntersectionObserver(([e]) =>
        setHeroOut(!e.isIntersecting),
      );
      o.observe(hero);
      observers.push(o);
    }
    if (footer) {
      const o = new IntersectionObserver(([e]) =>
        setFooterIn(e.isIntersecting),
      );
      o.observe(footer);
      observers.push(o);
    }
    return () => observers.forEach((o) => o.disconnect());
  }, []);

  // ⌘K / Ctrl+K toggles the agent; Escape closes it or ends the tour.
  const onKeyDown = useEffectEvent((e: KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
      e.preventDefault();
      if (open) closeAgent();
      else openAgent();
      return;
    }
    if (e.key !== "Escape") return;
    if (open) closeAgent();
    else if (tourStop !== null) endTour();
  });
  useEffect(() => {
    const handler = (e: KeyboardEvent) => onKeyDown(e);
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  const value = useMemo<AgentState>(
    () => ({ open, openAgent, closeAgent, ask, busy, role, clearRole }),
    [open, openAgent, closeAgent, ask, busy, role, clearRole],
  );

  const isClient = useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );
  const showDock = heroOut && !footerIn && !open && tourStop === null;
  const tailored = role ? roles[role] : null;

  return (
    <AgentContext.Provider value={value}>
      {children}

      {/* Overlays render into <body>: the page-transition wrapper applies a transform,
          which would otherwise make these `position: fixed` layers scroll with the page. */}
      {isClient &&
        createPortal(
          <>
            {tailored && (
              <div className="fixed inset-x-0 top-[72px] z-40 border-y border-border bg-background text-sm text-muted">
                <div className="container-premium flex min-h-11 items-center justify-between gap-3">
                  <p className="flex items-center gap-2">
                    <Spark className="h-3.5 w-3.5 text-accent" />
                    <span>
                      Tailored for{" "}
                      <b className="font-medium text-foreground">
                        {tailored.label}
                      </b>{" "}
                      · {tailored.changes.length} changes highlighted
                    </span>
                  </p>
                  <button
                    type="button"
                    onClick={clearRole}
                    className="py-2.5 font-medium text-foreground underline underline-offset-4"
                  >
                    Undo
                  </button>
                </div>
              </div>
            )}

            {/* Stays mounted (hidden) so focus can return to it when the panel closes. */}
            <button
              type="button"
              hidden={!showDock}
              onClick={openAgent}
              className="fixed bottom-5 left-1/2 z-[75] inline-flex min-h-11 -translate-x-1/2 items-center gap-2.5 rounded-full bg-foreground py-0 pl-4 pr-2 text-sm font-medium text-background shadow-[0_12px_32px_-12px_rgb(15_15_16/0.35)] [&[hidden]]:hidden"
            >
              <Spark className="h-4 w-4" />
              Ask the agent
              <kbd
                aria-hidden="true"
                className="hidden rounded-[5px] px-1.5 py-1 font-mono text-xs leading-none ring-1 ring-background/35 ring-inset sm:inline"
              >
                ⌘K
              </kbd>
            </button>

            {tourStop !== null && (
              <div
                role="region"
                aria-label="Guided tour"
                className="fixed bottom-3 left-1/2 z-[76] flex w-[min(640px,calc(100vw-24px))] -translate-x-1/2 flex-wrap items-center gap-x-3.5 gap-y-2 rounded-[14px] bg-foreground py-2.5 pl-4 pr-2.5 text-background shadow-[0_16px_40px_-12px_rgb(15_15_16/0.4)] sm:bottom-5 sm:flex-nowrap"
              >
                <span className="whitespace-nowrap font-mono text-xs">
                  {tourStop + 1} / {TOUR.length}
                </span>
                <p
                  aria-live="polite"
                  className="order-2 basis-full text-sm leading-snug sm:order-none sm:flex-1 sm:basis-auto"
                >
                  {TOUR[tourStop].text}
                </p>
                <div className="order-3 ml-auto flex gap-1.5 sm:order-none sm:ml-0">
                  <button
                    type="button"
                    disabled={tourStop === 0}
                    onClick={() => setTourStop((n) => (n ? n - 1 : 0))}
                    className="min-h-9 rounded-lg px-3 text-sm ring-1 ring-background/35 ring-inset disabled:opacity-45 focus-visible:outline-background"
                  >
                    Back
                  </button>
                  <button
                    ref={tourNextRef}
                    type="button"
                    onClick={() =>
                      tourStop < TOUR.length - 1
                        ? setTourStop(tourStop + 1)
                        : endTour()
                    }
                    className="min-h-9 rounded-lg bg-background px-3 text-sm font-medium text-foreground focus-visible:outline-background"
                  >
                    {tourStop < TOUR.length - 1 ? "Next" : "Finish"}
                  </button>
                  <button
                    type="button"
                    onClick={endTour}
                    className="min-h-9 rounded-lg px-3 text-sm ring-1 ring-background/35 ring-inset focus-visible:outline-background"
                  >
                    End
                  </button>
                </div>
              </div>
            )}

            <AgentPanel
              open={open}
              onClose={() => closeAgent()}
              messages={messages}
              busy={busy}
              onSend={(text) => respond(text)}
              onTurnDone={() => setBusy(false)}
              onAct={(r) => setRole(r)}
              onAction={runAction}
              onStartTour={startTour}
              onPickSlot={pickSlot}
              onUndo={clearRole}
              notify={notify}
            />

            <p
              role="status"
              className={`pointer-events-none fixed left-1/2 top-6 z-[95] -translate-x-1/2 rounded-lg bg-foreground px-4 py-2.5 text-sm text-background transition-opacity ${notice ? "opacity-100" : "opacity-0"}`}
            >
              {notice}
            </p>
          </>,
          document.body,
        )}
    </AgentContext.Provider>
  );
}

/* ───────────────────────── panel ───────────────────────── */

interface PanelProps {
  open: boolean;
  onClose: () => void;
  messages: Message[];
  busy: boolean;
  onSend: (text: string) => void;
  onTurnDone: () => void;
  onAct: (role: RoleKey) => void;
  onAction: (a: AgentAction) => void;
  onStartTour: () => void;
  onPickSlot: (mine: string, ist: string) => void;
  onUndo: () => void;
  notify: (msg: string) => void;
}

function AgentPanel(p: PanelProps) {
  const logRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Move focus into the composer each time the panel opens (after it becomes visible).
  useEffect(() => {
    if (!p.open) return;
    const t = setTimeout(
      () => inputRef.current?.focus({ preventScroll: true }),
      60,
    );
    return () => clearTimeout(t);
  }, [p.open]);
  const [draft, setDraft] = useState("");

  // Keep the newest content in view while the agent streams.
  useEffect(() => {
    const log = logRef.current;
    if (!log) return;
    const mo = new MutationObserver(() => {
      log.scrollTop = log.scrollHeight;
    });
    mo.observe(log, { childList: true, subtree: true, characterData: true });
    return () => mo.disconnect();
  }, []);

  return (
    <aside
      role="dialog"
      aria-modal="false"
      aria-labelledby="agent-title"
      inert={!p.open}
      // Let the chat log and draft fields scroll natively; Lenis would otherwise scroll the page.
      data-lenis-prevent
      className={`fixed z-[85] flex flex-col bg-background shadow-[0_0_0_1px_var(--color-border-strong),0_30px_80px_-24px_rgb(15_15_16/0.25)] transition-[transform,opacity,visibility] duration-300 ease-[cubic-bezier(.22,.61,.36,1)]
        inset-x-0 bottom-0 h-[88dvh] rounded-t-2xl
        sm:inset-x-auto sm:bottom-3 sm:right-3 sm:top-3 sm:h-auto sm:w-[min(440px,calc(100vw-24px))] sm:rounded-2xl
        ${p.open ? "visible translate-x-0 translate-y-0 opacity-100" : "invisible translate-y-full opacity-0 sm:translate-x-[calc(100%+24px)] sm:translate-y-0"}`}
    >
      <div className="flex items-start justify-between gap-3 border-b border-border py-4 pl-5 pr-3">
        <div>
          <p id="agent-title" className="flex items-center gap-2 font-medium">
            <Spark className="h-4 w-4 text-accent" />
            Portfolio agent
          </p>
          <p className="mt-0.5 text-caption text-muted">
            Answers only from this site, with sources
          </p>
        </div>
        <button
          type="button"
          onClick={p.onClose}
          aria-label="Close agent"
          className="grid h-10 w-10 shrink-0 place-items-center rounded-lg text-muted hover:bg-surface hover:text-foreground"
        >
          <svg
            viewBox="0 0 24 24"
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            aria-hidden="true"
          >
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>
      </div>

      <div
        ref={logRef}
        aria-live="polite"
        aria-busy={p.busy}
        className="flex flex-1 flex-col gap-5 overflow-y-auto p-5"
      >
        {p.messages.map((m) =>
          m.from === "user" ? (
            <p
              key={m.id}
              className="max-w-[85%] self-end rounded-xl rounded-br-sm bg-surface px-3.5 py-2 text-compact"
            >
              {m.text}
            </p>
          ) : (
            <AgentTurn
              key={m.id}
              reply={m.reply}
              settled={m.settled}
              busy={p.busy}
              onDone={p.onTurnDone}
              onAct={p.onAct}
              onAction={p.onAction}
              onStartTour={p.onStartTour}
              onPickSlot={p.onPickSlot}
              onUndo={p.onUndo}
              onBeforeJump={() => {
                // On phones the panel covers the page, so get out of the way.
                if (window.innerWidth < 640) p.onClose();
              }}
              notify={p.notify}
            />
          ),
        )}
      </div>

      <div className="grid gap-2.5 border-t border-border px-4 pb-4 pt-3">
        <div
          role="group"
          aria-label="Suggested requests"
          className="flex gap-1.5 overflow-x-auto p-0.5 [scrollbar-width:none]"
        >
          {SUGGESTIONS.map((sug) => (
            <button
              key={sug.text}
              type="button"
              disabled={p.busy}
              onClick={() => p.onSend(sug.text)}
              className="min-h-8 shrink-0 rounded-full px-3 text-caption text-muted ring-1 ring-border ring-inset hover:bg-surface hover:text-foreground disabled:cursor-default"
            >
              {sug.label}
            </button>
          ))}
        </div>
        <form
          className="flex items-center gap-2 rounded-xl py-1.5 pl-3.5 pr-1.5 ring-1 ring-border-strong ring-inset focus-within:ring-[1.5px] focus-within:ring-accent"
          onSubmit={(e) => {
            e.preventDefault();
            const text = draft.trim();
            if (!text || p.busy) return;
            setDraft("");
            p.onSend(text);
          }}
        >
          <label htmlFor="agent-input" className="sr-only">
            Message the agent
          </label>
          <input
            id="agent-input"
            ref={inputRef}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            autoComplete="off"
            placeholder="Ask, or tell it what to do…"
            className="min-h-9 min-w-0 flex-1 bg-transparent text-compact outline-none placeholder:text-muted"
          />
          <SendButton small />
        </form>
      </div>
    </aside>
  );
}

/* ───────────────────────── one agent turn ───────────────────────── */

interface TurnProps {
  reply: Reply;
  settled?: boolean;
  busy: boolean;
  onDone: () => void;
  onAct: (role: RoleKey) => void;
  onAction: (a: AgentAction) => void;
  onStartTour: () => void;
  onPickSlot: (mine: string, ist: string) => void;
  onUndo: () => void;
  onBeforeJump: () => void;
  notify: (msg: string) => void;
}

function AgentTurn({
  reply,
  settled = false,
  busy,
  onDone,
  onAct,
  onAction,
  onStartTour,
  onPickSlot,
  onUndo,
  onBeforeJump,
  notify,
}: TurnProps) {
  const reduce = useReducedMotion();
  const router = useRouter();
  const total = reply.steps.length;
  const text = reply.text ?? "";
  const pending = Boolean(reply.pending);
  const stepMs = reply.by === "claude" ? 140 : 480;
  const [stepsDone, setStepsDone] = useState(settled ? total : 0);
  const [chars, setChars] = useState(settled ? text.length : 0);
  const [done, setDone] = useState(settled);
  const [picked, setPicked] = useState<number | null>(null);

  const act = useEffectEvent(() => {
    if (reply.act) onAct(reply.act.role);
  });
  const finish = useEffectEvent(() => onDone());

  // Tick the steps, make the page change (if any), stream the answer, then finish.
  useEffect(() => {
    if (settled || pending) return;
    let cancelled = false;
    const wait = (ms: number) =>
      new Promise((r) => setTimeout(r, reduce ? 0 : ms));
    (async () => {
      for (let i = 0; i < total; i++) {
        await wait(stepMs);
        if (cancelled) return;
        setStepsDone(i + 1);
      }
      await wait(0);
      if (cancelled) return;
      act();
      if (reduce) setChars(text.length);
      else
        for (let i = 0; i < text.length; i += 3) {
          await wait(14);
          if (cancelled) return;
          setChars(Math.min(text.length, i + 3));
        }
      setChars(text.length);
      setDone(true);
      finish();
    })();
    return () => {
      cancelled = true;
    };
  }, [settled, pending, stepMs, reduce, total, text]);

  const running = stepsDone < total;
  const goTo = (src: Source) => {
    onBeforeJump();
    if (src.href) {
      router.push(src.href);
      return;
    }
    const el = src.target ? document.getElementById(src.target) : null;
    if (!el) return;
    el.scrollIntoView({
      behavior: reduce ? "auto" : "smooth",
      block: "center",
    });
    el.classList.add(s.spot);
    setTimeout(() => el.classList.remove(s.spot), 1800);
  };

  return (
    <div className="grid gap-3 text-compact leading-relaxed">
      {total > 0 && (
        <div className="grid gap-1.5">
          <p className="text-caption text-muted">
            {running ? (
              <span className={s.shimmer}>Working</span>
            ) : (
              `Done in ${total} step${total > 1 ? "s" : ""}`
            )}
          </p>
          <ol className="grid gap-1">
            {reply.steps
              .slice(0, Math.min(total, stepsDone + 1))
              .map((step, i) => (
                <li
                  key={step}
                  className="flex items-center gap-2 text-caption text-muted"
                >
                  {i < stepsDone ? (
                    <span
                      aria-hidden="true"
                      className="grid h-3.5 w-3.5 shrink-0 place-items-center rounded-full bg-foreground text-background"
                    >
                      <svg
                        viewBox="0 0 24 24"
                        className="h-2.5 w-2.5"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M5 12.5l4.5 4.5L19 7.5" />
                      </svg>
                    </span>
                  ) : (
                    <span
                      aria-hidden="true"
                      className={`h-3.5 w-3.5 shrink-0 rounded-full ${s.spinner}`}
                    />
                  )}
                  {step}
                </li>
              ))}
          </ol>
        </div>
      )}

      {!running && text && <p>{text.slice(0, chars)}</p>}

      {done && (
        <>
          {reply.list && (
            <ul className="grid list-disc gap-1.5 pl-5 marker:text-muted">
              {reply.list.map((li) => (
                <li key={li}>{li}</li>
              ))}
            </ul>
          )}
          {reply.after && <p className="text-muted">{reply.after}</p>}
          {reply.sources && (
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="mr-0.5 text-xs text-muted">Sources</span>
              {reply.sources.map((src) => (
                <button
                  key={src.label}
                  type="button"
                  onClick={() => goTo(src)}
                  className="inline-flex min-h-[30px] items-center gap-1 rounded-full px-2.5 text-caption text-muted ring-1 ring-border-strong ring-inset hover:text-foreground"
                >
                  {src.label}
                  <svg
                    viewBox="0 0 24 24"
                    className="h-3 w-3"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M7 17L17 7M8 7h9v9" />
                  </svg>
                </button>
              ))}
            </div>
          )}
          {reply.by === "claude" && (
            <p className="text-caption text-muted">Answered by Claude from this site&apos;s pages. Check the sources for the details.</p>
          )}
          {reply.card && (
            <TurnCard
              card={reply.card}
              onStartTour={onStartTour}
              onPickSlot={onPickSlot}
              onUndo={onUndo}
              busy={busy}
              notify={notify}
            />
          )}
          {reply.options && (
            <div className="flex flex-wrap gap-2">
              {reply.options.map((o, i) => (
                <button
                  key={o.label}
                  type="button"
                  disabled={picked !== null || busy}
                  onClick={() => {
                    setPicked(i);
                    onAction(o.action);
                  }}
                  className={`min-h-9 rounded-full px-3.5 text-sm ring-1 ring-border-strong ring-inset ${
                    picked === i
                      ? "bg-foreground text-background ring-0"
                      : "hover:bg-surface disabled:text-muted"
                  }`}
                >
                  {o.label}
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

/* ───────────────────────── cards (human-in-the-loop) ───────────────────────── */

function TurnCard({
  card,
  onStartTour,
  onPickSlot,
  onUndo,
  busy,
  notify,
}: {
  card: AgentCard;
  onStartTour: () => void;
  onPickSlot: (mine: string, ist: string) => void;
  onUndo: () => void;
  busy: boolean;
  notify: (msg: string) => void;
}) {
  const wrap = "grid gap-3 rounded-xl bg-surface p-4";
  const kicker = "font-mono text-xs uppercase tracking-[0.06em] text-muted";
  if (card.kind === "tour")
    return (
      <div className={wrap}>
        <p className={kicker}>Ready when you are</p>
        <p className="text-sm text-muted">
          I’ll scroll the page and highlight each stop. You can step back or
          leave at any time.
        </p>
        <div>
          <button
            type="button"
            onClick={onStartTour}
            className="min-h-9 rounded-lg bg-foreground px-3.5 text-sm font-medium text-background hover:bg-accent"
          >
            Start tour
          </button>
        </div>
      </div>
    );
  if (card.kind === "undo")
    return (
      <div className={wrap}>
        <p className="text-sm text-muted">
          Not quite right? You can undo everything here or from the bar under
          the header.
        </p>
        <div>
          <button
            type="button"
            onClick={onUndo}
            className="min-h-9 rounded-lg px-3.5 text-sm ring-1 ring-border-strong ring-inset hover:bg-background"
          >
            Undo changes
          </button>
        </div>
      </div>
    );
  if (card.kind === "slots")
    return (
      <SlotsCard onPick={onPickSlot} busy={busy} wrap={wrap} kicker={kicker} />
    );
  return (
    <EmailCard
      subject={card.subject}
      body={card.body}
      wrap={wrap}
      kicker={kicker}
      notify={notify}
    />
  );
}

function EmailCard({
  subject: s0,
  body: b0,
  wrap,
  kicker,
  notify,
}: {
  subject: string;
  body: string;
  wrap: string;
  kicker: string;
  notify: (m: string) => void;
}) {
  const [subject, setSubject] = useState(s0);
  const [body, setBody] = useState(b0);
  const field =
    "rounded-lg bg-background px-3 py-2 text-sm text-foreground ring-1 ring-border-strong ring-inset outline-none focus:ring-[1.5px] focus:ring-accent";
  const href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  return (
    <div className={wrap}>
      <p className={kicker}>Draft · needs your approval</p>
      <label className="grid gap-1 text-xs text-muted">
        To
        <input
          value={CONTACT_EMAIL}
          readOnly
          className={`${field} text-muted`}
        />
      </label>
      <label className="grid gap-1 text-xs text-muted">
        Subject
        <input
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className={field}
        />
      </label>
      <label className="grid gap-1 text-xs text-muted">
        Message
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={6}
          className={`${field} resize-y leading-normal`}
        />
      </label>
      <div className="flex flex-wrap gap-2">
        <a
          href={href}
          className="inline-flex min-h-9 items-center rounded-lg bg-foreground px-3.5 text-sm font-medium text-background hover:bg-accent"
        >
          Approve and open in mail app
        </a>
        <button
          type="button"
          onClick={async () => {
            try {
              await navigator.clipboard.writeText(
                `Subject: ${subject}\n\n${body}`,
              );
              notify("Draft copied");
            } catch {
              notify("Couldn’t copy. Select the text instead.");
            }
          }}
          className="min-h-9 rounded-lg px-3.5 text-sm ring-1 ring-border-strong ring-inset hover:bg-background"
        >
          Copy draft
        </button>
      </div>
      <p className="text-xs text-muted">
        Nothing is sent until you press send in your own mail app.
      </p>
    </div>
  );
}

/** Next three slots inside 10:00–18:00 IST on weekdays, shown in the visitor's time zone. */
function nextSlots(): Date[] {
  const now = new Date();
  const ist = new Date(now.getTime() + (330 + now.getTimezoneOffset()) * 60000); // wall-clock IST
  const d = new Date(ist.getFullYear(), ist.getMonth(), ist.getDate());
  const plan: [number, number][] = [
    [11, 0],
    [15, 30],
    [12, 0],
  ];
  const out: Date[] = [];
  let day = 0;
  while (out.length < 3) {
    d.setDate(d.getDate() + 1);
    if (d.getDay() === 0 || d.getDay() === 6) continue;
    const times = day === 0 ? plan.slice(0, 2) : plan.slice(2);
    day++;
    for (const [h, m] of times) {
      if (out.length < 3)
        out.push(
          new Date(
            Date.UTC(d.getFullYear(), d.getMonth(), d.getDate(), h, m) -
              330 * 60000,
          ),
        );
    }
  }
  return out;
}

function SlotsCard({
  onPick,
  busy,
  wrap,
  kicker,
}: {
  onPick: (mine: string, ist: string) => void;
  busy: boolean;
  wrap: string;
  kicker: string;
}) {
  const [slots] = useState(nextSlots);
  const [picked, setPicked] = useState<number | null>(null);
  const fmtMine = new Intl.DateTimeFormat(undefined, {
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
  });
  const fmtIST = new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Kolkata",
  });
  return (
    <div className={wrap}>
      <p className={kicker}>Suggested times</p>
      <div className="grid gap-2">
        {slots.map((dt, i) => {
          const mine = fmtMine.format(dt);
          const ist = fmtIST.format(dt);
          return (
            <button
              key={dt.getTime()}
              type="button"
              aria-pressed={picked === i}
              disabled={picked !== null || busy}
              onClick={() => {
                setPicked(i);
                onPick(mine, ist);
              }}
              className={`flex min-h-11 items-center justify-between gap-3 rounded-[10px] bg-background px-3.5 text-left text-sm ring-inset ${
                picked === i
                  ? "ring-[1.5px] ring-accent"
                  : "ring-1 ring-border-strong enabled:hover:ring-foreground"
              }`}
            >
              <b className="font-medium">{mine}</b>
              <span className="text-caption text-muted">{ist} IST</span>
            </button>
          );
        })}
      </div>
      <p className="text-xs text-muted">
        Times are suggestions from his working hours. He’ll confirm by email.
      </p>
    </div>
  );
}

/* ───────────────────────── small shared pieces ───────────────────────── */

export function Spark({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={`shrink-0 ${className}`}
    >
      <path d="M12 3l1.8 5.6L19.5 10l-5.7 1.6L12 17l-1.8-5.4L4.5 10l5.7-1.4z" />
    </svg>
  );
}

export function SendButton({ small = false }: { small?: boolean }) {
  return (
    <button
      type="submit"
      aria-label="Send to agent"
      className={`grid shrink-0 place-items-center bg-foreground text-background transition-colors hover:bg-accent ${
        small ? "h-9 w-9 rounded-[9px]" : "h-10 w-10 rounded-[10px]"
      }`}
    >
      <svg
        viewBox="0 0 24 24"
        className="h-4 w-4"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M12 19V5M5 12l7-7 7 7" />
      </svg>
    </button>
  );
}
