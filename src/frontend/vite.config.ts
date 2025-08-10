import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import environment from "vite-plugin-environment";
import { configDotenv } from "dotenv";
import { fileURLToPath, URL } from "url";

/*
 * Vite configuration file for the frontend application.
 * This file sets up the necessary plugins and environment variables.
 */

// Load environment variables from .env file
configDotenv({ path: "../../.env" });

export default defineConfig({
  build: {
    emptyOutDir: true,
  },
  optimizeDeps: {
    esbuildOptions: {
      define: {
        global: 'globalThis',
      },
    },
  },
  resolve: {
    alias: [
      {
        find: '@',
        replacement: fileURLToPath(new URL('./src', import.meta.url)),
      },
      {
        find: 'declare',
        replacement: fileURLToPath(new URL('../declare', import.meta.url)),
      },
    ],
    dedupe: ['@dfinity/agent'],
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:4943',
        changeOrigin: true,
      },
    },
  },
  plugins: [
    react(),
    tailwindcss(),
    environment('all', { prefix: 'CANISTER_' }),
    environment('all', { prefix: 'DFX_' }),
  ],
});
