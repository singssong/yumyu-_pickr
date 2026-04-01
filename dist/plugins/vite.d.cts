import { Plugin } from 'vite';

interface YumyumPickrViteOptions {
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
declare function yumyumPickr(options?: YumyumPickrViteOptions): Plugin;

export { type YumyumPickrViteOptions, yumyumPickr as default, yumyumPickr };
