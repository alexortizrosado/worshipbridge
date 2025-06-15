// API Constants
export const API_VERSION = 'v1';
export const DEFAULT_POLLING_INTERVAL = 5000; // 5 seconds
export const MAX_RETRY_ATTEMPTS = 3;
export const RETRY_DELAY = 1000; // 1 second

// File Constants
export const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB
export const ALLOWED_FILE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'video/mp4',
  'video/quicktime',
  'application/pdf',
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation'
];

// Command Constants
export const COMMAND_TYPES = {
  LOAD_PLAYLIST: 'LOAD_PLAYLIST',
  PLAY_MEDIA: 'PLAY_MEDIA',
  STOP_MEDIA: 'STOP_MEDIA',
  NEXT_ITEM: 'NEXT_ITEM',
  PREVIOUS_ITEM: 'PREVIOUS_ITEM',
  UPDATE_SETTINGS: 'UPDATE_SETTINGS'
} as const;

export const COMMAND_STATUS = {
  PENDING: 'PENDING',
  PROCESSING: 'PROCESSING',
  COMPLETED: 'COMPLETED',
  FAILED: 'FAILED'
} as const;

// User Roles
export const USER_ROLES = {
  ADMIN: 'admin',
  USER: 'user'
} as const;

// Error Codes
export const ERROR_CODES = {
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  NOT_FOUND: 'NOT_FOUND',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  NETWORK_ERROR: 'NETWORK_ERROR',
  TIMEOUT: 'TIMEOUT'
} as const;

// Platform Constants
export const PLATFORMS = {
  DARWIN: 'darwin',
  WIN32: 'win32'
} as const;

// Default Configuration
export const DEFAULT_CONFIG = {
  propresenterPort: 8080,
  pollingInterval: DEFAULT_POLLING_INTERVAL,
  autoStart: false
} as const; 