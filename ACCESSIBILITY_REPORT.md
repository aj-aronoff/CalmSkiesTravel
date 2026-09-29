# Accessibility Report — Calm Skies Travel
> Created by IBM Bob

---

## Purpose of This Report

This report documents the accessibility design decisions made for Calm Skies Travel, evaluates the current implementation against recognized standards, and records the specific choices made for the **primary audience: autistic children**.

Accessibility for this project is not a checkbox. Every design decision — color, font, layout, motion, sound, language — was made with the specific sensory, cognitive, and communication profile of autistic children in mind. The choices described here are intentional, purposeful, and child-centered.

---

## Audience Profile — Who This Site Serves

### Primary User: The Autistic Child

Autistic children are not a monolithic group. They represent a wide spectrum of sensory profiles, communication styles, reading levels, and support needs. The design of Calm Skies Travel respects this diversity by:

- Using flexible, adaptable content (parent customizes for their child)
- Avoiding sensory triggers that affect many autistic children: bright lights, sudden sounds, flashing, unexpected movement
- Writing child-facing language that is warm, concrete, first-person, and shame-free
- Offering visual picture support alongside every word-based instruction

**Known sensory and cognitive considerations incorporated into design:**
- Many autistic children are **hypersensitive to visual stimulation** → no bright colors on children's sections; soft, muted palette throughout
- Many autistic children **depend on predictability and routine** → the tab structure is consistent and navigable; the same layout pattern appears on every page
- Many autistic children **process language differently** → no ambiguous language, no idioms, no sarcasm; every sentence is literal and concrete
- Many autistic children **benefit from advance preparation** → the Social Story and the Trip Stage pages are designed to be read before the trip, not only at the airport
- Many autistic children **use AAC (Augmentative and Alternative Communication)** → icons appear alongside text; future AAC export is planned
- Many autistic children **experience anxiety about the unknown** → the "What to Expect" structure of every page reduces anxiety by making every step predictable

### Secondary User: The Parent / Caregiver

Parents navigating this site are often managing significant stress. The parent-facing interface is:
- Clean and uncluttered — no cognitive overload
- Scannable with bullet points and checklists
- Warm in tone — not clinical, not condescending
- Respects the parent's intelligence and their expertise about their own child

---

## WCAG 2.1 Compliance Review

**Standard:** WCAG 2.1 — Web Content Accessibility Guidelines  
**Target Level:** AA minimum; AAA where achievable

| WCAG Criterion | Level | Status | Notes |
|----------------|-------|--------|-------|
| 1.1.1 Non-text Content | A | ✅ Met | All icons have `alt` text or `alt=""` for decorative icons |
| 1.2.x Audio/Video | A/AA | ✅ Met | No audio or video content on current build |
| 1.3.1 Info and Relationships | A | ✅ Met | Semantic HTML: `<header>`, `<section>`, `<nav>`, `<button>` |
| 1.3.2 Meaningful Sequence | A | ✅ Met | DOM order matches visual/reading order |
| 1.3.3 Sensory Characteristics | A | ✅ Met | No instructions rely on color, shape, or position alone |
| 1.4.1 Use of Color | A | ✅ Met | Color always paired with icon or label |
| 1.4.2 Audio Control | A | ✅ Met | No audio present |
| 1.4.3 Contrast (Minimum) | AA | ✅ Met | Deep Slate `#2D3748` on Cloud White `#F7FBFF` ≥ 7:1 |
| 1.4.4 Resize Text | AA | ✅ Met | Fluid layout; text scales with browser zoom |
| 1.4.5 Images of Text | AA | ✅ Met | No images of text used |
| 1.4.10 Reflow | AA | ✅ Met | Responsive down to 320px; no horizontal scroll |
| 1.4.11 Non-text Contrast | AA | ✅ Met | Icon/UI contrast ratio ≥ 3:1 |
| 1.4.12 Text Spacing | AA | ✅ Met | Line height 1.75; generous spacing throughout |
| 1.4.13 Content on Hover | AA | ✅ Met | No hover-only content |
| 2.1.1 Keyboard | A | ✅ Met | All tabs navigable with keyboard; arrow keys for tab list |
| 2.1.2 No Keyboard Trap | A | ✅ Met | No modal dialogs or trapping patterns |
| 2.2.2 Pause, Stop, Hide | A | ✅ Met | No moving, blinking, or auto-updating content |
| 2.3.1 Three Flashes | A | ✅ Met | No flashing content — hard rule |
| 2.4.1 Bypass Blocks | A | ✅ Met | Tab navigation allows direct access to any section |
| 2.4.3 Focus Order | A | ✅ Met | DOM-order focus sequence is logical |
| 2.4.4 Link Purpose | A | ✅ Met | All interactive elements have descriptive labels |
| 2.4.6 Headings and Labels | AA | ✅ Met | Heading hierarchy: h1 (site title), h2 (panel title), h3 (cards) |
| 2.4.7 Focus Visible | AA | ✅ Met | Browser default focus ring preserved; not suppressed |
| 2.5.3 Label in Name | A | ✅ Met | Button labels match visible text |
| 3.1.1 Language of Page | A | ✅ Met | `<html lang="en">` declared |
| 3.2.1 On Focus | A | ✅ Met | No context change on focus |
| 3.2.2 On Input | A | ✅ Met | Story Builder updates only within the card — no page navigation |
| 4.1.1 Parsing | A | ✅ Met | Balanced tags confirmed; `id` values are unique |
| 4.1.2 Name, Role, Value | A | ✅ Met | Full ARIA tab pattern; `aria-selected`, `aria-controls`, `role="tabpanel"` |

---

## Autism-Specific Accessibility Decisions

These are design choices that go **beyond WCAG** — specific to the needs of autistic children and their families.

---

### A. Sensory Safety — Visual Design

| Decision | Rationale for Autistic Children |
|----------|----------------------------------|
| **Sky Calm color palette** — soft sky blue, warm white, gentle green | Muted, low-saturation colors reduce visual overstimulation. Many autistic children are hypersensitive to bright or saturated colors. |
| **No bright red (`#FF0000`) anywhere** | Bright red triggers alarm responses in many children. Excluded entirely. |
| **No neon or fluorescent colors** | Fluorescent colors can cause visual discomfort for photosensitive children. |
| **Background: `#F7FBFF` (near-white with cool tint)** | Softer than pure white; reduces the harshness of high-contrast glare on screens. |
| **Warm Sand (`#F5EFE0`) for parent sections** | Visual distinction between parent and child sections without using alarming colors. |
| **Child sections use Soft Sage (`#EBF7F0`)** | Cool, gentle, calming — matches the emotional register of child-facing content. |

---

### B. Sensory Safety — Motion and Sound

| Decision | Rationale for Autistic Children |
|----------|----------------------------------|
| **No CSS animations or transitions** | Unexpected movement is a common trigger. The site is static in every sense. |
| **No auto-playing audio or video — ever** | Sudden unexpected sound is one of the most common and severe sensory triggers for autistic children. This is a hard rule with zero exceptions. |
| **Reduced motion is the default** — not `prefers-reduced-motion` responsive | The site does not animate at all, regardless of the user's system setting. |
| **No hover effects that cause layout shift** | Unexpected layout changes during browsing can be disorienting. |

---

### C. Language — Child-Facing Content

| Decision | Rationale for Autistic Children |
|----------|----------------------------------|
| **First-person language** ("I will…", "I can…") | Social stories work because they help children internalize and rehearse scenarios. First-person language is the established, evidence-based format for social stories (Carol Gray, 1991). |
| **Plain, concrete sentences** | Abstract language, idioms, and metaphors are frequently misunderstood by autistic children who think literally. |
| **Short sentences** | Reduces cognitive load and working memory demand. |
| **Warm, positive framing** | "What Helps Me Feel Better" instead of "Meltdown Plan." The child is never made to feel blamed, broken, or burdensome. |
| **No clinical vocabulary** on child-facing pages | Words like "meltdown," "episode," or "behavior" are not used in child-facing language. |
| **Child names every sentence belongs to them** | Personalized stories ("I am [name]. I am going to [place].") increase engagement and ownership. |
| **"I can do this."** as a recurring phrase | Positive affirmations build self-efficacy, which is particularly important for autistic children who may have experienced repeated travel failures. |

---

### D. Predictability and Structure

| Decision | Rationale for Autistic Children |
|----------|----------------------------------|
| **Consistent two-card layout on every tab** | Same visual pattern on every page reduces the cognitive load of adapting to a new layout. |
| **Tab navigation stays visible** | The child and parent always know where they are in the structure. |
| **URL hash navigation** | Deep links allow a specific section to be bookmarked and returned to — supporting the child's need to re-read and rehearse. |
| **Social Story is printable** | Many autistic children use laminated physical copies of social stories. The print layout supports this established practice. |
| **Go-bag contents are listed with icons** | Visual reinforcement of the physical items helps children recognize and pack their own comfort items. |

---

### E. Font Choice — Atkinson Hyperlegible

Atkinson Hyperlegible was designed by the Braille Institute specifically for readers with low vision and reading difficulties. It is used throughout the site for both adult and child content.

| Feature | Benefit |
|---------|---------|
| **High character distinction** | `1`, `l`, `I` are visually distinct — critical for dyslexic and hyperlexic readers |
| **Wide letter spacing** | Reduces visual crowding; improves reading speed |
| **Open counters** | Letters like `a`, `e`, `c` are more open and readable at small sizes |
| **No thin strokes** | Consistent stroke weight reduces blur effect on lower-resolution screens |
| **Available for free** | No licensing barrier for open distribution |

---

### F. Social Story Design — Evidence-Based Practice

Social stories are an evidence-based intervention developed by Carol Gray (1991) for autistic children. They work by:
1. Describing a situation in advance so the child knows what to expect
2. Using first-person narrative so the child rehearses the scenario mentally
3. Pairing text with visuals so non-readers can still access the content
4. Being reviewed repeatedly before the event

**Calm Skies Travel's Story Builder implements all four principles:**
- Parents fill in the child's destination, companions, and comfort item → the story describes what will actually happen to this child
- First-person language throughout
- Line-art icons accompany every story beat
- The story is printable and laminatable for repeated review

---

## Identified Gaps and Future Improvements

| Gap | Priority | Notes |
|-----|----------|-------|
| **AAC export** | High | Social stories should be exportable in formats compatible with AAC devices (e.g., PDF with symbol grid, or Boardmaker-compatible format). Tracked in `future-features.md`. |
| **Symbol-based reading mode** | High | A version of the site where every word is accompanied by a symbol, for non-verbal or pre-literate children. Tracked in `future-features.md`. |
| **Multi-language support** | Medium | Autistic children and families speak many languages. Spanish and French are the highest-priority additions. Tracked in `future-features.md`. |
| **Audio read-aloud** | Medium | An optional "read this to me" button that reads the child's social story aloud (browser `SpeechSynthesis` API — no server). No auto-play — child or parent initiates. |
| **High-contrast mode** | Medium | A dedicated high-contrast theme for children with visual processing differences. |
| **Font size slider** | Low | A simple UI control allowing parents to increase the child-facing font size independently of the parent-facing content. |
| **Cognitive load audit** | Ongoing | Each completed page should be reviewed with an autism specialist before deployment. |

---

## Design Principles Summary

The following five principles guided every accessibility decision:

1. **The child comes first.** Every design choice is evaluated for its effect on the child before its effect on the parent or the site owner.
2. **Calm is a feature.** The site should feel as calm and predictable as the journeys it helps families prepare for.
3. **No surprises.** Autistic children depend on predictability. Nothing on this site should move, flash, or sound without the user choosing it.
4. **Warm, not clinical.** The language is the language of a loving parent, not a medical professional.
5. **Built for the worst day.** The day a family most needs this site may be the hardest day of their trip. The site should still work — offline, printed, on a phone, in a noisy airport — under those conditions.

---

*Accessibility Report v1.0 — Created by IBM Bob*  
*Designed for autistic children and their families.*
