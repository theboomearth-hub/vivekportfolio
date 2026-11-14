"use client";

/**
 * Trust calibration, scored with signal detection theory.
 * A campaign agent proposes 20 actions in two rounds; it is right on 16 of them. You approve or reject each.
 * Round 1 shows only the action and its reason. Round 2 adds the agent's confidence and the evidence behind it.
 * Approving a good action is a hit; approving a bad one is a false alarm (over-trust); rejecting a good one is
 * a miss (under-trust). Sensitivity d′ = z(H) − z(F); bias c = −(z(H) + z(F)) / 2, negative = leans to approve.
 */

import { useState } from "react";
import { sdt } from "@/lib/craft/stats";
import { Btn, LabFrame, LabNote, Plot, Readout, num } from "./kit";

type Proposal = { action: string; why: string; ok: boolean; explain: string; conf?: number; evidence?: string[] };

const ROUND_1: Proposal[] = [
  { action: "Shift ₹20K from Silk Board Junction to T2 Departures", why: "T2 is delivering above plan; Silk Board is behind.", ok: true, explain: "Moving budget towards the screen that delivers is the right call." },
  { action: "Pause Cyber City Façade for two hours tonight", why: "The venue has scheduled maintenance.", ok: true, explain: "Paying for a dark screen helps no one." },
  { action: "Double the bid on Rajiv Chowk Metro Hub", why: "Reach is up 40%.", ok: false, explain: "The jump was one festival day. The 14-day trend is flat, so doubling the bid buys nothing." },
  { action: "Add T3 Arrivals, Delhi, to the plan", why: "It matches the audience brief and has open slots.", ok: true, explain: "A fit with open inventory." },
  { action: "Move Friday spots at BKC Junction to 6–9 pm", why: "Evening footfall there is twice the morning's.", ok: true, explain: "Same spend, more people." },
  { action: "Send the mid-flight report to the client", why: "Day 7 of 14; the report is ready.", ok: true, explain: "On schedule." },
  { action: "Cap frequency at 4 a day on airport screens", why: "The same travellers see the ad 9 times a day.", ok: true, explain: "Past a few exposures, more repeats mostly waste money." },
  { action: "Cancel the Bengaluru flight", why: "Delivery is 35% behind plan.", ok: false, explain: "Two screens were offline for a day. Delivery recovers when they're back; cancelling forfeits the booking." },
  { action: "Swap the Andheri Metro creative to the Hindi version", why: "It tested better with riders on this line.", ok: true, explain: "A tested, local creative." },
  { action: "Hold ₹15K back as contingency", why: "Two screens report intermittent outages.", ok: true, explain: "Sensible while screens are unstable." },
];

const ROUND_2: Proposal[] = [
  { action: "Shift ₹10K from Phoenix Mall to Airport Arrivals Hall", why: "Arrivals is over-delivering; the mall is behind.", conf: 92, evidence: ["14 days of data", "Arrivals at 112% of plan", "Mall at 71%"], ok: true, explain: "Two weeks of data, a clear gap." },
  { action: "Raise the CPM floor to ₹140 on all metro screens", why: "Demand for metro inventory is rising.", conf: 58, evidence: ["3 days of data", "2 of 6 screens reporting"], ok: false, explain: "Three days from a third of the screens isn't a trend. The low confidence said so." },
  { action: "Pause Silk Board Junction LED until it's repaired", why: "The screen is offline.", conf: 95, evidence: ["Offline since 06:10", "Venue ticket #4471 open"], ok: true, explain: "Confirmed outage, with a ticket." },
  { action: "Extend the Mumbai flight by three days", why: "Budget is left and the audience still fits.", conf: 88, evidence: ["₹42K unspent", "Audience match 0.81", "Client allows +5 days"], ok: true, explain: "Within the client's rules." },
  { action: "Move Kochi Metro morning spots to evenings", why: "Evenings are much busier.", conf: 90, evidence: ["21 days of footfall", "Evenings 2.1× mornings"], ok: true, explain: "Three weeks of data behind it." },
  { action: "Approve the proposal draft for the client", why: "Every screen is priced and the totals match.", conf: 93, evidence: ["6 of 6 screens priced", "Totals reconcile to ₹5.0L"], ok: true, explain: "Checked and complete." },
  { action: "Drop Rajiv Chowk Metro Hub from the plan", why: "Its reach fell 30%.", conf: 61, evidence: ["1 day of data", "Measured on a public holiday"], ok: false, explain: "One holiday isn't a trend; commuters were home. The evidence gave it away." },
  { action: "Cap frequency at 5 a day in Delhi", why: "Exposure is high and recall has flattened.", conf: 87, evidence: ["Median 8.6 exposures a day", "Recall flat above 5"], ok: true, explain: "The data supports the cap." },
  { action: "Re-sort the shortlist by cost per reach", why: "You asked for it on day 2.", conf: 91, evidence: ["Your request, day 2", "10 screens affected"], ok: true, explain: "Doing what you asked." },
  { action: "Send the day-7 pacing report", why: "Spend and delivery are on plan.", conf: 94, evidence: ["Spend 98.9% of plan", "Delivery 97.9% of plan"], ok: true, explain: "On schedule, on plan." },
];

const ROUNDS = [ROUND_1, ROUND_2];
type Decision = { round: 0 | 1; ok: boolean; approved: boolean };

function score(ds: Decision[]) {
  const signals = ds.filter((d) => d.ok).length;
  const noise = ds.filter((d) => !d.ok).length;
  const hits = ds.filter((d) => d.ok && d.approved).length;
  const fas = ds.filter((d) => !d.ok && d.approved).length;
  return { hits, fas, misses: signals - hits, crs: noise - fas, signals, noise, ...sdt(hits, signals, fas, noise) };
}

function Matrix({ title, s }: { title: string; s: ReturnType<typeof score> }) {
  return (
    <div className="grid gap-2">
      <p className="text-sm font-medium">{title}</p>
      <table className="w-full border-collapse text-left text-caption tabular-nums">
        <caption className="sr-only">{title}: your decisions against what was right</caption>
        <thead>
          <tr className="text-muted">
            <th scope="col" className="py-1 pr-2 font-normal"></th>
            <th scope="col" className="py-1 pr-2 font-normal">Good action</th>
            <th scope="col" className="py-1 font-normal">Bad action</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-t border-border">
            <th scope="row" className="py-1.5 pr-2 font-normal text-muted">You approved</th>
            <td className="py-1.5 pr-2">{s.hits} <span className="text-muted">right</span></td>
            <td className="py-1.5">{s.fas} <span className="text-muted">over-trust</span></td>
          </tr>
          <tr className="border-t border-border">
            <th scope="row" className="py-1.5 pr-2 font-normal text-muted">You rejected</th>
            <td className="py-1.5 pr-2">{s.misses} <span className="text-muted">under-trust</span></td>
            <td className="py-1.5">{s.crs} <span className="text-muted">caught</span></td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default function TrustLab() {
  const [round, setRound] = useState<0 | 1>(0);
  const [i, setI] = useState(0);
  const [phase, setPhase] = useState<"idle" | "decide" | "feedback" | "break" | "done">("idle");
  const [decisions, setDecisions] = useState<Decision[]>([]);
  const [last, setLast] = useState<{ approved: boolean; ok: boolean } | null>(null);
  const p = ROUNDS[round][i];

  const decide = (approved: boolean) => {
    setDecisions((d) => [...d, { round, ok: p.ok, approved }]);
    setLast({ approved, ok: p.ok });
    setPhase("feedback");
  };

  const next = () => {
    if (i + 1 < ROUNDS[round].length) {
      setI(i + 1);
      setPhase("decide");
    } else if (round === 0) {
      setPhase("break");
    } else setPhase("done");
  };

  const restart = () => {
    setRound(0);
    setI(0);
    setDecisions([]);
    setPhase("idle");
  };

  const r1 = score(decisions.filter((d) => d.round === 0));
  const r2 = score(decisions.filter((d) => d.round === 1));
  const lean = (c: number) => (c < -0.25 ? "leans to approve" : c > 0.25 ? "leans to reject" : "balanced");
  const rightCall = last ? last.approved === last.ok : false;

  const status =
    phase === "idle" ? "An agent runs a DOOH campaign and asks before it acts. 20 decisions, about three minutes."
    : phase === "break" ? "Round 1 done. Round 2 shows the agent's confidence and evidence."
    : phase === "done" ? "Done. 20 decisions."
    : `Round ${round + 1} of 2 · proposal ${i + 1} of 10${round === 0 ? " · action and reason only" : " · with confidence and evidence"}`;

  return (
    <LabFrame status={status} actions={decisions.length > 0 && <Btn kind="ghost" onClick={restart}>Start again</Btn>}>
      <div className="grid lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
        <div className="grid min-h-[440px] place-items-center border-b border-border bg-surface p-5 sm:p-6 lg:border-r lg:border-b-0">
          {phase === "idle" && (
            <div className="grid max-w-[38ch] justify-items-center gap-4 text-center">
              <p className="text-compact text-muted">The agent is right most of the time, but not always. Approve the actions you&apos;d let it take; reject the ones you wouldn&apos;t.</p>
              <Btn onClick={() => setPhase("decide")}>Start</Btn>
            </div>
          )}
          {phase === "break" && (
            <div className="grid max-w-[38ch] justify-items-center gap-4 text-center">
              <p className="text-lg">Round 1: you caught {r1.crs} of {r1.noise} bad actions.</p>
              <p className="text-compact text-muted">Same agent, same accuracy. Now each proposal shows how sure the agent is and what it based that on.</p>
              <Btn onClick={() => { setRound(1); setI(0); setPhase("decide"); }}>Start round 2</Btn>
            </div>
          )}
          {(phase === "decide" || phase === "feedback") && p && (
            <article className="grid w-full max-w-[460px] gap-4 rounded-2xl bg-background p-5 shadow-[0_0_0_1px_var(--color-border),0_20px_50px_-30px_rgb(15_15_16/0.35)]" aria-label="Agent proposal">
              <p className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.06em] text-muted">
                <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-accent" />
                The agent proposes
              </p>
              <p className="text-xl leading-snug tracking-[-0.01em]">{p.action}</p>
              <p className="text-compact text-muted">{p.why}</p>
              {round === 1 && p.conf !== undefined && (
                <div className="grid gap-3 border-t border-border pt-4">
                  <div className="grid gap-1.5">
                    <p className="flex justify-between text-sm"><span>Confidence</span><span className="tabular-nums">{p.conf}%</span></p>
                    <div className="h-1.5 overflow-hidden rounded-full bg-surface" aria-hidden="true"><div className="h-full rounded-full bg-accent" style={{ width: `${p.conf}%` }} /></div>
                  </div>
                  <ul className="flex flex-wrap gap-1.5" aria-label="Evidence">
                    {p.evidence?.map((e) => <li key={e} className="rounded-md bg-surface px-2 py-1 text-caption">{e}</li>)}
                  </ul>
                </div>
              )}
              {phase === "decide" ? (
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <Btn kind="ghost" onClick={() => decide(false)}>Reject</Btn>
                  <Btn onClick={() => decide(true)}>Approve</Btn>
                </div>
              ) : (
                <div className="grid gap-3 rounded-xl bg-surface p-4" role="status">
                  <p className="text-sm font-medium">{rightCall ? (p.ok ? "Right call: a good action." : "Caught it: a bad action.") : p.ok ? "Too cautious: this one was fine." : "Over-trust: this one was a mistake."}</p>
                  <p className="text-sm text-muted">{p.explain}</p>
                  <Btn onClick={next} className="justify-self-start">{i + 1 < 10 ? "Next proposal" : round === 0 ? "Finish round 1" : "See your results"}</Btn>
                </div>
              )}
            </article>
          )}
          {phase === "done" && (
            <div className="grid w-full max-w-[460px] gap-5">
              <Matrix title="Round 1 · action and reason" s={r1} />
              <Matrix title="Round 2 · with confidence and evidence" s={r2} />
            </div>
          )}
        </div>

        <div className="grid content-start gap-5 p-4 sm:p-5">
          <Plot
            label={`Hit rate against false-alarm rate. Round 1: ${r1.hits} of ${r1.signals} good approved, ${r1.fas} of ${r1.noise} bad approved. Round 2: ${r2.hits} of ${r2.signals}, ${r2.fas} of ${r2.noise}.`}
            yLabel="Good actions you approved"
            xLabel="Bad actions you approved"
            x={[0, 1]}
            y={[0, 1]}
            xTicks={[0, 0.25, 0.5, 0.75, 1]}
            yTicks={[0, 0.25, 0.5, 0.75, 1]}
            xFormat={(v) => `${Math.round(v * 100)}%`}
            yFormat={(v) => `${Math.round(v * 100)}%`}
            height={280}
            legend={[{ name: "Round 2", tone: "accent", kind: "dot" }, { name: "Round 1", tone: "base", kind: "hollow" }, { name: "Guessing", tone: "base", kind: "dash" }]}
            lines={[{ name: "Guessing", tone: "base", dashed: true, pts: [{ x: 0, y: 0 }, { x: 1, y: 1 }] }]}
            dots={[
              { name: "Round 1", tone: "base", hollow: true, pts: r1.signals ? [{ x: r1.fas / Math.max(1, r1.noise), y: r1.hits / Math.max(1, r1.signals), tip: `Round 1: ${r1.hits}/${r1.signals} good approved, ${r1.fas}/${r1.noise} bad approved` }] : [] },
              { name: "Round 2", tone: "accent", pts: r2.signals ? [{ x: r2.fas / Math.max(1, r2.noise), y: r2.hits / Math.max(1, r2.signals), tip: `Round 2: ${r2.hits}/${r2.signals} good approved, ${r2.fas}/${r2.noise} bad approved` }] : [] },
            ]}
            empty="Your rounds plot here"
            table={{ caption: "Your decisions by round", head: ["Round", "Good approved", "Bad approved", "d′", "Bias c"], rows: [r1, r2].filter((s) => s.signals + s.noise > 0).map((s, n) => [n + 1, `${s.hits} of ${s.signals}`, `${s.fas} of ${s.noise}`, num(s.dPrime), num(s.c)]) }}
          />
          {phase === "done" ? (
            <div className="grid gap-3 sm:grid-cols-2">
              <Readout value={`${num(r1.dPrime)} → ${num(r2.dPrime)}`} label="sensitivity d′, round 1 → 2" note="0 is guessing; higher tells good from bad" />
              <Readout value={`${num(r1.c)} → ${num(r2.c)}`} label="bias c, round 1 → 2" note={`Round 1 ${lean(r1.c)}; round 2 ${lean(r2.c)}. Below 0 leans to approve.`} />
            </div>
          ) : (
            <LabNote>Top-left is perfect: every good action approved, every bad one caught. On the diagonal you&apos;re approving bad actions as often as good ones, which is no better than a coin. Approving everything puts you top-right.</LabNote>
          )}
          <LabNote>Ten decisions a round is too few for a stable score; it shows the direction. Scores use the log-linear correction, so a perfect round doesn&apos;t give an infinite d′.</LabNote>
        </div>
      </div>
    </LabFrame>
  );
}
