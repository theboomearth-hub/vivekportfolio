# Competitive analysis: agentic-first home search for Bengaluru (rent and buy)

> Research file for [02-desk-research.md](02-desk-research.md). Compiled 13 Nov 2026 with AI-assisted desk research; 11 key claims were spot-checked against their sources (see 02 §6).

Compiled 13 Nov 2026. This is desk research from official sites, help centres, app-store listings, press releases and news coverage. Every factual claim cites a numbered source in [§ Sources](#sources). Each source shows its publication date, or says that no date was available.

## How to read this

**Matrix legend**

| Mark | Meaning |
|---|---|
| ✓ | A cited source shows the feature exists |
| partial | The feature exists in a limited form, or only off-platform (for example, only inside ChatGPT) |
| ✗ | A cited source says the feature is not offered |
| unverified | I could not confirm it either way. This usually means I searched and found nothing. It does **not** prove the feature is absent |

**Caveats on the evidence**

- **Company claims.** Many figures are self-reported by the company (for example engagement uplifts, "100% verified", subscriber counts). They are labelled as company claims where they appear.
- **Blocked pages.** Several sites refused automated access, including magicbricks.com, parts of 99acres.com, housing.com/news, zillow.com, Deccan Herald and The Quint. For those, the evidence comes from a search engine's summary of the page and is marked *(via search summary; page not opened)* in the source list. Treat these as weaker evidence.
- **App-store listings.** These were read on 13 Nov 2026 and describe the latest version at that time. Some listings show a day and month but no year. Where that happens the year is inferred and the source list says so.
- **Analysis is labelled.** The "Gaps and opportunities" section is **analysis, not fact**.

---

## 1. India

### 1.1 NoBroker (Bengaluru-headquartered; rent, buy, flatmates)

**Positioning and who pays**

- **Positioning.** NoBroker is "owner-direct, no brokerage". The app pitches renting or buying from owners without brokerage, plus add-on services: rental agreements, packers and movers, home loans, rent payment by credit card and home services [4].
- **Who pays: seekers.** Tenants buy paid plans [1]:
  - *Freedom* gives up to 25 owner contacts, which you contact yourself.
  - *Relax* gives up to 50 contacts plus a dedicated relationship manager (RM). The RM sets up owner appointments and helps negotiate rent, but does not accompany visits.
  - *Assure* adds a money-back guarantee if you find a house "via someone else" within the validity period.
  - A *MoneyBack* plan is also mentioned.
  - The page shows ₹999, ₹2,999 and ₹5,499 but does not say which price belongs to which plan [1].
- **Uptake.** Inc42 reports premium services at about ₹3,000 per user per month, with "not many users … opting for this consistently". Inc42 also says NoBroker keeps "nearly 90% of its users free" [5].
- **Revenue mix.**
  - FY24 revenue was ₹803 Cr, about 90% of it from core rental and listings [5].
  - By FY26 the core business was "close to 50%" of revenue. Home-loan aggregation (about 22.4%) and home services make up most of the rest [5].
  - These are company figures, and FY25 and FY26 audited accounts were not filed at the time of that report [5].

**Notable features**

- **Rent search filters** [2]:
  - BHK, rent range, availability, furnishing and parking
  - Preferred tenants: Family, Company, Bachelor Male, Bachelor Female
  - "Visit properties within next 2 days" and "Show properties where owner is hosting a visit"
  - "Premium Filters"
  - A List/Map toggle, and "Save Search"
- **Listing cards** show rent, deposit and maintenance separately. Pages carry a "100% Verified Owner Properties" label, but the verification method is not explained [3] *(via search summary)*.
- **In-app tools.** The app has scheduling of property visits, a locality "life score", and a "Know Your Rent" fairness check [4].
- **Metro-based search.** NoBroker introduced metro-based property search in 2023 [14] *(via search summary)*.
- **In-app chat** between renters and owners, according to a vendor case study [7]:
  - Group chats that include NoBroker staff, in-chat translation, and in-app calling.
  - Claimed result: "nearly 25% increase in successful transactions when the user has an in-app chat touch" (company/vendor claim).
- **EMI calculator** pages exist [15].

**AI**

- **ConvoZen.AI.** Launched in Feb 2025 as an *enterprise* conversational and voice-AI cloud [8]:
  - About 6–6.5 lakh conversations happen inside NoBroker each day, and 30–35% are handled by voice AI [9].
  - Founder Akhil Gupta reportedly said AI handles about 35% of conversations end to end [10] *(aggregator citing Business Standard, 26 Aug 2026)*.
  - The same report says AI let NoBroker remove the teams that checked rented-out properties and photo uploads [10].
- **"Owner AI Assist"** appears in the app's version notes (v8.3.8). Its scope is unverified [4].
- **Consumer natural-language search.** No consumer-facing natural-language search or AI agent was found.

**Brokers posing as owners; fake and stale listings**

- **Founding stance.** Excluding brokers is central to the model. In 2017 NoBroker said brokers are spotted from search behaviour ("A broker has a very different way of accessing the site") and that "If user is a broker, we will ban him from the system" [6].
- **Published penalties.** No published terms with broker penalties were found. The terms URLs tried redirected to a 404 page.
- **Stale listings.** AI reportedly took over checking rented-out properties [10] (secondary source). No public listing-expiry policy was found.
- **Documented failure.** A man "posing as a broker on the NoBroker app" collected ₹8–13 lakh lease advances from each of 22 people (about ₹2 Cr in total) for a Hebbal house he never handed over. An FIR was filed and the case was escalated to the Central Crime Branch [11].
- **Context.** In Sept 2015, more than 50 brokers stormed NoBroker's HSR Layout office, accusing it of ruining their livelihood [12].

### 1.2 99acres (Info Edge)

**Positioning and who pays**

- Info Edge says 99acres caters "primarily to real estate developers, builders and brokers". It sells paid listings plus builder and broker branding: microsites, homepage links and banners [17].
- Revenue is subscription-led. Billings grew 21% in Q2 FY27, and a product called "Matchmaking" is growing [18].
- No paid plan for seekers was found (unverified).

**Notable features** (app listing [16] unless noted)

- "Advance Filter Search" and "smart search"
- A map that helps locate civic amenities
- Price trends, resident locality reviews, and "similar localities"
- Owners get a relationship manager and can post listings via WhatsApp
- Rent listings show security deposit and maintenance [20] *(via search summary)*
- EMI calculator [21] and Bangalore price-trend pages [22]
- Project pages carry a "registered with RERA" badge, with the RERA number in the project description [19] *(via search summary)*

**AI**

- The app says it is "Backed by AI" to speed up search [16].
- No natural-language search, chatbot or ChatGPT app was found as of 13 Nov 2026. Info Edge's reported AI budget increase targets Naukri, its jobs site, not 99acres [18].

**Brokers posing as owners; fake and stale listings**

- **Verification.** A field verifier visits ready-to-move properties, checks the listing details and takes photos [17]. Physical verification is offered to homeowners free [16].
- **Policy on brokers posing as owners.** None found (unverified).
- **Documented fraud.** In Nov 2025, a fake "owner" on 99acres took a ₹10,000 UPI token from a Bengaluru renter [23]:
  - The listing was a Koramangala 2BHK at ₹35,000 a month, against roughly ₹1 lakh for similar flats.
  - The "owner" was "out of town", and the same photos appeared on Facebook and OLX under other names.
  - The article includes no response from 99acres [23].
- **Regulatory position.** In a Bihar RERA proceeding, 99acres argued it is "an advertising medium", not a real estate agent [24] *(via search summary)*.

### 1.3 Magicbricks (Times Internet)

**Positioning and who pays**

- Magicbricks is a listings marketplace, plus MagicLoans (home loans) and MagicInteriors. The CEO calls it "cash flow positive, profitable" and is weighing an IPO in 2027–28 [28].
- **Seekers pay** through MB Prime:
  - Launched Sept 2022 for "direct interactions between buyers/tenants and property owners", with relationship-manager support and virtual tours; the company reported 100,000 pre-launch subscribers [26].
  - Current in-app plans are MB Prime Basic and Pro (Buy and Rent), priced ₹899–₹3,999 [25].
- Advertisers can be called, sent an SMS or emailed free [25].

**Notable features** [25]

- Filters, plus list, photo and map views
- Property alerts and saved properties
- Locality reviews, ratings and locality comparison
- Price trends and agent search
- New "Property Advice": locality insights, price trends, legal advice
- In-app chat with advertisers that needs no phone number, launched 2019 to cut "spam calls" [27]
- PropWorth, an ML valuation tool launched Jul 2024 [29] *(via search summary)*

**AI**

- AI is integrated into internal workflows, with "significant improvement in listings moderation and document summarization" [28].
- No consumer natural-language search or ChatGPT app was found.

**Brokers posing as owners; fake and stale listings**

- **Verification.** No published listing-verification process was found (unverified). Recent App Store reviews allege visit-fee demands and mismatched listings; these are user claims [25].
- **Broker relations.** In 2025 the brokers' body NAR-India told members to boycott Magicbricks over videos it said misrepresented brokers. The boycott was resolved with a joint declaration [30] *(via search summary)*. This shows how much the portal depends on brokers as customers.

### 1.4 Housing.com (REA India; sale to Aurum PropTech agreed Jul 2026)

**Positioning and who pays**

- REA India describes Housing.com as an "online classified advertisement" platform [42].
- **Ownership is changing.** In Jul 2026 REA Group signed a binding agreement to sell Housing.com to Aurum PropTech. Completion was expected by the end of Q1 FY27 and was subject to Aurum shareholder approval [41]. Completion was not confirmed as of 13 Nov 2026.
- **Seekers pay** through Housing Premium, a subscription to contact owner listings directly [34]:
  - You can contact 2 owners free; after that you need to buy the plan [35].
  - At launch in Aug 2022 there were three 60-day tiers: Basic (10 contacts), Premium (25), and Assisted (unlimited contacts plus an RM). The plan included a money-back guarantee, and the company reported 25,000 subscribers [36].
  - Current prices were not found.

**Notable features**

- "Find properties near popular landmarks", "Notify Me" alerts and shortlists [38]
- Pay rent by credit card, plus valuation and rent-value calculators [38]
- EMI calculator [43]
- **Housing Chat** for buyer–seller messaging. About 10% of users use it, and monthly chat users grew from 20,000 to more than 400,000 in a year (company claim) [39]

**AI**

- **ChatGPT app**, launched 11 Jun 2026. Users "search for properties, refine their preferences, compare options" in conversation. Contacting owners and scheduling visits are not mentioned [40].

**Brokers posing as owners; fake and stale listings**

- **Verified tag.** A verified tag follows "a personal visit from one of our data collectors" plus further checks [31].
- **Self-verification.** Owners can self-verify with geotagged camera photos that an internal quality team reviews. The promised payoff is "upto 3X more leads" [32].
- **Fraud reporting.** Reports go through housing.com/report-fraud or email, and Housing.com promises to "respond within 24 hours with action taken on the reported profile". No penalties are stated [33].
- **Staleness control.** Free listings stay visible for up to 30 days (rent) or 60 days (sale) [37].

### 1.5 Square Yards (full-stack brokerage plus mortgages)

**Positioning and who pays**

- Square Yards is a "full-stack" proptech covering new-home sales and resale transactions, Azuro (rental and property management), Interior Company and Urban Money (mortgages) [47].
- About 60% of revenue comes from loan origination, at a blended take rate of 1.5%, and about 40% from real estate services [46].
- It works through about 70,000 partner brokers in a B2B2C model [46].
- No paid plan for seekers was found (unverified).

**Notable features** (app listing [45])

- Filters, including metro access
- "100% Verified Listings & Reviews", and free physical verification for sellers and landlords (company claim)
- "RERA-registered" agents
- Price trends and recent transaction data
- EMI and loan tracking through Urban Money
- "Zero-Deposit Rentals"
- One-tap site-visit calendar entries
- Price and construction alerts
- EMI calculator and Bangalore rates pages [50]

**AI**

- In-app "Square Yards AI" for property search arrived in v6.3 [45].
- **ChatGPT app**, Jun 2026, billed as "the first Indian company to launch an app on OpenAI's ChatGPT platform" [48]:
  - Users describe what they want and get curated options in the chat.
  - Interested users are "redirected to squareyards.com" to connect with advisors [48][49].

**Brokers posing as owners; fake and stale listings**

- Square Yards is itself an intermediary working with brokers, so "owner-only" is not its proposition.
- Verification is the app claim above [45]. No policy on brokers posing as owners or on stale listings was found (unverified).

---

## 2. Global references

### 2.1 Zillow (US)

**Positioning and who pays**

- FY2025 revenue was $2,583m [59]:
  - Residential: $1,704m, which is agents and software plus New Construction
  - Rentals: $630m
  - Mortgages: $199m
- **Renters pay** a $35 application fee for unlimited applications over 30 days [61] *(via search summary)*. Search itself is free.

**Notable features**

- **Natural-language search**, Jan 2023, with saved searches and alerts [51].
- **Natural-language extensions**, Sept 2024: commute time ("30 min drive from…"), monthly-budget, school and point-of-interest queries [53].
- **"Total price" for rentals**: base rent plus required monthly fees, with a Costs & Fees breakdown. It is required in Massachusetts from 2 Sept 2025 [60] *(via search summary)*.
- **Co-shopping**:
  - The Shopping Partner feature lets each person see the other's saved homes [62].
  - In-app messaging with co-shoppers arrived in Oct 2025. Zillow says "over 60% of buyers co-shop" [55].

**AI**

- **ChatGPT plugin**, May 2023 [52].
- **ChatGPT app**, 6 Oct 2025 [54]. Touring, agent contact and financing "still flow through Zillow".
- **Rentals AI Assist**, powered by EliseAI. It answers renter questions for property managers and books tours [55][63].
- **Zillow AI mode** (beta), 25 Mar 2026 [56]:
  - It remembers preferences across sessions.
  - It compares trade-offs, plans rent-versus-buy scenarios and explains affordability.
  - It can "Schedule tours or apply directly within the experience" and "Connect users with a trusted local agent".
  - A "Fair Housing Classifier" checks questions and answers in real time to prevent discriminatory steering.
- **Zillow app in Google Gemini**, rentals, Jul 2026 [57][58]:
  - Gemini shows tour times. You reply with the times you want, and Gemini books them, but only after showing your Zillow contact details for you to confirm.
  - Gemini *cannot* contact the property manager or owner, submit applications, or manage existing bookings [57].

**Fake and stale listings**

- Listings come from MLS/IDX feeds plus rental providers [54].
- Zillow says fraudulent rental listings are removed once found [64] *(via search summary; secondary)*. No verified-owner badge was confirmed.

### 2.2 Rightmove (UK)

**Positioning and who pays**

- **Agents only.** "Rightmove does not allow sellers to list directly"; every seller must go through an agent who follows agency law [71]. Rightmove ended its OpenRent partnership in Aug 2024, which removed a route for private landlords [76] *(via search summary)*.
- **Who pays.** Revenue comes from advertiser subscriptions. Average revenue per advertiser (ARPA) was £1,524 a month in FY2024 [74] *(via search summary)*. No seeker charges were found.

**Notable features**

- Draw-a-search, property alerts, and "My Places" travel time to up to 5 places [72] *(via search summary)*.
- UK "material information" rules require price or rent, council tax band and tenure on listings [73] *(via search summary)*.

**AI**

- **AI Keywords**, Nov–Dec 2025 [67].
- **"Use AI"/Ask Rightmove** conversational search, a Gemini/Google Cloud beta for "a limited portion" of users [65][67].
- **ChatGPT app**, launched the week of 9 Mar 2026. It returns a carousel of up to 5 listings and sends users to Rightmove to contact agents [66][67].
- **Evaluation Assistant** on listing pages, Jul 2026 [69].
- **Comparison Assistant** in search results, Oct–Nov 2026 (date inferred) [70].
- **How Ask Rightmove works** [68]:
  - It draws on agent listings, Google location data and Land Registry sold prices.
  - A "sources" button shows where the information came from.
  - Compare mode builds a table of up to 5 homes.
  - "It's not possible to switch off the experience entirely", but users can choose "Classic" search.
- **Company-reported results.** Ask Rightmove users spent 40% longer on the site, saved more than twice as many homes and sent about twice as many leads to agents [70].

**Fake and stale listings**

- Only agents can list [71], and Rightmove says a team monitors for fake listings [75] *(via search summary)*.

### 2.3 Redfin (US; owned by Rocket since 1 Jul 2025)

**Positioning and who pays**

- Redfin is a brokerage with its own agents. It is now "Redfin Powered by Rocket", with mortgages through Rocket [79][80].

**Notable features**

- Commute feature, real-time alerts, "Schedule home tours instantly", and sharing homes with a search partner [80].
- Shared Favorites (2015): co-buyers see and comment on each other's favourites [81][82].

**AI**

- **Conversational search**, 13 Nov 2025, built with Sierra [77]:
  - It asks follow-ups such as commute time and school proximity.
  - Company-reported results: users view nearly 2× more listings and are 47% more likely to request tours.
- **ChatGPT app**, 6 Feb 2026. It lets users refine searches "without re-entering" criteria [78].

---

## 3. Combined feature matrix

Numbers in brackets are source numbers. "(ss)" means the source was read via a search summary only.

| Feature | NoBroker | 99acres | Magicbricks | Housing.com | Square Yards | Zillow | Rightmove | Redfin |
|---|---|---|---|---|---|---|---|---|
| Natural-language / AI search | unverified (AI is enterprise/support [8][10]) | unverified ("Backed by AI" claim [16]) | unverified (AI internal only [28]) | partial (inside ChatGPT only [40]) | ✓ [45][48] | ✓ [51][53][56] | ✓ beta [65][68] | ✓ [77] |
| Standard filters | ✓ [2] | ✓ [16] | ✓ [25] | ✓ [38] | ✓ [45] | ✓ [54] | ✓ [68] | ✓ [80] |
| Commute / lifestyle search | partial (metro search [14](ss), locality score [4]) | partial (amenities map, similar localities [16]) | partial (locality reviews and compare [25]) | partial (near landmarks [38]) | partial (metro-access filter, lifestyle recommendations [45]) | ✓ commute time [53] | ✓ My Places travel time [72](ss) | ✓ [77][80] |
| Map search | ✓ [2] | partial [16] | ✓ [25] | unverified | partial (a user review mentions the map [45]) | ✓ [54] | ✓ draw-a-search [72](ss) | unverified |
| Saved searches and alerts | ✓ [1][2] | unverified | ✓ [25] | ✓ [38] | ✓ [45] | ✓ [51] | ✓ [72](ss) | ✓ [80] |
| Listing or owner verification | partial ("100% Verified Owner" label, method undocumented [3](ss); AI checks [10]) | ✓ field-verifier visit [16][17] | unverified | ✓ data-collector visit plus self-verification [31][32] | ✓ company claim [45] | partial (MLS/IDX data; fraud takedowns [64](ss)) | partial (agent-only listings [71]; fraud team [75](ss)) | unverified |
| RERA number shown (India only) | unverified | ✓ [19](ss) | unverified | unverified | partial (RERA-registered agents [45]) | n/a | n/a | n/a |
| Rent cost fields (deposit, maintenance, total) | ✓ deposit and maintenance [3](ss); rent fairness check [4] | ✓ deposit and maintenance [20](ss) | unverified | partial (rent-value calculator [38]) | partial (zero-deposit rentals [45]) | ✓ "Total price" with fee breakdown [60](ss) | partial (material information [73](ss)) | unverified |
| EMI / affordability calculator | ✓ [15] | ✓ [21] | unverified | ✓ [43] | ✓ [50] | ✓ affordability in AI mode [56] | unverified | partial (Rocket preapproval [80]) |
| Price history or trends | partial ("Know Your Rent" [4]) | ✓ [16][22] | ✓ [25][29] | partial (valuation calculator [38]) | ✓ [45][50] | ✓ Zestimate history [56] | ✓ sold prices [68] | partial (nearby sale prices [80]) |
| Shared shortlists / group decisions | partial (group chats incl. staff, vendor claim [7]) | unverified | unverified | unverified | unverified | ✓ co-shopper messaging and shared saves [55][62] | partial (compare up to 5; no sharing confirmed [68]) | ✓ Shared Favorites [81][82](ss) |
| Visit booking | ✓ in-app scheduling, "owner hosting visit" filter [2][4] | unverified | unverified | unverified | ✓ calendar site visits [45] | ✓ AI mode and Gemini booking [56][57] | unverified (users sent to agents [66]) | ✓ [80] |
| In-app chat with owner or advertiser | ✓ [7] | unverified | ✓ [27] | ✓ Housing Chat [39] | unverified | partial (co-shopper chat; AI Assist answers for managers [55]) | unverified | unverified |
| Phone-number masking / privacy | unverified | unverified | ✓ chat "without needing to share personal contact" [27] | unverified | unverified | unverified | unverified | unverified |
| Paid plans for seekers | ✓ Freedom / Relax / Assure [1] | unverified (none found) | ✓ MB Prime ₹899–₹3,999 [25][26] | ✓ Housing Premium [34][35][36] | unverified (none found) | partial ($35 application fee [61](ss)) | unverified (none found; advertiser-paid model [74](ss)) | unverified |
| AI assistant or recommendations | partial (voice AI for support and ops [9][10]; "Owner AI Assist" [4]) | partial (AI claim [16]) | partial (internal moderation; PropWorth ML [28][29]) | ✓ ChatGPT app [40] | ✓ AI recommendations and ChatGPT app [45][48] | ✓ AI mode, Rentals AI Assist [55][56] | ✓ Ask Rightmove, Evaluation and Comparison Assistants [67][69][70] | ✓ [77][78] |
| AI-written listing descriptions | unverified | unverified | unverified | unverified | unverified | unverified | unverified | unverified |
| AI agent that acts for the seeker | unverified (the human relationship manager books owner meetings [1]) | unverified | unverified | unverified (ChatGPT app does not mention contact or visits [40]) | unverified (hands off to advisors [48]) | partial (schedules tours and connects an agent [56]; Gemini can't contact owners or managers ✗ [57]) | unverified | unverified |

---

## 4. AI in property search (2023–2026)

### Timeline of shipped products

| Date | Product | What it does | Does it take actions? | Source |
|---|---|---|---|---|
| 26 Jan 2023 | Zillow natural-language search | Search by describing needs; save searches and alerts | No | [51] |
| May 2023 | Zillow ChatGPT plugin | Conversational search in ChatGPT | No | [52](ss) |
| 2024 | Flyhomes AI search portal (US) | AI home search and research, after acquiring ZeroDown's assets | Unverified | [88](ss) |
| 4 Sep 2024 | Zillow natural-language expansion | Commute, budget, school and point-of-interest queries | No | [53] |
| Feb 2025 | NoBroker ConvoZen.AI | Enterprise voice and chat AI; about 35% of NoBroker's own conversations by Aug 2026 | Handles support conversations, not seeker search | [8][9][10] |
| Jun 2025 (announced) → Oct 2025 | Zillow Rentals AI Assist (EliseAI) | Answers renter questions for property managers | Books tours for the property manager | [55][63](ss) |
| 5 Aug 2025 | Jitty (UK) raises $3.8M seed, led by REA Group | "AI-powered home-buying agent"; natural-language search; collaborative shortlists with notes | Not described | [84] |
| 4 Sep 2025 | Zefir (France) raises €15M; ZIA digital buyer's agent | Helps search, compare and decide | Unverified | [85](ss) |
| 6 Oct 2025 | Zillow app in ChatGPT | Listings, maps and prices in chat | No; tours and agents hand off to Zillow | [54] |
| 13 Nov 2025 | Redfin conversational search (Sierra) | Asks follow-ups on commute and schools; suggests loosening filters | No | [77] |
| Nov–Dec 2025 | Rightmove AI Keywords, Style with AI, Renovation Cost Estimator | Feature search, restyling photos, renovation cost estimates | No | [67] |
| Feb 2026 | Rightmove "Use AI"/Ask Rightmove (beta) | Conversational shortlist; area Q&A; comparisons | No | [65][67][68] |
| 6 Feb 2026 | Redfin app in ChatGPT | Search and refine in ChatGPT | No | [78] |
| Week of 9 Mar 2026 | Rightmove app in ChatGPT | Carousel of up to 5 listings | No; hands off to Rightmove | [66][67] |
| 25 Mar 2026 | Zillow AI mode (beta) | Memory across sessions; trade-offs; rent vs buy; affordability; Fair Housing guardrail | **Yes**: schedules tours, applies, connects an agent | [56] |
| 30 Mar 2026 | Realtor.com app in ChatGPT | Affordability, neighbourhoods, rent vs buy | No; routes buyers back to Realtor.com | [83] |
| Jun 2026 | Square Yards app in ChatGPT (India) | Describe-to-search; shortlist in chat | No; redirects to advisors | [48][49] |
| 11 Jun 2026 | Housing.com app in ChatGPT (India) | Search, refine and compare in chat | Not mentioned | [40] |
| Jul 2026 | Zillow Rentals in Google Gemini | Find rentals; Gemini books tours after you confirm contact details | **Yes, limited**: books tours; can't contact owner or manager, apply, or manage bookings | [57][58](ss) |
| Jul 2026 | Rightmove Evaluation Assistant | Q&A on a specific listing, using area and market data | No | [69] |
| Oct–Nov 2026 | Rightmove Comparison Assistant | Side-by-side comparison with user-defined criteria (for example, near schools) | No | [70] |
| 15 Oct 2026 | Proppy.ai (Bengaluru; Lit Proptech) | AI evaluates properties for a buyer; a human relationship manager supports (press release, unverified) | Not described | [86] |
| 2022→2026 | Propsoch (Bengaluru buyer advisory) | "AI-led research" plus architect due diligence on 80+ parameters; $2M seed Jun 2026 | Human advisory service | [87](ss) |

### Patterns in the evidence

1. **Most AI stops at search and Q&A.** The common Indian pattern in 2026 is a ChatGPT app that hands off to the portal or an advisor: Square Yards, Housing.com [40][48][49].
2. **Actions are just appearing, and only in the US.** Zillow AI mode schedules tours and connects the shopper with an agent [56]. Gemini books Zillow rental tours, but only after an explicit contact-detail confirmation, and it explicitly *cannot contact the owner or property manager* [57].
3. **Engagement claims are self-reported.** Examples are Redfin's 2× listings viewed and +47% tour requests [77], and Rightmove's 2× saves and leads [70]. No independent evaluation of accuracy was found.
4. **Guardrails are visible in global products.** Examples are Zillow's Fair Housing Classifier [56], Rightmove's "sources" button and Classic-search fallback [68], and Realtor.com saying MLS data "may not be used to train" ChatGPT [83].
5. **Unverified.** "Abodex Space" was listed on Product Hunt as an AI property search for Bangalore, but I could not confirm its launch date or product details.

---

## 5. Brokers in Bengaluru: the existing "agent"

### What brokers do

**Rentals.** The documented broker role is mostly as a go-between for owners:

- Brokers relay the owner's "brief" (the owner's conditions for a tenant). A Bengaluru broker said: "If the brief is only from the owners, how do we move?" [89].
- Brokers pass on owner demands: large deposits (one tenant cited 4× rent), forced purchase of existing furniture, and screening criteria. Some owners reportedly hold caste-based preferences, according to a broker interviewed [89].
- Viral cases describe brokers asking for a tenant's LinkedIn profile before showing a flat [90](ss). Owners interview tenants and ask for background lists [91](ss).

**Resale.** I found no independent or regulatory description of a Bengaluru resale broker's duties. Search results were brokerage or legal-service marketing describing search, negotiation, title and khata checks, and registration support. That role is **unverified** from neutral sources.

### Typical fees

| Fee | What sources say | Confidence |
|---|---|---|
| Rental brokerage | Housing.com says at least one month's rent from **both** renter and landlord, up to 3 months in cities including Bangalore; may rise to 45 days–2 months for leases over 1 year [44] *(via search summary; a platform with an interest in the topic)* | Indicative only |
| Resale brokerage | Commonly quoted as 1–2% of price, often per side [101] *(commercial and forum sources only)*. Inc42 uses a 1% commission on a ₹1 Cr home as an example [46] | **Unverified**: no regulator or independent survey found |
| Visit or "card" fees | A tenant told The Quint that brokers demand "visitation charges" and a "card" before showing flats, then stop answering calls [92] *(via search summary)* | Anecdotal |

### Documented complaints

**Deposits and deductions.** Bengaluru landlords often demand "six to nine months of rent, sometimes even 12" (₹3–5 lakh), and tenants complain of deductions without proof [93]. An Oct 2026 report describes:

- an old 1BHK at ₹22–24k a month with a ₹1.5 lakh deposit, and
- a commenter saying landlords and brokers "ask you 1month rent for painting" [94].

**Discrimination and screening.** Brokers and owners filter tenants by college, employer, diet and caste [89][90][91].

**Fraud by people posing as brokers or owners**

- A fake broker on the NoBroker app took about ₹2 Cr from 22 people [11].
- A fake owner on 99acres took a ₹10,000 UPI token [23].
- Rental fraud via Telegram groups [100] *(date unverified; page not opened)*.

**Collective action by brokers**

- The attack on NoBroker's office in 2015 [12].
- NAR-India's 2025 boycott of Magicbricks [30](ss).
- Former Housing.com staff said populating listings was hard, so "It was easier to let brokers list on the website" [13].

### Regulation

**RERA covers only new-project sales.**

- Agent registration under RERA s.9(1) applies to facilitating "the sale or purchase of any plot, apartment or building … in a real estate project … registered under section 3 … being sold by the promoter" [95].
- The penalty for an unregistered agent is ₹10,000 per day, up to 5% of the property's cost (s.62) [96].
- *Interpretation (not a legal opinion):* the text covers sales in registered projects by promoters. It does not appear to cover rentals or most resale of completed homes.

**Deposit caps are contested in Karnataka.**

- The Model Tenancy Act (approved by the Cabinet 2 Jun 2021 [97]) caps residential deposits at two months' rent [98].
- Business Today (3 Dec 2025) says Karnataka has "aligned" with it [98]. A tenant-rights commentary and a Jul 2026 reference sheet say no deposit cap is in force [99](ss). Business Today (Apr 2025) said the Act was "not fully adopted" in Karnataka [93].
- **Status unverified**; the Karnataka Gazette should be checked.

---

## 6. Gaps and opportunities

> **This section is ANALYSIS and design inference, not fact.** Source numbers point to the evidence each inference rests on.

1. **Approval-gated owner contact is unclaimed ground.** No platform reviewed has an AI that questions owners or managers on the seeker's behalf. Gemini explicitly cannot contact the owner or manager [57], and the Indian ChatGPT apps hand off [40][48]. *Opportunity:* an agent that drafts questions for the owner (deposit, maintenance included or not, bachelor/pet/food rules, availability date, painting deduction) and sends them only after the user approves. It keeps a shared transcript, and the seeker's phone number stays private until the user releases it. Magicbricks' chat without contact sharing [27] shows the privacy need.

2. **"True cost" is the Bengaluru-specific gap.** Indian listings show deposit and maintenance as separate fields [3][20]. Only Zillow totals required fees [60]. Bengaluru adds 6–12 month deposits [93], brokerage of about a month on each side [44], and painting deductions [94]. *Opportunity:* a move-in and 11-month cost ledger. It would include deposit lock-up, likely deductions, brokerage (if any), agreement and stamp costs, plus an EMI comparison for buyers.

3. **Trust has to be checked, not just labelled.** Verification ranges from field visits [17][31] to labels with no documented method [3]. Both documented frauds used off-platform payment pressure and recycled photos [11][23]. *Opportunity:* the agent refuses to pay before a visit, flags rent far below the local market, checks photo reuse, checks RERA for new projects [19], and shows its evidence. Rightmove's "sources" button [68] is a precedent.

4. **Group decisions are missing in India.** Co-shopping is built into Zillow (60%+ co-shop [55]) and Redfin [81], and Jitty sells collaborative shortlists [84]. No Indian portal equivalent was found. *Opportunity:* a shared shortlist for a family or flatmates, with each member's hard constraints (commute per person, budget split, food or pet rules), voting, and a record of the decision.

5. **Freshness and wasted contacts.** Paid-contact users complain that contacts are already rented or unreachable (App Store and Trustpilot claims, not verified). NoBroker reportedly uses AI to check rented-out status [10], and Housing.com expires free listings after 30 days [37]. *Opportunity:* the agent confirms availability before it shows or charges for a contact.

6. **Pay-to-contact has weak uptake.** NoBroker reports inconsistent premium uptake [5]. *Opportunity:* consider pricing tied to outcomes, for example a fee paid only when the user moves in. This is unvalidated and needs testing.

7. **Fair-housing guardrails.** Brokers relay discriminatory owner briefs [89]. Zillow builds a real-time Fair Housing Classifier into its AI [56]. *Opportunity:* the agent should not filter or steer by caste, religion or diet, and should make owner criteria visible to the seeker instead of applying them silently. This is a design-ethics stance; how far Indian law requires it is unverified.

8. **Rent vs buy in one journey.** Zillow AI mode and Realtor.com's ChatGPT app frame rent-versus-buy as a single conversation [56][83]. Indian portals split the two flows. *Opportunity:* one memory of the household's needs feeding both a rent shortlist and a buy shortlist.

9. **Visit logistics.** NoBroker already exposes "owner hosting a visit" and "visit within 2 days" filters [2]. Gemini books tours only after the user confirms [57]. *Opportunity:* batched visit plans that account for Bengaluru traffic and travel time, plus checklists for each visit.

10. **Rentals are largely outside agent regulation** (interpretation of [95]). The agent's own conduct rules (disclosure, no hidden fees, no payments before a visit) therefore become a product trust feature, not just compliance.

---

## 7. Could not verify

- **Map search:** Housing.com (unverified) and Redfin (no draw-on-map source found).
- **Alerts:** 99acres (unverified).
- **Visit booking:** 99acres, Magicbricks, Housing.com and Rightmove (unverified).
- **Chat:** 99acres and Square Yards (unverified).
- **Phone-number masking:** unverified everywhere except Magicbricks.
- **Listing verification:** Magicbricks (unverified).
- **AI-written listing descriptions:** not found for any of the 8 platforms.
- **Current prices for Housing Premium.** The NoBroker plan-to-price mapping is also unclear on its own page [1].
- **Policies on brokers posing as owners:** no published policy or penalty for NoBroker, 99acres, Magicbricks or Square Yards.
- **Resale brokerage of 1–2%** in Bengaluru: commercial and forum sources only.
- **Karnataka deposit cap:** sources conflict.
- **Dates inferred from page context:** Rightmove's Feb 2026 AI search and Oct–Nov 2026 Comparison Assistant.
- **Secondary report of NoBroker's 35% AI share:** taken from an aggregator citing Business Standard; the original was not opened.
- **Completion of the Housing.com sale to Aurum.**
- **Abodex Space:** launch date and product details.

---

## Sources

Source pages accessed 10–13 Nov 2026. Each entry gives the publication or modification date, or says none was shown. "(ss)" = read via a search-engine summary; the page itself was not opened.

**NoBroker**
1. NoBroker, "Tenant plans", https://www.nobroker.in/tenant/plans. Undated page.
2. NoBroker, rent search: Koramangala, Bangalore, https://www.nobroker.in/property/rent/bangalore/Koramangala. Undated live page.
3. NoBroker, "2 BHK Flats for Rent in Koramangala Bangalore", https://www.nobroker.in/2bhk-flats-for-rent-in-koramangala_bangalore (ss). Undated.
4. Apple App Store, "NoBroker Rent, Buy, Sell Flats", v8.6.4 dated 30 Oct (year not shown; assumed 2026), https://apps.apple.com/in/app/nobroker-rent-buy-sell-flats/id1200507100
5. Inc42, "NoBroker's Future Is Beyond Home Listings, But Will Profits Follow?", 6 Jul 2026 (updated 8 Jul 2026), https://inc42.com/features/nobrokers-future-is-beyond-home-listings-but-will-profits-follow/
6. Factor Daily, "NoBroker shrugs off mob attack, uses AI to evict brokers from the real estate game", 10 Jul 2017, https://archive.factordaily.com/nobroker-artificial-intelligence-real-estate-brokers/
7. CometChat, "Nobroker's Success Story" (vendor case study), undated, https://www.cometchat.com/customer-stories/nobroker
8. YourStory, "NoBroker launches ConvoZen.AI, a conversational AI cloud for customer engagement", Feb 2025, https://yourstory.com/2025/02/nobroker-launches-convozenai-conversational-ai-cloud-customer-engagement
9. Business Today, "How ConvoZen is emerging as NoBroker's new growth engine", 24 Feb 2026, https://www.businesstoday.in/latest/corporate/story/how-convozen-is-emerging-as-nobrokers-new-growth-engine-517791-2026-02-24
10. AskFuzz (aggregator) summarising Business Standard, "AI handles 35 per cent of all NoBroker conversations: Founder Akhil Gupta", 26 Aug 2026, https://askfuzz.ai/discover/news/startups/nobroker-ai-handles-35-of-conversations-targets-60-70 (secondary).
11. Asianet Newsable, "Bengaluru man cheats 22 people of Rs 2 crore promising house lease through NoBroker app, absconds", 19 Dec 2024, https://newsable.asianetnews.com/karnataka-news/bengaluru-man-cheats-22-people-of-rs-2-crore-promising-house-lease-through-nobroker-app-absconds-vkp-soqkvs
12. The News Minute, "Angry real estate agents ransack housing start-up for eating up business", 16 Sep 2015, https://www.thenewsminute.com/karnataka/angry-real-estate-agents-ransack-housing-start-eating-business-34344
13. The Ken, house-hunting subscription article (opening section only; paywalled), 2 Mar 2017, https://the-ken.com/house-hunting-subscription-plan/
14. Realty Plus, "NoBroker introduces metro-based property search" (ss), 2023 per search summary, https://www.rprealtyplus.com/allied/nobroker-introduces-metro-based-property-search-112086.html
15. NoBroker, "Home Loan EMI Calculator" (ss), undated, https://www.nobroker.in/home-loan/comprehensive-home-loan-emi-calculator/

**99acres**

16. Apple App Store, "99acres – Property Search", v16.10.50 (Nov 2026), https://apps.apple.com/in/app/99acres-property-search/id781765588
17. Info Edge, "Real Estate – 99acres", undated (cites FY2015-16 data), https://infoedge.in/Businesses/RealEstate_99Acres
18. Online Marketplaces, "Info Edge Q2 FY27: 99acres Loss Narrows to INR 1.6 Crore as Revenue Rises 17%", 28 Oct 2026, https://www.onlinemarketplaces.com/articles/info-edge-q2-fy27-99acres-loss-narrows-to-inr-1-6-crore-as-revenue-rises-17/
19. 99acres, "RERA registered Projects in Bangalore" (ss), undated, https://www.99acres.com/rera-registered-projects-in-bangalore-ffid
20. 99acres, "2 BHK Flats for Rent in Koramangala, Bangalore" (ss), undated, https://www.99acres.com/2-bhk-flats-for-rent-in-koramangala-bangalore-south-ffid
21. 99acres, "Home Loan EMI Calculator" (ss), undated, https://www.99acres.com/home-loan-emi-calculator-hlpg
22. 99acres, "Property Rates in Bangalore Nov-2026" (ss), https://www.99acres.com/property-rates-and-price-trends-in-bangalore-prffid
23. Asianet Newsable, "Bengaluru House Hunt Gone Wrong: Rs 10K 99acres Scam Everyone Should Know", 10 Nov 2025, https://newsable.asianetnews.com/karnataka-news/bengaluru-house-hunt-gone-wrong-rs-10k-99acres-scam-everyone-should-know-articleshow-gdfvxhe
24. Bihar RERA order involving 99acres.com (ss), 2018 per URL, https://rera.bihar.gov.in/Order/241%202018.pdf

**Magicbricks**

25. Apple App Store, "Magicbricks Property Search", v9.32 (Nov 2026), https://apps.apple.com/in/app/magicbricks-property-search/id486328406
26. Medianews4u, "Magicbricks premium service MB Prime clocks 1 lakh subscribers in the pre-launch phase", 6 Sep 2022, https://www.medianews4u.com/magicbricks-premium-service-mb-prime-clocks-1-lakh-subscribers-in-the-pre-launch-phase/
27. Online Marketplaces, "Magicbricks connects homebuyers to advertisers with messaging system", 27 Mar 2019, https://onlinemarketplaces.com/articles/magicbricks-connects-homebuyers-to-advertises-with-messaging-system
28. Online Marketplaces, "MagicBricks CEO Celebrates Profitability as IPO Considerations Accelerate", 8 Oct 2025, https://www.onlinemarketplaces.com/articles/magicbricks-ceo-celebrates-profitability-as-ipo-considerations-accelerate/
29. Free Press Journal, "Magicbricks Launches PropWorth…" (ss), Jul 2024 per search summary, https://www.freepressjournal.in/business/magicbricks-launches-propworth-advanced-property-valuation-tool-utilizes-machine-learning-for-accurate-assessments
30. Online Marketplaces, "India's MagicBricks to be Boycotted After Social Media Backlash" and "NAR-India Resolves MagicBricks Boycott" (ss), 2025 (Apr–May and Sep 2025 per search summary), https://www.onlinemarketplaces.com/articles/indias-magicbricks-to-be-boycotted-after-social-media-backlash ; https://www.onlinemarketplaces.com/articles/nar-india-resolves-magicbricks-boycott/

**Housing.com**

31. Housing.com Support, "What is a verified listing?", modified 24 Nov 2023, https://support.housing.com/support/solutions/articles/4000200981-what-is-a-verified-listing-
32. Housing.com Support, "What is self-verification?", modified 23 Nov 2023, https://support.housing.com/support/solutions/articles/4000200868-what-is-self-verification-
33. Housing.com Support, "How to report fake Broker", modified 23 Nov 2023, https://support.housing.com/support/solutions/articles/4000200767-how-to-report-fake-broker
34. Housing.com Support, "What is Housing Premium?", modified 30 May 2023, https://support.housing.com/support/solutions/articles/4000194835/
35. Housing.com Support, "Can I contact any owner properties without purchasing Housing Premium?", modified 30 May 2023, https://support.housing.com/support/solutions/articles/4000194838-can-i-contact-any-owner-properties-without-purchasing-housing-premium-
36. Online Marketplaces, "REA India Sidesteps Agents with Country's First User Subscription Service – 'Housing Premium'", 19 Aug 2022, https://onlinemarketplaces.com/articles/rea-india-sidesteps-agents-with-countrys-first-user-subscription-service-housing-premium
37. Housing.com Support, "For how long will my property listing be visible on Housing.com?", modified 2 Jun 2021, https://support.housing.com/support/solutions/articles/4000173229-for-how-long-will-my-property-listing-be-visible-on-housing-com-
38. Apple App Store, "Housing: Buy, Rent, Sell & Pay", v7.7.4 (Nov 2026), https://apps.apple.com/in/app/housing-buy-rent-sell-pay/id967257660
39. CXOToday, "Housing.com Elevates Buyer-Seller Interaction with 'Housing Chat', Boosting Engagement 40X", 23 Apr 2025, https://cxotoday.com/press-release/housing-com-elevates-buyer-seller-interaction-with-housing-chat-boosting-engagement-40x/
40. CXOToday, "Housing.com brings property search to ChatGPT…", 11 Jun 2026, https://cxotoday.com/media-coverage/housing-com-brings-property-search-to-chatgpt-redefining-home-discovery-through-conversational-ai/
41. Online Marketplaces, "REA Group Agrees to Housing.com Divestment to Aurum PropTech", 16 Jul 2026, https://www.onlinemarketplaces.com/articles/rea-group-agrees-to-housing-com-divestment-to-aurum-proptech/
42. Outlook Business, "Housing.com parent firm REA India clocks 25% revenue growth to AUD 129.2 mn last fiscal", 19 Aug 2025, https://www.outlookbusiness.com/corporate/housingcom-parent-firm-rea-india-clocks-25-revenue-growth-to-aud-1292-mn-last-fiscal
43. Housing.com, "Home loan EMI calculator" (ss), undated, https://housing.com/home-loans-emi-calculator
44. Housing.com News, "What are the brokerage charges for renting a flat in India?" (ss; the page refused automated access), undated, https://housing.com/news/what-are-the-brokerage-charges-for-renting-a-flat-in-india

**Square Yards**

45. Apple App Store, "Square Yards: Buy, Rent, Invest", v6.3.1 dated 3 Sep (year not shown; assumed 2026), https://apps.apple.com/in/app/square-yards/id1093755061
46. Inc42, "Can Square Yards' Fintech Growth Engine Drive Its IPO Ambitions?", 8 May 2026, https://inc42.com/features/can-square-yards-fintech-growth-engine-drive-its-ipo-ambitions/
47. Online Marketplaces, "Square Yards FY26: Revenue up 48% as EBITDA Nearly Quadruples Pre-IPO", 30 Apr 2026, https://www.onlinemarketplaces.com/articles/square-yards-fy26-revenue-up-48-as-ebitda-nearly-quadruples-pre-ipo/
48. The Realty Today, "Square Yards Becomes First Indian PropTech Company to Launch Native App on ChatGPT", 8 Jun 2026, https://therealtytoday.com/news/technology/square-yards-becomes-first-indian-proptech-company-to-launch-native-app-on-chatgpt
49. Square Yards Blog, "Square Yards Brings Property Search to ChatGPT", last updated 7 Jul 2026, https://www.squareyards.com/blog/square-yards-chatgpt-property-search
50. Square Yards, "EMI eligibility calculator" and "Property Rates in Bangalore" (ss), undated, https://www.squareyards.com/emi-eligibility-calculator ; https://www.squareyards.com/property-rates-in-bangalore

**Zillow**

51. Zillow press release, "Zillow's new AI-powered natural language search is a first in real estate", 26 Jan 2023, https://zillow.mediaroom.com/2023-01-26-Zillows-new-AI-powered-natural-language-search-is-a-first-in-real-estate
52. Zillow press release, "Zillow builds ChatGPT plugin for real estate searches" (ss), 2 May 2023 per URL, https://zillow.mediaroom.com/2023-05-02-Zillow-builds-ChatGPT-plugin-for-real-estate-searches
53. Zillow press release, "Zillow's AI-powered home search gets smarter with new natural language features", 4 Sep 2024, https://zillow.mediaroom.com/2024-09-04-Zillows-AI-powered-home-search-gets-smarter-with-new-natural-language-features
54. Zillow press release, "Zillow debuts the only real estate app in ChatGPT", 6 Oct 2025, https://zillow.mediaroom.com/2025-10-06-Zillow-debuts-the-only-real-estate-app-in-ChatGPT
55. Zillow press release, "Zillow launches messaging, a new way for home shoppers to collaborate within the Zillow app", 28 Oct 2025, https://zillow.mediaroom.com/2025-10-28-Zillow-launches-messaging,-a-new-way-for-home-shoppers-to-collaborate-within-the-Zillow-app
56. Zillow press release, "Zillow debuts AI mode, bringing guided intelligence to every step of the housing journey", 25 Mar 2026, https://s25.q4cdn.com/975009107/files/doc_news/Zillow-debuts-AI-mode-bringing-guided-intelligence-to-every-step-of-the-housing-journey-2026.pdf
57. Google Gemini Apps Help, "Find rental properties & book tours on Zillow with Gemini Apps", undated, https://support.google.com/gemini/answer/17187706
58. Online Marketplaces, "Zillow Announces Google Gemini Partnership for Rental Properties" (ss), about 1 Jul 2026; live 9 Jul 2026 per search summary of Inman, https://www.onlinemarketplaces.com/articles/zillow-announces-google-gemini-partnership-for-rental-properties/
59. Zillow Group, "Reports Fourth-Quarter and Full-Year 2025 Financial Results" (ss), 10 Feb 2026, https://zillowgroup.mediaroom.com/2026-02-10-Zillow-Group-Reports-Fourth-Quarter-and-Full-Year-2025-Financial-Results
60. Zillow Rentals Network, "Understanding Zillow's New Total Price Display" (ss; the page refused automated access), 2025, https://www.zillow.com/rentals-network/pricing-transparency
61. Zillow Help (Zendesk), "Rental Applications – Set up Payment" ($35 for 30 days) (ss), undated, https://zillow.zendesk.com/hc/en-us/articles/32873185394323-Rental-Applications-Set-up-Payment
62. Zillow press release, "America's favorite pastime, Zillow surfing, is now a group sport with SharePlay…" (ss), 21 Dec 2021, https://zillow.mediaroom.com/2021-12-21-Americas-favorite-pastime-Zillow-surfing-is-now-a-group-sport-with-SharePlay-on-iPhone-and-iPad
63. Inman, "Zillow Rentals Launches Artificial Intelligence-Fueled Chatbot EliseAI" (ss), 10 Jun 2025, https://news.inman.com/2025/06/10/zillow-rentals-launches-artificial-intelligence-fueled-chatbot-eliseai/
64. AARP, "Renter, Beware: When Looking for a Place to Live, Watch out for Scammers" (ss; quotes Zillow support), undated, https://www.aarp.org/money/scams-fraud/rental-scams/

**Rightmove**

65. Rightmove press release, "Rightmove launches next phase of AI-powered property search", undated (Feb 2026 inferred from page assets), https://www.rightmove.co.uk/press-centre/?p=4791
66. Rightmove press release, "Rightmove to launch app in ChatGPT in next phase of AI innovation", undated (late Feb 2026 per coverage), https://www.rightmove.co.uk/press-centre/?p=4863
67. Rightmove Hub, "Latest AI innovations" (Ask Rightmove entry dated 12 Feb 2026; ChatGPT app "week commencing 9th March 2026"; AI Keywords Nov–Dec 2025), https://hub.rightmove.co.uk/latest-ai-innovations/
68. Rightmove Help Centre, "AI Search and Ask Rightmove", undated, https://faq.rightmove.co.uk/support/solutions/articles/7000100087-ai-search-and-ask-rightmove-
69. Rightmove press release, "Rightmove extends conversational search experience to property listings", Jul 2026 (IFA Magazine repost dated 8 Jul 2026 per search summary), https://www.rightmove.co.uk/press-centre/?p=5125
70. Rightmove press release, "Rightmove adds AI-powered Comparison Assistant to search results", undated (about Oct–Nov 2026 inferred), https://www.rightmove.co.uk/press-centre/?p=5309
71. Property Industry Eye, "Why are private sellers allowed to list on Rightmove?", 2 Feb 2023, https://propertyindustryeye.com/why-are-private-sellers-allowed-to-list-on-rightmove/
72. Rightmove Help Centre, "Draw a search" and "How to register for property alerts", and the Rightmove tools page (My Places) (ss), undated, https://faq.rightmove.co.uk/support/solutions/articles/7000048757-draw-a-search ; https://faq.rightmove.co.uk/support/solutions/articles/7000048758-how-to-register-for-property-alerts ; https://www.rightmove.co.uk/tools
73. National Trading Standards, "Guidance on Part A material information for property listings" (ss), 2022, https://www.nationaltradingstandards.uk/news/national-trading-standards-publishes-guidance-on-part-a-material-information-for-property-listings/
74. Letting Agent Today, "Rising agency revenues boost Rightmove profits" (ss), Mar 2025, https://www.lettingagenttoday.co.uk/breaking-news/2025/03/rising-agency-revenues-boost-rightmove-profits/
75. Rightmove guide on rental scams (ss), undated, https://www.rightmove.co.uk/guides/?p=385
76. Property118, "Landlords using OpenRent to lose Rightmove access" (ss), Aug 2024, https://www.property118.com/landlords-using-openrent-to-lose-rightmove-access/

**Redfin**

77. Redfin News, "Redfin Debuts Conversational Search to Reinvent How People Find Homes", 13 Nov 2025, https://www.redfin.com/news/redfin-debuts-conversational-search-to-reinvent-how-people-find-homes/
78. HousingWire, "Redfin launched a ChatGPT app…", 6 Feb 2026, https://www.housingwire.com/articles/redfin-launched-a-chatgpt-app-to-enable-conversational-home-searches-and-property-exploration-the-move-follows-similar-integrations-by-zillow-and-google-raising-questions-about-mls-data-licensing/
79. Online Marketplaces, "Rocket Companies Completes $1.8Bn Redfin Acquisition", 2 Jul 2025, https://www.onlinemarketplaces.com/articles/rocket-companies-completes-1-8bn-redfin-acquisition
80. Apple App Store, "Redfin: Buy, Sell & Rent Homes", v651.0.0 dated 29 Oct (year not shown; assumed 2026), https://apps.apple.com/us/app/redfin-buy-sell-rent-homes/id327962480
81. Business Wire, "Redfin 'Shared Search' Makes It Easy for Couples, Parents and Agents to Work Together on a House Hunt" (ss), 6 Apr 2015, https://businesswire.com/news/home/20150406005209/en/
82. Redfin Support, "Buying FAQ" (Shared Favorites; tour scheduling) (ss; the page refused automated access), undated, https://support.redfin.com/hc/en-us/articles/360001433192-Buying-FAQ

**AI-native and other**

83. Real Estate News, "Realtor.com the latest portal to launch search app in ChatGPT", 30 Mar 2026, https://www.realestatenews.com/2026/03/30/realtor-com-the-latest-portal-to-launch-search-app-in-chatgpt
84. Property Industry Eye, "Jitty announces USD$3.8 million investment funding", 5 Aug 2025, https://propertyindustryeye.com/jitty-announces-usd3-8-million-investment-funding/
85. tech.eu, "Zefir raises €15M to double down on AI for real estate" (ss), 4 Sep 2025, https://tech.eu/2025/09/04/zefir-raises-eur15m-series-b-to-double-down-on-ai-for-real-estate/
86. UNI / PR Newswire, "Proppy.ai takes a Bengaluru-bound couple from home search to booking in just 72 hours…" (press release; UNI takes no editorial responsibility), 15 Oct 2026, https://www.uniindia.com/prnewswire/proppyai-takes-a-bengaluru-bound-couple-from-home-search-to-booking-in-just-72-hours-with-ai-led-dis/214440
87. Tribune India / ANI, "Propsoch redefines homebuying in India with their buyer-centric advisory model" (Mar 2025), and The Realty Today, "Propsoch Raises USD 2 Million in Seed Funding…" (Jun 2026 per search summary) (ss), https://www.tribuneindia.com/news/business/propsoch-redefines-homebuying-in-india-with-their-buyer-centric-advisory-model ; https://therealtytoday.com/news/news/propsoch-raises-usd-2-million-in-seed-funding-led-by-athera-venture-partners-sparrow-capital-and-vakil-group/
88. HousingWire, "Flyhomes acquires ZeroDown, launches AI-powered home search portal" (ss), 2024, https://housingwire.com/articles/flyhomes-acquires-zerodown-launches-ai-powered-home-search-portal

**Brokers, tenancy and regulation**

89. The Established, "Why are brokers in Bengaluru making ridiculous demands from potential tenants?", 17 Feb 2023, https://www.theestablished.com/community/identity/why-are-brokers-in-bengaluru-making-ridiculous-demands-from-potential-tenants
90. Business Today, "'Only IIT, IIM, CA, ISB graduates': Bengaluru landlords' bizarre condition for tenants…" (ss), 27 Nov 2022, https://businesstoday.in/latest/trends/story/only-iit-iim-ca-isb-graduates-bengaluru-landlords-bizarre-condition-for-tenants-chat-goes-viral-354329-2022-11-27
91. Business Today, "Bengaluru techie says his tenant interview was longer than a business meeting…" (ss), 26 Jul 2023, https://www.businesstoday.in/technology/story/bengaluru-techie-says-his-tenant-interview-was-longer-than-a-business-meeting-owner-checked-linkedin-profile-391333-2023-07-26
92. The Quint, "Karnataka Elections 2023: Why aren't tenants' troubles a poll issue in Bengaluru?" (ss; the page refused automated access), 2023, https://fithindi.thequint.com/elections/karnataka-election/karnataka-elections-2023-why-arent-tenants-troubles-a-poll-issue-in-bengaluru
93. Business Today, "'The biggest scam in Bengaluru…': Investment advisor calls out city's rental deposit trap", 15 Apr 2025, https://www.businesstoday.in/personal-finance/real-estate/story/the-biggest-scam-in-bengaluru-investment-advisor-calls-out-citys-rental-deposit-trap-472022-2025-04-15
94. Business Today, "Rs22,000–Rs24,000 rent, Rs1.5 lakh deposit for old 1BHK…", 5 Oct 2026, https://www.businesstoday.in/india/story/rs22000-rs24000-rent-rs1-5-lakh-deposit-for-old-1bhk-bengaluru-resident-calls-out-rising-housing-costs-559407-2026-10-05
95. Real Estate (Regulation and Development) Act, 2016, s.9(1), via AdvocateKhoj bare act, https://www.advocatekhoj.com/library/bareacts/realestate2016/9.php
96. Real Estate (Regulation and Development) Act, 2016, s.62, via Indian Kanoon, https://indiankanoon.org/doc/137732446/
97. PIB, "Cabinet approves Model Tenancy Act for circulation to the States/Union Territories for adoption" (ss), 2 Jun 2021, https://www.pib.gov.in/PressReleseDetailm.aspx?PRID=1723636
98. Business Today, Model Tenancy Act explainer: "how new security deposits, rent agreement, entry-exit rules will benefit tenants, landlords", 3 Dec 2025, https://www.businesstoday.in/personal-finance/real-estate/story/model-tenancy-act-how-new-security-deposits-rent-agreement-entry-exit-rules-will-benefit-tenants-landlords-504839-2025-12-03
99. Commoner Law, "Karnataka Tenant Rights Under the Model Tenancy Act Laws (2026)", and RentOK, "Security Deposit Rules India Reference Sheet" (Jul 2026) (ss), https://commoner-law.com/india/housing-rights/tenant-rights/karnataka ; https://wb.rentok.com/wp-content/uploads/2026/07/Security-Deposit-Rules-India-Reference-Sheet.pdf
100. Deccan Herald, "House hunters in Bengaluru trapped in new Telegram rental fraud" (ss; the page refused automated access; date unverified), https://www.deccanherald.com/india/karnataka/bengaluru/house-hunters-in-bengaluru-trapped-in-new-telegram-rental-fraud-3849007
101. Resale brokerage figures from commercial and forum sources (ss): CommonFloor forum, "Brokerage fees", https://www.commonfloor.com/forum/5ab9b4bfae22c-brokerage-fees ; PropNewz blog, "Bengaluru broker commission" (19 Aug 2026 per URL), https://www.propnewz.com/blog/bengaluru-broker-commission-brokerage-buyers-2026-08-19
