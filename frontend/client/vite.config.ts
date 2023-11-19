import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import viteTsconfigPaths from 'vite-tsconfig-paths'
import commonjs from 'vite-plugin-commonjs'
import autoprefixer from 'autoprefixer'
import * as path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    sourcemap: true,
    chunkSizeWarningLimit: 1500,
    target: 'es2015',
    outDir: '../../build/public' 
  },
  plugins: [
    react(), 
    viteTsconfigPaths(),
    commonjs(),
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
      {find: '@', replacement: path.resolve(__dirname, './src'),},
      {find: '&', replacement: path.resolve(__dirname, '../../'),},
    ]
  },
  base: "./"
})
