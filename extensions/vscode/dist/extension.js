"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// ../../dist/index.cjs
var require_dist = __commonJS({
  "../../dist/index.cjs"(exports2, module2) {
    "use strict";
    var __create2 = Object.create;
    var __defProp2 = Object.defineProperty;
    var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
    var __getOwnPropNames2 = Object.getOwnPropertyNames;
    var __getProtoOf2 = Object.getPrototypeOf;
    var __hasOwnProp2 = Object.prototype.hasOwnProperty;
    var __export2 = (target, all) => {
      for (var name in all)
        __defProp2(target, name, { get: all[name], enumerable: true });
    };
    var __copyProps2 = (to, from, except, desc) => {
      if (from && typeof from === "object" || typeof from === "function") {
        for (let key of __getOwnPropNames2(from))
          if (!__hasOwnProp2.call(to, key) && key !== except)
            __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable });
      }
      return to;
    };
    var __toESM2 = (mod, isNodeMode, target) => (target = mod != null ? __create2(__getProtoOf2(mod)) : {}, __copyProps2(
      // If the importer is in node compatibility mode or this is not an ESM
      // file that has been converted to a CommonJS file using a Babel-
      // compatible transform (i.e. "__esModule" has not been set), then set
      // "default" to the CommonJS "module.exports" for node compatibility.
      isNodeMode || !mod || !mod.__esModule ? __defProp2(target, "default", { value: mod, enumerable: true }) : target,
      mod
    ));
    var __toCommonJS2 = (mod) => __copyProps2(__defProp2({}, "__esModule", { value: true }), mod);
    var src_exports = {};
    __export2(src_exports, {
      getClientScript: () => getClientScript,
      getCurrentSelection: () => getCurrentSelection,
      startServer: () => startServer2,
      stopServer: () => stopServer
    });
    module2.exports = __toCommonJS2(src_exports);
    var import_node_fs = __toESM2(require("fs"), 1);
    var import_node_http = __toESM2(require("http"), 1);
    var import_node_path = __toESM2(require("path"), 1);
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

    fetch(SERVER + '/select', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      mode: 'cors',
    })
    .then(function (res) {
      if (res.ok) showToast('\u2713 Element captured \u2014 use get_selected_element in AI chat');
      else showToast('\u2717 Server error', '#ef4444');
    })
    .catch(function () {
      showToast('\u2717 Cannot reach yumyum_pickr server (port ${port})', '#ef4444');
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
    var _server = null;
    var _selection = null;
    var _projectRoot = process.cwd();
    var _port = 37799;
    function getCurrentSelection() {
      return _selection;
    }
    async function startServer2(options = {}) {
      if (_server) return;
      _port = options.port ?? 37799;
      _projectRoot = options.projectRoot ?? process.cwd();
      return new Promise((resolve) => {
        _server = import_node_http.default.createServer(handleRequest);
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
    function stopServer() {
      _server?.close();
      _server = null;
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
            persistSelection2(_selection);
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
    function persistSelection2(sel) {
      const outputPath = import_node_path.default.join(_projectRoot, ".yumyum_pickr.json");
      const data = {
        ...sel,
        _instructions: [
          "This file is generated by yumyum_pickr.",
          "In your AI chat, reference it with @.yumyum_pickr.json",
          "Or use the MCP tool: get_selected_element"
        ]
      };
      try {
        import_node_fs.default.writeFileSync(outputPath, JSON.stringify(data, null, 2), "utf-8");
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
      const dir = import_node_path.default.join(_projectRoot, ".cursor");
      const configPath = import_node_path.default.join(dir, "mcp.json");
      try {
        if (!import_node_fs.default.existsSync(dir)) import_node_fs.default.mkdirSync(dir, { recursive: true });
        let config = {};
        if (import_node_fs.default.existsSync(configPath)) {
          config = JSON.parse(import_node_fs.default.readFileSync(configPath, "utf-8"));
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
        import_node_fs.default.writeFileSync(configPath, JSON.stringify(config, null, 2), "utf-8");
        console.log("[yumyum_pickr] \u2713 Cursor MCP config written to .cursor/mcp.json");
        console.log("[yumyum_pickr]   Restart Cursor to enable get_selected_element tool");
      } catch {
      }
    }
    function setupVscodeMcp() {
      const dir = import_node_path.default.join(_projectRoot, ".vscode");
      const configPath = import_node_path.default.join(dir, "mcp.json");
      try {
        if (!import_node_fs.default.existsSync(dir)) import_node_fs.default.mkdirSync(dir, { recursive: true });
        let config = {};
        if (import_node_fs.default.existsSync(configPath)) {
          config = JSON.parse(import_node_fs.default.readFileSync(configPath, "utf-8"));
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
        import_node_fs.default.writeFileSync(configPath, JSON.stringify(config, null, 2), "utf-8");
        console.log("[yumyum_pickr] \u2713 VSCode MCP config written to .vscode/mcp.json");
      } catch {
      }
    }
  }
});

// src/extension.ts
var extension_exports = {};
__export(extension_exports, {
  activate: () => activate,
  deactivate: () => deactivate
});
module.exports = __toCommonJS(extension_exports);
var vscode = __toESM(require("vscode"));
var fs = __toESM(require("node:fs"));
var path = __toESM(require("node:path"));
var http = __toESM(require("node:http"));
var server = null;
var statusBar;
var lastTimestamp = 0;
function activate(context) {
  const config = vscode.workspace.getConfiguration("yumyumPickr");
  const port = config.get("port", 37799);
  const auto = config.get("autoStart", true);
  statusBar = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
  statusBar.text = "$(target) pickr";
  statusBar.tooltip = "yumyum_pickr \u2014 waiting for element selection";
  statusBar.command = "yumyumPickr.showSelection";
  statusBar.show();
  context.subscriptions.push(statusBar);
  context.subscriptions.push(
    vscode.commands.registerCommand("yumyumPickr.showSelection", () => showSelectionPanel(context)),
    vscode.commands.registerCommand("yumyumPickr.copyToClipboard", () => copyToClipboard())
  );
  const watcher = vscode.workspace.createFileSystemWatcher("**/.yumyum_pickr.json");
  watcher.onDidCreate(onSelectionFile);
  watcher.onDidChange(onSelectionFile);
  context.subscriptions.push(watcher);
  if (auto) startServer(port, context);
  setupMcp(port);
  vscode.window.showInformationMessage("yumyum_pickr: ready \u2014 open localhost in Chrome and click \u{1F3AF}");
}
function deactivate() {
  server?.close();
}
function startServer(port, context) {
  const workspaceRoot = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath ?? process.cwd();
  try {
    const core = require_dist();
    core.startServer({ port, projectRoot: workspaceRoot });
    return;
  } catch {
  }
  server = http.createServer((req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    if (req.method === "OPTIONS") {
      res.writeHead(204);
      res.end();
      return;
    }
    if (req.method === "GET" && req.url === "/ping") {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ ok: true, version: "0.1.0", source: "vscode-extension" }));
      return;
    }
    if (req.method === "POST" && req.url === "/select") {
      let body = "";
      req.on("data", (chunk) => {
        body += chunk;
      });
      req.on("end", () => {
        try {
          const sel = JSON.parse(body);
          persistSelection(sel, workspaceRoot);
          notifySelection(sel);
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ ok: true }));
        } catch {
          res.writeHead(400);
          res.end();
        }
      });
      return;
    }
    if (req.method === "GET" && req.url === "/current") {
      const p = path.join(workspaceRoot, ".yumyum_pickr.json");
      if (fs.existsSync(p)) {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(fs.readFileSync(p, "utf-8"));
      } else {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end("null");
      }
      return;
    }
    res.writeHead(404);
    res.end();
  });
  server.on("error", (err) => {
    if (err.code !== "EADDRINUSE") {
      vscode.window.showErrorMessage(`yumyum_pickr server error: ${err.message}`);
    }
  });
  server.listen(port, "127.0.0.1", () => {
    console.log(`[yumyum_pickr] Server on :${port}`);
  });
  context.subscriptions.push({ dispose: () => server?.close() });
}
function onSelectionFile(uri) {
  try {
    const sel = JSON.parse(fs.readFileSync(uri.fsPath, "utf-8"));
    if (sel.timestamp <= lastTimestamp) return;
    notifySelection(sel);
  } catch {
  }
}
function notifySelection(sel) {
  if (sel.timestamp <= lastTimestamp) return;
  lastTimestamp = sel.timestamp;
  statusBar.text = `$(target) ${sel.selector}`;
  statusBar.tooltip = `yumyum_pickr: <${sel.tag}> selected \u2014 click to view`;
  vscode.window.showInformationMessage(
    `\u{1F3AF} Captured: ${sel.selector}`,
    "Show Details",
    "Copy"
  ).then((action) => {
    if (action === "Show Details") vscode.commands.executeCommand("yumyumPickr.showSelection");
    if (action === "Copy") copyToClipboard();
  });
}
function persistSelection(sel, root) {
  const outputPath = path.join(root, ".yumyum_pickr.json");
  fs.writeFileSync(outputPath, JSON.stringify({
    ...sel,
    _instructions: [
      "Reference this file in your AI chat: @.yumyum_pickr.json",
      "Or use the MCP tool: get_selected_element"
    ]
  }, null, 2));
}
function showSelectionPanel(context) {
  const workspaceRoot = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;
  if (!workspaceRoot) {
    vscode.window.showWarningMessage("yumyum_pickr: no workspace open");
    return;
  }
  const jsonPath = path.join(workspaceRoot, ".yumyum_pickr.json");
  let sel = null;
  try {
    sel = JSON.parse(fs.readFileSync(jsonPath, "utf-8"));
  } catch {
  }
  const panel = vscode.window.createWebviewPanel(
    "yumyumPickr",
    "yumyum_pickr \u2014 Selected Element",
    vscode.ViewColumn.Beside,
    { enableScripts: false }
  );
  panel.webview.html = selectionHtml(sel);
}
function selectionHtml(sel) {
  if (!sel) {
    return `<!DOCTYPE html><html><body style="font-family:system-ui;padding:24px;color:#94a3b8;">
      <h2>No element selected yet</h2>
      <p>Open localhost in Chrome with the yumyum_pickr extension installed,<br>
      then click \u{1F3AF} and pick any element.</p>
    </body></html>`;
  }
  const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const time = new Date(sel.timestamp).toLocaleTimeString();
  return `<!DOCTYPE html><html>
<head><style>
  body{font-family:system-ui;padding:24px;background:#0f172a;color:#e2e8f0;line-height:1.6;}
  h1{font-size:18px;color:#a5b4fc;margin-bottom:20px;}
  table{border-collapse:collapse;width:100%;margin-bottom:20px;}
  td{padding:8px 12px;border-bottom:1px solid #1e293b;font-size:13px;}
  td:first-child{color:#64748b;width:120px;font-weight:600;}
  td:last-child{color:#e2e8f0;font-family:monospace;}
  pre{background:#1e293b;padding:16px;border-radius:8px;overflow-x:auto;font-size:12px;color:#7dd3fc;}
  .tip{background:#1e293b;border-left:3px solid #6366f1;padding:12px 16px;border-radius:4px;font-size:13px;color:#94a3b8;}
  code{background:#0f172a;padding:2px 6px;border-radius:3px;color:#a5b4fc;}
</style></head>
<body>
  <h1>\u{1F3AF} Selected Element</h1>
  <table>
    <tr><td>Tag</td><td>&lt;${esc(sel.tag)}&gt;</td></tr>
    <tr><td>ID</td><td>${sel.id ? esc(sel.id) : "\u2014"}</td></tr>
    <tr><td>Classes</td><td>${sel.classes.length ? sel.classes.map(esc).join(" ") : "\u2014"}</td></tr>
    <tr><td>Selector</td><td>${esc(sel.selector)}</td></tr>
    <tr><td>URL</td><td>${esc(sel.url)}</td></tr>
    <tr><td>Captured</td><td>${time}</td></tr>
    ${sel.innerText ? `<tr><td>Text</td><td>"${esc(sel.innerText.slice(0, 100))}"</td></tr>` : ""}
  </table>
  <pre>${esc(sel.html)}</pre>
  <div class="tip">
    In your AI chat, type <code>@.yumyum_pickr.json</code> to attach this as context.<br>
    Or use the MCP tool <code>get_selected_element</code> if configured.
  </div>
</body></html>`;
}
function copyToClipboard() {
  const root = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;
  if (!root) return;
  try {
    const sel = JSON.parse(
      fs.readFileSync(path.join(root, ".yumyum_pickr.json"), "utf-8")
    );
    const text = [
      `Tag: <${sel.tag}>`,
      `Selector: ${sel.selector}`,
      `URL: ${sel.url}`,
      ``,
      `HTML:`,
      sel.html
    ].join("\n");
    vscode.env.clipboard.writeText(text);
    vscode.window.showInformationMessage("yumyum_pickr: selection copied to clipboard");
  } catch {
    vscode.window.showWarningMessage("yumyum_pickr: no selection to copy");
  }
}
function setupMcp(port) {
  const root = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;
  if (!root) return;
  const dir = path.join(root, ".vscode");
  const file = path.join(dir, "mcp.json");
  try {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    let cfg = {};
    if (fs.existsSync(file)) cfg = JSON.parse(fs.readFileSync(file, "utf-8"));
    const servers = cfg.servers ?? {};
    if (!servers["yumyum_pickr"]) {
      cfg.servers = {
        ...servers,
        yumyum_pickr: { type: "stdio", command: "npx", args: ["yumyum_pickr", "mcp"] }
      };
      fs.writeFileSync(file, JSON.stringify(cfg, null, 2));
    }
  } catch {
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  activate,
  deactivate
});
