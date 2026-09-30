/**
 * storybuilder.js — Calm Skies Travel
 * Story Builder: data collection, population, and serialisation logic.
 *
 * This module is the single source of truth for the save/load functions
 * used both by index.html and by the test suite.
 *
 * All data stays in the parent's browser.  Nothing is ever sent to a server.
 *
 * Created by IBM Bob  |  calmskiestravel.com
 */

'use strict';

/* ─────────────────────────────────────────────────────────────────
   CONSTANTS
───────────────────────────────────────────────────────────────── */

/** Current JSON schema version.  Increment if the shape changes. */
var SCHEMA_VERSION = 1;

/**
 * Canonical field IDs used by the Story Builder form.
 * The order here matches the order in the HTML form.
 */
var FIELD_IDS = ['sb-name', 'sb-visiting', 'sb-destination', 'sb-comfort', 'sb-calm', 'sb-detail'];

/**
 * Maps DOM element IDs to the key names stored in the JSON payload.
 */
var FIELD_MAP = {
  'sb-name':        'name',
  'sb-visiting':    'visiting',
  'sb-destination': 'destination',
  'sb-comfort':     'comfort',
  'sb-calm':        'calm',
  'sb-detail':      'detail'
};

/**
 * Maps slim QR-payload keys to the full field key names used in FIELD_MAP.
 * Used by buildQRPayload and parseQRPayload to convert between formats.
 */
var QR_FIELD_MAP = {
  'n':  'name',
  'vi': 'visiting',
  'd':  'destination',
  'co': 'comfort',
  'ca': 'calm',
  'de': 'detail'
};

/* ─────────────────────────────────────────────────────────────────
   CORE FUNCTIONS
───────────────────────────────────────────────────────────────── */

/**
 * Read the current value of a single form field.
 * Safe to call in Node.js (returns '') or in a DOM environment.
 *
 * @param {string} id - Element ID to read.
 * @param {object} [domLookup] - Optional injected document-like object
 *                               for testing outside a browser context.
 * @returns {string} Trimmed field value, or '' if element not found.
 */
function getFieldValue(id, domLookup) {
  var doc = domLookup || (typeof document !== 'undefined' ? document : null);
  if (!doc) { return ''; }
  var el = doc.getElementById(id);
  return el ? (el.value || '').trim() : '';
}

/**
 * Build a serialisable data object from the six Story Builder fields.
 *
 * Returned shape:
 * {
 *   schemaVersion : 1,
 *   savedAt       : "<ISO-8601 timestamp>",
 *   fields: {
 *     name, visiting, destination, comfort, calm, detail  (all strings)
 *   }
 * }
 *
 * @param {object} [domLookup] - Optional injected document for testing.
 * @returns {object} Story data payload.
 */
function collectStoryData(domLookup) {
  var fields = {};
  Object.keys(FIELD_MAP).forEach(function (elId) {
    fields[FIELD_MAP[elId]] = getFieldValue(elId, domLookup);
  });
  return {
    schemaVersion: SCHEMA_VERSION,
    savedAt: new Date().toISOString(),
    fields: fields
  };
}

/**
 * Validate that a parsed JSON object has the expected shape for a story payload.
 *
 * @param {*} data - Value to validate.
 * @returns {{ valid: boolean, reason: string }}
 */
function validateStoryData(data) {
  if (data === null || typeof data !== 'object' || Array.isArray(data)) {
    return { valid: false, reason: 'Root value must be a plain object.' };
  }
  if (!Object.prototype.hasOwnProperty.call(data, 'fields')) {
    return { valid: false, reason: 'Missing required key: "fields".' };
  }
  if (data.fields === null || typeof data.fields !== 'object' || Array.isArray(data.fields)) {
    return { valid: false, reason: '"fields" must be a plain object.' };
  }
  var fieldKeys = Object.values(FIELD_MAP);
  for (var i = 0; i < fieldKeys.length; i++) {
    var key = fieldKeys[i];
    if (!Object.prototype.hasOwnProperty.call(data.fields, key)) {
      return { valid: false, reason: 'Missing field: "' + key + '".' };
    }
    if (typeof data.fields[key] !== 'string') {
      return { valid: false, reason: 'Field "' + key + '" must be a string.' };
    }
  }
  return { valid: true, reason: 'ok' };
}

/**
 * Populate the Story Builder form from a previously saved data object.
 *
 * @param {object} data       - Story payload (as returned by collectStoryData).
 * @param {object} [domLookup] - Optional injected document for testing.
 * @param {function} [updateFn] - Optional callback called after fields are set
 *                                (used to refresh the live story card).
 * @returns {{ success: boolean, reason: string }}
 */
function populateStoryFields(data, domLookup, updateFn) {
  var validation = validateStoryData(data);
  if (!validation.valid) {
    return { success: false, reason: validation.reason };
  }
  var doc = domLookup || (typeof document !== 'undefined' ? document : null);
  if (!doc) {
    return { success: false, reason: 'No DOM available.' };
  }
  Object.keys(FIELD_MAP).forEach(function (elId) {
    var el = doc.getElementById(elId);
    if (el) {
      el.value = data.fields[FIELD_MAP[elId]];
    }
  });
  if (typeof updateFn === 'function') {
    updateFn();
  }
  return { success: true, reason: 'ok' };
}

/**
 * Serialise a story data object to a JSON string (indented for readability).
 *
 * @param {object} data - Story payload.
 * @returns {string} JSON string.
 */
function serialiseStoryData(data) {
  return JSON.stringify(data, null, 2);
}

/**
 * Parse a JSON string and return the parsed value, or null on error.
 *
 * @param {string} text - Raw JSON text.
 * @returns {object|null}
 */
function parseStoryJSON(text) {
  try {
    return JSON.parse(text);
  } catch (e) {
    return null;
  }
}

/**
 * Full round-trip helper: collect → serialise → parse → validate.
 * Returns the parsed + validated object, or null if any step fails.
 *
 * @param {object} [domLookup] - Optional injected document for testing.
 * @returns {object|null}
 */
function roundTripStoryData(domLookup) {
  var data   = collectStoryData(domLookup);
  var json   = serialiseStoryData(data);
  var parsed = parseStoryJSON(json);
  if (!parsed) { return null; }
  var v = validateStoryData(parsed);
  return v.valid ? parsed : null;
}

/* ─────────────────────────────────────────────────────────────────
   QR PAYLOAD HELPERS
   Slim format for QR codes only.  The save-file format is unchanged.
───────────────────────────────────────────────────────────────── */

/**
 * Build a compact slim JSON string from a collectStoryData() result.
 * Uses short keys and a Unix-seconds timestamp to stay well under 200 bytes.
 *
 * @param {object} data - Story payload (as returned by collectStoryData).
 * @returns {string} Compact JSON string, e.g.
 *   {"v":1,"t":1700000000,"f":{"n":"Maya","vi":"Grandma","d":"Florida","co":"blanket","ca":"breathe","de":"pool"}}
 */
function buildQRPayload(data) {
  var slimFields = {};
  var slimKeys = Object.keys(QR_FIELD_MAP);
  for (var i = 0; i < slimKeys.length; i++) {
    var slim = slimKeys[i];
    var full = QR_FIELD_MAP[slim];
    slimFields[slim] = data.fields[full];
  }
  return JSON.stringify({ v: 1, t: Math.floor(Date.now() / 1000), f: slimFields });
}

/**
 * Validate a parsed slim QR payload object.
 * Returns { valid: boolean, reason: string }.
 *
 * @param {*} obj - The parsed value to validate.
 * @returns {{ valid: boolean, reason: string }}
 */
function validateQRPayload(obj) {
  if (obj === null || typeof obj !== 'object' || Array.isArray(obj)) {
    return { valid: false, reason: 'Payload must be a plain object.' };
  }
  if (!Object.prototype.hasOwnProperty.call(obj, 'v')) {
    return { valid: false, reason: 'Missing required key: "v".' };
  }
  if (!Object.prototype.hasOwnProperty.call(obj, 'f') ||
      obj.f === null || typeof obj.f !== 'object' || Array.isArray(obj.f)) {
    return { valid: false, reason: 'Missing or invalid key: "f".' };
  }
  var slimKeys = Object.keys(QR_FIELD_MAP);
  for (var i = 0; i < slimKeys.length; i++) {
    var slim = slimKeys[i];
    if (!Object.prototype.hasOwnProperty.call(obj.f, slim)) {
      return { valid: false, reason: 'Missing slim field: "' + slim + '".' };
    }
    if (typeof obj.f[slim] !== 'string') {
      return { valid: false, reason: 'Slim field "' + slim + '" must be a string.' };
    }
  }
  return { valid: true, reason: 'ok' };
}

/**
 * Parse a slim QR JSON string and return a full story data object
 * (same shape as collectStoryData()), or null on any parse or validation failure.
 *
 * @param {string} text - The slim JSON string from a scanned QR code.
 * @returns {object|null}
 */
function parseQRPayload(text) {
  var obj = parseStoryJSON(text);
  if (!obj) { return null; }
  var v = validateQRPayload(obj);
  if (!v.valid) { return null; }
  var fullFields = {};
  var slimKeys = Object.keys(QR_FIELD_MAP);
  for (var i = 0; i < slimKeys.length; i++) {
    var slim = slimKeys[i];
    fullFields[QR_FIELD_MAP[slim]] = obj.f[slim];
  }
  return {
    schemaVersion: 1,
    savedAt: new Date().toISOString(),
    fields: fullFields
  };
}

/* ─────────────────────────────────────────────────────────────────
   LOCAL STORAGE
   Key used to store the story in localStorage.
   All data stays in the parent's browser — nothing is sent to any server.
───────────────────────────────────────────────────────────────── */

var LOCAL_STORAGE_KEY = 'calmSkiesStory';

/**
 * Save the current Story Builder fields to localStorage.
 * Returns true on success, false if localStorage is unavailable.
 *
 * @param {object} [domLookup] - Optional injected document for testing.
 * @returns {boolean}
 */
function saveToLocalStorage(domLookup) {
  try {
    var data = collectStoryData(domLookup);
    var json = serialiseStoryData(data);
    localStorage.setItem(LOCAL_STORAGE_KEY, json);
    return true;
  } catch (e) {
    return false;
  }
}

/**
 * Load a previously saved story from localStorage and populate the form fields.
 * Returns { success: boolean, reason: string }.
 *
 * @param {object} [domLookup]  - Optional injected document for testing.
 * @param {function} [updateFn] - Optional callback called after fields are set.
 * @returns {{ success: boolean, reason: string }}
 */
function loadFromLocalStorage(domLookup, updateFn) {
  try {
    var json = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!json) { return { success: false, reason: 'No saved story found.' }; }
    var data = parseStoryJSON(json);
    if (!data) { return { success: false, reason: 'Saved data could not be parsed.' }; }
    return populateStoryFields(data, domLookup, updateFn);
  } catch (e) {
    return { success: false, reason: 'localStorage is not available.' };
  }
}

/**
 * Clear the saved story from localStorage.
 * Returns true on success, false if localStorage is unavailable.
 *
 * @returns {boolean}
 */
function clearLocalStorage() {
  try {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    return true;
  } catch (e) {
    return false;
  }
}

/**
 * Return true if a saved story exists in localStorage.
 *
 * @returns {boolean}
 */
function hasSavedStory() {
  try {
    return localStorage.getItem(LOCAL_STORAGE_KEY) !== null;
  } catch (e) {
    return false;
  }
}

/* ─────────────────────────────────────────────────────────────────
   EXPORTS  (Node.js / test runner)
   In a plain browser <script> these are silently unused.
───────────────────────────────────────────────────────────────── */
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    SCHEMA_VERSION:       SCHEMA_VERSION,
    FIELD_IDS:            FIELD_IDS,
    FIELD_MAP:            FIELD_MAP,
    QR_FIELD_MAP:         QR_FIELD_MAP,
    LOCAL_STORAGE_KEY:    LOCAL_STORAGE_KEY,
    getFieldValue:        getFieldValue,
    collectStoryData:     collectStoryData,
    validateStoryData:    validateStoryData,
    populateStoryFields:  populateStoryFields,
    serialiseStoryData:   serialiseStoryData,
    parseStoryJSON:       parseStoryJSON,
    roundTripStoryData:   roundTripStoryData,
    saveToLocalStorage:   saveToLocalStorage,
    loadFromLocalStorage: loadFromLocalStorage,
    clearLocalStorage:    clearLocalStorage,
    hasSavedStory:        hasSavedStory,
    buildQRPayload:       buildQRPayload,
    validateQRPayload:    validateQRPayload,
    parseQRPayload:       parseQRPayload
  };
}
