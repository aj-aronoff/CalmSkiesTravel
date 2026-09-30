/**
 * test-links.js — Calm Skies Travel
 * Link checker for the Resources & References tab.
 *
 * Checks every URL in the References tab with an HTTP HEAD request,
 * following redirects. Exits with code 0 if all links pass, 1 if any fail.
 *
 * Usage:  node test-links.js
 *
 * Requirements: Node.js built-in modules only (https, http). No npm install needed.
 * Created by IBM Bob  |  calmskiestravel.com
 */
'use strict';

var https = require('https');
var http  = require('http');
var url   = require('url');

/* ─────────────────────────────────────────────────────────────────
   LINKS — must exactly match the URLs in index.html panel-references
   Update this list whenever the References tab changes.
───────────────────────────────────────────────────────────────── */
var LINKS = [
  /* Tier 1 — U.S. Government */
  { label: 'TSA Cares — Passenger Support Program',  url: 'https://www.tsa.gov/travel/passenger-support' },
  { label: 'TSA Cares — Request Assistance Form',    url: 'https://www.tsa.gov/contact-center/form/cares' },
  { label: 'TSA PreCheck',                           url: 'https://www.tsa.gov/precheck' },
  { label: 'TSA — What Can I Bring?',                url: 'https://www.tsa.gov/travel/security-screening/whatcanibring/all' },

  /* Tier 2 — Airlines */
  { label: 'American Airlines — Special Assistance', url: 'https://www.aa.com/i18n/travel-info/special-assistance/special-assistance.jsp' },
  { label: 'Delta Air Lines — Need Help?',           url: 'https://www.delta.com/us/en/need-help/overview' },
  { label: 'Southwest Airlines — Customers with Disabilities', url: 'https://www.southwest.com/html/customer-service/unique-travel-needs/customers-with-disabilities-pol.html' },

  /* Tier 3 — Organisations */
  { label: 'Hidden Disabilities Sunflower — US',     url: 'https://hdsunflower.com/us/' },
  { label: 'Wings for Autism / Wings for All',       url: 'https://thearc.org/our-initiatives/travel/' },
  { label: 'Autism Speaks — Travel Safety Tips',     url: 'https://www.autismspeaks.org/tool-kit/travel-safety-tips' },
  { label: 'Autism Society of America',              url: 'https://autismsociety.org' },
  { label: 'Social Stories — Carol Gray',            url: 'https://carolgraysocialstories.com/social-stories' }
];

/* ─────────────────────────────────────────────────────────────────
   HTTP HEAD with redirect following (up to maxRedirects hops)
───────────────────────────────────────────────────────────────── */
var USER_AGENT  = 'Mozilla/5.0 (compatible; CalmSkiesTravelLinkChecker/1.0)';
var MAX_REDIRECTS = 5;
var TIMEOUT_MS    = 15000;

function checkUrl(targetUrl, redirectsLeft, callback) {
  var parsed   = url.parse(targetUrl);
  var lib      = parsed.protocol === 'https:' ? https : http;
  var options  = {
    hostname: parsed.hostname,
    path:     parsed.path || '/',
    method:   'HEAD',
    headers:  { 'User-Agent': USER_AGENT },
    timeout:  TIMEOUT_MS
  };

  var req = lib.request(options, function (res) {
    var status = res.statusCode;

    /* Follow 3xx redirects */
    if (status >= 300 && status < 400 && res.headers.location) {
      if (redirectsLeft <= 0) {
        return callback(null, 'TOO_MANY_REDIRECTS', targetUrl);
      }
      var location = res.headers.location;
      /* Handle relative redirects */
      if (location.indexOf('http') !== 0) {
        location = parsed.protocol + '//' + parsed.hostname + location;
      }
      /* Drain before following */
      res.resume();
      return checkUrl(location, redirectsLeft - 1, callback);
    }

    res.resume();
    callback(null, status, targetUrl);
  });

  req.on('timeout', function () {
    req.destroy();
    callback(new Error('TIMEOUT'), null, targetUrl);
  });

  req.on('error', function (err) {
    callback(err, null, targetUrl);
  });

  req.end();
}

/* ─────────────────────────────────────────────────────────────────
   Run checks sequentially and print results
───────────────────────────────────────────────────────────────── */
var passed = 0;
var failed = 0;
var index  = 0;

console.log('\nCalm Skies Travel — Link Checker');
console.log('Checking ' + LINKS.length + ' URLs...\n');

function runNext() {
  if (index >= LINKS.length) {
    /* Summary */
    console.log('\n══════════════════════════════════════════════');
    console.log('Results: ' + passed + ' passed, ' + failed + ' failed, ' + LINKS.length + ' total');
    console.log('══════════════════════════════════════════════');
    if (failed > 0) {
      console.log('\n⚠️  ' + failed + ' link(s) failed. Update the References tab before deploying.');
    } else {
      console.log('\n✅  All links verified.');
    }
    process.exit(failed > 0 ? 1 : 0);
    return;
  }

  var entry = LINKS[index];
  index++;

  checkUrl(entry.url, MAX_REDIRECTS, function (err, status, finalUrl) {
    var ok = !err && typeof status === 'number' && status >= 200 && status < 400;

    if (ok) {
      passed++;
      console.log('  ✅  ' + status + '  ' + entry.url);
      if (finalUrl !== entry.url) {
        console.log('       ↳ redirected to ' + finalUrl);
      }
    } else {
      failed++;
      var detail = err ? err.message : String(status);
      console.log('  ❌  ' + detail + '  ' + entry.url);
      console.log('       Label: ' + entry.label);
    }

    runNext();
  });
}

runNext();
