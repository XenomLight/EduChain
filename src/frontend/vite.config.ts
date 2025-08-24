import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { fileURLToPath, URL } from "url";

/*
 * Vite configuration file for the frontend application.
 * This file sets up the necessary plugins and environment variables.
 */

export default defineConfig(({ mode }) => {
  // Load environment variables
  const env = loadEnv(mode, process.cwd(), '');

  return {
    build: {
      emptyOutDir: true,
    },
    define: {
      'process.env': {
        ...Object.entries(env).reduce((prev, [key, val]) => {
          if (key.startsWith('VITE_')) {
            prev[key] = JSON.stringify(val);
          }
          return prev;
        }, {} as Record<string, string>)
      }
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
    ],
  };
});
