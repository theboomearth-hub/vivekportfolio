import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./hosamane.css";

/**
 * Hosamane, the working agent from the case study (/work/hosamane), running inside the portfolio.
 * The site's navbar, footer, smooth scrolling and page transitions are switched off on these routes
 * (src/components/SiteChrome.tsx), so the app gets the whole screen.
 */
// Poppins (Indian Type Foundry): Latin and Devanagari, so Hindi replies can share the family later.
const poppins = Poppins({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--font-poppins", display: "swap" });

export const metadata: Metadata = {
  title: "Hosamane: try the agent",
  description: "Use Hosamane, an agentic-first home search for Bengaluru: describe your move and the agent searches, checks listings, works out the real cost and asks before it acts. A design prototype with fictional listings.",
  alternates: { canonical: "/hosamane" },
};

export default function HosamaneLayout({ children }: { children: React.ReactNode }) {
  return <div className={`${poppins.variable} hm-app`}>{children}</div>;
}
