import type { Metadata } from "next";
import "./hosamane.css";
import { pageMeta } from "@/lib/seo";

/**
 * Hosamane, the working agent from the case study (/work/hosamane), running inside the portfolio.
 * The site's navbar, footer, smooth scrolling and page transitions are switched off on these routes
 * (src/components/SiteChrome.tsx), so the app gets the whole screen.
 */
// Poppins comes from the root layout now: the whole site uses it.

const description = "Try Hosamane, an agentic home search for Bengaluru: describe your move and the agent searches, checks listings and works out the real cost.";

export const metadata: Metadata = pageMeta({ title: "Hosamane: try the home-search agent", ogTitle: "Hosamane: try the agent", category: "Live prototype", description, path: "/hosamane" });


export default function HosamaneLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="hm-app">
      {/* For crawlers and answer engines that don't run JavaScript: what this app is, and where the write-up lives. */}
      <noscript>
        <p style={{ padding: 24, maxWidth: 640 }}>
          Hosamane is an agentic home search for Bengaluru, for renting and buying. You describe your move; the agent searches listings, checks them, works out the real monthly cost and asks before it acts. It is a design prototype with fictional listings and needs JavaScript to run. The design and research behind it are in the case study at /work/hosamane.
        </p>
      </noscript>
      {children}
    </div>
  );
}
