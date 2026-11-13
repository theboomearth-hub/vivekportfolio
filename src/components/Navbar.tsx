"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { RESUME_HREF } from "@/lib/site";

// Five destinations. Research, Craft and Experiments are reached from the
// homepage "Also"/facts links and the footer, which keeps the bar calm.
const navLinks = [
  { href: "/work", label: "Work" },
  { href: "/process", label: "Process" },
  { href: "/about", label: "About" },
  { href: "/blog", label: "Writing" },
  { href: "/contact", label: "Contact" },
];

const isActive = (pathname: string, href: string) =>
  pathname === href || pathname.startsWith(`${href}/`);

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Close the menu when the route changes. Adjusting state during render is
  // React's recommended alternative to a setState-in-effect.
  const [prevPathname, setPrevPathname] = useState(pathname);
  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    setIsOpen(false);
  }

  // A hairline appears under the bar only once the page has scrolled.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // While the full-screen menu is open: lock page scroll, move focus into it,
  // and let Escape close it and hand focus back to the Menu button.
  useEffect(() => {
    if (!isOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setIsOpen(false);
      menuButtonRef.current?.focus();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 bg-background transition-[border-color] duration-300 border-b ${
        scrolled ? "border-border" : "border-transparent"
      }`}
    >
      <div className="container-premium flex h-[72px] items-center justify-between gap-6">
        <Link href="/" className="py-2.5 text-compact font-medium tracking-[-0.01em] text-foreground">
          Vivekanand Choudhari
        </Link>

        <nav aria-label="Main" className="hidden md:block">
          <ul className="flex items-center gap-7 text-compact">
            {navLinks.map((link) => {
              const active = isActive(pathname, link.href);
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    aria-current={active ? "page" : undefined}
                    className={`inline-block py-2.5 transition-colors ${
                      active ? "text-foreground" : "text-muted hover:text-foreground"
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <button
          ref={menuButtonRef}
          type="button"
          onClick={() => setIsOpen(true)}
          aria-expanded={isOpen}
          aria-controls="mobile-menu"
          className="md:hidden inline-flex min-h-11 items-center px-1 text-compact font-medium"
        >
          Menu
        </button>
      </div>

      {isOpen && (
        <div
          id="mobile-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
          className="fixed inset-0 z-[60] flex flex-col bg-background px-6 pb-8 md:hidden"
        >
          <div className="flex h-[72px] items-center justify-between">
            <span className="text-compact font-medium">Vivekanand Choudhari</span>
            <button
              ref={closeButtonRef}
              type="button"
              onClick={() => {
                setIsOpen(false);
                menuButtonRef.current?.focus();
              }}
              className="inline-flex min-h-11 items-center px-1 text-compact font-medium"
            >
              Close
            </button>
          </div>
          <nav aria-label="Mobile" className="mt-6">
            <ul>
              {[{ href: "/", label: "Home" }, ...navLinks].map((link) => {
                const active = link.href === "/" ? pathname === "/" : isActive(pathname, link.href);
                return (
                  <li key={link.href} className="border-b border-border">
                    <Link
                      href={link.href}
                      aria-current={active ? "page" : undefined}
                      className={`block py-3 text-[28px] font-medium tracking-[-0.02em] ${
                        active ? "text-foreground" : "text-muted"
                      }`}
                    >
                      {link.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
          <a
            href={RESUME_HREF}
            download="Vivekanand-Choudhari-Resume.pdf"
            className="mt-auto inline-flex min-h-11 items-center text-compact font-medium underline decoration-border-strong underline-offset-4"
          >
            Download résumé (PDF)
          </a>
        </div>
      )}
    </header>
  );
}
