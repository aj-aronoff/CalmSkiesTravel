# References & Resources Tab — Plan
> Source: Team-feedback.txt section 04 · REQUIREMENTS.md section 3.1

---

## Top-Level Overview

Add a ninth tab — **Resources & References** — containing only verified, real URLs grouped by topic. Every URL in this plan must be verified as reachable before being placed in the page. A link-checker test script (`test-links.js`) will confirm all links return HTTP 200 (or 301/302 redirect to a live page) and must pass before deployment.

**No hallucinations. Every URL listed below is a real, known-good government or organisation URL at time of writing. All must be verified by the agent before committing to the page.**

---

## Candidate Links to Verify

These are the URLs the agent must check. They are grouped by the topics already mentioned in the site. The agent must attempt to fetch each one and confirm it resolves before including it in the tab.

### Tier 1 — U.S. Government (fully trusted)

| Label | URL |
|---|---|
| TSA Cares program | `https://www.tsa.gov/travel/passenger-support` |
| TSA Cares helpline info | `https://www.tsa.gov/contact-center/form/cares` |
| TSA PreCheck | `https://www.tsa.gov/precheck` |
| TSA — Traveling with children | `https://www.tsa.gov/travel/security-screening/whatcanibring/traveling-children` |

### Tier 2 — Airlines (trusted)

| Label | URL |
|---|---|
| American Airlines — special assistance | `https://www.aa.com/i18n/travel-info/special-assistance/special-assistance.jsp` |
| Delta — special needs / disability travel | `https://www.delta.com/us/en/need-help/overview` |
| United Airlines — accessibility services | `https://www.united.com/en/us/fly/travel/special-needs.html` |
| Southwest — customers with disabilities | `https://www.southwest.com/html/customer-service/unique-travel-needs/customers-with-disabilities-pol.html` |

### Tier 3 — Organisations (must verify ≥90% confidence)

| Label | URL |
|---|---|
| Hidden Disabilities Sunflower (official) | `https://hdsunflower.com` |
| Hidden Disabilities Sunflower — airports | `https://hdsunflower.com/us/about/where-to-find-us` |
| Wings for Autism (Arc) | `https://thearc.org/our-initiatives/wings-for-autism/` |
| Autism Society of America — travel tips | `https://autismsociety.org/resource/traveling-with-autism/` |
| IATA — DPNA special service request code | `https://www.iata.org/en/programs/passenger/pax-services/special-service-request/` |
| Autism Speaks — travel tips | `https://www.autismspeaks.org/tool-kit/travel-safety-tips` |
| Airport Dimensions — sensory rooms | `https://www.airport-dimensions.com/sensory-rooms/` |
| Social Stories — Carol Gray Center | `https://carolgraysocialstories.com/social-stories/what-is-it/` |

---

## Sub-Task 1 — Verify All Candidate Links

**Status:** [ ] pending

### Intent
Before a single URL appears in the page, the agent must confirm each one resolves. Use `fetch` (or equivalent HTTP HEAD/GET request) to check each URL. Any URL that does not return a 2xx or 3xx response is excluded from the tab and noted as unverified.

### Expected Outcomes
- Every URL in the References tab has been confirmed reachable.
- Any candidate URL that fails is replaced with an alternative or omitted.
- A verification log is written to `link-verification-log.md`.

### Todo List
1. For each candidate URL above, attempt an HTTP HEAD (or GET) request.
2. Record the response status code.
3. If a URL redirects (301/302), follow to the final destination and confirm it is the correct page.
4. Write results to `link-verification-log.md` with columns: URL, status, verified (yes/no), notes.
5. Identify any failed URLs and find working alternatives or mark as omitted.

### Relevant Context
- [`REQUIREMENTS.md`](REQUIREMENTS.md) lines 144–155 — the topics that must be sourced.
- No URL that cannot be verified should appear in the tab.

---

## Sub-Task 2 — Build the References Tab in index.html

**Status:** [ ] pending

### Intent
Add a ninth tab — **Resources & References** — to `index.html`. The tab contains only the verified links from Sub-Task 1, grouped by topic with a short, plain-English description of each resource. No opinion, no promotion — just what each resource is and why it matters for families traveling with autistic children.

### Expected Outcomes
- A new `tab-references` button appears in the tab list.
- A new `panel-references` section appears in the main content.
- All links open in a new tab (`target="_blank" rel="noopener noreferrer"`).
- Links are grouped: Government Resources, Airlines, Organisations & Support.
- The tab matches the visual style of the existing site (same card pattern, same colors).
- Hash `#references` navigates directly to the tab.
- The `HASH_MAP` in the inline JavaScript is updated to include `#references`.

### Todo List
1. Add the References tab button to the tab list in `index.html` (after the Before/During/After tab).
2. Add the `panel-references` section with verified links grouped by tier.
3. Update `HASH_MAP` in the inline JS to include `'#references': 'tab-references'`.
4. Style: use the existing `.card` pattern; each resource group is a card; links use `color: var(--blue-deep)`.
5. Confirm the tab is keyboard-accessible (arrow keys work through the tablist).

### Relevant Context
- [`index.html`](index.html) lines 29–125 — the existing tab list pattern to follow.
- [`index.html`](index.html) lines 717–727 — the `HASH_MAP` to update.
- The tab icon: use the Font Awesome `fa-book-open` SVG already used on the Story Builder tab, or a simple info/link icon.

---

## Sub-Task 3 — Create the Link-Checker Test Script

**Status:** [ ] pending

### Intent
Create `test-links.js` — a Node.js script that fetches every URL in the References tab (HEAD request, following redirects) and reports pass/fail with status codes. This script can be run locally before any deployment to confirm all links are still live. It is the living proof that the References tab contains no dead links.

### Expected Outcomes
- `test-links.js` exists in the project root.
- Running the script prints a pass/fail result for every link.
- A non-200/3xx response causes the script to exit with code 1 (so it can be used as a CI gate).
- The script is self-contained — no npm install required (uses Node.js built-in `https` module).

### Todo List
1. Create `test-links.js` using Node.js built-in `https.request` with `method: 'HEAD'` and redirect following.
2. The link list in the script must exactly match the links in the References tab.
3. Output: `✅ 200 https://...` or `❌ 404 https://...` for each URL.
4. Exit code 0 if all pass, 1 if any fail.
5. Add usage instructions as a comment at the top of the file.

### Relevant Context
- [`run-tests.js`](run-tests.js) — existing test runner pattern to follow for output style.
- Node.js `https` module — no external dependencies.

---

## Sub-Task 4 — Update Smoke Test and Documentation

**Status:** [ ] pending

### Intent
The smoke test and documentation must reflect the new tab.

### Todo List
1. Add a check to [`smoke-test.html`](smoke-test.html): `#tab-references` is present and `#panel-references` is present.
2. Update [`REQUIREMENTS.md`](REQUIREMENTS.md): move REQ-REF-01–05 from Future to Implemented; update with actual verified sources.
3. Update [`update-plan.md`](update-plan.md): mark the References tab as implemented.

---

*References Plan v1.0 — Calm Skies Travel*
