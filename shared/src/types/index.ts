// Common types used across the application

// User Types
export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

export type UserRole = 'admin' | 'user';

// Playlist Types
export interface Playlist {
  id: string;
  name: string;
  description?: string;
  items: PlaylistItem[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface PlaylistItem {
  id: string;
  type: 'media' | 'command';
  mediaId?: string;
  command?: Command;
  order: number;
  duration?: number;
}

// Media Types
export interface MediaFile {
  id: string;
  name: string;
  type: MediaType;
  size: number;
  url: string;
  thumbnailUrl?: string;
  duration?: number;
  uploadedBy: string;
  uploadedAt: string;
}

export type MediaType = 'image' | 'video' | 'audio' | 'document';

// Command Types
export interface Command {
  id: string;
  type: CommandType;
  payload: unknown;
  status: CommandStatus;
  createdAt: string;
  processedAt?: string;
  error?: string;
}

export type CommandType = 
  | 'PLAY_MEDIA'
  | 'STOP_MEDIA'
  | 'NEXT_SLIDE'
  | 'PREVIOUS_SLIDE'
  | 'GO_TO_SLIDE'
  | 'CLEAR_PLAYLIST'
  | 'LOAD_PLAYLIST'
  | 'UPDATE_SETTINGS';

export type CommandStatus = 
  | 'PENDING'
  | 'PROCESSING'
  | 'COMPLETED'
  | 'FAILED';

// Bridge Configuration
export interface BridgeConfig {
  apiKey: string;
  userId: string;
  cloudApiUrl: string;
  propresenterPort: number;
  pollingInterval: number;
  autoStart: boolean;
}

// Update Information
export interface UpdateInfo {
  version: string;
  releaseDate: string;
  releaseNotes: string;
  downloadUrl: string;
  checksum: string;
}

// API Response
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
  };
}

// Error Types
export interface ApiError extends Error {
  code: string;
  status: number;
  details?: unknown;
}

// Validation Types
export interface ValidationError {
  field: string;
  message: string;
  code: string;
}

// Platform Types
export type Platform = 'mac' | 'win' | 'linux';

export interface PlatformConfig {
  platform: Platform;
  isSupported: boolean;
  requirements?: {
    minVersion?: string;
    architecture?: string[];
  };
} 