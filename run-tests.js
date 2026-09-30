/**
 * run-tests.js  —  Node.js headless test runner for storybuilder.js
 * Simulates the DOM fixture so all tests can run without a browser.
 *
 * Usage:  node run-tests.js
 * Created by IBM Bob  |  calmskiestravel.com
 */
'use strict';

/* ─── Minimal DOM shim ─── */
var store = {};

function makeInput(id) {
  return {
    _id: id,
    _value: '',
    get value() { return this._value; },
    set value(v) { this._value = v; }
  };
}

var elements = {
  'sb-name':        makeInput('sb-name'),
  'sb-visiting':    makeInput('sb-visiting'),
  'sb-destination': makeInput('sb-destination'),
  'sb-comfort':     makeInput('sb-comfort'),
  'sb-calm':        makeInput('sb-calm'),
  'sb-detail':      makeInput('sb-detail')
};

global.document = {
  getElementById: function(id) { return elements[id] || null; }
};

/* Prevent the module from trying to access window.fetch */
global.window = { fetch: function(){} };

/* ─── Load the module ─── */
var sb = require('./storybuilder.js');
var SCHEMA_VERSION      = sb.SCHEMA_VERSION;
var FIELD_IDS           = sb.FIELD_IDS;
var FIELD_MAP           = sb.FIELD_MAP;
var getFieldValue       = sb.getFieldValue;
var collectStoryData    = sb.collectStoryData;
var validateStoryData   = sb.validateStoryData;
var populateStoryFields = sb.populateStoryFields;
var serialiseStoryData  = sb.serialiseStoryData;
var parseStoryJSON      = sb.parseStoryJSON;
var roundTripStoryData  = sb.roundTripStoryData;

/* ─── Test harness ─── */
var passed = 0, failed = 0;
var failures = [];

function setField(id, value) {
  if (elements[id]) { elements[id].value = value; }
}
function clearAllFields() {
  Object.keys(elements).forEach(function(id) { elements[id].value = ''; });
}
function fillAllFields() {
  setField('sb-name',        'Maya');
  setField('sb-visiting',    'Grandma');
  setField('sb-destination', 'Florida');
  setField('sb-comfort',     'blue blanket');
  setField('sb-calm',        'squeeze my fidget');
  setField('sb-detail',      'swimming in the pool');
}

function test(name, fn) {
  try {
    fn();
    passed++;
    process.stdout.write('  ✅  ' + name + '\n');
  } catch(e) {
    failed++;
    failures.push({ name: name, msg: e.message });
    process.stdout.write('  ❌  ' + name + '\n     ' + e.message + '\n');
  }
}

function assertEqual(a, b, label) {
  if (a !== b) throw new Error(label + ': expected ' + JSON.stringify(b) + ' got ' + JSON.stringify(a));
}
function assertTrue(v, label) {
  if (!v) throw new Error(label + ': expected truthy, got ' + JSON.stringify(v));
}
function assertFalse(v, label) {
  if (v) throw new Error(label + ': expected falsy, got ' + JSON.stringify(v));
}
function assertContains(str, sub, label) {
  if (typeof str !== 'string' || str.indexOf(sub) === -1)
    throw new Error(label + ': "' + str + '" should contain "' + sub + '"');
}

/* ══ GROUP 1 — Constants ══ */
console.log('\nGroup 1 — Schema Constants');
test('SCHEMA_VERSION is 1', function() { assertEqual(SCHEMA_VERSION, 1, 'version'); });
test('FIELD_IDS has 6 entries', function() { assertEqual(FIELD_IDS.length, 6, 'length'); });
test('FIELD_MAP has 6 entries', function() { assertEqual(Object.keys(FIELD_MAP).length, 6, 'length'); });
test('FIELD_MAP sb-name → name', function() { assertEqual(FIELD_MAP['sb-name'], 'name', 'map'); });
test('FIELD_MAP sb-destination → destination', function() { assertEqual(FIELD_MAP['sb-destination'], 'destination', 'map'); });

/* ══ GROUP 2 — getFieldValue ══ */
console.log('\nGroup 2 — getFieldValue');
test('returns trimmed value', function() {
  setField('sb-name', '  Maya  ');
  assertEqual(getFieldValue('sb-name'), 'Maya', 'trimmed');
  clearAllFields();
});
test('returns empty string for empty field', function() {
  clearAllFields();
  assertEqual(getFieldValue('sb-name'), '', 'empty');
});
test('returns empty string for unknown ID', function() {
  assertEqual(getFieldValue('no-such-id'), '', 'unknown');
});
test('works with injected domLookup', function() {
  var fake = { getElementById: function(id) { return id==='sb-name' ? {value:'Alex'} : null; }};
  assertEqual(getFieldValue('sb-name', fake), 'Alex', 'injected');
});
test('returns empty when injected dom returns null', function() {
  var fake = { getElementById: function() { return null; }};
  assertEqual(getFieldValue('sb-name', fake), '', 'null el');
});

/* ══ GROUP 3 — collectStoryData ══ */
console.log('\nGroup 3 — collectStoryData');
test('returns an object', function() {
  clearAllFields();
  assertTrue(typeof collectStoryData() === 'object', 'is object');
});
test('schemaVersion === 1', function() {
  assertEqual(collectStoryData().schemaVersion, 1, 'version');
});
test('savedAt is ISO string with T', function() {
  var d = collectStoryData();
  assertTrue(typeof d.savedAt === 'string' && d.savedAt.indexOf('T') !== -1, 'iso');
});
test('has all 6 field keys', function() {
  var d = collectStoryData();
  ['name','visiting','destination','comfort','calm','detail'].forEach(function(k) {
    assertTrue(Object.prototype.hasOwnProperty.call(d.fields, k), 'key '+k);
  });
});
test('reflects filled values', function() {
  fillAllFields();
  var d = collectStoryData();
  assertEqual(d.fields.name, 'Maya', 'name');
  assertEqual(d.fields.destination, 'Florida', 'destination');
  clearAllFields();
});
test('trims whitespace', function() {
  setField('sb-name', '  Alex  ');
  setField('sb-visiting','G'); setField('sb-destination','D');
  setField('sb-comfort','C'); setField('sb-calm','Ca'); setField('sb-detail','De');
  assertEqual(collectStoryData().fields.name, 'Alex', 'trimmed');
  clearAllFields();
});
test('empty fields are empty strings', function() {
  clearAllFields();
  assertEqual(collectStoryData().fields.name, '', 'empty name');
});

/* ══ GROUP 4 — validateStoryData ══ */
console.log('\nGroup 4 — validateStoryData');
var goodPayload = { fields:{ name:'M', visiting:'G', destination:'F', comfort:'B', calm:'C', detail:'D' }};
test('valid payload → valid:true', function() {
  assertTrue(validateStoryData(goodPayload).valid, 'valid');
});
test('null → valid:false', function() {
  assertFalse(validateStoryData(null).valid, 'null');
});
test('undefined → valid:false', function() {
  assertFalse(validateStoryData(undefined).valid, 'undefined');
});
test('array → valid:false', function() {
  assertFalse(validateStoryData([]).valid, 'array');
});
test('string → valid:false', function() {
  assertFalse(validateStoryData('hello').valid, 'string');
});
test('missing fields key → valid:false, reason mentions fields', function() {
  var r = validateStoryData({ schemaVersion:1 });
  assertFalse(r.valid, 'no fields'); assertContains(r.reason,'fields','reason');
});
test('fields:null → valid:false', function() {
  assertFalse(validateStoryData({ fields:null }).valid, 'null fields');
});
test('fields:array → valid:false', function() {
  assertFalse(validateStoryData({ fields:[] }).valid, 'array fields');
});
test('missing name → valid:false', function() {
  var r = validateStoryData({ fields:{ visiting:'G', destination:'F', comfort:'B', calm:'C', detail:'D' }});
  assertFalse(r.valid,'no name'); assertContains(r.reason,'name','reason');
});
test('number field value → valid:false', function() {
  assertFalse(validateStoryData({ fields:{ name:42, visiting:'G', destination:'F', comfort:'B', calm:'C', detail:'D' }}).valid, 'number');
});
test('null field value → valid:false', function() {
  assertFalse(validateStoryData({ fields:{ name:null, visiting:'G', destination:'F', comfort:'B', calm:'C', detail:'D' }}).valid, 'null field');
});
test('empty string fields → valid:true', function() {
  assertTrue(validateStoryData({ fields:{ name:'', visiting:'', destination:'', comfort:'', calm:'', detail:'' }}).valid, 'empty ok');
});
test('extra keys in payload are tolerated', function() {
  var d = Object.assign({}, goodPayload, { extra:'ignored' });
  assertTrue(validateStoryData(d).valid, 'extra key');
});

/* ══ GROUP 5 — serialise / parse ══ */
console.log('\nGroup 5 — serialiseStoryData & parseStoryJSON');
test('serialiseStoryData returns string', function() {
  assertTrue(typeof serialiseStoryData(collectStoryData()) === 'string', 'string');
});
test('serialised JSON is parseable', function() {
  fillAllFields();
  var json = serialiseStoryData(collectStoryData());
  var p = JSON.parse(json);
  assertEqual(p.fields.name, 'Maya', 'name');
  clearAllFields();
});
test('serialised JSON contains schemaVersion', function() {
  assertContains(serialiseStoryData(collectStoryData()), '"schemaVersion"', 'key');
});
test('serialised JSON contains savedAt', function() {
  assertContains(serialiseStoryData(collectStoryData()), '"savedAt"', 'key');
});
test('parseStoryJSON returns object for valid JSON', function() {
  var p = parseStoryJSON('{"schemaVersion":1,"fields":{}}');
  assertTrue(p !== null && typeof p === 'object', 'parsed');
});
test('parseStoryJSON returns null for invalid JSON', function() {
  assertEqual(parseStoryJSON('{bad}'), null, 'bad json');
});
test('parseStoryJSON returns null for empty string', function() {
  assertEqual(parseStoryJSON(''), null, 'empty');
});
test('parseStoryJSON handles null input', function() {
  var r = parseStoryJSON(null);
  assertTrue(r === null || r === null, 'null in');
});

/* ══ GROUP 6 — populateStoryFields ══ */
console.log('\nGroup 6 — populateStoryFields');
var popData = { fields:{ name:'Jordan', visiting:'Uncle Bob', destination:'Chicago',
                          comfort:'stuffed lion', calm:'hum my song', detail:'deep-dish pizza' }};
test('returns success:true for valid data', function() {
  clearAllFields();
  assertTrue(populateStoryFields(popData).success, 'success');
  clearAllFields();
});
test('sets DOM field values correctly', function() {
  clearAllFields();
  populateStoryFields(popData);
  assertEqual(elements['sb-name'].value, 'Jordan', 'name set');
  assertEqual(elements['sb-destination'].value, 'Chicago', 'dest set');
  clearAllFields();
});
test('returns failure for null data', function() {
  assertFalse(populateStoryFields(null).success, 'null fails');
});
test('returns failure for data without fields', function() {
  assertFalse(populateStoryFields({ schemaVersion:1 }).success, 'no fields fails');
});
test('calls updateFn callback', function() {
  clearAllFields();
  var called = false;
  populateStoryFields(popData, document, function(){ called = true; });
  assertTrue(called, 'callback called');
  clearAllFields();
});
test('works with injected domLookup', function() {
  var written = {};
  var fake = { getElementById: function(id) {
    return { set value(v){ written[id]=v; }, get value(){ return written[id]||''; }};
  }};
  assertTrue(populateStoryFields(popData, fake).success, 'success with fake dom');
  assertEqual(written['sb-name'], 'Jordan', 'fake dom written');
});
test('empty field values clear existing values', function() {
  fillAllFields();
  populateStoryFields({ fields:{ name:'', visiting:'', destination:'', comfort:'', calm:'', detail:'' }});
  assertEqual(elements['sb-name'].value, '', 'cleared');
  clearAllFields();
});

/* ══ GROUP 7 — Round-trip ══ */
console.log('\nGroup 7 — Full Round-Trip');
test('data survives serialise → parse → validate', function() {
  fillAllFields();
  var v = validateStoryData(parseStoryJSON(serialiseStoryData(collectStoryData())));
  assertTrue(v.valid, 'valid'); clearAllFields();
});
test('populate after serialise restores all 6 values', function() {
  fillAllFields();
  var json = serialiseStoryData(collectStoryData());
  clearAllFields();
  populateStoryFields(parseStoryJSON(json));
  assertEqual(elements['sb-name'].value,        'Maya',                 'name');
  assertEqual(elements['sb-visiting'].value,    'Grandma',              'visiting');
  assertEqual(elements['sb-destination'].value, 'Florida',              'dest');
  assertEqual(elements['sb-comfort'].value,     'blue blanket',         'comfort');
  assertEqual(elements['sb-calm'].value,        'squeeze my fidget',    'calm');
  assertEqual(elements['sb-detail'].value,      'swimming in the pool', 'detail');
  clearAllFields();
});
test('roundTripStoryData helper returns validated object', function() {
  fillAllFields();
  var r = roundTripStoryData();
  assertTrue(r !== null && r.fields.name === 'Maya', 'round-trip'); clearAllFields();
});
test('partial fields produce valid JSON', function() {
  clearAllFields();
  setField('sb-name','Sam'); setField('sb-destination','Boston');
  setField('sb-visiting',''); setField('sb-comfort',''); setField('sb-calm',''); setField('sb-detail','');
  var v = validateStoryData(parseStoryJSON(serialiseStoryData(collectStoryData())));
  assertTrue(v.valid, 'partial valid'); clearAllFields();
});
test('special characters survive round-trip', function() {
  clearAllFields();
  setField('sb-name',"O'Brien"); setField('sb-detail','Café & "spa"');
  setField('sb-visiting','G'); setField('sb-destination','D'); setField('sb-comfort','C'); setField('sb-calm','Ca');
  var p = parseStoryJSON(serialiseStoryData(collectStoryData()));
  assertEqual(p.fields.name,"O'Brien",'apostrophe');
  assertEqual(p.fields.detail,'Café & "spa"','special');
  clearAllFields();
});
test('emoji survive round-trip', function() {
  clearAllFields();
  setField('sb-name','Zoë ✈'); setField('sb-visiting','Abuela 💙');
  setField('sb-destination','Puerto Rico'); setField('sb-comfort','🧸');
  setField('sb-calm','breathe'); setField('sb-detail','beach');
  var p = parseStoryJSON(serialiseStoryData(collectStoryData()));
  assertEqual(p.fields.name,'Zoë ✈','emoji name');
  clearAllFields();
});
test('1000-char field survives round-trip', function() {
  clearAllFields();
  var big = new Array(1001).join('a');
  setField('sb-name',big); setField('sb-visiting','G'); setField('sb-destination','D');
  setField('sb-comfort','C'); setField('sb-calm','Ca'); setField('sb-detail','De');
  var p = parseStoryJSON(serialiseStoryData(collectStoryData()));
  assertEqual(p.fields.name.length, 1000, 'length');
  clearAllFields();
});

/* ══ GROUP 8 — Edge cases ══ */
console.log('\nGroup 8 — Edge Cases & Security');
test('HTML tags stored verbatim as plain string', function() {
  clearAllFields();
  setField('sb-name','<script>alert(1)</script>');
  setField('sb-visiting','G'); setField('sb-destination','D');
  setField('sb-comfort','C'); setField('sb-calm','Ca'); setField('sb-detail','De');
  var p = parseStoryJSON(serialiseStoryData(collectStoryData()));
  assertEqual(p.fields.name,'<script>alert(1)</script>','verbatim');
  clearAllFields();
});
test('extra keys in fields are tolerated', function() {
  var d = { fields:{ name:'M', visiting:'G', destination:'F', comfort:'B', calm:'C', detail:'D', extra:'x' }};
  assertTrue(validateStoryData(d).valid, 'extra field ok');
});
test('validateStoryData rejects number at root', function() {
  assertFalse(validateStoryData(42).valid, 'number root');
});

/* ══ GROUP 9 — XSS Safety (serialisation layer) ══ */
console.log('\nGroup 9 — XSS Safety (serialisation layer)');
test('<script> tag survives round-trip as literal string', function() {
  clearAllFields();
  setField('sb-name','<script>alert(1)</script>');
  setField('sb-visiting','G'); setField('sb-destination','D');
  setField('sb-comfort','C'); setField('sb-calm','Ca'); setField('sb-detail','De');
  var p = parseStoryJSON(serialiseStoryData(collectStoryData()));
  assertEqual(p.fields.name,'<script>alert(1)</script>','script tag verbatim');
  clearAllFields();
});
test('<img onerror> payload survives round-trip as literal string', function() {
  clearAllFields();
  setField('sb-name','<img src=x onerror=alert(1)>');
  setField('sb-visiting','G'); setField('sb-destination','D');
  setField('sb-comfort','C'); setField('sb-calm','Ca'); setField('sb-detail','De');
  var p = parseStoryJSON(serialiseStoryData(collectStoryData()));
  assertEqual(p.fields.name,'<img src=x onerror=alert(1)>','img onerror verbatim');
  clearAllFields();
});
test('ampersand and angle brackets survive round-trip verbatim', function() {
  clearAllFields();
  setField('sb-name','Tom & Jerry <best>');
  setField('sb-visiting','G'); setField('sb-destination','D');
  setField('sb-comfort','C'); setField('sb-calm','Ca'); setField('sb-detail','De');
  var p = parseStoryJSON(serialiseStoryData(collectStoryData()));
  assertEqual(p.fields.name,'Tom & Jerry <best>','ampersand and angle brackets');
  clearAllFields();
});
test('javascript: URI survives round-trip as literal string', function() {
  clearAllFields();
  setField('sb-visiting','javascript:alert(1)');
  setField('sb-name','N'); setField('sb-destination','D');
  setField('sb-comfort','C'); setField('sb-calm','Ca'); setField('sb-detail','De');
  var p = parseStoryJSON(serialiseStoryData(collectStoryData()));
  assertEqual(p.fields.visiting,'javascript:alert(1)','js uri verbatim');
  clearAllFields();
});
test('XSS payload in every field survives round-trip', function() {
  clearAllFields();
  var xss = '"><script>x</script>';
  setField('sb-name',xss); setField('sb-visiting',xss); setField('sb-destination',xss);
  setField('sb-comfort',xss); setField('sb-calm',xss); setField('sb-detail',xss);
  var p = parseStoryJSON(serialiseStoryData(collectStoryData()));
  Object.values(p.fields).forEach(function(v) {
    assertEqual(v, xss, 'all fields verbatim');
  });
  clearAllFields();
});
test('populateStoryFields sets values from XSS payload without executing', function() {
  clearAllFields();
  var payload = { fields:{ name:'<script>bad()</script>', visiting:'<b>bold</b>',
    destination:'D', comfort:'C', calm:'Ca', detail:'De' }};
  var result = populateStoryFields(payload);
  assertEqual(result.success, true, 'success');
  assertEqual(elements['sb-name'].value, '<script>bad()</script>', 'name stored as text');
  assertEqual(elements['sb-visiting'].value, '<b>bold</b>', 'visiting stored as text');
  clearAllFields();
});

/* ══ SUMMARY ══ */
var total = passed + failed;
var confidence = total > 0 ? ((passed / total) * 100).toFixed(1) : '0.0';
console.log('\n══════════════════════════════════════');
console.log('Results: ' + passed + ' passed, ' + failed + ' failed, ' + total + ' total');
console.log('Confidence: ' + confidence + '%');
console.log('══════════════════════════════════════');

if (failures.length > 0) {
  console.log('\nFailed tests:');
  failures.forEach(function(f) { console.log('  • ' + f.name + '\n    ' + f.msg); });
}

process.exit(failed > 0 ? 1 : 0);
