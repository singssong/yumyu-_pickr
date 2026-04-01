/**
 * yumyum_pickr
 *
 * Visual element picker for AI-assisted frontend development.
 * Click any element in your browser preview → context auto-injected into Cursor/VSCode AI chat.
 *
 * Quick start:
 *   npm install yumyum_pickr --save-dev
 *
 * Vite:
 *   import { yumyumPickr } from 'yumyum_pickr/vite'
 *   plugins: [yumyumPickr()]
 *
 * Next.js:
 *   import { withYumyumPickr } from 'yumyum_pickr/next'
 *   export default withYumyumPickr(nextConfig)
 *
 * Webpack:
 *   const { YumyumPickrWebpackPlugin } = require('yumyum_pickr/webpack')
 *   plugins: [new YumyumPickrWebpackPlugin()]
 */

export { startServer, stopServer, getCurrentSelection } from './server.js';
export type { PickrOptions, ElementSelection } from './server.js';
export { getClientScript } from './client-script.js';
