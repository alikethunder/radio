import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import viteTsconfigPaths from 'vite-tsconfig-paths'
import commonjs from 'vite-plugin-commonjs'
import autoprefixer from 'autoprefixer'
import * as path from 'path'
import svgr from '@svgr/rollup'
import injectHTML from 'vite-plugin-html-inject'
import { sentryVitePlugin } from "@sentry/vite-plugin"

// https://vitejs.dev/config/
export default defineConfig({
  ssr: {
    noExternal: [
      "react",
      "react-dom",
      "react-router",
      "react-router-dom",
      'primereact',
      'primeicons',
      'react-transition-group',
      'dom-helpers',
      "use-async-memo",
      "usehooks-ts",
      "react-hook-form",
      "react-helmet",
      "react-window",
      "react-side-effect",
      "react-virtualized-auto-sizer",
      "@sentry/react",
      "zustand-x",
      "react-tracked",
      'proxy-compare',
      'zustand',
      "use-sync-external-store",
      "react-icons",
    ]
  },
  build: {
    sourcemap: true,
    chunkSizeWarningLimit: 1500,
    target: 'es2015',
    outDir: '../../served/public',
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, './index.html'),
        soho_light: path.resolve(__dirname, './src/sass/soho_light.sass'),
        soho_dark: path.resolve(__dirname, './src/sass/soho_dark.sass'),
      },
      output: {
        assetFileNames: (assetInfo) => {
          if (assetInfo.name.endsWith('.css')) {
            // Extract theme name from the file path
            const themeMatch = assetInfo.name.match(/soho_(light|dark)/);
            if (themeMatch) {
              return `assets/themes/${themeMatch[0]}.css`;
            }
            return 'assets/[name]-[hash].[ext]'
          }
          return 'assets/[name].[ext]';
        },
        format: 'esm'
      }
    }
  },
  plugins: [
    injectHTML(),
    react(),
    viteTsconfigPaths(),
    svgr(),
    commonjs(),
    sentryVitePlugin({
      org: 'radiobest',
      project: 'radio-best-fe',

      authToken: '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',

      sourcemaps: {
        assets: "./assets/**"
      },
    }),
  ],
  css: {
    postcss: {
      plugins: [
        autoprefixer({})
      ],
    }
  },
  resolve: {
    alias: [
      { find: '@', replacement: path.resolve(__dirname, './src'), },
      { find: '&', replacement: path.resolve(__dirname, '../../'), },
    ]
  },
  base: "/",
  envDir: path.resolve(__dirname, '../../'),
})
