#!/usr/bin/env node
/* yumyum_pickr - Visual element picker for AI-assisted dev */
var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// src/mcp.ts
var mcp_exports = {};
__export(mcp_exports, {
  startMcpServer: () => startMcpServer
});
import fs from "fs";
import path from "path";
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema
} from "@modelcontextprotocol/sdk/types.js";
async function fetchSelection() {
  try {
    const res = await fetch(`http://localhost:${DEV_SERVER_PORT}/current`, {
      signal: AbortSignal.timeout(500)
    });
    if (res.ok) {
      const data = await res.json();
      if (data) return data;
    }
  } catch {
  }
  const filePath = path.join(process.cwd(), JSON_FILE);
  if (fs.existsSync(filePath)) {
    return JSON.parse(fs.readFileSync(filePath, "utf-8"));
  }
  return null;
}
function formatSelection(sel) {
  const tag = sel.tag;
  const id = sel.id ? `#${sel.id}` : "(none)";
  const classes = Array.isArray(sel.classes) && sel.classes.length ? sel.classes.join(" ") : "(none)";
  const selector = sel.selector;
  const url = sel.url;
  const html = sel.html;
  const innerText = sel.innerText;
  const time = sel.timestamp ? new Date(sel.timestamp).toLocaleTimeString() : "unknown";
  return [
    "## Selected Element",
    "",
    `**Tag:** \`<${tag}>\``,
    `**ID:** ${id}`,
    `**Classes:** ${classes}`,
    `**CSS Selector:** \`${selector}\``,
    `**Page URL:** ${url}`,
    `**Captured at:** ${time}`,
    "",
    innerText ? `**Visible text:** "${innerText.slice(0, 150)}"` : "",
    "",
    "**HTML:**",
    "```html",
    html,
    "```"
  ].filter((l) => l !== void 0).join("\n");
}
async function startMcpServer() {
  const server = new Server(
    { name: "yumyum_pickr", version: "0.1.0" },
    { capabilities: { tools: {} } }
  );
  server.setRequestHandler(ListToolsRequestSchema, async () => ({
    tools: [
      {
        name: "get_selected_element",
        description: "Returns the HTML element most recently selected via the yumyum_pickr picker tool in the browser. Use this to get precise context about which UI element the user wants to modify. The result includes the CSS selector, full HTML, classes, ID, and page URL.",
        inputSchema: {
          type: "object",
          properties: {},
          required: []
        }
      }
    ]
  }));
  server.setRequestHandler(CallToolRequestSchema, async (req) => {
    if (req.params.name !== "get_selected_element") {
      return {
        content: [{ type: "text", text: `Unknown tool: ${req.params.name}` }],
        isError: true
      };
    }
    const selection = await fetchSelection();
    if (!selection) {
      return {
        content: [
          {
            type: "text",
            text: [
              "## No element selected yet",
              "",
              "To use yumyum_pickr:",
              "1. Make sure your dev server is running (with the yumyum_pickr plugin)",
              "2. Open your browser at localhost",
              "3. Click the **\u{1F3AF} Pick Element** button (bottom-right corner)",
              "4. Click any element on the page",
              "5. Come back and re-run this tool"
            ].join("\n")
          }
        ]
      };
    }
    return {
      content: [
        {
          type: "text",
          text: formatSelection(selection)
        }
      ]
    };
  });
  const transport = new StdioServerTransport();
  await server.connect(transport);
}
var DEV_SERVER_PORT, JSON_FILE;
var init_mcp = __esm({
  "src/mcp.ts"() {
    "use strict";
    DEV_SERVER_PORT = 37799;
    JSON_FILE = ".yumyum_pickr.json";
  }
});

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
var init_client_script = __esm({
  "src/client-script.ts"() {
    "use strict";
  }
});

// src/server.ts
var server_exports = {};
__export(server_exports, {
  getCurrentSelection: () => getCurrentSelection,
  startServer: () => startServer,
  stopServer: () => stopServer
});
import fs2 from "fs";
import http from "http";
import path2 from "path";
function getCurrentSelection() {
  return _selection;
}
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
  const outputPath = path2.join(_projectRoot, ".yumyum_pickr.json");
  const data = {
    ...sel,
    _instructions: [
      "This file is generated by yumyum_pickr.",
      "In your AI chat, reference it with @.yumyum_pickr.json",
      "Or use the MCP tool: get_selected_element"
    ]
  };
  try {
    fs2.writeFileSync(outputPath, JSON.stringify(data, null, 2), "utf-8");
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
  const dir = path2.join(_projectRoot, ".cursor");
  const configPath = path2.join(dir, "mcp.json");
  try {
    if (!fs2.existsSync(dir)) fs2.mkdirSync(dir, { recursive: true });
    let config = {};
    if (fs2.existsSync(configPath)) {
      config = JSON.parse(fs2.readFileSync(configPath, "utf-8"));
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
    fs2.writeFileSync(configPath, JSON.stringify(config, null, 2), "utf-8");
    console.log("[yumyum_pickr] \u2713 Cursor MCP config written to .cursor/mcp.json");
    console.log("[yumyum_pickr]   Restart Cursor to enable get_selected_element tool");
  } catch {
  }
}
function setupVscodeMcp() {
  const dir = path2.join(_projectRoot, ".vscode");
  const configPath = path2.join(dir, "mcp.json");
  try {
    if (!fs2.existsSync(dir)) fs2.mkdirSync(dir, { recursive: true });
    let config = {};
    if (fs2.existsSync(configPath)) {
      config = JSON.parse(fs2.readFileSync(configPath, "utf-8"));
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
    fs2.writeFileSync(configPath, JSON.stringify(config, null, 2), "utf-8");
    console.log("[yumyum_pickr] \u2713 VSCode MCP config written to .vscode/mcp.json");
  } catch {
  }
}
var _server, _selection, _projectRoot, _port;
var init_server = __esm({
  "src/server.ts"() {
    "use strict";
    init_client_script();
    _server = null;
    _selection = null;
    _projectRoot = process.cwd();
    _port = 37799;
  }
});

// src/cli.ts
var [, , command] = process.argv;
async function main() {
  switch (command) {
    case "mcp": {
      const { startMcpServer: startMcpServer2 } = await Promise.resolve().then(() => (init_mcp(), mcp_exports));
      await startMcpServer2();
      break;
    }
    case "current": {
      const { getCurrentSelection: getCurrentSelection2 } = await Promise.resolve().then(() => (init_server(), server_exports));
      const sel = getCurrentSelection2();
      if (sel) {
        console.log(JSON.stringify(sel, null, 2));
      } else {
        console.log("No element selected yet. Start your dev server and pick an element.");
        process.exit(1);
      }
      break;
    }
    default: {
      console.log([
        "yumyum_pickr \u2014 Visual element picker for AI-assisted frontend dev",
        "",
        "Commands:",
        "  mcp       Start MCP stdio server (for Cursor / VSCode AI integration)",
        "  current   Print the last selected element as JSON",
        "",
        "Docs: https://github.com/your-username/yumyum_pickr"
      ].join("\n"));
      break;
    }
  }
}
main().catch((err) => {
  console.error("[yumyum_pickr]", err);
  process.exit(1);
});
//# sourceMappingURL=cli.js.map