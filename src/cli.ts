#!/usr/bin/env node
/**
 * yumyum_pickr CLI
 *
 * Usage:
 *   npx yumyum_pickr mcp      — start MCP stdio server (used by Cursor/VSCode)
 *   npx yumyum_pickr current  — print last selected element as JSON
 */

const [, , command] = process.argv;

async function main() {
  switch (command) {
    case 'mcp': {
      const { startMcpServer } = await import('./mcp.js');
      await startMcpServer();
      break;
    }

    case 'current': {
      const { getCurrentSelection } = await import('./server.js');
      const sel = getCurrentSelection();
      if (sel) {
        console.log(JSON.stringify(sel, null, 2));
      } else {
        console.log('No element selected yet. Start your dev server and pick an element.');
        process.exit(1);
      }
      break;
    }

    default: {
      console.log([
        'yumyum_pickr — Visual element picker for AI-assisted frontend dev',
        '',
        'Commands:',
        '  mcp       Start MCP stdio server (for Cursor / VSCode AI integration)',
        '  current   Print the last selected element as JSON',
        '',
        'Docs: https://github.com/your-username/yumyum_pickr',
      ].join('\n'));
      break;
    }
  }
}

main().catch((err) => {
  console.error('[yumyum_pickr]', err);
  process.exit(1);
});
