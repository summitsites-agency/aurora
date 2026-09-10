import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    include: ['tests/**/*.test.js', 'tests/**/*.test.jsx'],
    // jsdom has no window.matchMedia, and GSAP's ScrollTrigger calls it at
    // registration — i.e. at module import, before any test body runs. Without
    // this, every test touching src/motion/ dies on import. See tests/setup.js.
    setupFiles: ['./tests/setup.js'],
  },
});
