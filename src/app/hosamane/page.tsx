import App from "@/components/hosamane/App";
import JsonLd from "@/components/JsonLd";
import { abs, breadcrumbs, graph, PERSON_ID, webPage } from "@/lib/seo";

const DESCRIPTION = "Try Hosamane, an agentic home search for Bengaluru: describe your move and the agent searches, checks listings and works out the real cost.";

const jsonLd = graph(
  webPage({ path: "/hosamane", name: "Hosamane: try the home-search agent", description: DESCRIPTION, trail: [{ name: "Hosamane", path: "/hosamane" }] }),
  breadcrumbs([{ name: "Hosamane", path: "/hosamane" }]),
  {
    "@type": "WebApplication",
    "@id": `${abs("/hosamane")}#app`,
    name: "Hosamane",
    url: abs("/hosamane"),
    description: "An agentic-first home search for Bengaluru, for renting and buying. Describe your move; the agent searches listings, checks them, works out the real monthly cost and asks before it acts. A design prototype with fictional listings.",
    applicationCategory: "LifestyleApplication",
    operatingSystem: "Any (web browser)",
    browserRequirements: "Requires JavaScript",
    isAccessibleForFree: true,
    offers: { "@type": "Offer", price: "0", priceCurrency: "INR" },
    creator: { "@id": PERSON_ID },
    subjectOf: { "@type": "Article", name: "Hosamane: an agent that does a good broker's legwork", url: abs("/work/hosamane") },
  },
);

export default function Page() {
  return (
    <>
      <JsonLd data={jsonLd} />
      <App />
    </>
  );
}
