/**
 * One craft study, laid out the same way every time:
 * number and title, the principle, the question it asks, the live lab, then what the research says,
 * what it changes in an interface, the sources, and the core of the code. Server component; the lab is the client part.
 */
export interface StudyProps {
  id: string;
  n: number;
  group: string;
  title: string;
  principles: string[];
  question: string;
  children: React.ReactNode;
  research: React.ReactNode;
  apply: React.ReactNode;
  sources: string[];
  code: string;
  tint?: boolean;
}

const label = "font-mono text-xs uppercase tracking-[0.06em] text-muted";

export default function Study({ id, n, group, title, principles, question, children, research, apply, sources, code, tint = false }: StudyProps) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className={`scroll-mt-24 py-20 md:py-24 ${tint ? "bg-surface" : "border-t border-border"}`}>
      <div className="container-premium">
        <header className="max-w-[68ch]">
          <p className={label}>
            <span className="text-accent">{String(n).padStart(2, "0")}</span> · {group}
          </p>
          <h2 id={`${id}-title`} className="mt-2.5">{title}</h2>
          <ul className="mt-4 flex flex-wrap gap-2" aria-label="Principles">
            {principles.map((p) => (
              <li key={p} className="rounded-full bg-background px-3 py-1 text-caption ring-1 ring-border-strong ring-inset">{p}</li>
            ))}
          </ul>
          <p className="mt-5 text-lg leading-relaxed text-muted">{question}</p>
        </header>

        <div className="mt-10">{children}</div>

        <div className="mt-12 grid gap-10 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,0.8fr)]">
          <div>
            <h3 className={label}>What the research says</h3>
            <div className="mt-3 grid gap-3 text-compact leading-relaxed">{research}</div>
          </div>
          <div>
            <h3 className={label}>What it changes in an interface</h3>
            <div className="mt-3 grid gap-3 text-compact leading-relaxed">{apply}</div>
          </div>
          <div>
            <h3 className={label}>Sources</h3>
            <ul className="mt-3 grid gap-2.5 text-caption leading-relaxed text-muted">
              {sources.map((s) => <li key={s}>{s}</li>)}
            </ul>
          </div>
        </div>

        <details className="group mt-10 rounded-xl bg-background ring-1 ring-border">
          <summary className="flex cursor-pointer items-center justify-between gap-4 px-5 py-3.5 text-sm font-medium">
            The core of the code
            <svg viewBox="0 0 24 24" className="h-4 w-4 text-muted transition-transform group-open:rotate-180" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M6 9l6 6 6-6" /></svg>
          </summary>
          <pre className="overflow-x-auto border-t border-border px-5 py-4 text-[13px] leading-relaxed"><code className="font-mono">{code}</code></pre>
        </details>
      </div>
    </section>
  );
}
