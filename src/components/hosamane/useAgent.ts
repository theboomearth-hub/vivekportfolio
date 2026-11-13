"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { emptyMemory, type ActivityEntry, type AgentEvent, type ApprovalAction, type Memory } from "@/lib/hosamane/types";

export interface Turn {
  id: string;
  role: "user" | "agent";
  text?: string;
  events: AgentEvent[];
  pending?: boolean;
  approvalState?: "open" | "approved" | "dismissed";
}

const KEY = "hosamane-session-v1";

/** The last few lines of the conversation, so a model-backed planner can follow references like "yes, do that". */
function recentHistory(turns: Turn[]) {
  return turns.slice(-6).map((t) => {
    if (t.role === "user") return { role: "user" as const, text: t.text ?? "" };
    const parts = t.events.flatMap((e) =>
      e.t === "text" ? [e.text] : e.t === "ask" ? [`[asked: ${e.question}]`] : e.t === "approval" ? [`[approval card: ${e.summary}]`] : e.t === "refusal" ? [`[declined: ${e.rule}]`] : []);
    return { role: "agent" as const, text: parts.join(" ") };
  }).filter((h) => h.text);
}
let turnSeq = 0;
const tid = () => `t${Date.now().toString(36)}${++turnSeq}`;

/** Client state for the conversation. The session lives in sessionStorage only (prototype). */
export function useAgent() {
  const [turns, setTurns] = useState<Turn[]>([]);
  const [memory, setMemory] = useState<Memory>(emptyMemory);
  const [activity, setActivity] = useState<ActivityEntry[]>([]);
  const [busy, setBusy] = useState(false);
  const [now, setNow] = useState(() => Date.now());
  const memRef = useRef(memory);
  memRef.current = memory;
  const turnsRef = useRef(turns);
  turnsRef.current = turns;
  const loaded = useRef(false);

  // Restore and persist the session.
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(KEY);
      if (raw) {
        const s = JSON.parse(raw);
        setTurns(s.turns ?? []);
        setMemory(s.memory ?? emptyMemory());
        setActivity(s.activity ?? []);
      }
    } catch {}
    loaded.current = true;
  }, []);
  useEffect(() => {
    if (!loaded.current) return;
    try { sessionStorage.setItem(KEY, JSON.stringify({ turns, memory, activity })); } catch {}
  }, [turns, memory, activity]);
  // A clock for simulated owner replies.
  useEffect(() => { const id = setInterval(() => setNow(Date.now()), 15000); return () => clearInterval(id); }, []);

  const run = useCallback(async (body: Record<string, unknown>, userText?: string) => {
    setBusy(true);
    const agentId = tid();
    setTurns((t) => [...t, ...(userText ? [{ id: tid(), role: "user" as const, text: userText, events: [] }] : []), { id: agentId, role: "agent", events: [], pending: true }]);
    try {
      const history = recentHistory(turnsRef.current);
      const res = await fetch("/api/hosamane/agent", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...body, memory: memRef.current, history }) });
      const reader = res.body!.getReader();
      const dec = new TextDecoder();
      let buf = "";
      for (;;) {
        const { value, done } = await reader.read();
        if (done) break;
        buf += dec.decode(value, { stream: true });
        const lines = buf.split("\n");
        buf = lines.pop() ?? "";
        for (const line of lines) {
          if (!line.trim()) continue;
          const e = JSON.parse(line) as AgentEvent;
          if (e.t === "memory") { setMemory(e.memory); memRef.current = e.memory; continue; }
          if (e.t === "activity") { setActivity((a) => [e.entry, ...a]); }
          setTurns((t) => t.map((x) => (x.id === agentId ? { ...x, events: [...x.events, e], approvalState: e.t === "approval" ? "open" : x.approvalState } : x)));
        }
      }
    } catch {
      setTurns((t) => t.map((x) => (x.id === agentId ? { ...x, events: [...x.events, { t: "text", text: "I couldn't reach the server. Your board is unchanged. Try again?" }] } : x)));
    } finally {
      setTurns((t) => t.map((x) => (x.id === agentId ? { ...x, pending: false } : x)));
      setBusy(false);
    }
  }, []);

  const send = useCallback((text: string, opts?: { revealAll?: boolean; shown?: string }) => run({ kind: "message", text, revealAll: opts?.revealAll }, opts?.shown ?? text), [run]);
  const answer = useCallback((field: string, value: string, label: string) => run({ kind: "answer", field, value }, label), [run]);

  /** The person approved: the server signs the approval, then the agent may act. */
  const approve = useCallback(async (turnId: string, action: ApprovalAction, payload: unknown, label: string) => {
    setTurns((t) => t.map((x) => (x.id === turnId ? { ...x, approvalState: "approved" } : x)));
    const r = await fetch("/api/hosamane/approve", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action, payload }) });
    const { token } = await r.json();
    await run({ kind: "approved", action, token }, label);
  }, [run]);
  const dismiss = useCallback((turnId: string) => setTurns((t) => t.map((x) => (x.id === turnId ? { ...x, approvalState: "dismissed" } : x))), []);

  const reset = useCallback(() => {
    setTurns([]); setMemory(emptyMemory()); setActivity([]);
    try { sessionStorage.removeItem(KEY); } catch {}
  }, []);
  const stopTask = useCallback((taskId: string) => {
    setMemory((m) => ({ ...m, tasks: m.tasks.map((t) => (t.id === taskId ? { ...t, stopped: true } : t)) }));
    setActivity((a) => [{ at: Date.now(), action: "Stopped a task", detail: "You stopped it; nothing more will be sent.", tool: "—" }, ...a]);
  }, []);
  const removeBriefItem = useCallback((field: string, value?: string) => {
    setMemory((m) => {
      const b = { ...m.brief, origins: { ...m.brief.origins } };
      if (field === "mustHaves" || field === "dealBreakers") (b as unknown as Record<string, string[]>)[field] = (b as unknown as Record<string, string[]>)[field].filter((x) => x !== value);
      else (b as unknown as Record<string, unknown>)[field] = null;
      delete b.origins[field];
      return { ...m, brief: b };
    });
  }, []);

  return { turns, memory, activity, busy, now, send, answer, approve, dismiss, reset, stopTask, removeBriefItem };
}
