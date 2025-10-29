/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
  readonly VITE_PORT: string;
  readonly VITE_APP_NAME: string;
  readonly VITE_PAGINATION_DEFAULT_PAGE: string;
  readonly VITE_PAGINATION_DEFAULT_SIZE: string;
  readonly VITE_PAGINATION_DEFAULT_SORT: string;
  readonly VITE_DISPLAY_LIMIT: string;
  readonly VITE_BACKEND_URL: string;
  // Add any other VITE_ variables you use
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
