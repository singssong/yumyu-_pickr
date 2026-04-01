interface PickrOptions {
    /** Port for the local dev server. Default: 37799 */
    port?: number;
    /** Project root for writing .yumyum_pickr.json. Default: process.cwd() */
    projectRoot?: string;
}
interface ElementSelection {
    tag: string;
    id: string | null;
    classes: string[];
    selector: string;
    html: string;
    innerText: string;
    url: string;
    timestamp: number;
}
declare function getCurrentSelection(): ElementSelection | null;
declare function startServer(options?: PickrOptions): Promise<void>;
declare function stopServer(): void;

/**
 * Returns the browser-side picker script as a self-contained IIFE string.
 * This script is injected into the user's dev server HTML by the plugins.
 */
declare function getClientScript(port: number): string;

export { type ElementSelection, type PickrOptions, getClientScript, getCurrentSelection, startServer, stopServer };
