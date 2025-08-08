/// <reference types="vitest/config" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true,
        secure: false,
      },
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // React core
          "react-vendor": ["react", "react-dom"],

          // Material-UI (your biggest dependency)
          "mui-core": ["@mui/material"],
          "mui-icons": ["@mui/icons-material"],
          "mui-emotion": ["@emotion/react", "@emotion/styled"],

          // Router
          router: ["react-router-dom"],

          // Internationalization
          i18n: [
            "i18next",
            "react-i18next",
            "i18next-browser-languagedetector",
            "i18next-http-backend",
          ],

          // HTTP client
          http: ["axios"],

          // Icons (if you're using both)
          icons: ["react-icons"],
        },
      },
    },
    // Increase chunk size warning limit since you're now splitting properly
    chunkSizeWarningLimit: 300,
  },
  test: {
    environment: "jsdom",
    setupFiles: ["./test/setup.ts"],
    globals: true,
  },
});
