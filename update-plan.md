# Update Plan — Calm Skies Travel Critical Fixes
> Source: Team-feedback.txt (sections 01–03) · prompts-for-updates-from-feedback.md

---

## Top-Level Overview

Three CRITICAL and one HIGH finding from the Team Guild engineering assessment must be fixed before the site is re-deployed to GitHub Pages. The work falls into four focused sub-tasks, executed in order:

1. **Fix XSS** — replace `innerHTML` with safe DOM rendering in the inline Story Builder logic inside `index.html`.
2. **Unify production code** — refactor `index.html` to load and use `storybuilder.js` instead of maintaining a duplicate inline copy of the same logic. This also eliminates the imported-JSON XSS path.
3. **Expand and align the test suites** — add XSS-specific tests, a test that exercises the production `index.html` rendering path (not just `storybuilder.js`), and a live GitHub Pages smoke-test suite.
4. **Correct divergent documentation** — update `ARCHITECTURE.md` and `REQUIREMENTS.md` to accurately describe what the application actually does today.

Two additional features — **localStorage persistence** and **QR code sharing** — are listed as OPTIONAL enhancements at the end of this plan. They are not part of fixing the critical issues and should only be considered after sub-tasks 1–4 are complete and deployed.

Each sub-task is designed to be implemented independently, reviewed, and committed before the next begins.

---

## Sub-Task 1 — Fix XSS: Replace innerHTML with Safe Rendering

**Status:** [x] done

### Intent
The `updateStory` function inside `index.html` assembles story lines by concatenating user input directly into HTML strings, then writes them via `el.innerHTML`. This means any HTML or `<script>` tag typed into a form field (or loaded from a crafted JSON file) is parsed and executed by the browser. This must be replaced with safe DOM construction that treats all user-supplied values as plain text.

### Expected Outcomes
- No user-supplied value ever reaches `innerHTML`.
- Typing `<script>alert(1)</script>` into any Story Builder field renders as visible literal text, not as an executed script.
- The placeholder `<span class="placeholder">` elements (shown when a field is empty) are still rendered correctly as HTML — these contain no user data so this is safe.
- All existing Story Builder visual behaviour is preserved.

### Todo List
1. Read the `updateStory` function in `index.html` (lines 823–848).
2. Identify every place a user-supplied variable (`name`, `visiting`, `destination`, `comfort`, `calm`, `detail`) is concatenated into a string assigned to `innerHTML`.
3. Replace the rendering approach: for each story-card paragraph (`sc-line1` through `sc-line10`), build the paragraph content using safe DOM methods — `document.createTextNode` or `textContent` for user values, and `innerHTML` only for the static placeholder spans (which contain no user data).
4. Verify that the placeholder spans (`<span class="placeholder">[child's name]</span>`) still display correctly for empty fields.
5. Manually test in a browser: type `<b>bold</b>` and `<script>alert(1)</script>` into the name field and confirm they render as literal text in the story card.

### Relevant Context
- [`index.html`](index.html) lines 823–848 — the `updateStory` function with the unsafe `innerHTML` assignments.
- [`index.html`](index.html) lines 819–822 — the `ph()` helper that generates placeholder HTML; this is safe (no user data) and must continue to produce HTML output.
- [`ARCHITECTURE.md`](ARCHITECTURE.md) line 296 — the Security Architecture table already *claims* `textContent` is used; Sub-Task 1 makes the code match that claim.

---

## Sub-Task 2 — Unify Production Code: index.html Must Use storybuilder.js

**Status:** [x] done

### Intent
`index.html` currently contains its own inline duplicate of `collectStoryData`, `populateStoryFields`, `val()`, and related helpers. `storybuilder.js` contains the tested versions of these same functions. The two copies can drift independently. The test suite exercises `storybuilder.js`; it says nothing about the inline logic that actually runs in the browser.

The fix is to load `storybuilder.js` into `index.html` as an external script and call its exported functions from the inline tab/UI controller, removing the duplicate inline definitions entirely.

### Expected Outcomes
- `index.html` contains a `<script src="storybuilder.js"></script>` tag.
- The inline `collectStoryData`, `populateStoryFields`, `val()` / `getFieldValue` duplicates are removed from `index.html`.
- The `updateStory` function (UI-specific, stays in `index.html`) calls `storybuilder.js` functions for field reading and writing.
- All Story Builder features (live preview, save, load) continue to work exactly as before.
- `node run-tests.js` still passes all tests.
- `storybuilder.test.html` still passes all tests.

### Todo List
1. Confirm the exported API of `storybuilder.js`: `getFieldValue`, `collectStoryData`, `validateStoryData`, `populateStoryFields`, `serialiseStoryData`, `parseStoryJSON`, `roundTripStoryData`.
2. Add `<script src="storybuilder.js"></script>` to `index.html` before the inline `<script>` block.
3. Remove the duplicate `val()`, `collectStoryData()`, and `populateStoryFields()` definitions from the inline script.
4. Update `updateStory()` to call `getFieldValue(id)` (from `storybuilder.js`) instead of the removed `val(id)`.
5. Update `saveStoryToFile()` to call `collectStoryData()` from `storybuilder.js`.
6. Update `loadStoryFromFile()` → `reader.onload` to call `populateStoryFields(data, document, updateStory)` from `storybuilder.js`.
7. Test in a browser: fill fields, save JSON, reload JSON, confirm story updates correctly.

### Relevant Context
- [`storybuilder.js`](storybuilder.js) lines 190–203 — the exports block (Node.js only); in the browser all functions are plain globals.
- [`index.html`](index.html) lines 863–901 — the inline `collectStoryData` and `populateStoryFields` duplicates to be removed.
- [`index.html`](index.html) lines 814–818 — `val()` / `ph()` helpers; `val()` maps to `getFieldValue()` from `storybuilder.js`; `ph()` is UI-only and stays inline.
- [`storybuilder.test.html`](storybuilder.test.html) line 100 — already loads `storybuilder.js` via `<script src="storybuilder.js"></script>`, confirming this pattern works.

---

## Sub-Task 3 — Expand Test Suites: XSS Tests + Production Path Tests + GitHub Pages Smoke Tests

**Status:** [x] done

### Intent
After sub-tasks 1 and 2, the test suites must be expanded to:
1. Prove the XSS fix works — tests that pass malicious input and assert it is rendered as plain text, not HTML.
2. Prove the production `index.html` rendering path is tested — not just `storybuilder.js` in isolation.
3. Provide a live smoke test that can run against the deployed GitHub Pages URL to confirm the site is working in production.

### Expected Outcomes

**Node.js test suite (`run-tests.js`):**
- New Group 9: XSS safety — verifies that `<script>`, `<img onerror>`, and `&` characters survive the round-trip as plain strings (documents that the serialisation layer is safe).

**Browser test suite (`storybuilder.test.html`):**
- New group: renders a known XSS payload through `updateStory()` and asserts the story card paragraph's `textContent` equals the raw input string and its `innerHTML` does not contain an unescaped `<script>` tag.
- After Sub-Task 2, `updateStory()` is the production function — so this test exercises the actual shipped code.

**New file: `smoke-test.html`:**
- A standalone HTML page that can be opened in a browser locally or pointed at the live GitHub Pages URL.
- Tests: key DOM elements are present (`#main-tablist`, `#panel-storybuilder`, `#sb-name`, `#story-card`), Story Builder fields accept input, no JavaScript errors on load.
- Instructions in the file explain how to run it locally vs. against `https://aj-aronoff.github.io/CalmSkiesTravel/`.

### Todo List
1. Add Group 9 XSS rendering tests to `run-tests.js` — verify the serialisation layer treats `<script>alert(1)</script>` as a literal string.
2. Add XSS rendering tests to `storybuilder.test.html` — inject payload, call `updateStory()`, assert `sc-line1.textContent` contains the literal string and `sc-line1.innerHTML` does not contain `<script>`.
3. Create `smoke-test.html` with DOM-presence checks and instructions for local and live use.

### Relevant Context
- [`run-tests.js`](run-tests.js) lines 349–358 — existing Group 8 edge/security tests; new XSS rendering tests go in Group 9.
- [`storybuilder.test.html`](storybuilder.test.html) line 627 — existing XSS round-trip test; new tests assert safe DOM rendering in addition to serialisation safety.
- GitHub Pages URL: `https://aj-aronoff.github.io/CalmSkiesTravel/`

---

## Sub-Task 4 — Correct Divergent Documentation

**Status:** [x] done

### Intent
`ARCHITECTURE.md` and `REQUIREMENTS.md` contain claims about features that do not exist in the running application. These must be corrected so documentation accurately describes what the app actually does. The Team Guild assessment identifies this as a HIGH severity finding.

### Expected Outcomes
- Documentation accurately describes the current application.
- Unimplemented features are clearly marked as "Future / not yet implemented" rather than stated as present.
- The contract identifier is removed from public documentation.

### Specific Corrections Required

**`ARCHITECTURE.md`:**

| Location | Current (incorrect) claim | Correction |
|---|---|---|
| Line 100 | "Optionally saved to `localStorage`" | Not implemented — remove |
| Lines 104–119 | Full localStorage schema block | Not implemented — remove or mark Future |
| Lines 117–118 | "QR code → encoded JSON, shareable" | Not implemented — remove or mark Future |
| Line 217 | "Data persistence: localStorage" | Change to "None — data lives in form DOM only (Future: localStorage)" |
| Line 218 | "QR code generation: qrcode.js" | Not implemented — mark as Future |
| Lines 246–249 | Data flow diagram QR path | Remove |
| Line 296 | XSS / textContent claim | Becomes accurate after Sub-Task 1 — confirm and leave |

**`REQUIREMENTS.md`:**

| Location | Current (incorrect) claim | Correction |
|---|---|---|
| Line 16 | Contract ID: 113830291 | Remove from public documentation |
| REQ-DATA-02 | localStorage persistence | Mark as Future |
| REQ-DATA-05/06 | QR export and sharing | Mark as Future |
| REQ-HTY-01–05 | Hello & Thank You section | Mark as Future |
| REQ-REF-01–05 | Resources & References page | Mark as Future |
| REQ-OTR-01–06 | Our Trip Review | Mark as Future |
| REQ-SB-08 | Line-art per story beat | Mark as Future |
| REQ-SB-09 | Editable sentences | Mark as Future |

### Todo List
1. In `ARCHITECTURE.md`: remove the localStorage schema block; remove or mark the QR paths in the data flow diagram and technology table; update the data persistence row; confirm the XSS security row is accurate after Sub-Task 1.
2. In `REQUIREMENTS.md`: remove the contract ID; add a clearly labelled "Future Features (Not Yet Implemented)" section and move all unimplemented requirements there with a note that they are design goals, not current functionality.
3. Check `README.md` and `BASELINE_ASSESSMENT.md` for any additional claims about QR codes, localStorage, or contract identifiers and correct them.

### Relevant Context
- [`ARCHITECTURE.md`](ARCHITECTURE.md) — full file reviewed above.
- [`REQUIREMENTS.md`](REQUIREMENTS.md) — full file reviewed above.
- [`README.md`](README.md) — needs a quick scan.
- [`BASELINE_ASSESSMENT.md`](BASELINE_ASSESSMENT.md) — needs a quick scan.

---

## OPTIONAL Future Enhancements (Not Part of This Plan)

These two features are listed here for completeness. They are **not** required to fix the CRITICAL or HIGH issues and should only be considered after sub-tasks 1–4 are complete, tested, and deployed.

### OPTIONAL A — localStorage Persistence

**What it does:** Automatically saves the six Story Builder field values to the browser's built-in local storage so the form re-populates on the next visit without the parent having to retype everything.

**What is stored:** Only the six short text strings the parent types (child's name, destination, who they're visiting, comfort item, calming strategy, exciting detail). Nothing else. Data never leaves the device.

**Privacy note:** Data is stored on the device only. It cannot be read by any server. It is readable by anyone with physical access to that browser on that device — not a concern for a family computer, but worth noting for shared devices.

**Engineering size:** Small — approximately 10 lines of code added to `storybuilder.js` (save on field change, load on page init).

---

### OPTIONAL B — QR Code Sharing

**What it does:** Adds a "Generate QR Code" button to the Story Builder. Clicking it encodes the six field values as a compact JSON string and renders a QR code image in the browser. A grandparent or caregiver can scan it with their phone camera and the story loads pre-filled on their device — no account, no server, no link to share.

**Code size:** The six fields produce approximately 200–250 characters of JSON. This generates a medium-density QR code (roughly 29×29 squares) — easily scannable by any phone camera. Even with long field values the code stays scannable.

**Engineering size:** Medium — requires adding the open-source `qrcode.js` library (~20KB, no server needed) and a small canvas element in the Story Builder panel.

---

*Update Plan v1.1 — Calm Skies Travel · Source: Team-feedback.txt sections 01–03*
