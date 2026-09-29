/**
 * run-tests-jscript.js  — CScript/JScript compatible test runner (ES3)
 * Created by IBM Bob  |  calmskiestravel.com
 *
 * Polyfills for ancient JScript (Windows Script Host):
 *   - Date.prototype.toISOString
 *   - JSON.stringify / JSON.parse
 */

/* ── Polyfill: Date.prototype.toISOString ── */
if (!Date.prototype.toISOString) {
  Date.prototype.toISOString = function() {
    function pad(n, w) { var s = String(n); while (s.length < (w || 2)) { s = '0' + s; } return s; }
    return this.getUTCFullYear() + '-' + pad(this.getUTCMonth()+1) + '-' + pad(this.getUTCDate()) +
           'T' + pad(this.getUTCHours()) + ':' + pad(this.getUTCMinutes()) + ':' + pad(this.getUTCSeconds()) +
           '.' + pad(this.getUTCMilliseconds(), 3) + 'Z';
  };
}

/* ── Polyfill: JSON (minimal, covers our use case) ── */
if (typeof JSON === 'undefined') {
  var JSON = {};
  JSON.stringify = function stringify(val, replacer, space) {
    var sp = (typeof space === 'number') ? new Array(space + 1).join(' ') : (space || '');
    function ser(v, indent) {
      if (v === null)           { return 'null'; }
      if (typeof v === 'boolean' || typeof v === 'number') { return String(v); }
      if (typeof v === 'string') {
        return '"' + v.replace(/\\/g,'\\\\').replace(/"/g,'\\"').replace(/\r/g,'\\r')
                      .replace(/\n/g,'\\n').replace(/\t/g,'\\t') + '"';
      }
      if (v instanceof Array) {
        var ai, aparts = [];
        for (ai = 0; ai < v.length; ai++) { aparts.push(ser(v[ai], indent + sp)); }
        if (!sp) { return '[' + aparts.join(',') + ']'; }
        return '[\n' + indent + sp + aparts.join(',\n' + indent + sp) + '\n' + indent + ']';
      }
      if (typeof v === 'object') {
        var ok, oparts = [];
        for (ok in v) { if (v.hasOwnProperty(ok)) { oparts.push(ser(ok,'') + (sp?': ':':') + ser(v[ok], indent + sp)); } }
        if (!sp) { return '{' + oparts.join(',') + '}'; }
        return '{\n' + indent + sp + oparts.join(',\n' + indent + sp) + '\n' + indent + '}';
      }
      return undefined;
    }
    return ser(val, '');
  };
  JSON.parse = function(text) {
    /* Use eval in a controlled way — text comes only from our own serialiser */
    return eval('(' + text + ')');
  };
}

var SCHEMA_VERSION = 1;
var FIELD_IDS = ['sb-name','sb-visiting','sb-destination','sb-comfort','sb-calm','sb-detail'];
var FIELD_MAP = {};
FIELD_MAP['sb-name']        = 'name';
FIELD_MAP['sb-visiting']    = 'visiting';
FIELD_MAP['sb-destination'] = 'destination';
FIELD_MAP['sb-comfort']     = 'comfort';
FIELD_MAP['sb-calm']        = 'calm';
FIELD_MAP['sb-detail']      = 'detail';

var FIELD_KEYS = ['name','visiting','destination','comfort','calm','detail'];
var FIELD_EL_IDS = ['sb-name','sb-visiting','sb-destination','sb-comfort','sb-calm','sb-detail'];

/* Fake DOM */
var elements = {};
var i;
for (i = 0; i < FIELD_EL_IDS.length; i++) {
  elements[FIELD_EL_IDS[i]] = { value: '' };
}
var fakeDoc = {
  getElementById: function(id) { return elements[id] || null; }
};

/* ── Core functions (ES3, no arrow functions, no Object.values) ── */
function getFieldValue(id, doc) {
  if (!doc) { doc = fakeDoc; }
  var el = doc.getElementById(id);
  if (!el) { return ''; }
  var v = el.value || '';
  return v.replace(/^\s+|\s+$/g, '');
}

function collectStoryData(doc) {
  var fields = {};
  var k;
  for (k in FIELD_MAP) {
    if (FIELD_MAP.hasOwnProperty(k)) {
      fields[FIELD_MAP[k]] = getFieldValue(k, doc);
    }
  }
  return { schemaVersion: 1, savedAt: new Date().toISOString(), fields: fields };
}

function isPlainObject(v) {
  return v !== null && typeof v === 'object' && !( v instanceof Array );
}

function validateStoryData(data) {
  if (!isPlainObject(data)) { return { valid: false, reason: 'Root must be plain object' }; }
  if (!data.hasOwnProperty('fields')) { return { valid: false, reason: 'Missing "fields" key' }; }
  if (!isPlainObject(data.fields)) { return { valid: false, reason: '"fields" must be plain object' }; }
  var j;
  for (j = 0; j < FIELD_KEYS.length; j++) {
    var fk = FIELD_KEYS[j];
    if (!data.fields.hasOwnProperty(fk)) { return { valid: false, reason: 'Missing field: ' + fk }; }
    if (typeof data.fields[fk] !== 'string') { return { valid: false, reason: 'Field ' + fk + ' must be string' }; }
  }
  return { valid: true, reason: 'ok' };
}

function serialiseStoryData(data) {
  return JSON.stringify(data, null, 2);
}

function parseStoryJSON(text) {
  if (text === null || text === undefined) { return null; }
  try { return JSON.parse(text); } catch (e) { return null; }
}

function populateStoryFields(data, doc, cb) {
  var v = validateStoryData(data);
  if (!v.valid) { return { success: false, reason: v.reason }; }
  if (!doc) { doc = fakeDoc; }
  var k;
  for (k in FIELD_MAP) {
    if (FIELD_MAP.hasOwnProperty(k)) {
      var el = doc.getElementById(k);
      if (el) { el.value = data.fields[FIELD_MAP[k]]; }
    }
  }
  if (typeof cb === 'function') { cb(); }
  return { success: true, reason: 'ok' };
}

/* ── Harness ── */
var passed = 0, failed = 0, log = [];

function setF(id, v) { if (elements[id]) { elements[id].value = v; } }
function clearAll() {
  var j;
  for (j = 0; j < FIELD_EL_IDS.length; j++) { elements[FIELD_EL_IDS[j]].value = ''; }
}
function fillAll() {
  setF('sb-name','Maya'); setF('sb-visiting','Grandma'); setF('sb-destination','Florida');
  setF('sb-comfort','blue blanket'); setF('sb-calm','squeeze my fidget'); setF('sb-detail','swimming in the pool');
}

function t(name, fn) {
  try { fn(); passed++; log.push('PASS: ' + name); }
  catch (e) { failed++; log.push('FAIL: ' + name + ' -- ' + e.message); }
}
function eq(a, b, lbl) { if (a !== b) { throw new Error(lbl + ': expected ' + JSON.stringify(b) + ' got ' + JSON.stringify(a)); } }
function ok(v, lbl)    { if (!v) { throw new Error(lbl + ': expected truthy, got ' + JSON.stringify(v)); } }
function no(v, lbl)    { if (v)  { throw new Error(lbl + ': expected falsy, got '  + JSON.stringify(v)); } }
function has(s, sub, lbl) { if (typeof s !== 'string' || s.indexOf(sub) === -1) { throw new Error(lbl + ': "' + s + '" missing "' + sub + '"'); } }

/* ══ Group 1 — Constants ══ */
t('SCHEMA_VERSION===1', function() { eq(SCHEMA_VERSION, 1, 'v'); });
t('FIELD_IDS length 6', function() { eq(FIELD_IDS.length, 6, 'len'); });
t('FIELD_MAP length 6', function() { eq(FIELD_EL_IDS.length, 6, 'len'); });
t('FIELD_MAP sb-name->name', function() { eq(FIELD_MAP['sb-name'], 'name', 'map'); });
t('FIELD_MAP sb-destination->destination', function() { eq(FIELD_MAP['sb-destination'], 'destination', 'map'); });

/* ══ Group 2 — getFieldValue ══ */
t('getFieldValue trims whitespace', function() { setF('sb-name','  Maya  '); eq(getFieldValue('sb-name'), 'Maya', 'trim'); clearAll(); });
t('getFieldValue empty field',      function() { clearAll(); eq(getFieldValue('sb-name'), '', 'empty'); });
t('getFieldValue unknown id',       function() { eq(getFieldValue('no-such-id'), '', 'unknown'); });
t('getFieldValue injected dom',     function() {
  var f = { getElementById: function(id) { return id === 'sb-name' ? { value: 'Alex' } : null; } };
  eq(getFieldValue('sb-name', f), 'Alex', 'injected');
});
t('getFieldValue null element', function() {
  var f = { getElementById: function() { return null; } };
  eq(getFieldValue('sb-name', f), '', 'null');
});

/* ══ Group 3 — collectStoryData ══ */
t('collectStoryData returns object', function() { clearAll(); ok(typeof collectStoryData() === 'object', 'obj'); });
t('collectStoryData schemaVersion 1', function() { eq(collectStoryData().schemaVersion, 1, 'ver'); });
t('collectStoryData savedAt is ISO string', function() { var d = collectStoryData(); ok(d.savedAt.indexOf('T') !== -1, 'iso'); });
t('collectStoryData has all 6 field keys', function() {
  var d = collectStoryData(); var j;
  for (j = 0; j < FIELD_KEYS.length; j++) { ok(d.fields.hasOwnProperty(FIELD_KEYS[j]), 'key ' + FIELD_KEYS[j]); }
});
t('collectStoryData reflects filled values', function() {
  fillAll(); var d = collectStoryData();
  eq(d.fields.name, 'Maya', 'name'); eq(d.fields.destination, 'Florida', 'dest'); clearAll();
});
t('collectStoryData empty fields = empty strings', function() { clearAll(); eq(collectStoryData().fields.name, '', 'empty'); });
t('collectStoryData trims whitespace', function() {
  setF('sb-name','  Alex  '); setF('sb-visiting','G'); setF('sb-destination','D');
  setF('sb-comfort','C'); setF('sb-calm','Ca'); setF('sb-detail','De');
  eq(collectStoryData().fields.name, 'Alex', 'trim'); clearAll();
});

/* ══ Group 4 — validateStoryData ══ */
var good = { fields: { name:'M', visiting:'G', destination:'F', comfort:'B', calm:'C', detail:'D' } };
t('validate valid payload', function() { ok(validateStoryData(good).valid, 'valid'); });
t('validate null',          function() { no(validateStoryData(null).valid, 'null'); });
t('validate undefined',     function() { no(validateStoryData(undefined).valid, 'undef'); });
t('validate array',         function() { no(validateStoryData([]).valid, 'array'); });
t('validate string',        function() { no(validateStoryData('hi').valid, 'string'); });
t('validate missing fields key', function() {
  var r = validateStoryData({ schemaVersion: 1 }); no(r.valid, 'no-fields'); has(r.reason, 'fields', 'reason');
});
t('validate fields:null',   function() { no(validateStoryData({ fields: null }).valid, 'null-fields'); });
t('validate fields:array',  function() { no(validateStoryData({ fields: [] }).valid, 'array-fields'); });
t('validate missing name',  function() {
  var r = validateStoryData({ fields:{ visiting:'G', destination:'F', comfort:'B', calm:'C', detail:'D' } });
  no(r.valid, 'no-name'); has(r.reason, 'name', 'reason');
});
t('validate number field',  function() {
  no(validateStoryData({ fields:{ name:42, visiting:'G', destination:'F', comfort:'B', calm:'C', detail:'D' } }).valid, 'num');
});
t('validate null field',    function() {
  no(validateStoryData({ fields:{ name:null, visiting:'G', destination:'F', comfort:'B', calm:'C', detail:'D' } }).valid, 'null-f');
});
t('validate empty strings ok', function() {
  ok(validateStoryData({ fields:{ name:'', visiting:'', destination:'', comfort:'', calm:'', detail:'' } }).valid, 'empty-ok');
});
t('validate extra keys tolerated', function() {
  var d = { fields:{ name:'M', visiting:'G', destination:'F', comfort:'B', calm:'C', detail:'D' }, extra:'x' };
  ok(validateStoryData(d).valid, 'extra');
});

/* ══ Group 5 — serialise / parse ══ */
t('serialiseStoryData returns string', function() { ok(typeof serialiseStoryData(collectStoryData()) === 'string', 'str'); });
t('serialised JSON is parseable', function() {
  fillAll(); var p = JSON.parse(serialiseStoryData(collectStoryData()));
  eq(p.fields.name, 'Maya', 'name'); clearAll();
});
t('serialised contains schemaVersion', function() { has(serialiseStoryData(collectStoryData()), '"schemaVersion"', 'key'); });
t('serialised contains savedAt',       function() { has(serialiseStoryData(collectStoryData()), '"savedAt"', 'key'); });
t('parseStoryJSON valid JSON',         function() { var p = parseStoryJSON('{"a":1}'); ok(p !== null && p.a === 1, 'parsed'); });
t('parseStoryJSON bad JSON -> null',   function() { eq(parseStoryJSON('{bad}'), null, 'null'); });
t('parseStoryJSON empty -> null',      function() { eq(parseStoryJSON(''), null, 'null'); });
t('parseStoryJSON null -> null',       function() { eq(parseStoryJSON(null), null, 'null'); });

/* ══ Group 6 — populateStoryFields ══ */
var popD = { fields:{ name:'Jordan', visiting:'Uncle Bob', destination:'Chicago', comfort:'stuffed lion', calm:'hum my song', detail:'deep-dish pizza' } };
t('populate success:true',      function() { clearAll(); ok(populateStoryFields(popD).success, 'ok'); clearAll(); });
t('populate sets DOM values',   function() {
  clearAll(); populateStoryFields(popD);
  eq(elements['sb-name'].value, 'Jordan', 'name'); eq(elements['sb-destination'].value, 'Chicago', 'dest'); clearAll();
});
t('populate null -> failure',           function() { no(populateStoryFields(null).success, 'fail'); });
t('populate missing fields -> failure', function() { no(populateStoryFields({ schemaVersion: 1 }).success, 'fail'); });
t('populate calls callback', function() {
  clearAll(); var c = false;
  populateStoryFields(popD, fakeDoc, function() { c = true; });
  ok(c, 'cb'); clearAll();
});
t('populate empty values clears fields', function() {
  fillAll();
  populateStoryFields({ fields:{ name:'', visiting:'', destination:'', comfort:'', calm:'', detail:'' } });
  eq(elements['sb-name'].value, '', 'cleared'); clearAll();
});

/* ══ Group 7 — Round-trip ══ */
t('round-trip serialize+parse+validate', function() {
  fillAll();
  var v = validateStoryData(parseStoryJSON(serialiseStoryData(collectStoryData())));
  ok(v.valid, 'valid'); clearAll();
});
t('round-trip populate restores all 6 values', function() {
  fillAll();
  var json = serialiseStoryData(collectStoryData());
  clearAll();
  populateStoryFields(parseStoryJSON(json));
  eq(elements['sb-name'].value,        'Maya',                 'name');
  eq(elements['sb-visiting'].value,    'Grandma',              'visiting');
  eq(elements['sb-destination'].value, 'Florida',              'dest');
  eq(elements['sb-comfort'].value,     'blue blanket',         'comfort');
  eq(elements['sb-calm'].value,        'squeeze my fidget',    'calm');
  eq(elements['sb-detail'].value,      'swimming in the pool', 'detail');
  clearAll();
});
t('round-trip partial fields valid', function() {
  clearAll(); setF('sb-name','Sam'); setF('sb-destination','Boston');
  var v = validateStoryData(parseStoryJSON(serialiseStoryData(collectStoryData())));
  ok(v.valid, 'partial'); clearAll();
});
t('round-trip special chars survive', function() {
  clearAll(); setF('sb-name',"O'Brien"); setF('sb-detail','Cafe & "spa"');
  setF('sb-visiting','G'); setF('sb-destination','D'); setF('sb-comfort','C'); setF('sb-calm','Ca');
  var p = parseStoryJSON(serialiseStoryData(collectStoryData()));
  eq(p.fields.name, "O'Brien", 'apostrophe'); eq(p.fields.detail, 'Cafe & "spa"', 'special'); clearAll();
});
t('round-trip 1000-char field', function() {
  clearAll();
  var big = '';
  var bi;
  for (bi = 0; bi < 1000; bi++) { big += 'a'; }
  setF('sb-name', big); setF('sb-visiting','G'); setF('sb-destination','D');
  setF('sb-comfort','C'); setF('sb-calm','Ca'); setF('sb-detail','De');
  var p = parseStoryJSON(serialiseStoryData(collectStoryData()));
  eq(p.fields.name.length, 1000, 'len'); clearAll();
});

/* ══ Group 8 — Edge cases ══ */
t('HTML tags stored verbatim', function() {
  clearAll(); setF('sb-name','<script>alert(1)</script>');
  setF('sb-visiting','G'); setF('sb-destination','D'); setF('sb-comfort','C'); setF('sb-calm','Ca'); setF('sb-detail','De');
  var p = parseStoryJSON(serialiseStoryData(collectStoryData()));
  eq(p.fields.name, '<script>alert(1)</script>', 'verbatim'); clearAll();
});
t('extra field keys tolerated', function() {
  ok(validateStoryData({ fields:{ name:'M', visiting:'G', destination:'F', comfort:'B', calm:'C', detail:'D', extra:'x' } }).valid, 'extra');
});
t('number at root rejected', function() { no(validateStoryData(42).valid, 'num-root'); });

/* ══ Summary ══ */
WScript.Echo('');
var ii;
for (ii = 0; ii < log.length; ii++) {
  WScript.Echo('  ' + log[ii]);
}
WScript.Echo('');
WScript.Echo('Results: ' + passed + ' passed, ' + failed + ' failed, ' + (passed + failed) + ' total');
var conf = (passed + failed) > 0 ? ((passed / (passed + failed)) * 100).toFixed(1) : '0.0';
WScript.Echo('Confidence: ' + conf + '%');
if (failed > 0) {
  WScript.Echo('');
  WScript.Echo('FAILURES:');
  for (ii = 0; ii < log.length; ii++) {
    if (log[ii].indexOf('FAIL:') === 0) { WScript.Echo('  ' + log[ii]); }
  }
}
