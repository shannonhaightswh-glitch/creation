import { AppMetadata } from './types';

export const APP_METADATA_LIST: AppMetadata[] = [
  // --- SYSTEM & CORE CUSTOM APPS ---
  { id: 'phone', name: 'Phone', icon: 'Phone', category: 'system', description: 'Make and receive calls, dialer interface.' },
  { id: 'messages', name: 'Messages', icon: 'MessageSquare', category: 'system', description: 'Send SMS and MMS, chat with contacts.' },
  { id: 'chrome', name: 'Chrome', icon: 'Globe', category: 'system', description: 'Access the world wide web safely.' },
  { id: 'gallery', name: 'Gallery', icon: 'Image', category: 'system', description: 'View and edit photos and captured media.' },
  { id: 'camera', name: 'Camera', icon: 'Camera', category: 'system', description: 'Capture precious moments, HD video records.' },
  { id: 's-note', name: 'S Note', icon: 'FileText', category: 'system', description: 'Samsung note-taking app optimized for S-Pen.' },
  { id: 'scrapbook', name: 'Scrapbook', icon: 'Bookmark', category: 'system', description: 'Save and categorize web clippings, notes, and media.' },
  { id: 's-voice', name: 'S Voice', icon: 'Mic', category: 'system', description: 'Samsung legacy voice command assistant.' },
  { id: 'play-store', name: 'Play Store', icon: 'ShoppingBag', category: 'system', description: 'Download applications and games.' },
  { id: 'my-files', name: 'My Files', icon: 'FolderOpen', category: 'system', description: 'Access internal storage, downloads, and hidden files.' },
  { id: 'contacts', name: 'Contacts', icon: 'Users', category: 'system', description: 'Manage phone contacts, emails, and address book.' },
  { id: 'calendar', name: 'S Planner', icon: 'Calendar', category: 'system', description: 'Samsung planner and calendar scheduling.' },
  { id: 'calculator', name: 'Calculator', icon: 'Calculator', category: 'system', description: 'Solve computations swiftly.' },
  { id: 'clock', name: 'Clock', icon: 'Clock', category: 'system', description: 'Set alarms, timer, stopwatch, and world hours.' },
  { id: 'music', name: 'Music Player', icon: 'Music', category: 'media', description: 'Enjoy local high-fidelity audio tracks.' },
  { id: 'voice-recorder', name: 'Voice Recorder', icon: 'Volume2', category: 'media', description: 'Record voice memos with interview-grade filters.' },
  { id: 'smart-manager', name: 'Smart Manager', icon: 'Shield', category: 'system', description: 'Optimize system battery, storage, RAM, and virus scans.' },
  { id: 'sketchbook', name: 'Sketchbook', icon: 'Palette', category: 'media', description: 'Professional drawing tool customized for S-Pen.' },
  { id: 'pen-up', name: 'Pen-Up', icon: 'Heart', category: 'social', description: 'Social platform for sharing S-Pen artwork.' },
  { id: 'sidesync', name: 'SideSync', icon: 'Laptop', category: 'system', description: 'Mirror screen and share keyboard/files to PC.' },
  { id: 'termux', name: 'Termux', icon: 'Terminal', category: 'system', description: 'Advanced terminal emulator and Linux environment.' },
  { id: 'vnc-host', name: 'VNC Host', icon: 'Network', category: 'system', description: 'Simulated VNC Server & Viewer to broadcast or configure remote desktop control hosts.' },
  { id: 'companion-studio', name: 'Companion Studio', icon: 'Smile', category: 'system', description: 'Interact and fully customize your human AI companion. Adjust hair, outfit, emotions, talking speed and speak with them.' },

  // --- SETTINGS (IsSetting Flag) ---
  { id: 'setting-wifi', name: 'Wi-Fi & Connections', icon: 'Wifi', category: 'setting', isSetting: true, description: 'Connect to networks and hotspots.' },
  { id: 'setting-bluetooth', name: 'Bluetooth Options', icon: 'Bluetooth', category: 'setting', isSetting: true, description: 'Connect and exchange data with external devices.' },
  { id: 'setting-display', name: 'Display Settings', icon: 'Sun', category: 'setting', isSetting: true, description: 'Adjust brightness, AMOLED screen modes, and timeout.' },
  { id: 'setting-notifications', name: 'Notifications Manager', icon: 'Bell', category: 'setting', isSetting: true, description: 'Control lock screen and badge alert triggers.' },
  { id: 'setting-spen', name: 'S Pen Functions', icon: 'PenTool', category: 'setting', isSetting: true, description: 'Customize screen-off memo, air command menu, and sound feedback.' },
  { id: 'setting-edge', name: 'Edge Panel Control', icon: 'Layers', category: 'setting', isSetting: true, description: 'Configure quick drawer, application docks, and news feeds.' },
  { id: 'setting-battery', name: 'Battery Care', icon: 'BatteryCharging', category: 'setting', isSetting: true, description: 'Manage fast charging, power-saving profiles, and stats.' },
  { id: 'setting-storage', name: 'Storage & RAM', icon: 'Cpu', category: 'setting', isSetting: true, description: 'Clean cache files and view storage chunks.' },
  { id: 'setting-security', name: 'Lock Screen & Security', icon: 'Lock', category: 'setting', isSetting: true, description: 'Control Fingerprint scanner, Knox security folder, and PINs.' },
  { id: 'setting-about', name: 'About Note 5+', icon: 'Info', category: 'setting', isSetting: true, description: 'Check system model SM-N920, serial number, and security patch.' },

  // --- DEVELOPER SETTINGS (IsDev Flag) ---
  { id: 'dev-mode', name: 'Developer Options', icon: 'Sliders', category: 'developer', isSetting: true, description: 'System-level modifications, layout visualizers, diagnostics.' },
  { id: 'dev-usb-debug', name: 'USB Debugging', icon: 'Cable', category: 'developer', isSetting: true, description: '[Dev] Allows ADB triggers, custom command overrides, logging.' },
  { id: 'dev-oem-unlock', name: 'OEM Unlocking', icon: 'KeySquare', category: 'developer', isSetting: true, description: '[Dev] Enable security bootloader release toggles.' },
  { id: 'dev-gpu', name: 'Force GPU Rendering', icon: 'Zap', category: 'developer', isSetting: true, description: '[Dev] Render all 2D views using graphics hardware engine.' },
  { id: 'dev-layout-bounds', name: 'Show Layout Bounds', icon: 'Scan', category: 'developer', isSetting: true, description: '[Dev] Draw margins, paddings, and clip bounds directly.' },
  { id: 'dev-animations', name: 'Animation Scales', icon: 'Sparkles', category: 'developer', isSetting: true, description: '[Dev] Limit transition intervals (0.5x, 1x, or completely off).' },

  // --- HIDDEN FILES & SECRET APPS (IsHidden Flag) ---
  { id: 'hidden-files', name: '.secure_files.vault', icon: 'Archive', category: 'hidden', isHidden: true, description: 'Hidden vault containing encryption headers.' },
  { id: 'hidden-bitcoin', name: 'bitcoin_wallet.dat', icon: 'Coins', category: 'hidden', isHidden: true, description: 'Hidden local wallet backup keyfile.' },
  { id: 'hidden-exploit', name: 'root_exploit_n5.sh', icon: 'FileCode2', category: 'hidden', isHidden: true, description: 'Custom exploit script to bypass Knox status flags.' },
  { id: 'hidden-diary', name: 'diary_december_2015.txt', icon: 'BookOpen', category: 'hidden', isHidden: true, description: 'Notes on old galaxy launch events.' },
  { id: 'hidden-superuser', name: 'SuperUser App (SU)', icon: 'Terminal', category: 'hidden', isHidden: true, description: 'Root permissions administrator and firewall monitor.' },
  { id: 'hidden-messenger', name: 'ShadowChat', icon: 'EyeOff', category: 'hidden', isHidden: true, description: 'Encrypted peer-to-peer hidden messenger app.' },
  { id: 'hidden-knox-bypass', name: 'Knox Tripper V2', icon: 'AlertOctagon', category: 'hidden', isHidden: true, description: 'Internal experimental module to prevent Knox warranty bit trigger.' }
];

export const WALLPAPERS = [
  { id: 'note5-classic', name: 'Note 5 Dark Prism', style: 'linear-gradient(135deg, #101525 0%, #1e1b38 40%, #0d2c3e 100%)' },
  { id: 'gold-luxury', name: 'Note 5 Golden Satin', style: 'linear-gradient(135deg, #1d1810 0%, #3e3320 50%, #17130b 100%)' },
  { id: 'titanium-silver', name: 'Note 5 Titanium Wave', style: 'linear-gradient(135deg, #1d2024 0%, #383d47 60%, #1c1e22 100%)' },
  { id: 'neon-cyberpunk', name: 'Neo Cyberpunk Grid', style: 'radial-gradient(circle at center, #1b0e30 0%, #06020c 100%)' },
  { id: 'minimal-charcoal', name: 'Minimal Charcoal Matte', style: '#121212' },
  { id: 'ocean-spark', name: 'Ocean Air Command', style: 'linear-gradient(135deg, #09203f 0%, #537895 100%)' }
];

export const MOCK_TORRENTS = [
  // pirate bay
  { title: 'Termux SDK Packages Full (2026)', seeds: 432, leeches: 25, size: '2.4 GB', uploaded: 'May 12, 2026', magnet: 'magnet:?xt=urn:btih:t3rmuxsDkPack@g..', source: 'ThePirateBay' },
  { title: 'Samsung Galaxy Backup Exploit Suite', seeds: 182, leeches: 12, size: '42 MB', uploaded: 'Apr 28, 2026', magnet: 'magnet:?xt=urn:btih:n5Exploits2026..', source: 'ThePirateBay' },
  { title: 'Retro Launcher Wallpaper Pack High-Res', seeds: 840, leeches: 55, size: '840 MB', uploaded: 'May 01, 2026', magnet: 'magnet:?xt=urn:btih:retWpPackHres..', source: 'ThePirateBay' },
  { title: 'Linux On DeX Note 5 Kernel Source', seeds: 76, leeches: 4, size: '150 MB', uploaded: 'Mar 15, 2026', magnet: 'magnet:?xt=urn:btih:linuxOnDexN5f..', source: 'ThePirateBay' },
  // knaben
  { title: 'Superuser Core Binaries (Recovery Flashable)', seeds: 928, leeches: 32, size: '12 MB', uploaded: 'May 20, 2026', magnet: 'magnet:?xt=urn:btih:suCoreRecovery..', source: 'Knaben' },
  { title: 'Note 5+ Custom ROM Build - S8 Dream UX v4.2', seeds: 110, leeches: 8, size: '1.8 GB', uploaded: 'Jan 10, 2026', magnet: 'magnet:?xt=urn:btih:n5DreamUxv42..', source: 'Knaben' },
  { title: '[S-Pen Drawing App] Sketchbook Pro Unlocked v11.3', seeds: 1240, leeches: 140, size: '120 MB', uploaded: 'May 18, 2026', magnet: 'magnet:?xt=urn:btih:sketchProUnl113..', source: 'Knaben' }
];
