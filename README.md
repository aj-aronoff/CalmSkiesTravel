# Calm Skies Travel

> **"Safe travels, calm skies."**

A free, open-source, privacy-first travel guide for autistic children and their parents — covering every stage of the journey with two voices: one for the parent, one for the child.

---

## The Story

My family was flying to Florida to visit my mom. My daughter, who is autistic, generally loves to travel. We always pack a go-bag: fidgets, chewelry, noise-canceling headphones, preloaded music, and snacks.

But that day, LaGuardia was packed. The security line was a nightmare. The staff were wonderful and perceptive — but the day would have gone so much better if I had known what I know now.

**This website is for every family in a similar situation.**

Safe travels, calm skies, and best wishes.
— A.J. Aronoff

---

## What This Site Does

Calm Skies Travel gives autistic children and their parents:

- **A Social Story Builder** — the heart of the site. Type in the child's name, destination, and comfort items. The site generates a warm, first-person social story to read together before the trip. Print it. Laminate it. Read it ten times.
- **One Guide, Two Voices** — every topic has a parent layer (actionable, scannable) and a child layer (plain, first-person, warm, shame-free).
- **Every stage of the journey** — Before You Go, At the Airport, On the Plane, At Your Destination, Going Home.
- **The Go-Bag guide** — chewelry, headphones, preloaded music, snacks, and the "ship ahead" strategy.
- **Helpful hints** — TSA Cares, the Hidden Disabilities Sunflower Lanyard, Wings for Autism airport rehearsals, the DPNA airline code, sensory rooms.
- **When It Gets Hard** — a compassionate before/during/after meltdown plan for parents, and a "What Helps Me Feel Better" comfort plan for the child.
- **Hello & Thank You** — quick, joyful messages to relatives, hosts, or hotels — copy-to-email ready.
- **Our Trip Review** — after every trip, parent and child record what worked and what to do better next time. Every trip makes the next one smarter. *(Suggested by A.J.'s wife.)*
- **Verified Resources & References** — government and airline sources (fully trusted) plus vetted third-party resources (≥90% confidence only). No unverified claims. Child safety is paramount.

---

## Privacy — The Short Version

**Zero personal information about any child is ever collected, transmitted, or stored by this website.**

- No login. No accounts. No cookies. No analytics. No tracking.
- Everything you type stays in your browser.
- Download your child's profile as a JSON file or QR code — it's yours, and only yours.
- The server never sees your child's name, destination, or any personal detail.

For full details, read [RESPONSIBLE_ENGINEERING.md](RESPONSIBLE_ENGINEERING.md).

---

## Accessibility — Designed for Autistic Children

Every design decision was made with autistic children as the primary user:

- **Atkinson Hyperlegible** font — designed for low-vision and dyslexic readers
- **Sky Calm palette** — soft, muted colors; no bright red, no neon, no fluorescent
- **No animations, no auto-play audio, no flashing** — these are hard rules with no exceptions
- **First-person, warm, concrete language** on all child-facing content
- **Printable** — social stories and checklists are designed to be printed and laminated
- **Works offline** — open the HTML file directly, no internet connection needed
- **Responsive** — works on phone, tablet, and desktop
- **Dark mode support** — respects the user's system color scheme preference

For full details, read [ACCESSIBILITY_REPORT.md](ACCESSIBILITY_REPORT.md).

---

## How to Use

### Online
Visit **https://calmskiestravel.com** — works in any modern browser, no account needed.

### Offline / Local
1. Download or clone this repository
2. Open `index.html` in any web browser
3. Everything works — including the Story Builder, JSON export, and print layouts

### Deploying Your Own Copy
1. Upload `index.html`, `styles.css`, and the `icons/` folder to any static web host
2. Enable HTTPS (most hosts offer free Let's Encrypt SSL)
3. Done — no server configuration needed

---

## Files in This Repository

| File / Folder | Description |
|---------------|-------------|
| `index.html` | The complete website — all tabs, all content, Story Builder |
| `styles.css` | Stylesheet — Sky Calm palette, dark mode, responsive, print |
| `icons/` | 17 line-art PNG icons used throughout the site |
| `LaGuardiaNightmare.png` | A.J.'s photograph — the moment that started it all |
| `CalmSkiesTravel.pptx` | PowerPoint presentation of the full project |
| `calm-skies-travel-plan.md` | Master build plan (13 sub-tasks from research to deployment) |
| `CalmSkiesColorPalette.md` | Full color system with WCAG contrast ratios |
| `future-features.md` | Features intentionally deferred for future development |
| `prompt-history.md` | Complete log of every design prompt and decision |
| `BASELINE_ASSESSMENT.md` | Baseline record of starter files and all Bob contributions |
| `REQUIREMENTS.md` | Full functional and non-functional requirements |
| `ARCHITECTURE.md` | Technical architecture and data flow |
| `ACCESSIBILITY_REPORT.md` | WCAG 2.1 review and autism-specific design decisions |
| `RESPONSIBLE_ENGINEERING.md` | Privacy-by-design and responsible AI documentation |
| `BOBATHON_EVIDENCE.md` | Evidence of IBM Bob's contribution to this project |

---

## Technology

- **Pure static HTML, CSS, JavaScript** — no build step, no framework, no server-side code
- **Hosting:** IONOS Web Hosting Plus
- **HTTPS:** Let's Encrypt SSL (free, via IONOS)
- **Font:** Atkinson Hyperlegible (Google Fonts)
- **No CDN scripts, no analytics, no tracking libraries**

---

## Contributing

This project is open source and welcomes contributions:

- **Content:** If you are an autism specialist, therapist, or parent with lived experience and want to improve the content, please open an issue or pull request.
- **Accessibility:** Accessibility reviews and testing (especially by autistic adults) are especially welcome.
- **Translations:** Multi-language support is a planned future feature — see `future-features.md`.
- **Icons:** Open-license symbol sets compatible with autism communication are always needed.

Please note: **Any contribution that could expose child personal information will not be accepted.** The zero-data architecture is not negotiable.

---

## License

This project is released under the **MIT License** — free to use, modify, and distribute, with attribution.

Please keep the "Created by IBM Bob" footer on the site and printables as credit to the AI collaboration that built this.

---

## Credits

| Role | Credit |
|------|--------|
| **Project founder & author** | A.J. Aronoff — written from lived experience as a parent |
| **Website & all artifacts** | Built by **IBM Bob** (IBM Bobathon) |
| **Our Trip Review page** | Suggested by A.J.'s wife 💙 |
| **Community input** | A.J.'s daughter's autism support group — communication strategies |
| **Hosting** | IONOS Web Hosting Plus |
| **Font** | Atkinson Hyperlegible — Braille Institute |

---

*Created by IBM Bob — calmskiestravel.com*
