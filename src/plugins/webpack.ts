import { startServer, stopServer } from '../server.js';

export interface YumyumPickrWebpackOptions {
  /** Port for the local picker server. Default: 37799 */
  port?: number;
}

type Compiler = {
  options: { mode?: string };
  hooks: {
    beforeRun: { tapAsync: (name: string, fn: (c: unknown, cb: () => void) => void) => void };
    watchRun: { tapAsync: (name: string, fn: (c: unknown, cb: () => void) => void) => void };
    done: { tap: (name: string, fn: () => void) => void };
    compilation: {
      tap: (
        name: string,
        fn: (compilation: {
          hooks: {
            processAssets: {
              tap: (
                options: { name: string; stage: number },
                fn: (assets: Record<string, { source(): string }>) => void,
              ) => void;
            };
          };
          PROCESS_ASSETS_STAGE_OPTIMIZE_INLINE: number;
          updateAsset: (name: string, source: unknown) => void;
          compiler: { webpack: { sources: { RawSource: new (s: string) => unknown } } };
        }) => void,
      ) => void;
    };
  };
  webpack?: { sources: { RawSource: new (s: string) => unknown } };
};

/**
 * Webpack plugin for yumyum_pickr.
 *
 * @example
 * // webpack.config.js
 * const { YumyumPickrWebpackPlugin } = require('yumyum_pickr/webpack')
 *
 * module.exports = {
 *   plugins: [new YumyumPickrWebpackPlugin()],
 * }
 */
export class YumyumPickrWebpackPlugin {
  private port: number;
  private started = false;

  constructor(options: YumyumPickrWebpackOptions = {}) {
    this.port = options.port ?? 37799;
  }

  apply(compiler: Compiler): void {
    // Only activate in development
    if (compiler.options.mode === 'production') return;

    const pluginName = 'YumyumPickrWebpackPlugin';
    const { port } = this;

    const ensureServer = async (cb: () => void) => {
      if (!this.started) {
        await startServer({ port, projectRoot: process.cwd() });
        this.started = true;
      }
      cb();
    };

    // Start server before first build / watch run
    compiler.hooks.beforeRun.tapAsync(pluginName, (_c, cb) => ensureServer(cb));
    compiler.hooks.watchRun.tapAsync(pluginName, (_c, cb) => ensureServer(cb));

    // Stop server when webpack is done (optional — keeps it running for HMR)
    // compiler.hooks.done.tap(pluginName, () => stopServer());

    // Inject the picker script tag into every emitted HTML file
    compiler.hooks.compilation.tap(pluginName, (compilation) => {
      compilation.hooks.processAssets.tap(
        {
          name: pluginName,
          stage: compilation.PROCESS_ASSETS_STAGE_OPTIMIZE_INLINE,
        },
        (assets) => {
          for (const [filename, asset] of Object.entries(assets)) {
            if (!filename.endsWith('.html')) continue;

            const html = asset.source();
            if (!html.includes('/pickr.js')) {
              const scriptTag = `<script src="http://localhost:${port}/pickr.js" defer></script>`;
              const injected = html.replace('</body>', `${scriptTag}\n</body>`);

              // webpack 5 sources API
              const Sources =
                (compilation as unknown as { compiler: Compiler }).compiler?.webpack?.sources ??
                (compiler as unknown as { webpack: { sources: { RawSource: new (s: string) => unknown } } }).webpack?.sources;

              if (Sources) {
                compilation.updateAsset(filename, new Sources.RawSource(injected));
              }
            }
          }
        },
      );
    });
  }
}

export default YumyumPickrWebpackPlugin;
