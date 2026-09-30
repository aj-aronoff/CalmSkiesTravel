# Validate QR Code — Implementation Plan

## Top-Level Overview

The QR sharing feature in `index.html` currently only **generates** QR codes. There is no QR
Load path — no button, no decoder, no way to scan a QR back into the form. This plan adds both
directions using a slim JSON format, enforces a 200-byte hard cap, and adds a comprehensive
test suite that calls `generateQR` and the load path with real data.

### Three problems being fixed

1. **No QR Load** — there is no "Load from QR" button or decoder anywhere in the app.
2. **Payload too large** — the full save-file JSON has ~142 bytes of fixed overhead, leaving
   only ~72 bytes for field content (~12 chars/field). Not enough for a useful story.
3. **No button disable** — QR generation errors are swallowed silently with no user feedback.

### Solution overview

| Change | Detail |
|---|---|
| **Slim QR-only JSON format** | Short keys + Unix-seconds timestamp. Saves 69 bytes of overhead. |
| **200-byte hard cap** | Button disabled whenever slim payload exceeds 200 bytes. |
| **`canEncodeAsQR(text)`** | Pre-flight helper: checks byte length ≤ 200 and printable-ASCII only. |
| **`buildQRPayload(data)`** | Converts story data to slim JSON for QR generation. |
| **`parseQRPayload(text)`** | Parses slim JSON back to a full story data object; rejects anything not in proper format. |
| **`validateQRPayload(obj)`** | Validates a parsed slim object shape; returns `{ valid, reason }`. |
| **QR Load button** | New `#sb-qr-load-btn` that reveals a paste area for the slim JSON string. |
| **Button disable wiring** | `updateQRButtonState()` called on every field `input` event and on page load. |
| **Runnable test file** | `qr-validation.test.html` — calls `generateQR` and the load path with real data, tests round-trips, verifies button states. |

---

## Byte Budget

| | Bytes |
|---|---|
| Full save-file format fixed overhead | ~142 |
| **Slim QR format fixed overhead** | **~74** |
| Hard cap | **200** |
| **Budget for field content** | **126** |
| Average per field (6 fields) | ~21 chars |

### Slim key mapping

| Full key | Slim key | Bytes saved |
|---|---|---|
| `"schemaVersion":1` | `"v":1` | 13 |
| `"savedAt":"2024-01-01T00:00:00.000Z"` | `"t":1700000000` (Unix seconds) | 16 |
| `"fields":{}` | `"f":{}` | 4 |
| `"name"` | `"n"` | 5 |
| `"visiting"` | `"vi"` | 7 |
| `"destination"` | `"d"` | 10 |
| `"comfort"` | `"co"` | 6 |
| `"calm"` | `"ca"` | 3 |
| `"detail"` | `"de"` | 5 |
| **Total saved** | | **69 bytes** |

All-empty slim payload (~74 bytes — button **enabled** on page load):
```
{"v":1,"t":1700000000,"f":{"n":"","vi":"","d":"","co":"","ca":"","de":""}}
```

The **save-file format** (`serialiseStoryData`) is **not changed**. Load-from-file continues
to work exactly as before. QR is a completely separate encoding path.

---

## Sub-Task 1 — Add slim payload helpers to `storybuilder.js`

**Intent**
Add `buildQRPayload(data)`, `parseQRPayload(text)`, and `validateQRPayload(obj)` to
`storybuilder.js`. These are the single source of truth for the slim format used by both
QR generate and QR load. Placing them in `storybuilder.js` makes them available to both
`index.html` and the test suite without duplication.

**Expected Outcomes**
- `buildQRPayload(data)` takes a `collectStoryData()` result and returns a compact slim JSON
  string: `{"v":1,"t":1700000000,"f":{"n":"Maya","vi":"Grandma","d":"Florida","co":"blanket","ca":"breathe","de":"pool"}}`.
- `validateQRPayload(obj)` validates a parsed slim object and returns `{ valid: boolean, reason: string }`.
  Rejects: null, non-object, array, missing `"v"`, missing `"f"`, missing any of the six slim
  field keys, non-string field values.
- `parseQRPayload(text)` parses the slim JSON string and returns a full story data object
  (same shape as `collectStoryData()`) with long keys and `schemaVersion`/`savedAt` restored —
  or returns `null` on any parse or validation failure.
- Both `buildQRPayload` and `parseQRPayload` use a `QR_FIELD_MAP` constant that maps slim
  keys to full keys: `{ n:'name', vi:'visiting', d:'destination', co:'comfort', ca:'calm', de:'detail' }`.
- All three functions are exported via `module.exports`.

**Todo List**
- [ ] Add `QR_FIELD_MAP` constant below `FIELD_MAP` in `storybuilder.js`.
- [ ] Add `buildQRPayload(data)` that builds the slim object and returns `JSON.stringify` of it.
- [ ] Add `validateQRPayload(obj)` checking: non-null plain object, has `"v"`, has `"f"` as
      plain object, has all six slim field keys, all values are strings.
- [ ] Add `parseQRPayload(text)` that: (a) calls `parseStoryJSON(text)`, (b) calls
      `validateQRPayload`, (c) maps slim keys back to full keys and returns a story data object,
      or `null` on any failure.
- [ ] Add all three to `module.exports`.

**Relevant Context**
- `storybuilder.js` lines 31–38 — `FIELD_MAP` to follow as pattern
- `storybuilder.js` lines 162–168 — `parseStoryJSON` to reuse
- `storybuilder.js` lines 264–282 — exports block to extend

**Status** `[ ] pending`

---

## Sub-Task 2 — Add `canEncodeAsQR` and `byteLength` to the QR encoder

**Intent**
Add a `canEncodeAsQR(text)` pre-flight function and a `byteLength(str)` helper inside the QR
encoder IIFE in `index.html`. These validate whether a slim payload string is safe to encode
before `generateQR` is called.

**Expected Outcomes**
- `window.canEncodeAsQR(text)` returns:
  - `{ ok: true }` — ≤ 200 UTF-8 bytes, every character in printable ASCII range 0x20–0x7E.
  - `{ ok: false, reason: 'too-long' }` — UTF-8 byte length exceeds 200.
  - `{ ok: false, reason: 'non-ascii' }` — any character outside 0x20–0x7E.
  - `{ ok: false, reason: 'empty' }` — blank or whitespace-only input.
- Character scan runs on the string as passed (the slim JSON is already pure ASCII after
  `JSON.stringify` escapes any non-ASCII as `\uXXXX`).
- `byteLength(str)` uses `TextEncoder` if available, falls back to counting via `encodeURIComponent`.
- `generateQR` is updated to throw a clear error if the payload byte length exceeds 200,
  keeping the encoder and pre-flight check consistent.
- `window.canEncodeAsQR` is exposed so the test file can call it directly.

**Todo List**
- [ ] Add `byteLength(str)` helper inside the encoder IIFE after `rsEncode`.
- [ ] Add `canEncodeAsQR(text)` with: empty check, `byteLength` check ≤ 200, char scan 0x20–0x7E.
- [ ] Expose as `window.canEncodeAsQR`.
- [ ] Update `generateQR` (or `pickVersion`) to throw if `byteLength(compact) > 200`.

**Relevant Context**
- Encoder IIFE: `index.html` lines 1191–1476
- `generateQR` public API: `index.html` lines 1462–1474
- `pickVersion`: `index.html` lines 1259–1265
- `encodeData` char check: `index.html` lines 1268–1274

**Status** `[ ] pending`

---

## Sub-Task 3 — Wire QR Generate to slim format + button disable/enable

**Intent**
Update the QR Generate click handler to use `buildQRPayload` instead of `serialiseStoryData`,
add `updateQRButtonState()` to disable/enable the button live on every field change, and
style the disabled state in CSS.

**Expected Outcomes**
- Clicking "Share via QR Code" encodes the slim payload (not the full save-file JSON).
- Button is **enabled** on page load (empty slim payload ~74 bytes < 200).
- Button disables immediately when any `input` event causes the slim payload to exceed 200
  bytes or contain a non-ASCII character.
- Button re-enables when fields come back into range.
- `qrBtn.title` is set with a human-readable reason when disabled.
- `window.updateQRButtonState` is exposed for the test file.
- `.sb-btn:disabled` is styled in `styles.css`.

**Todo List**
- [ ] Update QR button click handler (`index.html` lines 1146–1162): replace
      `serialiseStoryData(data)` with `buildQRPayload(data)`.
- [ ] Add `updateQRButtonState()` that: collects data → `buildQRPayload` → `canEncodeAsQR`
      → sets `qrBtn.disabled` and `qrBtn.title`.
- [ ] In the `sbFields.forEach` input loop (`index.html` lines 1166–1174), call
      `updateQRButtonState()` on every `input` event.
- [ ] Call `updateQRButtonState()` once on page load after all wiring.
- [ ] Expose as `window.updateQRButtonState`.
- [ ] Add to `styles.css`: `.sb-btn:disabled { opacity: 0.45; cursor: not-allowed; }`
      (confirmed absent — last `.sb-btn-qr` rule at line 449).

**Relevant Context**
- QR button click handler: `index.html` lines 1143–1174
- `sbFields` and input loop: `index.html` lines 957, 1166–1174
- `styles.css` `.sb-btn-qr`: lines 444–449

**Status** `[ ] pending`

---

## Sub-Task 4 — Add QR Load button and `loadStoryFromQRText` handler

**Intent**
**This feature does not exist yet.** Add a "📷 Load Story from QR" button (`#sb-qr-load-btn`)
that reveals a paste area where the user can paste the slim JSON string from a scanned QR code.
The load path parses it with `parseQRPayload` and rejects anything not in the correct slim format.

**Why paste-a-string first:** True camera-based QR decoding requires a JS library (jsQR, ZXing)
or the native `BarcodeDetector` API which is not yet universally supported and would add a
dependency. A paste-text implementation is zero-dependency, fully testable, and proves the
parse/populate pipeline works end-to-end. Camera scanning can be layered on top later.

**Expected Outcomes**
- A new `#sb-qr-load-btn` button appears in the actions row next to the generate button.
- Clicking it toggles a hidden `#sb-qr-paste-section` containing a `<textarea id="sb-qr-input">`
  and a `#sb-qr-load-confirm` button.
- Clicking "Load" calls `loadStoryFromQRText(text)` with the textarea value.
- On success: fields are populated, status shows "✅ Story loaded from QR!", paste section hides.
- On failure: status shows "⚠️ Not a valid Calm Skies QR code." Fields are not changed.
- `loadStoryFromQRText(text)` is a pure function: calls `parseQRPayload(text)` then
  `populateStoryFields(data, document, updateStory)`. Returns `{ success: boolean, reason: string }`.
- Anything not in the correct slim format is rejected: missing keys, wrong types, full save-file
  JSON (long keys), malformed JSON, empty string, arrays, numbers at root.
- `window.loadStoryFromQRText` is exposed for the test file.

**Todo List**
- [ ] Add `#sb-qr-load-btn` button and `#sb-qr-paste-section` hidden div (with `<textarea>` and
      confirm button) to the actions row in `index.html` after `#sb-qr-btn`.
- [ ] Add `loadStoryFromQRText(text)` function in the story builder script block.
- [ ] Wire `#sb-qr-load-btn` click to toggle `#sb-qr-paste-section` visibility.
- [ ] Wire `#sb-qr-load-confirm` click to call `loadStoryFromQRText` and show status.
- [ ] Call `updateQRButtonState()` after a successful load.
- [ ] Expose `loadStoryFromQRText` on `window`.

**Relevant Context**
- Existing actions row: `index.html` lines 234–250
- `loadStoryFromFile` pattern: `index.html` lines 1097–1119
- `parseQRPayload`: Sub-Task 1
- `populateStoryFields`: `storybuilder.js` lines 125–144

**Status** `[ ] pending`

---

## Sub-Task 5 — Write `Validate-QR-code.md` test plan document

**Intent**
A written reference document specifying every test case with ID, input, expected outcome, and
rationale. Covers generate, load, button state, length boundary, and round-trip test groups.

**Test Cases**

| Group | ID | Input Setup | Expected Outcome |
|---|---|---|---|
| **Generate — Positive** | QR-P01 | All six fields with short ASCII values, slim payload < 200 bytes | `canEncodeAsQR` → `ok:true`; `generateQR` draws canvas; no throw |
| | QR-P02 | All fields empty | Slim payload ~74 bytes → `ok:true`; button enabled; canvas drawn |
| | QR-P03 | Synthetic compact string exactly 200 bytes, all ASCII | `ok:true` |
| | QR-P04 | name="Maya" dest="Florida" rest short ASCII | `ok:true`; button enabled |
| **Generate — Negative** | QR-N01 | One field contains emoji `😀` | `\uD83D\uDE00` inflates payload → `ok:false`, reason `too-long`; button disabled |
| | QR-N02 | All fields long ASCII strings, slim payload > 200 bytes | `ok:false`, reason `too-long`; button disabled |
| | QR-N03 | Synthetic compact string exactly 201 bytes | `ok:false`, reason `too-long` |
| | QR-N04 | Empty string to `canEncodeAsQR` | `ok:false`, reason `empty` |
| | QR-N05 | Whitespace-only string to `canEncodeAsQR` | `ok:false`, reason `empty` |
| **Button State** | QR-B01 | Page load, all fields empty | Button **enabled** (slim payload ~74 bytes < 200) |
| | QR-B02 | Short ASCII values in all fields | Button enabled; canvas drawn on click |
| | QR-B03 | Type emoji into any field | Button disables immediately |
| | QR-B04 | Remove emoji, restore short ASCII | Button re-enables |
| | QR-B05 | Incrementally add ASCII chars until slim payload > 200 bytes | Button disables at exact byte boundary |
| **Length Boundary** | QR-L01 | Synthetic compact string exactly 200 bytes, all ASCII | `ok:true` |
| | QR-L02 | Synthetic compact string exactly 201 bytes | `ok:false`, reason `too-long` |
| | QR-L03 | All-empty fields — measure actual slim payload byte count | Documents ~74-byte baseline |
| **Load — Positive** | QR-LP01 | Valid slim JSON string to `loadStoryFromQRText` | `success:true`; all six fields populated correctly |
| | QR-LP02 | Slim JSON with all empty field values | `success:true`; all fields set to `""` |
| | QR-LP03 | Slim JSON built by `buildQRPayload` from real form data | Fields populated; values match originals |
| **Load — Negative** | QR-LN01 | Empty string to `loadStoryFromQRText` | `success:false`; fields unchanged |
| | QR-LN02 | Full save-file JSON (long keys) pasted | `parseQRPayload` returns null — missing slim keys → rejected |
| | QR-LN03 | Valid JSON but missing `"f"` key | Rejected; reason mentions missing key |
| | QR-LN04 | Valid JSON, `"f"` present but missing slim field `"n"` | Rejected; reason mentions missing field |
| | QR-LN05 | Valid JSON but a field value is a number | Rejected |
| | QR-LN06 | Completely malformed JSON string | Rejected; fields unchanged |
| | QR-LN07 | JSON array at root | Rejected |
| | QR-LN08 | `"f"` is an array, not an object | Rejected |
| **Round-Trip** | QR-RT01 | Fill form → `buildQRPayload` → `parseQRPayload` → `populateStoryFields` → verify all six fields | All fields exactly match originals |
| | QR-RT02 | Round-trip with all fields empty | Fields remain empty after round-trip |
| | QR-RT03 | Round-trip, then `generateQR` on result → canvas drawn | Full pipeline works end-to-end |
| | QR-RT04 | `buildQRPayload` output string → `loadStoryFromQRText` → check fields | Fields match originals; success:true |

**Todo List**
- [ ] Write `Validate-QR-code.md` with: introduction, slim format explanation, byte budget table,
      note on `\uXXXX` escape behaviour for emoji, full test table, and instructions for running
      the companion test file.

**Status** `[ ] pending`

---

## Sub-Task 6 — Write `qr-validation.test.html` runnable test file

**Intent**
A runnable in-browser test file using the same harness as `storybuilder.test.html` that
**actually calls `generateQR`** with real data, calls `loadStoryFromQRText` with good and bad
inputs, and executes full round-trips where generate output is fed into the load path.

**Expected Outcomes**
- Opens in any browser, zero external dependencies.
- Loads `storybuilder.js` via `<script src="storybuilder.js">`.
- Includes an inline copy of the QR encoder IIFE (from `index.html`).
- Hidden fixture DOM: all six `sb-*` inputs, `<canvas id="sb-qr-canvas">`,
  `<button id="sb-qr-btn">`, `<textarea id="sb-qr-input">`.
- All 30+ test cases from Sub-Task 5 implemented as executable tests.
- `generateQR` tests: no throw + `canvas.width > 0` for good input; throws for bad input.
- `loadStoryFromQRText` tests: fields populated for valid slim JSON; unchanged for invalid.
- Round-trip tests: `buildQRPayload` output → `loadStoryFromQRText` → assert fields match originals.
- All tests pass after Sub-Tasks 1–4 are complete.

**Test groups**
- Group 1 — `canEncodeAsQR` Positive (QR-P01 to QR-P04)
- Group 2 — `canEncodeAsQR` Negative (QR-N01 to QR-N05)
- Group 3 — Button State (QR-B01 to QR-B05) — calls `updateQRButtonState()`, asserts `.disabled`
- Group 4 — Length Boundary (QR-L01 to QR-L03)
- Group 5 — `generateQR` Live Calls (actual encode + canvas draw verification)
- Group 6 — QR Load Positive (QR-LP01 to QR-LP03)
- Group 7 — QR Load Negative (QR-LN01 to QR-LN08)
- Group 8 — Round-Trip (QR-RT01 to QR-RT04)

**Implementation notes**
- `setField(id, value)` + `fireInput(id)` helpers to set values and dispatch real `input` events.
- For round-trip tests: `buildQRPayload(collectStoryData())` → pass the result string directly
  to `loadStoryFromQRText` → assert DOM field values match.
- Button state tests call `window.updateQRButtonState()` then check `btn.disabled`.
- `generateQR` live call: wrap in try/catch; assert no error thrown; assert `canvas.width > 0`.

**Todo List**
- [ ] Write `qr-validation.test.html` with all eight test groups.
- [ ] Add `setField`, `fireInput`, `clearAllFields`, `fillAllFields` helpers.
- [ ] Include `<canvas id="sb-qr-canvas">` and `<button id="sb-qr-btn">` in hidden fixture.
- [ ] Include inline copy of QR encoder IIFE from `index.html` lines 1179–1477.
- [ ] Verify all tests pass after Sub-Tasks 1–4 are complete.

**Relevant Context**
- `storybuilder.test.html` — harness pattern to replicate
- QR encoder IIFE: `index.html` lines 1179–1477
- `canEncodeAsQR`, `buildQRPayload`: Sub-Task 1 & 2
- `updateQRButtonState`: Sub-Task 3
- `loadStoryFromQRText`: Sub-Task 4

**Status** `[ ] pending`

---

## Implementation Order

```
Sub-Task 1  (storybuilder.js — buildQRPayload, parseQRPayload, validateQRPayload)
    ↓
Sub-Task 2  (index.html encoder — canEncodeAsQR, byteLength, 200-byte cap)
    ↓
Sub-Task 3  (index.html — wire generate to slim format + button disable/enable)
    ↓
Sub-Task 4  (index.html — QR Load button + loadStoryFromQRText)
    ↓
Sub-Tasks 5 & 6  (Validate-QR-code.md + qr-validation.test.html)
```

---

## Decisions Made

| Decision | Rationale |
|---|---|
| **Slim QR-only format** | Saves 69 bytes. Leaves 126 bytes for field content (~21 chars/field). |
| **Unix seconds timestamp** | 10 bytes vs. 24 for ISO string. Always ASCII digits. Reversible. Safe to year 2286. |
| **Short field keys (n, vi, d, co, ca, de)** | Saves 36 bytes. Unambiguous within this schema. |
| **200-byte hard cap** | Conservative below encoder max of ~212 bytes. Leaves headroom and is a clean round number. |
| **Save-file format unchanged** | Load-from-file continues to work. QR is a completely separate encoding path. |
| **`parseQRPayload` in storybuilder.js** | Single source of truth for both directions. Testable in Node and browser. |
| **QR Load = paste slim JSON** | Zero dependencies. Fully testable. Camera scanning is a future layer. |
| **Button enabled on empty fields** | Slim empty payload is ~74 bytes — well under 200. |
| **Tests call `generateQR` for real** | Proves the full encoder pipeline works, not just the pre-flight logic. |
| **Round-trip tests** | Generate output fed directly into load path — proves both directions agree on the same format. |
| **Emoji → `too-long` not `non-ascii`** | `JSON.stringify` turns `😀` into `\uD83D\uDE00` (12 ASCII bytes). The length check catches it; char scan sees only valid ASCII. |
