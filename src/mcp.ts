import fs from 'node:fs';
import path from 'node:path';
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';

const DEV_SERVER_PORT = 37799;
const JSON_FILE = '.yumyum_pickr.json';

/** Tries to get the selection from the running dev server, falls back to JSON file */
async function fetchSelection(): Promise<unknown> {
  // 1. Try live HTTP server (most up-to-date)
  try {
    const res = await fetch(`http://localhost:${DEV_SERVER_PORT}/current`, {
      signal: AbortSignal.timeout(500),
    });
    if (res.ok) {
      const data = await res.json();
      if (data) return data;
    }
  } catch {
    // Server not running — fall through to file
  }

  // 2. Fall back to persisted JSON file
  const filePath = path.join(process.cwd(), JSON_FILE);
  if (fs.existsSync(filePath)) {
    return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  }

  return null;
}

function formatSelection(sel: Record<string, unknown>): string {
  const tag = sel.tag as string;
  const id = sel.id ? `#${sel.id}` : '(none)';
  const classes = Array.isArray(sel.classes) && sel.classes.length
    ? (sel.classes as string[]).join(' ')
    : '(none)';
  const selector = sel.selector as string;
  const url = sel.url as string;
  const html = sel.html as string;
  const innerText = sel.innerText as string;
  const time = sel.timestamp
    ? new Date(sel.timestamp as number).toLocaleTimeString()
    : 'unknown';

  return [
    '## Selected Element',
    '',
    `**Tag:** \`<${tag}>\``,
    `**ID:** ${id}`,
    `**Classes:** ${classes}`,
    `**CSS Selector:** \`${selector}\``,
    `**Page URL:** ${url}`,
    `**Captured at:** ${time}`,
    '',
    innerText ? `**Visible text:** "${innerText.slice(0, 150)}"` : '',
    '',
    '**HTML:**',
    '```html',
    html,
    '```',
  ].filter((l) => l !== undefined).join('\n');
}

export async function startMcpServer(): Promise<void> {
  const server = new Server(
    { name: 'yumyum_pickr', version: '0.1.0' },
    { capabilities: { tools: {} } },
  );

  server.setRequestHandler(ListToolsRequestSchema, async () => ({
    tools: [
      {
        name: 'get_selected_element',
        description:
          'Returns the HTML element most recently selected via the yumyum_pickr picker tool in the browser. ' +
          'Use this to get precise context about which UI element the user wants to modify. ' +
          'The result includes the CSS selector, full HTML, classes, ID, and page URL.',
        inputSchema: {
          type: 'object' as const,
          properties: {},
          required: [],
        },
      },
    ],
  }));

  server.setRequestHandler(CallToolRequestSchema, async (req) => {
    if (req.params.name !== 'get_selected_element') {
      return {
        content: [{ type: 'text' as const, text: `Unknown tool: ${req.params.name}` }],
        isError: true,
      };
    }

    const selection = await fetchSelection();

    if (!selection) {
      return {
        content: [
          {
            type: 'text' as const,
            text: [
              '## No element selected yet',
              '',
              'To use yumyum_pickr:',
              '1. Make sure your dev server is running (with the yumyum_pickr plugin)',
              '2. Open your browser at localhost',
              '3. Click the **🎯 Pick Element** button (bottom-right corner)',
              '4. Click any element on the page',
              '5. Come back and re-run this tool',
            ].join('\n'),
          },
        ],
      };
    }

    return {
      content: [
        {
          type: 'text' as const,
          text: formatSelection(selection as Record<string, unknown>),
        },
      ],
    };
  });

  const transport = new StdioServerTransport();
  await server.connect(transport);
}
