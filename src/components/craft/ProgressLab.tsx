"use client";

/**
 * Progress bar illusions. Every bar here takes exactly 5 seconds. Three pairs:
 *  1. plain vs ribs moving backwards (against the fill), and 2. ribs moving forwards vs backwards: Harrison, Yeo &
 *     Hudson (CHI 2010) found backwards-moving ribs made the same wait feel shorter.
 *  3. slows down near the end vs speeds up near the end: Harrison et al. (UIST 2007) found people prefer bars that
 *     speed up towards the end, in line with the peak-end rule.
 * The order inside each pair is random. Your answers sit next to the published finding.
 */

import { useEffect, useRef, useState } from "react";
import { shuffle } from "@/lib/craft/stats";
import { Btn, LabFrame, LabNote, useReducedMotion } from "./kit";

/** Event-time clock (only ever called from handlers, never during render). */
const clock = () => performance.now();

type Look = "plain" | "ribs-back" | "ribs-fwd" | "slow-end" | "fast-end";
const DURATION = 5000;
const PAIRS: { a: Look; b: Look; finding: Look; title: string }[] = [
  { a: "plain", b: "ribs-back", finding: "ribs-back", title: "Plain, or ribs moving backwards" },
  { a: "ribs-fwd", b: "ribs-back", finding: "ribs-back", title: "Ribs moving forwards, or backwards" },
  { a: "slow-end", b: "fast-end", finding: "fast-end", title: "Slows near the end, or speeds up near the end" },
];
const NAMES: Record<Look, string> = { plain: "plain", "ribs-back": "ribs moving backwards", "ribs-fwd": "ribs moving forwards", "slow-end": "slows near the end", "fast-end": "speeds up near the end" };
const progressAt = (look: Look, t: number) => (look === "slow-end" ? 1 - (1 - t) ** 2 : look === "fast-end" ? t ** 2 : t);

function Bar({ look, p, running }: { look: Look; p: number; running: boolean }) {
  const ribs = look === "ribs-back" || look === "ribs-fwd";
  return (
    <div className="h-5 overflow-hidden rounded-full bg-background ring-1 ring-border" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(p * 100)} aria-label="Waiting">
      <div
        className={`h-full rounded-full bg-accent ${ribs && running ? (look === "ribs-back" ? "craft-ribs-back" : "craft-ribs-fwd") : ""}`}
        style={{ width: `${p * 100}%`, backgroundImage: ribs ? "repeating-linear-gradient(115deg, rgb(255 255 255 / 0.28) 0 10px, transparent 10px 20px)" : undefined, backgroundSize: "40px 100%" }}
      />
    </div>
  );
}

type Answer = { pair: number; picked: Look | "same"; order: [Look, Look] };

export default function ProgressLab() {
  const reduce = useReducedMotion();
  const [orders, setOrders] = useState<[Look, Look][]>(() => PAIRS.map((p) => [p.a, p.b]));
  const [pair, setPair] = useState(0);
  const [played, setPlayed] = useState<[boolean, boolean]>([false, false]);
  const [playing, setPlaying] = useState<0 | 1 | null>(null);
  const [p, setP] = useState<[number, number]>([0, 0]);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const raf = useRef(0);

  useEffect(() => () => cancelAnimationFrame(raf.current), []);

  const play = (slot: 0 | 1) => {
    const look = orders[pair][slot];
    const start = clock();
    setPlaying(slot);
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / DURATION);
      setP((cur) => (slot === 0 ? [progressAt(look, t), cur[1]] : [cur[0], progressAt(look, t)]));
      if (t < 1) raf.current = requestAnimationFrame(tick);
      else {
        setPlaying(null);
        setPlayed((pl) => (slot === 0 ? [true, pl[1]] : [pl[0], true]));
      }
    };
    raf.current = requestAnimationFrame(tick);
  };

  const answer = (picked: Look | "same") => {
    setAnswers((a) => [...a, { pair, picked, order: orders[pair] }]);
    setPair(pair + 1);
    setPlayed([false, false]);
    setP([0, 0]);
  };

  const restart = () => {
    setOrders(PAIRS.map((pr) => shuffle([pr.a, pr.b]) as [Look, Look]));
    setPair(0);
    setAnswers([]);
    setPlayed([false, false]);
    setP([0, 0]);
  };

  const done = pair >= PAIRS.length;
  const matched = answers.filter((a) => a.picked === PAIRS[a.pair].finding).length;
  const cur = orders[pair];

  return (
    <LabFrame
      status={done ? `Done. You matched the published finding in ${matched} of 3.` : `Pair ${pair + 1} of 3 · both bars take exactly 5 seconds`}
      actions={answers.length > 0 && <Btn kind="ghost" onClick={restart}>Start again</Btn>}
    >
      <div className="grid lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
        <div className="grid content-center gap-6 border-b border-border bg-surface p-5 sm:p-6 lg:border-r lg:border-b-0">
          {!done ? (
            <>
              {([0, 1] as const).map((slot) => (
                <div key={slot} className="grid gap-2.5">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm">Bar {slot === 0 ? "A" : "B"}</p>
                    <Btn kind="ghost" disabled={playing !== null || (slot === 1 && !played[0])} onClick={() => play(slot)}>
                      {played[slot] ? "Play again" : `Play ${slot === 0 ? "A" : "B"}`}
                    </Btn>
                  </div>
                  <Bar look={cur[slot]} p={p[slot]} running={playing === slot} />
                </div>
              ))}
              <div className="grid gap-2.5 border-t border-border pt-5">
                <p className="text-sm text-muted">{played[0] && played[1] ? "Which one felt faster?" : "Play A, then B. Watch each to the end."}</p>
                <div className="flex flex-wrap gap-2">
                  <Btn kind="choice" disabled={!(played[0] && played[1]) || playing !== null} onClick={() => answer(cur[0])}>A felt faster</Btn>
                  <Btn kind="choice" disabled={!(played[0] && played[1]) || playing !== null} onClick={() => answer(cur[1])}>B felt faster</Btn>
                  <Btn kind="choice" disabled={!(played[0] && played[1]) || playing !== null} onClick={() => answer("same")}>The same</Btn>
                </div>
              </div>
            </>
          ) : (
            <div className="grid justify-items-center gap-2 text-center">
              <p className="text-5xl font-medium tracking-[-0.03em]">{matched} / 3</p>
              <p className="max-w-[34ch] text-compact text-muted">answers matched the published finding. All six bars took exactly 5 seconds.</p>
            </div>
          )}
          {reduce && <LabNote>Reduced motion is on, so the ribs stay still and pairs 1 and 2 can&apos;t show their effect. Pair 3 still works.</LabNote>}
        </div>

        <div className="grid content-start gap-3 p-4 sm:p-5">
          <p className="font-mono text-xs uppercase tracking-[0.06em] text-muted">Your answers and the research</p>
          <ol className="grid gap-2.5">
            {PAIRS.map((pr, n) => {
              const a = answers.find((x) => x.pair === n);
              return (
                <li key={pr.title} className="grid gap-1 rounded-xl bg-surface p-4">
                  <p className="text-sm font-medium">{n + 1}. {pr.title}</p>
                  <p className="text-sm text-muted">You: {a ? (a.picked === "same" ? "the same" : NAMES[a.picked]) : "not yet"}</p>
                  <p className="text-sm text-muted">Study: {NAMES[pr.finding]} {a && (a.picked === pr.finding ? <b className="font-medium text-foreground">· matched</b> : <span>· different</span>)}</p>
                </li>
              );
            })}
          </ol>
          <LabNote>Three answers can&apos;t confirm anything about you; the studies used many people and many trials. This shows the effect, not a score.</LabNote>
        </div>
      </div>
    </LabFrame>
  );
}
