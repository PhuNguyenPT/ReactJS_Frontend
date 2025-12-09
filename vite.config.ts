/// <reference types="vitest/config" />
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import fs from "fs";
import path from "path";
import http from "http";
import https from "https";

export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory
  const env = loadEnv(mode, process.cwd(), "");

  // Frontend server certificates (for HTTPS server)
  const tlsKeyPath = path.resolve(
    process.cwd(),
    env.TLS_KEY_PATH || "./tls/frontend.key",
  );
  const tlsCertPath = path.resolve(
    process.cwd(),
    env.TLS_CERT_PATH || "./tls/frontend.crt",
  );
  const tlsCaPath = path.resolve(
    process.cwd(),
    env.TLS_CA_PATH || "./tls/ca.crt",
  );

  // Client certificates for mTLS (to authenticate with backend)
  const clientKeyPath = path.resolve(
    process.cwd(),
    env.TLS_CLIENT_KEY_PATH || "./tls/nginx-client.key",
  );
  const clientCertPath = path.resolve(
    process.cwd(),
    env.TLS_CLIENT_CERT_PATH || "./tls/nginx-client.crt",
  );

  const hasTlsCerts = fs.existsSync(tlsKeyPath) && fs.existsSync(tlsCertPath);

  // TLS configuration (only if certificates exist)
  const tlsConfig = hasTlsCerts
    ? {
        key: fs.readFileSync(tlsKeyPath),
        cert: fs.readFileSync(tlsCertPath),
        ca: fs.existsSync(tlsCaPath) ? fs.readFileSync(tlsCaPath) : undefined,
      }
    : undefined;

  // Determine frontend protocol and ports
  const httpsPort = parseInt(env.VITE_PORT) || 5173;
  const httpPort = parseInt(env.VITE_HTTP_PORT) || 5174;
  const protocol = hasTlsCerts ? "https" : "http";

  // Determine backend URL dynamically
  const useHttpsBackend = env.VITE_USE_HTTPS_BACKEND === "true";
  const backendProtocol = useHttpsBackend ? "https" : "http";
  const backendPort = useHttpsBackend
    ? env.VITE_BACKEND_HTTPS_PORT || "3443"
    : env.VITE_BACKEND_HTTP_PORT || "3001";
  const backendUrl = `${backendProtocol}://localhost:${backendPort}`;

  // Create HTTP redirect server if HTTPS is enabled
  if (hasTlsCerts && env.VITE_ENABLE_HTTP_REDIRECT !== "false") {
    const httpServer = http.createServer((req, res) => {
      const host = req.headers.host?.split(":")[0] ?? "localhost";
      const url = req.url ?? "/";
      const redirectUrl = `https://${host}:${httpsPort.toString()}${url}`;
      res.writeHead(301, { Location: redirectUrl });
      res.end();
    });

    httpServer.listen(httpPort, () => {
      console.log(
        `   🔀 HTTP redirect: http://localhost:${httpPort.toString()} → https://localhost:${httpsPort.toString()}`,
      );
    });
  }

  // Log configuration on startup
  console.log("\n🚀 Vite Development Server Configuration:");
  console.log(
    `   ${hasTlsCerts ? "🔒 HTTPS" : "🔓 HTTP"}: ${protocol}://localhost:${httpsPort.toString()}`,
  );
  console.log(`   Backend: ${backendUrl}${env.VITE_API_BASE_URL}`);
  if (hasTlsCerts) {
    console.log(
      `   ✓ TLS certificates loaded from ${path.dirname(tlsKeyPath)}/`,
    );
  } else {
    console.log(`   ℹ️  No TLS certificates found - using HTTP`);
  }
  console.log("");

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
      port: httpsPort,
      host: true,
      https: tlsConfig,

      proxy: {
        "/api": {
          target: backendUrl,
          changeOrigin: true,
          secure: false, // Allow self-signed certificates
          // Provide client certificates for mTLS when using HTTPS backend
          ...(useHttpsBackend &&
          fs.existsSync(clientKeyPath) &&
          fs.existsSync(clientCertPath)
            ? {
                agent: new https.Agent({
                  key: fs.readFileSync(clientKeyPath),
                  cert: fs.readFileSync(clientCertPath),
                  ca: fs.existsSync(tlsCaPath)
                    ? fs.readFileSync(tlsCaPath)
                    : undefined,
                  rejectUnauthorized: false, // Allow self-signed certificates
                }),
              }
            : {}),
          configure: (proxy) => {
            proxy.on("error", (err) => {
              console.log("❌ Proxy error:", err.message);
            });
          },
        },
      },
    },

    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            "react-vendor": ["react", "react-dom"],
            "mui-vendor": [
              "@mui/material",
              "@mui/icons-material",
              "@emotion/react",
              "@emotion/styled",
            ],
            router: ["react-router-dom"],
            i18n: [
              "i18next",
              "react-i18next",
              "i18next-browser-languagedetector",
              "i18next-http-backend",
            ],
            http: ["axios"],
            icons: ["react-icons"],
          },
        },
      },
      chunkSizeWarningLimit: 600,
    },

    test: {
      environment: "jsdom",
      setupFiles: ["./test/setup.ts"],
      globals: true,
    },
  };
});
