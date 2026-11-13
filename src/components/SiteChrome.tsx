"use client";

import { usePathname } from "next/navigation";

/** Routes that run a full-screen app (the Hosamane agent) instead of a portfolio page. */
export const isAppPath = (pathname: string | null) => !!pathname && (pathname === "/hosamane" || pathname.startsWith("/hosamane/"));

/** Renders the site's chrome (navbar, footer, scroll aids) everywhere except on app routes. */
export function SiteOnly({ children }: { children: React.ReactNode }) {
  return isAppPath(usePathname()) ? null : <>{children}</>;
}
