/**
 * yumyum_pickr — Chrome Extension Content Script
 *
 * Auto-injected on any localhost / 127.0.0.1 tab.
 * Communicates with the VSCode Extension's local server on port 37799.
 */
(function () {
  'use strict';

  var SERVER = 'http://localhost:37799';

  if (window.__yumyum_pickr__) return;
  window.__yumyum_pickr__ = true;

  var pickerActive   = false;
  var lastTarget     = null;
  var lastOutline    = '';
  var lastOutlineOff = '';

  /* ── Styles ──────────────────────────────────────────────────── */
  var style = document.createElement('style');
  style.textContent = [
    '#__yyp_bar__{',
      'position:fixed;bottom:20px;right:20px;z-index:2147483647;',
      'display:flex;align-items:center;gap:10px;',
      'background:#0d0d1a;border:1.5px solid #6366f1;border-radius:14px;',
      'padding:10px 18px;font-family:system-ui,sans-serif;font-size:13px;',
      'color:#e2e8f0;box-shadow:0 4px 32px rgba(99,102,241,.35);',
      'cursor:pointer;user-select:none;transition:box-shadow .2s,background .2s;',
    '}',
    '#__yyp_bar__:hover{background:#12122a;box-shadow:0 4px 40px rgba(99,102,241,.55);}',
    '#__yyp_bar__.yyp-on{background:#6366f1;border-color:#818cf8;color:#fff;}',
    '#__yyp_bar__.yyp-on:hover{background:#4f46e5;}',
    '#__yyp_label__{',
      'position:fixed;pointer-events:none;z-index:2147483647;',
      'background:#6366f1;color:#fff;font-family:monospace;font-size:11px;',
      'padding:3px 8px;border-radius:4px;display:none;',
      'max-width:320px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;',
      'transform:translate(-50%,-100%);margin-top:-6px;',
    '}',
    '#__yyp_toast__{',
      'position:fixed;bottom:74px;right:20px;z-index:2147483647;',
      'background:#10b981;color:#fff;font-family:system-ui,sans-serif;font-size:13px;',
      'padding:10px 16px;border-radius:10px;display:none;',
      'box-shadow:0 4px 20px rgba(16,185,129,.35);',
    '}',
    'body.yyp-picking,body.yyp-picking *{cursor:crosshair!important;}',
  ].join('');
  document.head.appendChild(style);

  /* ── DOM ─────────────────────────────────────────────────────── */
  var bar = document.createElement('div');
  bar.id = '__yyp_bar__';
  bar.innerHTML = '<span id="__yyp_icon__">🎯</span><span id="__yyp_label_text__">Pick Element</span>';
  document.body.appendChild(bar);

  var label = document.createElement('div');
  label.id = '__yyp_label__';
  document.body.appendChild(label);

  var toast = document.createElement('div');
  toast.id = '__yyp_toast__';
  document.body.appendChild(toast);

  /* ── Helpers ─────────────────────────────────────────────────── */
  function showToast(msg, color) {
    toast.textContent = msg;
    toast.style.background = color || '#10b981';
    toast.style.display = 'block';
    clearTimeout(toast._t);
    toast._t = setTimeout(function () { toast.style.display = 'none'; }, 2800);
  }

  function isOurs(node) {
    if (!node) return false;
    var id = node.id || '';
    return id === '__yyp_bar__' || id === '__yyp_label__' || id === '__yyp_toast__' ||
      !!(node.closest && node.closest('#__yyp_bar__'));
  }

  function getCssSelector(el) {
    var parts = [], cur = el;
    while (cur && cur !== document.documentElement) {
      if (cur.id) { parts.unshift('#' + cur.id); break; }
      var tag = cur.tagName.toLowerCase();
      var cls = Array.from(cur.classList).slice(0, 3);
      var sel = tag + (cls.length ? '.' + cls.join('.') : '');
      var parent = cur.parentElement;
      if (parent) {
        var sibs = Array.from(parent.children).filter(function (s) { return s.tagName === cur.tagName; });
        if (sibs.length > 1) sel += ':nth-of-type(' + (sibs.indexOf(cur) + 1) + ')';
      }
      parts.unshift(sel);
      cur = cur.parentElement;
      if (parts.length >= 5) break;
    }
    return parts.join(' > ');
  }

  function getCleanHtml(el) {
    var clone = el.cloneNode(true);
    if (clone.querySelectorAll) clone.querySelectorAll('[id^="__yyp"]').forEach(function (n) { n.remove(); });
    var html = clone.outerHTML || '';
    return html.length > 3000 ? html.slice(0, 3000) + '... [truncated]' : html;
  }

  function getLabelText(el) {
    var tag = el.tagName.toLowerCase();
    var id  = el.id ? '#' + el.id : '';
    var cls = Array.from(el.classList).slice(0, 2).map(function (c) { return '.' + c; }).join('');
    return tag + id + cls;
  }

  /* ── Highlight (outline on element — scroll-proof) ───────────── */
  function applyHighlight(t) {
    if (lastTarget === t) return;
    if (lastTarget) {
      lastTarget.style.outline      = lastOutline;
      lastTarget.style.outlineOffset = lastOutlineOff;
    }
    lastOutline    = t.style.outline;
    lastOutlineOff = t.style.outlineOffset;
    lastTarget     = t;
    t.style.outline       = '2px solid #6366f1';
    t.style.outlineOffset = '2px';
  }

  function clearHighlight() {
    if (lastTarget) {
      lastTarget.style.outline       = lastOutline;
      lastTarget.style.outlineOffset = lastOutlineOff;
    }
    lastTarget = null;
  }

  /* ── Picker Mode ─────────────────────────────────────────────── */
  function activate() {
    pickerActive = true;
    bar.classList.add('yyp-on');
    document.body.classList.add('yyp-picking');
    document.getElementById('__yyp_icon__').textContent = '✕';
    document.getElementById('__yyp_label_text__').textContent = 'Cancel (ESC)';
    document.addEventListener('mousemove', onMouseMove, true);
    document.addEventListener('click',     onClick,     true);
  }

  function deactivate() {
    pickerActive = false;
    bar.classList.remove('yyp-on');
    document.body.classList.remove('yyp-picking');
    document.getElementById('__yyp_icon__').textContent = '🎯';
    document.getElementById('__yyp_label_text__').textContent = 'Pick Element';
    clearHighlight();
    label.style.display = 'none';
    document.removeEventListener('mousemove', onMouseMove, true);
    document.removeEventListener('click',     onClick,     true);
  }

  function onMouseMove(e) {
    var t = document.elementFromPoint(e.clientX, e.clientY);
    if (!t || isOurs(t) || t === document.body || t === document.documentElement) return;
    applyHighlight(t);
    label.textContent   = getLabelText(t);
    label.style.display = 'block';
    label.style.left    = e.clientX + 'px';
    label.style.top     = (e.clientY > 30 ? e.clientY - 14 : e.clientY + 24) + 'px';
  }

  function onClick(e) {
    var t = lastTarget || e.target;
    if (isOurs(t)) return;
    e.preventDefault();
    e.stopImmediatePropagation();

    // Strip outline before capturing HTML
    var so = t.style.outline, soo = t.style.outlineOffset;
    t.style.outline = lastOutline; t.style.outlineOffset = lastOutlineOff;

    var payload = {
      tag:       t.tagName.toLowerCase(),
      id:        t.id || null,
      classes:   Array.from(t.classList),
      selector:  getCssSelector(t),
      html:      getCleanHtml(t),
      innerText: (t.innerText || '').slice(0, 200),
      url:       window.location.href,
      timestamp: Date.now(),
      source:    'chrome-extension',
    };

    t.style.outline = so; t.style.outlineOffset = soo;

    // Build a clean, readable text for the AI chat
    var clipText = [
      '## Selected Element',
      '',
      'Tag: <' + payload.tag + '>',
      'Selector: ' + payload.selector,
      (payload.id ? 'ID: ' + payload.id : ''),
      (payload.classes.length ? 'Classes: ' + payload.classes.join(' ') : ''),
      (payload.innerText ? 'Text: "' + payload.innerText + '"' : ''),
      'URL: ' + payload.url,
      '',
      'HTML:',
      payload.html,
    ].filter(Boolean).join('\n');

    // Copy to clipboard — works in any IDE with Ctrl+V
    navigator.clipboard.writeText(clipText)
      .then(function () {
        showToast('✓ Copied! Paste into your AI chat with Ctrl+V');
      })
      .catch(function () {
        showToast('✗ Clipboard access denied', '#ef4444');
      });

    // Also try sending to local server if running (optional, non-blocking)
    fetch(SERVER + '/select', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      mode: 'cors',
    }).catch(function () { /* server not running — clipboard is enough */ });

    deactivate();
  }

  /* ── Events ──────────────────────────────────────────────────── */
  bar.addEventListener('click', function () { pickerActive ? deactivate() : activate(); });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && pickerActive) deactivate();
    if ((e.altKey || e.metaKey) && e.key === 'p') { e.preventDefault(); pickerActive ? deactivate() : activate(); }
  });

  // Listen for toggle messages from the popup
  chrome.runtime.onMessage.addListener(function (msg) {
    if (msg.type === 'TOGGLE_PICKER') pickerActive ? deactivate() : activate();
    if (msg.type === 'GET_STATUS') return Promise.resolve({ active: pickerActive });
  });

  console.log('[yumyum_pickr] Chrome Extension loaded. Click 🎯 or Alt+P.');
})();
