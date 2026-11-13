import Link from "next/link";
import { RESUME_HREF } from "@/lib/site";

const elsewhere = [
  { href: "https://www.linkedin.com/in/vivekanand-choudhari-817829118/", label: "LinkedIn" },
  { href: "https://dribbble.com/VivekanandChoudhari", label: "Dribbble" },
  { href: "https://github.com/vivekanandchoudhari", label: "GitHub" },
];

// Side projects live here (and in the homepage facts) instead of the main nav.
const lab = [
  { href: "/portfolio", label: "Design gallery" },
  { href: "/research/forma", label: "Forma research" },
  { href: "/research/lokul", label: "Lokul.club" },
  { href: "/craft", label: "Craft" },
  { href: "/experiments", label: "Experiments" },
];

const linkClass = "inline-block py-2.5 text-muted transition-colors hover:text-foreground";

export default function Footer() {
  return (
    <footer className="border-t border-border text-sm">
      <div className="container-premium">
        <div className="flex flex-col gap-4 pt-6 md:flex-row md:items-center md:justify-between">
          <p className="text-muted">
            <span aria-hidden="true" className="mr-2 inline-block h-[7px] w-[7px] rounded-full bg-accent align-[1px]" />
            Agent-ready: this site publishes{" "}
            <a href="/llms.txt" className="text-foreground underline decoration-border-strong underline-offset-4 hover:text-accent">
              llms.txt
            </a>
            , so your own AI assistant can read it directly.
          </p>
          <nav aria-label="Lab">
            <ul className="flex flex-wrap gap-x-6">
              {lab.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className={linkClass}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        <div className="flex flex-col gap-2 py-6 md:flex-row md:items-center md:justify-between">
          <p className="text-muted">© {new Date().getFullYear()} Vivekanand Choudhari</p>
          <nav aria-label="Elsewhere">
            <ul className="flex flex-wrap gap-x-6">
              {elsewhere.map((l) => (
                <li key={l.href}>
                  <a href={l.href} target="_blank" rel="noopener noreferrer" className={linkClass}>
                    {l.label}
                    <span className="sr-only"> (opens in a new tab)</span>
                  </a>
                </li>
              ))}
              <li>
                <a href={RESUME_HREF} download="Vivekanand-Choudhari-Resume.pdf" className={linkClass}>
                  Résumé (PDF)
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </footer>
  );
}
