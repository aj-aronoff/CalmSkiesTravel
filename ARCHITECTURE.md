# Architecture — Calm Skies Travel
> Created by IBM Bob

---

## Overview

Calm Skies Travel is a **100% static website** — no server-side code, no database, no build pipeline. The entire site is a single HTML file, a single CSS file, and a folder of icons. This architectural choice is not a limitation; it is a deliberate decision rooted in the project's core values: privacy by design, maximum portability, zero cost to scale, and complete auditability.

---

## High-Level Architecture

```
User's Browser
│
├── index.html          ← Single HTML file; all 8+ tabs inline
├── styles.css          ← Companion stylesheet (linked, not inline)
└── icons/              ← 17 PNG icons (extracted from PPTX + originals)
    ├── plane-takeoff.png
    ├── journey-airport.png
    ├── parent.png
    ├── child.png
    └── ... (14 more)

Hosted on: IONOS Web Hosting Plus
Domain:    calmskiestravel.com (.info, .cloud)
HTTPS:     Let's Encrypt SSL (free, via IONOS control panel)

No server-side language.
No database.
No CDN scripts.
No cookies.
No analytics.
No network calls for user data.
```

---

## Component Architecture

### 1. Navigation Layer (Tabs)

```
<div role="tablist" aria-label="Calm Skies Travel sections">
  <button role="tab" aria-selected="true"  aria-controls="panel-ourstory">Our Story</button>
  <button role="tab" aria-selected="false" aria-controls="panel-storybuilder">Story Builder</button>
  <button role="tab" aria-selected="false" aria-controls="panel-twovoices">Two Voices</button>
  ... (8 tabs total, expanding to 12)
</div>
```

**Tab switching logic (pure JavaScript, no framework):**
1. User clicks or arrow-keys to a tab button
2. JavaScript sets `aria-selected="true"` on the new tab, `"false"` on all others
3. JavaScript adds `hidden` attribute to all panels except the target panel
4. `history.replaceState` updates the URL hash (wrapped in `try/catch` for local file support)
5. On page load, JavaScript reads the URL hash and activates the matching tab; defaults to the first tab if no hash

### 2. Content Layer (Tab Panels)

Each tab is a `<section role="tabpanel">` with a unique `id` matching the `aria-controls` of its tab button.

```
<section role="tabpanel" id="panel-ourstory">
  <!-- LaGuardia photo, A.J.'s story, why this site exists -->
</section>

<section role="tabpanel" id="panel-storybuilder" hidden>
  <!-- Story Builder form + live social story card -->
</section>
```

**Two-column card layout (parent + child):**
Most content panels use a two-card layout:
```
┌──────────────────┐  ┌──────────────────┐
│  For the Parent  │  │  For the Child   │
│  [parent icon]   │  │  [child icon]    │
│  Adult-tone      │  │  First-person    │
│  guidance        │  │  warm language   │
└──────────────────┘  └──────────────────┘
```

### 3. Story Builder (Client-Side Only)

```
Form inputs (child's name, destination, comfort item, who visiting)
  │
  ▼ (oninput event → JavaScript template merge)
  │
Social Story Card (live update, no submit)
  │
  ├── On-screen storybook view
  └── Print layout (CSS @media print)
```

**Data flow:**
- All data lives in the form's DOM nodes only
- Optionally saved to `localStorage` (browser only)
- No data transmitted to any server at any point

### 4. Local Data Layer

```
localStorage (browser only)
│
├── child.name
├── child.destination
├── child.comfort_item
├── child.companions
├── story.sentences[]
├── checklist.gobag{}
└── review.trips[]

Export paths:
  ├── JSON download  → parent saves file locally
  └── QR code        → encoded JSON, shareable by camera
```

**Import path:**
```
Parent uploads JSON file → FileReader API (browser) → re-populates all form fields
```
No network. No server. No account.

### 5. Print Architecture

CSS `@media print` rules:
- Hide: site header, tab navigation, all inactive panels
- Show: only the currently active `[role="tabpanel"]`
- Override: story cards always use white background + dark text (regardless of dark mode)
- Footer: "Created by IBM Bob | calmskiestravel.com" on every print

---

## File Structure

### Current (Built)
```
CalmSkiesTravel/
├── index.html                    ← Main site file
├── styles.css                    ← All styles, tokens, responsive + print rules
├── icons/                        ← 17 icons (PNG)
│   ├── plane-takeoff.png
│   ├── plane.png
│   ├── laguardia.png
│   ├── parent.png
│   ├── child.png
│   ├── parent-figure.png
│   ├── child-arms-up.png
│   ├── journey-home.png
│   ├── journey-airport.png
│   ├── journey-plane.png
│   ├── journey-destination.png
│   ├── journey-goinghome.png
│   ├── plane-fa.png
│   ├── plane-rehearser.png
│   ├── plane-takeoff-orig.png
│   ├── parent-orig.png
│   └── child-orig.png
├── LaGuardiaNightmare.png        ← Starter file (A.J.'s photo)
├── Child.png                     ← Child figure image
├── Parent.png                    ← Parent figure image
│
├── — Planning / Documentation —
├── BackStory.txt                 ← Starter: A.J.'s narrative
├── contract.txt                  ← Starter: IONOS confirmation
├── CalmSkiesTravel.txt           ← Starter: design brief
├── CalmSkiesColorPalette.md      ← Color system
├── calm-skies-travel-plan.md     ← Master build plan (13 sub-tasks)
├── future-features.md            ← Deferred features
├── prompt-history.md             ← Complete prompt log
├── CalmSkiesSymbols.html         ← Icon reference gallery
├── CalmSkiesSymbols.svg          ← Icon sprites
│
└── — Presentation —
    ├── CalmSkiesTravel.pptx      ← Final presentation (9 slides)
    └── CalmSkiesTravel-draft.pptx ← Working draft
```

### Target (Post-Deployment, per Sub-Task 12)
```
CalmSkiesTravel/
├── README.md
├── .gitignore
├── docs/
│   ├── calm-skies-travel-plan.md
│   ├── decisions.md
│   ├── research.html
│   ├── prompt-history.md
│   ├── future-features.md
│   ├── feedback-tracker.xlsx
│   └── saved_tasks.json
├── presentation/
│   └── CalmSkiesTravel.pptx
└── site/
    ├── index.html
    ├── styles.css
    ├── icons/
    └── images/
        └── LaGuardiaNightmare.png
```

---

## Technology Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Server-side language | None | No login needed; static hosting is simpler, cheaper, more secure |
| JavaScript framework | None | Adds complexity and dependency risk; pure JS is sufficient |
| CSS preprocessor | None | CSS custom properties (variables) are native and sufficient |
| Build pipeline | None | Parent should be able to open the file and see the site |
| Font delivery | Google Fonts CSS import | Reliable; fallback to system sans-serif if offline |
| Icon format | PNG (from PPTX) + inline SVG | PNGs extracted from presentation; SVGs used for complex icons |
| Data persistence | `localStorage` | Browser-native; no server needed; user controls their data |
| QR code generation | qrcode.js (open source) | Lightweight; no server needed; encodes JSON profile |
| HTTPS | IONOS Let's Encrypt SSL | Free with IONOS plan; no configuration cost |
| Hosting | IONOS Web Hosting Plus | Already purchased by A.J.; static file support confirmed |

---

## Data Flow Diagram

```
Parent opens calmskiestravel.com
        │
        ▼
  Browser loads index.html + styles.css + icons/ (IONOS CDN / web server)
        │
        ▼
  JavaScript reads URL hash → activates correct tab
        │
        ├── Parent fills Story Builder form
        │       │
        │       ▼
        │   JavaScript merges fields into story template
        │       │
        │       └── Story card updates live in DOM (no server call)
        │
        ├── Parent saves profile
        │       │
        │       └── JSON written to localStorage (browser only)
        │                │
        │                ├── "Download JSON" → Blob download (no upload)
        │                └── "Generate QR" → qrcode.js encodes JSON → canvas (browser only)
        │
        └── Parent prints story / checklist
                │
                └── CSS @media print → navigation hidden → active panel printed

═══════════════════════════════════════════
NO DATA EVER LEAVES THE BROWSER TO A SERVER
═══════════════════════════════════════════
```

---

## Deployment Architecture

```
A.J.'s computer                     IONOS Web Hosting Plus
│                                   │
├── index.html    ─── FTP / ──────► public_html/index.html
├── styles.css       File Manager   public_html/styles.css
└── icons/                          public_html/icons/
                                    │
                                    ▼
                         calmskiestravel.com
                         HTTPS (Let's Encrypt SSL)
                                    │
                                    ▼
                              User's Browser
```

**Deployment checklist (Sub-Task 13):**
1. Upload files via IONOS File Manager or FTP
2. Activate SSL in IONOS control panel (Manage Domains → SSL)
3. Verify `https://calmskiestravel.com` loads correctly
4. Test all tabs on desktop (Chrome, Firefox, Safari) and mobile (iOS, Android)
5. Test print layouts for social story and checklists
6. Test JSON download/upload cycle
7. Test QR code generation and scan
8. A.J. final sign-off → go live

---

## Security Architecture

| Threat | Mitigation |
|--------|------------|
| Child data exposure | Zero server storage — data lives only in user's browser |
| Third-party script injection | No CDN scripts; all JS is local or inline |
| Photo upload exposure | `FileReader` API only — photo never leaves browser |
| XSS via form inputs | Story Builder uses `textContent` assignment (not `innerHTML`) for user-provided values |
| HTTPS downgrade | IONOS SSL activated; HSTS can be added via `.htaccess` if needed |
| Domain hijacking | IONOS Domain Guard purchased for all three domains |

---

*Architecture v1.0 — Created by IBM Bob*
