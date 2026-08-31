import { defineConfig } from 'vite';
import pages from '@hono/vite-cloudflare-pages';
import devServer from '@hono/vite-dev-server';
import path from 'node:path';

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  plugins: [
    pages(),
    devServer({
      entry: 'src/index.tsx',
    }),
  ],
  build: {
    outDir: 'dist',
  },
});
