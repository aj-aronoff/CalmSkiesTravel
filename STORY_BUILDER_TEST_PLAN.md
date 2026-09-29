# Story Builder — Test Plan
> Created by IBM Bob  |  Calm Skies Travel

---

## 1. Overview

This document defines the test plan for the Story Builder Save/Load JSON feature added to `index.html` and extracted into the standalone module `storybuilder.js`.

**Feature under test:** Story Builder — Save to JSON / Load from JSON  
**Files under test:** [`storybuilder.js`](storybuilder.js), [`index.html`](index.html) (Story Builder panel)  
**Test suite file:** [`storybuilder.test.html`](storybuilder.test.html) (browser, zero external dependencies)  
**Headless runner:** [`run-tests-jscript.js`](run-tests-jscript.js) (CScript/JScript, Windows)  
**Target confidence:** ≥ 99%

---

## 2. Feature Description

### 2.1 Save to JSON
A "💾 Save Story to File" button in the Story Builder panel collects the values from all six form fields, builds a structured JSON payload, and triggers a browser download of a file named `calm-skies-story.json` to the parent's device. **No data is sent to any server.**

### 2.2 Load from JSON
A "📂 Load Story from File" button opens the device's file picker, filtered to `.json` files. When the parent selects a previously saved story file, it is read using the browser `FileReader` API, parsed, validated, and used to populate all six form fields. The live story card updates immediately. **No data is sent to any server.**

### 2.3 JSON Payload Shape
```json
{
  "schemaVersion": 1,
  "savedAt": "2024-06-15T14:23:00.000Z",
  "fields": {
    "name":        "Maya",
    "visiting":    "Grandma",
    "destination": "Florida",
    "comfort":     "blue blanket",
    "calm":        "squeeze my fidget",
    "detail":      "swimming in the pool"
  }
}
```

---

## 3. Scope

### In Scope
- `storybuilder.js` pure functions: `getFieldValue`, `collectStoryData`, `validateStoryData`, `populateStoryFields`, `serialiseStoryData`, `parseStoryJSON`, `roundTripStoryData`
- Schema constants: `SCHEMA_VERSION`, `FIELD_IDS`, `FIELD_MAP`
- Full save → serialise → parse → validate → populate round-trip
- Edge cases: empty fields, partial fills, whitespace trimming, special characters, Unicode/emoji, very long values, HTML injection strings
- Privacy guarantee: no network calls made by any function
- Error handling: malformed JSON, wrong file type, missing required keys, wrong value types

### Out of Scope
- Browser download triggering (requires browser API — tested manually)
- `FileReader` callback (requires browser API — tested manually)
- Tab navigation JavaScript (tested separately)
- CSS / visual layout

---

## 4. Test Architecture

### 4.1 Module Design for Testability
The core logic was extracted from the inline `<script>` in `index.html` into a separate file [`storybuilder.js`](storybuilder.js). This file:
- Exports all functions via `module.exports` when running under Node.js / CScript
- Works transparently in a browser `<script>` tag without any change
- Accepts an optional `domLookup` parameter (dependency injection) so every function can be tested without a real DOM

### 4.2 Test Execution Environments

| Environment | File | How to Run |
|-------------|------|------------|
| **Browser (primary)** | `storybuilder.test.html` | Open in any modern browser (Chrome, Firefox, Safari, Edge) |
| **Headless (Windows)** | `run-tests-jscript.js` | `cscript //nologo run-tests-jscript.js` |

The browser test suite is the authoritative test runner. The headless runner uses ES3 polyfills (`Date.toISOString`, `JSON`) to work in the ancient Windows Script Host JScript engine and validates the same logical cases.

### 4.3 Zero External Dependencies
Neither test file loads any framework, library, or CDN resource. The harness is ~40 lines of plain JavaScript written inline.

---

## 5. Test Cases

### Group 1 — Schema Constants (5 tests)

| ID | Test Name | What Is Verified |
|----|-----------|-----------------|
| G1-T1 | SCHEMA_VERSION === 1 | Constant has expected value |
| G1-T2 | FIELD_IDS contains all 6 expected IDs | All 6 field IDs present in array |
| G1-T3 | FIELD_MAP has exactly 6 entries | Map has correct count |
| G1-T4 | FIELD_MAP sb-name → name | Correct key-to-value mapping |
| G1-T5 | FIELD_MAP sb-destination → destination | Correct key-to-value mapping |

### Group 2 — getFieldValue (5 tests)

| ID | Test Name | What Is Verified |
|----|-----------|-----------------|
| G2-T1 | Returns trimmed value from real DOM element | Leading/trailing whitespace stripped |
| G2-T2 | Returns empty string for empty field | No null — always returns string |
| G2-T3 | Returns empty string for unknown element ID | Graceful handling of missing element |
| G2-T4 | Works with injected domLookup | Dependency injection works |
| G2-T5 | Returns empty string when injected dom has no element | Null element handled safely |

### Group 3 — collectStoryData (7 tests)

| ID | Test Name | What Is Verified |
|----|-----------|-----------------|
| G3-T1 | Returns an object | Return type |
| G3-T2 | Includes schemaVersion === 1 | Schema version present |
| G3-T3 | Includes savedAt as ISO-8601 string | Timestamp format |
| G3-T4 | Includes all six field keys in .fields | All fields represented |
| G3-T5 | Reflects filled form values | Live data capture |
| G3-T6 | Empty fields appear as empty strings | Empty inputs → empty strings, not null |
| G3-T7 | Trims whitespace from field values | Whitespace normalisation |

### Group 4 — validateStoryData (14 tests)

| ID | Test Name | What Is Verified |
|----|-----------|-----------------|
| G4-T1 | Valid payload → valid:true, reason:'ok' | Happy path |
| G4-T2 | null → valid:false | Null input rejected |
| G4-T3 | undefined → valid:false | Undefined input rejected |
| G4-T4 | Array → valid:false | Array rejected |
| G4-T5 | String → valid:false | String rejected |
| G4-T6 | Missing "fields" key → valid:false, reason mentions fields | Missing key rejected with message |
| G4-T7 | fields:null → valid:false | Null fields rejected |
| G4-T8 | fields:Array → valid:false | Array fields rejected |
| G4-T9 | Missing "name" field → valid:false, reason mentions name | Individual missing field rejected |
| G4-T10 | Missing "destination" field → valid:false | Second individual field tested |
| G4-T11 | Number field value → valid:false | Wrong type rejected |
| G4-T12 | Null field value → valid:false | Null value rejected |
| G4-T13 | Empty string field values → valid:true | Empty strings are valid (blank form) |
| G4-T14 | Extra unknown keys tolerated | Forward compatibility |

### Group 5 — serialiseStoryData & parseStoryJSON (8 tests)

| ID | Test Name | What Is Verified |
|----|-----------|-----------------|
| G5-T1 | serialiseStoryData returns a string | Return type |
| G5-T2 | Serialised JSON is parseable back to original object | Round-trip serialisation |
| G5-T3 | Serialised JSON contains schemaVersion key | Required key present |
| G5-T4 | Serialised JSON contains savedAt key | Required key present |
| G5-T5 | parseStoryJSON returns object for valid JSON string | Parsing happy path |
| G5-T6 | parseStoryJSON returns null for invalid JSON | Error handling |
| G5-T7 | parseStoryJSON returns null for empty string | Edge case |
| G5-T8 | parseStoryJSON handles null input | Edge case |

### Group 6 — populateStoryFields (7 tests)

| ID | Test Name | What Is Verified |
|----|-----------|-----------------|
| G6-T1 | Returns { success:true, reason:'ok' } for valid data | Happy path |
| G6-T2 | Sets all six DOM field values correctly | Actual DOM population |
| G6-T3 | Returns failure for null data | Error handling |
| G6-T4 | Returns failure for data without fields | Error handling |
| G6-T5 | Calls the updateFn callback | Callback invocation |
| G6-T6 | Works with injected domLookup | Dependency injection |
| G6-T7 | Empty string values clear existing field values | Overwrite behaviour |

### Group 7 — Full Round-Trip (7 tests)

| ID | Test Name | What Is Verified |
|----|-----------|-----------------|
| G7-T1 | Data survives serialise → parse → validate | End-to-end chain |
| G7-T2 | Populate after serialise restores all 6 field values | Complete save/load cycle |
| G7-T3 | roundTripStoryData helper returns validated object | Helper function |
| G7-T4 | Partial fields (some empty) produce valid JSON | Incomplete forms saved safely |
| G7-T5 | Special characters (apostrophes, ampersands, quotes) survive | Character encoding |
| G7-T6 | Unicode / emoji survive round-trip | Internationalisation |
| G7-T7 | 1000-character field value survives round-trip | Large input handling |

### Group 8 — Edge Cases & Security (3 tests)

| ID | Test Name | What Is Verified |
|----|-----------|-----------------|
| G8-T1 | HTML `<script>` tags stored and retrieved as plain text | No XSS risk in the JSON payload |
| G8-T2 | Extra unknown keys in fields are tolerated | Forward compatibility |
| G8-T3 | Number at root is rejected by validator | Type safety at root level |

### Group 9 — Privacy Guarantee (4 tests) — Browser Suite Only

| ID | Test Name | What Is Verified |
|----|-----------|-----------------|
| G9-T1 | collectStoryData makes no network requests | fetch not called |
| G9-T2 | serialiseStoryData makes no network requests | fetch not called |
| G9-T3 | populateStoryFields makes no network requests | fetch not called |
| G9-T4 | validateStoryData makes no network requests | fetch not called |

> **Note:** Group 9 is present in the browser test suite (`storybuilder.test.html`) only. It mocks `window.fetch` and asserts it is never called. The headless JScript runner does not have a meaningful `fetch` to mock, so these 4 tests are omitted from the headless count. The browser suite runs **56 tests** (52 + 4 privacy); the headless runner runs **52 tests**.

---

## 6. Pass/Fail Criteria

| Criterion | Target |
|-----------|--------|
| Tests passed | 100% (all tests) |
| Confidence level | ≥ 99% |
| Zero failures in round-trip groups | Required |
| Zero failures in privacy group | Required |
| Zero failures in error-handling tests | Required |

---

## 7. Privacy Requirement

The following is a hard requirement verified by the test suite:

> **No function in `storybuilder.js` shall make any network request (fetch, XHR, WebSocket, or any other mechanism) under any circumstances.**

This is verified by Group 9 in the browser suite. It is also structurally guaranteed: `storybuilder.js` contains no `fetch`, `XMLHttpRequest`, `WebSocket`, or `navigator.sendBeacon` calls.

---

## 8. Test Execution Instructions

### Browser (Recommended)
1. Ensure `storybuilder.js` and `storybuilder.test.html` are in the same folder.
2. Open `storybuilder.test.html` in Chrome, Firefox, Safari, or Edge.
3. All tests run automatically on page load.
4. Results are displayed in the page. The summary bar shows total / passed / failed / confidence.
5. **No internet connection required.**

### Headless (Windows — CScript)
```powershell
cscript //nologo run-tests-jscript.js
```
Expected output ends with:
```
Results: 52 passed, 0 failed, 52 total
Confidence: 100.0%
```

---

*Test Plan v1.0 — Created by IBM Bob*
