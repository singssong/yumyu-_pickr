interface YumyumPickrNextOptions {
    /** Port for the local picker server. Default: 37799 */
    port?: number;
}
/**
 * Next.js config wrapper for yumyum_pickr.
 * Starts the picker server automatically in dev mode.
 *
 * @example
 * // next.config.ts
 * import { withYumyumPickr } from 'yumyum_pickr/next'
 *
 * export default withYumyumPickr({
 *   // your existing next config
 * })
 *
 * Then add <YumyumPickrScript /> to your root layout (see below).
 */
declare function withYumyumPickr(nextConfig?: Record<string, unknown>, options?: YumyumPickrNextOptions): Record<string, unknown>;
/**
 * Script component to inject the picker into your Next.js app.
 *
 * App Router — add to app/layout.tsx:
 * @example
 * import { YumyumPickrScript } from 'yumyum_pickr/next'
 *
 * export default function RootLayout({ children }) {
 *   return (
 *     <html>
 *       <body>
 *         {children}
 *         <YumyumPickrScript />
 *       </body>
 *     </html>
 *   )
 * }
 *
 * Pages Router — add to pages/_app.tsx:
 * @example
 * import { YumyumPickrScript } from 'yumyum_pickr/next'
 *
 * export default function App({ Component, pageProps }) {
 *   return <>
 *     <Component {...pageProps} />
 *     <YumyumPickrScript />
 *   </>
 * }
 */
declare function YumyumPickrScript({ port, }?: {
    port?: number;
}): unknown;

export { type YumyumPickrNextOptions, YumyumPickrScript, withYumyumPickr as default, withYumyumPickr };
