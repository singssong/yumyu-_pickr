import { startServer } from '../server.js';

export interface YumyumPickrNextOptions {
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
export function withYumyumPickr(
  nextConfig: Record<string, unknown> = {},
  options: YumyumPickrNextOptions = {},
): Record<string, unknown> {
  const port = options.port ?? 37799;

  // Start the HTTP + MCP server as a side-effect when next.config is loaded in dev
  if (process.env.NODE_ENV !== 'production') {
    startServer({ port, projectRoot: process.cwd() }).catch(console.error);
  }

  return {
    ...nextConfig,
    // Expose port to client-side via env var so the Script component knows it
    env: {
      ...(nextConfig.env as Record<string, string> | undefined),
      NEXT_PUBLIC_YUMYUM_PICKR_PORT: String(port),
    },
  };
}

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
export function YumyumPickrScript({
  port,
}: {
  port?: number;
} = {}): unknown {
  // Only inject in development
  if (process.env.NODE_ENV === 'production') return null;

  const resolvedPort =
    port ??
    Number(process.env.NEXT_PUBLIC_YUMYUM_PICKR_PORT ?? 37799);

  // Return a plain script tag object — works as a React element
  // Users can also use Next.js <Script> component directly if preferred
  return {
    type: 'script',
    props: {
      src: `http://localhost:${resolvedPort}/pickr.js`,
      defer: true,
    },
  };
}

export default withYumyumPickr;
