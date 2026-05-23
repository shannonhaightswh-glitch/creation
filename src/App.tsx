import React, { useState, useEffect, useRef } from 'react';
import { 
  Wifi, Battery, Signal, Shield, ToggleLeft, ToggleRight, Trash2, 
  Settings as SettingsIcon, PenTool, CheckSquare, RefreshCw,
  FolderOpen, Terminal, Phone, Image as ImageIcon, FileText, Info, Network,
  Smile
} from 'lucide-react';

import { LauncherConfig, LauncherItem, AppMetadata, FolderInstance, AppInstance } from './types';
import { APP_METADATA_LIST, WALLPAPERS } from './data';

import DeviceFrame from './components/DeviceFrame';
import SearchWidget from './components/SearchWidget';
import SidebarPanel from './components/SidebarPanel';
import FolderDialog from './components/FolderDialog';
import LauncherView from './components/LauncherView';
import SettingsPanel from './components/SettingsPanel';
import CompanionMascot from './components/CompanionMascot';
import CompanionStudio from './components/CompanionStudio';

// Default configuration parameters
const DEFAULT_CONFIG: LauncherConfig = {
  gridCols: 5,
  gridRows: 6,
  iconSize: 52,
  searchTransparency: 30,
  searchTextColor: '#ffffff',
  searchEngine: 'google',
  currentWallpaper: 'linear-gradient(135deg, #101525 0%, #1e1b38 40%, #0d2c3e 100%)',
  showHidden: false,
  enableDevOptions: false,
  deviceColor: 'slate',
  deviceModel: 'note5',
  fullscreen: false,
  sidebarApps: ['s-note', 'play-store', 'termux', 'gallery'],
  companion: {
    name: 'Miyu',
    hairStyle: 'bob',
    hairColor: '#ec4899',
    outfit: 'hoodie',
    outfitColor: '#2563eb',
    accessory: 'spen',
    emotion: 'smiling',
    enableTts: true,
    voicePitch: 1.15,
    voiceRate: 1.0,
    showOnDesktop: true
  }
};

// Initial homescreen placements matching standard TouchWiz design
const INITIAL_ITEMS: LauncherItem[] = [
  {
    id: 'app_phone',
    metadataId: 'phone',
    type: 'app',
    position: { x: 0, y: 0, gridRow: 6, gridCol: 1 },
    isFreeFloating: false,
    sizeMultiplier: 1.0
  },
  {
    id: 'app_messages',
    metadataId: 'messages',
    type: 'app',
    position: { x: 0, y: 0, gridRow: 6, gridCol: 2 },
    isFreeFloating: false,
    sizeMultiplier: 1.0
  },
  {
    id: 'app_chrome',
    metadataId: 'chrome',
    type: 'app',
    position: { x: 0, y: 0, gridRow: 6, gridCol: 4 },
    isFreeFloating: false,
    sizeMultiplier: 1.0
  },
  {
    id: 'app_snote',
    metadataId: 's-note',
    type: 'app',
    position: { x: 0, y: 0, gridRow: 2, gridCol: 2 },
    isFreeFloating: false,
    sizeMultiplier: 1.15
  },
  {
    id: 'app_termux',
    metadataId: 'termux',
    type: 'app',
    position: { x: 0, y: 0, gridRow: 2, gridCol: 4 },
    isFreeFloating: false,
    sizeMultiplier: 1.0
  },
  {
    id: 'app_myfiles',
    metadataId: 'my-files',
    type: 'app',
    position: { x: 0, y: 0, gridRow: 3, gridCol: 3 },
    isFreeFloating: false,
    sizeMultiplier: 1.0
  },
  {
    id: 'app_companion',
    metadataId: 'companion-studio',
    type: 'app',
    position: { x: 0, y: 0, gridRow: 4, gridCol: 2 },
    isFreeFloating: false,
    sizeMultiplier: 1.15
  },
  {
    id: 'app_settings',
    metadataId: 'setting-about',
    type: 'app',
    position: { x: 0, y: 0, gridRow: 6, gridCol: 5 },
    isFreeFloating: false,
    sizeMultiplier: 1.0
  },
  {
    id: 'folder_office',
    type: 'folder',
    name: 'S-Tools',
    color: 'bg-blue-600/35 border-blue-500/40 text-blue-300',
    apps: [
      {
        id: 'nested_calc',
        metadataId: 'calculator',
        type: 'app',
        position: { x: 0, y: 0, gridRow: 0, gridCol: 0 },
        isFreeFloating: false,
        sizeMultiplier: 1.0
      },
      {
        id: 'nested_calendar',
        metadataId: 'calendar',
        type: 'app',
        position: { x: 0, y: 0, gridRow: 0, gridCol: 0 },
        isFreeFloating: false,
        sizeMultiplier: 1.0
      }
    ],
    position: { x: 0, y: 0, gridRow: 3, gridCol: 2 },
    isFreeFloating: false,
    sizeMultiplier: 1.0,
    visualSize: 'md',
    maxCapacity: 8
  }
];

export default function App() {
  const [config, setConfig] = useState<LauncherConfig>(() => {
    const saved = localStorage.getItem('note5_config');
    return saved ? JSON.parse(saved) : DEFAULT_CONFIG;
  });

  // Companion configuration bindings conforming to user customization properties
  const companionConfig = config.companion || {
    name: 'Miyu',
    hairStyle: 'bob',
    hairColor: '#ec4899',
    outfit: 'hoodie',
    outfitColor: '#2563eb',
    accessory: 'spen',
    emotion: 'smiling',
    enableTts: true,
    voicePitch: 1.15,
    voiceRate: 1.0,
    showOnDesktop: true
  };

  const setCompanionConfig = (newCompanion: any) => {
    setConfig(prev => {
      const currentVal = prev.companion || companionConfig;
      const updated = typeof newCompanion === 'function' ? newCompanion(currentVal) : newCompanion;
      return {
        ...prev,
        companion: updated
      };
    });
  };

  const [items, setItems] = useState<LauncherItem[]>(() => {
    const saved = localStorage.getItem('note5_items');
    return saved ? JSON.parse(saved) : INITIAL_ITEMS;
  });

  const [sPenActive, setSPenActive] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeFolder, setActiveFolder] = useState<FolderInstance | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  
  // Simulated hardware status
  const [currentTime, setCurrentTime] = useState('');
  const [batteryPct, setBatteryPct] = useState(87);

  // Active Simulated Application viewport overlays
  const [activeAppScreen, setActiveAppScreen] = useState<string | null>(null);

  // Web S Notes Scribbler Canvas ref
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [penColor, setPenColor] = useState('#2563eb');
  const [hasScribble, setHasScribble] = useState(false);

  // Calculator Screen State
  const [calcDisplay, setCalcDisplay] = useState('');

  // Phone state codes
  const [dialNum, setDialNum] = useState('');
  const [callingState, setCallingState] = useState(false);

  // Gesture flash helper
  const [edgeFlash, setEdgeFlash] = useState<'left' | 'right' | null>(null);
  const triggerEdgeFlash = (side: 'left' | 'right') => {
    setEdgeFlash(side);
    setTimeout(() => setEdgeFlash(null), 350);
  };

  // VNC Host Simulated Server Core State
  const [vncActive, setVncActive] = useState(true);
  const [vncPort, setVncPort] = useState(5900);
  const [vncPassword, setVncPassword] = useState('knoxnote5');
  const [vncEncryption, setVncEncryption] = useState('TightVNC Client-DES');
  const [vncCompress, setVncCompress] = useState(7);
  const [vncClients, setVncClients] = useState([
    { id: '1', hostname: 'PC-Remmina-Viewer', ip: '192.168.1.45', connected: true },
    { id: '2', hostname: 'MacBook-Screens-Pro', ip: '192.168.1.189', connected: true },
    { id: '3', hostname: 'iPad-VNC-Pocket', ip: '10.0.0.84', connected: false }
  ]);
  const [vncFrames, setVncFrames] = useState(25840);
  const [vncLogs, setVncLogs] = useState<string[]>([
    'VNC Engine socket activated on port 5900 successfully.',
    'Broadcasting buffer route: vnc://127.0.0.1:5900',
    'Client [PC-Remmina-Viewer] authenticated from remote subnet.',
    'Client [MacBook-Screens-Pro] connected via active TLS secure tunnel.',
    'Input Event thread synchronized with physical digitizer system.'
  ]);
  const [vncActiveTab, setVncActiveTab] = useState<'server' | 'clients' | 'logs'>('server');
  const [vncCursor, setVncCursor] = useState({ x: 140, y: 110 });

  // VNC Server live broadcasting tick simulation
  useEffect(() => {
    let interval: any = null;
    if (vncActive) {
      interval = setInterval(() => {
        setVncFrames(prev => prev + Math.floor(Math.random() * 4 + 6));
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [vncActive]);

  // Fetch live system timestamp
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      let hours = now.getHours();
      const mins = now.getMinutes().toString().padStart(2, '0');
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12 || 12;
      setCurrentTime(`${hours}:${mins} ${ampm}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('note5_config', JSON.stringify(config));
  }, [config]);

  useEffect(() => {
    localStorage.setItem('note5_items', JSON.stringify(items));
  }, [items]);

  // Initial setup for Note Canvas
  useEffect(() => {
    if (activeAppScreen === 's-note' && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';
        ctx.lineWidth = 3.5;
        ctx.strokeStyle = penColor;
      }
    }
  }, [activeAppScreen, penColor]);

  // Factory settings reset method
  const handleFactoryReset = () => {
    if (window.confirm('Are you absolutely sure you want to perform a Note 5 factory reset? This deletes all custom layouts, grids, app shortcuts, and color presets.')) {
      setConfig(DEFAULT_CONFIG);
      setItems(INITIAL_ITEMS);
      setActiveAppScreen(null);
      setActiveFolder(null);
      setSPenActive(false);
      setIsEditMode(false);
    }
  };

  const updateConfig = (updater: (prev: LauncherConfig) => LauncherConfig) => {
    setConfig(prev => updater(prev));
  };

  // Launching simulations
  const launchAppInstance = (appId: string) => {
    if (appId.startsWith('setting-') || appId === 'dev-mode') {
      setActiveAppScreen('settings');
    } else {
      setActiveAppScreen(appId);
    }
  };

  // Canvas Doodle drawing handlers
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.strokeStyle = penColor;
    
    let clientX, clientY;
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const bounds = canvas.getBoundingClientRect();
    const x = clientX - bounds.left;
    const y = clientY - bounds.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
    setHasScribble(true);
  };

  const drawScribbling = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let clientX, clientY;
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const bounds = canvas.getBoundingClientRect();
    const x = clientX - bounds.left;
    const y = clientY - bounds.top;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const wipeScribbles = () => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        setHasScribble(false);
      }
    }
  };

  // Core back hardware trigger
  const handleHardwareBack = () => {
    if (activeAppScreen) {
      setActiveAppScreen(null);
    } else if (activeFolder) {
      setActiveFolder(null);
    } else if (sidebarOpen) {
      setSidebarOpen(false);
    }
  };

  // Recent apps opens customization config directly
  const handleHardwareRecent = () => {
    if (activeAppScreen === 'settings') {
      setActiveAppScreen(null);
    } else {
      setActiveAppScreen('settings');
    }
  };

  return (
    <DeviceFrame
      fullscreen={config.fullscreen}
      deviceColor={config.deviceColor}
      setDeviceColor={(color) => updateConfig(prev => ({ ...prev, deviceColor: color }))}
      deviceModel={config.deviceModel || 'note5'}
      setDeviceModel={(model) => updateConfig(prev => ({ 
        ...prev, 
        deviceModel: model, 
        // If transitioning to Note 10, default color to 'auraglow', if Note 5 default to 'slate' 
        deviceColor: model === 'note10' ? 'auraglow' : 'slate'
      }))}
      onHomeClick={() => {
        setActiveAppScreen(null);
        setActiveFolder(null);
        setSPenActive(false);
      }}
      onBackClick={handleHardwareBack}
      onRecentClick={handleHardwareRecent}
      sPenActive={sPenActive}
      setSPenActive={setSPenActive}
      onLaunchApp={launchAppInstance}
      gestureNavigation={!!config.gestureNavigation}
    >
      {/* Simulation Screen Content inside frame */}
      <div 
        id="note5_display_canvas"
        style={{ background: config.currentWallpaper }}
        className="w-full h-full relative font-sans flex flex-col justify-between overflow-hidden select-none"
      >
        
        {/* TOP STATUS BAR ACCENTS (Battery, wifi, and live UTC clock) */}
        <div className="w-full h-6 shrink-0 bg-black/25 backdrop-blur-sm px-3.5 flex justify-between items-center text-[10px] text-white/90 z-45 font-semibold">
          <div className="flex items-center gap-1.5">
            <span>2026 UTC</span>
            {sPenActive ? (
              <span className="bg-sky-500 text-white text-[7px] font-bold px-1 rounded animate-pulse">S-Pen Drawn</span>
            ) : (
              <span className="text-white/40 text-[8px]">S-Pen Locked</span>
            )}
            
            {config.enableDevOptions && (
              <span className="bg-amber-600 text-white text-[7px] font-extrabold px-1 rounded">ADB</span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Wifi size={11} className="text-white" />
            <Signal size={11} className="text-white" />
            <div className="flex items-center gap-1.5">
              <span>{batteryPct}%</span>
              <Battery size={13} className="text-emerald-400 rotate-90 scale-90" />
            </div>
            <div className="h-2.5 w-[1px] bg-white/20" />
            <span className="font-mono">{currentTime}</span>
          </div>
        </div>

        {/* MAIN DESKTOP LAUNCHER CORE VIEWPORT */}
        <div className="flex-1 w-full relative flex flex-col justify-start">
          
          {/* Transparent Customizable Search Widget Header */}
          <SearchWidget
            config={config}
            updateConfig={updateConfig}
            onLaunchApp={launchAppInstance}
            allApps={APP_METADATA_LIST}
          />

          {/* Desktop App Icons & Custom Grid Snapper */}
          <LauncherView
            config={config}
            items={items}
            setItems={setItems}
            allApps={APP_METADATA_LIST}
            onLaunchApp={launchAppInstance}
            onOpenFolderSettings={(folder) => setActiveFolder(folder)}
            isEditMode={isEditMode}
            setIsEditMode={setIsEditMode}
          />

          {/* FLOATING DESKTOP HUMAN COMPANION WIDGET */}
          {companionConfig.showOnDesktop && !activeAppScreen && (
            <div className="absolute bottom-4 right-3 z-40 flex flex-col items-center group">
              
              {/* Cute speech pocket balloon */}
              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 absolute bottom-18 mb-1 max-w-[150px] bg-slate-950/95 border border-slate-800 text-[9px] text-slate-100 p-1.5 rounded-lg shadow-xl pointer-events-none text-center">
                <span className="font-bold text-sky-400 block mb-0.5">{companionConfig.name}</span>
                "Double-click me to open my studio!"
                <div className="absolute left-1/2 -bottom-1 -translate-x-1/2 w-1.5 h-1.5 bg-slate-950 border-r border-b border-slate-800 transform rotate-45" />
              </div>

              {/* Action circle container with responsive bounce */}
              <button
                onDoubleClick={() => launchAppInstance('companion-studio')}
                onClick={() => {
                  // Instant randomized spoken greetings
                  const greetings = [
                    "Let's sketch a doodle with the S-Pen!",
                    "This virtual Galaxy Note 5 dashboard is incredible!",
                    "I love my customized clothes and appearance!",
                    "Double-click me to open Companion Studio!",
                    "You are doing an incredibly amazing job today!"
                  ];
                  const rand = greetings[Math.floor(Math.random() * greetings.length)];
                  // Call speech synthesis
                  if (companionConfig.enableTts && typeof window !== 'undefined' && window.speechSynthesis) {
                    window.speechSynthesis.cancel();
                    const u = new SpeechSynthesisUtterance(rand);
                    u.pitch = companionConfig.voicePitch || 1.15;
                    u.rate = companionConfig.voiceRate || 1.0;
                    window.speechSynthesis.speak(u);
                  }
                }}
                className="w-16 h-16 rounded-full cursor-pointer hover:scale-110 active:scale-95 transition-all duration-300 flex items-center justify-center relative hover:shadow-lg hover:shadow-sky-500/20 animate-bounce"
                style={{ animationDuration: '3.5s' }}
                title={`${companionConfig.name} - Double-click to configure customization or chat!`}
              >
                <CompanionMascot
                  hairStyle={companionConfig.hairStyle}
                  hairColor={companionConfig.hairColor}
                  outfit={companionConfig.outfit}
                  outfitColor={companionConfig.outfitColor}
                  accessory={companionConfig.accessory}
                  emotion={companionConfig.emotion}
                  isSpeaking={false}
                  eyeColor={companionConfig.eyeColor}
                  size={64}
                />
              </button>
              
              {/* Name caption tag */}
              <span className="text-[8.5px] font-bold text-white/80 bg-slate-950/80 px-1.5 py-0.5 rounded-full border border-white/5 pointer-events-none mt-1 shadow">
                {companionConfig.name}
              </span>
            </div>
          )}
        </div>

        {/* Sliding quick favorite docking sidebar bar */}
        <SidebarPanel
          isOpen={sidebarOpen}
          setIsOpen={setSidebarOpen}
          config={config}
          updateConfig={updateConfig}
          onLaunchApp={launchAppInstance}
          allApps={APP_METADATA_LIST}
        />

        {/* FOLDER PROPERTIES CONFIG POPUP DRAWER */}
        {activeFolder && (
          <FolderDialog
            folder={activeFolder}
            config={config}
            allApps={APP_METADATA_LIST}
            onUpdateFolder={(updated) => {
              setItems(prev => prev.map(item => item.id === updated.id ? updated : item));
              setActiveFolder(updated);
            }}
            onClose={() => setActiveFolder(null)}
          />
        )}

        {/* SIMULATED FULL SCREEN SYSTEM APP OVERLAYS */}
        {activeAppScreen && (
          <div className="absolute inset-0 bg-slate-950 z-48 flex flex-col text-slate-100 animate-in fade-in duration-200">
            {/* Mock Application Top Navigation headers */}
            <div className="p-3 bg-slate-900 border-b border-slate-800 flex justify-between items-center bg-gradient-to-r from-slate-900 to-slate-850">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 bg-sky-500 rounded-full animate-ping" />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-200">
                  {APP_METADATA_LIST.find(a => a.id === activeAppScreen)?.name || activeAppScreen.toUpperCase()}
                </span>
              </div>
              <button 
                onClick={() => setActiveAppScreen(null)}
                className="bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 font-bold px-2.5 py-1 rounded cursor-pointer transition border border-white/5"
              >
                Exit App
              </button>
            </div>

            {/* Simulated App Viewport bodies */}
            <div className="flex-1 w-full overflow-y-auto relative p-4 text-center">
              
              {/* APP 1: SETTINGS MANAGER */}
              {activeAppScreen === 'settings' && (
                <SettingsPanel
                  config={config}
                  updateConfig={updateConfig}
                  onReset={handleFactoryReset}
                />
              )}

              {/* APP 2: S-NOTE WRITER & DRAWING CANVAS */}
              {activeAppScreen === 's-note' && (
                <div className="w-full h-full flex flex-col gap-3 text-left">
                  <div className="flex justify-between items-center shrink-0">
                    <div>
                      <h4 className="text-xs font-bold text-slate-300">S-Pen Scribble Pad Canvas</h4>
                      <p className="text-[10px] text-slate-500">Draw freestyle lines on your AMOLED glass simulation.</p>
                    </div>
                    
                    <div className="flex items-center gap-1.5">
                      {['#2563eb', '#22c55e', '#ef4444', '#f59e0b', '#ffffff'].map(c => (
                        <button
                          key={c}
                          onClick={() => setPenColor(c)}
                          style={{ backgroundColor: c }}
                          className={`w-5 h-5 rounded-full border border-slate-950 cursor-pointer ${penColor === c ? 'ring-2 ring-sky-400' : ''}`}
                        />
                      ))}
                      <button 
                        onClick={wipeScribbles}
                        className="text-[10px] px-2 py-1 bg-red-950/40 text-red-400 rounded hover:bg-red-950/90 font-bold transition cursor-pointer ml-2"
                      >
                        Wipe Canvas
                      </button>
                    </div>
                  </div>

                  {/* HTML Drawing Container canvas box */}
                  <div className="flex-1 border-2 border-dashed border-slate-800 rounded-xl bg-slate-900/60 overflow-hidden relative">
                    <canvas
                      ref={canvasRef}
                      width={310}
                      height={240}
                      onMouseDown={startDrawing}
                      onMouseMove={drawScribbling}
                      onMouseUp={stopDrawing}
                      onMouseLeave={stopDrawing}
                      onTouchStart={startDrawing}
                      onTouchMove={drawScribbling}
                      onTouchEnd={stopDrawing}
                      className="w-full h-full cursor-pencil touch-none"
                    />
                    {!hasScribble && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 pointer-events-none text-slate-500 text-center p-4">
                        <PenTool size={28} className="text-slate-600 animate-pulse" />
                        <span className="text-xs font-bold font-mono">Drag mouse or Draw with S-Pen inside this viewport!</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* APP 3: DIALER PHONE */}
              {activeAppScreen === 'phone' && (
                <div className="w-full max-w-[280px] mx-auto flex flex-col gap-4 text-center">
                  <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                    <input
                      id="dial_input"
                      type="text"
                      value={dialNum}
                      readOnly
                      placeholder="Enter Dial Number..."
                      className="w-full bg-transparent text-xl font-bold font-mono text-center text-emerald-400 py-1 Outline-none focus:outline-none"
                    />
                    <div className="text-[10px] text-slate-500 mt-1 min-h-4">
                      {callingState ? '📞 Note 5 Cellular Link Dialing...' : dialNum ? 'Ready to dial exynos carrier link' : 'Touch pad to generate tones'}
                    </div>
                  </div>

                  {/* Numeric dial Grid */}
                  <div className="grid grid-cols-3 gap-2 text-center text-slate-200">
                    {['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#'].map(btn => (
                      <button
                        key={btn}
                        onClick={() => {
                          if (callingState) return;
                          setDialNum(prev => prev + btn);
                        }}
                        className="h-10 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 flex items-center justify-center text-sm font-extrabold cursor-pointer active:bg-sky-950 font-mono"
                      >
                        {btn}
                      </button>
                    ))}
                  </div>

                  {/* Actions buttons */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => setDialNum('')}
                      disabled={callingState}
                      className="flex-1 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded text-xs cursor-pointer active:scale-95 disabled:opacity-40"
                    >
                      Clear
                    </button>
                    <button
                      onClick={() => {
                        if (callingState) {
                          setCallingState(false);
                        } else if (dialNum) {
                          setCallingState(true);
                        }
                      }}
                      className={`flex-1 py-1.5 font-bold rounded text-xs cursor-pointer active:scale-95 transition ${
                        callingState ? 'bg-red-600 text-white hover:bg-red-500' : 'bg-emerald-600 text-white hover:bg-emerald-505'
                      }`}
                    >
                      {callingState ? 'End Call' : 'Call Link'}
                    </button>
                  </div>
                </div>
              )}

              {/* APP 4: MY FILES BROWSER (includes secure archives and hidden flags) */}
              {activeAppScreen === 'my-files' && (
                <div className="w-full h-full text-left font-mono">
                  <div className="flex justify-between items-center border-b border-slate-800 pb-2 mb-3">
                    <div>
                      <span className="text-[11px] font-bold text-sky-400">root@galaxy_n5plus:/sdcard</span>
                      <p className="text-[9px] text-slate-500">Virtual disk files sector. Toggle Settings hidden option to view secrets.</p>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    {/* Folders display */}
                    <div className="flex items-center gap-3 p-2 bg-slate-900 rounded border border-slate-800 text-xs">
                      <FolderOpen size={14} className="text-amber-400" />
                      <div>
                        <span className="text-slate-200 font-bold">Download /</span>
                        <span className="text-[10px] text-slate-500 block">3 saved items inside</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-2 bg-slate-900 rounded border border-slate-800 text-xs">
                      <FolderOpen size={14} className="text-amber-400" />
                      <div>
                        <span className="text-slate-200 font-bold">DCIM (Photos) /</span>
                        <span className="text-[10px] text-slate-500 block">Camera snapshots log</span>
                      </div>
                    </div>

                    {/* Standard Files */}
                    <div className="flex justify-between items-center p-2 bg-slate-950 border border-slate-900 rounded text-[11px] text-slate-300">
                      <span>• s-note-ideas.txt (24 KB)</span>
                      <span className="text-slate-500">Read/Write</span>
                    </div>

                    {/* Hidden sensitive storage nodes */}
                    {config.showHidden ? (
                      <div className="space-y-1.5">
                        <div className="flex justify-between items-center p-2 bg-purple-950/20 border border-purple-500/30 rounded text-[11px] text-purple-300 animate-pulse">
                          <span>🔒 bitcoin_wallet.dat (124 KB)</span>
                          <span className="text-purple-400 text-[9px] font-bold px-1 bg-purple-950 rounded">HIDDEN CORENODE</span>
                        </div>
                        <div className="flex justify-between items-center p-2 bg-purple-950/20 border border-purple-500/30 rounded text-[11px] text-purple-300">
                          <span>⚙️ root_exploit_n5.sh (12 KB)</span>
                          <span className="text-purple-400 text-[9px] font-bold">SHELL LAUNCHER</span>
                        </div>
                        <div className="flex justify-between items-center p-2 bg-purple-950/20 border border-purple-500/30 rounded text-[11px] text-purple-300">
                          <span>📝 diary_december_2015.txt (4 KB)</span>
                          <span className="text-purple-400 text-[9px] font-bold">SYSTEM DOCS</span>
                        </div>
                      </div>
                    ) : (
                      <div className="p-4 border border-dashed border-slate-800 rounded bg-slate-900/10 text-center text-[10px] text-slate-500">
                        [!] Some system secrets are currently shielded. Adjust Developer/Hidden settings inside Launcher Customization to view.
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* APP 5: CORE TERMUX SHELL AND NEOCLIENT */}
              {activeAppScreen === 'termux' && (
                <div className="w-full h-full text-left font-mono">
                  <div className="p-2 bg-zinc-950 border border-zinc-800 rounded-lg h-[95%] text-xs text-green-400 flex flex-col">
                    <span className="text-[10px] text-zinc-500 mb-1 font-mono">termux-full-node@localhost:~$</span>
                    <pre className="flex-1 bg-black p-2.5 rounded font-mono overflow-y-auto leading-relaxed text-zinc-300 border border-zinc-900">
                      {`Welcome to Note 5+ Termux Terminal Client!
Active Kernel: 3.10.61exynos-Note5-2026
Local Node status: ONLINE

Type commands in the Launcher search widget bar dropdown menu at the top of your screen to execute interactive shell scripts. This screen represents your shell environment logging client.
Supported commands are:
- help       : Show terminal guidelines
- neofetch   : Display galaxy hardware blueprint
- root       : Bypass Knox warranty system flag
- matrix     : Trigger visual digital rain code loop`}
                    </pre>
                  </div>
                </div>
              )}

              {/* APP 6: VNC HOST SIMULATOR */}
              {activeAppScreen === 'vnc-host' && (
                <div className="w-full text-slate-100 flex flex-col gap-2.5 text-left font-sans h-full">
                  {/* Master Status Card */}
                  <div className="bg-slate-900/90 border border-slate-800 p-2.5 rounded-xl flex items-center justify-between shadow-sm">
                    <div>
                      <h4 className="text-[11px] font-bold text-sky-400 flex items-center gap-1">
                        <Network size={11} /> VNC Core Daemon Host
                      </h4>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className={`w-2 h-2 rounded-full ${vncActive ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`} />
                        <span className="text-[9px] text-slate-300 font-mono">vnc://localhost:{vncPort}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setVncActive(!vncActive);
                        const newAction = !vncActive ? `VNC Server STARTED on port ${vncPort}` : 'VNC Server SHUTDOWN by admin';
                        setVncLogs(prev => [newAction, ...prev]);
                      }}
                      className={`px-2.5 py-1 text-[9px] uppercase font-bold rounded cursor-pointer transition ${vncActive ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30' : 'bg-emerald-600 text-white hover:bg-emerald-500'}`}
                    >
                      {vncActive ? 'Stop Daemon' : 'Start Daemon'}
                    </button>
                  </div>

                  {/* Navigation Tabs */}
                  <div className="flex border-b border-slate-800 text-[10px] font-bold shrink-0">
                    <button
                      onClick={() => setVncActiveTab('server')}
                      className={`px-2.5 py-1.5 border-b-2 transition ${vncActiveTab === 'server' ? 'border-sky-400 text-white font-extrabold' : 'border-transparent text-slate-400 hover:text-slate-200'}`}
                    >
                      🖥️ Framebuffer Preview
                    </button>
                    <button
                      onClick={() => setVncActiveTab('clients')}
                      className={`px-2.5 py-1.5 border-b-2 transition ${vncActiveTab === 'clients' ? 'border-sky-400 text-white font-extrabold' : 'border-transparent text-slate-400 hover:text-slate-200'}`}
                    >
                      👥 Viewers ({vncActive ? vncClients.filter(c => c.connected).length : 0})
                    </button>
                    <button
                      onClick={() => setVncActiveTab('logs')}
                      className={`px-2.5 py-1.5 border-b-2 transition ${vncActiveTab === 'logs' ? 'border-sky-400 text-white font-extrabold' : 'border-transparent text-slate-400 hover:text-slate-200'}`}
                    >
                      💻 Server Logs
                    </button>
                  </div>

                  {/* Tab Contents */}
                  <div className="flex-1 overflow-y-auto pr-0.5 space-y-2">
                    {vncActiveTab === 'server' && (
                      <div className="space-y-2">
                        {/* Stream output rendering area */}
                        <div className="bg-slate-950 border border-slate-850 rounded-xl p-2.5 relative overflow-hidden">
                          <div className="flex justify-between items-center text-[8px] font-mono text-slate-500 mb-1.5 border-b border-white/5 pb-1">
                            <span>RAW BROADCAST GRID</span>
                            <span className="text-emerald-400 font-semibold uppercase tracking-wider">
                              {vncActive ? `Compressing (Level ${vncCompress}) • Frames: ${vncFrames}` : 'DISCONNECTED'}
                            </span>
                          </div>

                          <div 
                            className="w-full h-28 rounded-lg relative overflow-hidden bg-slate-900 flex flex-col justify-between p-2 border border-slate-800/60 cursor-crosshair group"
                            onMouseMove={(e) => {
                              const rect = e.currentTarget.getBoundingClientRect();
                              setVncCursor({
                                x: Math.round(e.clientX - rect.left),
                                y: Math.round(e.clientY - rect.top)
                              });
                            }}
                          >
                            <div className="absolute inset-0 bg-[linear-gradient(rgba(18,24,38,0.35)_1px,transparent_1px),linear-gradient(90deg,rgba(18,24,38,0.35)_1px,transparent_1px)] [background-size:10px_10px] pointer-events-none" />
                            
                            {/* Recursive HUD Screen */}
                            <div className="bg-slate-950/90 border border-sky-500/20 rounded p-1 text-[8px] font-mono text-sky-400 z-10 w-full">
                              <div className="flex justify-between font-bold text-white mb-0.5">
                                <span>$ exynos_gpu_capture.bin</span>
                                <span className="animate-pulse">● FEED ACTIVE</span>
                              </div>
                              <p className="text-slate-400">• Broadcaster: {config.deviceModel === 'note10' ? 'SM-N975 Note 10+' : 'SM-N920 Note 5+'}</p>
                              <p className="text-slate-400">• Screen resolution: {config.deviceModel === 'note10' ? '1440 x 3040 WQHD+' : '1440 x 2560 WQHD'}</p>
                            </div>

                            {/* Pointer cursor marker representation */}
                            <div 
                              className="absolute pointer-events-none text-sky-400 shadow-xl"
                              style={{ left: `${vncCursor.x}px`, top: `${vncCursor.y}px` }}
                            >
                              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                                <path stroke="#0284c7" strokeWidth="1.5" d="M4.5 3V17l4.3-4.3 2.5 5.8 2.3-1-2.5-5.8H18.5z" />
                              </svg>
                            </div>

                            <div className="flex justify-between items-end border-t border-white/5 pt-1 mt-auto z-10">
                              <span className="text-[7px] text-white/40 block font-mono">Cursor coordinate: [{vncCursor.x}, {vncCursor.y}]</span>
                              <span className="text-[7px] text-emerald-400 font-bold block bg-emerald-950/80 px-1 rounded">{vncEncryption.split(' ')[0]}</span>
                            </div>
                          </div>
                        </div>

                        {/* Config sliders */}
                        <div className="bg-slate-900 border border-slate-850 p-2.5 rounded-xl space-y-2 text-xs">
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <span className="text-[10px] text-slate-400 block mb-0.5">VNC listening port</span>
                              <select
                                value={vncPort}
                                onChange={(e) => {
                                  const p = parseInt(e.target.value);
                                  setVncPort(p);
                                  setVncLogs(prev => [`VNC server socket bound to port ${p}`, ...prev]);
                                }}
                                className="w-full bg-slate-950 border border-slate-800 text-[10px] p-1.5 rounded outline-none text-slate-300 font-mono"
                              >
                                <option value="5900">5900 (Screen :0)</option>
                                <option value="5901">5901 (Screen :1)</option>
                                <option value="8080">8080 (noVNC WS)</option>
                              </select>
                            </div>
                            <div>
                              <span className="text-[10px] text-slate-400 block mb-0.5">Authorization Password</span>
                              <input
                                type="text"
                                value={vncPassword}
                                onChange={(e) => setVncPassword(e.target.value)}
                                className="w-full bg-slate-950 border border-slate-800 text-[10.5px] p-1 rounded outline-none text-sky-400 font-mono"
                              />
                            </div>
                          </div>

                          <div>
                            <span className="text-[10px] text-slate-400 block mb-0.5">Compression Rate Level</span>
                            <div className="flex items-center gap-2">
                              <span className="text-[9px] text-slate-500">Fast Raw</span>
                              <input
                                id="vnc_compress_slider"
                                type="range"
                                min="1"
                                max="9"
                                value={vncCompress}
                                onChange={(e) => setVncCompress(parseInt(e.target.value))}
                                className="flex-1 h-1 bg-slate-950 rounded cursor-pointer accent-sky-400"
                              />
                              <span className="text-[9px] text-yellow-500 font-bold font-mono">Lv.{vncCompress}</span>
                            </div>
                          </div>

                          {/* Quick encryption selectors */}
                          <div>
                            <span className="text-[10px] text-slate-400 block mb-1">Tunnel Encryption Key Profile:</span>
                            <div className="grid grid-cols-3 gap-1">
                              {['None', 'TightVNC Client-DES', 'TLS-VNC AES255'].map(enc => (
                                <button
                                  key={enc}
                                  onClick={() => {
                                    setVncEncryption(enc);
                                    setVncLogs(prev => [`Switched encryption block to ${enc}`, ...prev]);
                                  }}
                                  className={`py-1 text-[8.5px] font-bold rounded cursor-pointer transition ${vncEncryption === enc ? 'bg-sky-600 text-white' : 'bg-slate-950 text-slate-400 hover:text-white'}`}
                                >
                                  {enc.split(' ')[0]}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {vncActiveTab === 'clients' && (
                      <div className="space-y-1.5">
                        <span className="text-[9px] font-bold uppercase text-slate-500 tracking-wider block mb-1">Connected Users ({vncClients.filter(c => c.connected).length})</span>
                        {vncActive ? (
                          vncClients.map(c => (
                            <div key={c.id} className="bg-slate-900 border border-slate-850 p-2 rounded-xl flex items-center justify-between text-xs">
                              <div className="flex items-center gap-2">
                                <span className={`w-1.5 h-1.5 rounded-full ${c.connected ? 'bg-emerald-400 animate-pulse' : 'bg-slate-600'}`} />
                                <div>
                                  <span className={`font-semibold text-[11px] block ${c.connected ? 'text-slate-200' : 'text-slate-500'}`}>{c.hostname}</span>
                                  <span className="text-[8.5px] font-mono text-slate-500">{c.ip}</span>
                                </div>
                              </div>
                              <button
                                onClick={() => {
                                  setVncClients(prev => prev.map(cli => cli.id === c.id ? { ...cli, connected: !cli.connected } : cli));
                                  setVncLogs(prev => [`System admin ${c.connected ? 'KICKED / SHUTDOWN' : 'ENABLED'} client session ${c.hostname}`, ...prev]);
                                }}
                                className={`text-[8.5px] font-extrabold px-2 py-0.5 rounded cursor-pointer ${c.connected ? 'bg-red-955/40 text-red-400 border border-red-900/40 hover:bg-red-950/80' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
                              >
                                {c.connected ? 'Kick' : 'Reconnect'}
                              </button>
                            </div>
                          ))
                        ) : (
                          <div className="text-center py-8 text-[11px] font-mono text-slate-500">
                            ⚠️ Main VNC Broadcaster core daemon is currently offline. Start the server socket to receive connections.
                          </div>
                        )}
                      </div>
                    )}

                    {vncActiveTab === 'logs' && (
                      <div className="space-y-1.5">
                        <div className="flex justify-between items-center text-[9px] text-slate-500 tracking-wider mb-1 uppercase font-bold">
                          <span>Console Output Logs</span>
                          <button onClick={() => setVncLogs([])} className="text-[8.5px] text-slate-400 hover:text-white capitalize">Clear all</button>
                        </div>
                        <div className="bg-black/90 rounded-lg p-2 font-mono text-[9px] text-zinc-300 h-36 border border-slate-850 overflow-y-auto leading-relaxed space-y-1 scrollbar-none">
                          {vncLogs.map((log, lIdx) => (
                            <div key={lIdx} className="border-b border-white/[0.02] pb-0.5">
                              <span className="text-sky-500 font-extrabold mr-1">&gt;</span>{log}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* APP 7: COMPANION STUDIO */}
              {activeAppScreen === 'companion-studio' && (
                <div className="w-full h-full text-left font-sans">
                  <CompanionStudio
                    companionConfig={companionConfig}
                    setCompanionConfig={setCompanionConfig}
                    onClose={() => setActiveAppScreen(null)}
                  />
                </div>
              )}

              {/* FALLBACK INFO NODE FOR STANDARD IN-APP SCREENS */}
              {activeAppScreen !== 'settings' && activeAppScreen !== 's-note' && activeAppScreen !== 'phone' && activeAppScreen !== 'my-files' && activeAppScreen !== 'termux' && activeAppScreen !== 'vnc-host' && activeAppScreen !== 'companion-studio' && (
                <div className="py-12 px-6 flex flex-col items-center justify-center gap-3">
                   <Info size={32} className="text-sky-400 rotate-180 animate-pulse" />
                  <span className="text-sm font-semibold text-slate-200">
                    Launched: "{activeAppScreen.toUpperCase()}" App Node
                  </span>
                  <p className="text-xs text-slate-400">
                    You have successfully triggered the Android application wrapper. Tap "Exit App" above or swipe modern gestures to return to your customized desktop launcher.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Gesture Back Indicator Flash Overlay */}
        {edgeFlash === 'left' && (
          <div className="absolute left-1 top-1/2 -translate-y-1/2 px-2.5 py-3 bg-sky-500/30 text-sky-400 text-[10px] font-bold rounded-r-2xl border-y border-r border-sky-400/40 z-50 animate-bounce cursor-pointer flex items-center shadow-lg">
            ◀ Back
          </div>
        )}
        {edgeFlash === 'right' && (
          <div className="absolute right-1 top-1/2 -translate-y-1/2 px-2.5 py-3 bg-sky-500/30 text-sky-400 text-[10px] font-bold rounded-l-2xl border-y border-l border-sky-400/40 z-50 animate-bounce cursor-pointer flex items-center shadow-lg">
            Back ▶
          </div>
        )}

        {/* Modern Gesture Navigation Edge-swipe and Pill Overlay */}
        {config.gestureNavigation && (
          <>
            {/* Left Edge swipe action target block */}
            <div 
              onClick={() => {
                handleHardwareBack();
                triggerEdgeFlash('left');
              }}
              className="absolute left-0 top-1/5 bottom-1/5 w-2 hover:w-5 bg-gradient-to-r from-sky-400/10 to-transparent cursor-pointer z-49 flex items-center justify-start group transition-all"
              title="Drag/Click in from left to go Back"
            >
              <div className="h-10 w-0.5 bg-sky-400/50 group-hover:bg-sky-400 rounded-r opacity-0 group-hover:opacity-100 transition-all" />
            </div>

            {/* Right Edge swipe action target block */}
            <div 
              onClick={() => {
                handleHardwareBack();
                triggerEdgeFlash('right');
              }}
              className="absolute right-0 top-1/5 bottom-1/5 w-2 hover:w-5 bg-gradient-to-l from-sky-400/10 to-transparent cursor-pointer z-49 flex items-center justify-end group transition-all"
              title="Drag/Click in from right to go Back"
            >
              <div className="h-10 w-0.5 bg-sky-400/50 group-hover:bg-sky-400 rounded-l opacity-0 group-hover:opacity-100 transition-all" />
            </div>

            {/* Bottom Swiping bar center pill indicator */}
            <div className="absolute bottom-1.5 inset-x-0 h-6 z-49 flex flex-col items-center justify-end pointer-events-none">
              <div 
                onClick={() => {
                  // Home gesture click
                  setActiveAppScreen(null);
                  setActiveFolder(null);
                  setSPenActive(false);
                }}
                onDoubleClick={() => {
                  // Recents action!
                  handleHardwareRecent();
                }}
                className="w-24 h-1 bg-white/75 hover:bg-sky-400 rounded-full cursor-pointer pointer-events-auto hover:h-1.5 active:scale-x-90 hover:shadow-sky-500/30 transition-all shadow-md active:bg-sky-500 mb-0.5"
                title="Sleek gesture navigation: Touch once for HOME, Double-click for RECENTS"
              />
              <span className="text-[6.5px] font-semibold text-white/20 select-none pb-0.5 pointer-events-none uppercase tracking-wide">
                Touch: Home • Double-Tap: Recents
              </span>
            </div>
          </>
        )}

      </div>
    </DeviceFrame>
  );
}
