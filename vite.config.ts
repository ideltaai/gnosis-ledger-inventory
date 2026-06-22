import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vite';

export default defineConfig({
  base: '/',
  plugins: [vue()],
  server: {
    proxy: {
      '/api': 'http://localhost:4317',
    },
  },
});
