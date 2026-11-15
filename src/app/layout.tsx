import type { Metadata, Viewport } from "next";
import { JetBrains_Mono, Poppins } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";
import ScrollProgress from "@/components/ScrollProgress";
import SmoothScroll from "@/components/SmoothScroll";
import BackToTop from "@/components/BackToTop";
import MotionProvider from "@/components/MotionProvider";
import { SiteOnly } from "@/components/SiteChrome";
import SketchDefs from "@/components/sketch/SketchDefs";
import { SITE_URL } from "@/lib/site";
import JsonLd from "@/components/JsonLd";
import { graph, ogImage, PERSON_ID, SITE_NAME, WEBSITE_ID } from "@/lib/seo";

// Two families: Poppins for every page and case study (one typeface across the site and the Hosamane app), and
// JetBrains Mono only where text must line up as code: tag names, code samples and small labels.
const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Vivekanand Choudhari · Senior UI/UX & AI Product Designer",
    template: "%s · Vivekanand Choudhari",
  },
  description:
    "Senior UI/UX and AI product designer in Bengaluru with 9+ years in B2B SaaS, AdTech and AI. Case studies, agentic interfaces, design systems and live labs.",
  keywords: [
    // Name variations for search
    "Vivekanand Choudhari",
    "Vivekanand Choudhari UX Designer",
    "Vivekanand Choudhari Product Designer",
    "Vivekanand Choudhari Portfolio",
    "Vivekanand Choudhari Bengaluru",
    "Vivekanand Choudhari India",
    // Job titles and roles
    "Senior UI/UX Designer",
    "UX Design Lead",
    "Product Design Leader",
    "Design Strategist",
    "AI Product Designer",
    "UI/UX Designer",
    "Design Engineering",
    // Specializations
    "Agentic UI Design",
    "AI Interface Design",
    "Conversational AI Design",
    "AI Product Design",
    "Machine Learning UX",
    "LLM Product Design",
    // DOOH & AdTech
    "Programmatic DOOH",
    "Digital Out of Home",
    "DOOH Platform Design",
    "OpenRTB 2.6",
    "DSP Design",
    "SSP Integration",
    "AdTech UX",
    "Programmatic Advertising",
    "RTB Platform",
    "IAB Standards",
    // Product Design
    "0-to-1 Product Design",
    "Product Discovery",
    "UX Strategy",
    "End-to-End Product Design",
    // Design Systems & Engineering
    "Design Systems",
    "Component Libraries",
    "Design Tokens",
    "Frontend Design",
    "React Designer",
    "TypeScript UX",
    "Figma Expert",
    // Industries
    "B2B SaaS Design",
    "Enterprise UX",
    "Healthcare UX",
    "Construction Tech",
    "IoT Dashboard Design",
    "Big Data Visualization",
    // Methods & Frameworks
    "Design Thinking",
    "User Research",
    "Contextual Inquiry",
    "Jobs to be Done",
    "Behavioral Psychology",
    "Lean UX",
    // Location
    "UX Designer Bengaluru",
    "Product Designer Bangalore",
    "India AI Product Designer",
  ],
  authors: [
    {
      name: "Vivekanand Choudhari",
      url: SITE_URL,
    },
  ],
  creator: "Vivekanand Choudhari",
  publisher: "Vivekanand Choudhari",
  category: "Design & Technology",
  // Defaults only: every page sets its own full set through pageMeta() (src/lib/seo.ts), because Next merges
  // metadata shallowly and a page's openGraph replaces this one entirely.
  openGraph: {
    title: "Vivekanand Choudhari · Senior UI/UX & AI Product Designer",
    description: "Senior UI/UX and AI product designer in Bengaluru with 9+ years in B2B SaaS, AdTech and AI.",
    url: "/",
    images: [{ url: ogImage("Senior UI/UX Designer & AI Product Designer"), width: 1200, height: 630, alt: "Vivekanand Choudhari, Senior UI/UX and AI Product Designer" }],
    siteName: SITE_NAME,
    locale: "en_US",
    type: "profile",
  },
  twitter: {
    card: "summary_large_image",
    title: "Vivekanand Choudhari · Senior UI/UX & AI Product Designer",
    description: "Senior UI/UX and AI product designer in Bengaluru with 9+ years in B2B SaaS, AdTech and AI.",
    images: [ogImage("Senior UI/UX Designer & AI Product Designer")],
  },
  robots: {
    index: true,
    follow: true,
  },
};

// Browser chrome (Safari's toolbar, Android's address bar) takes the page's background colour.
export const viewport: Viewport = { themeColor: "#FFFFFF" };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Enhanced Person schema for Google and AI search engines
  const personJsonLd = {
    "@type": "Person",
    "@id": PERSON_ID,
    name: "Vivekanand Choudhari",
    alternateName: ["Vivekanand", "Vivek Choudhari"],
    url: SITE_URL,
    image: `${SITE_URL}/api/og?title=Vivekanand%20Choudhari&category=Portfolio`,
    jobTitle: "Senior UI/UX Designer & AI Product Designer",
    worksFor: {
      "@type": "Organization",
      name: "Moving Walls",
      sameAs: "https://www.movingwalls.com",
    },
    description:
      "Design leader with 9+ years across AdTech, Construction Cloud, Healthcare, AIOps, IIoT, and Big Data. Specializes in AI-powered products, agentic interfaces, programmatic DOOH platforms, and design systems. Leads UX and design systems across a 7-product programmatic DOOH portfolio.",
    email: "vivekanand.design@gmail.com",
    telephone: "+919071933517",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Bengaluru",
      addressRegion: "Karnataka",
      addressCountry: "IN",
    },
    nationality: {
      "@type": "Country",
      name: "India",
    },
    knowsAbout: [
      "UI/UX Design",
      "AI Product Design",
      "Agentic UI",
      "Conversational Interfaces",
      "Large Language Models (LLM) UX",
      "Programmatic DOOH",
      "OpenRTB 2.6",
      "IAB Taxonomies",
      "DSP / SSP Ecosystems",
      "Real-Time Bidding",
      "Design Systems",
      "Component Libraries",
      "Design Tokens",
      "UX Strategy",
      "Design Leadership",
      "User Research",
      "Contextual Inquiry",
      "Jobs to be Done (JTBD)",
      "Behavioral Psychology",
      "Frontend Engineering",
      "React",
      "TypeScript",
      "Figma",
      "Design Engineering",
      "B2B SaaS Design",
      "Enterprise UX",
      "AdTech",
      "Healthcare UX",
      "Construction Tech",
      "IoT Dashboards",
      "Data Visualization",
    ],
    hasOccupation: {
      "@type": "Occupation",
      name: "UX Designer",
      occupationLocation: {
        "@type": "City",
        name: "Bengaluru",
      },
      skills: [
        "User Experience Design",
        "UI Design",
        "AI Product Design",
        "Design Systems",
        "Frontend Development",
        "User Research",
        "Interaction Design",
        "Visual Design",
        "Prototyping",
        "Design Thinking",
      ],
      experienceRequirements: "9+ years",
    },
    sameAs: [
      "https://www.linkedin.com/in/vivekanand-choudhari-817829118/",
      "https://github.com/vivekanandchoudhari",
      "https://dribbble.com/VivekanandChoudhari",
      "https://www.behance.net/vivekanand6f29C",
      SITE_URL,
    ],
    alumniOf: [
      {
        "@type": "EducationalOrganization",
        name: "Manipal Institute of Technology",
      },
    ],
  };

  const websiteJsonLd = {
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    url: SITE_URL,
    name: SITE_NAME,
    description: "Portfolio, case studies, research and interaction labs by Vivekanand Choudhari, a senior UI/UX and AI product designer.",
    inLanguage: "en",
    publisher: { "@id": PERSON_ID },
    author: { "@id": PERSON_ID },
  };

  return (
    <html
      lang="en"
      className={`${poppins.variable} ${jetbrainsMono.variable} h-full antialiased`}
      // Browser extensions (e.g. Scribe's data-scribe-recorder-ready) write attributes
      // onto <html> before React hydrates. This only silences mismatches in <html>'s
      // own attributes — real mismatches in the page below are still reported.
      suppressHydrationWarning
    >
      <head>
        {/* Search-console verification: add the real token here (or via
            metadata.verification.google) once the property is set up — a
            placeholder value verifies nothing. */}
        {/* Geo-targeting for local search */}
        <meta name="geo.region" content="IN-KA" />
        <meta name="geo.placename" content="Bengaluru" />
        <meta name="geo.position" content="12.9716;77.5946" />
        <meta name="ICBM" content="12.9716, 77.5946" />
      </head>
      <body className="min-h-full flex flex-col">
        {/* The site and the person, once, with stable ids that every page's own graph points to. */}
        <JsonLd data={graph(websiteJsonLd, personJsonLd)} />
        <a href="#main-content" className="skip-link">
          Skip to content
        </a>
        <SketchDefs />
        <MotionProvider>
          <div className="relative overflow-x-clip">
            <SmoothScroll />
            {/* Hidden on full-screen app routes (/hosamane), which bring their own navigation. */}
            <SiteOnly>
              <ScrollProgress />
              <Navbar />
            </SiteOnly>
            <main id="main-content" className="flex-1">
              <PageTransition>{children}</PageTransition>
            </main>
            <SiteOnly>
              <Footer />
              <BackToTop />
            </SiteOnly>
          </div>
        </MotionProvider>
      </body>
    </html>
  );
}
