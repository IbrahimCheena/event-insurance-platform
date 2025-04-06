// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: [
      "2a8a-2601-646-8085-3160-9ca8-7711-fe16-47e5.ngrok-free.app"
    ]
  }
});
