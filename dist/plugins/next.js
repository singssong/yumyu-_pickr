/* yumyum_pickr - Visual element picker for AI-assisted dev */

// src/server.ts
import fs from "fs";
import http from "http";
import path from "path";

// src/client-script.ts
function getClientScript(port) {
  return `(function () {
  'use strict';

  var SERVER = 'http://localhost:${port}';

  if (window.__yumyum_pickr__) return;
  window.__yumyum_pickr__ = true;

  var pickerActive = false;
  var lastTarget   = null;
  var lastOutline  = '';
  var lastOutlineOffset = '';

  /* \u2500\u2500 Styles \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */
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
    /* Label follows the cursor \u2014 no element coordinate math needed */
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

  /* \u2500\u2500 DOM \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */
  var bar = document.createElement('div');
  bar.id = '__yyp_bar__';
  bar.innerHTML = '<span id="__yyp_icon__">\u{1F3AF}</span><span id="__yyp_label_text__">Pick Element</span>';
  document.body.appendChild(bar);

  var label = document.createElement('div');
  label.id = '__yyp_label__';
  document.body.appendChild(label);

  var toast = document.createElement('div');
  toast.id = '__yyp_toast__';
  document.body.appendChild(toast);

  /* \u2500\u2500 Helpers \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */
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
    var parts = [];
    var cur = el;
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
    if (clone.querySelectorAll) {
      clone.querySelectorAll('[id^="__yyp"]').forEach(function (n) { n.remove(); });
    }
    var html = clone.outerHTML || '';
    return html.length > 3000 ? html.slice(0, 3000) + '... [truncated]' : html;
  }

  function getLabelText(el) {
    var tag = el.tagName.toLowerCase();
    var id  = el.id ? '#' + el.id : '';
    var cls = Array.from(el.classList).slice(0, 2).map(function (c) { return '.' + c; }).join('');
    return tag + id + cls;
  }

  /* \u2500\u2500 Highlight: outline on the element itself \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
     No coordinate math \u2014 the browser renders it in exactly the
     right place regardless of scroll or CSS transforms.          */
  function applyHighlight(t) {
    if (lastTarget === t) return;

    // Restore previous element
    if (lastTarget) {
      lastTarget.style.outline      = lastOutline;
      lastTarget.style.outlineOffset = lastOutlineOffset;
    }

    lastOutline       = t.style.outline;
    lastOutlineOffset = t.style.outlineOffset;
    lastTarget        = t;

    t.style.outline      = '2px solid #6366f1';
    t.style.outlineOffset = '2px';
  }

  function clearHighlight() {
    if (lastTarget) {
      lastTarget.style.outline       = lastOutline;
      lastTarget.style.outlineOffset = lastOutlineOffset;
    }
    lastTarget = null;
  }

  /* \u2500\u2500 Picker Mode \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */
  function activate() {
    pickerActive = true;
    bar.classList.add('yyp-on');
    document.body.classList.add('yyp-picking');
    document.getElementById('__yyp_icon__').textContent = '\u2715';
    document.getElementById('__yyp_label_text__').textContent = 'Cancel (ESC)';
    document.addEventListener('mousemove', onMouseMove, true);
    document.addEventListener('click',     onClick,     true);
  }

  function deactivate() {
    pickerActive = false;
    bar.classList.remove('yyp-on');
    document.body.classList.remove('yyp-picking');
    document.getElementById('__yyp_icon__').textContent = '\u{1F3AF}';
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

    /* Label follows cursor \u2014 position:fixed at cursor coords.
       No element getBoundingClientRect() needed at all.        */
    label.textContent   = getLabelText(t);
    label.style.display = 'block';
    label.style.left    = e.clientX + 'px';
    var top = e.clientY - 14;
    label.style.top     = (top < 20 ? e.clientY + 24 : top) + 'px';
  }

  function onClick(e) {
    var t = lastTarget || e.target;
    if (isOurs(t)) return;
    e.preventDefault();
    e.stopImmediatePropagation();

    // Remove our outline before cloning so it doesn't appear in captured HTML
    var savedOutline       = t.style.outline;
    var savedOutlineOffset = t.style.outlineOffset;
    t.style.outline        = lastOutline;
    t.style.outlineOffset  = lastOutlineOffset;

    var payload = {
      tag:      t.tagName.toLowerCase(),
      id:       t.id || null,
      classes:  Array.from(t.classList),
      selector: getCssSelector(t),
      html:     getCleanHtml(t),
      innerText:(t.innerText || '').slice(0, 200),
      url:      window.location.href,
      timestamp:Date.now(),
    };

    // Restore (deactivate will also clear, but be safe)
    t.style.outline       = savedOutline;
    t.style.outlineOffset = savedOutlineOffset;

    // Build readable text for AI chat
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
    ].filter(Boolean).join('
');

    // Copy to clipboard first \u2014 works in any IDE
    navigator.clipboard.writeText(clipText).catch(function () {});

    // Also send to local server for MCP / JSON file
    fetch(SERVER + '/select', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      mode: 'cors',
    })
    .then(function (res) {
      if (res.ok) showToast('\u2713 Copied! Paste into AI chat with Ctrl+V');
      else showToast('\u2713 Copied! Paste into AI chat with Ctrl+V');
    })
    .catch(function () {
      showToast('\u2713 Copied! Paste into AI chat with Ctrl+V');
    });

    deactivate();
  }

  /* \u2500\u2500 Global events \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */
  bar.addEventListener('click', function () {
    pickerActive ? deactivate() : activate();
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && pickerActive) deactivate();
    if ((e.altKey || e.metaKey) && e.key === 'p') {
      e.preventDefault();
      pickerActive ? deactivate() : activate();
    }
  });

  console.log('[yumyum_pickr] Loaded. Click \u{1F3AF} or press Alt+P to pick an element.');
})();`.replace(/\${port}/g, String(port));
}

// src/server.ts
var _server = null;
var _selection = null;
var _projectRoot = process.cwd();
var _port = 37799;
async function startServer(options = {}) {
  if (_server) return;
  _port = options.port ?? 37799;
  _projectRoot = options.projectRoot ?? process.cwd();
  return new Promise((resolve) => {
    _server = http.createServer(handleRequest);
    _server.on("error", (err) => {
      if (err.code === "EADDRINUSE") {
        _server = null;
      } else {
        console.error("[yumyum_pickr] Server error:", err.message);
      }
      resolve();
    });
    _server.listen(_port, "127.0.0.1", () => {
      console.log(`
[yumyum_pickr] \u{1F3AF} Dev server running on http://localhost:${_port}`);
      console.log(`[yumyum_pickr]    Click the \u{1F3AF} button in your browser, or press Alt+P
`);
      setupIdeConfigs();
      resolve();
    });
  });
}
function handleRequest(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }
  if (req.method === "GET" && req.url === "/pickr.js") {
    res.writeHead(200, {
      "Content-Type": "application/javascript; charset=utf-8",
      "Cache-Control": "no-store"
    });
    res.end(getClientScript(_port));
    return;
  }
  if (req.method === "GET" && req.url === "/ping") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ ok: true, version: "0.1.0" }));
    return;
  }
  if (req.method === "GET" && req.url === "/current") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(_selection));
    return;
  }
  if (req.method === "POST" && req.url === "/select") {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
    });
    req.on("end", () => {
      try {
        _selection = JSON.parse(body);
        persistSelection(_selection);
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ ok: true }));
      } catch {
        res.writeHead(400);
        res.end("Bad request");
      }
    });
    return;
  }
  res.writeHead(404);
  res.end();
}
function persistSelection(sel) {
  const outputPath = path.join(_projectRoot, ".yumyum_pickr.json");
  const data = {
    ...sel,
    _instructions: [
      "This file is generated by yumyum_pickr.",
      "In your AI chat, reference it with @.yumyum_pickr.json",
      "Or use the MCP tool: get_selected_element"
    ]
  };
  try {
    fs.writeFileSync(outputPath, JSON.stringify(data, null, 2), "utf-8");
    console.log(`[yumyum_pickr] \u2713 Captured: ${sel.selector} \u2014 ${sel.url}`);
  } catch (err) {
    console.error("[yumyum_pickr] Could not write .yumyum_pickr.json:", err);
  }
}
function setupIdeConfigs() {
  setupCursorMcp();
  setupVscodeMcp();
}
function setupCursorMcp() {
  const dir = path.join(_projectRoot, ".cursor");
  const configPath = path.join(dir, "mcp.json");
  try {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    let config = {};
    if (fs.existsSync(configPath)) {
      config = JSON.parse(fs.readFileSync(configPath, "utf-8"));
    }
    const servers = config.mcpServers ?? {};
    if (servers["yumyum_pickr"]) return;
    config.mcpServers = {
      ...servers,
      yumyum_pickr: {
        command: "npx",
        args: ["yumyum_pickr", "mcp"],
        description: "yumyum_pickr \u2014 visual element picker for AI chat context"
      }
    };
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2), "utf-8");
    console.log("[yumyum_pickr] \u2713 Cursor MCP config written to .cursor/mcp.json");
    console.log("[yumyum_pickr]   Restart Cursor to enable get_selected_element tool");
  } catch {
  }
}
function setupVscodeMcp() {
  const dir = path.join(_projectRoot, ".vscode");
  const configPath = path.join(dir, "mcp.json");
  try {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    let config = {};
    if (fs.existsSync(configPath)) {
      config = JSON.parse(fs.readFileSync(configPath, "utf-8"));
    }
    const servers = config.servers ?? {};
    if (servers["yumyum_pickr"]) return;
    config.servers = {
      ...servers,
      yumyum_pickr: {
        type: "stdio",
        command: "npx",
        args: ["yumyum_pickr", "mcp"]
      }
    };
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2), "utf-8");
    console.log("[yumyum_pickr] \u2713 VSCode MCP config written to .vscode/mcp.json");
  } catch {
  }
}

// src/plugins/next.ts
function withYumyumPickr(nextConfig = {}, options = {}) {
  const port = options.port ?? 37799;
  if (process.env.NODE_ENV !== "production") {
    startServer({ port, projectRoot: process.cwd() }).catch(console.error);
  }
  return {
    ...nextConfig,
    // Expose port to client-side via env var so the Script component knows it
    env: {
      ...nextConfig.env,
      NEXT_PUBLIC_YUMYUM_PICKR_PORT: String(port)
    }
  };
}
function YumyumPickrScript({
  port
} = {}) {
  if (process.env.NODE_ENV === "production") return null;
  const resolvedPort = port ?? Number(process.env.NEXT_PUBLIC_YUMYUM_PICKR_PORT ?? 37799);
  return {
    type: "script",
    props: {
      src: `http://localhost:${resolvedPort}/pickr.js`,
      defer: true
    }
  };
}
var next_default = withYumyumPickr;
export {
  YumyumPickrScript,
  next_default as default,
  withYumyumPickr
};
//# sourceMappingURL=next.js.map