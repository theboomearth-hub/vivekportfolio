import Image from "next/image";

export interface Persona {
  name: string;
  /** One line: age, role, situation. */
  meta: string;
  /** "Searcher", "Co-decider"… */
  role: string;
  /** One or two doodles from /public/doodles/people (Open Peeps, CC0). */
  figures: { src: string; alt: string }[];
  lists: { label: string; items: string[] }[];
  trust?: { label: string; text: string };
  /** What the persona rests on. Proto-personas are assumptions until interviews replace them. */
  basis: "proto" | "research";
  /** Overrides the default line that says what the persona rests on. */
  basisNote?: string;
}

/** A persona as a person first: a doodle on a hand-drawn blob, then what they want and fear. */
export default function PersonaCard({ persona, i = 0 }: { persona: Persona; i?: number }) {
  const pair = persona.figures.length > 1;
  return (
    <article className="flex h-full flex-col overflow-hidden rounded-2xl bg-background ring-1 ring-border ring-inset">
      <div className="relative flex h-[232px] items-end justify-center overflow-hidden bg-surface px-6 pt-6">
        <svg viewBox="0 0 300 200" className="sk-fade absolute inset-x-8 bottom-0 h-[82%] w-[calc(100%-4rem)] text-accent-light" aria-hidden="true" style={{ "--sk-i": i } as React.CSSProperties}>
          <path filter="url(#sk-wobble)" fill="currentColor" d="M34 200C10 150 18 82 64 50 112 16 196 14 242 52c40 33 52 98 34 148z" />
        </svg>
        <div className="relative flex items-end">
          {persona.figures.map((f, n) => (
            <Image
              key={f.src}
              src={f.src}
              alt={f.alt}
              width={850}
              height={1200}
              unoptimized
              className={`sk-fade h-[208px] w-auto ${pair && n > 0 ? "-ml-12" : ""}`}
              style={{ "--sk-i": i + n + 1 } as React.CSSProperties}
            />
          ))}
        </div>
        <p className="absolute top-4 left-4 rounded-full bg-background px-2.5 py-1 font-mono text-[11px] uppercase tracking-[0.06em] text-muted ring-1 ring-border">
          {persona.role}
        </p>
      </div>
      <div className="flex flex-1 flex-col gap-4 p-6">
        <div>
          <h3 className="text-lg">{persona.name}</h3>
          <p className="mt-1 text-caption text-muted">{persona.meta}</p>
        </div>
        {persona.lists.map((l) => (
          <div key={l.label}>
            <p className="font-mono text-xs uppercase tracking-[0.06em] text-muted">{l.label}</p>
            <ul className="mt-1.5 grid gap-1 text-compact">
              {l.items.map((it) => (
                <li key={it} className="flex gap-2.5">
                  <span aria-hidden="true" className="mt-[0.65em] h-1 w-1 shrink-0 rounded-full bg-foreground" />
                  {it}
                </li>
              ))}
            </ul>
          </div>
        ))}
        {persona.trust && (
          <p className="mt-auto border-l-2 border-accent pl-3 text-compact">
            <span className="text-muted">{persona.trust.label} </span>
            {persona.trust.text}
          </p>
        )}
        <p className={`text-caption text-muted ${persona.trust ? "" : "mt-auto"}`}>
          {persona.basisNote ?? (persona.basis === "proto" ? "Proto-persona: built from public evidence and assumptions, not interviews." : "From research interviews.")}
        </p>
      </div>
    </article>
  );
}
