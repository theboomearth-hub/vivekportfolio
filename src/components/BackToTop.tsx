"use client";

import { useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";

function subscribeToScroll(onScroll: () => void) {
  window.addEventListener("scroll", onScroll, { passive: true });
  return () => window.removeEventListener("scroll", onScroll);
}
const isScrolledPastFold = () => window.scrollY > 360;
const notScrolledOnServer = () => false;

export default function BackToTop() {
  const pathname = usePathname();
  const isVisible = useSyncExternalStore(subscribeToScroll, isScrolledPastFold, notScrolledOnServer);

  const shouldShowOnRoute =
    pathname === "/about" || pathname === "/blog" || pathname.startsWith("/blog/");

  if (!shouldShowOnRoute) return null;

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Back to top"
      // Hidden buttons leave the tab order too, not just the screen.
      tabIndex={isVisible ? 0 : -1}
      aria-hidden={!isVisible}
      className={`fixed bottom-24 right-5 sm:right-8 z-40 w-11 h-11 rounded-full bg-surface border border-border text-muted hover:text-foreground hover:border-accent/40 transition-all duration-300 ${
        isVisible
          ? "opacity-100 translate-y-0 pointer-events-auto"
          : "opacity-0 translate-y-2 pointer-events-none"
      }`}
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="mx-auto"
        aria-hidden="true"
      >
        <path d="M12 19V5" />
        <path d="m5 12 7-7 7 7" />
      </svg>
    </button>
  );
}
