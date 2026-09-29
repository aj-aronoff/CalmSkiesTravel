# Prompt History — Calm Skies Travel
> Created by IBM Bob

## Session 1 — Planning Session

---

### Prompt 1 — Initial Request
**User:**
Please read the files in this directory. BackStory.txt has the reasons for creating the website. LaGuardiaNightmare.png has a picture of how overcrowded LaGuardia was. Please make a prompt history file recording all the prompts. The CalmSkiesTravel.txt file has my initial design decisions. I discussed the communication piece with my daughter's autism support group. I have purchased the CalmSkiesTravel.com website. After all the planning steps we will build that website. The contract.txt has some of the details of my website purchase. Please ask me clarifying questions until you are 95% certain. In this exercise you are an autism expert, a parent of a child with autism. The child is always the priority. You are also an excellent UI and website designer.

**Files Read:** BackStory.txt, CalmSkiesTravel.txt, contract.txt, LaGuardiaNightmare.png

---

### Prompt 2 — Story Builder Output Format & Privacy
**User:**
Both print-ready AND on-screen. At the present time I do not want to save ANY information about the child on the website. Let's make a file for possible future work, so we can revisit this decision later.

**Decisions Recorded:**
- Social story: both storybook on-screen view AND single-page print layout, parent chooses
- No child data stored on the server — ever (current policy)
- Future features file to be created for revisiting data persistence later

---

### Prompt 3 — Story Builder Delivery (Bob Question)
**Bob asked:** For the Social Story Builder, how should the story be delivered?
**User answered:** Both — offer a storybook read-together on-screen view AND a single-page print layout, parent chooses.

---

### Prompt 4 — Child Reading Level (Bob Question)
**Bob asked:** What reading level or communication style for child-facing content?
**User answered:** Plain, warm, first-person sentences ("I will put my bag on the belt. I can do this.") with optional picture support, flexible enough for a wide age range.

---

### Prompt 5 — Image / Symbol Approach (Bob Question)
**Bob asked:** What image approach for child-facing picture support?
**User answered:** Simple, clean line-art illustrations / icons from open autism-friendly symbol sets (e.g. Mulberry or OpenSymbols) — free, safe, widely understood.

---

### Prompt 6 — Multiple Clarifying Questions (Bob)
**Bob asked (direct):**
- Q4a: JSON download or QR code for key-value data?
- Q4b: QR code printed on report to re-populate form?
- Q5a: Parent uploads photo from device (stays in browser only) for printed Hello/Thank You card?
- Q5b: Hello/Thank You card format — postcard or greeting card?
- Q6a: Color palette preference?
- Q6b: No auto-play sounds, no flashing, reduced motion as hard rules?
- Q7a: Pure static HTML/CSS/JS deploy to IONOS?
- Q8a: "Created by IBM Bob" footer on every page and printable?
- Q8b: One master Excel spreadsheet or separate per deliverable?

**User answered:**
- Q4a/Q5a: Output format should be copy-to-email friendly. Hello and Thank You sending should be quick and easy.
- Q6a & Q6b: Both confirmed (Sky Calm palette; no auto-play, no flash, reduced motion = hard rules).
- Q7a: Confirmed — pure static site.
- Q8a: Confirmed — "Created by IBM Bob" footer on every page and printable.
- Q8b: Whatever Bob thinks best.

---

### Prompt 7 — Data Portability Format
**User:** Both JSON and QR code. QR code can even be sent to friends/relatives.

**Decisions Recorded:**
- Child profile data exportable as both JSON file download AND QR code
- QR code is shareable (e.g. send to grandparents so they can load the child's preferences)

---

### Prompt 8 — Color Palette (Bob Question)
**Bob asked:** Which of 3 style directions feels right?
**User answered:** Sky Calm — soft sky blue + warm white + gentle green accents. Clean, airy, trustworthy.

---

### Prompt 9 — References Trust Framework
**Bob asked:** Verification status flags on research HTML?
**User answered (Q9a):** Trust tiers:
  1. Government websites — fully trusted
  2. Airline websites — fully trusted
  3. All other sites — confidence score required; anything below 90% confidence is eliminated

---

### Prompt 10 — References Page (Bob Question)
**Bob asked:** Approved resources only + disclaimer?
**User answered (Q9b):** Approved resources only. No disclaimer — keep it clean and trustworthy-feeling.

---

### Prompt 11 — Final Clarifying Round
**Bob asked:**
- Q10a: Child-facing meltdown section reframed as "What Helps Me Feel Better"?
- Q11a: Story Builder as hero on Home page + its own tab?
- Q12a: "Our Story" / About page with LaGuardia photo?

**User answered:**
- Q10: Need BOTH — parent suggestions AND a customizable social story for the child, with one or two friendly questions to gather details from the child.
- Q11: Story Builder tab placed BEFORE "Before You Go." "When It Gets Hard" placed BEFORE "Hello & Thank You."
- Q12: Yes — About page. Everyone calls A.J. by his initials.

---

### Final Tab Order Confirmed
1. Home
2. Our Story (About A.J.)
3. Story Builder ⭐
4. Before You Go
5. At the Airport
6. On the Plane
7. At Your Destination
8. Going Home
9. When It Gets Hard
10. Hello & Thank You
11. Resources & References

---

### Prompt 12 — Tonight's Scope, PowerPoint, and Final Confirmations
**User:**
Tab order feels right. Story Builder child questions are good. Sub-task sequencing sounds right. Stop at Design System for tonight. Future features file is fine — will review after site is complete based on remaining Bob tokens. Nothing missing entirely. We will need to create a PowerPoint presentation of what is being done before deploying to the website.

**Decisions Recorded:**
- Tab order confirmed as planned
- Story Builder child questions confirmed
- Sub-task build order confirmed
- **Tonight's session ends after Sub-Task 2 (Design System & Style Guide)**
- Sub-Task 3 (Site Architecture) begins next session
- PowerPoint presentation added as **Sub-Task 10** — to be built before deployment
- PowerPoint will use Sky Calm palette, include LaGuardia photo, cover all sub-tasks
- Audience: autism support group, collaborators, anyone A.J. briefs before launch
- Future features file to be reviewed after site completion

---

*Session 1 ends here. Resume next session at Sub-Task 1 — Research & Verified References.*

---

### Prompt 13 — GitHub Repository
**User:**
We will also need to make a GitHub repo including all design decisions, the PowerPoint, HTML, JavaScript files, etc.

**Decisions Recorded:**
- A public GitHub repository named `CalmSkiesTravel` will be created under A.J.'s account
- The repo is the single source of truth for ALL project files
- Folder structure: `docs/` (plan, decisions, research, prompts, Excel), `presentation/` (PowerPoint), `site/` (HTML, CSS, JS, images, icons), `assets/`
- A `README.md` will explain the project mission, usage, and deployment steps
- "Created by IBM Bob" credited in the README
- Repository created before or alongside deployment (Sub-Task 13)
- Added as **Sub-Task 12** in the plan

---

*Session 1 fully complete. All planning decisions recorded.*
*Resume next session at Sub-Task 1 — Research & Verified References.*

---

### Prompt 14 — Bob Task Snapshot
**User:**
Please execute `bob --list-tasks all | jq '.' > saved_tasks.json` if appropriate. Yes, please add that.

**Decisions Recorded:**
- Command is not appropriate to run now — no Bob subtasks exist yet (implementation has not started)
- Command will be run at the end of implementation, once all subtasks have been executed in Agent mode
- `saved_tasks.json` added to Sub-Task 12 (GitHub Repository) todo list
- `saved_tasks.json` will be committed to the `docs/` folder in the repository
- Also added to the proposed GitHub folder structure in the plan

---

*All planning decisions fully recorded. Session 1 complete.*

---

### Prompt 15 — Our Trip Review Page (suggested by A.J.'s wife)
**User:**
My wife suggested one last thing: "A travel review" page. With the QR code as essentially storing history, both parent and child can record what worked for them and what should be done better next time.

**Decisions Recorded:**
- New page added: **Our Trip Review** — Tab 11, placed before Resources & References
- Two voices: parent reflection layer + child reflection layer (consistent with all other pages)
- Parent prompts: what worked, triggers noted, go-bag changes, airline/airport tips for next time
- Child prompts: simple, warm, first-person ("One thing I liked was ___", "I felt proud when ___")
- Reviews saved to local JSON profile and QR code — keyed by trip destination (not date)
- Builds a travel history that makes every future trip smarter
- Printable "Our Trip Memory" card for the child — positive keepsake
- Added as **Sub-Task 9b** in the plan
- Resources & References renumbered to Tab 12
- Credit: suggested by A.J.'s wife 💙

---

*Session 1 fully and finally complete. All 15 prompts recorded.*
*Resume next session at Sub-Task 1 — Research & Verified References.*

---

## Session 2 — Presentation Review & Web Build

---

### Prompt 16 — Save Prompts, Check Symbols, Extract Icons, Build index.html
**User:**
1) Please save all the web page prompts to a web-page prompt file.
2) Check the ICalmSkiesSymbols.html
3) (implied by numbering) No explicit step 3 — icon extraction was part of the build.
4) Extract every icon image out of the deck into an icons/ folder. Name each file for what it shows (plane.png, sunflower.png, bag.png). Do not guess the names.
5) Build one self-contained index.html: a single page with one tab per slide topic, in slide order, and each tab labelled with its own icon from the deck. The first TAB will be the "why I am doing this page". It should have the picture and the text from Why I am doing this page of the powerpoint. For all remaining TABS: Inside a tab, keep the slide's two columns as side-by-side cards, "For the Parent" and "For the Child", each headed by the parent or child icon. Use the speaker notes for the body text. Where a slide lists items with their own icons, keep those icons beside those items.
   Put a "Story Builder" tab second, straight after the opening story tab: a few text boxes (child's name, who we are visiting, where we are going, comfort item) above a printable social-story card that fills in as the parent types.

**THE RULES:**
- Tabs are real `<button role="tab">` elements with aria-selected, aria-controls and arrow-key navigation. Panels are role="tabpanel", hidden when inactive.
- Each tab has a URL hash (#gobag), so tabs can be linked and the browser's back button works. Wrap history.replaceState in try/catch so the page still works when it is opened as a local file.
- Calm and low-stimulation: soft teal, blue and green, no animation, Atkinson Hyperlegible, generous line height.
- Works in light and dark mode, and down to phone width. Story cards keep a light background in dark mode, so pin the text colour on those.
- Give every `<img>` height:auto, so a width/height attribute cannot stretch it.
- Printing hides the navigation and prints only the open tab.
- No build step, no frameworks, no CDN scripts. One HTML file plus styles.css plus the icons/ folder.

**STEP 4 — CHECK IT:**
Before you tell me it is done: confirm the tags balance, every icon path resolves, the number of tabs matches the number of panels, every aria-controls points at a real id, and the JavaScript parses. Then open the page in a real browser and look at three tabs.

**Decisions Recorded:**
- CalmSkiesSymbols.html reviewed — all 20 icons confirmed valid, SVG paths intact, PNG references correct
- Icons extracted from PPTX media: 12 images named descriptively (plane-takeoff.png, plane.png, laguardia.png, parent.png, child.png, parent-figure.png, child-arms-up.png, journey-home.png, journey-airport.png, journey-plane.png, journey-destination.png, journey-goinghome.png)
- Workspace originals also copied: parent-orig.png, child-orig.png, plane-fa.png, plane-rehearser.png, plane-takeoff-orig.png
- index.html built with 8 tabs (Our Story, Story Builder, Two Voices, The Journey, Social Stories, Helpful Hints, Go Bag & Ship Ahead, Before/During/After)
- styles.css built as companion stylesheet
- Atkinson Hyperlegible loaded via @font-face data-URI (no CDN)
- Full ARIA tab pattern with hash-based URL navigation
- Story Builder generates live social story card from typed fields
- Print CSS hides navigation, prints only active panel

---

*Session 2 in progress.*
