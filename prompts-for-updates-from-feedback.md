# Prompts for Updates from Team Feedback

## Source
`Team-feedback.txt` — IBM Bobathon Team Guild Engineering Assessment

---

## Section 01 — Purpose
> AJ brought Team Guild a meaningful problem: helping autistic children and their caregivers prepare for air travel with greater predictability, clarity and confidence.

The question addressed here is not whether the idea is good (it is), but whether the existing implementation is technically ready. The conclusion: preserve requirements and product insights; fix the implementation.

---

## Section 02 — What We Are Preserving

| Contribution | Disposition |
|---|---|
| Calm Skies concept | Preserve |
| Social-story approach | Preserve |
| Parent + child perspectives | Preserve |
| Sensory preparation concepts | Preserve |
| Predictable travel sequencing | Preserve |
| Accessibility research | Preserve and validate |

---

## Section 03 — Technical Findings to Fix

### CRITICAL: XSS via innerHTML
**Finding:** User-controlled Story Builder input is inserted into HTML using `innerHTML`, not safe text content. A user typing `<script>alert(1)</script>` as their child's name would execute that script.  
**Location:** [`index.html`](index.html) line 846 — `el.innerHTML = lines[i]`  
**Fix required:** Replace all `innerHTML` assignments in the Story Builder rendering path with safe DOM construction using `textContent` for user-supplied values.

### CRITICAL: Imported JSON reaches the same unsafe rendering path
**Finding:** The Load Story from File feature parses a `.json` file and pipes the field values into the same `innerHTML`-based render path. A crafted JSON file is therefore also an XSS vector.  
**Location:** [`index.html`](index.html) load path → `populateStoryFields` → `updateStory` → `el.innerHTML`  
**Fix required:** Same as above — once `innerHTML` is replaced with safe rendering, this attack surface is eliminated automatically.

### CRITICAL: Tests do not exercise production implementation
**Finding:** [`storybuilder.js`](storybuilder.js) contains the save/load/validate logic. [`run-tests.js`](run-tests.js) and [`storybuilder.test.html`](storybuilder.test.html) test that file. However, [`index.html`](index.html) contains its own **duplicate** inline `updateStory`, `collectStoryData`, and `populateStoryFields` functions that are never tested. Passing tests therefore prove nothing about the live page.  
**Fix required:** Refactor `index.html` to load and use `storybuilder.js` for all Story Builder logic. Remove the inline duplicates.

### HIGH: Documentation diverges from implementation
**Finding:** Several documents describe features not present in the running application (QR sharing, persistent profiles, editable sentences, etc.).  
**Fix required:** Audit documentation files and update or remove claims about unimplemented features so documentation accurately describes what the app actually does.
