/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
  readonly VITE_PORT: number;
  readonly VITE_HTTP_PORT: number;
  readonly VITE_ENABLE_HTTP_REDIRECT: boolean;
  readonly VITE_APP_NAME: string;
  readonly VITE_PAGINATION_DEFAULT_PAGE: string;
  readonly VITE_PAGINATION_DEFAULT_SIZE: string;
  readonly VITE_PAGINATION_DEFAULT_SORT: string;
  readonly VITE_DISPLAY_LIMIT: string;
  readonly VITE_BACKEND_URL: string;
  readonly VITE_MAXSIZE_UPLOAD_MB: string;
  readonly VITE_SLIDER_MIN: string;
  readonly VITE_SLIDER_MAX: string;
  readonly VITE_MAX_NATIONAL_AWARD_ENTRIES: string;
  readonly VITE_MAX_LANGUAGE_CERT_ENTRIES: string;
  readonly VITE_MAX_INTERNATIONAL_CERT_ENTRIES: string;
  readonly VITE_ITEMS_PER_PAGE: string;
  readonly VITE_DATA_EXPIRATION_TIME: string;
  readonly VITE_GUEST_INACTIVITY_DURATION: string;
  readonly VITE_CLEANUP_INTERVAL: string;
  readonly VITE_THROTTLE_DURATION: string;
  readonly VITE_INITIAL_DELAY: string;
  readonly VITE_MAX_POLLING_TIME: string;
  readonly VITE_MAX_ATTEMPS: string;
  readonly VITE_RETRY_DELAY: string;
  readonly VITE_USE_EXPONENTIAL_BACKOFF: string;
  readonly VITE_MAX_BACKOFF_DELAYS: string;
  readonly VITE_DGNL_LIMIT: string;
  readonly VITE_VSAT_MIN_LIMIT: string;
  readonly VITE_VSAT_MAX_LIMIT: string;
  readonly VITE_NANG_KHIEU_LIMMIT: string;

  // Backend Configuration
  readonly VITE_USE_HTTPS_BACKEND: string;
  readonly VITE_BACKEND_HTTP_PORT: string;
  readonly VITE_BACKEND_HTTPS_PORT: string;

  // TLS Certificate Paths (Frontend Server)
  readonly VITE_TLS_KEY_PATH: string;
  readonly VITE_TLS_CERT_PATH: string;
  readonly VITE_TLS_CA_PATH: string;

  // Client Certificate Paths (for mTLS with backend)
  readonly VITE_TLS_CLIENT_KEY_PATH: string;
  readonly VITE_TLS_CLIENT_CERT_PATH: string;

  // Add any other VITE_ variables you use
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
