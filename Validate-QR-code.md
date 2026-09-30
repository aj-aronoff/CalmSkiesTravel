# QR Code Validation — Test Plan

**Calm Skies Travel · Created by IBM Bob**

---

## Overview

This document specifies the test cases for the QR Code generate and load feature in
`index.html`. The companion runnable test file is `qr-validation.test.html`.

### Slim QR format

QR codes use a slim JSON format separate from the save-file format:

```
{"v":1,"t":1700000000,"f":{"n":"Maya","vi":"Grandma","d":"Florida","co":"blanket","ca":"breathe","de":"pool"}}
```

| Slim key | Full key | Bytes saved |
|---|---|---|
| `v` | `schemaVersion` | 13 |
| `t` | `savedAt` (Unix seconds) | 16 |
| `f` | `fields` | 4 |
| `n` | `name` | 5 |
| `vi` | `visiting` | 7 |
| `d` | `destination` | 10 |
| `co` | `comfort` | 6 |
| `ca` | `calm` | 3 |
| `de` | `detail` | 5 |

**Total saved: 69 bytes**

### Byte budget

| | Bytes |
|---|---|
| All-empty slim payload fixed overhead | ~74 |
| **Hard cap** | **200** |
| Budget for field content | 126 |
| Average per field (6 fields) | ~21 chars |

### Emoji and non-ASCII behaviour

`JSON.stringify` escapes non-ASCII characters as `\uXXXX` sequences (pure ASCII). For example:
- Emoji `😀` → `\uD83D\uDE00` (12 ASCII bytes in the JSON string)
- Accented `é` → `\u00e9` (6 ASCII bytes)

Because the character scan runs on the already-stringified slim JSON (which is pure ASCII),
emoji and accented characters are **not** caught by the non-ascii check. They are caught by
the **too-long** check instead, because the `\uXXXX` sequences inflate the byte count.

### How to run the tests

Open `qr-validation.test.html` in any modern browser. All tests run immediately with zero
external dependencies. Results are shown as pass/fail with a summary bar.

---

## Test Cases

### Group 1 — Generate: Positive (`canEncodeAsQR` returns ok)

| ID | Input Setup | Expected Outcome |
|---|---|---|
| QR-P01 | All six fields with short ASCII values (name="Maya", vi="Grandma", d="Florida", co="blanket", ca="breathe", de="pool") | `canEncodeAsQR` → `{ ok:true }`; button enabled |
| QR-P02 | All fields empty | Slim payload ~74 bytes → `{ ok:true }`; button enabled |
| QR-P03 | Synthetic compact ASCII string of exactly 200 bytes | `{ ok:true }` |
| QR-P04 | name="Maya", dest="FL", rest empty | Payload well under 200 bytes → `{ ok:true }` |

### Group 2 — Generate: Negative (`canEncodeAsQR` returns not-ok)

| ID | Input Setup | Expected Outcome |
|---|---|---|
| QR-N01 | All six fields filled with 5 emoji each (`😀😀😀😀😀`) | `ok:false`. Reason is `non-ascii` if the browser embeds raw surrogate pairs in the JSON string, or `too-long` if it escapes them as `\uXXXX`. Both outcomes are correct — the button is disabled either way. |
| QR-N02 | All fields filled with long ASCII strings pushing slim payload > 200 bytes | `{ ok:false, reason:'too-long' }`; button disabled |
| QR-N03 | Synthetic compact string of exactly 201 bytes | `{ ok:false, reason:'too-long' }` |
| QR-N04 | Empty string passed directly to `canEncodeAsQR` | `{ ok:false, reason:'empty' }` |
| QR-N05 | Whitespace-only string (`"   "`) passed to `canEncodeAsQR` | `{ ok:false, reason:'empty' }` |

### Group 3 — Button State

| ID | Input Setup | Expected Outcome |
|---|---|---|
| QR-B01 | Page load, all fields empty — call `updateQRButtonState()` | `#sb-qr-btn` is **not** disabled (slim payload ~74 bytes < 200) |
| QR-B02 | Short ASCII values in all fields — call `updateQRButtonState()` | `#sb-qr-btn` not disabled |
| QR-B03 | Set one field to contain emoji `😀`, call `updateQRButtonState()` | `#sb-qr-btn` is disabled |
| QR-B04 | Remove emoji, restore short ASCII, call `updateQRButtonState()` | `#sb-qr-btn` re-enabled |
| QR-B05 | Fill fields with enough ASCII to push slim payload > 200 bytes | `#sb-qr-btn` is disabled |

### Group 4 — Length Boundary

| ID | Input Setup | Expected Outcome |
|---|---|---|
| QR-L01 | Synthetic compact string of exactly 200 bytes, all printable ASCII | `canEncodeAsQR` → `{ ok:true }` |
| QR-L02 | Synthetic compact string of exactly 201 bytes | `canEncodeAsQR` → `{ ok:false, reason:'too-long' }` |
| QR-L03 | All fields empty → measure `buildQRPayload` output byte length | Documents the ~74-byte baseline; assert < 200 |

### Group 5 — `generateQR` Live Calls

| ID | Input Setup | Expected Outcome |
|---|---|---|
| QR-G01 | Short ASCII story data → build slim payload → call `generateQR` | No exception thrown; `canvas.width > 0` |
| QR-G02 | All fields empty → build slim payload → call `generateQR` | No exception thrown; `canvas.width > 0` |
| QR-G03 | Slim payload > 200 bytes → call `generateQR` directly | Exception is thrown |
| QR-G04 | Slim payload exactly 200 bytes → call `generateQR` | No exception; canvas drawn |

### Group 6 — QR Load: Positive

| ID | Input Setup | Expected Outcome |
|---|---|---|
| QR-LP01 | Valid slim JSON string with all six fields → `loadStoryFromQRText` | `{ success:true }`; all six fields populated correctly |
| QR-LP02 | Slim JSON with all empty field values (`""`) | `{ success:true }`; all fields set to `""` |
| QR-LP03 | Slim JSON built by `buildQRPayload` from real form data | Fields populated; values exactly match originals |

### Group 7 — QR Load: Negative

| ID | Input Setup | Expected Outcome |
|---|---|---|
| QR-LN01 | Empty string → `loadStoryFromQRText` | `{ success:false }`; fields unchanged |
| QR-LN02 | Full save-file JSON (long keys like `"name"`, `"destination"`) pasted | `parseQRPayload` returns null (missing slim keys `n`, `d`, etc.) → `{ success:false }` |
| QR-LN03 | Valid JSON object but missing `"f"` key entirely | `{ success:false }`; reason mentions missing key |
| QR-LN04 | Valid JSON, `"f"` present but missing slim field `"n"` | `{ success:false }`; reason mentions missing field |
| QR-LN05 | Valid JSON but a field value is a number (`"n":42`) | `{ success:false }` |
| QR-LN06 | Completely malformed JSON string (`{bad json}`) | `{ success:false }`; fields unchanged |
| QR-LN07 | JSON array at root (`[]`) | `{ success:false }` |
| QR-LN08 | `"f"` is an array instead of an object | `{ success:false }` |

### Group 8 — Round-Trip

| ID | Input Setup | Expected Outcome |
|---|---|---|
| QR-RT01 | Fill form → `buildQRPayload` → `parseQRPayload` → `populateStoryFields` → check fields | All six fields exactly match originals |
| QR-RT02 | Round-trip with all fields empty | All fields remain `""` after round-trip |
| QR-RT03 | `buildQRPayload` output → `generateQR` → no throw; then `loadStoryFromQRText` on same string → fields match | Full pipeline works end-to-end |
| QR-RT04 | `buildQRPayload` output string → `loadStoryFromQRText` → check fields | `{ success:true }`; field values match originals |

---

## Functions Under Test

| Function | Location | Purpose |
|---|---|---|
| `buildQRPayload(data)` | `storybuilder.js` | Converts story data to slim JSON string |
| `validateQRPayload(obj)` | `storybuilder.js` | Validates parsed slim object shape |
| `parseQRPayload(text)` | `storybuilder.js` | Parses slim JSON → full story data or null |
| `canEncodeAsQR(text)` | `index.html` encoder | Pre-flight: byte length ≤ 200, printable ASCII |
| `generateQR(text, canvas, size)` | `index.html` encoder | Draws QR code onto canvas element |
| `updateQRButtonState()` | `index.html` story builder | Enables/disables `#sb-qr-btn` based on current fields |
| `loadStoryFromQRText(text)` | `index.html` story builder | Parses slim JSON and populates form fields |
