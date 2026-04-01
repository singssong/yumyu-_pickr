# yumyum_pickr 🎯

> Click any element in your browser → context auto-injected into Cursor / VSCode AI chat.

Inspired by Figma Make's pen tool. Select a UI element visually, and your AI coding assistant instantly knows exactly what to modify — no more "the blue button in the header" guesswork.

```
Browser preview                    Cursor / VSCode
───────────────                    ───────────────
Click 🎯 on any element    →    get_selected_element tool
                           →    returns tag, selector, HTML
                           →    AI edits the right element
```

---

## Quick Start

### 1. Install

```bash
npm install yumyum_pickr --save-dev
```

### 2. Add the plugin

**Vite** (`vite.config.ts`):
```ts
import { defineConfig } from 'vite'
import { yumyumPickr } from 'yumyum_pickr/vite'

export default defineConfig({
  plugins: [yumyumPickr()],
})
```

**Next.js** (`next.config.ts`):
```ts
import { withYumyumPickr } from 'yumyum_pickr/next'

export default withYumyumPickr({
  // your existing next config
})
```

Then add the script to your root layout (`app/layout.tsx` or `pages/_app.tsx`):
```tsx
import Script from 'next/script'

// In your layout:
{process.env.NODE_ENV === 'development' && (
  <Script src="http://localhost:37799/pickr.js" strategy="afterInteractive" />
)}
```

**Webpack** (`webpack.config.js`):
```js
const { YumyumPickrWebpackPlugin } = require('yumyum_pickr/webpack')

module.exports = {
  plugins: [new YumyumPickrWebpackPlugin()],
}
```

### 3. Start your dev server

```bash
npm run dev
```

The 🎯 button appears automatically in the bottom-right corner of your browser.

### 4. Configure your IDE (one-time, auto)

The plugin auto-creates these files on first run:
- `.cursor/mcp.json` — Cursor MCP config
- `.vscode/mcp.json` — VSCode MCP config

**Restart your IDE** after the first `npm run dev` to activate the `get_selected_element` tool.

### 5. Pick & prompt

1. Click **🎯 Pick Element** (or press `Alt+P`)
2. Hover over any element — purple highlight shows selection
3. Click to capture → green toast confirms
4. In your AI chat: use `get_selected_element` tool or reference `@.yumyum_pickr.json`

---

## How it works

```
┌─────────────────────────────────────────────────────────┐
│  Browser (localhost:3000)                               │
│                                                         │
│  [🎯 Pick Element]  ← injected by plugin               │
│       │                                                 │
│       │ click element                                   │
│       ▼                                                 │
│  POST http://localhost:37799/select                     │
│       { tag, selector, html, classes, url }             │
└──────────────────────┬──────────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────────┐
│  yumyum_pickr server (:37799)                           │
│                                                         │
│  • serves /pickr.js to browser                         │
│  • receives selections                                  │
│  • writes .yumyum_pickr.json                           │
└──────────────────────┬──────────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────────┐
│  MCP server (stdio)                                     │
│                                                         │
│  Tool: get_selected_element                             │
│  → reads from server or .yumyum_pickr.json             │
│  → returns formatted element context to AI             │
└─────────────────────────────────────────────────────────┘
```

---

## What gets captured

```json
{
  "tag": "button",
  "id": null,
  "classes": ["btn", "btn-primary"],
  "selector": ".hero-actions > button.btn.btn-primary",
  "html": "<button class=\"btn btn-primary btn-lg\">Get Started</button>",
  "innerText": "Get Started",
  "url": "http://localhost:5173/"
}
```

---

## Options

All plugins accept the same options:

| Option    | Type      | Default  | Description                     |
|-----------|-----------|----------|---------------------------------|
| `port`    | `number`  | `37799`  | Port for the local picker server |
| `enabled` | `boolean` | `true`   | Disable without removing plugin |

```ts
yumyumPickr({ port: 4242, enabled: process.env.PICKR !== 'false' })
```

---

## IDE Integration

### Cursor

After first `npm run dev`, `.cursor/mcp.json` is auto-created:

```json
{
  "mcpServers": {
    "yumyum_pickr": {
      "command": "npx",
      "args": ["yumyum_pickr", "mcp"]
    }
  }
}
```

Restart Cursor → the `get_selected_element` tool is available in AI chat.

### VSCode

Same auto-config in `.vscode/mcp.json`. Restart VSCode to activate.

### Manual (any MCP-compatible IDE)

```bash
npx yumyum_pickr mcp
```

---

## Keyboard Shortcut

| Shortcut | Action             |
|----------|--------------------|
| `Alt+P`  | Toggle picker mode |
| `Esc`    | Cancel picker mode |

---

## License

MIT
