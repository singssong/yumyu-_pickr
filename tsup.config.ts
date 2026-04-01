import { defineConfig } from 'tsup'

export default defineConfig([
  // Node.js bundles: server, plugins, CLI, MCP
  {
    entry: {
      index: 'src/index.ts',
      cli: 'src/cli.ts',
      'plugins/vite': 'src/plugins/vite.ts',
      'plugins/next': 'src/plugins/next.ts',
      'plugins/webpack': 'src/plugins/webpack.ts',
    },
    format: ['esm', 'cjs'],
    dts: true,
    platform: 'node',
    target: 'node18',
    splitting: false,
    sourcemap: true,
    clean: true,
    banner: {
      js: '/* yumyum_pickr - Visual element picker for AI-assisted dev */',
    },
  },
])
