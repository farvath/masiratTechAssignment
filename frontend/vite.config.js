import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite'


import { loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
 const env = loadEnv(mode, __dirname, '');

  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "src"),
      },
    },
    server: {
      port: parseInt(env.VITE_FRONTEND_PORT) || 5173,
    },
  };
});
