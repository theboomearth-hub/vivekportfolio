"use client";

import { useState } from "react";

/**
 * A closed card sort visitors can do themselves: pick a card, then the group it belongs in.
 * Works with a pointer or a keyboard (every card and group is a button). "Check" compares
 * the visitor's sort with HealthAI's navigation; nothing is stored or sent anywhere.
 */
export default function CardSort<G extends string>({ cards, groups, name = "HealthAI" }: { cards: { card: string; group: G }[]; groups: readonly G[]; /** The product whose sort is the answer key. */ name?: string }) {
  // Interleave the groups so the pool doesn't hand out the answer in order.
  const [order] = useState(() =>
    cards
      .map((c, i) => ({ ...c, k: cards.filter((x, j) => x.group === c.group && j < i).length * 10 + groups.indexOf(c.group) }))
      .sort((a, b) => a.k - b.k)
      .map((c) => c.card),
  );
  const answer = Object.fromEntries(cards.map((c) => [c.card, c.group])) as Record<string, G>;
  const [placed, setPlaced] = useState<Record<string, G>>({});
  const [selected, setSelected] = useState<string | null>(null);
  const [checked, setChecked] = useState(false);
  const [message, setMessage] = useState("");

  const pool = order.filter((c) => !placed[c]);
  const placedCount = Object.keys(placed).length;
  const matches = Object.entries(placed).filter(([c, g]) => answer[c] === g).length;

  function select(card: string) {
    setSelected((s) => (s === card ? null : card));
    setMessage(selected === card ? "" : `Selected “${card}”. Now choose a group.`);
  }
  function place(group: G) {
    if (!selected) return;
    setPlaced((p) => ({ ...p, [selected]: group }));
    setMessage(`Placed “${selected}” in ${group}.`);
    setSelected(null);
    setChecked(false);
  }
  function showAnswer() {
    setPlaced({ ...answer });
    setSelected(null);
    setChecked(true);
    setMessage(`Showing ${name}’s sort.`);
  }
  function reset() {
    setPlaced({});
    setSelected(null);
    setChecked(false);
    setMessage("Cleared. All cards are back in the pile.");
  }

  const cardBtn = (card: string, inGroup?: G) => {
    const isSel = selected === card;
    const right = checked && inGroup && answer[card] === inGroup;
    const wrong = checked && inGroup && answer[card] !== inGroup;
    return (
      <button
        type="button"
        aria-pressed={isSel}
        onClick={() => select(card)}
        className={`w-full rounded-lg px-3 py-2 text-left text-sm leading-snug ring-1 ring-inset transition-colors ${
          isSel
            ? "bg-accent text-accent-foreground ring-accent"
            : right
              ? "bg-background ring-success"
              : wrong
                ? "bg-background ring-border-strong"
                : "bg-background ring-border hover:ring-border-strong"
        }`}
      >
        <span className="flex items-start justify-between gap-2">
          <span>{card}</span>
          {right && (
            <span className="text-success" aria-label={`matches ${name}`}>
              <svg viewBox="0 0 24 24" className="mt-0.5 h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M20 6L9 17l-5-5" />
              </svg>
            </span>
          )}
        </span>
        {wrong && <span className="mt-1 block text-xs text-muted">{name}: {answer[card]}</span>}
      </button>
    );
  };

  return (
    <div className="rounded-2xl bg-surface p-5 ring-1 ring-border ring-inset sm:p-6">
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
        <h3 className="text-lg">Try the sort</h3>
        <p className="text-sm text-muted">Choose a card, then the group it belongs in. Choose a placed card to move it.</p>
      </div>

      <div className="mt-5">
        <p className="text-caption text-muted">
          Cards to sort <span className="font-mono">({pool.length})</span>
        </p>
        {pool.length > 0 ? (
          <ul className="mt-2 flex flex-wrap gap-2">
            {pool.map((c) => (
              <li key={c} className="w-auto">
                {cardBtn(c)}
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-2 text-sm">All cards are sorted.</p>
        )}
      </div>

      <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-[repeat(var(--g),minmax(0,1fr))]" style={{ "--g": groups.length } as React.CSSProperties}>
        {groups.map((g) => {
          const inGroup = order.filter((c) => placed[c] === g);
          return (
            <li key={g} className="flex flex-col rounded-xl bg-background/60 p-3 ring-1 ring-border ring-inset">
              <button
                type="button"
                onClick={() => place(g)}
                aria-disabled={!selected}
                aria-label={selected ? `Place “${selected}” in ${g}` : `${g}: choose a card first`}
                className={`flex min-h-11 items-center justify-between rounded-lg px-3 text-left text-compact font-medium transition-colors ${
                  selected ? "bg-accent/10 text-foreground ring-1 ring-accent ring-inset hover:bg-accent/15" : "text-foreground"
                }`}
              >
                {g}
                <span className="font-mono text-xs font-normal text-muted">{inGroup.length}</span>
              </button>
              <ul className="mt-2 grid gap-1.5">
                {inGroup.map((c) => (
                  <li key={c}>{cardBtn(c, g)}</li>
                ))}
              </ul>
            </li>
          );
        })}
      </ul>

      <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-2">
        <button
          type="button"
          onClick={() => {
            if (placedCount === 0) return;
            setChecked(true);
            setMessage(`${matches} of ${placedCount} placed cards match ${name}’s navigation.`);
          }}
          aria-disabled={placedCount === 0}
          className={`inline-flex min-h-11 items-center rounded-lg px-4 text-sm font-medium ${placedCount ? "bg-foreground text-background hover:bg-accent" : "bg-border text-muted"}`}
        >
          Check against {name}
        </button>
        <button type="button" onClick={showAnswer} className="inline-flex min-h-11 items-center rounded-lg px-4 text-sm font-medium ring-1 ring-border-strong ring-inset hover:bg-background">
          Show {name}’s sort
        </button>
        <button type="button" onClick={reset} className="inline-flex min-h-11 items-center px-2 text-sm text-muted underline decoration-border-strong underline-offset-4 hover:text-foreground">
          Start over
        </button>
        <p className="text-sm" aria-live="polite">
          {checked && placedCount > 0 ? `${matches} of ${placedCount} match.` : ""}
          <span className="sr-only"> {message}</span>
        </p>
      </div>
    </div>
  );
}
