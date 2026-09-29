# Requirements — Calm Skies Travel
> Created by IBM Bob

---

## Project Identity

| Item | Value |
|------|-------|
| **Site name** | Calm Skies Travel |
| **Tagline** | "Safe travels, calm skies." |
| **Primary URL** | https://calmskiestravel.com |
| **Owner** | A.J. Aronoff |
| **Primary audience** | Autistic children and their parents / caregivers |
| **Secondary audience** | Autism support groups, therapists, school staff, grandparents |
| **Hosting** | IONOS Web Hosting Plus (Contract ID: 113830291) |
| **Technology** | Pure static HTML, CSS, JavaScript — no server-side language |
| **HTTPS** | IONOS free Let's Encrypt SSL |
| **Credit** | "Created by IBM Bob" — required on every page and every printable |

---

## 1. Functional Requirements

### 1.1 Navigation
- **REQ-NAV-01:** The site shall use a single-page tab architecture. All sections are accessible without a page reload.
- **REQ-NAV-02:** Tabs shall be implemented as `<button role="tab">` elements with `aria-selected`, `aria-controls`, and keyboard arrow-key navigation.
- **REQ-NAV-03:** Each tab shall update the URL hash (e.g., `#storybuilder`) so individual tabs can be bookmarked, linked, and navigated with the browser Back button.
- **REQ-NAV-04:** Hash navigation shall be wrapped in `try/catch` so the page works when opened as a local file (no server).
- **REQ-NAV-05:** Navigation shall be hidden when the page is printed; only the active tab panel shall print.

### 1.2 Page / Tab Structure
The site shall contain the following tabs in the following order:

| # | Tab ID | Label | Description |
|---|--------|-------|-------------|
| 1 | `ourstory` | Our Story | A.J.'s personal narrative; LaGuardia photograph; why this site exists |
| 2 | `storybuilder` | Story Builder ⭐ | The heart of the site — customizable social story for the child |
| 3 | `twovoices` | Two Voices | One-guide-two-voices philosophy explained |
| 4 | `journey` | The Journey | Overview of all trip stages |
| 5 | `socialstories` | Social Stories | Guidance on using social stories for travel |
| 6 | `hints` | Helpful Hints | TSA Cares, Sunflower Lanyard, Wings for Autism, DPNA |
| 7 | `gobag` | Go Bag & Ship Ahead | Go-bag contents and ship-ahead strategy |
| 8 | `bda` | Before / During / After | Meltdown plan — before, during, and after |

> **Note:** The full planned tab structure (12 tabs per `calm-skies-travel-plan.md`) will be implemented in subsequent sessions. The 8 tabs above represent the current build. Future tabs include: Before You Go, At the Airport, On the Plane, At Your Destination, Going Home, When It Gets Hard, Hello & Thank You, Our Trip Review, Resources & References.

### 1.3 One Guide, Two Voices
- **REQ-2V-01:** Every content section shall have a **parent layer** and a **child layer**, presented side by side or toggled.
- **REQ-2V-02:** Parent content: actionable, checklist-style, warm professional tone.
- **REQ-2V-03:** Child content: plain, warm, first-person language ("I will put my bag on the belt. I can do this.").
- **REQ-2V-04:** Child content shall use optional picture support alongside text.
- **REQ-2V-05:** The child always comes first — the guide adapts to the child, not the other way around.

### 1.4 Story Builder
- **REQ-SB-01:** The Story Builder shall be the second tab — immediately after "Our Story."
- **REQ-SB-02:** Input fields shall include: child's name, destination, who they are visiting, comfort item, departure airport.
- **REQ-SB-03:** The story shall update live as the parent types (no submit button required to see the story).
- **REQ-SB-04:** The social story shall use first-person, warm language ("I am [name]. I am going to [place].").
- **REQ-SB-05:** The story shall be printable as a single-page print-ready layout.
- **REQ-SB-06:** The story shall also be viewable as an on-screen storybook. The parent chooses.
- **REQ-SB-07:** The story shall be exportable as part of the child's JSON profile.
- **REQ-SB-08:** Line-art illustrations shall accompany each story beat.
- **REQ-SB-09:** The parent shall be able to customize / edit any sentence in the generated story.

### 1.5 Data Portability (No Server Storage)
- **REQ-DATA-01:** No child data shall ever be stored on the server. This is an absolute, non-negotiable requirement.
- **REQ-DATA-02:** All profile data shall live in the parent's browser (localStorage) only.
- **REQ-DATA-03:** The parent shall be able to export the child's profile as a JSON file download.
- **REQ-DATA-04:** The parent shall be able to import a previously saved JSON file to re-populate all forms.
- **REQ-DATA-05:** The profile shall also be exportable as a QR code.
- **REQ-DATA-06:** The QR code shall be shareable — e.g., scan-to-populate for grandparents or caregivers.
- **REQ-DATA-07:** No network calls shall be made for profile data. This shall be confirmed in code comments.

### 1.6 Hello & Thank You
- **REQ-HTY-01:** A Hello & Thank You section shall exist for pre-trip and post-trip messages.
- **REQ-HTY-02:** The output shall be copy-to-email friendly — formatted text the parent can paste.
- **REQ-HTY-03:** Sending shall be quick and easy — minimal form fields, instant output.
- **REQ-HTY-04:** Output shall also be printable as a greeting card.
- **REQ-HTY-05:** Optional: parent uploads a photo from their device (stays in browser only, never sent to server).

### 1.7 Resources & References
- **REQ-REF-01:** The references page shall contain **only** verified, approved sources.
- **REQ-REF-02:** Trust tiers: Government websites (Tier 1 ✅ fully trusted), Airline websites (Tier 2 ✅ fully trusted), All other sources (Tier 3 — must score ≥90% confidence or be excluded).
- **REQ-REF-03:** No disclaimer is required — the page is clean and trustworthy-feeling.
- **REQ-REF-04:** A.J. must personally approve the final reference list before it goes live.
- **REQ-REF-05:** No hallucinated references — child safety is paramount.

### 1.8 Our Trip Review
- **REQ-OTR-01:** A Trip Review page shall allow parent and child to reflect on how the trip went.
- **REQ-OTR-02:** Parent reflection: what worked, triggers noted, go-bag changes, airline/airport tips.
- **REQ-OTR-03:** Child reflection: simple first-person prompts ("One thing I liked was ___").
- **REQ-OTR-04:** Reviews shall be saved to the local JSON profile and QR code, keyed by destination.
- **REQ-OTR-05:** A printable "Our Trip Memory" card shall be available for the child as a positive keepsake.
- **REQ-OTR-06:** Credit: suggested by A.J.'s wife.

---

## 2. Non-Functional Requirements

### 2.1 Accessibility
- **REQ-ACC-01:** No auto-playing audio or video — ever.
- **REQ-ACC-02:** No flashing or strobing animations — ever.
- **REQ-ACC-03:** Reduced motion is the default — no CSS `transition` or `animation` that would animate without explicit user opt-in.
- **REQ-ACC-04:** All interactive elements shall be keyboard accessible.
- **REQ-ACC-05:** All images shall have meaningful `alt` text (or `alt=""` for decorative icons).
- **REQ-ACC-06:** Color shall never be the sole means of conveying information — always paired with an icon or label.
- **REQ-ACC-07:** Text contrast shall meet WCAG 2.1 AA minimum (4.5:1 for normal text; 3:1 for large text). Target AAA where possible.
- **REQ-ACC-08:** Font: Atkinson Hyperlegible — designed specifically for low-vision and dyslexic readers.
- **REQ-ACC-09:** Base font size: 16px minimum. Line height: 1.75 minimum.
- **REQ-ACC-10:** Child-facing content shall use a larger font size for ease of reading aloud.
- **REQ-ACC-11:** The site shall work in both light mode and dark mode (`prefers-color-scheme`).
- **REQ-ACC-12:** The site shall be fully usable down to phone width (320px minimum viewport).

### 2.2 Privacy
- **REQ-PRIV-01:** No login. No accounts. No barriers.
- **REQ-PRIV-02:** No cookies shall be set for tracking purposes.
- **REQ-PRIV-03:** No analytics scripts, no third-party tracking pixels.
- **REQ-PRIV-04:** Any photo uploaded by a parent stays in the browser only — never transmitted.
- **REQ-PRIV-05:** The site shall operate entirely without knowledge of who is using it.

### 2.3 Technology
- **REQ-TECH-01:** Pure static HTML, CSS, JavaScript — no server-side language (PHP, Node, Python, etc.).
- **REQ-TECH-02:** No build step, no transpilation, no frameworks.
- **REQ-TECH-03:** No CDN scripts — all JavaScript shall be inline or in local files.
- **REQ-TECH-04:** One HTML file (`index.html`) + one stylesheet (`styles.css`) + the `icons/` folder.
- **REQ-TECH-05:** The site shall work when opened directly as a local file (no localhost server required).
- **REQ-TECH-06:** HTTPS shall be active via IONOS free Let's Encrypt SSL certificate.

### 2.4 Visual Style
- **REQ-VIS-01:** Color palette: Sky Calm — Cloud White (`#F7FBFF`), Calm Sky Blue (`#5BA4CF`), Meadow Green (`#6BBF8E`), Warm Sand (`#F5EFE0`).
- **REQ-VIS-02:** Icons: simple, clean line-art from open, autism-friendly symbol sets (Mulberry, OpenSymbols, Font Awesome Free).
- **REQ-VIS-03:** No bright red, neon, or fluorescent colors anywhere on the site.
- **REQ-VIS-04:** The IBM Blue (`#0F62FE`) is reserved exclusively for the IBM Bobathon badge — never used as a general UI color.

### 2.5 Printing
- **REQ-PRINT-01:** Navigation shall be hidden when printing.
- **REQ-PRINT-02:** Only the active tab panel shall print.
- **REQ-PRINT-03:** Story cards and checklist print layouts shall always use a light background with dark text, regardless of the user's color scheme setting.
- **REQ-PRINT-04:** Social story print output shall be single-page, child's name in the header, "Created by IBM Bob" in the footer.

### 2.6 Credit
- **REQ-CREDIT-01:** "Created by IBM Bob" shall appear in the footer of every page.
- **REQ-CREDIT-02:** "Created by IBM Bob" shall appear on every printable output (social story, checklists, comfort card, greeting cards).
- **REQ-CREDIT-03:** "Created by IBM Bob" shall appear on the title slide and footer of the PowerPoint presentation.

---

## 3. Content Requirements

### 3.1 Topics to Cover
All of the following topics shall be covered on the site, sourced from verified references:

| Topic | Source |
|-------|--------|
| TSA Cares program | tsa.gov (Tier 1) |
| Hidden Disabilities Sunflower Lanyard | Verified ≥90% |
| Wings for Autism airport rehearsal programs | Verified ≥90% |
| DPNA airline disability code | Airline sources (Tier 2) |
| Airport sensory rooms | Verified ≥90% |
| Go-bag contents (chewelry, headphones, fidgets, snacks) | Verified ≥90% |
| Social stories — what they are and how to use them | Verified ≥90% |
| Communication strategies from autism support groups | Verified ≥90% |
| Meltdown plan (before / during / after) | Verified ≥90% |
| Pre-boarding and seat selection | Airline sources (Tier 2) |

### 3.2 Language Standards for Child-Facing Content
- Plain, warm, first-person language only
- No clinical vocabulary on child-facing pages
- Sentences shall be short and concrete
- Optional: picture support (line-art icons) alongside every sentence
- Flexible for a wide age range — adaptable by parent

---

*Requirements v1.0 — Created by IBM Bob*
