export const FILE_SIZE_LIMITS = {
  maxSize: Number(import.meta.env.VITE_MAXSIZE_UPLOAD_MB),
} as const;

// Supported file types configuration
export const ACCEPTED_FILE_TYPES = {
  images: ".jpg,.jpeg,.png,.gif,.bmp,.webp,.svg",
  documents: ".pdf,.doc,.docx,.txt,.odt,.rtf",
} as const;

export const ALL_ACCEPTED_TYPES = `${ACCEPTED_FILE_TYPES.images},${ACCEPTED_FILE_TYPES.documents}`;
