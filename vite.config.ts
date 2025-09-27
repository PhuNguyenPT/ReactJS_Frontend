/// <reference types="vitest/config" />
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";

export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [react({ tsDecorators: true })],
    assetsInclude: [
      "**/*.png",
      "**/*.jpg",
      "**/*.jpeg",
      "**/*.gif",
      "**/*.svg",
    ],
    server: {
      port: parseInt(env.VITE_PORT),
      proxy: {
        "/api": {
          target: env.VITE_BACKEND_URL,
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

            // ✅ Combine MUI, its icons, and Emotion into one chunk
            "mui-vendor": [
              "@mui/material",
              "@mui/icons-material",
              "@emotion/react",
              "@emotion/styled",
            ],

            // Router
            router: ["react-router-dom"],

            // Internationalization
            i18n: [
              "i18next",
              "react-i18next",
              "i18next-browser-languagedetector",
              "i18next-http-backend",
            ],

            // Other vendors
            http: ["axios"],
            icons: ["react-icons"],
          },
        },
      },
      // You might need to increase this limit for the new, larger mui-vendor chunk
      chunkSizeWarningLimit: 600,
    },
    test: {
      environment: "jsdom",
      setupFiles: ["./test/setup.ts"],
      globals: true,
    },
  };
});
