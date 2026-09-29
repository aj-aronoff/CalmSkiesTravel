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
   EXPORTS  (Node.js / test runner)
   In a plain browser <script> these are silently unused.
───────────────────────────────────────────────────────────────── */
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    SCHEMA_VERSION:      SCHEMA_VERSION,
    FIELD_IDS:           FIELD_IDS,
    FIELD_MAP:           FIELD_MAP,
    getFieldValue:       getFieldValue,
    collectStoryData:    collectStoryData,
    validateStoryData:   validateStoryData,
    populateStoryFields: populateStoryFields,
    serialiseStoryData:  serialiseStoryData,
    parseStoryJSON:      parseStoryJSON,
    roundTripStoryData:  roundTripStoryData
  };
}
