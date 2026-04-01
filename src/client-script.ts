/**
 * Returns the browser-side picker script as a self-contained IIFE string.
 * This script is injected into the user's dev server HTML by the plugins.
 */
export function getClientScript(port: number): string {
  return `(function () {
  'use strict';

  var SERVER = 'http://localhost:${port}';

  // Prevent double injection
  if (window.__yumyum_pickr__) return;
  window.__yumyum_pickr__ = true;

  var pickerActive = false;
  var lastTarget = null;

  /* ── Styles ─────────────────────────────────────────────────── */
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
    '#__yyp_icon__{font-size:16px;line-height:1;}',
    '#__yyp_overlay__{',
      'position:fixed;pointer-events:none;z-index:2147483646;',
      'border:2px solid #6366f1;background:rgba(99,102,241,.1);',
      'border-radius:3px;display:none;box-sizing:border-box;transition:all .05s;',
    '}',
    '#__yyp_label__{',
      'position:fixed;pointer-events:none;z-index:2147483647;',
      'background:#6366f1;color:#fff;font-family:monospace;font-size:11px;',
      'padding:3px 8px;border-radius:4px;display:none;',
      'max-width:320px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;',
    '}',
    '#__yyp_toast__{',
      'position:fixed;bottom:74px;right:20px;z-index:2147483647;',
      'background:#10b981;color:#fff;font-family:system-ui,sans-serif;font-size:13px;',
      'padding:10px 16px;border-radius:10px;display:none;',
      'box-shadow:0 4px 20px rgba(16,185,129,.35);',
      'animation:yyp-in .2s ease;',
    '}',
    '@keyframes yyp-in{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}',
    'body.yyp-picking *{cursor:crosshair!important;}',
  ].join('');
  document.head.appendChild(style);

  /* ── DOM ─────────────────────────────────────────────────────── */
  function el(id) { return document.getElementById(id); }

  var bar = document.createElement('div');
  bar.id = '__yyp_bar__';
  bar.innerHTML = '<span id="__yyp_icon__">🎯</span><span id="__yyp_label_text__">Pick Element</span>';
  document.body.appendChild(bar);

  var overlay = document.createElement('div');
  overlay.id = '__yyp_overlay__';
  document.body.appendChild(overlay);

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
    return node && (
      node.id === '__yyp_bar__' ||
      node.id === '__yyp_overlay__' ||
      node.id === '__yyp_label__' ||
      node.id === '__yyp_toast__' ||
      (node.closest && node.closest('#__yyp_bar__'))
    );
  }

  function getCssSelector(el) {
    var parts = [];
    var cur = el;
    while (cur && cur !== document.documentElement) {
      if (cur.id) {
        parts.unshift('#' + cur.id);
        break;
      }
      var tag = cur.tagName.toLowerCase();
      var cls = Array.from(cur.classList)
        .filter(function (c) { return !c.startsWith('yyp-'); })
        .slice(0, 3);
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
    if (clone.querySelectorAll) {
      clone.querySelectorAll('[id^="__yyp"]').forEach(function (n) { n.remove(); });
    }
    var html = clone.outerHTML || '';
    return html.length > 3000 ? html.slice(0, 3000) + '... [truncated]' : html;
  }

  function getLabelText(el) {
    var tag = el.tagName.toLowerCase();
    var id = el.id ? '#' + el.id : '';
    var cls = Array.from(el.classList)
      .filter(function (c) { return !c.startsWith('yyp-'); })
      .slice(0, 2)
      .map(function (c) { return '.' + c; })
      .join('');
    return tag + id + cls;
  }

  /* ── Picker Mode ─────────────────────────────────────────────── */
  function activate() {
    pickerActive = true;
    bar.classList.add('yyp-on');
    document.body.classList.add('yyp-picking');
    el('__yyp_icon__').textContent = '✕';
    el('__yyp_label_text__').textContent = 'Cancel (ESC)';
    document.addEventListener('mouseover', onHover, true);
    document.addEventListener('click', onClick, true);
  }

  function deactivate() {
    pickerActive = false;
    bar.classList.remove('yyp-on');
    document.body.classList.remove('yyp-picking');
    el('__yyp_icon__').textContent = '🎯';
    el('__yyp_label_text__').textContent = 'Pick Element';
    overlay.style.display = 'none';
    label.style.display = 'none';
    document.removeEventListener('mouseover', onHover, true);
    document.removeEventListener('click', onClick, true);
  }

  function onHover(e) {
    var t = e.target;
    if (isOurs(t)) return;
    lastTarget = t;

    var r = t.getBoundingClientRect();
    overlay.style.cssText += [
      ';display:block',
      ';top:' + (r.top + window.scrollY) + 'px',
      ';left:' + (r.left + window.scrollX) + 'px',
      ';width:' + r.width + 'px',
      ';height:' + r.height + 'px',
    ].join('');

    var labelText = getLabelText(t);
    label.textContent = labelText;
    label.style.display = 'block';
    var labelTop = r.top + window.scrollY - 26;
    label.style.top = (labelTop < 0 ? r.bottom + window.scrollY + 4 : labelTop) + 'px';
    label.style.left = (r.left + window.scrollX) + 'px';
  }

  function onClick(e) {
    if (isOurs(e.target)) return;
    e.preventDefault();
    e.stopImmediatePropagation();

    var t = e.target;
    var payload = {
      tag: t.tagName.toLowerCase(),
      id: t.id || null,
      classes: Array.from(t.classList).filter(function (c) { return !c.startsWith('yyp-'); }),
      selector: getCssSelector(t),
      html: getCleanHtml(t),
      innerText: (t.innerText || '').slice(0, 200),
      url: window.location.href,
      timestamp: Date.now(),
    };

    fetch(SERVER + '/select', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      mode: 'cors',
    })
    .then(function (r) {
      if (r.ok) {
        showToast('✓ Element captured — use get_selected_element in AI chat');
      } else {
        showToast('✗ Server error', '#ef4444');
      }
    })
    .catch(function () {
      showToast('✗ Cannot reach yumyum_pickr server (port ${port})', '#ef4444');
    });

    deactivate();
  }

  /* ── Events ──────────────────────────────────────────────────── */
  bar.addEventListener('click', function () {
    pickerActive ? deactivate() : activate();
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && pickerActive) deactivate();
    if ((e.altKey || e.metaKey) && e.key === 'p') { e.preventDefault(); pickerActive ? deactivate() : activate(); }
  });

  console.log('[yumyum_pickr] Loaded. Click 🎯 or press Alt+P to pick an element.');
})();`.replace(/\${port}/g, String(port));
}
