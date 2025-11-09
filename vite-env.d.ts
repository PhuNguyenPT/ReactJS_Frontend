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
  readonly VITE_MAXSIZE_UPLOAD_MB: string;
  readonly VITE_MAXSIZE_UPLOAD_IMAGE: string;
  readonly VITE_MAXSIZE_UPLOAD_DOCUMENT: string;
  readonly VITE_SLIDER_MIN: string;
  readonly VITE_SLIDER_MAX: string;
  readonly VITE_MAX_ENTRIES_PER_CATEGORY: string;
  readonly VITE_ITEMS_PER_PAGE: string;
  readonly VITE_DATA_EXPIRATION_TIME: string;
  readonly VITE_GUEST_INACTIVITY_DURATION: string;
  readonly VITE_CLEANUP_INTERVAL: string;
  readonly VITE_THROTTLE_DURATION: string;
  // Add any other VITE_ variables you use
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
