import type { Plugin } from 'vite';
import { startServer, stopServer } from '../server.js';

export interface YumyumPickrViteOptions {
  /** Port for the local picker server. Default: 37799 */
  port?: number;
  /** Only active in dev mode. Default: true (no-op in build) */
  enabled?: boolean;
}

/**
 * Vite plugin for yumyum_pickr.
 *
 * @example
 * // vite.config.ts
 * import { defineConfig } from 'vite'
 * import { yumyumPickr } from 'yumyum_pickr/vite'
 *
 * export default defineConfig({
 *   plugins: [yumyumPickr()],
 * })
 */
export function yumyumPickr(options: YumyumPickrViteOptions = {}): Plugin {
  const port = options.port ?? 37799;
  const enabled = options.enabled ?? true;

  return {
    name: 'vite-plugin-yumyum-pickr',
    apply: 'serve', // dev only — not included in production builds

    async configureServer(server) {
      if (!enabled) return;

      await startServer({ port, projectRoot: server.config.root ?? process.cwd() });

      // Clean up when Vite shuts down
      server.httpServer?.on('close', () => stopServer());
    },

    transformIndexHtml() {
      if (!enabled) return [];
      return [
        {
          tag: 'script',
          attrs: {
            src: `http://localhost:${port}/pickr.js`,
            defer: true,
          },
          injectTo: 'body' as const,
        },
      ];
    },
  };
}

export default yumyumPickr;
