import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig(() => ({
  root: __dirname,
  cacheDir: resolve(__dirname, '../../node_modules/.vite/libs/react-ui'),
  plugins: [react()],
  resolve: {
    alias: {
      '@berrypjh/ui-core': resolve(__dirname, '../ui-core/src/index.ts'),
    },
  },
}));
