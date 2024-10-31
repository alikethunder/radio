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
  build: {
    sourcemap: true,
    chunkSizeWarningLimit: 1500,
    target: 'es2015',
    outDir: '../../served/public'
  },
  plugins: [
    injectHTML(),
    react(),
    viteTsconfigPaths(),
    svgr(),
    commonjs(),
    sentryVitePlugin({
      org: 'RadioBest',
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
