# Link Verification Log — References & Resources Tab
> Verified by IBM Bob via HTTP HEAD/GET requests · Calm Skies Travel

---

## Verified Links (included in References tab)

| Status | Code | URL | Notes |
|---|---|---|---|
| ✅ VERIFIED | 200 | `https://www.tsa.gov/travel/passenger-support` | TSA Cares program page |
| ✅ VERIFIED | 200 | `https://www.tsa.gov/contact-center/form/cares` | TSA Cares contact/request form |
| ✅ VERIFIED | 200 | `https://www.tsa.gov/precheck` | TSA PreCheck program page |
| ✅ VERIFIED | 200 | `https://www.tsa.gov/travel/security-screening/whatcanibring/all` | TSA — what you can bring (replaces broken /traveling-children URL) |
| ✅ VERIFIED | 200 | `https://www.aa.com/i18n/travel-info/special-assistance/special-assistance.jsp` | American Airlines special assistance |
| ✅ VERIFIED | 200 | `https://www.delta.com/us/en/need-help/overview` | Delta special needs / disability travel |
| ✅ VERIFIED | 200 | `https://www.southwest.com/html/customer-service/unique-travel-needs/customers-with-disabilities-pol.html` | Southwest customers with disabilities |
| ✅ VERIFIED | 200 | `https://hdsunflower.com` | Hidden Disabilities Sunflower — official site |
| ✅ VERIFIED | 200 | `https://hdsunflower.com/us/` | Hidden Disabilities Sunflower — US landing page |
| ✅ VERIFIED | 200 | `https://thearc.org/our-initiatives/travel/` | Wings for Autism / Wings for All at The Arc (URL moved from /our-initiatives/wings-for-autism/) |
| ✅ VERIFIED | 200 | `https://autismsociety.org` | Autism Society of America |
| ✅ VERIFIED | 200 | `https://www.autismspeaks.org/tool-kit/travel-safety-tips` | Autism Speaks — travel safety tips |
| ✅ VERIFIED | 200 | `https://carolgraysocialstories.com/social-stories` | Carol Gray — What is a Social Story? |
| ✅ VERIFIED | 200 | `https://autismsociety.org/resource/` | Autism Society — resources directory |

---

## Omitted Links (failed verification — not included in tab)

| Status | Code | URL | Reason |
|---|---|---|---|
| ❌ OMITTED | 404 | `https://www.tsa.gov/travel/security-screening/whatcanibring/traveling-children` | Page no longer exists; replaced with /whatcanibring/all |
| ❌ OMITTED | ERR | `https://www.united.com/en/us/fly/travel/special-needs.html` | United.com blocks all automated requests (connection reset); omitted to avoid linking a potentially broken page |
| ❌ OMITTED | 404 | `https://hdsunflower.com/us/about/where-to-find-us` | Subpage no longer exists; replaced with /us/ |
| ❌ OMITTED | ERR | `https://www.airport-dimensions.com/sensory-rooms/` | Site blocks all automated requests; no verifiable alternative found; omitted |
| ❌ OMITTED | 404 | `https://carolgraysocialstories.com/social-stories/what-is-it/` | Subpage moved; replaced with /social-stories |
| ❌ OMITTED | 405 | `https://www.iata.org/en/programs/passenger/pax-services/special-service-request/` | IATA blocks automated requests (405 Method Not Allowed); omitted as unverifiable |

---

## Verification Method
- HTTP HEAD requests with browser User-Agent string, following up to 5 redirects
- GET requests used as fallback where HEAD was blocked
- Sites returning connection reset errors were attempted multiple times with different paths
- Only URLs returning HTTP 200 on at least one attempt are included

---

*Verification performed by IBM Bob · Calm Skies Travel*
