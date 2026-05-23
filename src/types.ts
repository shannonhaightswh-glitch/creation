export interface Position {
  x: number; // For free-float mode (percentage or pixels)
  y: number; // For free-float mode (percentage or pixels)
  gridRow: number; // 1-indexed row for grid mode
  gridCol: number; // 1-indexed col for grid mode
}

export type LauncherItemType = 'app' | 'folder';

export interface AppMetadata {
  id: string;
  name: string;
  icon: string; // Lucide icon identifier
  category: 'system' | 'setting' | 'developer' | 'hidden' | 'media' | 'social';
  description?: string;
  isSetting?: boolean;
  isHidden?: boolean;
}

export interface AppInstance {
  id: string; // Unique instance ID
  metadataId: string; // Refers to AppMetadata id
  type: 'app';
  position: Position;
  isFreeFloating: boolean;
  sizeMultiplier: number; // Scale factor, e.g. 1.0, 1.2
}

export interface FolderInstance {
  id: string; // Unique instance ID
  type: 'folder';
  name: string;
  color: string; // Folder circle bg color
  apps: AppInstance[]; // Nested apps (from 2 to 24)
  position: Position;
  isFreeFloating: boolean;
  sizeMultiplier: number; // Scale factor, e.g. 1.0, 1.2
  visualSize: 'sm' | 'md' | 'lg'; // Visual size modifier
  maxCapacity: number; // Cap of held apps (from 2 to 24)
}

export type LauncherItem = AppInstance | FolderInstance;

export interface LauncherConfig {
  gridCols: number; // 5 to 12
  gridRows: number; // 6 to 13
  iconSize: number; // 32 to 72 (in pixels)
  searchTransparency: number; // 0 to 100 (percentage transparent)
  searchTextColor: string; // HEX color
  searchEngine: 'google' | 'duckduckgo' | 'torrent' | 'termux';
  currentWallpaper: string;
  showHidden: boolean;
  enableDevOptions: boolean;
  deviceColor: string; // 'gold' | 'silver' | 'slate' | 'black' | 'auraglow'
  deviceModel?: 'note5' | 'note10'; // Simulated physical frame option
  fullscreen: boolean;
  sidebarApps: string[]; // List of AppMetadata IDs docked in the S-Pen edge sidebar
  gestureNavigation?: boolean;
  companion?: {
    name: string;
    hairStyle: 'bob' | 'spiky' | 'pony' | 'long' | 'asuka-twins' | 'rei-shaggy';
    hairColor: string;
    outfit: 'hoodie' | 'suit' | 'scifi' | 'casual' | 'plugsuit-red' | 'plugsuit-white' | 'school-uniform';
    outfitColor: string;
    accessory: 'none' | 'spen' | 'glasses' | 'headphones' | 'halo' | 'a10-clips';
    emotion: 'smiling' | 'thinking' | 'wink';
    enableTts: boolean;
    voicePitch: number;
    voiceRate: number;
    showOnDesktop: boolean;
    eyeColor?: string;
  };
}

export interface TorrentResult {
  title: string;
  seeds: number;
  leeches: number;
  size: string;
  uploaded: string;
  magnet: string;
  source: 'ThePirateBay' | 'Knaben';
}
