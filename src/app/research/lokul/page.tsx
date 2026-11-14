import Link from "next/link";
import { CaseCta, CaseKicker, Section, caseLabel } from "@/components/case/CaseParts";
import { BarList, MarketCircles, StatTiles } from "@/components/sketch/charts";
import Doodle from "@/components/sketch/Doodle";
import DrawOnView from "@/components/sketch/DrawOnView";
import { BeforeAfter, FlowRows, StepStrip } from "@/components/sketch/flows";
import { Tick } from "@/components/sketch/glyphs";
import PersonaCard, { type Persona } from "@/components/sketch/PersonaCard";
import { RadiusScene } from "@/components/sketch/scenes";
import { Pipeline, StatusLists } from "@/components/sketch/structures";

/*
 * Lokul: a hyperlocal neighbourhood platform for urban India. Content from the Lokul research and monorepo.
 * The old page linked to a private repo and five "#" placeholders; those links are gone until they're public.
 */

const phases = [
  { name: "v1 · Society app", text: "2024 · Feed, safety, chat, marketplace and society operations: one app instead of WhatsApp groups, MyGate and classifieds.", items: [] },
  { name: "v2 · Peer economy", text: "2025 · Peer roles, a local business hub, communities and group buying: anyone within 200 m can be supply.", items: [] },
  { name: "v3 · National OS", text: "2026 onwards · 40 modules in 12 categories: rural economy, health, education, civic, disaster resilience.", items: [] },
];

const flow = [
  { label: "01", title: "Onboard", text: "Phone OTP and a PIN.", doodle: "talk" },
  { label: "02", title: "Verify", text: "Bronze, Silver, then Gold KYC.", doodle: "shield" },
  { label: "03", title: "Locate", text: "Society, tower and a 200 m radius.", doodle: "pin" },
  { label: "04", title: "Engage", text: "Feed, chat and communities.", doodle: "team" },
  { label: "05", title: "Transact", text: "Marketplace and peer roles.", doodle: "store" },
];

const roles = [
  { doodle: "cook", name: "Cook", text: "List a daily menu, take tiffin orders and get paid. No GST, no shop." },
  { doodle: "rider", name: "Rider", text: "Post availability for errands and deliveries within 200 m; earn per trip." },
  { doodle: "coach", name: "Coach", text: "Sessions, a booking calendar and payments: fitness, music, language, tutoring." },
  { doodle: "tag", name: "Reseller", text: "Buy and relist within the neighbourhood, with no stock risk." },
];

const personas: Persona[] = [
  { name: "Priya", role: "Resident", meta: "26–45 · uses eight WhatsApp groups for society, kirana, rides and school", figures: [{ src: "/doodles/people/lokul-priya.svg", alt: "Doodle of Priya on her phone." }], lists: [{ label: "Needs", items: ["One place that replaces all of them."] }], basis: "proto" as const },
  { name: "Ramesh", role: "Kirana owner", meta: "35–55 · knows customers by face, loses business to BigBasket", figures: [{ src: "/doodles/people/lokul-ramesh.svg", alt: "Doodle of Ramesh, smiling." }], lists: [{ label: "Needs", items: ["A digital storefront that reaches exactly his 500 m."] }], basis: "proto" as const },
  { name: "Meena", role: "Peer cook", meta: "28–50 · cooks biryani her neighbours love", figures: [{ src: "/doodles/people/lokul-meena.svg", alt: "Doodle of Meena with a cup." }], lists: [{ label: "Needs", items: ["A way to earn without setting up a formal business."] }], basis: "proto" as const },
  { name: "Arun", role: "Coach", meta: "25–40 · fitness trainer with spare capacity within 1 km", figures: [{ src: "/doodles/people/lokul-arun.svg", alt: "Doodle of Arun, determined." }], lists: [{ label: "Needs", items: ["Discovery, booking and payment in one place."] }], basis: "proto" as const },
  { name: "Rajan", role: "Senior resident", meta: "60+ · lives alone and trusts his neighbours", figures: [{ src: "/doodles/people/lokul-rajan.svg", alt: "Doodle of Rajan in a sweater and glasses." }], lists: [{ label: "Needs", items: ["Large type, his own language, SOS and someone to run errands."] }], basis: "proto" as const },
  { name: "Ananya", role: "New arrival", meta: "22–32 · just moved in and knows nobody", figures: [{ src: "/doodles/people/lokul-ananya.svg", alt: "Doodle of Ananya." }], lists: [{ label: "Needs", items: ["Which kirana is good, who the neighbours are, what's nearby."] }], basis: "proto" as const },
].map((p) => ({ ...p, basisNote: "A persona from the Lokul research: an assumption until interviews confirm it." }));

const decisions = [
  ["Radius as the primitive", "200 m, 500 m or 2 km is the core filter, not the social graph or categories", "Geography binds neighbourhood commerce. People widen the radius on purpose; it's never the default."],
  ["Role fluidity", "One profile, many roles: a toggle turns on Cook, Rider, Coach or Reseller", "Everyone is resident, buyer and seller at once. Separate apps or accounts kill adoption."],
  ["Tiered trust", "Bronze (phone), Silver (address), Gold (ID and selfie); features unlock by tier", "Trust isn't binary: reading the feed, trading and becoming a merchant need different proof."],
  ["Anyone is supply", "No gatekeeping on who can offer a service", "Lokul doesn't create supply; it surfaces what already exists within verified proximity."],
  ["Businesses are peers", "Local businesses post in the same feed as residents", "A separate ads section kills the community feel and the merchant's return."],
  ["Offline India first", "3G, low-end Android and regional languages", "The next 500 million smartphone users are on budget phones with patchy data."],
  ["Government as partner", "Aadhaar, DigiLocker, ONDC and ABDM, integrated rather than rebuilt", "Public digital infrastructure saves years: e-KYC, open commerce, interoperable health."],
];

const revenue = [
  { value: "5–8%", label: "Booking take-rate", note: "On in-app bookings; the seller earns net" },
  { value: "₹299–999", label: "Business listing, a month", note: "Storefronts for kirana, salon, clinic, school" },
  { value: "₹20–500", label: "Local reach boost", note: "Promote an offer within a chosen radius" },
  { value: "2–3%", label: "Community tools", note: "On ticketed events and group buys" },
  { value: "0.5%", label: "RWA dues", note: "Capped at ₹10 a transaction" },
  { value: "₹10–30", label: "Local delivery", note: "Per rider trip, paid by the buyer" },
];

const built = [
  "Monorepo: Next.js 16 web, React Native and Expo mobile, shared ui-tokens",
  "42 Prisma models across identity, societies, feed, marketplace, safety, wallet and platform",
  "90+ mobile screens in 28 route groups",
  "46+ API routes; an admin CMS with 43 route groups",
  "Real-time chat, feed, SOS and group buying on Ably",
  "Razorpay integration (dev mode); Cloudflare Worker for geo and SOS escalation",
  "Playwright end-to-end tests with mobile emulation; load tests",
];
const next = [
  "Production payments, SMS OTP and push notifications",
  "Production database and secrets",
  "RBI PPI compliance for wallets over ₹10K a month",
  "Terms, privacy policy and a grievance officer",
  "App Store and Play Store submission",
  "Rate limiting and auth hardening",
];

const release = [
  { name: "Closed alpha", text: "Month 3 · 1 locality, 100 users, 10 businesses; one peer role (Cook).", items: [] },
  { name: "Open beta", text: "Month 5 · 10 localities, 2,000 users, 100 businesses; all peer roles.", items: [] },
  { name: "GA 2.0", text: "Month 8 · Mumbai MMR; all 20 modules; 50K users.", items: [] },
  { name: "v2.1", text: "Month 11 · Pune and Bengaluru; Tamil and Kannada.", items: [] },
  { name: "v2.2", text: "Month 14 · Top-8 metros; Telugu, Bengali, Gujarati.", items: [] },
];

const vision = [
  { label: "Rural economy and farmers", value: 8 }, { label: "Healthcare and wellness", value: 5 }, { label: "Education and skilling", value: 4 },
  { label: "Women's empowerment", value: 4 }, { label: "Civic governance", value: 4 }, { label: "Disaster resilience", value: 3 },
  { label: "Senior care", value: 3 }, { label: "Financial inclusion", value: 3 },
];

export default function LokulResearchPage() {
  return (
    <article className="pt-28 md:pt-36">
      <header className="container-premium">
        <CaseKicker domain="Research · Product · Architecture" status="Research project, code-complete in most areas" />
        <div className="mt-3 grid items-center gap-10 lg:grid-cols-[minmax(0,6fr)_minmax(0,5fr)] [&>*]:min-w-0">
          <div>
            <h1 className="max-w-[16ch]">Lokul: the <span className="whitespace-nowrap">200-metre</span> economy.</h1>
            <p className="mt-6 max-w-[54ch] text-lg leading-relaxed text-muted">
              A hyperlocal neighbourhood platform for urban India. The kirana downstairs, the home cook next door and the coach two floors up are already
              there; Lokul makes them findable, verified and paid, within 200 metres.
            </p>
          </div>
          <RadiusScene className="mx-auto w-full max-w-[420px]" />
        </div>
        <div className="mt-12">
          <StatTiles items={[
            { value: "90+", label: "Mobile screens" },
            { value: "42", label: "Database models" },
            { value: "46+", label: "API routes" },
            { value: "3", label: "Product phases" },
          ]} />
        </div>
      </header>

      <Section id="evolution" tone="tint" eyebrow="Product evolution" title="From one society to a national platform.">
        <Pipeline stages={phases} />
      </Section>

      <Section id="flow" eyebrow="User flow" title="From onboarding to a first transaction.">
        <StepStrip steps={flow.map((s, i) => ({ label: s.label, title: s.title, text: s.text, doodle: <Doodle name={s.doodle} className="h-12 w-12" i={i} /> }))} />
      </Section>

      <Section id="thesis" tone="tint" eyebrow="The thesis" title="The demand and supply already exist." intro="India's hyperlocal economy is large, alive and unplatformed. Lokul doesn't create demand or supply; it makes them visible to each other within a verified radius.">
        <BeforeAfter
          before={{ label: "Today · unplatformed", doodle: <Doodle name="apart" className="h-12 w-12" />, items: ["A neighbour's biryani that 20 people want, with no way to order it", "The kirana below the building, losing business to BigBasket", "A trainer two floors up with 6 clients on WhatsApp, who could have 60", "A school's admissions on a notice board parents never see"] }}
          after={{ label: "The three unlocks", doodle: <Doodle name="pin" className="h-12 w-12" />, items: ["Radius as the primitive: 200 m, 500 m, 2 km", "Role fluidity: every resident can also be a seller, cook, rider or coach", "Trust by proximity: verified identity and payments on top of neighbours who already know each other"] }}
        />
        <div className="mt-16">
          <MarketCircles
            rings={[
              { name: "SAM", size: "₹1,450 Cr", value: "28K societies a year", desc: "Gated societies with RWAs in the top eight metros" },
              { name: "TAM", size: "₹8,200 Cr", value: "180K localities a year", desc: "Plus non-gated neighbourhoods and tier-2 clusters" },
              { name: "Long tail", size: "₹47,000 Cr", value: "1.2M clusters a year", desc: "Plus gram panchayats and semi-urban PIN codes" },
            ]}
            note="Market sizing from the Lokul research, not yet tested in the market."
          />
        </div>
      </Section>

      <Section id="people" eyebrow="People" title="Who Lokul serves." intro="Six personas, from the resident who does everything to the senior who lives alone.">
        <DrawOnView className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 [&>*]:min-w-0">
          {personas.map((p, i) => <PersonaCard key={p.name} persona={p} i={i * 2} />)}
        </DrawOnView>
      </Section>

      <Section id="product" tone="tint" eyebrow="The product" title="Everything within 200 metres.">
        <div className="grid gap-5 md:grid-cols-2 [&>*]:min-w-0">
          {[
            { doodle: "pin", title: "Feed and radius discovery", sub: "200 m · 500 m · 2 km", text: "One feed of neighbourhood activity: updates, safety alerts, lost items, events, polls and business offers, filtered by a radius you choose.", items: ["Business posts sit alongside residents' posts", "Reactions, nested comments and 24-hour stories"] },
            { doodle: "shield", title: "Safety and SOS", sub: "Panic button · proximity waves · responders", text: "On trigger: a 5-second countdown, live location to trusted contacts, a 200 m wave to nearby volunteers, and recording.", items: ["Widens to 400 m if no one responds in 60 s", "Verified volunteer responders; a medical profile for them"] },
          ].map((f) => (
            <DrawOnView key={f.title} className="flex flex-col gap-4 rounded-2xl bg-background p-6 ring-1 ring-border ring-inset">
              <div className="flex items-center gap-4">
                <Doodle name={f.doodle} className="h-12 w-12 shrink-0 text-foreground" />
                <div>
                  <h3 className="text-lg">{f.title}</h3>
                  <p className="font-mono text-xs text-muted">{f.sub}</p>
                </div>
              </div>
              <p className="text-compact text-muted">{f.text}</p>
              <ul className="grid gap-2">{f.items.map((it) => <li key={it} className="flex gap-2.5 text-compact"><Tick className="h-5 w-5 shrink-0 text-accent" />{it}</li>)}</ul>
            </DrawOnView>
          ))}
        </div>
        <h3 className="mt-16 text-xl">Peer roles: the supply side</h3>
        <p className="mt-2 max-w-[60ch] text-compact text-muted">Any resident can switch on a role from Silver verification up. No business registration, no separate account.</p>
        <DrawOnView className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 [&>*]:min-w-0">
          {roles.map((r, i) => (
            <div key={r.name} className="sk-fade flex flex-col gap-3 rounded-2xl bg-background p-5 ring-1 ring-border ring-inset" style={{ "--sk-i": i } as React.CSSProperties}>
              <Doodle name={r.doodle} className="h-12 w-12 text-foreground" i={i} />
              <h4 className="text-lg">{r.name}</h4>
              <p className="text-compact text-muted">{r.text}</p>
            </div>
          ))}
        </DrawOnView>
        <ul className="mt-8 grid gap-x-8 gap-y-3 sm:grid-cols-2 lg:grid-cols-3">
          {[
            ["Communities", "Morning walks, book clubs, parents' networks, with member roles."],
            ["Group buying", "Bulk orders with commit thresholds and split payments."],
            ["Carpool", "Trips within the locality, with price splitting."],
            ["Local business hub", "Storefronts, slot booking and orders."],
            ["Tiffin ordering", "Daily menus from home cooks, by order or subscription."],
            ["Society operations", "Visitor passes, staff attendance, notices, polls and dues."],
          ].map(([t, d]) => <li key={t} className="border-t border-border pt-3 text-compact"><span className="font-medium">{t}.</span> <span className="text-muted">{d}</span></li>)}
        </ul>
      </Section>

      <Section id="architecture" eyebrow="Architecture" title="Built for a ₹8,000 phone on 3G." intro="A monorepo with a Next.js web app, a React Native and Expo mobile app with 90+ screens, and a shared token package, over 42 database models.">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-14 [&>*]:min-w-0">
          <div>
            <h3 className="text-xl">Stack</h3>
            <dl className="mt-5 grid">
              {[
                ["Apps", "Next.js 16 (web), Expo SDK 56 (mobile)"], ["Data", "PostgreSQL 16 with PostGIS, Prisma 7"], ["Cache and queue", "Redis 7 and BullMQ"],
                ["Real time", "Ably: chat, feed, SOS"], ["Auth", "Phone OTP via MSG91; NextAuth for admin"], ["Payments", "Razorpay, with Cashfree as backup"],
                ["Storage", "Cloudflare R2"], ["Edge", "Cloudflare Worker: geo headers, SOS cron"],
              ].map(([k, v]) => (
                <div key={k} className="grid grid-cols-[8rem_minmax(0,1fr)] gap-4 border-t border-border py-2.5 text-compact">
                  <dt className="text-muted">{k}</dt>
                  <dd>{v}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div>
            <h3 className="text-xl">Principles</h3>
            <DrawOnView className="mt-5 grid gap-3 sm:grid-cols-2">
              {[
                { doodle: "pin", t: "The PIN code is the unit", d: "Every entity has a PIN code and a geocode; discovery, feed and safety radiate from it." },
                { doodle: "shield", t: "Trust is tiered", d: "Bronze, Silver, Gold. Features unlock by tier, and tiers can drop." },
                { doodle: "talk", t: "Real time by default", d: "Feed, chat, SOS and polls are pushed, never polled." },
                { doodle: "clock", t: "Offline-first reads", d: "The last 200 feed items, chats and profile are cached; writes queue." },
              ].map((p, i) => (
                <div key={p.t} className="sk-fade flex flex-col gap-2 rounded-2xl bg-surface p-4" style={{ "--sk-i": i } as React.CSSProperties}>
                  <Doodle name={p.doodle} className="h-9 w-9 text-foreground" i={i} />
                  <p className="font-medium">{p.t}</p>
                  <p className="text-compact text-muted">{p.d}</p>
                </div>
              ))}
            </DrawOnView>
          </div>
        </div>
      </Section>

      <Section id="decisions" tone="tint" eyebrow="Design decisions" title="The choices that shaped Lokul.">
        <FlowRows head={["Decision", "The choice", "Why"]} rows={decisions} emphasis={1} />
      </Section>

      <Section id="business" eyebrow="Business model" title="Lokul earns when neighbours trade." intro="Earning from transactions, not from charging for visibility. Supply earns; Lokul takes a small share across several lines.">
        <StatTiles items={revenue} cols="sm:grid-cols-2 lg:grid-cols-3" />
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {[
            { round: "Pre-seed", target: "₹1–2 Cr ($120–240K)", detail: "SAFE at a ₹15–20 Cr valuation cap" },
            { round: "Seed", target: "₹8–15 Cr ($1–2M)", detail: "18 months of runway, a team of 8–12" },
            { round: "Investors to approach", target: "Blume, Prime, Elevation, Stellaris, 3one4", detail: "Angels: Kunal Shah, Amrish Rau, Jitendra Gupta" },
          ].map((f) => (
            <div key={f.round} className="rounded-2xl border border-dashed border-border-strong p-5">
              <p className={caseLabel}>{f.round}</p>
              <p className="mt-2 font-medium">{f.target}</p>
              <p className="mt-1 text-compact text-muted">{f.detail}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section id="status" tone="tint" eyebrow="Status" title="Where Lokul is today." intro="Code-complete in most areas, with about four to six weeks of production integration left.">
        <StatusLists built={built} next={next} builtLabel="Built" nextLabel="Before launch" />
        <h3 className="mt-16 text-xl">Release plan</h3>
        <div className="mt-6"><Pipeline stages={release} /></div>
      </Section>

      <Section id="vision" eyebrow="Phase 3 vision" title="The operating system of Bharat." intro="From a hyperlocal app to national infrastructure: 40 modules in 12 categories. These are the largest eight.">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-14 [&>*]:min-w-0">
          <BarList items={vision} highlight={[0]} caption="Modules per category." />
          <dl className="grid content-start gap-x-6 sm:grid-cols-2">
            {[["Rural households", "900M"], ["Informal workers", "500M+"], ["Women not in the workforce", "350M"], ["Agricultural workers", "270M"], ["Youth seeking income", "200M"], ["Senior citizens", "180M"], ["Tribal communities", "104M"], ["People with disabilities", "50M"]].map(([k, v]) => (
              <div key={k} className="flex items-baseline justify-between gap-4 border-t border-border py-2.5">
                <dt className="text-compact text-muted">{k}</dt>
                <dd className="font-mono text-sm tabular-nums">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
        <p className="mt-10 text-compact text-muted">
          The repository and research documents aren&apos;t public yet. Related: <Link href="/research/forma" className="text-foreground underline decoration-border-strong underline-offset-4 hover:text-accent">Forma, malleable software</Link> · <Link href="/work/hosamane" className="text-foreground underline decoration-border-strong underline-offset-4 hover:text-accent">Hosamane, a home-search agent for Bengaluru</Link>
        </p>
      </Section>

      <CaseCta title="Building for the next 500 million users?" />
    </article>
  );
}
