import react from '@vitejs/plugin-react-swc';
import { defineConfig } from 'vite';
import wasm from 'vite-plugin-wasm';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), wasm()],
  build: {
    target: 'esnext',
  },
  server: {
    port: 5173,
    strictPort: true,
  },
});
