# Responsible Engineering — Calm Skies Travel
> Created by IBM Bob

---

## Statement of Principle

Calm Skies Travel was built on a single, non-negotiable foundation:

> **Zero personal information about any child is ever collected, transmitted, stored, or processed by this website or its hosting provider.**

This is not a compliance posture. It is a moral one. The users of this site are autistic children — among the most vulnerable people on the internet. Their data will never be gathered, analyzed, monetized, or shared — not now, not in any future version, without explicit, informed, opt-in consent from a parent or legal guardian and a full privacy review.

---

## 1. Zero Data Collection — Current Architecture

### What the website collects: Nothing.

The current architecture of Calm Skies Travel ensures the following is true at all times:

| Data Type | Collected? | Where It Lives | Server Receives It? |
|-----------|------------|----------------|---------------------|
| Child's name | Only if parent types it | Parent's browser only (`localStorage`) | ❌ Never |
| Child's destination | Only if parent types it | Parent's browser only | ❌ Never |
| Child's comfort items | Only if parent types it | Parent's browser only | ❌ Never |
| Child's photo | Only if parent uploads it | Browser memory only (`FileReader`) | ❌ Never |
| Child's social story | Only if parent builds it | Parent's browser only | ❌ Never |
| Checklist responses | Only if parent checks them | Parent's browser only | ❌ Never |
| Trip review answers | Only if parent/child fills them | Parent's browser only | ❌ Never |
| IP address | Standard web server log | IONOS server log (not linked to child data) | ⚠️ See §3 |
| Cookies | None set by the site | N/A | ❌ None |
| Analytics | None | N/A | ❌ None |
| Tracking pixels | None | N/A | ❌ None |

---

## 2. Technical Implementation of Privacy

### 2.1 No Server-Side Code
The site is 100% static HTML, CSS, and JavaScript. There is no PHP, Python, Node.js, or any other server-side language. No code runs on the server when a user visits a page — the server simply delivers files.

### 2.2 No Database
There is no database. There is no storage layer on the server. It is technically impossible for the server to save child data because there is no mechanism to receive or store it.

### 2.3 localStorage — Browser Only
Any data a parent enters (child's name, destination, social story, checklist items) is saved using the browser's `localStorage` API. This means:
- The data lives only on the parent's device
- The data never travels across any network
- Clearing the browser's local storage clears all data
- A.J. or the server has no access to this data — ever

### 2.4 JSON Export — Parent Controls Their Data
Parents can export their child's profile as a JSON file. This file:
- Downloads directly to the parent's device
- Is never uploaded to any server
- Is the parent's property entirely
- Can be deleted at any time by deleting the file

### 2.5 QR Code — Encoded in the Browser
The QR code is generated entirely within the user's browser using client-side JavaScript (qrcode.js). The encoded data never leaves the browser. The QR code image is rendered on a `<canvas>` element — it can be shared by the parent at their own discretion (e.g., with grandparents), but this sharing is the parent's choice, not the site's action.

### 2.6 Photo Upload — Browser Only
If a parent uploads a photo (for the Hello & Thank You card), the photo is read using the browser's `FileReader` API. It is displayed only in the current browser session and is never transmitted to any server. No photo data is ever stored in `localStorage` — photos are session-only.

### 2.7 No Third-Party Scripts
No CDN scripts are loaded. No analytics library is included. No social media sharing buttons (which typically track users) are used. Every JavaScript file is local to the site.

---

## 3. IONOS Hosting — What the Server Sees

### Standard Web Server Logs
IONOS Web Hosting Plus, like all web servers, generates standard HTTP access logs. These logs may include:
- Visitor IP addresses
- Pages requested
- Browser user agent strings
- Timestamps

**Critically important:** These logs contain **no child data** because no child data is ever transmitted from the browser to the server. The server cannot log what it never receives.

These logs are managed by IONOS under their own privacy policy and data retention rules. They are a standard web hosting function and are not unique to this site.

### No Child Linkage
IONOS has no way to know that any visitor to `calmskiestravel.com` is an autistic child. The site sends no identifying information. The server logs are anonymous web traffic — no different from any other website visit.

---

## 4. Data Minimization Principles Applied

| Principle | How Applied |
|-----------|-------------|
| **Collect only what is necessary** | The site collects nothing. Parents voluntarily type data into form fields that live only in their browser. |
| **Store for the minimum necessary time** | `localStorage` persists until the parent clears it. Session-only data (like photos) is gone when the tab is closed. |
| **No purpose creep** | Data entered in the Story Builder is used only to generate the social story. It is not re-used for analytics, recommendations, or any other purpose. |
| **User control** | The parent can clear all data at any time by clearing browser storage. No request to a server is required. |
| **Transparency** | This document and the site's architecture are public. There are no hidden data flows. |

---

## 5. Child Safety — Content Standards

### 5.1 No Hallucinated Information
The `CalmSkiesTravel.txt` design brief explicitly states: **"NO hallucinations (child safety)"**. Every factual claim on the site must be sourced from verified references:
- Tier 1: Government websites (e.g., tsa.gov) — fully trusted
- Tier 2: Airline websites — fully trusted
- Tier 3: All other sources — must score ≥90% confidence or be excluded

A.J. personally reviews and approves every reference before it appears on the live site.

### 5.2 No Unverified Medical or Therapeutic Advice
The site does not offer medical advice, diagnostic guidance, or therapeutic recommendations. It shares the lived-experience knowledge of a parent and community. Any content that could be construed as medical advice is reviewed before publication.

### 5.3 No External Links Without Verification
External links in the Resources & References section are live-checked before deployment and re-checked before any update. Broken links are removed.

---

## 6. Future Features — Privacy Review Required

The following features are in `future-features.md` and are **deferred pending full privacy review**:

| Future Feature | Privacy Consideration Before Enabling |
|----------------|---------------------------------------|
| Server-side profile storage | Requires COPPA compliance (children under 13), GDPR review (EU visitors), explicit parental consent framework, clear data retention and deletion policy |
| User accounts | Requires secure authentication, password hashing, account deletion capability, privacy policy |
| Community features | Requires moderation, child-safety content policies, PII scrubbing from shared stories |
| Airport sensory reviews | Crowdsourced data must be free of PII; moderation required |
| Push notifications / flight alerts | Requires opt-in consent, integration with external APIs reviewed for data sharing |

**Policy:** No personal data feature shall be enabled without:
1. A full privacy impact assessment
2. A plain-language privacy policy written for parents (not lawyers)
3. A.J.'s explicit approval
4. Legal review if the site reaches significant scale

---

## 7. IBM Bob — Responsible AI in This Project

IBM Bob was used to build every artifact in this project — planning documents, the website, the presentation, and this document. The following responsible AI practices were applied throughout:

| Practice | How Applied |
|----------|-------------|
| **No hallucinations** | IBM Bob was explicitly instructed that child safety requires zero unverified claims. All factual content is flagged for A.J.'s verification. |
| **Transparency** | Every file produced by IBM Bob is credited "Created by IBM Bob." There is no attempt to obscure AI's role. |
| **Human in the loop** | Every design decision was reviewed and confirmed by A.J. Bob asked clarifying questions; A.J. answered. Bob did not act unilaterally on consequential decisions. |
| **Child data never processed by AI** | No child personal information was entered into any AI prompt during this project. The Story Builder templates use placeholder merge fields — no real child's data was ever shared with any AI system. |
| **Privacy by design** | The zero-data architecture was designed collaboratively by Bob and A.J. and is documented fully. |

---

## 8. Commitment

This project commits to the following:

1. **The website will never collect personal information about any child without explicit, informed, opt-in consent.**
2. **The server will never store child data.**
3. **If the architecture ever changes to include server storage, this document will be updated and a full privacy review will be completed before deployment.**
4. **The community of autistic children and their families who use this site will always be treated with dignity, respect, and the highest standard of data protection.**

---

*Responsible Engineering v1.0 — Created by IBM Bob*  
*The child is always first. Their data belongs to them and their family — no one else.*
