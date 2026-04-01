interface YumyumPickrWebpackOptions {
    /** Port for the local picker server. Default: 37799 */
    port?: number;
}
type Compiler = {
    options: {
        mode?: string;
    };
    hooks: {
        beforeRun: {
            tapAsync: (name: string, fn: (c: unknown, cb: () => void) => void) => void;
        };
        watchRun: {
            tapAsync: (name: string, fn: (c: unknown, cb: () => void) => void) => void;
        };
        done: {
            tap: (name: string, fn: () => void) => void;
        };
        compilation: {
            tap: (name: string, fn: (compilation: {
                hooks: {
                    processAssets: {
                        tap: (options: {
                            name: string;
                            stage: number;
                        }, fn: (assets: Record<string, {
                            source(): string;
                        }>) => void) => void;
                    };
                };
                PROCESS_ASSETS_STAGE_OPTIMIZE_INLINE: number;
                updateAsset: (name: string, source: unknown) => void;
                compiler: {
                    webpack: {
                        sources: {
                            RawSource: new (s: string) => unknown;
                        };
                    };
                };
            }) => void) => void;
        };
    };
    webpack?: {
        sources: {
            RawSource: new (s: string) => unknown;
        };
    };
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
declare class YumyumPickrWebpackPlugin {
    private port;
    private started;
    constructor(options?: YumyumPickrWebpackOptions);
    apply(compiler: Compiler): void;
}

export { type YumyumPickrWebpackOptions, YumyumPickrWebpackPlugin, YumyumPickrWebpackPlugin as default };
