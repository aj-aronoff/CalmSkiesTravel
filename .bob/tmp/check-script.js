
(function () {
  'use strict';

  /* ── Map hash → tab id ── */
  var HASH_MAP = {
    '#ourstory':     'tab-ourstory',
    '#storybuilder': 'tab-storybuilder',
    '#twovoices':    'tab-twovoices',
    '#journey':      'tab-journey',
    '#socialstories':'tab-socialstories',
    '#helpfulhints': 'tab-helpfulhints',
    '#gobag':        'tab-gobag',
    '#bda':          'tab-bda'
  };

  var tablist  = document.getElementById('main-tablist');
  var tabs     = Array.prototype.slice.call(tablist.querySelectorAll('[role="tab"]'));
  var panels   = Array.prototype.slice.call(document.querySelectorAll('[role="tabpanel"]'));

  /* Return hash for a tab button */
  function hashForTab(btn) {
    return '#' + btn.getAttribute('aria-controls').replace('panel-', '');
  }

  /* Activate a tab by its button element */
  function activateTab(btn) {
    tabs.forEach(function (t) {
      t.setAttribute('aria-selected', 'false');
      t.setAttribute('tabindex', '-1');
    });
    panels.forEach(function (p) { p.classList.remove('active'); });

    btn.setAttribute('aria-selected', 'true');
    btn.setAttribute('tabindex', '0');

    var panelId = btn.getAttribute('aria-controls');
    var panel   = document.getElementById(panelId);
    if (panel) { panel.classList.add('active'); }

    /* Update URL hash — wrapped in try/catch for file:// protocol */
    try {
      history.replaceState(null, '', hashForTab(btn));
    } catch (e) { /* local file — silently ignored */ }
  }

  /* Activate from hash string */
  function activateFromHash(hash) {
    var tabId = HASH_MAP[hash];
    if (!tabId) { return false; }
    var btn = document.getElementById(tabId);
    if (btn) { activateTab(btn); return true; }
    return false;
  }

  /* ── Click handler ── */
  tablist.addEventListener('click', function (e) {
    var btn = e.target.closest('[role="tab"]');
    if (!btn) { return; }
    activateTab(btn);
    btn.focus();
  });

  /* ── Arrow-key navigation ── */
  tablist.addEventListener('keydown', function (e) {
    var btn = e.target.closest('[role="tab"]');
    if (!btn) { return; }
    var idx = tabs.indexOf(btn);
    var next;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      next = tabs[(idx + 1) % tabs.length];
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      next = tabs[(idx - 1 + tabs.length) % tabs.length];
    } else if (e.key === 'Home') {
      next = tabs[0];
    } else if (e.key === 'End') {
      next = tabs[tabs.length - 1];
    }
    if (next) {
      e.preventDefault();
      activateTab(next);
      next.focus();
    }
  });

  /* ── Browser back/forward ── */
  window.addEventListener('popstate', function () {
    activateFromHash(window.location.hash);
  });

  /* ── Initial load from hash ── */
  if (!activateFromHash(window.location.hash)) {
    activateTab(tabs[0]);
  }


  /* ════════════════════════════════════════
     STORY BUILDER — live preview
  ════════════════════════════════════════ */
  var sbFields = ['sb-name','sb-visiting','sb-destination','sb-comfort','sb-calm','sb-detail'];

  function val(id) {
    var el = document.getElementById(id);
    return el ? el.value.trim() : '';
  }

  function ph(text, fallback) {
    return text || ('<span class="placeholder">' + fallback + '</span>');
  }

  function updateStory() {
    var name        = val('sb-name');
    var visiting    = val('sb-visiting');
    var destination = val('sb-destination');
    var comfort     = val('sb-comfort');
    var calm        = val('sb-calm');
    var detail      = val('sb-detail');

    var lines = [
      'I am ' + ph(name,'[child\'s name]') + '. I am going on a trip!',
      'I am flying to ' + ph(destination,'[destination]') + ' to visit ' + ph(visiting,'[who we are visiting]') + '.',
      'Flying is an adventure. I know what is going to happen.',
      'I have my ' + ph(comfort,'[comfort item]') + ' with me the whole time.',
      'When I get to the airport, I will stay close to the person I am with.',
      'Security is like a doorway. I walk through and I am on the other side.',
      'On the plane I will put on my headphones and I can breathe slowly.',
      'If I feel worried, I can ' + ph(calm,'[what helps me feel calm]') + '.',
      'When we land, I will see ' + ph(visiting,'[who we are visiting]') + '!',
      'I am excited about ' + ph(detail,'[one exciting detail]') + '. I did it — I am amazing! ✈'
    ];

    for (var i = 0; i < lines.length; i++) {
      var el = document.getElementById('sc-line' + (i + 1));
      if (el) { el.innerHTML = lines[i]; }
    }
  }

  sbFields.forEach(function (id) {
    var el = document.getElementById(id);
    if (el) { el.addEventListener('input', updateStory); }
  });

  updateStory(); /* populate with placeholder text on load */

}());

