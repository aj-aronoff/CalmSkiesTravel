# Calm Skies Travel — Full Build Plan
> Created by IBM Bob

## Session Status

| Session | Completed Through | Next Session Starts At |
|---------|-------------------|----------------------|
| Session 1 (Planning) | Sub-Task 2 — Design System & Style Guide | Sub-Task 3 — Site Architecture & Shared Components |

---

## Top-Level Overview

**Goal:** Build and deploy a static, no-login website at [calmskiestravel.com](https://calmskiestravel.com) that helps autistic children and their parents travel with confidence, calm, and dignity.

**Author:** A.J. Aronoff — written from lived experience as a parent.

**Tagline:** "Safe travels, calm skies."

**Core Principles:**
- The child always comes first. The guide adapts to the child, not the other way around.
- One guide, two voices: every section has a parent layer and a child layer.
- No child data ever stored on the server. All personalization is local (JSON + QR code).
- No login required. No accounts. No barriers.
- Child safety is paramount — no hallucinations, no unverified references.
- Every artifact says "Created by IBM Bob" in the footer.

**Technology:** Pure static HTML, CSS, JavaScript hosted on IONOS Web Hosting Plus. HTTPS via IONOS free SSL (Let's Encrypt). No server-side language needed.

**Visual Style:** Sky Calm — soft sky blue, warm white, gentle green accents. Clean, airy, trustworthy. No auto-playing sounds, no flashing animations, reduced motion as hard rules (accessibility baseline).

---

## Final Tab / Page Structure

| # | Tab | Description |
|---|-----|-------------|
| 1 | Home | Hero, tagline, LaGuardia story intro, Story Builder CTA |
| 2 | Our Story | About A.J., the LaGuardia day, why this site exists |
| 3 | Story Builder ⭐ | Heart of the site — customizable social story for child + parent |
| 4 | Before You Go | Prep checklist — parent + child voices; go-bag guide |
| 5 | At the Airport | Airport stage — parent + child voices; TSA Cares, Sunflower lanyard |
| 6 | On the Plane | Plane stage — parent + child voices |
| 7 | At Your Destination | Destination stage — parent + child voices |
| 8 | Going Home | Return trip — parent + child voices |
| 9 | When It Gets Hard | Meltdown plan for parent + "What Helps Me Feel Better" for child |
| 10 | Hello & Thank You | Quick, copy-to-email greeting + thank you cards |
| 11 | Our Trip Review ⭐ | Parent + child record what worked, what to do better — saved to QR/JSON |
| 12 | Resources & References | Verified references only — government, airline, 90%+ confidence |

---

## Sub-Tasks

---

### Sub-Task 1 — Research & Verified Reference List

**Status:** `[ ] pending`

**Intent:**
Build a verified, hallucination-free research document covering all key topics: TSA Cares, Hidden Disabilities Sunflower, Wings for Autism, DPNA airline codes, airport sensory rooms, go-bag items, AAC communication strategies. This document becomes the factual foundation for every page and the References page on the live site. Child safety requires zero unverified claims.

**Trust Tiers:**
- ✅ Tier 1 — Government websites (tsa.gov, cdc.gov, etc.) — fully trusted
- ✅ Tier 2 — Airline websites (official airline pages) — fully trusted
- ⚠️ Tier 3 — All other sources — must score 90%+ confidence or be excluded

**Expected Outcomes:**
- `research.html` — a formatted HTML document with all questions, discovered answers, and a reference list with verification status badges
- Every referenced URL is live-checked and status-flagged
- Any source below 90% confidence is removed before the site goes live
- A.J. reviews and approves the final reference list before it appears on the live site

**Todo List:**
- [ ] Research TSA Cares program (tsa.gov) — Tier 1
- [ ] Research Hidden Disabilities Sunflower lanyard program — Tier 3, score confidence
- [ ] Research Wings for Autism airport rehearsal programs — Tier 3, score confidence
- [ ] Research DPNA (Disabled Passenger — No Advance Warning) airline code — Tier 2
- [ ] Research airport sensory rooms — list known airports, Tier 3 with confidence score
- [ ] Research go-bag items: chewelry, noise-canceling headphones, fidgets — Tier 3 with confidence score
- [ ] Research open symbol sets: Mulberry Symbols, OpenSymbols — Tier 3, verify free license
- [ ] Compile all findings into `research.html` with verification badges
- [ ] A.J. reviews and approves reference list

**Relevant Context:**
- CalmSkiesTravel.txt items 9, 10, 12
- BackStory.txt — personal experience with airport staff awareness
- future-features.md — AAC integration noted for later

---

### Sub-Task 2 — Design System & Style Guide

**Status:** `[ ] pending`

**Intent:**
Establish the visual language for the entire site before a single page is built. This ensures consistency, accessibility, and an autism-friendly sensory experience across all 11 pages.

**Expected Outcomes:**
- `design-system.html` — a living style guide showing colors, typography, button styles, icon style, spacing, and print styles
- 2–3 style sample variations presented to A.J. for selection (Sky Calm is the lead direction)
- Accessibility rules documented: no auto-play, no flash, reduced motion, high contrast text
- Print stylesheet defined (for social stories and checklists)
- Icon/illustration style confirmed (line-art, autism-friendly symbol sets)

**Todo List:**
- [ ] Define color palette: Sky Calm (soft sky blue #87CEEB range, warm white, gentle green accents)
- [ ] Define typography: clean, readable sans-serif; larger base size for child-facing content
- [ ] Define button and interactive element styles
- [ ] Define icon style (line-art, open symbol sets)
- [ ] Define print stylesheet rules (for story builder and checklists)
- [ ] Define tab/navigation component
- [ ] Document accessibility rules as hard constraints
- [ ] Build `design-system.html` sample and present to A.J. for approval
- [ ] Record design decisions in `decisions.md`

**Relevant Context:**
- CalmSkiesTravel.txt item 3 (style suggestion)
- User confirmed: Sky Calm palette, no auto-play/flash/motion

---

### Sub-Task 3 — Site Architecture & Shared Components

**Status:** `[ ] pending`

**Intent:**
Build the shared HTML shell, navigation tabs, header, footer ("Created by IBM Bob"), and the local data layer (JSON profile + QR code generation) that every page depends on. Establishing this first means every subsequent page just drops into the shell.

**Expected Outcomes:**
- `index.html` — working shell with all 11 tabs navigable
- Shared header with logo, tagline, and tab navigation
- Shared footer with "Created by IBM Bob" credit
- `profile.js` — local profile data manager: load/save to localStorage, export as JSON, generate QR code
- QR code library integrated (e.g. qrcode.js — open source)
- No data ever sent to server — confirmed in code comments

**Todo List:**
- [ ] Create site folder structure
- [ ] Build shared HTML shell (`index.html`) with tab navigation
- [ ] Build header component (logo, tagline "Safe travels, calm skies")
- [ ] Build footer component ("Created by IBM Bob")
- [ ] Implement tab switching in pure JavaScript (no frameworks)
- [ ] Implement `profile.js`: read/write child profile to localStorage
- [ ] Implement JSON export (download as `my-calm-plan.json`)
- [ ] Implement JSON import (upload file to re-populate forms)
- [ ] Integrate QR code generation (qrcode.js) — encode profile JSON
- [ ] Add QR code display + "Send to Grandparent" copy-link hint
- [ ] Add print stylesheet link to shell
- [ ] Confirm zero network calls for profile data (code comment + README note)

**Relevant Context:**
- CalmSkiesTravel.txt lines 41–43 (no login, key-value file, report, QR scan)
- contract.txt — IONOS Web Hosting Plus, static files only
- future-features.md item 1 — server storage deferred

---

### Sub-Task 4 — Home Page & Our Story (About A.J.)

**Status:** `[ ] pending`

**Intent:**
Create the emotional front door of the site. The Home page establishes trust immediately — this is a real family's story, not a corporate product. The Story Builder CTA is the hero action. The "Our Story" page gives A.J.'s voice and the LaGuardia moment.

**Expected Outcomes:**
- Home tab: tagline, LaGuardia photo, brief 2–3 sentence welcome, prominent "Build Your Travel Story" button leading to Story Builder
- Our Story tab: A.J.'s personal narrative, LaGuardia photo, "why this site exists" — warm, personal, first-person
- Both pages pass accessibility check (contrast, alt text, reduced motion)

**Todo List:**
- [ ] Write Home page copy (warm welcome, tagline, brief mission)
- [ ] Place LaGuardia photo with meaningful alt text
- [ ] Add hero "Build Your Travel Story →" call-to-action button
- [ ] Write Our Story page — A.J.'s narrative from BackStory.txt, expanded warmly
- [ ] Add LaGuardia photo to Our Story page with caption
- [ ] Apply Sky Calm design system styles
- [ ] Add "Created by IBM Bob" footer
- [ ] Accessibility review (alt text, contrast, heading hierarchy)

**Relevant Context:**
- BackStory.txt — source narrative
- LaGuardiaNightmare.png — use on both Home and Our Story
- User: "Everyone calls me by my initials A.J."

---

### Sub-Task 5 — Story Builder ⭐ (Heart of the Project)

**Status:** `[ ] pending`

**Intent:**
The Story Builder is the most important feature on the site. A parent enters the child's name, destination, who they'll see, and answers 1–2 friendly child-facing questions. The site generates a warm, first-person social story the child and parent read together. It can be displayed as an on-screen storybook OR printed as a single-page story. The story can also be included in the exported JSON/QR code profile.

**Child Questions (friendly, simple, 1–2 max):**
- "What is one thing you are excited about on this trip?"
- "What is one thing that helps you feel calm?"

**Expected Outcomes:**
- Story Builder form: child's name, destination, travel companions, departure airport, excited-about, calm-helper
- On-screen storybook view: large text, warm illustrations, page-turn feel, child reads along
- Print view: single-page story, print-ready, child's name on every page
- Story text uses plain, warm, first-person sentences ("I am [name]. I am going to [place]...")
- Line-art illustrations accompany each story beat
- Story is included in JSON export and QR code
- Parent can customize/edit any sentence in the story
- "Created by IBM Bob" on print output

**Todo List:**
- [ ] Design Story Builder form (child's name, destination, companions, airport, 2 child questions)
- [ ] Write master social story template with merge fields
- [ ] Build on-screen storybook view (large text, illustrations, paged)
- [ ] Build print layout (single page, child's name header, print CSS)
- [ ] Connect story fields to profile.js (include in JSON/QR export)
- [ ] Add parent customization — editable sentences
- [ ] Source and integrate line-art illustrations for each story beat (Mulberry/OpenSymbols)
- [ ] Add "Print Story" and "Save to My Plan" buttons
- [ ] Add "Created by IBM Bob" to print output
- [ ] Accessibility review

**Relevant Context:**
- CalmSkiesTravel.txt item 4 (social stories, story builder)
- Sub-Task 3 (profile.js, JSON/QR export)
- Design system (line-art icons, print stylesheet)

---

### Sub-Task 6 — Trip Stage Pages (Before You Go → Going Home)

**Status:** `[ ] pending`

**Intent:**
Build the five trip-stage pages (Before You Go, At the Airport, On the Plane, At Your Destination, Going Home). Each page has two layers: a parent checklist/guide and a child-facing version in plain first-person language with optional picture support. The go-bag section lives in "Before You Go."

**Expected Outcomes:**
- 5 pages, each with a Parent tab and a Child tab (within the page)
- Parent checklists: actionable, scannable bullet points
- Child sections: plain, warm, first-person sentences + optional line-art icons
- "Before You Go" includes the full go-bag guide (chewelry, headphones, music, snacks, social story) and ship-ahead tip
- "At the Airport" includes TSA Cares, Sunflower lanyard, Wings for Autism, DPNA, pre-boarding
- Checklist items are checkable (checkbox state held in localStorage via profile.js)
- Print view available for each checklist
- "Created by IBM Bob" footer on all pages and print outputs

**Todo List:**
- [ ] Write parent content for all 5 stages (sourced from research.html, CalmSkiesTravel.txt)
- [ ] Write child-facing content for all 5 stages (first-person, warm, simple)
- [ ] Build parent/child toggle (tab within page) component
- [ ] Implement checkable checklist with localStorage persistence
- [ ] Source line-art icons for key checklist items
- [ ] Add go-bag section to "Before You Go" with ship-ahead tip
- [ ] Add TSA Cares, Sunflower lanyard, DPNA, Wings for Autism to "At the Airport"
- [ ] Add print stylesheet for checklists
- [ ] Add "Created by IBM Bob" footer
- [ ] Accessibility review all 5 pages

**Relevant Context:**
- CalmSkiesTravel.txt items 6, 7, 9, 10, 11
- research.html (Sub-Task 1) — all factual claims sourced here
- profile.js (Sub-Task 3) — checklist state persistence

---

### Sub-Task 7 — When It Gets Hard (Meltdown Plan)

**Status:** `[ ] pending`

**Intent:**
This section has two distinct layers. For the parent: a practical, compassionate before/during/after meltdown plan. For the child: a gentle, empowering "What Helps Me Feel Better" guide — comfort items, calm strategies, their safe person — customizable and printable. No blame. No shame.

**Expected Outcomes:**
- Parent layer: Before (spot triggers), During (safe, quiet, fewer words), After (comfort, water, no blame, note trigger)
- Child layer: "What Helps Me Feel Better" — customizable comfort plan with child's own answers (1–2 friendly questions)
- Child's comfort plan included in JSON/QR export
- Print view for child's comfort card (small, laminate-friendly)
- Warm, supportive tone throughout — no clinical language on child-facing content

**Todo List:**
- [ ] Write parent meltdown plan content (before/during/after)
- [ ] Write child "What Helps Me Feel Better" template
- [ ] Add 1–2 friendly child questions ("What is one thing that makes you feel calm?", "Who is your safe person?")
- [ ] Build customizable child comfort card
- [ ] Build laminate-friendly print layout for child comfort card
- [ ] Connect child comfort answers to profile.js (JSON/QR export)
- [ ] Add "Created by IBM Bob" footer
- [ ] Accessibility review

**Relevant Context:**
- CalmSkiesTravel.txt item 8
- Sub-Task 3 (profile.js)
- Sub-Task 5 (Story Builder — reuse child question pattern)

---

### Sub-Task 8 — Hello & Thank You Page

**Status:** `[ ] pending`

**Intent:**
A quick, joyful, low-effort page that lets a child (with parent help) send a greeting to a relative, host, or hotel — or a thank-you after the trip. The output is copy-to-email friendly. Fast. Easy. Fun for the child.

**Expected Outcomes:**
- Simple form: child's name, recipient's name, destination, optional "one thing I'm excited about" or "one thing I enjoyed"
- Two modes: Hello (before trip) and Thank You (after trip)
- Output: a warm, ready-to-copy email-friendly message the parent can paste and send
- Optional: parent uploads a photo (stays in browser only, never sent to server) to include in the message
- Output also printable as a simple greeting card
- Child's name pre-filled from profile if already entered
- "Created by IBM Bob" footer

**Todo List:**
- [ ] Build Hello/Thank You toggle (two modes)
- [ ] Build form: child name, recipient, destination, one personal detail
- [ ] Write warm message templates for Hello and Thank You
- [ ] Build copy-to-email output (formatted text, easy to paste)
- [ ] Add optional local photo upload (browser only, never sent to server)
- [ ] Build printable greeting card layout
- [ ] Pre-fill child name from profile.js if available
- [ ] Add "Created by IBM Bob" footer
- [ ] Accessibility review

**Relevant Context:**
- CalmSkiesTravel.txt item 5
- Sub-Task 3 (profile.js — pre-fill name)
- User: "Sending Hello and Thank You should be quick and easy"

---

### Sub-Task 9 — Resources & References Page

**Status:** `[ ] pending`

**Intent:**
A clean, trusted reference list — only resources A.J. has personally approved. No disclaimer needed. Government and airline sources are Tier 1/2 (fully trusted). All other sources must score 90%+ confidence. This page is the credibility anchor for the site.

**Expected Outcomes:**
- Clean, readable reference list grouped by category
- Each entry: name, brief description, URL, trust tier badge (Gov / Airline / Verified)
- No entries below 90% confidence
- All URLs confirmed live before publishing
- A.J. final approval before this page goes live
- "Created by IBM Bob" footer

**Todo List:**
- [ ] Pull approved references from research.html (Sub-Task 1)
- [ ] Group references by category (TSA/Security, Airlines, Autism Organizations, Sensory Tools, etc.)
- [ ] Add trust tier badge to each entry
- [ ] Confirm all URLs are live
- [ ] Present final list to A.J. for approval
- [ ] Build references page HTML
- [ ] Add "Created by IBM Bob" footer
- [ ] Accessibility review

**Relevant Context:**
- research.html (Sub-Task 1) — source of all references
- CalmSkiesTravel.txt item 1 (no hallucinations, child safety)
- User trust tiers: Gov ✅, Airline ✅, Other ≥90% confidence only

---

### Sub-Task 9b — Our Trip Review Page

**Status:** `[ ] pending`

**Intent:**
After every trip, both the parent and the child have a voice in recording how it went. What worked well? What should be done differently next time? These reflections are saved into the child's JSON profile and QR code — so the next trip starts smarter. This is the learning loop that makes every journey better than the last. Suggested by A.J.'s wife.

**Two Voices — same as every other page:**
- **Parent layer:** structured reflection prompts (what worked, what triggered difficulty, what to pack differently, what to request from the airline next time)
- **Child layer:** simple, friendly, first-person prompts ("One thing I liked was ___", "Next time I want to bring ___", "Something that was hard was ___", "I felt proud when ___")

**Expected Outcomes:**
- Trip Review page with parent reflection form and child reflection form (toggled, same as other pages)
- Both sets of answers saved into the local JSON profile and QR code
- Review history preserved across trips — each review is timestamped by trip destination (not by date, to keep it simple and child-friendly)
- Printable "Our Trip Memory" card for the child — a positive keepsake
- Parent can view past trip reviews to prepare for future travel
- "Created by IBM Bob" footer

**Todo List:**
- [ ] Write parent reflection prompts (what worked, triggers noted, go-bag changes, airline/airport tips for next time)
- [ ] Write child reflection prompts (simple, warm, first-person, 3–4 questions max)
- [ ] Build parent/child toggle (consistent with other stage pages)
- [ ] Save review answers to profile.js (keyed by trip destination)
- [ ] Display past trip reviews in a simple timeline/list
- [ ] Build printable "Our Trip Memory" card for the child (positive, celebratory tone)
- [ ] Connect review data to JSON export and QR code
- [ ] Add "Created by IBM Bob" footer
- [ ] Accessibility review

**Relevant Context:**
- Sub-Task 3 (profile.js) — review data stored in JSON/QR alongside profile
- Sub-Task 5 (Story Builder) — next trip's story can be pre-informed by last review
- Sub-Task 7 (When It Gets Hard) — trigger notes from review feed back into meltdown plan
- Suggested by A.J.'s wife — the learning loop that improves every trip

---

### Sub-Task 10 — PowerPoint Presentation

**Status:** `[ ] pending`

**Intent:**
Before the site is deployed to the public, produce a PowerPoint presentation that explains what was built, why each decision was made, and how the site works — suitable for sharing with the autism support group, potential collaborators, or anyone A.J. wants to brief before launch.

**Expected Outcomes:**
- A polished `.pptx` presentation covering the full project
- One slide per major section / sub-task
- Includes the LaGuardia photo, the Sky Calm color palette, and the Story Builder as the hero feature
- Screenshots or mockups of each key page
- Written in plain, warm language — accessible to non-technical audiences
- "Created by IBM Bob" on the title slide and footer
- Delivered before deployment (Sub-Task 11)

**Slide Structure (proposed):**
1. Title slide — "Calm Skies Travel" tagline + LaGuardia photo
2. Our Story — A.J.'s backstory, why this matters
3. The Child Always Comes First — core philosophy
4. One Guide, Two Voices — parent + child layers explained
5. The Story Builder — heart of the project, screenshot/mockup
6. The Trip Stages — Before You Go → Going Home overview
7. When It Gets Hard — meltdown plan + child comfort card
8. Hello & Thank You — quick, joyful communication
9. Privacy by Design — no server storage, JSON + QR explained simply
10. Resources — trust tiers, verified references
11. The Technology — static site, IONOS, HTTPS, no login
12. What's Next — future features overview
13. Thank You slide — "Safe travels, calm skies" + IBM Bob credit

**Todo List:**
- [ ] Gather screenshots / mockups of all completed pages
- [ ] Write slide copy (warm, plain language, non-technical)
- [ ] Build `.pptx` using Sky Calm color palette
- [ ] Add LaGuardia photo to title slide
- [ ] Add Story Builder mockup to slide 4
- [ ] Add "Created by IBM Bob" to title and footer
- [ ] A.J. reviews and approves presentation
- [ ] Finalize before deployment

**Relevant Context:**
- All sub-tasks above — each gets a summary slide
- LaGuardiaNightmare.png — title slide visual
- Sky Calm design system (Sub-Task 2) — palette for slide theme
- future-features.md — slide 12 source material

---

### Sub-Task 11 — Design Decisions Document & Excel Tracking

**Status:** `[ ] pending`

**Intent:**
Maintain a living record of every design decision made during the project — what was decided, why, and any alternatives considered. Also create the Excel spreadsheet tracker for feedback on each deliverable.

**Expected Outcomes:**
- `decisions.md` — design decisions document with reasoning for each choice
- `feedback-tracker.xlsx` — one master Excel file with one sheet per sub-task/page, columns: Item, Decision/Prompt, Feedback, Status
- Both files updated after each sub-task is completed
- "Created by IBM Bob" noted in both files

**Todo List:**
- [ ] Create `decisions.md` with decisions made during planning session
- [ ] Create `feedback-tracker.xlsx` with one sheet per sub-task
- [ ] Update both files after each sub-task review
- [ ] Add "Created by IBM Bob" credit to both

**Relevant Context:**
- CalmSkiesTravel.txt items 0, 5, 7 (Excel spreadsheet, decisions doc, IBM Bob credit)
- prompt-history.md — source of planning decisions

---

### Sub-Task 12 — GitHub Repository

**Status:** `[ ] pending`

**Intent:**
Create a public GitHub repository for the Calm Skies Travel project. The repo serves as the single source of truth for every file — design decisions, HTML, JavaScript, CSS, the PowerPoint presentation, the Excel feedback tracker, research, and plan documents. This ensures the project is version-controlled, shareable, and preserved.

**Expected Outcomes:**
- A GitHub repository named `CalmSkiesTravel` under A.J.'s account
- All project files committed and organized in a clear folder structure
- A `README.md` that explains the project, its mission, and how to contribute or deploy
- `.gitignore` configured to exclude nothing important (all files are safe to share — no secrets, no child data)
- "Created by IBM Bob" noted in the README
- Repository ready before or alongside deployment

**Folder Structure (proposed):**
```
CalmSkiesTravel/
├── README.md
├── .gitignore
├── docs/                        ← Plan, decisions, research, prompt history
│   ├── calm-skies-travel-plan.md
│   ├── decisions.md
│   ├── research.html
│   ├── prompt-history.md
│   ├── future-features.md
│   ├── feedback-tracker.xlsx
│   └── saved_tasks.json          ← Bob task snapshot (generated at end of implementation)
├── presentation/
│   └── CalmSkiesTravel.pptx
├── site/                        ← All deployable website files
│   ├── index.html
│   ├── css/
│   ├── js/
│   │   └── profile.js
│   ├── images/
│   │   └── LaGuardiaNightmare.png
│   └── icons/                   ← Line-art symbol set files
└── assets/
    └── BackStory.txt
```

**Todo List:**
- [ ] Create GitHub repository `CalmSkiesTravel` (public)
- [ ] Write `README.md` — project mission, how to use, how to deploy, IBM Bob credit
- [ ] Create `.gitignore` (exclude OS files like `.DS_Store`, `Thumbs.db`)
- [ ] Commit all `docs/` files (plan, decisions, research, prompt history, future features, Excel)
- [ ] Commit `presentation/CalmSkiesTravel.pptx` (Sub-Task 10)
- [ ] Commit all `site/` files (HTML, CSS, JS, images, icons) as they are completed
- [ ] Run `bob --list-tasks all | jq '.' > saved_tasks.json` to snapshot all Bob task records
- [ ] Commit `saved_tasks.json` to `docs/` folder
- [ ] Tag a release `v1.0` when site is deployment-ready
- [ ] Confirm repository is public and accessible

**Relevant Context:**
- All sub-tasks — every artifact goes into the repo
- Sub-Task 10 (PowerPoint) — committed to `presentation/`
- Sub-Task 11 (Decisions doc + Excel) — committed to `docs/`
- Sub-Task 13 (Deployment) — deploy from `site/` folder to IONOS

---

### Sub-Task 13 — Final Review, HTTPS, and Deployment

**Status:** `[ ] pending`

**Intent:**
Deploy the completed site to IONOS, activate HTTPS via IONOS free SSL (Let's Encrypt), and do a full pre-launch review. Confirm all pages work, all print layouts render correctly, all references are live, and no child data is ever transmitted to the server.

**Expected Outcomes:**
- Site live at https://calmskiestravel.com
- HTTPS active (IONOS SSL certificate activated in IONOS control panel — no additional cost)
- All 11 tabs functional on desktop and mobile
- All print layouts tested (social story, checklists, comfort card, greeting card)
- JSON export/import tested
- QR code generation tested
- Zero server-side data transmission confirmed
- A.J. final sign-off

**Todo List:**
- [ ] Upload all files to IONOS Web Hosting Plus via IONOS File Manager or FTP
- [ ] Activate SSL certificate in IONOS control panel (Manage Domains → SSL)
- [ ] Confirm https://calmskiestravel.com loads correctly
- [ ] Test all 11 tabs on desktop (Chrome, Firefox, Safari)
- [ ] Test all 11 tabs on mobile (iOS Safari, Android Chrome)
- [ ] Test print layout for social story
- [ ] Test print layout for checklists
- [ ] Test print layout for comfort card
- [ ] Test print layout for Hello/Thank You card
- [ ] Test JSON download and re-upload
- [ ] Test QR code generation and scan
- [ ] Confirm "Created by IBM Bob" appears on all pages and printables
- [ ] A.J. final review and sign-off
- [ ] Go live 🎉

**Relevant Context:**
- contract.txt — IONOS Web Hosting Plus, calmskiestravel.com, .info, .cloud
- CalmSkiesTravel.txt lines 41–43 (HTTPS certificate discussion)
- IONOS includes free Let's Encrypt SSL — no purchase needed

---

## Key Decisions Summary

| Decision | Choice | Reason |
|----------|--------|--------|
| Child data storage | None on server — localStorage + JSON + QR only | Privacy, child safety, simplicity |
| Technology stack | Pure static HTML/CSS/JS | No login needed, IONOS compatible, secure |
| Hosting | IONOS Web Hosting Plus | Already purchased |
| HTTPS | IONOS free SSL (Let's Encrypt) | Included in plan, no extra cost |
| Visual style | Sky Calm — blue, white, green | Calm, airy, autism-friendly |
| Motion/sound | No auto-play, no flash, reduced motion | Sensory accessibility — hard rules |
| Story format | On-screen storybook + print layout | Parent chooses |
| Data export | JSON download + QR code | Shareable, portable, no server |
| Hello/Thank You output | Copy-to-email text + printable card | Quick, easy, joyful |
| Image style | Line-art icons, open symbol sets | Free, safe, autism-friendly |
| References | Gov ✅, Airline ✅, Other ≥90% only | Child safety, no hallucinations |
| IBM Bob credit | Footer on every page and printable | Per A.J.'s requirements |
| PowerPoint | Full project presentation before deployment | Share with support group and collaborators before go-live |
| GitHub repo | Public repo with all files — code, docs, presentation, research | Version control, shareability, preservation |
| Tonight's stopping point | Complete through Sub-Task 2 (Design System) | Resume next session at Sub-Task 3 |

---

*Plan version 1.2 — GitHub repository sub-task added.*
*Created by IBM Bob*
