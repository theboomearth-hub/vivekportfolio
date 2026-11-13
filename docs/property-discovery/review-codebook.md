# Review coding codebook (v1, 13 Nov 2026)

Code each review only on what it actually says. A review can have several themes.

## Fields

- `role`: who wrote it: `seeker` (looking to rent or buy) | `owner_seller` (letting out or selling) | `agent` (broker or agent) | `unclear`
- `intent`: `rent` | `buy` | `let_out` | `sell` | `unclear`
- `sentiment`: `neg` | `mixed` | `pos`
- `themes`: one or more codes from the list below, separated by `;`
- `note`: up to 12 words, **in your own words**. No names, phone numbers, emails or amounts that identify a person.

## Themes

| Code | Use when the review says… | Don't use for… |
|---|---|---|
| FAKE_STALE | A listing was fake, already rented or sold, didn't exist, photos didn't match, or was outdated | Missing details (use LISTING_INFO) |
| BROKER_POSING | Brokers or agents posed as owners, broker listings appeared where owners were promised, or brokers called when the person wanted owners | Spam calls from the platform itself (SPAM_PRIVACY) |
| SPAM_PRIVACY | Unwanted calls, messages or WhatsApp after an enquiry or sign-up; their number was shared or sold; privacy worries | — |
| PAYWALL_REFUND | Paying to contact or to see details; subscription or plan complaints; money deducted; refunds refused; paid but got nothing | Hidden costs of the property itself (COST_CLARITY) |
| NO_RESPONSE | (Seekers) owners or agents didn't reply or pick up; contact attempts failed | Owners getting no leads (LEAD_QUALITY) |
| SEARCH_FILTERS | Irrelevant results, filters ignored, wrong locality, duplicates, can't search for what they need, poor sorting | — |
| COST_CLARITY | Hidden or unclear charges, brokerage surprises, the listed price differing from reality, deposit or maintenance surprises | Platform plan fees (PAYWALL_REFUND) |
| LISTING_INFO | Missing or wrong details (size, price, amenities, address), poor photos, no map | Fake listings (FAKE_STALE) |
| VISIT | Problems scheduling or doing site visits, no-shows, wasted trips | — |
| SUPPORT | Customer support unhelpful, unreachable or slow | — |
| BUGS_PERF | Crashes, slowness, login or OTP failures, too many ads, UI glitches | — |
| LEAD_QUALITY | (Owners and sellers) fake or irrelevant leads, brokers calling them, no responses to their listing | — |
| POSITIVE_OUTCOME | They found a home, tenant or buyer, or describe a concrete easy or helpful experience | Generic praise (GENERIC_PRAISE) |
| GENERIC_PRAISE | Short praise with no specifics ("good app", "nice") | — |
| OTHER | None of the above; describe it in `note` | — |
