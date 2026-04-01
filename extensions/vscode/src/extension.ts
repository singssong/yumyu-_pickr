import * as vscode from 'vscode';
import * as fs from 'node:fs';
import * as path from 'node:path';
import * as http from 'node:http';

// ── Types ──────────────────────────────────────────────────────────
interface ElementSelection {
  tag: string;
  id: string | null;
  classes: string[];
  selector: string;
  html: string;
  innerText: string;
  url: string;
  timestamp: number;
  source?: string;
}

// ── State ──────────────────────────────────────────────────────────
let server: http.Server | null = null;
let statusBar: vscode.StatusBarItem;
let lastTimestamp = 0;

// ── Activate ───────────────────────────────────────────────────────
export function activate(context: vscode.ExtensionContext) {
  const config = vscode.workspace.getConfiguration('yumyumPickr');
  const port   = config.get<number>('port', 37799);
  const auto   = config.get<boolean>('autoStart', true);

  // Status bar
  statusBar = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
  statusBar.text    = '$(target) pickr';
  statusBar.tooltip = 'yumyum_pickr — waiting for element selection';
  statusBar.command = 'yumyumPickr.showSelection';
  statusBar.show();
  context.subscriptions.push(statusBar);

  // Commands
  context.subscriptions.push(
    vscode.commands.registerCommand('yumyumPickr.showSelection', () => showSelectionPanel(context)),
    vscode.commands.registerCommand('yumyumPickr.copyToClipboard', () => copyToClipboard()),
  );

  // File watcher — detects new selections written by the server
  const watcher = vscode.workspace.createFileSystemWatcher('**/.yumyum_pickr.json');
  watcher.onDidCreate(onSelectionFile);
  watcher.onDidChange(onSelectionFile);
  context.subscriptions.push(watcher);

  if (auto) startServer(port, context);

  // Auto-configure MCP for this workspace
  setupMcp(port);

  vscode.window.showInformationMessage('yumyum_pickr: ready — open localhost in Chrome and click 🎯');
}

export function deactivate() {
  server?.close();
}

// ── Local HTTP server ──────────────────────────────────────────────
function startServer(port: number, context: vscode.ExtensionContext) {
  const workspaceRoot = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath ?? process.cwd();

  // Import core server dynamically to avoid circular deps
  try {
    const core = require('yumyum_pickr');
    core.startServer({ port, projectRoot: workspaceRoot });
    return;
  } catch {
    // Core package not available — fall back to inline minimal server
  }

  server = http.createServer((req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') { res.writeHead(204); res.end(); return; }

    if (req.method === 'GET' && req.url === '/ping') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ ok: true, version: '0.1.0', source: 'vscode-extension' }));
      return;
    }

    if (req.method === 'POST' && req.url === '/select') {
      let body = '';
      req.on('data', chunk => { body += chunk; });
      req.on('end', () => {
        try {
          const sel: ElementSelection = JSON.parse(body);
          persistSelection(sel, workspaceRoot);
          notifySelection(sel);
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ ok: true }));
        } catch {
          res.writeHead(400); res.end();
        }
      });
      return;
    }

    if (req.method === 'GET' && req.url === '/current') {
      const p = path.join(workspaceRoot, '.yumyum_pickr.json');
      if (fs.existsSync(p)) {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(fs.readFileSync(p, 'utf-8'));
      } else {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end('null');
      }
      return;
    }

    res.writeHead(404); res.end();
  });

  server.on('error', (err: NodeJS.ErrnoException) => {
    if (err.code !== 'EADDRINUSE') {
      vscode.window.showErrorMessage(`yumyum_pickr server error: ${err.message}`);
    }
    // EADDRINUSE = another instance running, that's fine
  });

  server.listen(port, '127.0.0.1', () => {
    console.log(`[yumyum_pickr] Server on :${port}`);
  });

  context.subscriptions.push({ dispose: () => server?.close() });
}

// ── Selection handlers ─────────────────────────────────────────────
function onSelectionFile(uri: vscode.Uri) {
  try {
    const sel: ElementSelection = JSON.parse(fs.readFileSync(uri.fsPath, 'utf-8'));
    if (sel.timestamp <= lastTimestamp) return;
    notifySelection(sel);
  } catch {}
}

function notifySelection(sel: ElementSelection) {
  if (sel.timestamp <= lastTimestamp) return;
  lastTimestamp = sel.timestamp;

  statusBar.text    = `$(target) ${sel.selector}`;
  statusBar.tooltip = `yumyum_pickr: <${sel.tag}> selected — click to view`;

  vscode.window.showInformationMessage(
    `🎯 Captured: ${sel.selector}`,
    'Show Details',
    'Copy',
  ).then(action => {
    if (action === 'Show Details') vscode.commands.executeCommand('yumyumPickr.showSelection');
    if (action === 'Copy') copyToClipboard();
  });
}

function persistSelection(sel: ElementSelection, root: string) {
  const outputPath = path.join(root, '.yumyum_pickr.json');
  fs.writeFileSync(outputPath, JSON.stringify({
    ...sel,
    _instructions: [
      'Reference this file in your AI chat: @.yumyum_pickr.json',
      'Or use the MCP tool: get_selected_element',
    ],
  }, null, 2));
}

// ── Panel ──────────────────────────────────────────────────────────
function showSelectionPanel(context: vscode.ExtensionContext) {
  const workspaceRoot = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;
  if (!workspaceRoot) {
    vscode.window.showWarningMessage('yumyum_pickr: no workspace open');
    return;
  }

  const jsonPath = path.join(workspaceRoot, '.yumyum_pickr.json');
  let sel: ElementSelection | null = null;
  try { sel = JSON.parse(fs.readFileSync(jsonPath, 'utf-8')); } catch {}

  const panel = vscode.window.createWebviewPanel(
    'yumyumPickr',
    'yumyum_pickr — Selected Element',
    vscode.ViewColumn.Beside,
    { enableScripts: false },
  );

  panel.webview.html = selectionHtml(sel);
}

function selectionHtml(sel: ElementSelection | null): string {
  if (!sel) {
    return `<!DOCTYPE html><html><body style="font-family:system-ui;padding:24px;color:#94a3b8;">
      <h2>No element selected yet</h2>
      <p>Open localhost in Chrome with the yumyum_pickr extension installed,<br>
      then click 🎯 and pick any element.</p>
    </body></html>`;
  }

  const esc = (s: string) => s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
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
  <h1>🎯 Selected Element</h1>
  <table>
    <tr><td>Tag</td><td>&lt;${esc(sel.tag)}&gt;</td></tr>
    <tr><td>ID</td><td>${sel.id ? esc(sel.id) : '—'}</td></tr>
    <tr><td>Classes</td><td>${sel.classes.length ? sel.classes.map(esc).join(' ') : '—'}</td></tr>
    <tr><td>Selector</td><td>${esc(sel.selector)}</td></tr>
    <tr><td>URL</td><td>${esc(sel.url)}</td></tr>
    <tr><td>Captured</td><td>${time}</td></tr>
    ${sel.innerText ? `<tr><td>Text</td><td>"${esc(sel.innerText.slice(0, 100))}"</td></tr>` : ''}
  </table>
  <pre>${esc(sel.html)}</pre>
  <div class="tip">
    In your AI chat, type <code>@.yumyum_pickr.json</code> to attach this as context.<br>
    Or use the MCP tool <code>get_selected_element</code> if configured.
  </div>
</body></html>`;
}

// ── Clipboard ──────────────────────────────────────────────────────
function copyToClipboard() {
  const root = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;
  if (!root) return;
  try {
    const sel: ElementSelection = JSON.parse(
      fs.readFileSync(path.join(root, '.yumyum_pickr.json'), 'utf-8')
    );
    const text = [
      `Tag: <${sel.tag}>`,
      `Selector: ${sel.selector}`,
      `URL: ${sel.url}`,
      ``,
      `HTML:`,
      sel.html,
    ].join('\n');
    vscode.env.clipboard.writeText(text);
    vscode.window.showInformationMessage('yumyum_pickr: selection copied to clipboard');
  } catch {
    vscode.window.showWarningMessage('yumyum_pickr: no selection to copy');
  }
}

// ── MCP auto-config ────────────────────────────────────────────────
function setupMcp(port: number) {
  const root = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;
  if (!root) return;

  const dir  = path.join(root, '.vscode');
  const file = path.join(dir, 'mcp.json');
  try {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    let cfg: Record<string, unknown> = {};
    if (fs.existsSync(file)) cfg = JSON.parse(fs.readFileSync(file, 'utf-8'));
    const servers = (cfg.servers as Record<string, unknown>) ?? {};
    if (!servers['yumyum_pickr']) {
      cfg.servers = {
        ...servers,
        yumyum_pickr: { type: 'stdio', command: 'npx', args: ['yumyum_pickr', 'mcp'] },
      };
      fs.writeFileSync(file, JSON.stringify(cfg, null, 2));
    }
  } catch {}
}
