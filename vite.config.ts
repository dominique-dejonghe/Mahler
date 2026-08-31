import { copyFileSync, mkdirSync } from 'node:fs';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';

function pagesBrievenShell() {
  return {
    name: 'pages-brieven-shell',
    closeBundle() {
      const index = path.resolve(__dirname, 'dist/index.html');
      mkdirSync(path.resolve(__dirname, 'dist/brieven'), { recursive: true });
      copyFileSync(index, path.resolve(__dirname, 'dist/brieven.html'));
      copyFileSync(index, path.resolve(__dirname, 'dist/brieven/index.html'));
    },
  };
}

export default defineConfig({
  plugins: [react(), pagesBrievenShell()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    host: '0.0.0.0',
    port: 5173,
  },
});
