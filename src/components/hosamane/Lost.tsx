import Link from "next/link";

/** A dead end with a way back: used for unknown URLs and for share links that are broken or expired. */
export default function Lost({ title, body, cta = "Back to the agent", href = "/hosamane" }: { title: string; body: string; cta?: string; href?: string }) {
  return (
    <div className="grid min-h-dvh place-items-center bg-hm-canvas px-4 py-16 text-hm-ink">
      <div className="w-full max-w-[440px] text-center">
        <svg aria-hidden="true" viewBox="0 0 32 32" className="mx-auto h-12 w-12">
          <rect width="32" height="32" rx="8" fill="currentColor" className="text-hm-primary" />
          <g fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 15.2 16 8l9 7.2" /><path d="M9.3 13.6V24h13.4V13.6" /><path d="M16 15.4v5M13.5 17.9h5" /></g>
        </svg>
        <h1 className="mt-6 text-[26px] font-medium leading-tight">{title}</h1>
        <p className="mt-3 text-hm-compact text-hm-muted">{body}</p>
        <Link href={href} className="mt-8 inline-flex min-h-11 items-center justify-center rounded-hm-control bg-hm-primary px-5 text-hm-compact font-medium text-white transition-colors hover:bg-hm-primary-strong">{cta}</Link>
        <p className="mt-10 text-hm-caption text-hm-muted">Hosamane is a design prototype. Listings, owners and builders are fictional.</p>
      </div>
    </div>
  );
}
