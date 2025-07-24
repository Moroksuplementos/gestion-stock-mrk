// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Eliminamos la sección 'css.postcss' de aquí
  // Vite detectará automáticamente postcss.config.js
});