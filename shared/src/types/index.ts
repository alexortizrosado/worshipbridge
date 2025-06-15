// Common types used across the application

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
  createdAt: string;
  updatedAt: string;
}

export interface Playlist {
  id: string;
  name: string;
  description?: string;
  items: PlaylistItem[];
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

export interface PlaylistItem {
  id: string;
  type: 'media' | 'presentation';
  name: string;
  path: string;
  duration?: number;
  order: number;
}

export interface MediaFile {
  id: string;
  name: string;
  type: string;
  size: number;
  path: string;
  uploadedBy: string;
  uploadedAt: string;
  metadata?: Record<string, unknown>;
}

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
  | 'LOAD_PLAYLIST'
  | 'PLAY_MEDIA'
  | 'STOP_MEDIA'
  | 'NEXT_ITEM'
  | 'PREVIOUS_ITEM'
  | 'UPDATE_SETTINGS';

export type CommandStatus = 
  | 'PENDING'
  | 'PROCESSING'
  | 'COMPLETED'
  | 'FAILED';

export interface BridgeConfig {
  apiKey: string;
  userId: string;
  cloudApiUrl: string;
  propresenterPort: number;
  pollingInterval: number;
  autoStart: boolean;
}

export interface UpdateInfo {
  version: string;
  releaseDate: string;
  downloadUrl: string;
  checksum: string;
  platform: 'darwin' | 'win32';
  releaseNotes?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
} 