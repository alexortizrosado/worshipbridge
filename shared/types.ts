export interface Slide {
  type: 'slide';
  title: string;
  lines: string[];
  template: string;
}

export interface Media {
  type: 'media';
  url: string;
}

export type PlaylistItem = Slide | Media;

export interface Playlist {
  name: string;
  items: PlaylistItem[];
}

export interface Command {
  type: 'create_playlist' | 'add_slide' | 'add_media' | 'trigger_presentation';
  userId: string;
  command: {
    playlistName?: string;
    title?: string;
    lines?: string[];
    template?: string;
    url?: string;
  };
  timestamp: string;
}

export interface BridgeConfig {
  apiKey: string;
  userId: string;
  cloudApiUrl: string;
  propresenterPort: number;
  pollingInterval: number;
  autoStart: boolean;
}

export interface User {
  sub: string;
  email: string;
  username: string;
} 