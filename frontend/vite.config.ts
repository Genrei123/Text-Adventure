import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Existing /api proxy for routes like /api/bans, /api/games, etc.
      '/api': {
        target: 'https://text-adventure-production.up.railway.app',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
      // Additional endpoints without /api prefix
      '/sessions': {
        target: 'https://text-adventure-production.up.railway.app',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/sessions/, ''),
      },
      '/openai': {
        target: 'https://text-adventure-production.up.railway.app',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/openai/, ''),
      },
      '/ai': {
        target: 'https://text-adventure-production.up.railway.app',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/ai/, ''),
      },
      '/images': {
        target: 'https://text-adventure-production.up.railway.app',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/images/, ''),
      },
    },
  },
  define: {
    'process.env': process.env,
  },
});